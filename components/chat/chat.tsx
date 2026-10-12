"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { site } from "@/content/site";
import type { ChatAction, ChatEvent } from "@/lib/chat/tools";
import { dispatchSiteAction, scrollToSection } from "@/lib/site-actions";

type Message = { id: string; role: "user" | "assistant"; content: string; actions?: ChatAction[]; error?: boolean; pending?: boolean };

const ease = [0.22, 1, 0.36, 1] as const;
const STORAGE_KEY = "chat-v1";
const INPUT_MAX = 500;
const suggestions = ["What is he working on right now?", "Show me his AI projects", "Is he open to internships?", "Can I see his resume?"];

const uid = () => Math.random().toString(36).slice(2, 10);

/**
 * "Ask about Aayush": a floating glass launcher and a non-modal chat panel. Answers stream from
 * /api/chat; when the assistant takes a site action (scroll, filter, open a project…), it runs on
 * the page and stays under the answer as a chip that can be clicked again.
 */
export function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // The launcher steps aside while a [data-chat-avoid] row (hero links, footer) is near the bottom of the screen.
  const [avoid, setAvoid] = useState(true);
  const reduced = useReducedMotion();
  const isMac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );
  const titleId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore this tab's conversation (sessionStorage can be unavailable; the chat works without it).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from storage after hydration
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    if (busy) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((m) => !m.pending)));
    } catch {}
  }, [messages, busy]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  // ⌘K / Ctrl+K toggles the panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-chat-avoid]");
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setAvoid(visible.size > 0);
      // Only the lower part of the viewport matters: that's where the launcher sits.
    }, { rootMargin: "-60% 0px 0px 0px" });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Keep the newest message in view while it streams.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const runAction = useCallback(
    (action: ChatAction) => {
      if (action.type === "link") return;
      if (action.type === "navigate") scrollToSection(action.section);
      else dispatchSiteAction(action);
      // On phones the panel covers the page: get out of the way so the result is visible.
      if (window.matchMedia("(max-width: 639px)").matches) setTimeout(() => close(false), 350);
    },
    [close],
  );

  const patchLast = (fn: (m: Message) => Message) => setMessages((ms) => ms.map((m, i) => (i === ms.length - 1 ? fn(m) : m)));

  async function ask(raw: string) {
    const question = raw.trim().slice(0, INPUT_MAX);
    if (!question || busy) return;
    const history = [...messages.filter((m) => !m.error), { id: uid(), role: "user" as const, content: question }];
    setMessages([...history, { id: uid(), role: "assistant", content: "", pending: true }]);
    setInput("");
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        patchLast((m) => ({ ...m, content: data.error ?? "Something went wrong. Please try again.", error: true, pending: false }));
        return;
      }

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ChatEvent;
          if (event.type === "text") patchLast((m) => ({ ...m, content: m.content + event.text, pending: false }));
          else if (event.type === "action") {
            patchLast((m) => ({ ...m, actions: [...(m.actions ?? []), event.action] }));
            runAction(event.action);
          } else if (event.type === "error") patchLast((m) => ({ ...m, content: m.content || event.text, error: !m.content, pending: false }));
        }
      }
      patchLast((m) => ({ ...m, pending: false }));
    } catch {
      if (!controller.signal.aborted) {
        patchLast((m) => ({ ...m, content: m.content || "Network error. Please try again.", error: !m.content, pending: false }));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Launcher */}
      <div className="intro-fade fixed right-4 bottom-4 z-[55] sm:right-6 sm:bottom-6">
        <AnimatePresence initial={false}>
          {!open && !avoid && (
            <motion.button
              key="launcher"
              ref={launcherRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              initial={reduced ? false : { opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.3, ease }}
              className="group glass-liquid flex h-12 items-center gap-2.5 rounded-full pr-4 pl-3 text-sm font-medium text-text transition-[border-color,box-shadow,translate] duration-250 ease-brand hover:-translate-y-0.5 hover:border-accent/40! active:translate-y-0"
            >
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-accent-solid text-on-accent transition-transform duration-300 ease-brand group-hover:rotate-12">
                <SparkIcon className="h-3.5 w-3.5" />
              </span>
              <span>
                Ask <span className="hidden sm:inline">about Aayush</span>
              </span>
              <kbd className="ml-1 hidden rounded-md border border-border/80 px-1.5 py-0.5 font-mono text-[10px] leading-3 tracking-wide text-secondary transition-colors duration-200 ease-brand group-hover:text-text md:inline">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                close();
              }
            }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease }}
            style={{ transformOrigin: "bottom right" }}
            className="glass-liquid fixed inset-x-3 bottom-3 z-[55] flex h-[min(560px,calc(100dvh-5.5rem))] flex-col overflow-hidden rounded-[28px] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[min(600px,calc(100dvh-7.5rem))]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-[15px] font-bold tracking-[-0.04em] text-text">
                  A<span className="text-accent">.</span>
                </span>
                <div className="min-w-0">
                  <h2 id={titleId} className="text-[15px] leading-5 font-medium tracking-[-0.01em] text-text">
                    Ask about Aayush
                  </h2>
                  <p className="font-mono text-[10.5px] leading-4 tracking-[0.06em] text-secondary uppercase">Answers from his portfolio</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <IconButton label="Start a new chat" onClick={reset}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4h4" />
                  </IconButton>
                )}
                <IconButton label="Close chat" onClick={() => close()} rotate>
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </IconButton>
              </div>
            </div>

            {/* Conversation */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-busy={busy}
              data-lenis-prevent
              className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-5"
            >
              {messages.length === 0 ? (
                <div className="my-auto">
                  <p className="text-[22px] leading-7 font-medium tracking-[-0.02em] text-text">
                    Hi! Ask me anything about <span className="text-accent">Aayush</span>.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-secondary">His projects, experience, skills or how to reach him. I can also take you around the site.</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="glass-pill rounded-full px-3.5 py-2 text-left text-[13px] leading-4 text-text transition-[border-color,color,translate] duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => <Bubble key={m.id} message={m} onAction={runAction} reduced={!!reduced} />)
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="border-t border-border/60 px-4 pt-3 pb-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface/70 py-1.5 pr-1.5 pl-4 transition-[border-color,box-shadow] duration-200 ease-brand focus-within:border-accent/70 focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]">
                <label htmlFor={`${titleId}-input`} className="sr-only">
                  Your question
                </label>
                <input
                  ref={inputRef}
                  id={`${titleId}-input`}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, INPUT_MAX))}
                  placeholder="Ask a question…"
                  autoComplete="off"
                  enterKeyHint="send"
                  className="min-w-0 flex-1 bg-transparent text-base leading-6 sm:text-[14px] text-text outline-none placeholder:text-secondary focus-visible:outline-none!"
                />
                <button
                  type="submit"
                  aria-label="Send question"
                  disabled={!input.trim() || busy}
                  className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-solid text-on-accent transition-[opacity,transform,background-color] duration-200 ease-brand hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-200 ease-brand group-enabled:group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center font-mono text-[10px] leading-3 tracking-[0.04em] text-secondary">
                AI can make mistakes. Check important details.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ message, onAction, reduced }: { message: Message; onAction: (a: ChatAction) => void; reduced: boolean }) {
  const user = message.role === "user";
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className={`flex max-w-[88%] flex-col gap-2 ${user ? "self-end items-end" : "self-start items-start"}`}
    >
      {user ? (
        <p className="rounded-2xl rounded-br-md bg-text px-3.5 py-2 text-[14px] leading-[1.45] text-bg whitespace-pre-wrap">{message.content}</p>
      ) : message.pending ? (
        <span className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md border border-border/70 bg-surface/80 px-3.5" aria-label="Thinking">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" style={{ animationDelay: `${i * 160}ms` }} />
          ))}
        </span>
      ) : (
        <p
          className={`rounded-2xl rounded-bl-md border px-3.5 py-2 text-[14px] leading-[1.55] whitespace-pre-wrap ${
            message.error ? "border-accent/30 bg-accent/[0.06] text-text" : "border-border/70 bg-surface/80 text-text"
          }`}
        >
          <Linkified text={message.content} />
        </p>
      )}

      {message.actions && message.actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.actions.map((a, i) => (
            <ActionChip key={i} action={a} onAction={onAction} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

const chipClass =
  "group inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/[0.07] px-3 py-1.5 font-mono text-[11px] leading-4 font-medium tracking-[0.04em] text-accent-ink transition-[background-color,border-color,translate] duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent hover:bg-accent/[0.12]";

function ActionChip({ action, onAction }: { action: ChatAction; onAction: (a: ChatAction) => void }) {
  if (action.type === "link") {
    const external = !action.href.startsWith("/") && !action.href.startsWith("mailto:");
    return (
      <a href={action.href} target={action.href.startsWith("mailto:") ? undefined : "_blank"} rel={external ? "noopener noreferrer" : undefined} className={chipClass}>
        {action.label}
        <span aria-hidden className="transition-transform duration-200 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </a>
    );
  }
  return (
    <button type="button" onClick={() => onAction(action)} className={chipClass}>
      <span aria-hidden className="transition-transform duration-200 ease-brand group-hover:translate-x-0.5">
        ↳
      </span>
      {actionLabel(action)}
    </button>
  );
}

function actionLabel(action: Exclude<ChatAction, { type: "link" }>) {
  switch (action.type) {
    case "navigate":
      return `Go to ${action.section.charAt(0).toUpperCase()}${action.section.slice(1)}`;
    case "filter_projects":
      return action.filter === "All" ? "All projects" : `${action.filter === "AI-ML" ? "AI/ML" : "Full-stack"} projects`;
    case "show_project":
      return `Open ${site.projects.items.find((p) => p.id === action.id)?.name ?? "project"}`;
    case "show_certificate":
      return `View ${site.certifications.items.find((c) => c.id === action.id)?.title ?? "certificate"}`;
    case "prefill_contact":
      return "Open drafted message";
  }
}

/** Turns emails and URLs in plain-text answers into links (the text itself is never parsed as HTML). */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/((?:https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])|(?:[\w.+-]+@[\w-]+\.[\w.-]*\w))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
        return (
          <a
            key={i}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="break-words text-accent-ink underline decoration-accent/40 underline-offset-2 transition-colors duration-200 ease-brand hover:decoration-accent"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

function IconButton({ label, onClick, rotate = false, children }: { label: string; onClick: () => void; rotate?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="group flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-[color,background-color,transform] duration-200 ease-brand hover:bg-text/[0.06] hover:text-text active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 transition-transform duration-300 ease-brand ${rotate ? "group-hover:rotate-90" : "group-hover:-rotate-45"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.5l1.9 5.6a3 3 0 0 0 1.9 1.9l5.7 2-5.7 2a3 3 0 0 0-1.9 1.9L12 21.5l-1.9-5.6a3 3 0 0 0-1.9-1.9L2.5 12l5.7-2a3 3 0 0 0 1.9-1.9L12 2.5z" />
    </svg>
  );
}
