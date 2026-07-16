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
                describe it to an AI and get something real back. I tried every
                AI-to-Unity tool I could find, Unity MCP included. None of them
                worked for me.
              </p>
              <p>
                So I rolled my own. That one actually worked — but every game I built
                with it cost thousands of dollars in tokens, because I was burning
                the model&rsquo;s budget making it operate the editor one tool call
                at a time.
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
                That&rsquo;s the whole idea behind CodeScenes. Stop making the AI
                drive the editor one command at a time. Let it write code — the thing
                it&rsquo;s genuinely great at — and keep that code and the live scene
                in sync, both ways, so you never have to choose between them.
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
