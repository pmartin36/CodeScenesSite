# CodeScenes — marketing site

Marketing site for **CodeScenes** (`codescenes.dev`): build your Unity scenes in
code, edit them in the editor, keep both in automatic two-way sync.

Built with **Next.js 16** (App Router, static export) + **React 19** + **Tailwind v4**,
styled as a dark, code-forward developer tool. Syntax highlighting is done at build
time with **shiki** using a custom theme. Deploys as static files to **Firebase Hosting**.

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
```

## Build (static export)

```sh
npm run build      # emits ./out  (output: "export" in next.config.ts)
```

## Deploy

```sh
npm run build
npx firebase deploy --only hosting
```

Firebase project `codescenes` (`.firebaserc`); `firebase.json` serves `./out` and sets
the cache headers (immutable for hashed assets, `must-revalidate` for HTML).

## Structure

- `src/app/` — layout, page, global design tokens (`globals.css`), favicon (`icon.svg`).
- `src/components/` — section components (Hero, HowItWorks, Benefits, Comparison,
  OriginStory, Testimonials, Help, Sources, Header, Footer) plus the shared pieces
  they use (CodePanel, Logo, Reveal) and the email-capture modal (NotifyProvider,
  NotifyLink, SubscribeModal).
- `src/lib/site.ts` — **site constants + the placeholders to fill in** (GitHub URL,
  Bluesky handle, contact email).
- `src/lib/subscribe.ts` — posts to `/api/subscribe`, which `firebase.json` rewrites
  to the `subscribe` Cloud Function in `functions/src/index.ts`. That function holds
  the Mailchimp API key (Secret Manager, `MAILCHIMP_API_KEY`) and adds the address to
  audience `5618732e33` as `pending`, so Mailchimp sends a confirmation email.
- `src/lib/samples.ts` — the C# builder code shown on the page.
- `src/lib/highlight.ts` — shiki highlighter + CodeScenes syntax theme.
- `src/app/docs/` — the API reference: `/docs/` (overview + type index),
  `/docs/api/[type]/` (one page per type, one anchor per member), `/docs/diagnostics/`
  (the SB#### analyzer table). Shell components live in `src/components/docs/`.
- `src/content/api.json` — **generated, committed**. See below.
- `scripts/gen-api-mirror.mjs` — writes `public/docs/api.md` (the whole reference as one
  markdown file) and `public/llms.txt`. Runs from `prebuild`.
- `scripts/verify-docs.mjs` — drives the exported site in Playwright and asserts every
  member anchor, cross-type link, and mirror file actually resolves.

## API reference

`src/content/api.json` is generated from the C# source by `SceneBuilder.DocGen` in the
CodeScenesUnity repo (syntax-only Roslyn over `com.codescenes/Runtime` plus the analyzer's
`DiagnosticDescriptors`). Signatures and summaries therefore cannot drift from the shipped API.

```sh
npm run api:sync    # regenerate api.json + the text mirror from ../CodeScenesUnity
```

Point it elsewhere with `CODESCENES_UNITY=/path/to/repo npm run api:sync`.

To verify the built reference in a browser:

```sh
npm run build
python3 -m http.server 4321 --directory out &
node scripts/verify-docs.mjs          # SHOT_DIR=/tmp/x also writes screenshots
```
- `research/` — background research the copy is grounded in (benefits vs. MCP,
  legal/trademark memo, design system). Not part of the built site.

## TODO before launch

- [ ] Fill real values in `src/lib/site.ts` (GitHub repo, Bluesky, email).
- [x] Wire email capture to Mailchimp (`functions/src/index.ts`, deployed).
- [x] Drop the demo video into the hero (`src/components/Hero.tsx`, `HeroVideo`).
- [ ] Replace the placeholder testimonial slots with real quotes.
- [ ] Add a social/OG share image.
- [ ] Have an attorney glance at the comparison copy before launch (see
      `research/02-legal-referencing-competitors.md`).
