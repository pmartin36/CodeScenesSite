import { hrefFor, type DocNode } from "@/lib/api";

/**
 * Renders a generated documentation run. The generator hands over structured inline nodes rather
 * than HTML, so `<see cref>` becomes a real in-site link and `<c>` becomes real code here.
 */
export function DocProse({
  nodes,
  className = "",
}: {
  nodes: DocNode[];
  className?: string;
}) {
  if (nodes.length === 0) return null;

  const paragraphs: DocNode[][] = [[]];
  for (const node of nodes) {
    if (node.kind === "para") paragraphs.push([]);
    else paragraphs[paragraphs.length - 1].push(node);
  }

  return (
    <div className={`doc-prose ${className}`}>
      {paragraphs
        .filter((p) => p.length > 0)
        .map((paragraph, index) => (
          <p key={index}>
            {paragraph.map((node, i) => (
              <Inline key={i} node={node} />
            ))}
          </p>
        ))}
    </div>
  );
}

function Inline({ node }: { node: DocNode }) {
  switch (node.kind) {
    case "text":
      return <>{node.text}</>;

    case "code":
      return <code className="doc-code">{node.text}</code>;

    case "paramref":
    case "typeparamref":
      return <code className="doc-param">{node.text}</code>;

    case "strong":
      return <strong>{node.text}</strong>;

    case "em":
      return <em>{node.text}</em>;

    case "ref":
      return node.type ? (
        <a className="doc-link" href={hrefFor(node.type, node.member)}>
          {node.text}
        </a>
      ) : (
        <code className="doc-code">{node.text}</code>
      );

    case "link":
      return (
        <a
          className="doc-link"
          href={node.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {node.text}
        </a>
      );

    default:
      return null;
  }
}
