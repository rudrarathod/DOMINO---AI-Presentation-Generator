# AI Presentation Generator UI — Implementation Plan

## Context

Build a premium, production-quality AI Presentation Generator frontend. Two pages: a ChatGPT-style Home screen and a Gamma-style three-panel Builder editor. UI only — mock data throughout, no backend.

The DESIGN.md attachment defines the "Lumina Directive": deep-space dark (#131315), Geist font, Electric Violet/Deep Indigo primary palette, glassmorphic panels. This design language takes precedence and aligns with the Dark Kinetic stance.

The project is Vite + React 18 (not Next.js despite the brief). react-router v7, motion/react, lucide-react, and all Radix UI primitives are pre-installed.

---

## Implementation Approach

### Routing
Use `react-router` (v7, already installed) with two routes:
- `/` → `<HomeScreen />`
- `/builder` → `<BuilderScreen />`

Single entry in `App.tsx` using `BrowserRouter` + `Routes`.

---

### Design Tokens (`src/styles/theme.css`)
Update only the `:root` and `.dark` blocks to match the Lumina Directive. Preserve all `@theme inline` mappings.

Key overrides:
- `--background: #09090b` (deep space canvas)
- `--card: #131315` (panel surface)
- `--primary: #8b5cf6` (electric violet)
- `--primary-foreground: #ffffff`
- `--border: rgba(255,255,255,0.08)` (hairline)
- `--muted: #18181b`
- `--muted-foreground: #71717a`
- `--accent: #a78bfa` (violet tint)
- `--radius: 0.75rem`

### Fonts (`src/styles/fonts.css`)
Import Geist from Google Fonts (or use the `next/font` equivalent via @fontsource if available; otherwise CDN import).

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
```

---

### File Structure (all in `src/app/`)
```
App.tsx              — router root + dark class on html
screens/
  HomeScreen.tsx     — full-screen home
  BuilderScreen.tsx  — three-panel editor
components/
  home/
    Sidebar.tsx      — logo, new button, search, recents, profile
    PromptArea.tsx   — heading, textarea, suggestion chips
  builder/
    TopNav.tsx       — back, title, status badge, action buttons
    SlidePanel.tsx   — slide thumbnails list (left, 280px)
    SlideCanvas.tsx  — center canvas with mock slide content
    RightPanel.tsx   — AI chat / Design / Theme tabs (340px)
    ThemeCards.tsx   — theme picker grid inside Theme tab
```

---

### Page 1 — HomeScreen

Layout: `flex h-screen bg-background`

**Sidebar (w-[260px], border-r)**
- Logo: gradient violet spark icon + "Lumina" wordmark
- "New Presentation" button (gradient primary)
- Search input with icon
- Recent section with 5 mock items (AI Healthcare Deck, Startup Pitch, Climate Change Report, Rural Automation, Marketing Strategy)
- Each item: icon + title + timestamp
- Bottom: user avatar + name + settings cog

**Main (flex-1)**
- Vertically + horizontally centered content
- Ambient gradient orb behind content (violet/indigo radial gradient, low opacity)
- Large heading: "Create Beautiful Presentations with AI" (font-bold, tracking-tight)
- Subheading in muted-foreground
- Prompt textarea: dark input, rounded-xl, 4-row min, border + focus ring in violet
- Send button inside textarea (bottom-right, activated on text presence)
- Suggestion chips row: 6 chips with hover scale + border-violet on hover

**Animations**: fade-in-up stagger on heading → subheading → textarea → chips using `motion/react`

---

### Page 2 — BuilderScreen

Layout: `flex flex-col h-screen`

**TopNav**
- Left: back arrow button (navigates to `/`) + "AI-Powered Farming Platform" title
- Center: status badge ("Auto-saved • 2 min ago") with green dot
- Right: Preview, Share, Export buttons (ghost / primary styles)

**Three-panel flex row (flex-1 overflow-hidden)**

**Left Panel (w-[280px], border-r, overflow-y-auto)**
- Title display
- "Add Slide" button
- Slide thumbnails list — 10 mock slides
- Selected slide (index 0 "Cover") highlighted with violet border + bg
- Each thumbnail: slide number, slide name, tiny preview rect

**Center Canvas (flex-1, overflow-auto, bg slightly darker)**
- Slide frame: 16:9 aspect ratio, white/dark surface, rounded-xl, shadow
- Mock slide content for "AI-Powered Farming Platform":
  - Title + subtitle text
  - Hero image placeholder (gradient rect with icon)
  - Three stats cards row (85% yield increase, $2.4B market, 12K farms)
  - Two text content blocks
  - Bottom slide number

**Right Panel (w-[340px], border-l)**
- Tabs: AI Assistant | Design | Theme
- **AI Assistant tab (default)**:
  - Chat messages (no bubbles — typography-distinguished):
    - User: "Make the presentation more professional."
    - AI: "I updated typography, spacing, and layout recommendations."
    - User: "Add a roadmap slide."
    - AI: "Roadmap slide added with 4 milestones."
  - Floating input pill at bottom
- **Design tab**: Typography controls, spacing sliders (visual only)
- **Theme tab**: 6 theme cards grid (Modern Startup, Corporate, Academic, Minimal, Apple Inspired, Dark Mode) — each shows color swatches + font name + layout thumbnail

---

### Animation Details
- Page transitions: slide-in from right when navigating to builder
- Sidebar items: stagger fade-in on mount
- Slide thumbnail hover: subtle scale + border highlight
- Theme card hover: lift shadow + border-primary
- Chat messages: stagger fade-in-up on mount
- Suggestion chips: hover scale(1.02) + border color transition
- All transitions use `ease-[cubic-bezier(0.32,0.72,0,1)]` or spring physics

---

### Mobile Responsiveness
- Home sidebar: hidden below `lg:`, drawer toggle button appears
- Builder: below `md:`, left and right panels collapse; only canvas shown with nav
- Use `useState` for mobile drawer open state

---

## Critical Files to Modify
1. `src/styles/theme.css` — update tokens only, preserve `@theme inline`
2. `src/styles/fonts.css` — add Geist import
3. `src/app/App.tsx` — full replacement with router + screens

## Verification
- Navigate `/` → see home with sidebar, prompt, chips
- Click any suggestion chip or type in textarea → visual feedback
- Click "New Presentation" → navigates to `/builder`
- In builder, click different slide thumbnails → selection highlights
- Switch Right Panel tabs → AI / Design / Theme views render
- Click back arrow → returns to home
- Resize window to mobile width → sidebar hides, drawer toggle appears
