import { highlightCSharp } from "@/lib/highlight";

/** Async Server Component: a declaration highlighted with the site's C# theme at build time. */
export async function Signature({ code }: { code: string }) {
  const html = await highlightCSharp(code);
  return (
    <div className="doc-sig" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
