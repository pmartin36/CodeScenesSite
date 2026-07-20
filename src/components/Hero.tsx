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
              Ditch Unity MCP solutions and collaborate with AI to build your scenes
              in{" "}
              <span style={{ color: "var(--text)" }}>code</span>, the language
              it&rsquo;s actually fluent in. The AI works in code, you work in the
              editor, and{" "}
              <span style={{ color: "var(--text)" }}>two-way sync</span>{" "}keeps both
              in agreement.
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

      {/* wide demo video */}
      <Reveal delay={200}>
        <div className="video-band">
          <HeroVideo />
        </div>
      </Reveal>

      <div style={{ height: 32 }} />
    </section>
  );
}

function HeroVideo() {
  return (
    <div className="video-frame video-frame--wide">
      <video
        className="video-frame__media video-frame__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-demo-poster.webp"
        aria-label="CodeScenes keeping a C# scene builder and the Unity Editor in two-way sync"
      >
        <source src="/hero-demo.mp4" type="video/mp4" />
      </video>
      <img
        className="video-frame__media video-frame__still"
        src="/hero-demo-poster.webp"
        alt="CodeScenes keeping a C# scene builder and the Unity Editor in two-way sync"
      />
    </div>
  );
}
