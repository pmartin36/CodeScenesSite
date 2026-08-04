// Drives the exported static site to confirm the API reference actually works in a browser:
// pages render, every generated anchor exists, cross-type links resolve, the sidebar filter
// matches members, and the header still reaches the home page from a docs route.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.env.DOCS_BASE ?? "http://127.0.0.1:4321";
const OUT = process.env.SHOT_DIR ?? null;
const api = JSON.parse(readFileSync("src/content/api.json", "utf8"));

const failures = [];
const check = (ok, label) => {
  if (!ok) failures.push(label);
  console.log(`${ok ? "  ok  " : "FAIL  "}${label}`);
};

// --- no internal notes in published copy ---
// The /// blocks on com.codescenes/Runtime are read by users on the website. Notes written for
// maintainers belong in // comments on the same declaration, where they stay out of api.json.
const INTERNAL = [
  /\bM\d+\)/, // milestone tags
  /\bspecs?\/|\bspec \d/,
  /\bb\d-t\d\b/, // pipeline task ids
  /SceneBuilder\.(Core|Editor|Grammar)\./,
  /PlanExecutor|Materialize's|asmdef/,
  /\bm_Local/,
  /\bMUST\b/,
];

{
  const strings = [];
  const walk = (t) => {
    const push = (where, nodes) =>
      nodes.length &&
      strings.push([where, nodes.map((n) => (n.kind === "para" ? " " : n.text)).join("")]);
    push(t.displayName, t.summary);
    push(t.displayName, t.remarks);
    for (const v of t.enumValues) push(`${t.displayName}.${v.name}`, v.summary);
    for (const m of t.members) {
      for (const o of m.overloads) {
        push(`${t.displayName}.${m.name}`, o.summary);
        push(`${t.displayName}.${m.name}`, o.remarks);
        for (const p of o.parameters) push(`${t.displayName}.${m.name}(${p.name})`, p.summary);
      }
    }
    t.nestedTypes.forEach(walk);
  };
  api.types.forEach(walk);

  const leaked = strings.flatMap(([where, text]) =>
    INTERNAL.filter((re) => re.test(text)).map((re) => `${where} matches ${re}`)
  );
  check(
    leaked.length === 0,
    `no internal notes in ${strings.length} published doc strings${leaked.length ? `:\n        ${leaked.join("\n        ")}` : ""}`
  );
}

// Wide content (signatures, message formats) must scroll inside its own box, never the page.
const noSidewaysScroll = (p) =>
  p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

async function settleScroll(p, tries = 20) {
  let previous = -1;
  for (let i = 0; i < tries; i++) {
    const y = await p.evaluate(() => window.scrollY);
    if (y === previous) return y;
    previous = y;
    await p.waitForTimeout(200);
  }
  return previous;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// --- index ---
await page.goto(`${BASE}/docs/`, { waitUntil: "networkidle" });
check((await page.locator("h1").first().innerText()) === "The authoring surface.", "docs index renders");
check(
  (await page.locator(".docs-index li").count()) === api.types.length,
  `index lists all ${api.types.length} types`
);
check((await page.locator(".docs-sidebar").count()) === 1, "sidebar present");

// --- every type page, every member anchor ---
for (const type of api.types) {
  const url = `${BASE}/docs/api/${type.id}/`;
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  check(response?.status() === 200, `${type.id} responds 200`);

  const heading = await page.locator("h1").first().innerText();
  check(heading === type.displayName, `${type.id} titled "${type.displayName}"`);

  const missing = [];
  for (const member of type.members) {
    if ((await page.locator(`[id="${member.id}"]`).count()) === 0) missing.push(member.id);
  }
  for (const nested of type.nestedTypes) {
    if ((await page.locator(`[id="${nested.id}"]`).count()) === 0) missing.push(nested.id);
  }
  check(missing.length === 0, `${type.id} anchors present${missing.length ? `: missing ${missing}` : ""}`);

  const sigs = await page.locator(".doc-sig pre.shiki").count();
  const expected = 1 + type.members.reduce((n, m) => n + m.overloads.length, 0);
  check(sigs === expected, `${type.id} highlights ${expected} signatures (saw ${sigs})`);

  check(await noSidewaysScroll(page), `${type.id} does not scroll sideways`);

  // The code panel's full-bleed diff rule uses negative inline margins sized to that panel's
  // padding. Applied to a signature block it overhangs, and every block gets a scrollbar it
  // does not need. Signatures must have no inline margin at all.
  const bled = await page.$$eval(".doc-sig .shiki .line", (els) =>
    els.filter((el) => {
      const s = getComputedStyle(el);
      return s.marginLeft !== "0px" || s.marginRight !== "0px";
    }).length
  );
  check(bled === 0, `${type.id} signatures carry no full-bleed margin (${bled} lines)`);
}

// --- a generated cross-type link actually resolves ---
await page.goto(`${BASE}/docs/api/component-handle-1/`, { waitUntil: "networkidle" });
const crossLink = page.locator('a.doc-link[href^="/docs/api/node-handle/"]').first();
check((await crossLink.count()) > 0, "cref rendered as an in-site link");
await crossLink.click();
await page.waitForLoadState("networkidle");
check(page.url().includes("/docs/api/node-handle/"), "cref link navigates to the target type");
const hash = new URL(page.url()).hash.slice(1);
if (hash) {
  const box = await page.locator(`[id="${hash}"]`).boundingBox();
  check(box !== null && box.y >= 0, `landed on #${hash} below the fixed header`);
}

// --- external cref goes to Unity, not a dead in-site link ---
await page.goto(`${BASE}/docs/api/fit-size/`, { waitUntil: "networkidle" });
check(
  (await page.locator('a.doc-link[href*="docs.unity3d.com"]').count()) > 0,
  "unresolved Unity cref links to ScriptReference"
);

// --- sidebar filter matches members, not just pages ---
await page.fill(".docs-filter", "RectTransform");
await page.waitForTimeout(120);
const filtered = await page.locator(".docs-nav-link").allInnerTexts();
check(
  filtered.some((t) => t.startsWith("RectTransform")),
  `filter surfaces the RectTransform member (saw ${filtered.length} rows)`
);

// --- header still reaches home from a docs route ---
await page.goto(`${BASE}/docs/api/node-handle/`, { waitUntil: "networkidle" });
const navHrefs = await page.locator(".site-header nav a").evaluateAll((els) =>
  els.map((e) => e.getAttribute("href"))
);
check(
  navHrefs.every((h) => h && !h.startsWith("#")),
  `header links are rooted, not bare hashes (${navHrefs.join(" ")})`
);
await page.locator('.site-header a[href="/#features"]').first().click();
await page.waitForURL((url) => url.pathname === "/", { timeout: 5000 }).catch(() => {});
check(new URL(page.url()).pathname === "/", `header section link lands on home (${page.url()})`);

// The home page smooth-scrolls and its hero settles late, so the fragment lands over about a
// second. Poll until scrollY stops moving instead of measuring mid-scroll.
await settleScroll(page);
const features = await page.locator("#features").boundingBox();
check(
  features !== null && features.y > 0 && features.y < 200,
  `#features lands under the fixed header (y=${Math.round(features?.y ?? -9999)})`
);

// --- diagnostics ---
await page.goto(`${BASE}/docs/diagnostics/`, { waitUntil: "networkidle" });
const codes = await page.locator(".docs-member").count();
check(codes === api.diagnostics.length, `diagnostics page lists all ${api.diagnostics.length} codes`);

check(await noSidewaysScroll(page), "diagnostics page does not scroll sideways");

// --- mobile: the page's own content must be reachable without scrolling past the nav ---
{
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${BASE}/docs/api/node-handle/`, { waitUntil: "networkidle" });

  const heading = await mobile.locator("h1").first().boundingBox();
  check(
    heading !== null && heading.y < 844,
    `mobile opens on the type heading (y=${Math.round(heading?.y ?? -1)})`
  );
  check(
    (await mobile.locator(".docs-nav-panel").isVisible()) === false,
    "mobile nav starts collapsed"
  );

  await mobile.locator(".docs-nav-toggle").click();
  check(await mobile.locator(".docs-nav-panel").isVisible(), "mobile nav opens on tap");
  check(await noSidewaysScroll(mobile), "mobile type page does not scroll sideways");
  await mobile.close();
}

// --- the text mirror is served ---
for (const path of ["/llms.txt", "/docs/api.md"]) {
  const res = await page.request.get(`${BASE}${path}`);
  check(res.status() === 200 && (await res.text()).length > 500, `${path} served`);
}

if (OUT) {
  await page.goto(`${BASE}/docs/api/node-handle/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/docs-type.png`, fullPage: false });
  await page.screenshot({ path: `${OUT}/docs-type-full.png`, fullPage: true });
  await page.goto(`${BASE}/docs/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/docs-index.png` });
  await page.goto(`${BASE}/docs/diagnostics/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/docs-diagnostics.png` });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${BASE}/docs/api/node-handle/`, { waitUntil: "networkidle" });
  await mobile.screenshot({ path: `${OUT}/docs-mobile.png`, fullPage: false });
}

await browser.close();

console.log(
  failures.length === 0
    ? "\nDOCS PASS: every check green"
    : `\nDOCS FAIL: ${failures.length} check(s)\n  ${failures.join("\n  ")}`
);
process.exit(failures.length === 0 ? 0 : 1);
