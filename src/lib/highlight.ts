import {
  createHighlighter,
  type Highlighter,
  type ThemeRegistration,
} from "shiki";
import { transformerNotationDiff } from "@shikijs/transformers";

// Custom theme tuned to the CodeScenes palette (all tokens AA on --code-bg #0d1017).
const codeScenesTheme: ThemeRegistration = {
  name: "codescenes-dark",
  type: "dark",
  colors: {
    "editor.background": "#0d1017",
    "editor.foreground": "#d7dbe3",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#7b8794", fontStyle: "italic" } },
    { scope: ["string", "string.quoted", "punctuation.definition.string", "constant.character"], settings: { foreground: "#addb67" } },
    { scope: ["constant.numeric", "constant.language", "constant.language.boolean", "constant.language.null"], settings: { foreground: "#f5c07a" } },
    // keywords / storage / modifiers (public, class, void, using, namespace, var, static, int)
    { scope: ["keyword", "keyword.type", "storage", "storage.type", "storage.modifier", "keyword.other"], settings: { foreground: "#c792ea" } },
    // control flow + new/await/return
    { scope: ["keyword.control", "keyword.operator.expression", "keyword.other.new", "keyword.control.flow"], settings: { foreground: "#ff7ab6" } },
    // types / classes / namespaces
    { scope: ["entity.name.type", "entity.name.class", "entity.name.type.class", "support.type", "support.class", "entity.name.namespace", "meta.type"], settings: { foreground: "#7ee0c4" } },
    // method + member calls
    { scope: ["entity.name.function", "meta.method-call entity.name.function", "support.function", "entity.name.function.member"], settings: { foreground: "#82aaff" } },
    // identifiers / variables / properties
    { scope: ["variable", "variable.other", "variable.parameter", "entity.name.variable", "meta.definition.variable"], settings: { foreground: "#d7dbe3" } },
    { scope: ["punctuation", "keyword.operator", "meta.brace"], settings: { foreground: "#a4abb8" } },
  ],
};

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [codeScenesTheme],
      langs: ["csharp"],
    });
  }
  return highlighterPromise;
}

/** Highlight C# to HTML at build time. Pass `diff` for `// [!code --]/++]` markers. */
export async function highlightCSharp(
  code: string,
  { diff = false }: { diff?: boolean } = {}
): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: "csharp",
    theme: "codescenes-dark",
    transformers: diff ? [transformerNotationDiff()] : [],
  });
}
