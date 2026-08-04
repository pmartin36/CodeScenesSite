"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { subscribe } from "@/lib/subscribe";
import { track } from "@/lib/analytics";
import { NOTIFY_PROMISE } from "./NotifyLink";

type State = "idle" | "loading" | "pending" | "subscribed" | "already" | "error";

const SUCCESS_COPY: Record<string, string> = {
  pending:
    "Almost there. Check your inbox and click the confirmation link to finish signing up.",
  subscribed: "You're on the list. You'll hear from me the day the plugin ships.",
  already: "You're already on the list. Nothing more to do.",
};

export function SubscribeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // The input is autofocused on open, so focus says nothing. First keystroke is
  // the real intent signal. NotifyProvider remounts this on every open, so once
  // per instance is once per time the visitor was shown the form.
  const typedOnce = useRef(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (isOpen) {
      if (!el.open) el.showModal();
      inputRef.current?.focus();
      track("subscribe_modal_viewed");
    } else if (el.open) {
      el.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");

    // A filled honeypot is a bot. Keeping those out of the funnel entirely, or
    // every conversion rate on this form is measured against inflated attempts.
    const human = !honeypot;
    if (human) track("subscribe_submitted");

    const result = await subscribe(email, honeypot);
    if (result.ok) {
      if (human) track("subscribe_completed", { state: result.state });
      setState(result.state);
      setEmail("");
    } else {
      if (human) track("subscribe_failed", { message: result.message });
      setState("error");
      setError(result.message);
    }
  }

  const done = state === "pending" || state === "subscribed" || state === "already";

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="notify-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal-panel">
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <span className="eyebrow">Early access</span>
        <h2 id="notify-title" className="h3" style={{ marginTop: 14 }}>
          Get notified when CodeScenes ships.
        </h2>

        {done ? (
          <div className="modal-success" role="status">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>{SUCCESS_COPY[state]}</p>
          </div>
        ) : (
          <>
            <p style={{ marginTop: 12, fontSize: "0.95rem" }}>
              Leave your email. {NOTIFY_PROMISE} No spam, no noise.
            </p>

            <form onSubmit={onSubmit} className="modal-form" noValidate>
              <div className="field-group">
                <label htmlFor="notify-email" className="field-label">
                  Email
                </label>
                <input
                  id="notify-email"
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    if (!typedOnce.current && e.target.value) {
                      typedOnce.current = true;
                      track("subscribe_typing_started");
                    }
                    setEmail(e.target.value);
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="field"
                />
              </div>

              {/* Honeypot: hidden from people, tempting to bots. */}
              <input
                type="text"
                name="company"
                className="hp-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={state === "loading"}
              >
                {state === "loading" ? "Signing up…" : "Notify me"}
              </button>
            </form>

            {state === "error" ? (
              <p className="modal-error" role="alert">
                {error}
              </p>
            ) : null}

            <p className="modal-fineprint">
              Unsubscribe any time. See the{" "}
              <a href="/privacy/" className="link-inline">
                privacy notice
              </a>
              .
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
