import { highlightCSharp } from "@/lib/highlight";

type CodePanelProps = {
  code: string;
  filename?: string;
  diff?: boolean;
  className?: string;
  /** smaller code font for tight columns */
  compact?: boolean;
  /** optional floating chip pinned to the panel */
  chip?: string;
};

/** Async Server Component: syntax-highlights C# at build time inside editor chrome. */
export async function CodePanel({
  code,
  filename = "MainMenu.cs",
  diff = false,
  className = "",
  compact = false,
  chip,
}: CodePanelProps) {
  const html = await highlightCSharp(code, { diff });

  return (
    <div
      className={`code-window ${compact ? "compact" : ""} ${className}`}
      style={{ position: "relative" }}
    >
      <div className="code-titlebar">
        <span className="code-tab">{filename}</span>
        <span className="code-lang">C#</span>
      </div>
      {/* build-time highlighted, trusted content */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {chip ? (
        <span
          className="line-chip"
          style={{ position: "absolute", right: 16, bottom: 16 }}
        >
          {chip}
        </span>
      ) : null}
    </div>
  );
}
