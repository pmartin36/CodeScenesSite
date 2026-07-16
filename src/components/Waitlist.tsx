"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { WAITLIST_ENDPOINT } from "@/lib/site";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");

    // TODO(paul): wire WAITLIST_ENDPOINT to a real provider (Buttondown / ConvertKit
    // / a Cloudflare Pages Function). Until then we just confirm locally — no address
    // is stored anywhere.
    try {
      if (WAITLIST_ENDPOINT) {
        const res = await fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("bad status");
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="waitlist" className="section">
      <div className="container">
        <Reveal>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              maxWidth: "var(--panel)",
              marginInline: "auto",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-xl)",
              padding: "56px 32px",
              textAlign: "center",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                background:
                  "radial-gradient(50% 80% at 50% 0%, rgba(52,226,155,0.10), transparent 70%)",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="eyebrow">Early access</span>
              <h2 className="h2" style={{ marginTop: 16 }}>
                Be first when CodeScenes ships.
              </h2>
              <p className="lead" style={{ marginTop: 14, maxWidth: 560, marginInline: "auto" }}>
                It&rsquo;s in active development. Leave your email and you&rsquo;ll
                get the demo, launch news, and an early look at the plugin. No spam,
                no noise.
              </p>

              {state === "done" ? (
                <div
                  role="status"
                  style={{
                    marginTop: 28,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    color: "var(--accent)",
                    fontWeight: 550,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  You&rsquo;re on the list. Talk soon.
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                  style={{ marginTop: 28, maxWidth: 480, marginInline: "auto" }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.com"
                    aria-label="Email address"
                    style={{
                      flex: 1,
                      width: "100%",
                      height: 46,
                      padding: "0 16px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--bg)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.95rem",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: 46, width: "100%", maxWidth: 180 }}
                    disabled={state === "loading"}
                  >
                    {state === "loading" ? "Joining…" : "Get early access"}
                  </button>
                </form>
              )}

              {state === "error" ? (
                <p style={{ marginTop: 12, color: "var(--error)", fontSize: "0.85rem" }}>
                  Something went wrong. Please try again.
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
