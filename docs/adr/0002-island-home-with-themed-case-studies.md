# 2. The island is the home page; each case study has its own theme

Date: 2026-11-08
Status: accepted (Jin chose it from four prototypes; prototype kept on branch `prototype/portfolio-draft-1`)

## Context

Four hero directions were prototyped: A, a scroll-driven motion-capture swing; B, particle type; C, a control-room console over a network graph; D, a clickable low-poly island. Jin chose D as the main UI and asked for A, B and C to be reused where they fit, because each suits one project.

## Decision

- **Home**: the island is the hero and the Featured work navigation. Each featured project is a building; selecting one opens its card, which links to its case study.
- **Particle intro**: every case study opens with B's particle title (the project's name, in its colours), skippable, and never shown under reduced motion.
- **Pro-Link AI** case study is built on A's scroll-driven swing; each swing phase carries one chapter about the system.
- **Software Factory** case study is built on C's console and network graph, with a pipeline rail showing each stage.
- **Other case studies** open on their own island building, enlarged, in their own colours; the patent page uses a liquid-metal shader.

## Consequences

- The 3D scene is navigation, so an HTML equivalent (links to every case study) is always on the page for keyboard, screen-reader, no-WebGL and reduced-motion visitors.
- Each case study has a theme (colours, type, signature visual) defined with its content.
- Heavy 3D is code-split per page; buildings are procedural low-poly geometry, not downloaded models.
