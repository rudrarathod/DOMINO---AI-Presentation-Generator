---
name: Lumina Directive
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#c3c0ff'
  on-secondary: '#1d00a5'
  secondary-container: '#3626ce'
  on-secondary-container: '#b3b1ff'
  tertiary: '#ffb869'
  on-tertiary: '#482900'
  tertiary-container: '#ca801e'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#ffdcbb'
  tertiary-fixed-dim: '#ffb869'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-base:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-label:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for a premium AI-driven presentation platform where intelligence meets cinematic execution. The brand personality is **sophisticated, technical, and high-velocity**, targeting professionals who demand the utility of a workspace with the polish of a high-end design agency.

The aesthetic is **Modern Minimalist with Glassmorphic accents**, heavily inspired by the precision of developer tools and the clarity of modern AI interfaces. It prioritizes content density without sacrificing breathing room, utilizing a "Substrate" layering system where the UI feels like floating panes over a deep, infinite canvas. Visual interest is generated through light-leak gradients, micro-interactions, and a strict adherence to a technical, geometric grid.

## Colors

The palette centers on a **Deep Space** foundation to maximize the vibrance of AI-generated content.

- **Primary & Secondary:** A gradient axis between *Electric Violet* and *Deep Indigo* is used exclusively for primary actions, focus states, and AI-active indicators. 
- **Neutral/Background:** The default state is Dark. `#09090B` serves as the base layer, with `#18181B` and `#27272A` providing surface depth.
- **Accents:** Use subtle, low-opacity tints of the Primary color for "glow" effects and background blurs behind glassmorphic panels.
- **Status:** Functional colors (Success, Warning, Error) are desaturated to maintain the high-end aesthetic, only becoming vibrant on interaction.

## Typography

This design system utilizes **Geist** for its technical precision and geometric neutrality. 

- **Hierarchy:** Dramatic contrast between Display sizes and Body text. Use `display-lg` for slide titles and `body-base` for primary interface text.
- **Tracking:** Tighten tracking on large headings (`-0.04em`) to create a "locked-in" editorial look. Increase tracking slightly for `label-caps`.
- **Functionality:** Use the monospaced stylistic sets of Geist for data points, slide numbers, and AI "thinking" states to evoke a sense of computational speed.

## Layout & Spacing

The layout philosophy follows a **Modular Fluid Grid** based on a 4px baseline.

- **The Stage:** The central presentation canvas is treated as a "fixed-aspect" container that scales to fit the viewport, floating above the interface.
- **Sidebars:** Collapsible panels (Navigation and AI Chat) use a fixed width of 280px to maintain consistent workspace density.
- **Margins:** Generous outer margins (40px on desktop) create the high-end gallery feel.
- **Grid:** A 12-column system is used for dashboard views, while the editor uses a "No Grid" contextual approach with smart-snapping guides for AI-placed elements.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Tonal Layering** rather than traditional heavy shadows.

- **Level 0 (Base):** `#09090B` — The infinite canvas.
- **Level 1 (Panels):** `#121214` with a 1px border of `#27272A`. This is used for sidebars and toolbars.
- **Level 2 (Modals/Floating UI):** Semi-transparent surfaces (80% opacity) with a `24px` backdrop blur. 
- **Shadows:** Use a single "Ambient Glow" for active cards: `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139, 92, 246, 0.1)`.
- **Transitions:** All state changes must use a `spring` physics curve (stiffness: 300, damping: 30) for a fluid, organic feel.

## Shapes

The shape language balances modern approachability with professional structure.

- **Primary Radius:** `12px` (rounded-lg) for standard cards, inputs, and buttons.
- **Large Radius:** `16px` (rounded-xl) for main workspace containers and major modal overlays.
- **Interactive Elements:** Use `rounded-full` for toggle switches and status chips to distinguish them from structural layout blocks.
- **Borders:** All borders should be 1px wide. Avoid thicker borders to maintain the "Linear-style" precision.

## Components

### Buttons
- **Primary:** Gradient background (Electric Violet to Deep Indigo), white text, subtle top-inner-white border (0.1 opacity) to simulate a physical edge.
- **Secondary:** Ghost style. Transparent background, `1px` border of `#27272A`, white text. On hover, background becomes `#18181B`.

### AI Chat Interface
- **Input:** A floating pill-shaped text area with a `24px` backdrop blur. The "Send" button is a simple icon that glows when text is present.
- **Messages:** AI responses appear with a subtle "shimmer" loading state. No message bubbles; instead, use typography and icons to distinguish speakers.

### Cards & Presentation Slides
- Slides are rendered with a crisp 1px border.
- Active state: The border transitions to the Primary gradient with a soft outer glow.

### Inputs & Selects
- Inputs are dark (`#0C0C0E`) with a soft-focus state that illuminates the border in the primary color.
- Labels are always `label-caps` positioned 8px above the input.

### Navigation & Toolbars
- Floating toolbars should use the glassmorphic style with a `blur(12px)` background.
- Icons are 20px, stroke-based (1.5px weight), desaturated gray, turning white on active.