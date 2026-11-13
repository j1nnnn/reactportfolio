// Copy for the personal sections below the island ("the dive"). DRAFT from Jin's CV: Jin may edit the
// wording, but don't add a fact that isn't in cv.md. Never add a phone number or a certification.

import { projects, type ProjectId } from "./projects";

/** The photo placeholder may ship (Jin's call). The line placeholder is kept so the deploy guard can refuse it. */
export const PHOTO_PLACEHOLDER = "photo goes here";
export const PERSONAL_LINE_PLACEHOLDER =
  "Your own two or three sentences go here: what drives you, and who you are outside work.";

export const about = {
  heading: "Hi, I'm Jin.",
  /** Jin's own words (2026-11-11), not drafted from the CV: change only on his say-so. */
  personalLine:
    "I'm a builder, an inventor, an engineer and an architect, and to me technology and business are one craft. I see every problem from the top view, put the sharpest AI tools to work on everything below, and experiment in my own sandbox until an idea works and earns. The edge is no longer who can write the code but who can combine what's out there into the best product: share ideas openly, iterate fast, then build the niche.",
  /** Drafted with the career-ops agent from cv.md and approved by Jin (2026-11-13). */
  intro: [
    "By day I'm a full-stack engineer at Wells Fargo, building investment software for financial advisors in Wealth & Investment Management, one of the most regulated corners of finance. My range runs from the UI to the microservices and APIs behind it, down to SQL and NoSQL databases and the cloud, with an AI layer on top, like a Claude agent that writes our tests and repairs them. I'm taking the analytics side further in my M.S. at Georgia Tech.",
    "The business side came with the work. I stepped in as my team's acting technical product owner, and I still design stories with our product owners while I take on more of the engineering, from new features to defects. Advisors and business partners send us requirements and defects as they test, so I build close to the people who use it. I brief senior leadership on release readiness every cycle, and I've led a workstream across the US and India.",
    "Outside work I keep building. Pro-Link AI is a coaching assistant for a golf coach in South Korea: it spots faults in a student's swing and measures it against a pro's to give tips. He uses it at least twice a week to plan lessons and make every session more productive, and I'm building the metrics that show how much a student improves. My software factory runs like an agile team on Linear, routing each ticket to the model and development method that fit it while keeping token spend down, then opening pull requests for my review. And now I'm building an agent for Human In Tech, my family's business.",
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
      "1,000+ automated tests and smoke-test-gated rollouts with automatic rollback.",
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

export type OtherProjectId = "lifeos" | "sweep" | "citibike" | "aurora" | "humanintech";

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

export const otherProjectsHeading = "More things I've built";

export const otherProjects: OtherProject[] = [
  {
    id: "lifeos",
    name: "Life OS",
    tag: "Personal · active",
    blurb:
      "My daily execution engine: a web app and PWA for goals, tasks, schedules and reflections, organized goal-first.",
    stack: ["Next.js 16", "TypeScript", "Dexie.js", "Zustand"],
  },
  {
    id: "sweep",
    name: "Security Sweep",
    tag: "Personal · daily use",
    blurb:
      "A read-only sweep of 21 GitHub repos' security settings, alerts and new commits, failing closed on read errors.",
    stack: ["Python", "GitHub CLI", "64 unit tests"],
  },
  {
    id: "citibike",
    name: "Citi Bike demand forecasting",
    tag: "Georgia Tech · team project",
    blurb:
      "A pipeline turning public Citi Bike, subway, weather and bike-route data into an H3 cell-by-hour panel under a fixed data contract.",
    stack: ["Python", "H3", "pytest"],
  },
  {
    id: "aurora",
    name: "Smart City of Aurora",
    tag: "University · 1st place midterm",
    blurb: "A full-stack smart city platform for the City of Aurora, IL; top 5 overall.",
    stack: ["React", "Python", "Google Maps API", "IoT"],
  },
  {
    id: "humanintech",
    name: "Human In Tech",
    tag: "Personal",
    blurb: "A professional website for a family business.",
    stack: ["React", "Responsive design"],
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
  { name: "TypeScript", group: "Languages", proofs: ["wf-engineer", "prolink", "lifeos"] },
  { name: "Python", group: "Languages", proofs: ["prolink", "factory", "jepa", "sweep", "citibike"] },
  { name: "Java", group: "Languages", proofs: ["wf-engineer"] },
  { name: "C# / .NET", group: "Languages", proofs: ["turf"] },
  { name: "React", group: "Frontend", proofs: ["wf-engineer", "prolink", "lifeos", "aurora", "humanintech"] },
  { name: "Next.js", group: "Frontend", proofs: ["prolink", "lifeos"] },
  { name: "Angular", group: "Frontend", proofs: ["wf-engineer"] },
  { name: "Micro-frontends", group: "Frontend", proofs: ["wf-engineer"] },
  { name: "Spring Boot", group: "Backend", proofs: ["wf-engineer"] },
  { name: "Kafka", group: "Backend", proofs: ["wf-engineer"] },
  { name: "FastAPI", group: "Backend", proofs: ["prolink"] },
  { name: "Cloudflare Workers", group: "Backend", proofs: ["prolink"] },
  { name: "MongoDB", group: "Data", proofs: ["wf-engineer", "wf-analyst"] },
  { name: "Data pipelines", group: "Data", proofs: ["citibike"] },
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
