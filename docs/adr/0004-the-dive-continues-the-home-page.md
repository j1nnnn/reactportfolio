# 4. The dive continues the home page below the island

Date: 2026-11-11
Status: accepted (Jin chose it from two prototypes; prototype kept on the local branch `prototype/personal-brand`); amends ADR 0002, "the island is the home page"

## Context

The site showed Jin's featured work but not Jin: no About, experience, skills or smaller projects (spec #13). Two directions were prototyped for these personal sections: glass cards over a dark animated backdrop, and one continuous 3D world below the island. Jin chose the 3D world.

## Decision

- Below the island hero, the home page continues as the **dive**: a tall scroll region holding a pinned, procedural 3D world (sky fading to deep space, particles, crystals) that the camera flies through as the visitor scrolls.
- Each personal section is a **station** with a slice of the dive's scroll progress. Its glass panel flies in, holds, then flies past; one progress value drives both the camera and the panels.
- The sections stay real HTML in document order, prerendered, and are never hidden from assistive technology: off-screen panels are faded and moved, not hidden.
- A panel taller than the screen slides up through it while it holds, so the page's own scroll reads it. Panels never scroll on their own while the dive runs, because an inner scroller over most of a phone screen traps the visitor.
- Only one 3D scene runs at a time: the island pauses while the dive is on screen, and the dive's world renders only while it's on screen.
- The calm version (`?motion=reduced`, ADR 0003) has no dive: the sections stack as plain glass panels.

## Consequences

- The home page is several screens taller; each new station adds about 2.4 screens of scroll.
- Adding a station is a list entry plus its section.
- The camera flight and panel motion can't be tested in jsdom; they are checked by eye in a browser at desktop and phone width before merging.
