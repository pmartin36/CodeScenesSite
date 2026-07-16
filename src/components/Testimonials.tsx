import { Reveal } from "./Reveal";

// NOTE: intentionally NO invented quotes. These are clearly-marked empty slots for
// real testimonials once early-access users start sharing. Swap each slot's copy
// with a genuine quote + attribution when you have them.
const SLOTS = 3;

export function Testimonials() {
  return (
    <section className="section" style={{ paddingBottom: 32 }}>
      <div className="container">
        <div className="prose-col" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Testimonials</span>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="h2" style={{ marginTop: 16 }}>
              Real words, coming soon.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead" style={{ marginTop: 14 }}>
              Early access is just beginning. When builders start shipping scenes
              with CodeScenes, their words go here.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3" style={{ marginTop: 48 }}>
          {Array.from({ length: SLOTS }).map((_, i) => (
            <Reveal key={i} delay={80 + i * 70}>
              <div
                style={{
                  height: "100%",
                  border: "1px dashed var(--border-strong)",
                  borderRadius: "var(--r-lg)",
                  padding: 28,
                  background: "transparent",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--border-strong)" aria-hidden="true">
                  <path d="M10 7H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2H6v2h4V7Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2h-2v2h4V7Z" />
                </svg>
                <p className="muted" style={{ marginTop: 14, fontStyle: "italic" }}>
                  A real builder&rsquo;s experience will live here.
                </p>
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "9999px",
                      border: "1px dashed var(--border-strong)",
                    }}
                  />
                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                    Name · Studio
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
