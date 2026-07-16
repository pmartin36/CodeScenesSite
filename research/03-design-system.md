# CodeFirstGames — Design System (dark, code-forward developer tool)

Research-grounded, buildable design spec. Aesthetic target: near-black canvas, a single
electric "terminal" accent, monospace C# code as the hero visual, hairline borders over
shadows, restrained motion. Peers studied: Linear, Vercel, Warp, Raycast, Railway, Resend, Zed.

All contrast ratios below are computed (WCAG 2.1 relative luminance) against the exact
background hex they sit on. AA = 4.5:1 for normal text, 3:1 for large/UI.

---

## 1. Reference teardown

Concrete observations from the current (2025–2026) sites. Values are what these sites actually ship.

| Site | Background approach | Accent | Heading / Mono font | Hero visual | Rhythm / gradient / borders |
|------|--------------------|--------|--------------------|-------------|-----------------------------|
| **Linear** | Blue-black floor `#08090a`; 4-step surface ladder `#0f1011 → #141516 → #18191a → #191a1b` | Lavender `#5e6ad2`; acid-lime CTA `#e4f222` used sparingly | Inter Variable (custom "Linear" display), negative tracking | GPU gradient backdrops + in-browser product demo | Hairline **0.5px** borders do the work of shadows; card radius 12px, button 6px, pill 9999px |
| **Vercel / Geist** | Pure black-to-white scale; dark base `#000`, panel `#0a0a0a`, elevated `#171717` | Semantic blue `#0070f3`/`#006bff` for links & focus; mostly monochrome | **Geist Sans** + **Geist Mono** (open source) | Interactive globe, code blocks with Geist Mono, tabular figures | Restrained, mono for data; blue reserved for meaning, not decoration |
| **Warp** | *Warm* near-black (charred-wood), not blue-black | **No chromatic accent** — off-white `#faf9f6` on warm dark IS the brand | Matter + Inter 400, hero 64px, tracking `-1.6px` | Product screenshots over cinematic dark photography | Uppercase labels w/ 1.4–2.4px tracking; pill buttons (50px), button bg `#353534` |
| **Raycast** | Almost-black blue-tint `#07080a`; ladder `#07080a → #0d0d0d → #101111` | Raycast Red `#ff6363` (hero stripes only); blue for interactive | Inter with `ss03` stylistic set, positive tracking 0.1–0.4px | Diagonal red-stripe hero, app window screenshots | Tight card radius, hairline 1px borders |
| **Railway** | Deep near-black `#0b0d0e` | Spring/electric green ~`#00e599` energy | Inter / grotesk + mono | Animated deploy canvas, code + logs | Glow gradients behind hero, soft elevation |
| **Resend** | Near-black, very clean | Restrained; monochrome with subtle color in code | Inter-style grotesk + mono | Syntax-highlighted email/code snippet as centerpiece | Generous whitespace, hairline dividers, minimal |
| **Zed** | Dark editor-native surfaces | Blue/monochrome; editor themes | Custom + mono | Live editor UI as hero | Editor-chrome realism, subtle borders |

**Cross-site pattern (what "best-in-class dark dev tool" means in practice):**
- **Not pure `#000`.** A slightly-lifted near-black (`#0a`–`#0b` range) with a faint cool cast; then a 3–4 step surface ladder for elevation.
- **One accent, used as a flashlight** — small, high-contrast, reserved for action/interaction. Never a wash.
- **Borders, not shadows.** Hairline `1px` (Linear runs `0.5px`) at ~6–10% white does the elevation work.
- **Mono is a first-class type role**, not just for `<code>` — used for labels, data, and the hero.
- **Gradient/glow is a backdrop, not a texture** — a single soft radial behind the hero at <15% opacity, fading to the base.
- Tight, consistent radii; negative letter-spacing on large display type.

Sources: Linear brand/redesign notes; Vercel Geist docs (vercel.com/geist); Warp design writeups; Raycast design system; Evil Martians "We studied 100 devtool landing pages" (2025).

---

## 2. Color system (final tokens)

Near-black cool base, 4-step surface ladder, single terminal-green accent. Cyan alt provided.

### Surfaces & structure
| Token | Hex | Use | Contrast note |
|-------|-----|-----|---------------|
| `--bg` | `#0a0b0e` | Page base (near-black, faint cool cast) | — |
| `--surface` | `#121317` | Elevated cards, nav bar, sections | — |
| `--surface-2` | `#16181d` | Raised cards, popovers, hover fills | — |
| `--code-bg` | `#0d1017` | Code panel / terminal background | — |
| `--border` | `#1e2127` | Hairline dividers (1px) | subtle, structural |
| `--border-strong` | `#2a2e37` | Emphasized / focused borders | — |

### Text (on `--bg`)
| Token | Hex | Use | Ratio on `#0a0b0e` |
|-------|-----|-----|--------------------|
| `--text` | `#e7e9ee` | Primary / headings | **16.2:1** AAA |
| `--text-secondary` | `#a4abb8` | Body copy, subheads | **8.52:1** AAA |
| `--text-muted` | `#7a818d` | Captions, meta, labels | **5.02:1** AA |
(Primary on `--surface` = 15.3:1, secondary on `--surface` = 8.0:1 — both pass.)

### Accent — terminal green (recommended)
| Token | Hex | Use | Ratio on `#0a0b0e` |
|-------|-----|-----|--------------------|
| `--accent` | `#34e29b` | Links, active, focus ring, hero glow, highlights | **11.7:1** AAA |
| `--accent-hover` | `#5cf0b4` | Text-link / icon hover (brighten) | **13.7:1** AAA |
| `--accent-active` | `#26c085` | Pressed state / darker fill | 8.9:1 |
| `--accent-ink` | `#052117` | Text/icon ON a solid accent button | ~10:1 on accent |
| `--accent-glow` | `rgba(52,226,155,0.12)` | Hero radial backdrop, no text | decorative |

Accent on `--surface` = **11.05:1**. Solid accent button = `background:#34e29b; color:#052117`.

**Alt accent (cyan)** if green reads too "matrix": `--accent:#22d3ee` (**10.9:1** on bg),
hover `#4fe0f5`, ink `#04222a`. Same token slots — swap one value.

### C# syntax highlighting (on `--code-bg #0d1017`)
Night-Owl/One-Dark-derived, retuned so **every token passes AA at 14px**. The type/class token
is teal to rhyme with the brand accent.

| Token | Hex | Ratio on `#0d1017` |
|-------|-----|--------------------|
| keyword (`public`,`class`,`void`,`using`,`namespace`) | `#c792ea` | 7.9:1 |
| control keyword (`if`,`return`,`await`,`new`) | `#ff7ab6` | 7.9:1 |
| type / class name | `#7ee0c4` | **12.1:1** |
| method / member call | `#82aaff` | 8.3:1 |
| string / char / verbatim | `#addb67` | 11.9:1 |
| number / constant / enum | `#f5c07a` | 11.5:1 |
| identifier / variable / property | `#d7dbe3` | 13.7:1 |
| comment / xmldoc | `#7b8794` | **5.2:1** AA |
| punctuation / operator | `#a4abb8` | ~7:1 |

Diff highlighting inside code panel:
- added line: `background: rgba(52,226,155,0.10)` + `border-left: 2px solid #34e29b`
- removed line: `background: rgba(255,99,99,0.09)` + `border-left: 2px solid #ff6363`
- focus/callout line: `background: rgba(130,170,255,0.08)`

Semantic (sparingly, outside code): success `#34e29b`, warning `#f5c07a`, error `#ff6b6b`, info `#82aaff`.

---

## 3. Typography

**Headings + body:** **Geist Sans** (open, Vercel) — modern geometric grotesk. Fallback/alt: **Inter**.
**Mono / code / labels:** **Geist Mono** (pairs with Geist). Alt: **JetBrains Mono** or **Fira Code**.

```
font-sans: "Geist", "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;
```
Enable `font-feature-settings: "cv01","ss03","calt","liga"` (grotesks) and `"calt","liga"` for mono
(keep Fira ligatures optional). Root = 16px.

### Type scale (root 16px)
| Role | Size | Weight | Line-height | Tracking | Notes |
|------|------|--------|-------------|----------|-------|
| Display / hero H1 | `clamp(2.75rem, 6vw, 4.5rem)` (44–72px) | 600 | 1.05 | `-0.03em` | sans |
| Section H2 | `2.5rem` (40px) | 600 | 1.1 | `-0.02em` | sans |
| Subsection H3 | `1.875rem` (30px) | 600 | 1.15 | `-0.015em` | sans |
| Card / H4 | `1.375rem` (22px) | 600 | 1.25 | `-0.01em` | sans |
| Lead / hero sub | `1.25rem` (20px) | 400 | 1.5 | `0` | `--text-secondary` |
| Body | `1rem` (16px) | 400 | 1.6 | `0` | `--text-secondary` |
| Small | `0.875rem` (14px) | 400 | 1.55 | `0` | meta |
| Eyebrow / label | `0.8125rem` (13px) | 500 | 1.2 | `0.08em` | UPPERCASE, mono, `--accent` or `--text-muted` |
| Code | `0.875rem` (14px) | 400 | 1.6 | `0` | mono, `--code-bg` |
| Code (hero, larger) | `0.9375rem` (15px) | 400 | 1.65 | `0` | mono |

Body max line length ~68–72ch. Uppercase eyebrows in mono are the signature dev-tool tell.

---

## 4. Layout & spacing

- **Container max width:** `1200px` (72rem), horizontal padding `24px` mobile / `40px` desktop.
- **Prose/text column max:** `720px` (centered layout — the pattern that wins across 100 devtool pages).
- **Hero code panel max:** `960px`–`1080px`, centered under the headline.
- **Section vertical rhythm (py):** `128px` desktop / `96px` tablet / `64px` mobile. Hero gets `160px` top.
- **Spacing scale (4px base):** `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160` → tokens `1..11`.
- **Grid:** 12-col with `24px` gutters; feature cards typically 3-up desktop / 1-up mobile.

### Radius
| Token | px | Use |
|-------|----|----|
| `--r-sm` | 6px | buttons, pills-inline, badges |
| `--r-md` | 10px | inputs, small cards |
| `--r-lg` | 14px | feature cards, panels |
| `--r-xl` | 20px | hero code panel, large media |
| `--r-pill` | 9999px | tag/chip, ghost CTA |

### Borders vs shadows
- Default elevation = **hairline border**: `1px solid rgba(255,255,255,0.07)` (`--border`).
- Reserve shadows for the hero panel / floating popovers only, and keep them soft & dark:
  `0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px -20px rgba(0,0,0,0.6)`.
- Focus ring: `0 0 0 2px var(--bg), 0 0 0 4px var(--accent)` (offset ring), plus glow
  `0 0 0 3px rgba(52,226,155,0.25)` on interactive.

### Hero glow / gradient (tasteful)
Layer, all behind content, none above ~15% opacity:
```css
background:
  radial-gradient(60% 50% at 50% 0%, rgba(52,226,155,0.12), transparent 70%),
  radial-gradient(40% 40% at 80% 10%, rgba(130,170,255,0.06), transparent 70%),
  var(--bg);
```
Optional faint texture: dot grid or 1px line grid at `rgba(255,255,255,0.03)`, masked with a
top-fading `mask-image: linear-gradient(#000, transparent)`. End every hero in a soft vignette to
`--bg` so the glow never has a hard edge. One glow source, not three competing ones.

---

## 5. Motion

Restrained, physical, fast. The product is precision tooling — motion should feel engineered.

**Do:**
- Scroll-reveal: `opacity 0→1` + `translateY(12px→0)`, `400–600ms`, `cubic-bezier(0.16,1,0.3,1)` (ease-out-expo), **once** (no replay on scroll-up). Stagger children `60–80ms`.
- Hover/state transitions `150ms ease` on color, border, background, transform.
- Accent "flashlight": subtle glow bloom on hover of primary CTA / interactive code lines.
- Typed/diff reveal in the hero code panel is acceptable if it plays **once**, ≤2s, then rests.
- Buttons: `transform: translateY(-1px)` + brighter border on hover; `scale(0.98)` active.

**Avoid:**
- Scroll-jacking / pinned full-screen scroll takeovers.
- Parallax layers, bouncy spring overshoot, long (>800ms) entrances.
- Anything that animates on every scroll pass, or continuous looping background motion behind text.
- Motion that blocks reading. Honor:
```css
@media (prefers-reduced-motion: reduce){ *{animation:none!important;transition:none!important} }
```

---

## 6. Code-as-hero pattern

The centerpiece is a syntax-highlighted C# panel presented as an editor/terminal window.

**Window chrome**
- Panel: `--code-bg #0d1017`, `--r-xl` (20px), `1px solid rgba(255,255,255,0.08)`, soft shadow (see §4).
- Title bar: height `44px`, `background:#111319`, bottom `1px` border, padding `0 16px`.
- **Mac dots:** three `12px` circles, `8px` gap, left-aligned. Two options:
  - Colored: `#ff5f57 / #febc2e / #28c840` (classic, more playful).
  - **Restrained (recommended):** monochrome `#2a2e37` dots — reads more "tool", less "toy".
- **Filename tab:** active tab shows `SceneBuilder.cs` in **mono 13px**, `--text`, with a `2px`
  bottom accent underline or a subtle lifted `--surface-2` fill + `--r-sm` top corners. Inactive
  tabs `--text-muted`. Optional right-side language pill: `C#` in mono, `--text-muted`,
  `--r-pill`, `1px` border.

**Code body**
- Padding `20px 24px`, mono `15px`, line-height `1.65`.
- **Line-number gutter:** right-aligned, `--text-muted` at ~40% (`#4a5058`), `1px` right border,
  non-selectable.
- Tokens per the §2 syntax palette.

**Diff / line highlight (the "code updates the scene" story)**
- Changed/added lines: full-bleed row tint `rgba(52,226,155,0.10)` + `border-left:2px solid #34e29b`
  + a `+` glyph in the gutter (`--accent`).
- Removed lines: `rgba(255,99,99,0.09)` + `border-left:2px solid #ff6363` + `-` glyph.
- Focus callout line (draw the eye): `rgba(130,170,255,0.08)`, no border.
- Optional: a small floating "chip" label (`--surface-2`, `--r-pill`, mono 12px, accent dot)
  pinned to a highlighted line, e.g. `// synced → Hierarchy`.

**Composition**
- Headline + lead left or centered; the panel sits directly below, `960–1080px` wide, lifted on
  the hero glow. On desktop a split layout (copy left / panel right) also works — keep the panel
  the dominant mass. Panel gets `transform: perspective(1200px) rotateX(2deg)` at most, or none.

---

## Appendix — paste-ready `:root`

```css
:root{
  /* surfaces */
  --bg:#0a0b0e; --surface:#121317; --surface-2:#16181d; --code-bg:#0d1017;
  --border:#1e2127; --border-strong:#2a2e37;
  /* text */
  --text:#e7e9ee; --text-secondary:#a4abb8; --text-muted:#7a818d;
  /* accent (terminal green) */
  --accent:#34e29b; --accent-hover:#5cf0b4; --accent-active:#26c085;
  --accent-ink:#052117; --accent-glow:rgba(52,226,155,0.12);
  /* syntax */
  --syn-keyword:#c792ea; --syn-control:#ff7ab6; --syn-type:#7ee0c4;
  --syn-method:#82aaff; --syn-string:#addb67; --syn-number:#f5c07a;
  --syn-ident:#d7dbe3; --syn-comment:#7b8794; --syn-punc:#a4abb8;
  /* semantic */
  --success:#34e29b; --warning:#f5c07a; --error:#ff6b6b; --info:#82aaff;
  /* type */
  --font-sans:"Geist","Inter",ui-sans-serif,system-ui,sans-serif;
  --font-mono:"Geist Mono","JetBrains Mono",ui-monospace,monospace;
  /* radius */
  --r-sm:6px; --r-md:10px; --r-lg:14px; --r-xl:20px; --r-pill:9999px;
  /* spacing (4px base) */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px; --s-6:32px;
  --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px; --s-11:160px;
  /* layout */
  --container:1200px; --prose:720px; --panel:1040px;
}
```
