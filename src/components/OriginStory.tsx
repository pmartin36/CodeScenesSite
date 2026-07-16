import { Reveal } from "./Reveal";

export function OriginStory() {
  return (
    <section id="origin" className="section">
      <div className="container">
        <div className="prose-col">
          <Reveal>
            <span className="eyebrow" style={{ justifyContent: "flex-start" }}>
              Origin story
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="h2" style={{ marginTop: 16 }}>
              I set out to one-shot a game. It cost a fortune.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="flex flex-col gap-5"
              style={{ marginTop: 24, fontSize: "1.05rem", lineHeight: 1.7 }}
            >
              <p>
                While I was working at Meta, I set myself a goal: one-shot a game —
                describe it to an AI and get something real back. So I tried every
                AI-to-Unity plugin I could find, including Unity MCP. I even rolled
                my own.
              </p>
              <p>
                It worked. But every game I built this way ended up costing the
                company thousands of dollars in tokens — because I was burning the
                model&rsquo;s budget making it fumble through the editor, one tool
                call at a time.
              </p>

              <blockquote
                style={{
                  margin: "8px 0",
                  paddingLeft: 20,
                  borderLeft: "2px solid var(--accent)",
                  color: "var(--text)",
                  fontSize: "1.35rem",
                  lineHeight: 1.45,
                  letterSpacing: "-0.01em",
                  fontWeight: 500,
                }}
              >
                I was fighting the whole system to make AI &ldquo;speak
                Unity.&rdquo; I should have been meeting it in its mother tongue.
              </blockquote>

              <p>
                That&rsquo;s the whole idea behind CodeScenes. Stop translating the
                AI onto a GUI it can&rsquo;t see. Let it write code — the thing
                it&rsquo;s genuinely great at — and keep that code and the live scene
                in sync, both ways, so you never have to choose between them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div
              className="flex items-center gap-3"
              style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)" }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "9999px",
                  background: "rgba(52,226,155,0.12)",
                  border: "1px solid var(--border-strong)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                }}
              >
                P
              </span>
              <div style={{ fontSize: "0.9rem" }}>
                {/* TODO(paul): confirm how you want to be credited here. */}
                <div style={{ color: "var(--text)", fontWeight: 550 }}>Paul</div>
                <div className="muted">Founder, CodeScenes</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
