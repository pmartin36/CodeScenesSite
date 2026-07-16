const SOURCES: { n: number; text: string; url: string }[] = [
  {
    n: 1,
    text: "Unity Discussions: scene/prefab YAML “cannot be merged reliably”; advice is never to merge them.",
    url: "https://discussions.unity.com/t/unity-scene-merge-conflict-with-git/882150",
  },
  {
    n: 2,
    text: "Unblocked, “MCP Tool Overload”: a measured 3-server setup consumed 143K of 200K tokens (72%) on tool schemas before any input (general MCP, not Unity-specific).",
    url: "https://getunblocked.com/blog/mcp-tool-overload/",
  },
  {
    n: 3,
    text: "MCP spec discussion #2812: per-tool schema overhead (~300–1,000 tokens/tool, paid per session).",
    url: "https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2812",
  },
  {
    n: 4,
    text: "PlanQA (arXiv 2507.07644): LLM geometric-planning/constraint accuracy < 50% across models, vs ~95–100% on symbolic/metric tasks.",
    url: "https://arxiv.org/html/2507.07644v1",
  },
  {
    n: 5,
    text: "The State of Computer-Use Agents (OSWorld / OSWorld 2.0): ~85% on single operations but ~21% on long multi-step workflows (general computer-use).",
    url: "https://medium.com/@adnanmasood/the-hardest-easy-problem-in-ai-the-state-of-computer-use-agents-a7e3aea7fa3a",
  },
  {
    n: 6,
    text: "MCP-for-Unity (CoplayDev) docs: advertises “48 tools across 10 groups” exposed to the model.",
    url: "https://coplaydev.github.io/unity-mcp/",
  },
];

export function Sources() {
  return (
    <section id="sources" className="section" style={{ paddingBlock: 48, background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ maxWidth: 860, marginInline: "auto" }}>
          <span className="eyebrow" style={{ justifyContent: "flex-start" }}>
            Sources
          </span>
          <ol
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              counterReset: "src",
              listStyle: "none",
              padding: 0,
            }}
          >
            {SOURCES.map((s) => (
              <li key={s.n} className="flex gap-3" style={{ fontSize: "0.85rem" }}>
                <span
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    flexShrink: 0,
                  }}
                >
                  [{s.n}]
                </span>
                <span className="muted">
                  {s.text}{" "}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--text-secondary)", textDecoration: "underline", wordBreak: "break-word" }}
                  >
                    {new URL(s.url).hostname.replace("www.", "")}
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
