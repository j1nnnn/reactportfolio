# 1. Next.js static export on GitHub Pages

Date: 2026-11-08
Status: accepted

## Context

The old site was a Vite single-page app. Each case study needs its own URL with real HTML, so a link pasted into LinkedIn or Slack unfurls with that project's title and image, and search engines can read it. The site stays on GitHub Pages at the same address.

## Decision

Next.js 16 (App Router) with `output: "export"` and `basePath: "/reactportfolio"`, React 19, TypeScript 7, Vitest for tests. Deploy stays manual: build, run the deploy guard, publish `out/` to the `gh-pages` branch.

## Consequences

- Every route is prerendered HTML, so content is readable before any script runs.
- GitHub Pages can't send HTTP headers, so the Content Security Policy goes in a meta tag.
- No server: the later AI assistant needs its own host (agreed shape in the spec, issue #5).
- `next dev` writes an `AGENTS.md` with Next's agent rules; it is committed so the tree stays clean.
