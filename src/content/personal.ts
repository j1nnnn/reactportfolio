// Copy for the personal sections below the island ("the dive"). DRAFT from Jin's CV: Jin may edit the
// wording, but don't add a fact that isn't in cv.md. Never add a phone number or a certification.

/** Placeholders until Jin supplies his photo and his own line; the deploy guard looks for these. */
export const PHOTO_PLACEHOLDER = "photo goes here";
export const PERSONAL_LINE_PLACEHOLDER =
  "Your own two or three sentences go here: what drives you, and who you are outside work.";

export const about = {
  heading: "Hi, I'm Jin.",
  personalLine: PERSONAL_LINE_PLACEHOLDER,
  intro: [
    "I'm a full-stack engineer at Wells Fargo, with four-plus years building and running production systems in Wealth & Investment Management, one of the most regulated corners of financial services.",
    "I work across the whole stack, from React and TypeScript to Java and Spring Boot, and I build the AI layer on top: Claude API agents, MCP servers, and the context that makes them reliable. What I like most is turning an ambiguous, high-stakes problem into software people actually use.",
    "Outside work I built Pro-Link AI, real-time swing analysis now in use by a golf coach in South Korea, and I'm a co-inventor on a granted US patent.",
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
    title: "Software Engineer · Acting Technical Product Owner",
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
