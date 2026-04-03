<!-- 
  Figma MCP Guide | Figma to React | Figma to Code | AI Design to Code
  Claude Code + Figma | MCP Server Setup | Figma Plugin Development
  Design System Automation | Figma API | Figma Dev Mode | Auto Layout
  figma-mcp-go | figma-implement-design | figma-generate-design
  React TypeScript Tailwind | Next.js | Vue | HTML CSS
  Design Tokens | Figma Variables | Code Connect
  Korean: 피그마 MCP 가이드 | 피그마 코드 변환 | AI 디자인 자동화
-->

<p align="center">
  <img src="https://img.shields.io/badge/Figma-MCP-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma MCP Server Guide" />
  <img src="https://img.shields.io/badge/Claude-Code-FF6B35?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Code AI Agent" />
  <img src="https://img.shields.io/badge/React-Tailwind-38BDF8?style=for-the-badge&logo=react&logoColor=white" alt="React TypeScript Tailwind CSS" />
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js App Router" />
</p>

<h1 align="center">Figma MCP — Design by Talking</h1>
<h3 align="center">Beyond Figma Plugins. AI reads, writes, and converts your designs to production code.</h3>

<p align="center">
  <strong>The complete guide to Figma MCP — 16 tools, 7 skills, 15 prompt patterns, auto-install scripts, and troubleshooting for every platform.</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT" /></a>
  <img src="https://img.shields.io/github/stars/MadKangYu/MadKangYu-FigMa-Mcp?style=social" alt="Stars" />
  <img src="https://img.shields.io/github/last-commit/MadKangYu/MadKangYu-FigMa-Mcp" alt="Last Commit" />
  <img src="https://img.shields.io/badge/docs-10%20guides-brightgreen" alt="Docs" />
  <img src="https://img.shields.io/badge/prompts-15%20patterns-blue" alt="Prompts" />
</p>

<p align="center">
  <a href="./README.ko.md">한국어</a> · English
</p>

---

## I want to... (find what you need in 3 seconds)

| I want to... | Do this | Guide |
|-------------|---------|:-----:|
| **Install everything** | `curl setup.sh \| bash` | [setup.sh](./setup.sh) |
| **Figma → React code** | Paste URL + "convert to React" | [04](./04-workflows.md) |
| **Create design in Figma** | "Make a landing page in [URL]" | [04](./04-workflows.md) |
| **Clone a website** | "Import https://cal.com" | [04](./04-workflows.md) |
| **Fix bad code output** | `&mode=dev` + section-by-section | [07](./07-pain-points.md) |
| **Add 3D / animation** | MCP skeleton → code for motion | [07](./07-pain-points.md) |
| **Korean fonts** | Noto Sans KR or Pretendard | [08](./08-fonts-and-pricing.md) |
| **Free vs paid?** | Free: 6/mo. Pro Dev $12 best | [08](./08-fonts-and-pricing.md) |
| **Fix errors** | "tool not found", 429, timeout | [09](./09-troubleshooting.md) |
| **Check my setup** | `curl check-env.sh \| bash` | [check-env.sh](./check-env.sh) |
| **Understand terms** | 40+ terms in plain language | [06](./06-glossary.md) |
| **macOS permissions** | Accessibility + Firewall | [09](./09-troubleshooting.md) |

---

## What Can You Actually Do? (No technical knowledge needed)

### Design (디자인)
| You say... | What happens |
|-----------|-------------|
| "Make a landing page for my coffee shop" | AI creates a full page design in Figma |
| "I like this website, make mine similar" | AI copies the layout and you change text/colors |
| "Show me 5 app screens side by side" | AI generates a complete app flow in Figma |
| "Make the button bigger and green" | AI modifies the exact element instantly |
| "Add a pricing section with 3 plans" | AI adds new sections to existing designs |
| "Create a logo concept" | AI generates options in Figma canvas |

### Marketing (마케팅)
| You say... | What happens |
|-----------|-------------|
| "Turn this design into a real website" | AI generates React/HTML code from Figma |
| "Make a mobile version of this page" | AI creates responsive 375px layout |
| "Export all images from this design" | AI extracts PNG/SVG/JPG files |
| "Create a pitch deck from these screens" | AI arranges screens as Figma Slides |
| "Change all text to Korean" | AI finds and replaces every text node |
| "What fonts and colors is this site using?" | AI analyzes and lists all design tokens |

### Collaboration (협업)
| You say... | What happens |
|-----------|-------------|
| "Share this design with my client" | Figma link — anyone can view in browser |
| "My client wants the header changed" | Client comments in Figma → AI fixes it |
| "Sync design colors to our codebase" | AI extracts tokens → Tailwind config |
| "Is this design consistent across pages?" | AI compares layouts and flags differences |

### What you DON'T need
```
❌ Design skills      → AI handles layout, spacing, colors
❌ Coding knowledge    → AI generates production code  
❌ Figma expertise     → AI operates Figma for you
❌ Design system       → AI can build one from scratch
❌ Multiple tools      → Figma + Claude Code = everything
```

---

## Works With (not just Claude Code)

| AI Tool | Figma MCP Support | Setup |
|---------|:-----------------:|-------|
| **Claude Code** | ✅ Full | This repo's setup.sh |
| **Cursor** | ✅ Full | `/add-plugin figma` |
| **VS Code + Copilot** | ✅ Full | MCP:Add Server → HTTP |
| **Codex (OpenAI)** | ✅ Full | `gemini extensions install` |
| **Gemini CLI** | ✅ Full | Extension install |
| **Windsurf** | ✅ Full | MCP config |
| **Warp** | ✅ Partial | MCP config |

All use the same Figma MCP server: `https://mcp.figma.com/mcp`

---

## The Problem

```
Designer sends Figma link
→ Developer opens Figma, squints at spacing values
→ Types CSS by hand: "is that 16px or 18px padding?"
→ Builds component, checks browser, it looks wrong
→ Goes back to Figma, measures again
→ Repeat 47 times
→ Client says "actually, make the button green"
→ Start over
```

## The Solution

```
"Convert this Figma design to React + Tailwind"
[paste Figma URL]
→ Done. Production-ready code. 30 seconds.
```

---

## How It Works

```mermaid
graph LR
    A[You] -->|"make a landing page"| B[Claude Code]
    B -->|MCP Protocol| C[Figma]
    C -->|design data| B
    B -->|React + Tailwind| D[Your App]
    
    E[Designer] -->|Figma link| B
    F[Client] -->|"change button color"| B
    B -->|updates design| C
```

```
Figma    = your whiteboard
MCP      = AI's eyes and hands on the whiteboard
Tools    = ingredients (flour, eggs) — read Figma files
Skills   = recipes (how to bake) — orchestrate tools in the right order
```

---

## Quick Install

```bash
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/setup.sh | bash
```

<details>
<summary><strong>What gets installed</strong></summary>

| Component | Purpose |
|-----------|---------|
| Figma Desktop App | Design environment (via Homebrew) |
| Official Figma MCP | Read + write designs (OAuth) |
| figma-mcp-go | Unlimited usage, no rate limits |
| Plugin files | Bridge for Figma Desktop |
| Learning materials | 10 guides, 15 prompt patterns |

</details>

**One-time manual step:**
```
Figma Desktop → Plugins → Development → Import plugin from manifest...
→ ~/.figma-mcp-go-plugin/plugin-dist/manifest.json → Run
```

---

## 6 Real-World Scenarios

### 1. Clone a beautiful site

> "I love cal.com's design. I want something similar for my SaaS."

```
Import this website into Figma: https://cal.com
Figma file: [my URL]
```
AI grabs **actual element values** (colors, fonts, spacing) — not screenshots.
Change brand colors → done. No design skills needed.

### 2. Visualize before coding

> "I'm coding a dashboard but can't picture the layout."

```
Create a wireframe in Figma [URL]:
- Hero with headline + CTA
- Features 3-column grid  
- Pricing 3 plans
- Footer
Gray boxes only. No colors yet.
```
**Zero code touched.** See it first → approve → then convert.

### 3. Handle client feedback

> Client: "Make the hero green and add a testimonial section"

```
In Figma [URL]:
1. Change hero background from #1E40AF to #059669
2. Add testimonial section below pricing with 3 cards
```
Fix in Figma → client sees it instantly → approve → update code.
**Revision cycle ends at design level, not code level.**

### 4. App flow at a glance

> "I need to show investors all 5 screens of my app."

```
Create these screens side by side in Figma [URL] (375x812px, gap 80px):
1 - Splash  2 - Onboarding  3 - Login  4 - Home  5 - Settings
Arrange as a user flow with arrows.
```
Instant pitch deck. No PowerPoint needed.

### 5. Design to production code

> "Designer finished the Figma. I need React components."

```
Convert this Figma design to React + TypeScript + Tailwind:
[Dev Mode URL with &mode=dev]

Requirements:
- Functional components with TypeScript props
- Mobile-first responsive
- Accessibility (aria-label, role)
```
**Pro tip:** `&mode=dev` in the URL = higher quality code output.

### 6. Design system sync

> "Our Figma tokens don't match our Tailwind config."

```
Extract all color/spacing/typography variables from Figma [URL]
→ Convert to tailwind.config.js format
```
`#3B82F6` becomes `--color-primary`. Change once, updates everywhere.

---

## 3 Things to Remember

| # | Action | Prompt |
|---|--------|--------|
| 1 | **Design → Code** | `Convert this Figma design to React + Tailwind [URL]` |
| 2 | **Words → Design** | `Create a landing page in Figma [URL]. Hero + features + pricing.` |
| 3 | **Clone → Modify** | `Import https://cal.com into Figma [URL]` |

---

## Quality Cheatsheet

| Do this | Why | Impact |
|---------|-----|--------|
| Use `&mode=dev` in URL | AI reads layout structure, not just pixels | **+30% accuracy** |
| Request **section by section** | Prevents 20KB limit timeout | **No broken code** |
| Use Auto Layout in Figma | Generates Flexbox/Grid, not `position: absolute` | **Responsive works** |
| Clean layer names | `div_1234` → `.hero-button` | **Readable CSS** |
| Use Figma Variables | `#3B82F6` → `var(--color-primary)` | **Themeable code** |
| Specify full stack | "React + TypeScript + Tailwind CSS" | **Exact output** |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Your Workflow                    │
├─────────────┬──────────────┬────────────────────┤
│   READ      │   WRITE      │   CONVERT          │
│             │              │                    │
│ get_file    │ use_figma    │ react-component    │
│ get_styles  │ generate_    │ html-css           │
│ get_comps   │   figma_     │ tailwind           │
│ get_vars    │   design     │ design-tokens      │
│ get_images  │ create_new_  │                    │
│ get_code_   │   file       │                    │
│   connect   │              │                    │
├─────────────┴──────────────┴────────────────────┤
│              get_design_context                  │
│         (does 90% of the work alone)             │
├─────────────────────────────────────────────────┤
│                 MCP Protocol                     │
├──────────────────┬──────────────────────────────┤
│  Official Figma  │  figma-mcp-go (unlimited)    │
│  (OAuth, stable) │  (plugin bridge, no limits)  │
└──────────────────┴──────────────────────────────┘
```

## 7 Official Skills (Ranked)

| Rank | Skill | When to use |
|:----:|-------|-------------|
| ⭐⭐⭐ | `figma-implement-design` | Every day — design → code |
| ⭐⭐⭐ | `figma-use` | Auto-loaded before any write operation |
| ⭐⭐ | `figma-generate-design` | Creating new screens in Figma |
| ⭐⭐ | `figma-create-design-system-rules` | Project setup — generates CLAUDE.md rules |
| ⭐ | `figma-generate-library` | Building full design systems (20-100+ calls) |
| ⭐ | `figma-code-connect` | Component ↔ code mapping (Org plan+) |
| — | `figma-create-new-file` | Just creates a blank file |

> **Starting out? You only need `figma-implement-design`.** Everything else is optional.

---

## MCP Servers Compared

| Server | Read | Write | Rate Limit | Best For |
|--------|:----:|:-----:|-----------|----------|
| **Official Figma** | ✅ | ✅ | Free: 6/mo, Pro: 200/day | Stability + `use_figma` |
| **figma-mcp-go** | ✅ | Basic | **Unlimited** | Free plan users |
| Framelink | ✅ | ❌ | Unlimited | Read-only, token-efficient |
| Grab/cursor-talk | ✅ | ✅ | Unlimited | Cursor + WebSocket |
| figma-console | ✅ | ✅ | OAuth | 92 tools, but unstable on macOS |

**Recommended combo:** Official (stable writes) + figma-mcp-go (unlimited reads)

---

## Free vs Paid

| | Free ($0) | Pro Dev ($12/mo) | Pro Full ($16/mo) |
|---|:---------:|:----------------:|:-----------------:|
| MCP calls | 6/month | 200/day | 200/day |
| `use_figma` write | ❌ | ✅ | ✅ |
| Dev Mode | ❌ | ✅ | ✅ |
| Variables | — | Read only | 10 modes |
| Code Connect | ❌ | ❌ | ❌ (Org only) |
| **With figma-mcp-go** | **Unlimited reads** | **Unlimited reads** | **Unlimited reads** |

> **Best value: Pro Dev seat at $12/mo.** Free + figma-mcp-go works for learning.

---

## 10 Pain Points & Solutions

| Problem | Solution | Auto? |
|---------|----------|:-----:|
| Rate limit (6/month) | figma-mcp-go installed | ✅ |
| 20KB output limit | Section-by-section workflow | 📋 |
| No Auto Layout = bad code | "Add Auto Layout first" pre-prompt | 📋 |
| Custom fonts fail | Specify in prompt + Tailwind config | 📖 |
| Images not included | `get_images` → extract first | 📋 |
| 85-90% accuracy | Dev Mode URL + 2-3 revision rounds | 📋 |
| `figma-use` not loaded | CLAUDE.md auto-load rule | ✅ |
| WebSocket drops | Official Remote as primary | ✅ |
| Dev Mode requires Pro | CSS inspect is free, full mode is paid | 📖 |
| Figma Make confusion | Different product entirely | 📖 |

> ✅ = automated in this repo, 📋 = template provided, 📖 = guide included

---

## Font Guide

### Safe for MCP (Commercial Free)

| Category | Top Picks |
|----------|-----------|
| **Sans-serif** | Inter, Roboto, Poppins, DM Sans, Plus Jakarta Sans |
| **Serif** | Playfair Display, Merriweather, Lora |
| **Monospace** | JetBrains Mono, Fira Code |
| **Korean** | Noto Sans KR ✅, IBM Plex Sans KR ✅, NanumGothic ✅ |
| **Korean (local only)** | Pretendard ❌ MCP, Spoqa Han Sans ❌ MCP |

> All Google Fonts = SIL OFL = **free for commercial use**.
> Pretendard needs manual `@font-face` setup in code.

---

## Documentation

| File | Content | For |
|------|---------|-----|
| [`01-getting-started.md`](./01-getting-started.md) | Install + first 20 minutes | Beginners |
| [`02-core-concepts.md`](./02-core-concepts.md) | MCP concepts + when to use | Understanding |
| [`03-tools-and-skills.md`](./03-tools-and-skills.md) | 17 tools + 7 skills + rankings | Reference |
| [`04-workflows.md`](./04-workflows.md) | 8 workflows + 15 prompt patterns | Copy-paste |
| [`05-resources.md`](./05-resources.md) | Official docs, GitHub, npm | Deep dive |
| [`06-glossary.md`](./06-glossary.md) | 40+ terms explained simply | Non-developers |
| [`07-pain-points.md`](./07-pain-points.md) | 10 problems + solutions | Troubleshooting |
| [`08-fonts-and-pricing.md`](./08-fonts-and-pricing.md) | Fonts + free vs paid plans | Planning |
| [`09-troubleshooting.md`](./09-troubleshooting.md) | Install/CLI/API/quality fixes | Problem solving |
| [`QnA.md`](./QnA.md) | 15 real Q&As from learning | FAQ |
| [`CLAUDE.md`](./CLAUDE.md) | Auto-applied AI rules | Automatic |
| [`check-env.sh`](./check-env.sh) | Environment auto-diagnosis | Debugging |

---

## Why This Repo Exists

Figma's built-in plugins are limited. They can read designs, but they can't:
- Generate production-ready React/Next.js code with TypeScript
- Import any website into editable Figma layers
- Build entire design systems with 100+ automated calls
- Sync design tokens bidirectionally with Tailwind configs
- Auto-detect missing Auto Layout and fix it before code conversion

**This repo bridges that gap.** It combines the official Figma MCP server with community tools, battle-tested prompt patterns, and auto-install scripts — so you go from Figma URL to deployed code in minutes, not days.

---

## Download & Project Setup

### Option 1: Auto install (recommended)
```bash
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/setup.sh | bash
```
Saves to `~/Projects/figma-mcp-learning/`

### Option 2: Git clone
```bash
git clone https://github.com/MadKangYu/MadKangYu-FigMa-Mcp.git ~/Projects/figma-mcp-learning
```

### Option 3: Download ZIP
[Download ZIP](https://github.com/MadKangYu/MadKangYu-FigMa-Mcp/archive/refs/heads/main.zip) → extract to your preferred location.

### Recommended folder structure

```
~/Projects/
├── figma-mcp-learning/     ← this repo (guides + scripts)
├── my-app/                 ← your actual project
│   ├── CLAUDE.md           ← copy CLAUDE.md here for auto-rules
│   ├── src/components/     ← Figma → code output goes here
│   └── public/images/      ← Figma → image export goes here
└── .figma-mcp-go-plugin/   ← auto-created by setup.sh
```

### Per-project setup
```bash
# Copy CLAUDE.md to your project for auto Figma rules
cp ~/Projects/figma-mcp-learning/CLAUDE.md ~/Projects/my-app/CLAUDE.md
```

### Platform notes

| Platform | Default path | Notes |
|----------|-------------|-------|
| macOS | `~/Projects/` | setup.sh creates this |
| Windows | `%USERPROFILE%\Projects\` | Use Git Bash or WSL |
| Linux | `~/Projects/` | Same as macOS |
| Codespaces | `/workspaces/` | Git clone directly |

---

## Environment Check

```bash
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/check-env.sh | bash
```

## Auto Update

```bash
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/update.sh | bash
```

---

## Contributing

PRs welcome. Found a better prompt pattern, workflow, or fix? Share it.

---

## Keywords

`figma mcp` · `figma to react` · `figma to code` · `design to code` · `figma api` · `figma plugin` · `claude code figma` · `mcp server` · `figma dev mode` · `figma auto layout` · `design system automation` · `figma variables` · `code connect` · `figma typescript` · `figma tailwind` · `figma nextjs` · `ai design` · `figma cursor` · `figma vscode` · `피그마 MCP` · `피그마 코드 변환` · `AI 디자인 자동화`

---

<p align="center">
  <strong>Don't build from scratch. Import good designs and modify.</strong><br/>
  <strong>Preview in Figma first. Convert to code only after approval.</strong><br/><br/>
  <em>Figma is not a design tool — it's a <b>communication tool</b>.</em><br/><br/>
  <sub>Built with Claude Code by <a href="https://github.com/MadKangYu">MadKangYu</a> · MIT License · 2026</sub>
</p>
