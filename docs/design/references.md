# Design references

Jin's references for the site's UI, with what to take from each. Read this before designing or building any UI here.
Jin owns the visual direction: build what he describes, and offer options only when he asks.

## What Jin likes (his words)

- "As flashy as possible": rich motion, 3D in the hero, micro-interactions, page transitions.
- "I really like these types of 3D UI": clickable miniature 3D worlds (references 4 and 5 below).

## References

### 1. Clickable 3D world dashboard (Instagram, nocode.joshua, Oct 2026) — Jin's favourite
An isometric, low-poly miniature of a business (warehouse, vans, shelves) built with Three.js. Clicking any object opens a stats card for it.
- Take: an isometric orthographic camera, low-poly objects, every object clickable and opening a card. The 3D scene is the navigation, not decoration.

### 2. AI agents' office (Instagram, bexruz.khamidullaev, Oct 2026)
A cutaway 3D office building where AI agents work in rooms.
- Take: a dollhouse cutaway where you see work happening inside; small idle animations make it feel alive.

### 3. Glassmorphism dashboard (Instagram, code.xr, "Dashboard V22", Nov 2026)
A blue-and-white dashboard with frosted-glass panels, soft glow and smooth hover transitions (React + CSS).
- Take: frosted panels for overlay cards (for example the card that opens from a 3D object), and calm hover transitions.

### 4. Animated UI libraries (Instagram, louis_rlee, Nov 2026)
Vengeance UI, Animate UI (animated shadcn components), Uiverse (community CSS elements), Forge UI (copy-paste blocks on Motion + GSAP), UI Lora.
- Take: sources for micro-interactions. **Not yet vetted**: check each one's license and code before copying anything in, and prefer rebuilding a pattern over pasting a large block.

### 5. Rune (github.com/anomalyco/rune, MIT, pre-release, Oct 2026)
A Rust UI framework that draws everything on the GPU; its web target is a single WebGPU canvas.
- Don't use it as the site's framework: with no real HTML text there is no SEO, screen-reader access or link previews, and it breaks the spec's "content readable before JavaScript" rule.
- Take: its effects (liquid metal, fluted glass, grain and mesh gradients, dither, glow) as ideas for Three.js shaders; its rule that **every effect ships with a reduced-motion version**; and its loop of agents checking their own work by rendering screenshots and reading the element tree.

## Rules that follow from these

- A 3D scene that navigates must have an HTML equivalent (a list of links or buttons) for keyboard, screen-reader, reduced-motion and no-WebGL visitors.
- Every animated or shader effect has a reduced-motion version designed at the same time, not added later. Since ADR 0003 the site does not switch to it from the OS setting; only `?motion=reduced` does.
- Prefer procedural low-poly geometry over large 3D model downloads, to keep the mobile performance floor.
