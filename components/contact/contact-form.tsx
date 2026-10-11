"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MESSAGE_MAX, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact";
import { CopyEmail } from "./copy-email";

type Status = "idle" | "sending" | "sent" | "error";
const ease = [0.22, 1, 0.36, 1] as const;
const empty: ContactInput = { name: "", email: "", message: "" };

/** Glass "composer" card: name, email, message (0 / 500), inline validation, idle/sending/sent/error. */
export function ContactForm({ email }: { email: string }) {
  const [values, setValues] = useState<ContactInput>(empty);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const errors = { ...validateContact(values), ...serverErrors };
  const visibleError = (field: keyof ContactInput) => (touched[field] ? errors[field] : undefined);

  function update(field: keyof ContactInput, value: string) {
    setValues((v) => ({ ...v, [field]: field === "message" ? value.slice(0, MESSAGE_MAX) : value }));
    setServerErrors((e) => ({ ...e, [field]: undefined }));
    if (status === "error") setStatus("idle");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(validateContact(values)).length) return;

    const company = (new FormData(e.currentTarget).get("company") as string) ?? "";
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerErrors(data.errors ?? {});
        setStatusMessage(data.error ?? "Something went wrong. Please email me directly.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setValues(empty);
      setTouched({});
    } catch {
      setStatusMessage("Network error. Please try again or email me directly.");
      setStatus("error");
    }
  }

  return (
    <div className="glass relative z-10 w-[720px] max-w-full rounded-[24px] p-6 sm:p-8">
      <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-6">
        <span className="font-mono text-[11px] leading-[14px] font-medium uppercase tracking-wider text-secondary">Send a message</span>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] leading-[14px] font-medium tracking-[0.06em] text-secondary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Replies by email
        </span>
      </div>

      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        <form
          noValidate
          onSubmit={onSubmit}
          aria-hidden={status === "sent"}
          inert={status === "sent"}
          className={`space-y-6 transition-[opacity,transform] duration-300 ease-brand ${status === "sent" ? "pointer-events-none -translate-y-2 opacity-0" : "opacity-100"}`}
        >
          {/* Honeypot: hidden from people and assistive tech, tempting to bots */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
            <Field label="Your name" error={visibleError("name")}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                />
              )}
            </Field>
            <Field label="Your email" error={visibleError("email")}>
              {(props) => (
                <input
                  {...props}
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                />
              )}
            </Field>
          </div>

          <Field
            label="What are you working on?"
            error={visibleError("message")}
            counter={
              <span
                className={`font-mono text-[11px] leading-[14px] tracking-[0.06em] tabular-nums transition-colors duration-200 ${
                  values.message.length >= MESSAGE_MAX ? "text-accent" : "text-secondary/80"
                }`}
              >
                {values.message.length} / {MESSAGE_MAX}
              </span>
            }
          >
            {(props) => (
              <textarea
                {...props}
                rows={4}
                maxLength={MESSAGE_MAX}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                className={`${props.className} min-h-[110px] resize-none pr-16`}
              />
            )}
          </Field>

          <div className="flex flex-col-reverse items-stretch gap-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[13px] leading-5 text-secondary">
              <span>or email me directly</span>
              <CopyEmail email={email} />
            </div>
            <SubmitButton status={status} />
          </div>

          <AnimatePresence>
            {status === "error" && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease }}
                className="text-right text-[13px] leading-5 text-accent"
              >
                {statusMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        {/* Sent state replaces the form in place (same grid cell, so the card height holds) */}
        <div
          role="status"
          aria-hidden={status !== "sent"}
          className={`flex flex-col items-center justify-center gap-3 text-center transition-[opacity,transform] duration-300 ease-brand ${
            status === "sent" ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <p className="text-xl leading-7 font-medium tracking-[-0.015em] text-text">Message sent.</p>
          <p className="text-[15px] leading-6 text-secondary">Thanks for reaching out. I’ll reply by email soon.</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-2 font-mono text-xs leading-4 font-medium tracking-[0.04em] text-secondary underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
          >
            Send another
          </button>
        </div>
      </div>
    </div>
  );
}

const fieldClass =
  "w-full border-0 border-b bg-transparent px-1 py-3 text-[15px] leading-6 tracking-[-0.005em] text-text placeholder:text-secondary/70 outline-none transition-colors duration-200 ease-brand focus:border-accent";

function Field({
  label,
  error,
  counter,
  children,
}: {
  label: string;
  error?: string;
  counter?: React.ReactNode;
  children: (props: { id: string; name: string; placeholder: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => React.ReactNode;
}) {
  const id = `contact-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const name = label.includes("email") ? "email" : label.includes("name") ? "name" : "message";
  return (
    <div className="relative flex flex-col pt-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children({
        id,
        name,
        placeholder: label,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${id}-error` : undefined,
        className: `${fieldClass} ${error ? "border-accent/70" : "border-border"}`,
      })}
      {counter && <span className="pointer-events-none absolute right-1 bottom-3">{counter}</span>}
      {/* Error slot: grows open smoothly, so fields below don't jump abruptly */}
      <div className={`grid transition-[grid-template-rows] duration-200 ease-brand ${error ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <p id={`${id}-error`} className="overflow-hidden px-1 pt-1.5 text-xs leading-4 text-accent">
          {error}
        </p>
      </div>
    </div>
  );
}

function SubmitButton({ status }: { status: Status }) {
  const sending = status === "sending";
  return (
    <button
      type="submit"
      disabled={sending}
      className="group flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 sm:py-2.5 text-[13px] leading-5 font-medium text-on-accent shadow-[0_2px_8px_color-mix(in_srgb,var(--accent)_25%,transparent)] transition-[filter,transform,opacity] duration-200 ease-brand hover:brightness-110 active:scale-[0.98] disabled:cursor-progress disabled:opacity-85 dark:font-semibold"
    >
      <span>{sending ? "Sending…" : "Send message"}</span>
      {sending ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      )}
    </button>
  );
}
