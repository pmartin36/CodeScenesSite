import { Reveal } from "./Reveal";
import type { ReactNode } from "react";

type Row = { label: string; mcp: ReactNode; cfs: ReactNode };

const ROWS: Row[] = [
  {
    label: "The interface",
    mcp: "The AI drives the editor through dozens of granular tool calls, one action at a time.",
    cfs: "The AI edits one readable C# file: the whole scene, in context.",
  },
  {
    label: "Context cost",
    mcp: (
      <>
        ~48 tool schemas held in context every session, before any work begins.
        <Sup n={6} />
      </>
    ),
    cfs: "Just the scene, as code. Budget goes to reasoning, not tool definitions.",
  },
  {
    label: "Failure mode",
    mcp: (
      <>
        Long tool sequences compound errors. A run can stall half-way, mid-mutation.
        <Sup n={5} />
      </>
    ),
    cfs: "An edit compiles atomically. It either applies cleanly or it doesn't. No half-built scene.",
  },
  {
    label: "Version control",
    mcp: (
      <>
        Still wrangling <span className="icode">.unity</span> YAML merges by hand.
        You know the headache.<Sup n={1} />
      </>
    ),
    cfs: "Real git diffs, pull-request review, and blame on your scene.",
  },
  {
    label: "What AI is good at",
    mcp: "Reasoning about a 3D scene through text, the regime LLMs are weakest in.",
    cfs: "Reading and writing symbolic code with explicit coordinates, right where they're strongest.",
  },
  {
    label: "Sync back",
    mcp: "One-way and imperative: the scene is the sum of whatever mutations ran.",
    cfs: "Automatic two-way: editor edits flow back into the code, invisibly.",
  },
];

export function Comparison() {
  return (
    <section className="section" style={{ background: "var(--surface)", borderBlock: "1px solid var(--border)" }}>
      <div className="container">
        <div className="prose-col" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Code-first vs. editor-driving</span>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="h2" style={{ marginTop: 16 }}>
              Why not just point an MCP at Unity?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead" style={{ marginTop: 16 }}>
              Unity MCP servers are a serious, capable way to automate the whole
              editor. But for <em>authoring scenes</em>, making an AI drive the editor
              through a stream of granular tool calls fights the model instead of
              playing to it. We think scenes belong in code.
            </p>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div
            style={{
              marginTop: 48,
              maxWidth: 980,
              marginInline: "auto",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              background: "var(--bg)",
            }}
          >
            {/* header row */}
            <div className="cmp-row cmp-head">
              <div className="cmp-cell cmp-label" />
              <div className="cmp-cell cmp-mcp">
                <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                  Unity MCP · editor-driving
                </span>
              </div>
              <div className="cmp-cell cmp-cfs">
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--accent)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  CodeScenes · code-first
                </span>
              </div>
            </div>

            {ROWS.map((r) => (
              <div className="cmp-row" key={r.label}>
                <div className="cmp-cell cmp-label">{r.label}</div>
                <div className="cmp-cell cmp-mcp">{r.mcp}</div>
                <div className="cmp-cell cmp-cfs">{r.cfs}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p
            className="muted"
            style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", maxWidth: 720, marginInline: "auto" }}
          >
            Context and reliability figures are general findings about MCP tool
            bloat and computer-use agents, not measurements of any specific Unity
            product. Comparison reflects our own view. See{" "}
            <a href="#sources" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
              sources
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Sup({ n }: { n: number }) {
  return (
    <a
      href="#sources"
      style={{ color: "var(--accent)", fontSize: "0.7em", verticalAlign: "super", marginLeft: 2 }}
      aria-label={`Source ${n}`}
    >
      [{n}]
    </a>
  );
}
