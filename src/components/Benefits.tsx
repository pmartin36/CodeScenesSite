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
        Edit the code and the scene updates. Move something in the editor and the
        code updates. It&rsquo;s invisible and automatic — you never press a
        button, and you&rsquo;re never trapped on one side.
      </>
    ),
    stat: <>The sync engine is the whole point — stable identity, reconciled in place.</>,
  },
  {
    icon: <IconCode />,
    title: "AI speaks code, not clicks",
    body: (
      <>
        LLMs are fluent in C# and clumsy with a GUI. Give the model the whole scene
        as code it can read and edit — instead of making it drive a 3D editor
        through tool calls it can&rsquo;t see.
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
    icon: <IconGit />,
    title: "Scenes you can diff & review",
    body: (
      <>
        Your scene is clean C# in git — real pull-request diffs, line-by-line
        review, and <span className="icode">git blame</span> that means something.
        Not a wall of YAML nobody can read.
      </>
    ),
    stat: (
      <>
        Unity&rsquo;s own community consensus: <span className="icode">.unity</span>{" "}
        files &ldquo;cannot be merged reliably.&rdquo;<Sup n={1} />
      </>
    ),
  },
  {
    icon: <IconTokens />,
    title: "Escape the MCP tax",
    body: (
      <>
        An MCP server injects dozens of tool schemas into context every session and
        round-trips every edit. CodeScenes puts one thing in context: the scene, as
        a file. More budget for reasoning, better results.
      </>
    ),
    stat: (
      <>
        MCP tool schemas can eat the majority of a context window before you type a
        word — 72% in one measured setup.<Sup n={2} />
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
              relationship between your code and your scene — and meeting AI in the
              medium it&rsquo;s genuinely good at.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-2" style={{ marginTop: 56 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} className="reveal" delay={80 + i * 70}>
              <article className="card" style={{ height: "100%" }}>
                <div
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
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="h3" style={{ marginTop: 20, fontSize: "1.25rem" }}>
                  {f.title}
                </h3>
                <p style={{ marginTop: 10 }}>{f.body}</p>
                {f.stat ? (
                  <p
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px solid var(--border)",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {f.stat}
                  </p>
                ) : null}
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
