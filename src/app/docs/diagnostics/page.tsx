import type { Metadata } from "next";
import { DocProse } from "@/components/docs/DocProse";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { diagnostics } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Diagnostics · CodeScenes API",
  description:
    "The SB#### codes the CodeScenes analyzer reports in your editor, with the severity and category of each.",
  alternates: { canonical: `${SITE_URL}/docs/diagnostics/` },
};

const CATEGORY_BLURB: Record<string, string> = {
  "CodeScenes.Shape":
    "The builder file must stay a flat sequence of builder calls, because the plugin reads the source rather than running it. These are compile errors.",
  "CodeScenes.Nudge":
    "The call works, but a typed form exists that the compiler can check for you.",
  "CodeScenes.UnityEvent":
    "Persistent listener wiring that Unity would silently drop at runtime.",
};

export default function DiagnosticsPage() {
  const categories = [...new Set(diagnostics.map((d) => d.category))];

  return (
    <>
      <article className="docs-article">
        <span className="eyebrow">Diagnostics</span>
        <h1 className="h2" style={{ marginTop: 18 }}>
          Analyzer codes.
        </h1>
        <p className="lead" style={{ marginTop: 20 }}>
          CodeScenes ships a Roslyn analyzer, so these appear in your IDE as you type
          rather than after a build.
        </p>

        {categories.map((category) => (
          <section key={category} id={slug(category)} style={{ marginTop: 48 }}>
            <h2 className="docs-section-heading" style={{ marginTop: 0 }}>
              {category}
            </h2>
            {CATEGORY_BLURB[category] ? (
              <p style={{ marginTop: 10 }}>{CATEGORY_BLURB[category]}</p>
            ) : null}

            {diagnostics
              .filter((d) => d.category === category)
              .map((diagnostic) => (
                <div key={diagnostic.id} className="docs-member" id={diagnostic.id}>
                  <h3 className="docs-member-name">
                    <a href={`#${diagnostic.id}`} className="docs-anchor">
                      {diagnostic.id}
                    </a>
                    <span className={`docs-severity sev-${diagnostic.severity.toLowerCase()}`}>
                      {diagnostic.severity}
                    </span>
                  </h3>
                  <p className="docs-diagnostic-title">{diagnostic.title}</p>
                  {isTemplate(diagnostic.messageFormat) ? null : (
                    <p className="docs-diagnostic-message">
                      <code className="doc-code">{diagnostic.messageFormat}</code>
                    </p>
                  )}
                  <DocProse nodes={diagnostic.summary} />
                </div>
              ))}
          </section>
        ))}
      </article>

      <div className="docs-toc-col">
        <OnThisPage
          entries={categories.map((c) => ({ id: slug(c), label: c.replace("CodeScenes.", "") }))}
        />
      </div>
    </>
  );
}

/** A message that is only placeholders carries no information without its arguments. */
function isTemplate(message: string): boolean {
  return message.replace(/\{\d+\}/g, "").trim().length === 0;
}

function slug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
