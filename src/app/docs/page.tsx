import type { Metadata } from "next";
import { CodePanel } from "@/components/CodePanel";
import { api, types, diagnostics, clip } from "@/lib/api";
import { helloScene } from "@/lib/samples";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "API reference · CodeScenes",
  description:
    "The CodeScenes authoring API: every type and member of the SceneBuilder.Authoring surface you write Unity scenes with.",
  alternates: { canonical: `${SITE_URL}/docs/` },
};

export default function DocsIndex() {
  return (
    <>
      <article className="docs-article">
        <span className="eyebrow">API reference</span>
        <h1 className="h2" style={{ marginTop: 18 }}>
          The authoring surface.
        </h1>
        <p className="lead" style={{ marginTop: 20 }}>
          A scene is a C# class implementing <code className="doc-code">ISceneDefinition</code>.
          Everything you can say inside <code className="doc-code">Build</code> is on this page.
        </p>

        <div style={{ marginTop: 32 }}>
          <CodePanel code={helloScene} compact />
        </div>

        <p className="docs-meta" style={{ marginTop: 20 }}>
          Namespace <code className="doc-code">{api.namespace}</code> · assembly{" "}
          <code className="doc-code">{api.assembly}</code> · generated from source
        </p>

        <h2 className="h3" id="types" style={{ marginTop: 56 }}>
          Types
        </h2>
        <ul className="docs-index">
          {types.map((type) => (
            <li key={type.id}>
              <a href={`/docs/api/${type.id}/`} className="docs-index-link">
                <span className="docs-index-name">{type.displayName}</span>
                <span className="docs-index-kind">{type.kind}</span>
              </a>
              <p className="docs-index-summary">{clip(type.summary)}</p>
            </li>
          ))}
        </ul>

        <h2 className="h3" id="diagnostics" style={{ marginTop: 56 }}>
          Diagnostics
        </h2>
        <p style={{ marginTop: 14 }}>
          The analyzer reports {diagnostics.length} codes while you type.{" "}
          <a className="doc-link" href="/docs/diagnostics/">
            See the full table
          </a>
          .
        </p>
      </article>
      <div className="docs-toc-col" />
    </>
  );
}
