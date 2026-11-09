// DRAFT content for the case studies. Every claim is quoted or closely paraphrased from cv.md or
// article-digest.md (career-ops). Don't add a number or a claim that isn't in one of those files.

export type ProjectId = "prolink" | "factory" | "jepa" | "turf" | "agent" | "patent";

export type Theme = { bg: string; ink: string; muted: string; accent: string; panel: string };

export type Project = {
  id: ProjectId;
  slug: string;
  name: string;
  introWord: string;
  status: string;
  blurb: string;
  privateRepo: boolean;
  theme: Theme;
  built: string[];
  numbers: { value: string; label: string }[];
  stack: string[];
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    id: "prolink",
    slug: "pro-link-ai",
    name: "Pro-Link AI",
    introWord: "Pro-Link AI",
    status: "Personal project, in production use",
    blurb: "Real-time AI golf swing analysis, built for and in use by a golf coach in South Korea.",
    privateRepo: true,
    theme: { bg: "#0f1a24", ink: "#ece9e2", muted: "#8fa3b3", accent: "#3fe0c5", panel: "#182836" },
    built: [
      "A launcher with a state machine (git pull, dependency check, smoke test, service restart, rollback on failure) for zero-downtime private distribution.",
      "Smoke-test-gated rollouts with automatic rollback, and a Cloudflare Workers telemetry relay.",
      "Full Korean and English i18n, and a real feedback loop with a non-technical end user.",
      "AI-directed development with Claude Code, with ADRs and formal premortems before major features.",
    ],
    numbers: [
      { value: "1,000+", label: "automated tests (800+ backend, 245 frontend)" },
      { value: "401", label: "commits since February 2026" },
      { value: "~170", label: "translated strings, Korean and English" },
    ],
    stack: ["Next.js 14", "React 18", "TypeScript", "FastAPI", "Anthropic API", "MediaPipe", "Turborepo", "Cloudflare Workers"],
  },
  {
    id: "factory",
    slug: "software-factory",
    name: "Software Factory",
    introWord: "Software Factory",
    status: "Personal prototype: draft PRs opened, none merged yet",
    blurb: "A Python orchestrator that turns Linear tickets into draft pull requests using sandboxed, headless Claude Code workers.",
    privateRepo: true,
    theme: { bg: "#1a1426", ink: "#ede7f6", muted: "#a99cc2", accent: "#ffb547", panel: "#241c35" },
    built: [
      "Triage by schema-constrained LLM judges (Claude Haiku via JSON schema).",
      "Headless Claude Code workers dispatched into isolated git worktrees, with tool allowlists and turn and dollar budget caps.",
      "A clean-checkout verify step and a fail-closed secret scan before any draft PR is opened.",
      "Per-run cost and latency logged to a SQLite ledger; exposed as an MCP server and a Claude Code plugin.",
    ],
    numbers: [
      { value: "443", label: "test functions" },
      { value: "9", label: "ADRs" },
      { value: "$0.12–$0.74", label: "per ticket in live runs" },
    ],
    stack: ["Python 3.11", "Linear GraphQL", "Claude Code", "Claude Haiku", "SQLite", "MCP"],
  },
  {
    id: "jepa",
    slug: "jepa",
    name: "JEPA",
    introWord: "JEPA",
    status: "Personal planning agent, in daily trial since October 2026",
    blurb: "A planning agent that builds a time-blocked day from my calendar and goals, and checks in on Discord.",
    privateRepo: true,
    theme: { bg: "#eef6f5", ink: "#12302e", muted: "#4d6b68", accent: "#12a39a", panel: "#ffffff" },
    built: [
      "A Python CLI (Typer, httpx) that builds the time-blocked daily plan and posts check-ins to Discord on a GitHub Actions schedule.",
      "A Supabase Postgres store with a pg_cron dispatcher; a scheduled Claude Code routine reads the calendar and drives the CLI.",
      "Logic lives in a deterministic CLI, so the scheduled check-in tick uses no LLM quota.",
      "A GitHub-API security watchlist auditing repo collaborators, deploy keys, webhooks and secrets; SHA-pinned actions.",
    ],
    numbers: [
      { value: "383", label: "unit tests" },
      { value: "43 of 43", label: "scheduled runs succeeded (as of 2026-11-03)" },
      { value: "19", label: "PRs in 15 days" },
      { value: "6", label: "ADRs" },
    ],
    stack: ["Python", "Typer", "httpx", "Supabase Postgres", "pg_cron", "GitHub Actions", "Claude Code", "Discord"],
  },
  {
    id: "turf",
    slug: "turfgame",
    name: "TurfGame",
    introWord: "TurfGame",
    status: "Personal project, in development: milestones M0 and M1 passed",
    blurb: "A deterministic, engine-free simulation of an 8-faction territory game, with a Godot front end.",
    privateRepo: true,
    theme: { bg: "#141824", ink: "#e9ecef", muted: "#9aa3b5", accent: "#ffcc00", panel: "#1d2333" },
    built: [
      "A headless C#/.NET 10 simulation with a Godot 4.7 .NET front end and JSON game data.",
      "Determinism enforced with banned-API analyzers, IL-scanning architecture tests, golden saves and two-process verification.",
      "A balance sweep and benchmark gates on every change.",
      "Built through a ticket-to-worktree-to-PR workflow, AI-directed with Claude Code.",
    ],
    numbers: [
      { value: "~0.385 ms", label: "per tick at 400 characters" },
      { value: "50/50", label: "sweep seeds pass" },
      { value: "350+", label: "xUnit tests" },
      { value: "41", label: "merged PRs, 12 ADRs" },
    ],
    stack: ["C#", ".NET 10", "Godot 4.7", "xunit.v3", "FluentAssertions"],
  },
  {
    id: "agent",
    slug: "claude-api-agent",
    name: "Claude API agent",
    introWord: "Test Agent",
    status: "Wells Fargo, in production",
    blurb: "A production Claude API agent that generates, validates and self-heals Playwright test scripts.",
    privateRepo: false,
    theme: { bg: "#f4f2ff", ink: "#1f1640", muted: "#5b5280", accent: "#7c5cff", panel: "#ffffff" },
    built: [
      "Designed the agent: it generates Playwright test scripts, validates them, and self-heals them when they break.",
      "Built the evaluation framework that measures it.",
      "Built the confidence-gated rollouts that decide when its output ships.",
    ],
    numbers: [],
    stack: ["Claude API", "Playwright", "TypeScript"],
  },
  {
    id: "patent",
    slug: "patent",
    name: "Patent US 12,470,530 B2",
    introWord: "Patent",
    status: "Co-inventor, granted November 2025",
    blurb: "System and Method for Securing Financial Entity Networks.",
    privateRepo: false,
    theme: { bg: "#14161a", ink: "#f1ede4", muted: "#a59f92", accent: "#e3b341", panel: "#1e2127" },
    built: [
      "Identified an architectural gap in enterprise financial network security.",
      "Engineered the solution.",
      "Presented the technical and business ROI to senior leadership for USPTO filing.",
    ],
    numbers: [],
    stack: [],
    link: { label: "Read the public patent record", href: "https://patents.google.com/patent/US12470530B2/en" },
  },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const byId = (id: ProjectId) => projects.find((p) => p.id === id)!;
