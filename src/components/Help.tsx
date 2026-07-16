import { Reveal } from "./Reveal";
import { BLUESKY_HANDLE, BLUESKY_URL, CONTACT_EMAIL } from "@/lib/site";

export function Help() {
  return (
    <section id="help" className="section" style={{ paddingBottom: 48 }}>
      <div className="container">
        <div className="prose-col" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Help &amp; contact</span>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="h2" style={{ marginTop: 16 }}>
              Questions? Come say hi.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead" style={{ marginTop: 14 }}>
              CodeScenes is early and I&rsquo;d love your input on what to build.
              Reach out — I read everything.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2" style={{ marginTop: 40, maxWidth: 720, marginInline: "auto" }}>
          <Reveal delay={80}>
            <a
              href={BLUESKY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4"
              style={{ height: "100%" }}
            >
              <ContactIcon>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 4c2.5 1.9 5.2 5.7 6 7.8.8-2.1 3.5-5.9 6-7.8 1.8-1.3 4-.4 4 2.2 0 .5-.3 4.3-.5 4.9-.6 2.2-2.9 2.8-4.9 2.4 3.5.6 4.4 2.6 2.5 4.6-3.6 3.8-5.2-1-5.6-2.2-.1-.2-.1-.3-.1-.2 0-.1 0 0-.1.2-.4 1.2-2 6-5.6 2.2-1.9-2-1-4 2.5-4.6-2 .4-4.3-.2-4.9-2.4C2 10.5 1.7 6.7 1.7 6.2c0-2.6 2.2-3.5 4-2.2Z" transform="translate(1 1) scale(0.92)" />
                </svg>
              </ContactIcon>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "var(--text)", fontWeight: 550 }}>Bluesky</div>
                <div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                  {BLUESKY_HANDLE}
                </div>
              </div>
            </a>
          </Reveal>

          <Reveal delay={140}>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="card flex items-center gap-4"
              style={{ height: "100%" }}
            >
              <ContactIcon>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ContactIcon>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "var(--text)", fontWeight: 550 }}>Email</div>
                <div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                  {CONTACT_EMAIL}
                </div>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: "var(--r-md)",
        background: "rgba(52,226,155,0.10)",
        border: "1px solid var(--border-strong)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--accent)",
      }}
    >
      {children}
    </span>
  );
}
