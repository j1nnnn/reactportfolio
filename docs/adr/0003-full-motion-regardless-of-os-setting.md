# 3. The site runs its full motion whatever the visitor's OS motion setting says

Date: 2026-11-10
Status: accepted (Jin's decision); amends ADR 0002 where it says the particle intro is never shown under reduced motion

## Context

The live site followed `prefers-reduced-motion`, as every animated effect was designed with a calm version. Jin's own Windows has "Animation effects" off, so the live site showed him the calm version: no particle intros, a still swing figure, the factory run shown all at once, frozen 3D scenes. Local reviews had forced full motion with a dev-only `?motion=full` switch, so nobody saw the difference until it was deployed.

Jin's decision: the site exists to show what he can build as an AI engineer, so every visitor gets the full animations regardless of their OS setting.

## Decision

- The site ignores `prefers-reduced-motion`. Every visitor gets the full motion: the island's idle animation, particle intros, the scroll-driven swing, the factory replay and the shader scenes.
- The calm versions stay in the code and are reachable only on purpose, with `?motion=reduced` (remembered for the browser tab). They are no longer chosen automatically.
- The dev-only `?motion=full` switch is gone: full motion is now the default everywhere.

## Consequences

- Visitors who turned motion off for motion sensitivity or vestibular reasons still get the animations. The intro stays skippable (Skip intro button and Escape) and ends on its own, and the HTML list of projects stays on the page.
- Tests fake the OS asking for reduced motion to prove the site ignores it, and use `?motion=reduced` to test the calm versions.
- The rule in `docs/design/references.md` still holds: every effect ships with a calm version. What changed is who switches it on.
