// The authoring API reference, generated from the C# source by SceneBuilder.DocGen and committed
// as src/content/api.json. Refresh with `npm run api:sync`.
import doc from "@/content/api.json";

export type DocNode = {
  kind:
    | "text"
    | "code"
    | "ref"
    | "link"
    | "paramref"
    | "typeparamref"
    | "strong"
    | "em"
    | "para";
  text: string;
  /** Slug of the target type when a reference resolves inside the documented surface. */
  type?: string;
  /** Anchor of the target member when a reference names one. */
  member?: string;
  href?: string;
};

export type ApiParameter = {
  name: string;
  type: string;
  default?: string;
  modifier?: string;
  summary: DocNode[];
};

export type ApiTypeParam = {
  name: string;
  constraint?: string;
  summary: DocNode[];
};

export type ApiOverload = {
  signature: string;
  returnType?: string;
  parameters: ApiParameter[];
  typeParams: ApiTypeParam[];
  summary: DocNode[];
  remarks: DocNode[];
  returns: DocNode[];
};

export type ApiMember = {
  id: string;
  name: string;
  kind: "method" | "property" | "field" | "constructor" | "event" | "operator" | "indexer";
  isStatic: boolean;
  summary: DocNode[];
  overloads: ApiOverload[];
};

export type ApiEnumValue = { name: string; value?: string; summary: DocNode[] };

export type ApiType = {
  id: string;
  name: string;
  displayName: string;
  kind: "class" | "struct" | "interface" | "record" | "enum";
  signature: string;
  baseType?: string;
  sourcePath: string;
  summary: DocNode[];
  remarks: DocNode[];
  typeParams: ApiTypeParam[];
  members: ApiMember[];
  nestedTypes: ApiType[];
  enumValues: ApiEnumValue[];
};

export type ApiDiagnostic = {
  id: string;
  title: string;
  messageFormat: string;
  category: string;
  severity: "Error" | "Warning" | "Info" | "Hidden";
  summary: DocNode[];
};

export type ApiDocument = {
  assembly: string;
  namespace: string;
  types: ApiType[];
  diagnostics: ApiDiagnostic[];
};

export const api = doc as unknown as ApiDocument;

export const types = api.types;
export const diagnostics = api.diagnostics;

export function typeById(id: string): ApiType | undefined {
  return types.find((t) => t.id === id);
}

export function hrefFor(typeId: string, memberId?: string): string {
  return memberId ? `/docs/api/${typeId}/#${memberId}` : `/docs/api/${typeId}/`;
}

/** Every heading a page renders, in page order, for the on-this-page rail. */
export function outlineFor(type: ApiType): { id: string; label: string }[] {
  const entries = type.members.map((m) => ({ id: m.id, label: m.name }));
  for (const nested of type.nestedTypes) {
    entries.push({ id: nested.id, label: nested.displayName });
  }
  return entries;
}

/** Flat type + member list backing the sidebar filter. */
export function searchIndex(): { typeId: string; typeName: string; memberId?: string; label: string }[] {
  const rows: { typeId: string; typeName: string; memberId?: string; label: string }[] = [];
  for (const type of types) {
    rows.push({ typeId: type.id, typeName: type.displayName, label: type.displayName });
    for (const member of type.members) {
      rows.push({
        typeId: type.id,
        typeName: type.displayName,
        memberId: member.id,
        label: member.name,
      });
    }
  }
  return rows;
}

/** Plain text of a doc run, for meta descriptions and the type index. */
export function plainText(nodes: DocNode[]): string {
  return nodes
    .map((n) => (n.kind === "para" ? " " : n.text))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Plain text clipped at a word boundary. Index rows and meta descriptions want one scannable
 * line; a few summaries run to a full paragraph.
 */
export function clip(nodes: DocNode[], limit = 160): string {
  const text = plainText(nodes);
  if (text.length <= limit) return text;
  const head = text.slice(0, limit);
  return `${head.slice(0, head.lastIndexOf(" "))}…`;
}
