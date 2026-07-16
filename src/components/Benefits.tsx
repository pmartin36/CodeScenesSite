import { Reveal } from "./Reveal";
import type { ReactNode } from "react";

type Feature = {
  icon: ReactNode;
  title: string;
  body: ReactNode;
  stat?: ReactNode;
};

const FEATURES: Feature[] = [
  {
    icon: <IconSync />,
    title: "True two-way sync",
    body: (
      <>
        Edit the code or move something in the editor, and the other side updates to
        match, in place. It never wipes and rebuilds, so you can re-run it endlessly
        and every reference, prefab link, and object stays intact.
      </>
    ),
    stat: (
      <>
        Stable identity across every re-run is the part a one-off build script
        can&rsquo;t do. It&rsquo;s the whole point.
      </>
    ),
  },
  {
    icon: <IconCode />,
    title: "AI's native language is code",
    body: (
      <>
        LLMs are fluent in symbolic code. Hand the model the whole scene as one
        readable file it reads and edits in a single pass, not a stream of one-off
        editor commands.
      </>
    ),
    stat: (
      <>
        On spatial-planning benchmarks top models score under 50%, yet ~95–100% on
        symbolic tasks.<Sup n={4} />
      </>
    ),
  },
  {
    icon: <IconCheck />,
    title: "No half-broken scenes",
    body: (
      <>
        An MCP agent mutates the editor one action at a time and can stall
        mid-sequence, leaving a scene half-changed. CodeScenes applies a computed
        plan in place, all at once: it lands cleanly or not at all.
      </>
    ),
    stat: <>And because your scene is C#, invalid output won&rsquo;t even compile.</>,
  },
  {
    icon: <IconLayout />,
    title: "Place things relatively",
    body: (
      <>
        Exact coordinates are where LLMs slip. Layout helpers let the model position
        objects relative to each other, describing intent instead of guessing
        numbers.
      </>
    ),
  },
  {
    icon: <IconGit />,
    title: "Scenes you can diff & review",
    body: (
      <>
        Your scene is clean C# in git: real pull-request diffs, line-by-line
        review, and <span className="icode">git blame</span> that means something.
      </>
    ),
    stat: (
      <>
        You already know the pain of merging a <span className="icode">.unity</span>{" "}
        file. Code diffs like anything else.<Sup n={1} />
      </>
    ),
  },
  {
    icon: <IconTokens />,
    title: "Escape the MCP tax",
    body: (
      <>
        An MCP server holds dozens of tool schemas in context every session and
        round-trips every edit. CodeScenes puts one thing in context: the scene, as
        a file.
      </>
    ),
    stat: (
      <>
        MCP tool schemas can eat the majority of a context window before you type a
        word. One measured setup hit 72%.<Sup n={2} />
      </>
    ),
  },
];

export function Benefits() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="prose-col" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Why code-first</span>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="h2" style={{ marginTop: 16 }}>
              Built for how AI actually works.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead" style={{ marginTop: 16 }}>
              The construction is commodity. The value is the durable, living
              relationship between your code and your scene, and meeting AI in the
              medium it&rsquo;s genuinely good at.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5" style={{ marginTop: 48 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={70 + (i % 3) * 70}>
              <article className="card" style={{ height: "100%" }}>
                <div
                  className="card-icon"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--r-md)",
                    background: "rgba(52,226,155,0.10)",
                    border: "1px solid var(--border-strong)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="card-title">{f.title}</h3>
                <p className="card-body">{f.body}</p>
                {f.stat ? <p className="card-stat">{f.stat}</p> : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sup({ n }: { n: number }) {
  return (
    <a
      href="#sources"
      style={{
        color: "var(--accent)",
        fontSize: "0.7em",
        verticalAlign: "super",
        marginLeft: 2,
      }}
      aria-label={`Source ${n}`}
    >
      [{n}]
    </a>
  );
}

/* ---- icons ---- */
function IconSync() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 8V3.5M20 8h-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 16v4.5M4 16h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5l7.5 3v5c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5v-5l7.5-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.6 12l2.3 2.3 4.5-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLayout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="8" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="7" height="12" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="8" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IconGit() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 8.4v7.2M8.2 7.4A6 6 0 0 1 15.6 9.4M15.6 11.2A6 6 0 0 1 8.4 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconTokens() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9h6M7 12h10M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
