# Code-first Unity scene authoring vs. MCP-driven editor control

**Purpose:** Source material for CodeFirstGames marketing. Every non-obvious claim is cited. Each
marketing-usable claim carries a verdict: **DEFENSIBLE** (cite it as-is), **NEEDS-HEDGE** (true but
must be qualified), or **OVERREACH** (do not assert; misleading).

**How to read the labels:** *HARD FACT* = directly cited to a source. *INFERENCE* = a reasonable
conclusion drawn from cited facts, explicitly labeled so a marketer knows it is argument, not
measurement.

**Product recap (for framing):** CodeFirstGames represents a Unity scene as one flat, readable,
diffable C# "builder" file and keeps that file and the live Editor scene in automatic bidirectional
sync. The competing paradigm this report evaluates is **MCP-driven editor control**: an LLM operates
the Unity Editor by calling granular Model Context Protocol tools.

---

## 0. Sources at a glance

Primary / first-party:
- Unity official MCP docs & blog — https://unity.com/blog/unity-ai-mcp-how-to-get-started ; https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.0/manual/unity-mcp-overview.html ; tool API namespace: https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.0/api/Unity.AI.MCP.Editor.Tools.html
- Coplay / MCP-for-Unity (the merged justinpbarnett + Coplay project) — repo https://github.com/CoplayDev/unity-mcp ; docs https://coplaydev.github.io/unity-mcp/ ; tool reference https://coplaydev.github.io/unity-mcp/reference/tools ; product site https://coplay.dev/
- Academic: Wu, S. & Barnett, J.P. (2025). *MCP-Unity: Protocol-Driven Framework for Interactive 3D Authoring.* SIGGRAPH Asia Technical Communications '25, ACM. https://doi.org/10.1145/3757376.3771417

Token economics:
- MCP spec discussion #2812 (measured per-tool token overhead) — https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2812
- Unblocked, "MCP Tool Overload: A Measured Guide" — https://getunblocked.com/blog/mcp-tool-overload/
- Lunar.dev, "MCP Tool Overload" — https://www.lunar.dev/post/why-is-there-mcp-tool-overload-and-how-to-solve-it-for-your-ai-agents
- Atlassian Labs, "MCP Compression" — https://www.atlassian.com/blog/development/mcp-compression-preventing-tool-bloat-in-ai-agents
- TheNewStack, "10 strategies to reduce MCP token bloat" — https://thenewstack.io/how-to-reduce-mcp-token-bloat/

Spatial reasoning:
- Zha et al. (2025), IJCAI-25 survey, *How to Enable LLM with 3D Capacity?* — https://www.ijcai.org/proceedings/2025/1200.pdf
- PlanQA (arXiv 2507.07644) — https://arxiv.org/html/2507.07644v1
- SnorkelSpatial — https://snorkel.ai/blog/introducing-snorkelspatial/
- Apple ML, spatial memory research — https://machinelearning.apple.com/research/spatial

GUI / computer-use agent reliability:
- "The State of Computer Use Agents" (OSWorld numbers) — https://medium.com/@adnanmasood/the-hardest-easy-problem-in-ai-the-state-of-computer-use-agents-a7e3aea7fa3a
- OSUniverse benchmark — https://agentsea.github.io/osuniverse/
- WorldGUI (arXiv 2502.08047) — https://arxiv.org/html/2502.08047v4

Version control / merge:
- Unity Discussions, "Unity Scene Merge Conflict With Git" — https://discussions.unity.com/t/unity-scene-merge-conflict-with-git/882150
- Manuel Rauber, "Merge Conflicts in Unity — How to avoid them?" — https://manuel-rauber.com/2023/01/25/merge-conflicts-in-unity-how-to-avoid-them/
- r/gamedev thread on preventing scene merge conflicts — https://www.reddit.com/r/gamedev/comments/ycudcj/

---

## 1. What Unity MCP / Coplay actually are and how they work

**The model (HARD FACT).** MCP (Model Context Protocol) is an open standard letting an AI agent call
external "tools" in a structured way. A Unity MCP server implements it so any MCP-compatible agent
(Claude Code, Cursor, Windsurf, VS Code Copilot, Claude Desktop) can connect to a *running* Unity
Editor and "interact with it as if it were a set of callable tools." The agent does **not** touch
Unity directly — "it does not interact with Unity directly, it goes through the protocol." (Unity
blog, https://unity.com/blog/unity-ai-mcp-how-to-get-started)

**Two ecosystems exist:**

1. **Unity's official MCP Server** — shipped in the AI Assistant package, requires a Unity
   subscription (Unity 6+). Core tool categories: *Scene management* (read hierarchy,
   create/modify/delete GameObjects, manage scenes), *Script editing* (create/read/modify C#),
   *Console access* (read logs/warnings/errors), *GameObject inspection* (read/write component
   values), *Build settings*. (Unity blog, ibid.)

2. **Coplay / MCP-for-Unity** (open-source, MIT; the project born from justinpbarnett/unity-mcp, now
   maintained under CoplayDev) — a three-layer architecture: **MCP client → Python server
   (FastMCP + WebSocket hub) → C# Unity Editor plugin** that "receives commands on the Unity main
   thread [and] executes via Unity Editor APIs." (https://coplaydev.github.io/unity-mcp/)

**The concrete tool surface (HARD FACT).** Coplay's docs advertise **"48 tools across 10 groups"**
plus **25 read-only resources**, spanning Unity 2021.3 → 6.x. (https://coplaydev.github.io/unity-mcp/)
Representative tool names and their jobs:
- `manage_scene` — create/load/save scenes, GameObjects
- `manage_gameobject` — create, modify, delete, find, component operations
- `manage_script` — create/read/delete C# scripts (a compatibility router)
- `apply_text_edits` — "precise text edits with precondition hashes and atomic multi-edit batches"
- `manage_asset` — import/create/modify/delete assets
- `read_console` — read or clear console messages
- `execute_menu_item` — run Editor menu items (e.g. `File/Save Project`)

(Tool names/descriptions: https://github.com/CoplayDev/unity-mcp ; WebSearch of README; catalog
https://coplaydev.github.io/unity-mcp/reference/tools . Glama's listing phrases it as "47 focused MCP
tool entrypoints": https://glama.ai/mcp/servers/CoplayDev/unity-mcp)

**Coplay (the commercial product)** is an in-Editor AI agent — "The AI Agent for Unity that completes
tedious game engine tasks for you," from "scripting to scene setup," installed via Unity Package
Manager. Users can "approve all changes or let Coplay take on tasks by itself." (https://coplay.dev/)

**How a task actually runs (HARD FACT).** Unity's own worked example — fixing a console error — is
an explicit multi-tool loop: (1) agent reads console via a `ReadConsole` tool, (2) identifies + reads
the script, (3) writes a fix, (4) reads the console again to confirm. Scene work is natural-language
instructions like *"Create a new empty GameObject called PlayerSpawn at position (0,0,0)"* that the
agent executes "using Unity's tools ... showing its reasoning and the tool calls it makes." (Unity
blog, ibid.)

**Neutral takeaway:** MCP-driven control is *imperative and stateful* — the LLM issues a sequence of
granular editor mutations against a live Editor it cannot see, and reads state back through tool
calls. This is the substrate CodeFirstGames argues against: not "AI is bad," but "driving a GUI
through tool calls is the wrong interface for an LLM."

> Note the legitimizing fact for MPC's own framing: there is a peer-reviewed ACM paper
> (Wu & Barnett 2025) describing MCP-Unity as a "Protocol-Driven Framework for Interactive 3D
> Authoring." MCP-for-Unity is a serious, credible competitor — treat it respectfully in copy.

---

## 2. Token cost / context economics

This is the **strongest, most quantified** pillar. The core structural fact: **every tool an MCP
server exposes injects its full JSON-Schema definition into the model's context on every session,
whether or not the tool is ever used.**

**Measured per-tool overhead (HARD FACT):**
- The MCP spec discussion #2812 measured 11 production tools with Anthropic's official
  `count_tokens` API. Heavy tools cost **~1,000 tokens each** to define (`ctx_batch_execute` = 1,024
  tokens); light tools ~100. Title: *"MCP spec should address tool schema token overhead (~1000
  tokens/tool consumed per session)."* A cross-ecosystem follow-up measured **13 servers / 79 tools**:
  median **547 tokens/server**, average tool **123 tokens** (median 103); GitHub MCP alone = **3,546
  tokens for 26 tools**. (https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2812)
- Independent guides put the **per-tool average at 300–600 tokens**. (Unblocked,
  https://getunblocked.com/blog/mcp-tool-overload/)

**Aggregate context consumption (HARD FACT):**
- Unblocked reports a real 3-server setup (GitHub + Playwright + IDE) consuming **143,000 of 200,000
  tokens — 72% of the window — in tool schemas before any user input.** Individual servers: GitHub
  MCP ~26,000 tokens (13% of a 200K window); Slack MCP ~21,000 (10.5%). Overlapping tool metadata was
  measured at 30,000–60,000 tokens (25–30% of a 200K window).
  (https://getunblocked.com/blog/mcp-tool-overload/)
- Discussion #2812: "20 tools averaging 500 tokens each" = **10,000 tokens of context consumed by
  schemas regardless of billing amortization"** — framed explicitly as **reasoning-capacity** cost,
  "approximately 5 pages of reasoning capacity permanently unavailable to the model per session."

**Accuracy degrades with tool count (HARD FACT, but note provenance):**
- Unblocked cites the RAG-MCP project measuring **tool-selection accuracy falling from a 43% baseline
  to under 14%** as tool count grew, and reports convergent thresholds: visible quality drops around
  **50 tools**, accuracy "collapses entirely" near **~120 tools**. Product limits corroborate the
  concern: **Cursor caps at ~40 tools**; the **OpenAI API caps at 128**.
  (https://getunblocked.com/blog/mcp-tool-overload/) Lunar.dev independently argues "AI agents fail
  when they are exposed to too many MCP tools, which bloats prompts, slows reasoning, and increases
  the chance of incorrect or unsafe tool use." (https://www.lunar.dev/post/...)

**Round-trip / turn compounding (HARD FACT):** because schemas sit in the system-prompt prefix,
Unblocked notes a 50-tool setup over a 20-turn conversation carries "500,000 tokens just in tool
schema" against typically 30,000–60,000 tokens of *actual work.* Every scene-state read-back is
*additional* payload on top of the schema tax.

**Why this favors code-first (INFERENCE):** A Unity MCP server puts **~48 tool schemas** in context
permanently, and every edit round-trips a tool call plus a state read-back. CodeFirstGames instead
puts **one artifact — the scene as a C# file — in context**, edited with the model's native
strength (writing code) and diffed in place. The whole-scene-as-one-file design means the context
cost is the scene itself, not a standing tax of tool definitions the model must also reason around.
*This is an architectural argument, not a head-to-head benchmark — we have not measured
CodeFirstGames token use vs. a Unity MCP session.*

**Marketing verdicts:**
| Claim | Verdict |
|---|---|
| "MCP tool definitions can eat well over half your context window before you type a word — one measured 3-server setup used 143K of 200K tokens (72%) on tool schemas alone." | **DEFENSIBLE** (cite Unblocked; specify it's a 3-server example, not Unity-specific) |
| "Each MCP tool costs roughly 300–1,000 tokens of context just to define, paid on every session." | **DEFENSIBLE** (range spans #2812 + Unblocked) |
| "Exposing ~48 editor tools taxes the model's reasoning capacity before it does any work." | **NEEDS-HEDGE** (48 tools is Unity-MCP-real; the *tax* is inferred from general MCP data, not measured on Unity MCP specifically) |
| "Tool-selection accuracy can fall from 43% to under 14% as you pile on tools." | **NEEDS-HEDGE** (real figure, but from RAG-MCP via a secondary source; attribute it, don't imply it's Unity-measured) |
| "Code-first uses dramatically fewer tokens than MCP." | **OVERREACH** (plausible but unmeasured for this product; do not state as fact without our own benchmark) |

---

## 3. LLMs and spatial reasoning

The thesis "LLMs are natively good at code and bad at driving 3D space" has real academic backing.

**HARD FACT — the survey verdict.** The IJCAI-25 survey (Zha et al.) states LLMs "often struggle
with spatial reasoning due to their focus on textual patterns," and that "most VLMs process only 2D
data, limiting their ability to capture detailed 3D spatial configurations"; multimodal LLMs "exhibit
limited acuity in 3D spatial understanding, struggling with fine-grained relationships."
(https://www.ijcai.org/proceedings/2025/1200.pdf)

**HARD FACT — benchmark numbers:**
- **PlanQA** (structured-text floor plans): top models hit ~95–100% on simple metric tasks
  (distances) but **geometric planning and constraint verification fall below 50% across all models**;
  free-space estimation "approaches near-zero"; path-planning with clearance constraints is **under
  35%**; the "largest free rectangle" optimization yields **single-digit accuracy.** The paper
  concludes "current LLMs do not form sufficiently robust internal representations for complex spatial
  inference." (https://arxiv.org/html/2507.07644v1)
- **SnorkelSpatial**: "only a handful of models (grok-4-fast, o3, gpt-5, gpt-oss) exceed 50%
  accuracy"; models do worse on relative/egocentric queries than absolute ones and degrade as action
  sequences grow from 10 to 200. (https://snorkel.ai/blog/introducing-snorkelspatial/)
- **Apple ML**: "current MLLMs consistently struggle to integrate spatial memory with functional and
  external knowledge." (https://machinelearning.apple.com/research/spatial)

**Important nuance (keeps the claim honest):** These benchmarks show LLMs are bad at *deriving new
spatial facts* (planning paths, fitting boxes, reasoning about clearances). They notably do **well on
metric/symbolic tasks** (PlanQA: ~95–100% on distances). CodeFirstGames does not ask the LLM to
*compute* spatial layouts blind — it gives the model the scene as **symbolic code with explicit
coordinates it can read and edit**, which is the regime where LLMs are strong, and it sidesteps the
"drive the 3D viewport by feel" regime where they are weak.

**Marketing verdicts:**
| Claim | Verdict |
|---|---|
| "LLMs are demonstrably weak at 3D/spatial reasoning — on the PlanQA benchmark, geometric planning and constraint tasks fall below 50% for every model tested." | **DEFENSIBLE** (cite PlanQA + IJCAI survey) |
| "LLMs are natively strong at symbolic/code tasks and weak at spatial manipulation." | **DEFENSIBLE as framed** (PlanQA's own split: ~95–100% on metric/symbolic vs. sub-50% on spatial planning) |
| "Because LLMs can't reason spatially, they can't build scenes." | **OVERREACH** (false — they can, given symbolic coordinates; the weakness is *deriving* geometry, not *editing declared* geometry. Frame as "wrong interface," not "can't do it.") |

---

## 4. Reliability / flakiness of GUI/tool-driving agents

**HARD FACT — the headline gap.** Computer-use agents score **~85% on OSWorld** (up from 12% in
2024) yet complete only **20.6% of real long-horizon workflows** (OSWorld 2.0 best frontier system);
those long-horizon tasks take humans a **median 1.6 hours.** The author calls this gap "the most
important fact in the field."
(https://medium.com/@adnanmasood/the-hardest-easy-problem-in-ai-the-state-of-computer-use-agents-a7e3aea7fa3a)

**HARD FACT — error compounding is structural.** GUI-agent benchmarks (OSUniverse, WorldGUI)
specifically build multi-step verification/refinement because agents fail to "verify step
prerequisites [and] evaluate action outcomes." WorldGUI's whole contribution is machinery to "refine
plans, verify step prerequisites, and evaluate action outcomes, thereby improving reliability."
(https://arxiv.org/html/2502.08047v4 ; https://agentsea.github.io/osuniverse/)

**INFERENCE — the compounding math.** Multi-step success multiplies: an agent that is 95% reliable
per step succeeds on a 20-step task only ~0.95²⁰ ≈ **36%** of the time; at 10 steps, ~60%. The
OSWorld single-op 85% vs. long-horizon 20.6% gap is the empirical shadow of this. A scene edit driven
through MCP is *many* granular mutations (create GameObject → add component → set 6+ fields → parent
it → repeat), so per-step flakiness compounds. *The 0.95ⁿ figure is illustrative arithmetic, not a
measurement of Unity MCP.*

**INFERENCE — why code-first dodges it.** A code edit is applied and compiled **atomically**: it
either compiles (and the generated C# is validated) or it doesn't — there is no partially-completed,
half-mutated scene left behind by a tool sequence that failed on step 14. The failure mode is a
compile error the model sees and fixes, not silent scene corruption.

**Marketing verdicts:**
| Claim | Verdict |
|---|---|
| "Agents driving a GUI hit ~85% on single operations but complete only ~21% of long, multi-step real workflows." | **DEFENSIBLE** (cite OSWorld / OSWorld 2.0 via the state-of-computer-use survey; it's general computer-use, not Unity-specific — say so) |
| "Multi-step editor manipulation compounds errors: even 95%-per-step reliability is ~36% over 20 steps." | **NEEDS-HEDGE** (label as illustrative math, not a Unity MCP measurement) |
| "MCP editor agents corrupt scenes / are unreliable in Unity specifically." | **OVERREACH** (we have no Unity-specific failure-rate study; keep it to the general computer-use evidence) |

---

## 5. Diff / review / version-control angle

**This is a slam-dunk, well-documented pain point.**

**HARD FACT.** Unity `.unity` scenes and prefabs are YAML, and the community consensus is they are
effectively unmergeable. From Unity's own forums: *"YAML cannot be merged reliably"* and *"Best
approach: never merge scenes or prefabs."*
(https://discussions.unity.com/t/unity-scene-merge-conflict-with-git/882150) Standard mitigations are
avoidance, not merging: split scenes additively, lean on prefabs, or discard-and-redo one side of a
conflict. (ibid.; https://manuel-rauber.com/2023/01/25/merge-conflicts-in-unity-how-to-avoid-them/ ;
https://www.reddit.com/r/gamedev/comments/ycudcj/) Unity ships a dedicated `UnityYAMLMerge`
("Smart Merge") tool precisely because plain git merge fails on these files — its existence is
evidence of the problem.

**INFERENCE (strong).** A scene expressed as one flat C# file is a first-class citizen of git: line
diffs are meaningful, changes are PR-reviewable, blame works, and merges use ordinary text tooling.
This is the "infrastructure-as-code" argument applied to scenes — the same reason teams moved from
clicking cloud consoles to committing Terraform. *We assert readability/reviewability as an inherent
property of text-vs-YAML; we have not user-tested reviewer speed.*

**Marketing verdicts:**
| Claim | Verdict |
|---|---|
| "Unity scene and prefab files are YAML that 'cannot be merged reliably' — the standard advice is to never merge them." | **DEFENSIBLE** (direct quotes from Unity's own forum; near-universal community view) |
| "Code-first scenes give you real git diffs, code review, and blame on your scene." | **DEFENSIBLE** (inherent property of text; safe to state) |
| "Two people can safely edit the same scene at once with code-first." | **NEEDS-HEDGE** (text merges *far* better than YAML, but semantic conflicts still exist; don't imply merge-conflict-free) |

---

## 6. Determinism & reproducibility

**INFERENCE (well-grounded, but mostly argument — few external citations).** MCP-driven authoring is
*imperative*: the scene is the accumulated side-effect of a sequence of editor mutations. Replaying
the same prompt need not produce the same scene (LLM nondeterminism + editor state dependence), and
there is no single artifact that *is* the truth — the truth is whatever the Editor ended up in.

Code-first inverts this: the C# builder file **is** the declarative source of truth. Rebuilding from
the file is reproducible; the scene is a projection of the code. This mirrors declarative
infrastructure (Terraform/Nix) vs. imperative shell scripts. The product's own compile-gate
(generated C# must compile, validated by Roslyn) reinforces determinism: an invalid state can't be
committed.

**Caveat for honesty:** "Determinism" is a property of the *authoring model*, not a benchmarked
metric. LLM output is still nondeterministic; what's deterministic is *code → scene*, not *prompt →
code*. Don't blur those.

**Marketing verdicts:**
| Claim | Verdict |
|---|---|
| "Your scene has a single, declarative source of truth — rebuild it and get the same scene every time." | **DEFENSIBLE as a design property** (code→scene is deterministic; keep it to that, not prompt→code) |
| "MCP editor mutations are imperative side-effects with no reproducible source of truth." | **NEEDS-HEDGE** (fair characterization of the model, but MCP users still have the .unity file under version control; the point is *readability/reproducibility of that artifact*, not its absence) |

---

## 7. Counterpoints — where MCP is genuinely better, and where the code-first claim is weakest

Be honest here; these protect the brand from overreach.

1. **MCP does things code-first structurally can't reach.** MCP tools cover *the whole editor* —
   running tests, profiling, building players, asset import, menu items, reading the console, driving
   generators (materials, skyboxes, sprites). (Unity blog; https://coplay.dev/) A scene-as-code file
   is about **scene authoring**; it is not a general editor-automation bus. **Do not claim
   code-first replaces MCP for everything.** *(Weakest point for an over-broad "MCP is obsolete"
   pitch.)*

2. **First-party legitimacy & distribution.** Unity itself ships and blesses MCP; there is a
   peer-reviewed ACM paper (Wu & Barnett 2025). Coplay is VC-backed and MIT-open-source with ~48
   tools and 22 auto-configured clients. This is an established, credible paradigm — position
   CodeFirstGames as *a better substrate for scene authoring*, not as debunking a fad.

3. **"LLMs can't do spatial reasoning" is only half-true.** As §3 shows, LLMs are fine at
   symbolic/metric spatial tasks and weak at *deriving* geometry. Over-claiming "LLMs can't reason
   about 3D" invites easy rebuttal. The honest, stronger claim is about *interface*: give the model
   symbolic coordinates it can edit, don't make it drive a viewport.

4. **Token/accuracy numbers are ecosystem-general, not Unity-measured.** The 72%-of-context and
   43%→14% figures are from non-Unity MCP setups. They're valid as "here's what MCP tool bloat does,"
   but a marketer must not imply they were measured against Unity MCP or against CodeFirstGames.

5. **Bidirectional sync is the moat, and it's the hardest thing to prove in copy.** The product's
   real differentiator (edit scene → code rewrites; edit code → scene updates, invisibly) is a claim
   about *their* engineering, and the general research in this report neither proves nor disproves it.
   Lead with the substrate argument (code vs. tool-driving) that *is* externally supported; treat
   "seamless sync" as a product demo claim, not a cited one.

6. **Regulatory tailwind (context, not a benefit claim).** Unity's late-2025 ToS updates reportedly
   restricted third-party MCP/AI-agent integrations, unsettling tools like Coplay.
   (https://www.reddit.com/r/unity/comments/1ujskz7/end_of_unity_coplay_mcp/) A code-first tool that
   lives *outside* Unity's asset pipeline and doesn't drive the Editor through a bridge may be less
   exposed to that — but this is speculative; verify before using in copy. **NEEDS-HEDGE at best.**

---

## 8. One-page claim ledger (for copy)

| # | Claim (as copy) | Verdict | Primary source |
|---|---|---|---|
| 1 | Unity scene/prefab YAML "cannot be merged reliably"; advice is never to merge them | **DEFENSIBLE** | Unity Discussions |
| 2 | Code-first scenes get real git diffs, PR review, and blame | **DEFENSIBLE** | inherent property of text |
| 3 | MCP tool schemas can consume the majority of the context window (72% in one 3-server example) before any work | **DEFENSIBLE** (say it's a general MCP example) | Unblocked |
| 4 | Each MCP tool costs ~300–1,000 tokens of context, paid every session | **DEFENSIBLE** | MCP spec disc. #2812; Unblocked |
| 5 | On PlanQA, LLM geometric-planning/constraint accuracy is <50% for all models; they excel at symbolic/metric tasks | **DEFENSIBLE** | PlanQA; IJCAI-25 survey |
| 6 | GUI/computer-use agents hit ~85% on single ops but ~21% on long multi-step workflows | **DEFENSIBLE** (general, not Unity) | State-of-CUA / OSWorld 2.0 |
| 7 | Code-first has a single declarative source of truth; code→scene is reproducible | **DEFENSIBLE** (design property) | product design |
| 8 | Unity MCP exposes ~48 editor tools the model must hold in context | **DEFENSIBLE** (fact) — pairing it with a *reasoning-tax* claim is **NEEDS-HEDGE** | Coplay docs |
| 9 | Tool-selection accuracy falls 43%→14% as tools pile up | **NEEDS-HEDGE** (real, secondary attribution) | Unblocked citing RAG-MCP |
| 10 | Error compounding: 95%/step → ~36% over 20 steps | **NEEDS-HEDGE** (illustrative math) | inference |
| 11 | Code-first uses far fewer tokens than MCP for scene work | **OVERREACH until benchmarked** | none yet |
| 12 | LLMs "can't" reason about 3D so MCP can't build scenes | **OVERREACH** (false; reframe as interface) | — |
| 13 | Code-first replaces MCP entirely | **OVERREACH** (MCP covers whole-editor automation) | Unity blog; Coplay |

**Bottom line for the marketer:** Lead with #1–#7 (all defensible). The single most bulletproof,
emotionally resonant story is **version control** (#1/#2) — it's concrete, universally felt by Unity
teams, and quoted straight from Unity's own forum. The **token-economics** story (#3/#4) is the most
quantified and the most damaging to MCP, but must be framed as "this is what MCP tool bloat does in
general," not a measured Unity/CodeFirstGames comparison. Frame the spatial-reasoning story (#5) as
*interface fit* ("play to what LLMs are good at — code") rather than "LLMs can't do 3D."
