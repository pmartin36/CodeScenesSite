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
                While I was working on games at Meta, I set myself a goal: one-shot
                a game. Describe it to an AI, get something real back. So I tried
                every AI-to-Unity tool I could find, Unity MCP included.
              </p>
              <p>
                The Unity MCP solutions couldn&rsquo;t even produce a game. It was
                always a jumbled error-prone mess. So I built my own, and it worked,
                but it cost a fortune in tokens, because I was burning the
                model&rsquo;s budget making it operate the editor one tool call at a
                time.
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
                Unity.&rdquo; I should have been building around AI&rsquo;s
                strengths, not my own.
              </blockquote>

              <p>
                But games are felt, not just assembled, and that last stretch is your eye: 
                nudging a position, tuning a curve, getting the feel right by hand. Those edits
                have to survive, or the tool is worthless the moment the AI&rsquo;s
                next pass overwrites them. So CodeScenes treats what you do in the
                editor as truth too. Your changes flow back into the code, and the AI
                builds on them instead of stepping on them.
              </p>
              <p>
                That&rsquo;s the whole idea behind CodeScenes: let the AI work in
                code, the thing it&rsquo;s genuinely great at, and let you make it
                sing.
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
