import { CodePanel } from "./CodePanel";
import { Reveal } from "./Reveal";
import { heroScene, syncDiff } from "@/lib/samples";

export async function HowItWorks() {
  return (
    <section id="how" className="section">
      <div className="container">
        <div className="prose-col" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Your scene, as code</span>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="h2" style={{ marginTop: 16 }}>
              The whole scene fits in one file.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead" style={{ marginTop: 16 }}>
              Not a wall of YAML. A flat, readable C# builder your AI can generate,
              validate, refactor, and sanity-check in one pass. A real compiler
              guarantees it&rsquo;s a valid scene, and you can diff, review, and merge
              it like any other code.
            </p>
          </Reveal>
        </div>

        <div
          className="grid gap-6 md:grid-cols-12"
          style={{ marginTop: 56, alignItems: "start" }}
        >
          <Reveal className="md:col-span-7" delay={80}>
            <CodePanel code={heroScene} filename="MainMenu.cs" />
          </Reveal>

          <Reveal className="md:col-span-5" delay={160}>
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="h3">Edit either side. Never out of sync.</h3>
                <p style={{ marginTop: 10 }}>
                  Drag <span className="icode">Player</span> somewhere in the Scene
                  view and save. Your file rewrites itself to match, updating the
                  right line in place.
                </p>
              </div>

              <div>
                <CodePanel code={syncDiff} filename="MainMenu.cs" diff compact />
                <p
                  className="muted"
                  style={{ marginTop: 8, fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}
                >
                  ↳ synced automatically from the editor
                </p>
              </div>

              <ul className="flex flex-col gap-3" style={{ marginTop: 4 }}>
                <SyncStep dir="code → scene" label="Change the code, the scene updates." />
                <SyncStep dir="scene → code" label="Move something in the editor, the code updates." />
                <SyncStep dir="in sync" label="Every object keeps a stable identity, so a rebuild never wipes your scene." />
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SyncStep({ dir, label }: { dir: string; label: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="chip"
        style={{ flexShrink: 0, marginTop: 1, color: "var(--accent)", borderColor: "var(--border-strong)" }}
      >
        {dir}
      </span>
      <span style={{ fontSize: "0.95rem" }}>{label}</span>
    </li>
  );
}
