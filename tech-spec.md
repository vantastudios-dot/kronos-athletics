# CROSSFIT / ELITE FITNESS CLUB — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | React DOM renderer |
| `three` | ^0.160.0 | 3D engine for cloth simulation |
| `@types/three` | ^0.160.0 | TypeScript types for Three.js |
| `gsap` | ^3.12.0 | Animation engine (ScrollTrigger, SplitText) |
| `lenis` | ^1.0.0 | Smooth scroll |
| `tailwindcss` | ^3.4.0 | Utility CSS |
| `vite` | ^5.0.0 | Build tool |
| `@vitejs/plugin-react` | ^4.0.0 | Vite React plugin |
| `typescript` | ^5.3.0 | Type system |
| `@types/react` | ^18.2.0 | React type definitions |
| `@types/react-dom` | ^18.2.0 | ReactDOM type definitions |
| `autoprefixer` | ^10.4.0 | CSS vendor prefixes |
| `postcss` | ^8.4.0 | CSS processing |

## Component Inventory

### Layout

| Component | Source | Notes |
|-----------|--------|-------|
| `Navigation` | Custom | Fixed navbar with glassmorphism transition on scroll. Logo left, links center-right, CTA far right. Mobile: hamburger menu. |
| `Footer` | Custom | 4-column grid layout. Static content. |
| `ClothBackground` | Custom (Three.js) | Fixed full-viewport WebGL canvas. Runs independent animation loop. Contains cloth mesh + gradient background mesh. |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| `HeroSection` | Custom | Full-viewport centered content over cloth bg. Word-by-word GSAP entrance timeline. |
| `StatsBar` | Custom | 4-column stat grid with count-up animation. |
| `ProgramsSection` | Custom | Asymmetric 2-column layout, alternating sides. 4 program items. |
| `AboutSection` | Custom | 50/50 two-column with clip-path image reveal. |
| `TrainersSection` | Custom | Horizontal scroll-snap gallery. 6 trainer cards. |
| `TestimonialsSection` | Custom | Vertical stack of 3 glassmorphism testimonial cards. |
| `PricingSection` | Custom | 3-column pricing grid with featured card. |
| `CTASection` | Custom | Centered text with word-by-word reveal. |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| `GlassPanel` | Custom | Testimonial cards, trainer cards, pricing cards, navbar bg |
| `SectionHeader` | Custom | Programs, About, Trainers, Testimonials, Pricing — label + title pattern |
| `PillButton` | Custom | Hero CTA, About CTA, Pricing CTAs, CTA section — fill/outline variants |
| `ProgramCard` | Custom | ProgramsSection — image + content with alternating layout |
| `TrainerCard` | Custom | TrainersSection — avatar, name, role, bio, tags |
| `PricingCard` | Custom | PricingSection — tier, price, features, CTA |
| `TestimonialCard` | Custom | TestimonialsSection — quote, attribution, avatar |
| `StatCounter` | Custom | StatsBar — animated number count-up |
| `TagPill` | Custom | ProgramCard, TrainerCard — accent-colored pill tag |
| `WordReveal` | Custom | HeroSection, CTASection — GSAP split-text word-by-word animation |
| `ScrollReveal` | Custom | All sections — generic ScrollTrigger entrance animation wrapper |

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| **Real-time cloth simulation** | Three.js | Custom vertex/fragment shaders via `onBeforeCompile` on `MeshPhysicalMaterial`. 65x65 segmented plane with sine/cosine displacement. Dynamic `uTime` uniform incremented per frame. Background gradient mesh behind. | 🔒 High |
| **Hero entrance timeline** | GSAP | Single master timeline: label fade (600ms, delay 300ms) → "BE" reveal (800ms, delay 500ms) → "GREATER" reveal (800ms, delay 700ms) → subheadline (600ms, delay 900ms) → CTA scale (500ms, delay 1100ms) → scroll indicator (400ms, delay 1500ms). All `power3.out`. | Medium |
| **Word-by-word text reveal** | GSAP | `SplitText`-style manual word wrapping (span per word with `overflow: hidden` container). `gsap.fromTo` with `yPercent: 120 → 0`, `stagger: 0.08`, `ease: power3.out`. ScrollTrigger at `top 85%`. | Medium |
| **Staggered card entrance** | GSAP + ScrollTrigger | `gsap.utils.toArray` + `gsap.fromTo` with `y: 60 → 0`, `opacity: 0 → 1`, `stagger: 0.15`. Per-section ScrollTrigger at `top 80%`. | Low |
| **Stat count-up** | GSAP + ScrollTrigger | `gsap.to` on a proxy object with `snap` to integers. Update React state in `onUpdate`. Triggered on scroll enter. Duration 2s, `power2.out`. | Low |
| **Program card asymmetric reveal** | GSAP + ScrollTrigger | Content: `translateX(-60px → 0)`, Image: `translateX(60px → 0)`, both `opacity 0 → 1`, 800ms `power3.out`, image delayed 100ms. Tags stagger 80ms after card. | Medium |
| **About image clip-path reveal** | GSAP + ScrollTrigger | `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)`, 1000ms `power3.inOut`. Text content staggered fade+translateY, 600ms each, 120ms stagger. | Medium |
| **Parallax depth on images** | GSAP + ScrollTrigger | `gsap.to` with `yPercent: -15`, `scrub: true`, trigger `start: 'top bottom'`, `end: 'bottom top'`. | Low |
| **Navbar glassmorphism transition** | GSAP or CSS | Scroll listener at 100px threshold. CSS transition `background 300ms`, `backdrop-filter 300ms`. | Low |
| **Pricing featured card float** | GSAP | `gsap.to` with `y: "+=5"`, `yoyo: true`, `repeat: -1`, `duration: 1.5`, `ease: sine.inOut`. | Low |
| **Smooth scrolling** | Lenis | Global instance. `duration: 1.2`, custom easing. Integrated with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` and ticker RAF. | Medium |
| **Horizontal scroll gallery** | CSS | `scroll-snap-type: x mandatory`, `overflow-x: auto`, `scrollbar-width: none`. No JS library. | Low |
| **Hover states (buttons, cards, links)** | CSS | `transition` properties. Buttons: `scale(1.03)` + box-shadow glow. Cards: background opacity shift. Links: `scaleX` underline. All ≤300ms. | Low |

## State & Logic Plan

### Three.js ↔ React Bridge

The cloth simulation runs entirely outside React's render cycle. A single `ClothBackground` component creates the Three.js scene, camera, renderer, and animation loop inside a `useEffect`. The renderer's DOM element is appended to a container ref. All animation state (time, uniforms) lives in the Three.js world, not React state. The component only handles: (1) initial scene setup, (2) resize listener, (3) optional mouse move listener, (4) cleanup on unmount. No React re-renders are triggered by the animation loop.

### Lenis ↔ GSAP ScrollTrigger Integration

Lenis and GSAP ScrollTrigger require explicit synchronization. On init: `lenis.on('scroll', ScrollTrigger.update)` bridges Lenis scroll events to ScrollTrigger. `gsap.ticker.add((time) => lenis.raf(time * 1000))` drives Lenis from GSAP's ticker. `gsap.ticker.lagSmoothing(0)` prevents GSAP from compensating for Lenis-induced frame timing. This integration is set up once in a top-level `useEffect` and torn down on unmount.

### GSAP Context Pattern

Every component that uses GSAP animations wraps its setup in `gsap.context(() => { ... }, scopeRef)`. This ensures all ScrollTriggers and tweens created within a component are automatically reverted when the component unmounts, preventing memory leaks and orphaned triggers. The `scopeRef` points to the component's root DOM element, limiting selector scope.

### Reduced Motion Check

A single `useReducedMotion` hook reads `window.matchMedia('(prefers-reduced-motion: reduce)')`. Returns a boolean consumed by: (1) `ClothBackground` — freezes animation loop when true, (2) all ScrollTrigger components — skip entrance animations, show final state immediately, (3) Lenis — disabled, falls back to native scroll. The hook listens for media query changes so it responds to live preference toggles.

## Other Key Decisions

### Raw Three.js over React Three Fiber

The cloth simulation uses `onBeforeCompile` to patch `MeshPhysicalMaterial` shaders, requires precise control over the render loop timing, and has a single static scene with no dynamic object additions/removals. Raw Three.js in a `useEffect` is simpler and more direct than R3F's declarative model for this use case. The renderer's canvas is manually appended to a fixed container div.

### Manual Word Splitting over GSAP SplitText

The word-by-word reveal uses manually-wrapped `<span>` elements rather than GSAP's SplitText plugin. This avoids the SplitText dependency (GSAP club plugin) and gives explicit control over the DOM structure. A small utility function splits text into word spans at render time, applying the necessary `overflow: hidden` + `display: inline-block` CSS structure.

### No shadcn/ui Components

This is a fully custom-branded immersive experience with no standard UI patterns (forms, dialogs, tables, dropdowns). Every component is custom-styled to the dark fitness aesthetic. shadcn/ui would add overhead without value.
