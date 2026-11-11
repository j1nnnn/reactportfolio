# Glossary

- **Visitor**: anyone reading the site; usually a recruiter or hiring manager, often on a phone.
- **Island**: the home page's 3D scene, a low-poly island holding one building per featured project.
- **Building**: a featured project's object on the island. Selecting it opens the project card.
- **Project card**: the panel that opens when a building is selected: name, status, one-line summary, link to the case study.
- **Featured work**: the six headline projects (Pro-Link AI, Software Factory, JEPA, TurfGame, Claude API agent, the patent).
- **Case study**: a featured project's own page at `/work/<slug>`.
- **Theme**: a case study's colours, type and signature visual.
- **Particle intro**: the title page that opens every case study: particles form the project's name, then burst to reveal the page.
- **Contact actions**: the three ways to reach Jin: Email, Download résumé, Book a call.
- **Reduced-motion mode**: the calm version shown when the visitor's OS asks for less motion: no particle intro, no 3D animation, no scroll-driven motion, content in its final state.
- **Deploy guard**: the check that runs over the built site before every deploy (pages exist, link previews present, links resolve, no phone number or blocked internal name).
- **Blocked-name list**: the local, uncommitted list of internal names the deploy guard refuses to publish.
- **Personal sections**: the home page sections about Jin himself rather than his featured work: About, then Experience, Skills and Other projects. Each is a station in the dive.
- **Dive**: the home page's continuation below the island. A tall scroll region holds a pinned 3D world the camera flies through as the visitor scrolls; one scroll-progress value (0 to 1) drives the camera and the panels. The calm version has no dive and stacks the personal sections as plain glass panels.
- **Station**: one personal section's stop in the dive. It owns a slice of the dive's progress; within it the section's panel flies in, holds while it's read (sliding up through the screen if it's taller than the screen), then flies past. The last station stays. Its anchor (`#about`) lands where its panel has arrived.
- **Placeholder**: copy that holds a place until Jin supplies the real thing (his photo, his personal line). The deploy guard refuses to publish a placeholder.
