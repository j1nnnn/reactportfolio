# Portfolio Redesign — Design Document

**Date:** 2026-03-28
**Status:** Approved
**Approach:** Vite + React migration, single-page scroll layout, visual modernization

---

## 1. Architecture & Tech Stack

### Build System
- **Migrate from CRA to Vite 6 + React 18**
- Keep SCSS for styling (familiar, no reason to switch)
- Deploy to GitHub Pages (same as today)

### Single-Page Scroll Layout
Consolidate 8 separate routed pages into one scrollable page with sections:

1. **Hero** — name, title, CTAs
2. **About** — bio + highlight reel
3. **Experience** — vertical timeline
4. **Skills** — categorized tech grid
5. **Projects** — card grid (extensible)
6. **Education** — NJIT + Georgia Tech
7. **Contact** — EmailJS form + direct links

### Navigation
- 80px sidebar on desktop becomes a **section navigator** (smooth-scroll, not routing)
- Active indicator tracks scroll position via Intersection Observer
- Mobile: hamburger menu with section links

### Removals
- React Router (single page, no routing needed)
- Separate Portfolio page (merged into Projects)
- Dashboard/Firebase admin (deferred — separate concern)
- GSAP trial (license issue — CSS animations + Intersection Observer instead)
- `<h1>`/`</h1>` HTML-tag pseudo-element decorations
- 3D CSS cube (replaced by skills grid)
- Ball-grid-beat loader on every page

### Kept
- Gold (#ffd700) accent color
- AnimatedLetters component (Hero only)
- Coolvetica heading font
- EmailJS contact form
- Firebase config (for future use)
- GitHub Pages deployment

---

## 2. Visual Design

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#ffd700` | Accent, links, active states |
| Background | `#0a0a0a` | Page background |
| Surface | `#141414` | Cards, section contrast |
| Text Primary | `#f0f0f0` | Headings, body text |
| Text Secondary | `#888888` | Dates, labels, muted text |
| Border | `rgba(255, 215, 0, 0.1)` | Subtle gold-tinted dividers |

### Typography
| Role | Font | Notes |
|------|------|-------|
| Headings | Coolvetica | Keep — brand identity |
| Body | Inter / system sans-serif | Cleaner than Helvetica Neue |
| Code/Labels | JetBrains Mono / monospace | Tech labels, skill tags |

Drop La Belle Aurore (only used for removed HTML-tag decorations).

### Animations
- **Hero:** AnimatedLetters for heading (signature effect, used here only)
- **Scroll reveals:** Fade-up on section enter via Intersection Observer
- **Skills:** Hover scale + subtle gold glow
- **Project cards:** Lift + shadow on hover
- **Sidebar:** Active dot indicator tracks scroll position
- **Page load:** Single subtle fade-in, no per-page loaders

### Layout & Responsive
- Hero: full viewport height, centered
- Experience: vertical timeline (alternating L/R on desktop, stacked mobile)
- Skills: grouped grid
- Projects: 2-3 column card grid (1 column mobile)
- Breakpoints: 768px (tablet), 1024px (desktop)

---

## 3. Content

### Hero
- "Hi, I'm Jin" with AnimatedLetters
- Primary: "Senior Software Engineer"
- Rotating subtitle: "Full-Stack" / "Cloud-Native" / "AI/ML" / "FinTech"
- CTAs: "View My Work" (scroll to Projects) + "Get In Touch" (scroll to Contact)

### About
- Rewritten bio — confident, forward-looking, no student-era tone
- Highlight reel row: `4+ Years at Wells Fargo` | `US Patent Holder` | `Georgia Tech M.S. (In Progress)` | `Hackathon Winner`

### Experience (from SSE resume)
- **Software Engineer** (2023 - Present): Playwright E2E release gate, asset allocation module, React/Zustand micro-frontend, Kafka-driven state sync
- **Technology Analyst** (2022 - 2023): US Patent, Scan2Invest hackathon, PCF cloud migration
- **Technology Intern** (2021): Test automation, onboarding infrastructure for 50+ engineers

### Skills (6 categories)
- Languages: Java, TypeScript, JavaScript, Python, R, SQL
- Frontend: React, Angular, Zustand, RxJS, Module Federation
- Backend: Spring Boot, Kafka, REST, Drools, OAuth/JWT
- Cloud & DevOps: OpenShift, Azure, Jenkins, Harness, Docker, Splunk
- Testing: Playwright, E2E Automation, HP ALM Octane
- Data & AI: MongoDB, Oracle, Python ML/LLM

### Projects
- Card grid, data-driven (array of objects for easy extension)
- Initial 3: Pro-Link AI, Human In Tech, this portfolio
- Each card: thumbnail/icon, name, description, tech tags, link

### Education
- Georgia Tech — M.S. Analytics (AI/ML) — In Progress
- NJIT — B.S. Computer Science — Cum Laude
- Minimal presentation — no coursework lists

### Contact
- EmailJS form: Name, Email, Subject, Message
- Direct links: LinkedIn (`linkedin.com/in/jinwoo-lim23`), GitHub, email
- Fix: update LinkedIn URL from old `cs22-jinwoo-lim`
