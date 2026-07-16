import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden" }}>
      <div className="hero-glow" />
      <div className="grid-mask" />

      <div className="container" style={{ paddingTop: 160, paddingBottom: 8 }}>
        <div className="prose-col" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Code-first Unity scenes · for the AI era</span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="h-display" style={{ marginTop: 20 }}>
              AI can&rsquo;t speak
              <br />
              Unity Editor.
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="lead" style={{ marginTop: 22 }}>
              So stop making it drive the editor one tool call at a time. Ditch Unity
              MCP and collaborate with AI to build your scenes in{" "}
              <span style={{ color: "var(--text)" }}>code</span>{" "}— the language
              it&rsquo;s actually fluent in — with your scene and the editor always in{" "}
              <span style={{ color: "var(--text)" }}>two-way sync</span>.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div
              className="flex flex-col items-center gap-3"
              style={{ marginTop: 32 }}
            >
              <button type="button" className="btn btn-primary is-disabled" aria-disabled="true">
                <span className="soon-dot" aria-hidden="true" />
                Get the plugin
              </button>
              <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                Launching soon
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* wide demo / video placeholder */}
      <Reveal delay={200}>
        <div className="video-band">
          <VideoPlaceholder />
        </div>
      </Reveal>

      <div style={{ height: 96 }} />
    </section>
  );
}

function VideoPlaceholder() {
  return (
    <div className="video-frame video-frame--wide">
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(45% 70% at 50% 45%, rgba(52,226,155,0.09), transparent 70%), linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)",
        }}
      />
      <div aria-hidden="true" className="grid-mask" style={{ opacity: 0.55 }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 76,
            height: 76,
            borderRadius: "9999px",
            border: "1px solid var(--border-strong)",
            background: "rgba(52,226,155,0.10)",
            boxShadow: "0 0 44px -8px rgba(52,226,155,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--accent)" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </div>
        <span className="chip" style={{ borderColor: "var(--border-strong)" }}>
          ● &nbsp;Watch the demo — coming soon
        </span>
      </div>
    </div>
  );
}
