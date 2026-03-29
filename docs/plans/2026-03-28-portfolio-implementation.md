# Portfolio Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the portfolio from CRA to Vite, consolidate 8 routed pages into a single scrollable page, modernize visuals, and populate all content from the SSE resume.

**Architecture:** Single-page React app with section-based navigation. Sidebar becomes a scroll-position-aware navigator using Intersection Observer. All sections live as components rendered sequentially in App.jsx. No router needed.

**Tech Stack:** Vite 6, React 18, SCSS, EmailJS, FontAwesome, animate.css, gh-pages

---

## Task 1: Migrate from CRA to Vite

**Files:**
- Create: `vite.config.js`
- Create: `index.html` (move from `public/index.html` to root, adapt for Vite)
- Modify: `package.json` (swap deps and scripts)
- Rename: `src/index.js` -> `src/main.jsx`
- Rename: all `.js` component files -> `.jsx`
- Delete: `public/index.html` (moved to root)

**Step 1: Install Vite and plugins, remove CRA deps**

```bash
cd E:/Projects/reactportfolio
npm install vite @vitejs/plugin-react --save-dev
npm uninstall react-scripts
```

**Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/reactportfolio/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
```

**Step 3: Move and adapt `index.html` to project root**

Move `public/index.html` to root `index.html`. Key changes:
- Remove `%PUBLIC_URL%` references (Vite doesn't use this)
- Add `<script type="module" src="/src/main.jsx"></script>` before `</body>`
- Remove the EmailJS CDN script (already imported as npm package in Contact component)
- Update meta description from "create-react-app" to "Jinwoo Lim — Senior Software Engineer"
- Keep favicon and apple-touch-icon references but use `/` prefix instead of `%PUBLIC_URL%`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0a0a0a" />
    <meta name="description" content="Jinwoo Lim — Senior Software Engineer | Full-Stack | AI/ML | FinTech" />
    <link rel="apple-touch-icon" href="/apple-touch-icon-152x152.png" />
    <title>Jin Lim | Software Engineer</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 4: Rename `src/index.js` -> `src/main.jsx`**

Update contents — remove `BrowserRouter` wrapper, keep `React.StrictMode`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**Step 5: Update `package.json` scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Note: Vite outputs to `dist/` not `build/`, so `gh-pages -d dist`.

Also remove from package.json:
- `"eslintConfig"` block
- `"browserslist"` block

**Step 6: Remove packages no longer needed**

```bash
npm uninstall gsap-trial react-router-dom react-router-hash-link react-loaders loaders.css react-scroll react-leaflet
npm uninstall @testing-library/jest-dom @testing-library/react @testing-library/user-event web-vitals
```

Keep: `react`, `react-dom`, `@emailjs/browser`, `@fortawesome/*`, `animate.css`, `firebase`, `sass`, `gh-pages`

**Step 7: Rename all component `.js` files to `.jsx`**

Every file in `src/components/*/index.js` -> `index.jsx`, plus `src/App.js` -> `src/App.jsx`.

**Step 8: Delete CRA artifacts**

- Delete `src/reportWebVitals.js`
- Delete `src/setupTests.js`
- Delete `public/manifest.json` (CRA PWA artifact)
- Delete `public/robots.txt` if present
- Delete old `public/index.html` (now at root)

**Step 9: Verify the migration works**

```bash
npm run dev
```

Expected: Vite dev server starts, site loads at `http://localhost:5173/reactportfolio/` with existing content working.

**Step 10: Commit**

```bash
git add -A
git commit -m "chore: migrate from CRA to Vite 6"
```

---

## Task 2: Restructure to Single-Page Scroll Layout

**Files:**
- Rewrite: `src/App.jsx` (remove Routes, render sections sequentially)
- Rewrite: `src/components/Layout/index.jsx` (remove Outlet, add scroll container)
- Modify: `src/index.css` (update body styles for scroll, new color tokens)
- Rewrite: `src/App.scss` (remove pacman loader, update font-faces, add global variables)
- Rewrite: `src/components/Layout/index.scss` (remove all page-specific container styles)

**Step 1: Create new `src/App.jsx`**

```jsx
import './App.scss'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
    </div>
  )
}

export default App
```

**Step 2: Update `src/index.css` with new design tokens**

```css
:root {
  --color-primary: #ffd700;
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-text: #f0f0f0;
  --color-text-muted: #888888;
  --color-border: rgba(255, 215, 0, 0.1);
  --color-primary-dim: #b99e00;
  --sidebar-width: 80px;
  --font-heading: 'Coolvetica', sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  font-weight: 300;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (max-width: 768px) {
  :root {
    --sidebar-width: 0px;
  }
}
```

**Step 3: Update `src/App.scss`**

```scss
@import 'animate.css';

@font-face {
  font-family: 'Coolvetica';
  src: url('./assets/fonts/CoolveticaRg-Regular.woff2') format('woff2');
}

.app {
  display: flex;
  min-height: 100vh;
}

.main-content {
  margin-left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
  overflow-x: hidden;
}

section {
  min-height: 100vh;
  padding: 80px 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 60px 5%;
    min-height: auto;
  }
}

.section-heading {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 400;
  color: var(--color-primary);
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 24px;
  }
}
```

**Step 4: Delete old Layout component files**

Remove `src/components/Layout/index.jsx` and `src/components/Layout/index.scss` — their purpose (Outlet + body tags) is gone.

**Step 5: Delete components that are being removed**

- Delete `src/components/Portfolio/` (merged into Projects)
- Delete `src/components/Dashboard/` (deferred)
- Delete `src/components/Login/` (deferred)
- Delete `src/components/TextAnimations/` (unused)

**Step 6: Verify the app renders**

```bash
npm run dev
```

Expected: Page loads with sections stacked vertically (content will be placeholder until next tasks). No routing errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "refactor: convert to single-page scroll layout"
```

---

## Task 3: Rebuild Sidebar as Scroll Navigator

**Files:**
- Rewrite: `src/components/Sidebar/index.jsx`
- Rewrite: `src/components/Sidebar/index.scss`

**Step 1: Create scroll-aware Sidebar**

```jsx
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome, faUser, faBriefcase, faCode,
  faFolder, faGraduationCap, faEnvelope,
  faBars, faClose
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import LogoS from '../../assets/images/logo-dj.png'
import './index.scss'

const NAV_ITEMS = [
  { id: 'hero', icon: faHome, label: 'Home' },
  { id: 'about', icon: faUser, label: 'About' },
  { id: 'experience', icon: faBriefcase, label: 'Experience' },
  { id: 'skills', icon: faCode, label: 'Skills' },
  { id: 'projects', icon: faFolder, label: 'Projects' },
  { id: 'education', icon: faGraduationCap, label: 'Education' },
  { id: 'contact', icon: faEnvelope, label: 'Contact' },
]

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className="sidebar">
      <a className="logo" href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
        <img src={LogoS} alt="Jin Lim" />
      </a>

      <nav className={mobileOpen ? 'mobile-show' : ''}>
        {NAV_ITEMS.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`nav-item ${activeSection === id ? 'active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
          >
            <FontAwesomeIcon icon={icon} />
            <span className="nav-label">{label}</span>
          </button>
        ))}

        <button className="close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </nav>

      <div className="social-links">
        <a href="https://www.linkedin.com/in/jinwoo-lim23" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <a href="https://www.github.com/j1nnnn" target="_blank" rel="noreferrer" aria-label="GitHub">
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>

      <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  )
}

export default Sidebar
```

**Step 2: Write new Sidebar SCSS**

```scss
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  border-right: 1px solid var(--color-border);

  .logo {
    padding: 20px 0;
    img {
      width: 44px;
      height: auto;
    }
  }

  nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 100%;
  }

  .nav-item {
    background: none;
    border: none;
    color: #555;
    font-size: 20px;
    padding: 14px 0;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s;
    width: 100%;

    .nav-label {
      position: absolute;
      left: 80px;
      background: #1a1a1a;
      color: var(--color-text);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-family: var(--font-body);
      letter-spacing: 1px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    &:hover {
      color: var(--color-primary);
      .nav-label { opacity: 1; }
    }

    &.active {
      color: var(--color-primary);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: var(--color-primary);
        border-radius: 0 2px 2px 0;
      }
    }
  }

  .social-links {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    a {
      color: #555;
      font-size: 18px;
      text-align: center;
      transition: color 0.3s;
      &:hover { color: var(--color-primary); }
    }
  }

  .close-btn { display: none; }
  .hamburger-btn { display: none; }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    width: 100%;
    height: auto;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 20px;
    background: rgba(17, 17, 17, 0.95);
    backdrop-filter: blur(10px);
    border-right: none;
    border-bottom: 1px solid var(--color-border);

    .logo img { width: 36px; }

    nav {
      display: none;
      &.mobile-show {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(20px);
        justify-content: center;
        align-items: center;
        z-index: 20;
      }
    }

    .nav-item {
      font-size: 28px;
      padding: 16px;
      .nav-label {
        position: static;
        opacity: 1;
        background: none;
        font-size: 20px;
        margin-left: 16px;
      }
      &.active::before { display: none; }
    }

    .social-links { display: none; }
    .hamburger-btn {
      display: block;
      background: none;
      border: none;
      color: var(--color-primary);
      font-size: 24px;
      cursor: pointer;
    }
    .close-btn {
      display: block;
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: var(--color-primary);
      font-size: 28px;
      cursor: pointer;
    }
  }

  .main-content {
    margin-left: 0;
    width: 100%;
    padding-top: 60px;
  }
}
```

**Step 3: Verify sidebar navigation works**

```bash
npm run dev
```

Expected: Sidebar renders on left, clicking icons scrolls to sections, active indicator follows scroll position. Mobile hamburger menu works at <768px.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: rebuild sidebar as scroll-position-aware navigator"
```

---

## Task 4: Build Hero Section

**Files:**
- Rename & rewrite: `src/components/Home/` -> `src/components/Hero/`
- Create: `src/components/Hero/index.jsx`
- Create: `src/components/Hero/index.scss`
- Keep: `src/components/AnimatedLetters/` (reuse as-is)

**Step 1: Create Hero component**

```jsx
import { useEffect, useState } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const Hero = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [subtitleIndex, setSubtitleIndex] = useState(0)

  const nameArray = ['i', 'n']
  const subtitles = ['Full-Stack', 'Cloud-Native', 'AI / ML', 'FinTech']

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <h1 className="hero-greeting">
          <span className={letterClass}>H</span>
          <span className={`${letterClass} _12`}>i,</span>
          <br />
          <span className={`${letterClass} _13`}>I</span>
          <span className={`${letterClass} _14`}>'m </span>
          <span className="hero-name">
            <AnimatedLetters letterClass={letterClass} strArray={['J', ...nameArray]} idx={15} />
          </span>
        </h1>
        <h2 className="hero-title">Senior Software Engineer</h2>
        <div className="hero-subtitle">
          <span className="subtitle-text" key={subtitleIndex}>
            {subtitles[subtitleIndex]}
          </span>
        </div>
        <div className="hero-ctas">
          <a href="#projects" className="cta-primary">View My Work</a>
          <a href="#contact" className="cta-secondary">Get In Touch</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
```

**Step 2: Write Hero SCSS**

```scss
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 10%;
  background: radial-gradient(ellipse at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 70%);

  .hero-content {
    max-width: 700px;
  }

  .hero-greeting {
    font-family: var(--font-heading);
    font-size: 72px;
    font-weight: 400;
    color: var(--color-text);
    line-height: 1.1;
    margin-bottom: 16px;

    .hero-name {
      color: var(--color-primary);
    }
  }

  .hero-title {
    font-family: var(--font-body);
    font-size: 24px;
    font-weight: 300;
    color: var(--color-text-muted);
    margin-bottom: 12px;
    letter-spacing: 2px;
    animation: fadeIn 1s 1.8s backwards;
  }

  .hero-subtitle {
    height: 32px;
    margin-bottom: 40px;
    overflow: hidden;

    .subtitle-text {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 16px;
      color: var(--color-primary);
      letter-spacing: 1px;
      animation: fadeIn 0.5s ease-in;
    }
  }

  .hero-ctas {
    display: flex;
    gap: 16px;
    animation: fadeIn 1s 2.2s backwards;
  }

  .cta-primary {
    color: #111;
    background: var(--color-primary);
    padding: 12px 28px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    text-decoration: none;
    text-transform: uppercase;
    transition: all 0.3s;
    &:hover {
      background: #fff;
      transform: translateY(-2px);
    }
  }

  .cta-secondary {
    color: var(--color-primary);
    background: transparent;
    padding: 12px 28px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    text-decoration: none;
    text-transform: uppercase;
    border: 1px solid var(--color-primary);
    transition: all 0.3s;
    &:hover {
      background: rgba(255, 215, 0, 0.1);
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    padding: 0 5%;
    .hero-greeting { font-size: 48px; }
    .hero-title { font-size: 18px; }
    .hero-ctas { flex-direction: column; }
  }
}
```

**Step 3: Delete old Home component**

Remove `src/components/Home/` directory.

**Step 4: Verify Hero renders**

```bash
npm run dev
```

Expected: Full-viewport hero with animated "Hi, I'm Jin", rotating subtitles, and two CTA buttons.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build Hero section with animated greeting and rotating subtitles"
```

---

## Task 5: Build About Section

**Files:**
- Rewrite: `src/components/About/index.jsx`
- Rewrite: `src/components/About/index.scss`

**Step 1: Create About component with highlight reel**

```jsx
import './index.scss'

const HIGHLIGHTS = [
  { value: '4+', label: 'Years at Wells Fargo' },
  { value: 'US', label: 'Patent Holder' },
  { value: 'M.S.', label: 'Georgia Tech (In Progress)' },
  { value: '1st', label: 'Place Hackathon' },
]

const About = () => {
  return (
    <section id="about" className="about">
      <h2 className="section-heading">About Me</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            I'm a Senior Software Engineer at Wells Fargo with 4+ years of hands-on
            delivery in Wealth & Investment Management. I architect and ship
            production systems — React/Zustand micro-frontends, Java/Spring Boot
            microservices, Kafka event-driven pipelines, and business rules engines —
            while owning release governance through a Playwright E2E test automation
            program I built from scratch.
          </p>
          <p>
            I hold a US Patent for financial network security architecture, won a
            company-wide hackathon building a computer vision MVP in 48 hours, and I'm
            currently pursuing my M.S. in Analytics (AI/ML) at Georgia Tech. I'm
            driven by the intersection of engineering depth and product impact —
            building systems that solve real problems at scale.
          </p>
        </div>
        <div className="highlights">
          {HIGHLIGHTS.map(({ value, label }) => (
            <div className="highlight-card" key={label}>
              <span className="highlight-value">{value}</span>
              <span className="highlight-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
```

**Step 2: Write About SCSS**

```scss
.about {
  .about-content {
    max-width: 900px;
  }

  .about-text p {
    font-size: 17px;
    line-height: 1.8;
    color: var(--color-text);
    margin-bottom: 20px;
    font-weight: 300;
  }

  .highlights {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 40px;
  }

  .highlight-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 24px 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.3s;

    &:hover {
      border-color: var(--color-primary);
    }
  }

  .highlight-value {
    font-family: var(--font-heading);
    font-size: 32px;
    color: var(--color-primary);
  }

  .highlight-label {
    font-size: 13px;
    color: var(--color-text-muted);
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    .highlights {
      grid-template-columns: repeat(2, 1fr);
    }
    .about-text p {
      font-size: 15px;
    }
  }
}
```

**Step 3: Verify**

```bash
npm run dev
```

Expected: About section with bio text and 4 highlight cards in a row.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build About section with bio and highlight reel"
```

---

## Task 6: Build Experience Timeline

**Files:**
- Rewrite: `src/components/Experience/index.jsx`
- Rewrite: `src/components/Experience/index.scss`

**Step 1: Create Experience component with timeline data**

```jsx
import './index.scss'

const EXPERIENCES = [
  {
    role: 'Software Engineer',
    company: 'Wells Fargo',
    team: 'Wealth & Investment Technology — Portfolio Management',
    period: '2023 — Present',
    bullets: [
      'Sole engineer and SME for a Playwright E2E test automation program that gates every production release — built the entire test catalog from scratch across a micro-frontend platform.',
      'Own the platform\'s most complex asset allocation and billing workflow — a multi-persona, role-gated module serving Financial Advisor, Admin, and Operations views from a shared Zustand state model.',
      'Built dynamic, data-driven UI modules within a React/Zustand micro-frontend (Module Federation) architecture, consuming Kafka event streams for real-time state synchronization.',
      'Designed Spring Boot microservice endpoints for investment portfolio data aggregation, transformation, and serving to the React frontend.',
    ],
  },
  {
    role: 'Technology Analyst',
    company: 'Wells Fargo',
    team: 'Cloud Modernization & Innovation',
    period: '2022 — 2023',
    bullets: [
      'Awarded US Patent #US19372721 — designed a system for securing financial entity networks and presented technical justification to senior leadership for USPTO filing.',
      'Won WIMT Hackathon as tech lead for "Scan2Invest" — built a Computer Vision/AI mobile MVP in 48 hours; secured executive sponsorship.',
      'Executed zero-downtime PCF cloud migration of legacy investment applications.',
    ],
  },
  {
    role: 'Technology Intern',
    company: 'Wells Fargo',
    period: '2021',
    bullets: [
      'Built automated test suites catching critical pre-production defects; co-led IT onboarding infrastructure for 50+ engineers — model adopted for future cohorts.',
    ],
  },
]

const Experience = () => {
  return (
    <section id="experience" className="experience">
      <h2 className="section-heading">Experience</h2>
      <div className="timeline">
        {EXPERIENCES.map((exp, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-marker" />
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-role">{exp.role}</h3>
                  <span className="timeline-company">{exp.company}</span>
                  {exp.team && <span className="timeline-team">{exp.team}</span>}
                </div>
                <span className="timeline-period">{exp.period}</span>
              </div>
              <ul className="timeline-bullets">
                {exp.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience
```

**Step 2: Write Experience timeline SCSS**

```scss
.experience {
  .timeline {
    position: relative;
    max-width: 900px;
    padding-left: 40px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--color-border);
    }
  }

  .timeline-item {
    position: relative;
    margin-bottom: 48px;

    &:last-child { margin-bottom: 0; }
  }

  .timeline-marker {
    position: absolute;
    left: -46px;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 3px solid var(--color-bg);
  }

  .timeline-content {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 24px;
    transition: border-color 0.3s;

    &:hover { border-color: rgba(255, 215, 0, 0.3); }
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 16px;
  }

  .timeline-role {
    font-family: var(--font-heading);
    font-size: 22px;
    color: var(--color-text);
    font-weight: 400;
  }

  .timeline-company {
    display: block;
    font-size: 15px;
    color: var(--color-primary);
    margin-top: 2px;
  }

  .timeline-team {
    display: block;
    font-size: 13px;
    color: var(--color-text-muted);
    margin-top: 4px;
  }

  .timeline-period {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--color-text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .timeline-bullets {
    list-style: none;
    padding: 0;

    li {
      position: relative;
      padding-left: 20px;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.7;
      color: var(--color-text);
      font-weight: 300;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 6px;
        height: 6px;
        background: var(--color-primary);
        border-radius: 50%;
      }

      &:last-child { margin-bottom: 0; }
    }
  }

  @media (max-width: 768px) {
    .timeline { padding-left: 24px; }
    .timeline-marker { left: -30px; width: 10px; height: 10px; }
    .timeline-header { flex-direction: column; }
    .timeline-period { margin-top: 4px; }
    .timeline-content { padding: 16px; }
  }
}
```

**Step 3: Verify, then commit**

```bash
npm run dev
# verify timeline renders with 3 entries, gold markers, bullet points
git add -A
git commit -m "feat: build Experience timeline with resume content"
```

---

## Task 7: Build Skills Grid

**Files:**
- Rewrite: `src/components/Skills/index.jsx`
- Rewrite: `src/components/Skills/index.scss`

**Step 1: Create Skills component with categorized grid**

```jsx
import './index.scss'

const SKILL_CATEGORIES = [
  {
    name: 'Languages',
    skills: ['Java 17', 'TypeScript', 'JavaScript', 'Python 3', 'R', 'SQL'],
  },
  {
    name: 'Frontend',
    skills: ['React 18', 'Angular 15+', 'Zustand', 'RxJS', 'Module Federation', 'WCAG 2.1'],
  },
  {
    name: 'Backend',
    skills: ['Spring Boot 3', 'Kafka', 'REST', 'GraphQL', 'Drools', 'OAuth 2.0 / JWT'],
  },
  {
    name: 'Cloud & DevOps',
    skills: ['OpenShift', 'Azure', 'Jenkins', 'Harness CD', 'Docker', 'Splunk'],
  },
  {
    name: 'Testing',
    skills: ['Playwright', 'E2E Automation', 'HP ALM Octane', 'CI/CD Integration'],
  },
  {
    name: 'Data & AI',
    skills: ['MongoDB', 'Oracle DB', 'Python ML', 'LLM Prototyping'],
  },
]

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <h2 className="section-heading">Skills</h2>
      <div className="skills-grid">
        {SKILL_CATEGORIES.map((cat) => (
          <div className="skill-category" key={cat.name}>
            <h3 className="category-name">{cat.name}</h3>
            <div className="skill-chips">
              {cat.skills.map((skill) => (
                <span className="skill-chip" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
```

**Step 2: Write Skills SCSS**

```scss
.skills {
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    max-width: 1000px;
  }

  .skill-category {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 24px;
    transition: border-color 0.3s;

    &:hover { border-color: rgba(255, 215, 0, 0.3); }
  }

  .category-name {
    font-family: var(--font-heading);
    font-size: 18px;
    color: var(--color-primary);
    margin-bottom: 16px;
    font-weight: 400;
  }

  .skill-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-chip {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: rgba(255, 215, 0, 0.05);
    }
  }

  @media (max-width: 1024px) {
    .skills-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .skills-grid { grid-template-columns: 1fr; }
  }
}
```

**Step 3: Verify, then commit**

```bash
npm run dev
git add -A
git commit -m "feat: build Skills section with categorized chip grid"
```

---

## Task 8: Build Projects Section

**Files:**
- Rewrite: `src/components/Projects/index.jsx`
- Rewrite: `src/components/Projects/index.scss`

**Step 1: Create Projects component with extensible card grid**

The user will add more projects later — design the data array to be easily extended.

```jsx
import './index.scss'

const PROJECTS = [
  {
    name: 'Pro-Link AI',
    description: 'AI-powered golf swing analysis platform using MediaPipe pose estimation, DTW-based ghost comparison, and professional archetype matching. Full-stack with Next.js frontend and FastAPI backend.',
    tags: ['Next.js', 'React', 'FastAPI', 'MediaPipe', 'Python', 'AI/ML'],
    link: null, // add when deployed
    github: 'https://github.com/j1nnnn/AIProjectI',
  },
  {
    name: 'Human In Tech',
    description: 'Professional business website for a security camera and technology solutions company. Modern design with responsive layouts and service showcasing.',
    tags: ['React', 'Web Design', 'Responsive'],
    link: null,
    github: null,
  },
  {
    name: 'This Portfolio',
    description: 'Personal portfolio built with React and Vite. Single-page scroll design with animated interactions, Intersection Observer navigation, and EmailJS contact form.',
    tags: ['React', 'Vite', 'SCSS', 'EmailJS'],
    link: 'https://j1nnnn.github.io/reactportfolio/',
    github: 'https://github.com/j1nnnn/reactportfolio',
  },
]

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <h2 className="section-heading">Projects</h2>
      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <div className="project-card" key={project.name}>
            <div className="project-body">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="project-links">
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer">Live Demo</a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects
```

**Step 2: Write Projects SCSS**

```scss
.projects {
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    max-width: 1100px;
  }

  .project-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s;

    &:hover {
      border-color: rgba(255, 215, 0, 0.3);
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
  }

  .project-name {
    font-family: var(--font-heading);
    font-size: 22px;
    color: var(--color-text);
    font-weight: 400;
    margin-bottom: 12px;
  }

  .project-desc {
    font-size: 14px;
    line-height: 1.7;
    color: var(--color-text-muted);
    margin-bottom: 16px;
    font-weight: 300;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 20px;
  }

  .project-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-primary);
    background: rgba(255, 215, 0, 0.08);
    border: 1px solid rgba(255, 215, 0, 0.15);
    padding: 4px 10px;
    border-radius: 3px;
  }

  .project-links {
    display: flex;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--color-border);

    a {
      font-size: 13px;
      color: var(--color-primary);
      text-decoration: none;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 500;
      transition: color 0.3s;

      &:hover { color: var(--color-text); }
    }
  }

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
}
```

**Step 3: Verify, then commit**

```bash
npm run dev
git add -A
git commit -m "feat: build Projects section with extensible card grid"
```

---

## Task 9: Build Education Section

**Files:**
- Rewrite: `src/components/Education/index.jsx`
- Rewrite: `src/components/Education/index.scss`

**Step 1: Create Education component**

```jsx
import './index.scss'

const EDUCATION = [
  {
    school: 'Georgia Institute of Technology',
    degree: 'M.S. Analytics — Computational Data Science / AI/ML',
    period: 'In Progress',
    note: null,
  },
  {
    school: 'New Jersey Institute of Technology',
    degree: 'B.S. Computer Science — Ying Wu College of Computing',
    period: 'Sept 2018 — May 2022',
    note: 'Graduated Cum Laude',
  },
]

const CREDENTIALS = [
  'Azure AZ-900 Certified',
  'ISC2 Cybersecurity (In Progress)',
  'US Patent #US19372721',
]

const Education = () => {
  return (
    <section id="education" className="education">
      <h2 className="section-heading">Education & Credentials</h2>
      <div className="education-grid">
        {EDUCATION.map((edu) => (
          <div className="education-card" key={edu.school}>
            <h3 className="edu-school">{edu.school}</h3>
            <p className="edu-degree">{edu.degree}</p>
            <span className="edu-period">{edu.period}</span>
            {edu.note && <span className="edu-note">{edu.note}</span>}
          </div>
        ))}
      </div>
      <div className="credentials">
        {CREDENTIALS.map((cred) => (
          <span className="credential-badge" key={cred}>{cred}</span>
        ))}
      </div>
    </section>
  )
}

export default Education
```

**Step 2: Write Education SCSS**

```scss
.education {
  .education-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    max-width: 900px;
    margin-bottom: 32px;
  }

  .education-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 28px;
    transition: border-color 0.3s;
    &:hover { border-color: rgba(255, 215, 0, 0.3); }
  }

  .edu-school {
    font-family: var(--font-heading);
    font-size: 20px;
    color: var(--color-text);
    font-weight: 400;
    margin-bottom: 8px;
  }

  .edu-degree {
    font-size: 14px;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .edu-period {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--color-primary-dim);
  }

  .edu-note {
    display: block;
    font-size: 13px;
    color: var(--color-primary);
    margin-top: 8px;
    font-style: italic;
  }

  .credentials {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .credential-badge {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-text);
    background: rgba(255, 215, 0, 0.08);
    border: 1px solid var(--color-border);
    padding: 8px 16px;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .education-grid { grid-template-columns: 1fr; }
  }
}
```

**Step 3: Verify, then commit**

```bash
npm run dev
git add -A
git commit -m "feat: build Education section with credentials badges"
```

---

## Task 10: Rebuild Contact Section

**Files:**
- Rewrite: `src/components/Contact/index.jsx`
- Rewrite: `src/components/Contact/index.scss`

**Step 1: Create Contact component**

Keep EmailJS integration, add direct links, modernize form styling.

```jsx
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import './index.scss'

const Contact = () => {
  const formRef = useRef()

  const sendEmail = (e) => {
    e.preventDefault()
    emailjs
      .sendForm('service_dgrqdjh', 'template_1i5m6la', formRef.current, 'ESgAkwZi7oCyUfLpi')
      .then(
        () => {
          alert('Message sent successfully!')
          formRef.current.reset()
        },
        () => {
          alert('Failed to send — please try again.')
        }
      )
  }

  return (
    <section id="contact" className="contact">
      <h2 className="section-heading">Get In Touch</h2>
      <div className="contact-layout">
        <div className="contact-info">
          <p>
            I'm interested in ambitious projects and new opportunities. Whether you
            have a question or just want to connect, feel free to reach out.
          </p>
          <div className="contact-links">
            <a href="mailto:devj491@outlook.com">
              <FontAwesomeIcon icon={faEnvelope} /> devj491@outlook.com
            </a>
            <a href="https://www.linkedin.com/in/jinwoo-lim23" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>
            <a href="https://www.github.com/j1nnnn" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </div>
        </div>
        <form ref={formRef} onSubmit={sendEmail} className="contact-form">
          <div className="form-row">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
          </div>
          <input type="text" name="subject" placeholder="Subject" required />
          <textarea name="message" placeholder="Message" rows="6" required />
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </section>
  )
}

export default Contact
```

**Step 2: Write Contact SCSS**

```scss
.contact {
  .contact-layout {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 48px;
    max-width: 1000px;
  }

  .contact-info {
    p {
      font-size: 16px;
      line-height: 1.8;
      color: var(--color-text-muted);
      margin-bottom: 24px;
    }
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 12px;

    a {
      color: var(--color-text);
      text-decoration: none;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: color 0.3s;

      svg { color: var(--color-primary); width: 18px; }
      &:hover { color: var(--color-primary); }
    }
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    input, textarea {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      padding: 14px 16px;
      font-size: 14px;
      color: var(--color-text);
      font-family: var(--font-body);
      outline: none;
      transition: border-color 0.3s;

      &::placeholder { color: #555; }
      &:focus { border-color: var(--color-primary); }
    }

    textarea { resize: vertical; }
  }

  .submit-btn {
    background: var(--color-primary);
    color: #111;
    border: none;
    padding: 14px 32px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
    align-self: flex-start;

    &:hover {
      background: #fff;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    .contact-layout {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .contact-form .form-row {
      grid-template-columns: 1fr;
    }
  }
}
```

**Step 3: Verify, then commit**

```bash
npm run dev
git add -A
git commit -m "feat: rebuild Contact section with direct links and modern form"
```

---

## Task 11: Add Scroll Reveal Animations

**Files:**
- Create: `src/hooks/useScrollReveal.js`
- Modify: all section components to use the hook

**Step 1: Create scroll reveal hook**

```jsx
import { useEffect, useRef, useState } from 'react'

const useScrollReveal = (options = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, ...options }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

export default useScrollReveal
```

**Step 2: Add CSS for reveal animation in `App.scss`**

```scss
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  &.revealed {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Step 3: Apply to each section component**

In each section component, wrap content with the hook:

```jsx
import useScrollReveal from '../../hooks/useScrollReveal'

// Inside component:
const [ref, isVisible] = useScrollReveal()

// On the section element:
<section id="about" className={`about reveal ${isVisible ? 'revealed' : ''}`} ref={ref}>
```

Apply to: About, Experience, Skills, Projects, Education, Contact (NOT Hero — it's always visible).

**Step 4: Verify animations work on scroll, then commit**

```bash
npm run dev
git add -A
git commit -m "feat: add scroll reveal animations via Intersection Observer"
```

---

## Task 12: Clean Up & Deploy

**Files:**
- Clean: remove unused assets, old component directories
- Modify: `package.json` verify homepage is correct
- Add: `.gitignore` entries for Vite (`dist/`)

**Step 1: Remove unused files**

- Delete `src/components/Portfolio/` (merged into Projects)
- Delete `src/components/Dashboard/` (deferred)
- Delete `src/components/Login/` (deferred)
- Delete `src/components/TextAnimations/` (unused)
- Delete `src/components/Home/` (replaced by Hero)
- Delete `src/data/portfolio.json` (unused)
- Delete `src/firebase.js` (deferred — can re-add when dashboard is needed)
- Delete `src/assets/fonts/LaBelleAurore.woff2` and `.woff` (font no longer used)
- Delete `src/assets/fonts/helvetica-neu.ttf` (replaced by Inter/system font)
- Clean up `._*` macOS metadata files

**Step 2: Update `.gitignore`**

Add:
```
dist/
.vite/
```

**Step 3: Verify build works**

```bash
npm run build
npm run preview
```

Expected: Production build succeeds, preview serves correctly at localhost.

**Step 4: Deploy to GitHub Pages**

```bash
npm run deploy
```

Expected: Site deploys to `https://j1nnnn.github.io/reactportfolio/`

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: clean up unused files and verify production build"
```

---

## Summary

| Task | Description | Commit |
|------|-------------|--------|
| 1 | CRA to Vite migration | `chore: migrate from CRA to Vite 6` |
| 2 | Single-page scroll layout | `refactor: convert to single-page scroll layout` |
| 3 | Sidebar scroll navigator | `feat: rebuild sidebar as scroll-position-aware navigator` |
| 4 | Hero section | `feat: build Hero section with animated greeting` |
| 5 | About section | `feat: build About section with bio and highlight reel` |
| 6 | Experience timeline | `feat: build Experience timeline with resume content` |
| 7 | Skills grid | `feat: build Skills section with categorized chip grid` |
| 8 | Projects cards | `feat: build Projects section with extensible card grid` |
| 9 | Education section | `feat: build Education section with credentials badges` |
| 10 | Contact section | `feat: rebuild Contact section with modern form` |
| 11 | Scroll animations | `feat: add scroll reveal animations` |
| 12 | Cleanup & deploy | `chore: clean up and verify production build` |
