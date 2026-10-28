"use client";

import { useEffect, useRef, useState } from "react";

/** Email address that copies itself to the clipboard and briefly reads "Copied". */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard can be blocked (insecure context, permissions): fall back to the mail client.
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy email address"
      className="group inline-flex items-center gap-1.5 font-mono text-sm leading-5 font-medium text-text transition-colors duration-200 ease-brand hover:text-accent-ink"
    >
      {/* Both labels share one grid cell so the button width doesn't jump */}
      <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        <span className={`transition-[opacity,transform] duration-200 ease-brand ${copied ? "-translate-y-1 opacity-0" : "opacity-100"}`}>{email}</span>
        <span
          aria-hidden={!copied}
          className={`text-accent-ink transition-[opacity,transform] duration-200 ease-brand ${copied ? "opacity-100" : "translate-y-1 opacity-0"}`}
        >
          Copied
        </span>
      </span>
      <span className="relative h-[15px] w-[15px]">
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 text-secondary transition-[opacity,transform,color] duration-200 ease-brand group-hover:text-accent ${copied ? "scale-50 opacity-0" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
        >
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 text-accent transition-[opacity,transform] duration-200 ease-brand ${copied ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
