import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocProse } from "@/components/docs/DocProse";
import { Signature } from "@/components/docs/Signature";
import { OnThisPage } from "@/components/docs/OnThisPage";
import {
  outlineFor,
  clip,
  typeById,
  types,
  type ApiMember,
  type ApiOverload,
  type ApiType,
  type ApiTypeParam,
} from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return types.map((type) => ({ type: type.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type: id } = await params;
  const type = typeById(id);
  if (!type) return {};

  return {
    title: `${type.displayName} · CodeScenes API`,
    description: clip(type.summary, 180),
    alternates: { canonical: `${SITE_URL}/docs/api/${type.id}/` },
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: id } = await params;
  const type = typeById(id);
  if (!type) notFound();

  return (
    <>
      <article className="docs-article">
        <span className="eyebrow">{type.kind}</span>
        <h1 className="h2" style={{ marginTop: 18 }}>
          {type.displayName}
        </h1>

        <DocProse nodes={type.summary} className="doc-lead" />

        <div style={{ marginTop: 24 }}>
          <Signature code={type.signature} />
        </div>

        {type.typeParams.length > 0 ? (
          <TypeParams params={type.typeParams} />
        ) : null}

        {type.remarks.length > 0 ? (
          <div className="doc-remarks">
            <DocProse nodes={type.remarks} />
          </div>
        ) : null}

        {type.enumValues.length > 0 ? <EnumTable type={type} /> : null}

        {type.members.length > 0 ? (
          <section>
            <h2 className="docs-section-heading">Members</h2>
            {type.members.map((member) => (
              <MemberSection key={member.id} member={member} />
            ))}
          </section>
        ) : null}

        {type.nestedTypes.length > 0 ? (
          <section>
            <h2 className="docs-section-heading">Nested types</h2>
            {type.nestedTypes.map((nested) => (
              <div key={nested.id} className="docs-member" id={nested.id}>
                <h3 className="docs-member-name">
                  <a href={`#${nested.id}`} className="docs-anchor">
                    {nested.displayName}
                  </a>
                  <span className="docs-member-kind">{nested.kind}</span>
                </h3>
                <DocProse nodes={nested.summary} />
                {nested.enumValues.length > 0 ? <EnumTable type={nested} /> : null}
              </div>
            ))}
          </section>
        ) : null}

        <p className="docs-meta" style={{ marginTop: 56 }}>
          Generated from <code className="doc-code">{type.sourcePath}</code>
        </p>
      </article>

      <div className="docs-toc-col">
        <OnThisPage entries={outlineFor(type)} />
      </div>
    </>
  );
}

function MemberSection({ member }: { member: ApiMember }) {
  return (
    <div className="docs-member" id={member.id}>
      <h3 className="docs-member-name">
        <a href={`#${member.id}`} className="docs-anchor">
          {member.name}
        </a>
        {member.isStatic ? <span className="docs-member-kind">static</span> : null}
        <span className="docs-member-kind">{member.kind}</span>
        {member.overloads.length > 1 ? (
          <span className="docs-member-kind">{member.overloads.length} overloads</span>
        ) : null}
      </h3>

      {member.overloads.map((overload, index) => (
        <Overload key={index} overload={overload} />
      ))}
    </div>
  );
}

function Overload({ overload }: { overload: ApiOverload }) {
  const documented = overload.parameters.filter((p) => p.summary.length > 0);

  return (
    <div className="docs-overload">
      <Signature code={overload.signature} />
      <DocProse nodes={overload.summary} />

      {documented.length > 0 ? (
        <dl className="docs-params">
          {documented.map((parameter) => (
            <div key={parameter.name}>
              <dt>
                <code className="doc-param">{parameter.name}</code>
              </dt>
              <dd>
                <DocProse nodes={parameter.summary} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {overload.typeParams.some((p) => p.summary.length > 0) ? (
        <TypeParams params={overload.typeParams.filter((p) => p.summary.length > 0)} />
      ) : null}

      {overload.returns.length > 0 ? (
        <div className="docs-returns">
          <span className="docs-label">Returns</span>
          <DocProse nodes={overload.returns} />
        </div>
      ) : null}

      {overload.remarks.length > 0 ? (
        <div className="doc-remarks">
          <DocProse nodes={overload.remarks} />
        </div>
      ) : null}
    </div>
  );
}

function TypeParams({ params }: { params: ApiTypeParam[] }) {
  return (
    <dl className="docs-params">
      {params.map((parameter) => (
        <div key={parameter.name}>
          <dt>
            <code className="doc-param">{parameter.name}</code>
          </dt>
          <dd>
            <DocProse nodes={parameter.summary} />
            {parameter.constraint ? (
              <p className="docs-meta">
                Constrained to <code className="doc-code">{parameter.constraint}</code>
              </p>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function EnumTable({ type }: { type: ApiType }) {
  return (
    <div className="docs-enum">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {type.enumValues.map((value) => (
            <tr key={value.name}>
              <td>
                <code className="doc-code">{value.name}</code>
              </td>
              <td>
                <DocProse nodes={value.summary} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
