// DRAFT content for the case studies. Every claim is quoted or closely paraphrased from cv.md or
// article-digest.md (career-ops). Don't add a number or a claim that isn't in one of those files.

export type ProjectId = "prolink" | "factory" | "jepa" | "hitagent" | "sweep" | "fantasy" | "citibike" | "agent" | "patent";

export type Theme = { bg: string; ink: string; muted: string; accent: string; panel: string };

export type Project = {
  id: ProjectId;
  slug: string;
  name: string;
  introWord: string;
  status: string;
  blurb: string;
  privateRepo: boolean;
  /** One of Jin's main projects, with a building on the island. The others keep their page, linked from Experience. */
  onIsland: boolean;
  theme: Theme;
  built: string[];
  numbers: { value: string; label: string }[];
  stack: string[];
  link?: { label: string; href: string };
  /**
   * Screens for a private project, whose code can't be shown. A shot without an image is a designed
   * placeholder; to add one, put the file in public/shots/ and set `image` to "/shots/<file>".
   * Pro-Link AI shots must never show the coach's or a student's face or name.
   */
  shots?: Shot[];
};

export type Shot = { caption: string; image?: string };

export const projects: Project[] = [
  {
    id: "prolink",
    slug: "pro-link-ai",
    name: "Pro-Link AI",
    introWord: "Pro-Link AI",
    status: "Personal project, in production use",
    blurb: "Real-time AI golf swing analysis, built for and in use by a golf coach in South Korea.",
    privateRepo: true,
    onIsland: true,
    theme: { bg: "#0f1a24", ink: "#ece9e2", muted: "#8fa3b3", accent: "#3fe0c5", panel: "#182836" },
    built: [
      "A launcher with a state machine (git pull, dependency check, smoke test, service restart, rollback on failure) for zero-downtime private distribution.",
      "Smoke-test-gated rollouts with automatic rollback, and a Cloudflare Workers telemetry relay.",
      "Full Korean and English i18n, and a real feedback loop with a non-technical end user.",
      "AI-directed development with Claude Code, with ADRs and formal premortems before major features.",
    ],
    numbers: [
      { value: "1,100+", label: "automated tests (850 backend, 290 frontend)" },
      { value: "440+", label: "commits since February 2026" },
      { value: "~170", label: "translated strings, Korean and English" },
    ],
    stack: ["Next.js 14", "React 18", "TypeScript", "FastAPI", "Anthropic API", "MediaPipe", "Turborepo", "Cloudflare Workers"],
    shots: [
      { caption: "The live swing view, with the pose overlay and fault markers" },
      { caption: "A swing compared side by side with a pro's" },
      { caption: "The same screen in Korean and in English" },
    ],
  },
  {
    id: "factory",
    slug: "software-factory",
    name: "Software Factory",
    introWord: "Software Factory",
    status: "Personal, in use on my own repos: worker PRs reviewed and merged by me",
    blurb: "A Python orchestrator that turns Linear tickets into draft pull requests using sandboxed, headless Claude Code workers.",
    privateRepo: true,
    onIsland: true,
    theme: { bg: "#1a1426", ink: "#ede7f6", muted: "#a99cc2", accent: "#ffb547", panel: "#241c35" },
    built: [
      "Triage by schema-constrained LLM judges (Claude Haiku via JSON schema).",
      "Headless Claude Code workers dispatched into isolated git worktrees, with tool allowlists and turn and dollar budget caps.",
      "A clean-checkout verify step and a fail-closed secret scan before any draft PR is opened.",
      "Per-run cost and latency logged to a SQLite ledger; exposed as an MCP server and a Claude Code plugin.",
    ],
    numbers: [
      { value: "18", label: "worker PRs merged across three repos" },
      { value: "$0.76", label: "median per build ($0.01–$2.89, 30 costed builds)" },
      { value: "540+", label: "test functions" },
      { value: "10", label: "ADRs" },
    ],
    stack: ["Python 3.11", "Linear GraphQL", "Claude Code", "Claude Haiku", "SQLite", "MCP"],
    shots: [
      { caption: "A draft pull request opened by a worker, with its verify and secret-scan results" },
      { caption: "The SQLite ledger of per-run cost and latency" },
    ],
  },
  {
    id: "jepa",
    slug: "jepa",
    name: "JEPA",
    introWord: "JEPA",
    status: "Personal planning agent, in daily trial since October 2026, daily use from November 16",
    blurb: "A planning agent that builds a time-blocked day from my calendar and goals, and checks in through GitHub issues.",
    privateRepo: true,
    onIsland: true,
    theme: { bg: "#eef6f5", ink: "#12302e", muted: "#4d6b68", accent: "#12a39a", panel: "#ffffff" },
    built: [
      "A Python CLI (Typer, httpx) that builds the time-blocked daily plan and pushes check-ins as GitHub issues on a GitHub Actions schedule.",
      "A Supabase Postgres store with a pg_cron dispatcher; a scheduled Claude Code routine reads the calendar and drives the CLI.",
      "Logic lives in a deterministic CLI, so the scheduled check-in tick uses no LLM quota.",
      "A GitHub-API security watchlist auditing repo collaborators, deploy keys, webhooks and secrets; SHA-pinned actions.",
      "A private command-center view rendered by the CLI, with a fail-closed freshness check.",
      "Privacy-first for AR glasses: an ADR keeps everything the glasses sense on the device and out of JEPA's store; a stereo 3D head-tracking sandbox for the glasses (Three.js, WebHID) is a prototype, not yet run on hardware.",
    ],
    numbers: [
      { value: "573", label: "unit tests" },
      { value: "39", label: "merged PRs in 22 days" },
      { value: "13", label: "ADRs" },
      { value: "43 of 43", label: "scheduled runs succeeded (as of 2026-11-03)" },
    ],
    stack: ["Python", "Typer", "httpx", "Supabase Postgres", "pg_cron", "GitHub Actions", "Claude Code", "Three.js", "WebHID"],
    shots: [
      { caption: "A time-blocked daily plan, as a GitHub issue" },
      { caption: "The private command-center view" },
    ],
  },
  {
    id: "hitagent",
    slug: "human-in-tech-agent",
    name: "Human In Tech Agent",
    introWord: "Human In Tech",
    status: "Family business, in progress",
    blurb: "A back-office outreach agent for my family's business, built inside Google Workspace: it ranks leads, picks the right contacts and drafts emails for the owner to review.",
    privateRepo: true,
    onIsland: true,
    theme: { bg: "#0f1714", ink: "#e9f3ee", muted: "#93ab9f", accent: "#3ddc84", panel: "#17231e" },
    built: [
      "Runs inside Google Workspace (Apps Script, TypeScript), where the business already works.",
      "Ranks leads and picks the right contacts to reach.",
      "Drafts every email into the owner's Gmail, so he reviews each one before it goes out.",
      "AI drafting is next.",
    ],
    numbers: [{ value: "44", label: "tests" }],
    stack: ["TypeScript", "Google Apps Script", "Google Workspace", "Gmail"],
  },
  {
    id: "sweep",
    slug: "security-sweep",
    name: "Security Sweep",
    introWord: "Security Sweep",
    status: "Personal, in daily use since October 2026",
    blurb: "A read-only security sweep across my GitHub repos and live websites that fails closed when it can't read something.",
    privateRepo: true,
    onIsland: true,
    theme: { bg: "#fff8ee", ink: "#2a1d10", muted: "#6f5a45", accent: "#d9480f", panel: "#ffffff" },
    built: [
      "Checks 21 GitHub repos' security settings against a baseline, plus their Dependabot and secret-scanning alerts.",
      "Scans new commits for secret patterns.",
      "Also watches the live websites, config drift, the public footprint, spend and recovery-plan reminders.",
      "Read-only, failing closed on read errors; runs as a scheduled task that writes dated reports.",
    ],
    numbers: [
      { value: "21", label: "GitHub repos checked" },
      { value: "76", label: "unit tests" },
    ],
    stack: ["Python", "GitHub CLI"],
  },
  {
    id: "fantasy",
    slug: "fantasy-forecast",
    name: "Fantasy Forecast",
    introWord: "Fantasy Forecast",
    status: "Personal prototype",
    blurb: "A fantasy basketball draft room for Yahoo 9-category leagues: a draft board, punt builds and live pick advice.",
    privateRepo: true,
    onIsland: true,
    theme: { bg: "#0e1630", ink: "#eef1fb", muted: "#9aa6c8", accent: "#ff8a3d", panel: "#18224a" },
    built: [
      "A draft board, punt builds and live pick advice for Yahoo 9-category leagues.",
      "A point-in-time backtest that reports rank Spearman, Brier score and MAE against preset pass/fail targets.",
      "Part of it was built by my Software Factory's workers, reviewed and merged by me.",
    ],
    numbers: [],
    stack: ["Python", "pandas", "nba_api", "Streamlit"],
  },
  {
    id: "citibike",
    slug: "citi-bike-forecasting",
    name: "Citi Bike demand forecasting",
    introWord: "Citi Bike",
    status: "Research · Georgia Tech CSE 6242 team project, 2026",
    blurb: "Research for my M.S. in Analytics at Georgia Tech: forecasting Citi Bike demand across New York from public bike, subway, weather and bike-route data.",
    privateRepo: true,
    onIsland: true,
    theme: { bg: "#f2f5fb", ink: "#14213d", muted: "#4f5b7a", accent: "#2a6df4", panel: "#ffffff" },
    built: [
      "A Python data pipeline turning public Citi Bike, MTA subway, weather and bike-route data into an H3 cell-by-hour panel with external features, under a fixed data contract.",
      "Resumable steps, an end-to-end pytest test and a validation report.",
      "The team's interactive map UI (React, Vite, deck.gl H3 layers) over the model outputs and cleaned datasets.",
    ],
    numbers: [],
    stack: ["Python", "H3", "pytest", "React", "Vite", "deck.gl"],
  },
  {
    id: "agent",
    slug: "claude-api-agent",
    name: "Claude API agent",
    introWord: "Test Agent",
    status: "Wells Fargo, in production",
    blurb: "A production Claude API agent that generates, validates and self-heals Playwright test scripts.",
    privateRepo: false,
    onIsland: false,
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
    onIsland: false,
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

/** Jin's main projects, in island order: the buildings and the chip row. */
export const islandProjects = projects.filter((p) => p.onIsland);
