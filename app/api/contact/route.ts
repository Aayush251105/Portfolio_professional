import { Resend } from "resend";
import { validateContact, type ContactInput } from "@/lib/contact";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/*
 * POST /api/contact: sends the contact form to CONTACT_TO_EMAIL via Resend.
 * Env: RESEND_API_KEY, CONTACT_TO_EMAIL, optional CONTACT_FROM_EMAIL (a sender on a domain
 * verified in Resend; defaults to Resend's onboarding sender, which only delivers to your own account).
 */

// 5 messages per 10 minutes per IP (best-effort; see lib/rate-limit.ts).
const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Partial<ContactInput> & { company?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill the "company" field. Pretend success to bots.
  if (body.company) return Response.json({ ok: true });

  const input: ContactInput = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    message: String(body.message ?? ""),
  };
  const errors = validateContact(input);
  if (Object.keys(errors).length) return Response.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });

  if (rateLimited(clientIp(request))) {
    return Response.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return Response.json({ error: "Messaging isn’t configured yet. Please email me directly." }, { status: 503 });
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `${message}\n\n— ${name} <${email}>`,
    html: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><p>— ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return Response.json({ error: "Couldn’t send right now. Please email me directly." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
