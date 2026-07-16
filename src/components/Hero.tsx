import { Reveal } from "./Reveal";
import { GITHUB_URL } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden" }}>
      <div className="hero-glow" />
      <div className="grid-mask" />

      <div className="container" style={{ paddingTop: 160, paddingBottom: 96 }}>
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
              So stop making it click around one. CodeScenes turns your scene into
              one flat, diffable{" "}
              <span style={{ color: "var(--text)" }}>C# file</span> — the language
              AI is actually fluent in — and keeps your code and the Unity editor
              in seamless{" "}
              <span style={{ color: "var(--text)" }}>two-way sync</span>.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div
              className="flex flex-wrap items-center justify-center gap-3"
              style={{ marginTop: 32 }}
            >
              <a href="#waitlist" className="btn btn-primary">
                Get early access
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                </svg>
                Star on GitHub
              </a>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              style={{ marginTop: 28 }}
            >
              <span className="chip">Unity&nbsp;6</span>
              <span className="chip">C#</span>
              <span className="chip">Works with any AI coding agent</span>
            </div>
          </Reveal>
        </div>

        {/* demo / video placeholder */}
        <Reveal delay={200}>
          <div style={{ maxWidth: "var(--panel)", margin: "56px auto 0" }}>
            <VideoPlaceholder />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function VideoPlaceholder() {
  return (
    <div className="video-frame">
      {/* faint backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(50% 60% at 50% 40%, rgba(52,226,155,0.08), transparent 70%), linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="grid-mask"
        style={{ opacity: 0.6 }}
      />

      {/* center play affordance */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 72,
            height: 72,
            borderRadius: "9999px",
            border: "1px solid var(--border-strong)",
            background: "rgba(52,226,155,0.10)",
            boxShadow: "0 0 40px -8px rgba(52,226,155,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--accent)" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </div>
        <span className="chip" style={{ borderColor: "var(--border-strong)" }}>
          ● &nbsp;90-second demo — coming soon
        </span>
      </div>

      {/* overlaid tagline box */}
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 20,
          margin: "0 auto",
          maxWidth: 560,
          background: "rgba(10,11,14,0.66)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: "18px 20px",
        }}
      >
        <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "1.05rem" }}>
          Ditch Unity MCP.
        </p>
        <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: "0.95rem" }}>
          Collaborate with AI to build Unity scenes in code — not clicks.
        </p>
      </div>
    </div>
  );
}
