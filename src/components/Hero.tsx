import { NotifyLink } from "./NotifyLink";
import { GetPluginButton } from "./GetPluginButton";
import { Reveal } from "./Reveal";
import { HeroVideo } from "./HeroVideo";

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
              Collaborate with AI to build your scenes in{" "}
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
              <GetPluginButton source="hero" />
              <div
                className="flex items-center gap-2"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
              >
                <span className="muted">Launching soon</span>
                <span className="muted" aria-hidden="true">
                  ·
                </span>
                <NotifyLink source="hero" className="link-quiet link-quiet-mono" />
              </div>
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
