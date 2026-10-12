import { buildSystemPrompt } from "@/lib/chat/knowledge";
import { confirmation, toAction, tools, type ChatAction, type ChatEvent } from "@/lib/chat/tools";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { site } from "@/content/site";

/*
 * POST /api/chat: the portfolio assistant. Streams NDJSON ChatEvents (see lib/chat/tools.ts).
 * One Groq request per question: if the model only calls tools, the reply text is a canned
 * confirmation rather than a second round trip. Env: GROQ_API_KEY, optional GROQ_MODELS
 * (comma-separated fallback order).
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
/**
 * Tried in order. On Groq's free tier each model has its own ~8K tokens/minute budget, so when one
 * is rate-limited (429) the next one answers instead.
 */
const MODELS = (process.env.GROQ_MODELS || "openai/gpt-oss-120b,qwen/qwen3.8-27b,openai/gpt-oss-20b")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);
const MAX_TURNS = 8; // history sent to the model
const MAX_USER_CHARS = 500;
const MAX_ASSISTANT_CHARS = 1200;

const BUSY = `I'm getting a lot of questions right now. Please try again in a minute, or email Aayush at ${site.links.email}.`;

// 20 questions per 10 minutes per IP (best-effort; see lib/rate-limit.ts).
const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

type Turn = { role: "user" | "assistant"; content: string };

function sanitize(body: unknown): Turn[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || !messages.length) return null;
  const turns = messages
    .filter((m): m is Turn => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string" && m.content.trim() !== "")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, m.role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS) }));
  return turns.at(-1)?.role === "user" ? turns : null;
}

export async function POST(request: Request) {
  let turns: Turn[] | null;
  try {
    turns = sanitize(await request.json());
  } catch {
    turns = null;
  }
  if (!turns) return Response.json({ error: "Invalid request." }, { status: 400 });

  if (rateLimited(clientIp(request))) {
    return Response.json({ error: "You're asking quickly! Give it a few minutes, or email Aayush directly." }, { status: 429 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[chat] GROQ_API_KEY is not set");
    return Response.json({ error: "The assistant isn't set up yet. Please email Aayush directly." }, { status: 503 });
  }

  const messages = [{ role: "system", content: buildSystemPrompt() }, ...turns];
  let upstream: Response | null = null;
  for (const model of MODELS) {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        tools,
        tool_choice: "auto",
        stream: true,
        temperature: 0.4,
        max_completion_tokens: 450,
        // Keep reasoning short and out of the stream.
        ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low", include_reasoning: false } : { reasoning_format: "hidden" }),
      }),
      signal: request.signal,
    }).catch((err) => {
      console.error(`[chat] ${model} request failed:`, err);
      return null;
    });
    if (upstream?.ok) {
      if (process.env.NODE_ENV !== "production") console.info(`[chat] answering with ${model}`);
      break;
    }
    if (upstream) console.error(`[chat] ${model} error`, upstream.status, (await upstream.text().catch(() => "")).slice(0, 300));
    if (upstream?.status !== 429 && upstream?.status !== 503) break; // only fall through when the model is busy
  }

  if (!upstream?.ok || !upstream.body) {
    const busy = upstream?.status === 429 || upstream?.status === 503;
    return Response.json({ error: busy ? BUSY : "The assistant is unavailable right now. Please email Aayush directly." }, { status: busy ? 429 : 502 });
  }

  const encoder = new TextEncoder();
  const body = upstream.body;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: ChatEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      const calls: { name: string; args: string }[] = [];
      let wroteText = false;

      try {
        const reader = body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            const delta = JSON.parse(data).choices?.[0]?.delta;
            if (!delta) continue;
            if (typeof delta.content === "string" && delta.content) {
              wroteText = true;
              send({ type: "text", text: delta.content });
            }
            // Tool calls can arrive whole or in pieces keyed by index; accumulate either way.
            for (const tc of delta.tool_calls ?? []) {
              const slot = (calls[tc.index ?? calls.length] ??= { name: "", args: "" });
              if (tc.function?.name) slot.name += tc.function.name;
              if (tc.function?.arguments) slot.args += tc.function.arguments;
            }
          }
        }

        const actions = calls.map((c) => toAction(c.name, c.args)).filter((a): a is ChatAction => a !== null);
        if (!wroteText) {
          send({ type: "text", text: actions.length ? confirmation(actions[0]) : "Sorry, I didn't catch that. Could you rephrase?" });
        }
        for (const action of actions) send({ type: "action", action });
      } catch (err) {
        if (!request.signal.aborted) {
          console.error("[chat] stream error:", err);
          send({ type: "error", text: "The answer was cut off. Please try again." });
        }
      } finally {
        if (!request.signal.aborted) send({ type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
