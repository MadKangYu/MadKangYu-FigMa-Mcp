# Figma MCP — Design by Talking

> **[한국어 README](./README.ko.md)** | English

## What is this?

Tell AI "convert this to React" and it reads your Figma design and generates code.
Tell AI "create a login screen" and it creates the design directly in Figma.

```
Traditional:  Look at design → type code manually → repeat fixes
With MCP:     "Make this into React" → done
```

## How it works

```
Figma    = your whiteboard
MCP      = AI's eyes and hands that can read and write the whiteboard
Tools    = ingredients (flour, eggs) — functions that read Figma files
Skills   = recipes (how to bake a cake) — workflows that orchestrate tools
```

## When do I need this?

```
Solo prototyping → NOT needed. Claude + Agentation is enough.
But you need Figma MCP when:
  ✓ Collaborating with non-coders (designers, clients, marketers)
  ✓ Need approval before writing code ("Is this the right direction?")
  ✓ Want to see multiple screens at a glance for consistency
  ✓ Already have designs in Figma
```

## Real-world scenarios

### 1. "I love this site, I want something similar"
```
Import this website into Figma: https://cal.com
Figma file: [my Figma URL]
```
AI grabs actual element values (colors, fonts, spacing) — not screenshots.
Just change brand colors and text. Done.

### 2. "I'm coding but can't visualize the layout"
```
I'm building a landing page but want to see the layout first.
Create a wireframe (gray boxes) in Figma [URL]:
- Hero (headline + CTA + image)
- Features 3-column grid
- Pricing 3 plans
- Footer
```
No code touched. Visual check in Figma first. If you like it → "Convert to React."

### 3. "Client wants changes"
```
Change the hero background color from #1E40AF to #059669
in Figma [URL]
```
Fix in Figma → client confirms → then update code.
Revision cycle ends at **design level**, not code level.

### 4. "Need to see all 5 screens at once"
```
Create these screens side by side in Figma [URL] (375x812px, gap 80px):
Screen 1 - Splash
Screen 2 - Onboarding
Screen 3 - Login
Screen 4 - Home
Screen 5 - Settings
Arrange as a flow.
```
Instant portfolio, pitch deck, or client handoff — no code needed.

### 5. "Have a design, need code"
```
Convert this Figma design to React + TypeScript + Tailwind:
[Dev Mode URL with &mode=dev]

Requirements:
- Functional components
- TypeScript prop types
- Mobile-first responsive
- Accessibility attributes (aria-label, role)
```
Dev Mode links produce **higher quality** code output.
Request section by section to avoid timeouts.

### 6. "Sync design tokens to code"
```
Extract color/spacing/typography variables from this Figma file
and convert to Tailwind config:
[URL]
```
Turns `#3B82F6` into `--color-primary` tokens.

---

## Quick install

```bash
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/setup.sh | bash
```

This installs:
- Official Figma MCP server (read + write)
- figma-mcp-go (unlimited, no rate limits)
- Plugin files for Figma Desktop
- All learning materials

**One-time manual step after install:**
```
Figma Desktop → Plugins → Development → Import plugin from manifest...
→ Select ~/.figma-mcp-go-plugin/plugin-dist/manifest.json → Run plugin
```

## 3 things to remember

### 1. Design → Code (read)
```
Convert this Figma design to React + TypeScript + Tailwind
[URL copied with Cmd+L in Figma]
```

### 2. Words → Design (write)
```
Create a landing page in this file. Hero + 3-col features + pricing + footer.
[Figma file URL]
```

### 3. Great site → My design (import)
```
Import this website into Figma: https://cal.com
Figma file: [my Figma URL]
```

## Quality tips

| Do this | Why it helps |
|---------|-------------|
| Use Dev Mode links (`&mode=dev`) | AI reads layout more accurately |
| Request **section by section** | Prevents timeouts, better quality |
| Use Auto Layout in designs | Converts to Flexbox/Grid instead of `position: absolute` |
| Clean up layer names | Gets `.hero-button` instead of `div_1234` |
| Use Variables in Figma | Gets `--color-primary` instead of `#3B82F6` |
| Specify "React + TypeScript + Tailwind" | More specific = more accurate |

## Best pipeline

```
1. Find a great site → import into Figma (screenshots ❌ element values ✅)
2. Modify only what you need (colors, text, layout)
3. Review → OK → convert to code
4. Apply to real app with Agentation
```

**Don't build from scratch. Import good designs and modify.**

## MCP servers included

| Server | Purpose | Rate limit |
|--------|---------|-----------|
| Official Figma (`figma`) | OAuth, read + write, `use_figma` | Free: 6/month, Pro: per-minute |
| figma-mcp-go | Plugin bridge, full read + basic write | **Unlimited** |

## Auto update

```bash
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/update.sh | bash
```

## Documentation

| Topic | File |
|-------|------|
| Getting started | `01-getting-started.md` |
| Core concepts | `02-core-concepts.md` |
| Tools & skills reference | `03-tools-and-skills.md` |
| Workflows + prompt patterns | `04-workflows.md` |
| Official docs & links | `05-resources.md` |
| FAQ (Korean) | `QnA.md` |
| Korean README | `README.ko.md` |

## License

MIT

## TL;DR

> **Preview in Figma first. Convert to code only after approval.**
> Figma is not a design tool — it's a **communication tool**.
