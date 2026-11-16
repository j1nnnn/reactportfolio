// Copy for the personal sections below the island ("the dive"). DRAFT from Jin's CV: Jin may edit the
// wording, but don't add a fact that isn't in cv.md. Never add a phone number or a certification.

import { projects, type ProjectId } from "./projects";

/** The photo placeholder may ship (Jin's call). The line placeholder is kept so the deploy guard can refuse it. */
export const PHOTO_PLACEHOLDER = "photo goes here";
export const PERSONAL_LINE_PLACEHOLDER =
  "Your own two or three sentences go here: what drives you, and who you are outside work.";

export const about = {
  heading: "Hi, I'm Jin.",
  /** Drafted with the career-ops agent from cv.md, trimmed to fit one laptop screen; approved by Jin (2026-11-13). */
  intro: [
    "By day I'm a full-stack engineer at Wells Fargo, building investment software for financial advisors, from the UI and microservices down to the databases and the cloud, with an AI layer on top. I stepped in as my team's acting technical product owner and still design stories with our product owners, so I build close to the people who use it, and I brief senior leadership on release readiness every cycle.",
    "Outside work I keep building, and two of my projects bring AI and automation into small businesses: Pro-Link AI, a coaching assistant a golf coach in South Korea uses at least twice a week to plan lessons, and a back-office agent that grows outreach for Human In Tech, my family's business. My software factory runs like an agile team on Linear, routing each ticket to the model and method that fit it.",
  ],
  numbers: [
    { value: "4+", label: "years shipping production systems" },
    { value: "1", label: "granted US patent" },
    { value: "3", label: "top-5 hackathon finishes" },
    { value: "0", label: "critical defects across every release I gated" },
  ],
  beyondTheCode: [
    "M.S. Analytics, AI/ML track, Georgia Tech (in progress)",
    "B.S. Computer Science, Cum Laude, NJIT (2018 – 2022)",
    "Co-inventor, US Patent 12,470,530 B2",
    "Chair, Early Careers Alumni Leadership Council, Wells Fargo (2023 – 2025)",
    "Chair, New Member Educator, Mentor, Theta Tau (2019 – present)",
    "Gold Member, ALPFA (2024 – present)",
  ],
};

/** One role in the Experience section. Its id is the role's station in the dive and a skill's proof. */
export type ExperienceEntry = {
  id: ExperienceId;
  org: string;
  title: string;
  dates: string;
  scope: string;
  points: string[];
  link?: { label: string; href: string };
};

export type ExperienceId = "wf-engineer" | "prolink" | "wf-analyst" | "wf-intern";

/** Jin's roles, newest first, from his CV. Never add an internal project name. */
export const experience: ExperienceEntry[] = [
  {
    id: "wf-engineer",
    org: "Wells Fargo",
    title: "Software Engineer",
    dates: "2023 – present",
    scope: "Wealth & Investment Management Technology",
    points: [
      "Building a greenfield investment management platform, touching millions in client assets, that financial advisors use to maintain and reallocate client portfolios.",
      "Sole architect of the Playwright test-automation framework that is the release gate for a 20-person program: zero critical defects across every production release.",
      "Designed a production Claude API agent that generates, validates and self-heals test scripts, with its evaluation framework and confidence-gated rollouts.",
      "Led a workstream across a US and an India-based team, and acted as Product Owner during the test-automation phase.",
    ],
    link: { label: "About the Claude API agent", href: "/work/claude-api-agent" },
  },
  {
    id: "prolink",
    org: "Pro-Link AI",
    title: "Creator and Engineer · Personal project",
    dates: "2026 – present",
    scope: "Built for a golf coach in South Korea, in use by him in production",
    points: [
      "Real-time pose estimation, 9 biomechanical fault detectors and a pro-swing comparator.",
      "A Claude coaching layer in English and Korean, guarded against prompt injection and invented numbers.",
      "1,100+ automated tests and smoke-test-gated rollouts with automatic rollback.",
    ],
    link: { label: "Read the case study", href: "/work/pro-link-ai" },
  },
  {
    id: "wf-analyst",
    org: "Wells Fargo",
    title: "Technology Analyst",
    dates: "2022 – 2023",
    scope: "Cloud Modernization & Innovation",
    points: [
      "Co-inventor, US Patent 12,470,530 B2, System and Method for Securing Financial Entity Networks (granted November 2025).",
      "Three top-5 hackathon finishes, each a 48-hour build: top 3, top 4 (with executive sponsorship) and top 5.",
      "Zero-downtime cloud migration of legacy investment apps.",
    ],
    link: { label: "About the patent", href: "/work/patent" },
  },
  {
    id: "wf-intern",
    org: "Wells Fargo",
    title: "Technology Intern",
    dates: "2021",
    scope: "Early Careers program",
    points: [
      "Built automated unit test suites that caught critical pre-production defects.",
      "Co-led onboarding for 50+ incoming engineers; leadership adopted the model for future cohorts.",
    ],
  },
];

export type OtherProjectId = "turf" | "aurora" | "humanintech";

export type OtherProject = {
  /** Stable: the Skills section cites these as proof. */
  id: OtherProjectId;
  name: string;
  tag: string;
  blurb: string;
  stack: string[];
  /** The repositories are private: a card links out only to a live site, and only when one is set here. */
  liveUrl?: string;
};

export const otherProjectsHeading = "Some others I've built";

/** The smaller list under Jin's main projects (his pick, 2026-11-15). */
export const otherProjects: OtherProject[] = [
  {
    id: "turf",
    name: "TurfGame",
    tag: "Personal · in development",
    blurb:
      "A deterministic, engine-free simulation of an 8-faction territory game with a Godot front end; milestones M0 to M3 closed, M4 in progress.",
    stack: ["C#", ".NET 10", "Godot 4", "580+ xUnit tests"],
  },
  {
    id: "humanintech",
    name: "Human In Tech website",
    tag: "Family business · live",
    blurb: "The live website for my family's business, with security headers, consent-gated analytics and SEO structured data.",
    stack: ["Next.js 14", "TypeScript", "Tailwind"],
  },
  {
    id: "aurora",
    name: "Smart City of Aurora",
    tag: "University · 1st place midterm",
    blurb: "A full-stack smart city platform for the City of Aurora, IL; top 5 overall.",
    stack: ["React", "Python", "Google Maps API", "IoT"],
  },
];

/**
 * A proof: the real work that backs a skill. An experience entry, a featured project or an other
 * project, by its id. Pro-Link AI is both a role and a featured project; its id is the same in both.
 */
export type ProofId = ExperienceId | ProjectId | OtherProjectId;

/** One skill in the Skills section. Every skill has at least one proof. */
export type Skill = { name: string; group: SkillGroup; proofs: ProofId[] };

export type SkillGroup = "AI & Agentic" | "Languages" | "Frontend" | "Backend" | "Data" | "Quality" | "Leadership";

export const skillsHeading = "Every skill, with proof";

/** From Jin's CV: only skills with real work behind them, no "familiar" or in-progress ones. */
export const skills: Skill[] = [
  { name: "Claude API", group: "AI & Agentic", proofs: ["wf-engineer", "prolink", "factory"] },
  { name: "Agentic workflows", group: "AI & Agentic", proofs: ["wf-engineer", "factory", "jepa"] },
  { name: "MCP servers", group: "AI & Agentic", proofs: ["wf-engineer", "factory"] },
  { name: "Context engineering", group: "AI & Agentic", proofs: ["wf-engineer"] },
  { name: "LLM evaluation", group: "AI & Agentic", proofs: ["wf-engineer", "factory"] },
  { name: "RAG pipelines", group: "AI & Agentic", proofs: ["wf-analyst"] },
  { name: "Computer vision", group: "AI & Agentic", proofs: ["prolink"] },
  { name: "TypeScript", group: "Languages", proofs: ["wf-engineer", "prolink", "hitagent", "humanintech"] },
  { name: "Python", group: "Languages", proofs: ["prolink", "factory", "jepa", "sweep", "fantasy", "citibike"] },
  { name: "Java", group: "Languages", proofs: ["wf-engineer"] },
  { name: "C# / .NET", group: "Languages", proofs: ["turf"] },
  { name: "React", group: "Frontend", proofs: ["wf-engineer", "prolink", "citibike", "aurora", "humanintech"] },
  { name: "Next.js", group: "Frontend", proofs: ["prolink", "humanintech"] },
  { name: "deck.gl", group: "Frontend", proofs: ["citibike"] },
  { name: "Angular", group: "Frontend", proofs: ["wf-engineer"] },
  { name: "Micro-frontends", group: "Frontend", proofs: ["wf-engineer"] },
  { name: "Spring Boot", group: "Backend", proofs: ["wf-engineer"] },
  { name: "Kafka", group: "Backend", proofs: ["wf-engineer"] },
  { name: "FastAPI", group: "Backend", proofs: ["prolink"] },
  { name: "Cloudflare Workers", group: "Backend", proofs: ["prolink"] },
  { name: "Google Apps Script", group: "Backend", proofs: ["hitagent"] },
  { name: "MongoDB", group: "Data", proofs: ["wf-engineer", "wf-analyst"] },
  { name: "Data pipelines", group: "Data", proofs: ["citibike"] },
  { name: "Model backtesting", group: "Data", proofs: ["fantasy"] },
  { name: "Playwright", group: "Quality", proofs: ["wf-engineer"] },
  { name: "Release gates", group: "Quality", proofs: ["wf-engineer", "prolink"] },
  { name: "Deterministic simulation", group: "Quality", proofs: ["turf"] },
  { name: "Security automation", group: "Quality", proofs: ["sweep", "jepa"] },
  { name: "Product ownership", group: "Leadership", proofs: ["wf-engineer", "prolink"] },
  { name: "Cross-team leadership", group: "Leadership", proofs: ["wf-engineer"] },
];

/** The skill groups, in the order the section lists them. */
export const skillGroups = [...new Set(skills.map((sk) => sk.group))];

/**
 * A proof's label, or undefined if the id names no real entry. A Wells Fargo role is named with its
 * title ("Wells Fargo · Software Engineer"); anything else by its name.
 */
export function proofLabel(id: ProofId): string | undefined {
  const role = experience.find((r) => r.id === id);
  if (role) return role.org === "Wells Fargo" ? `${role.org} · ${role.title.split(" · ")[0]}` : role.org;
  return (projects.find((p) => p.id === id) ?? otherProjects.find((p) => p.id === id))?.name;
}

/** The proofs the skills cite, in the order they first appear: the constellation's inner ring. */
export const proofs: ProofId[] = [...new Set(skills.flatMap((sk) => sk.proofs))];
