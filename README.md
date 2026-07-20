# CodeScenes — marketing site

Marketing site for **CodeScenes** (`codescenes.dev`): build your Unity scenes in
code, edit them in the editor, keep both in automatic two-way sync.

Built with **Next.js 16** (App Router, static export) + **React 19** + **Tailwind v4**,
styled as a dark, code-forward developer tool. Syntax highlighting is done at build
time with **shiki** using a custom theme. Deploys as static files to **Cloudflare Pages**.

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
```

## Build (static export)

```sh
npm run build      # emits ./out  (output: "export" in next.config.ts)
```

Deploy `./out` to Cloudflare Pages (build command `npm run build`, output dir `out`).

## Structure

- `src/app/` — layout, page, global design tokens (`globals.css`), favicon (`icon.svg`).
- `src/components/` — section components (Hero, HowItWorks, Benefits, Comparison,
  OriginStory, Testimonials, Help, Waitlist, Sources, Header, Footer).
- `src/lib/site.ts` — **site constants + the placeholders to fill in** (GitHub URL,
  Bluesky handle, contact email, waitlist endpoint).
- `src/lib/samples.ts` — the C# builder code shown on the page.
- `src/lib/highlight.ts` — shiki highlighter + CodeScenes syntax theme.
- `research/` — background research the copy is grounded in (benefits vs. MCP,
  legal/trademark memo, design system). Not part of the built site.

## TODO before launch

- [ ] Fill real values in `src/lib/site.ts` (GitHub repo, Bluesky, email).
- [ ] Wire the waitlist form to a real provider (Buttondown / ConvertKit / a
      Cloudflare Pages Function) via `WAITLIST_ENDPOINT`. Until then it only shows a
      local success state — **it does not store emails**.
- [x] Drop the demo video into the hero (`src/components/Hero.tsx`, `HeroVideo`).
- [ ] Replace the placeholder testimonial slots with real quotes.
- [ ] Add a social/OG share image.
- [ ] Have an attorney glance at the comparison copy before launch (see
      `research/02-legal-referencing-competitors.md`).
