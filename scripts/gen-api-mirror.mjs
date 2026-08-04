// Emits the plain-text mirror of the API reference into public/:
//
//   public/docs/api.md  — the whole authoring surface as one markdown file
//   public/llms.txt     — the llms.txt index pointing at it
//
// The product's pitch is that an AI writes your scenes in C#, so the reference has to be
// fetchable as text, not only as a rendered page. Runs from `prebuild`, so a stale api.json
// is the only way these can drift.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const api = JSON.parse(readFileSync(resolve(root, "src/content/api.json"), "utf8"));

const siteSource = readFileSync(resolve(root, "src/lib/site.ts"), "utf8");
const SITE_URL = siteSource.match(/SITE_URL\s*=\s*"([^"]+)"/)?.[1] ?? "https://codescenes.dev";

function inline(nodes) {
  let out = "";
  for (const node of nodes) {
    switch (node.kind) {
      case "text":
        out += node.text;
        break;
      case "code":
      case "paramref":
      case "typeparamref":
        out += `\`${node.text}\``;
        break;
      case "strong":
        out += `**${node.text}**`;
        break;
      case "em":
        out += `*${node.text}*`;
        break;
      case "ref": {
        const anchor = node.member ? `#${node.member}` : "";
        out += `[${node.text}](${SITE_URL}/docs/api/${node.type}/${anchor})`;
        break;
      }
      case "link":
        out += `[${node.text}](${node.href})`;
        break;
      case "para":
        out += "\n\n";
        break;
    }
  }
  return out.replace(/[ \t]+\n/g, "\n").trim();
}

function block(nodes, prefix = "") {
  const text = inline(nodes);
  return text ? `\n${prefix}${text}\n` : "";
}

const lines = [];
lines.push("# CodeScenes authoring API");
lines.push("");
lines.push(
  `Every type and member you can use inside \`ISceneDefinition.Build\`. Namespace \`${api.namespace}\`, assembly \`${api.assembly}\`. Generated from the C# source.`
);
lines.push("");
lines.push(`Rendered version: ${SITE_URL}/docs/`);

for (const type of api.types) {
  lines.push("");
  lines.push(`## ${type.displayName}`);
  lines.push("");
  lines.push("```csharp");
  lines.push(type.signature);
  lines.push("```");
  lines.push(block(type.summary));
  if (type.remarks.length) lines.push(block(type.remarks, "Note: "));

  for (const value of type.enumValues) {
    lines.push(`- \`${value.name}\` — ${inline(value.summary) || "(no description)"}`);
  }

  for (const member of type.members) {
    lines.push("");
    lines.push(`### ${type.displayName}.${member.name}`);
    for (const overload of member.overloads) {
      lines.push("");
      lines.push("```csharp");
      lines.push(overload.signature);
      lines.push("```");
      lines.push(block(overload.summary));
      for (const parameter of overload.parameters) {
        if (parameter.summary.length) {
          lines.push(`- \`${parameter.name}\` — ${inline(parameter.summary)}`);
        }
      }
      if (overload.returns.length) lines.push(block(overload.returns, "Returns: "));
      if (overload.remarks.length) lines.push(block(overload.remarks, "Note: "));
    }
  }

  for (const nested of type.nestedTypes) {
    lines.push("");
    lines.push(`### ${type.displayName}.${nested.displayName}`);
    lines.push(block(nested.summary));
    for (const value of nested.enumValues) {
      lines.push(`- \`${value.name}\` — ${inline(value.summary) || "(no description)"}`);
    }
  }
}

lines.push("");
lines.push("## Diagnostics");
lines.push("");
lines.push("| Code | Severity | Category | Title |");
lines.push("| --- | --- | --- | --- |");
for (const diagnostic of api.diagnostics) {
  lines.push(
    `| ${diagnostic.id} | ${diagnostic.severity} | ${diagnostic.category} | ${diagnostic.title} |`
  );
}

const markdown = lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";

// llms.txt entries are one line each, so descriptions are plain text clipped at a word
// boundary. Sentence-splitting is wrong here: the summaries are full of "e.g." and "i.e.".
function blurb(nodes, limit = 150) {
  const text = nodes
    .map((n) => (n.kind === "para" ? " " : n.text))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit);
  return clipped.slice(0, clipped.lastIndexOf(" ")) + "…";
}

const index = [
  "# CodeScenes",
  "",
  "> Build Unity scenes in code. A scene becomes one flat, diffable C# file, and CodeScenes keeps the file and the editor in automatic two-way sync.",
  "",
  "## Docs",
  "",
  `- [Authoring API reference](${SITE_URL}/docs/api.md): every type and member of the SceneBuilder.Authoring surface, plus the analyzer diagnostic table`,
  ...api.types.map(
    (type) => `- [${type.displayName}](${SITE_URL}/docs/api/${type.id}/): ${blurb(type.summary)}`
  ),
  "",
  "## Optional",
  "",
  `- [Diagnostics](${SITE_URL}/docs/diagnostics/): the SB#### codes the analyzer reports as you type`,
  `- [Privacy](${SITE_URL}/privacy/): what the site collects`,
  "",
].join("\n");

mkdirSync(resolve(root, "public/docs"), { recursive: true });
writeFileSync(resolve(root, "public/docs/api.md"), markdown);
writeFileSync(resolve(root, "public/llms.txt"), index);

console.log(
  `api.md: ${api.types.length} types, ${markdown.length} bytes · llms.txt: ${api.types.length + 3} links`
);
