import './index.scss'

const EXPERIENCES = [
  {
    role: 'Software Engineer — Technical Product Owner',
    company: 'Wells Fargo',
    team: 'Wealth & Investment Management Technology',
    period: '2023 — Present',
    summary: 'Senior-level full-stack engineer and de facto Technical Product Owner across two enterprise investment platforms inside Wells Fargo\'s highest revenue-generating division — operating at the intersection of hands-on engineering and product ownership.',
    subsections: [
      {
        title: 'Portfolio Management Platform · Investment Solutions (2024–Present)',
        bullets: [
          'Engineer on a 20-person, two-squad Agile program building a greenfield micro-frontend investment advisory platform (React 18, Zustand, Spring Boot, Kafka, Red Hat OpenShift) — one of the most ambitious and high-visibility technology initiatives within the division, tracked at the executive level and built to manage billions of dollars in client investment assets.',
          'Sole senior engineer on the platform\'s most complex module — a system with the highest number of external dependencies, user states, moving parts, and regulatory constraints on the entire platform. Every dollar allocated through this system is a real client asset.',
        ],
      },
      {
        title: 'Product Ownership & Delivery Leadership',
        bullets: [
          'Own the product backlog, release planning, and sprint execution — defining sprint goals, prioritizing features against conflicting demands from compliance, operations, and business leadership, delivering with zero missed production dates across every release cycle.',
          'Lead PI (Program Increment) planning sessions, sprint reviews, and executive stakeholder demonstrations — translating complex micro-frontend architecture decisions into business-facing impact narratives.',
          'Drive requirements gathering directly with financial advisors, compliance officers, legal stakeholders, and product managers — translating institutional policy into detailed acceptance criteria, TypeScript component contracts, and Spring Boot API specifications.',
          'Act as the technical voice in all cross-functional planning — bridging what engineering can deliver, what the business needs, and what compliance requires.',
          'Mentor interns and junior analysts — one mentee is now an SME responsible for production deployments, directly expanding the team\'s operational capacity.',
        ],
      },
      {
        title: 'Platform Architecture & Full-Stack Engineering',
        bullets: [
          'Architected the multi-persona asset allocation, portfolio rebalancing, and billing workflow — a real-time, role-gated interface enabling financial advisors to reallocate positions, adjust cash/funding values, and modify billing parameters within a single session.',
          'Architected and delivered senior-level contributions across every layer: React 18/Zustand micro-frontend components, Spring Boot REST microservices, Kafka event-driven data pipelines, and business rules engine logic within a Module Federation architecture on Red Hat OpenShift.',
          'Engineered the platform\'s most technically demanding UI patterns — role-gated multi-persona views, real-time Kafka-driven state sync, dynamic forms with field-level conditional rendering, and concurrent multi-API orchestration with live recalculation on every state change.',
          'Drove business rules definition for investment suitability screening, portfolio rebalancing thresholds, regulatory compliance constraints, and fee calculation logic — partnering with compliance and legal stakeholders to translate policy into deterministic, auditable rule sets (Drools).',
        ],
      },
      {
        title: 'Release-Gate Quality & Test Automation',
        bullets: [
          'Sole architect, engineer, and SME for the Playwright (TypeScript) E2E test automation program — a release-gate system that is a hard dependency for any code reaching production.',
          'Designed the test strategy from scratch, built the full cross-application test catalog spanning a React micro-frontend child app and its parent platform, and integrated execution into CI/CD pipelines (Jenkins/Harness CD).',
          'Manage all test assets in HP ALM Octane (recognized as the organizational SME), report release readiness directly to technology leadership before every production deployment.',
          'This program has caught critical defects that would have reached production — it is the single quality gate that leadership trusts before signing off on any release.',
        ],
      },
    ],
  },
  {
    role: 'Full-Stack Engineer — Banking & Lending',
    company: 'Wells Fargo',
    team: 'Wealth & Investment Technology — Banking, Lending & Trust',
    period: '2023 — 2024',
    summary: 'One of two engineers on a full-stack Angular + Spring Boot platform — sole front-end owner and co-owner of back-end delivery. Built the first modern Angular/Spring Boot application within the division, ending reliance on legacy .NET servers.',
    subsections: [
      {
        title: null,
        bullets: [
          'Delivered Account Maintenance GUI — the division\'s first Spring Boot REST server, replacing the .NET backend paradigm and setting the technical standard for all subsequent services.',
          'Delivered Market Relationships GUI — replacing decades-old COBOL systems, manual spreadsheets, and email chains with a production-grade Angular platform for market-to-banker relationship management.',
          'Built full Angular frontends from scratch — account data management, client status workflows, relationship declaration, approval routing, and automated data reconciliation with Oracle DB2.',
          'Designed UI architectures in Figma and produced technical workflow diagrams to align engineering, business stakeholders, and senior leadership.',
          'Owned end-to-end deployment lifecycle via Jenkins, IBM UCD, Harness CD, and SonarQube quality gates — delivering with zero critical defects post-launch.',
        ],
      },
    ],
  },
  {
    role: 'Technology Analyst',
    company: 'Wells Fargo',
    team: 'Cloud Modernization & Innovation',
    period: '2022 — 2023',
    summary: 'Cloud modernization engineer and innovation contributor — focused on cloud platform migration, rapid prototyping, and identifying technology-driven business opportunities.',
    subsections: [
      {
        title: 'US Patent — Financial Network Security',
        bullets: [
          'Awarded US Patent #US19372721 ("System and Method for Securing Financial Entity Networks") — identified an unaddressed vulnerability in enterprise financial network design, engineered a system-level solution, and presented the full technical architecture and business ROI justification to senior leadership for formal USPTO filing.',
        ],
      },
      {
        title: 'Hackathon — Scan2Invest',
        bullets: [
          'Product Lead and engineer for "Scan2Invest" at the WIMT Hackathon — led a cross-functional team to design, build, and ship a full-stack AI-powered mobile investment application in 48 hours using computer vision to scan stock tickers and barcodes, pulling live market data via financial APIs. Secured executive sponsorship.',
        ],
      },
      {
        title: 'Cloud Migration',
        bullets: [
          'Executed strategic migration of legacy investment applications to Pivotal Cloud Foundry (PCF/TAS) — coordinated with DevOps on CI/CD pipeline configuration and deployment manifest design to deliver zero-downtime production cutovers.',
        ],
      },
    ],
  },
  {
    role: 'Technology Intern',
    company: 'Wells Fargo',
    team: 'Wealth & Investment Management Technology',
    period: '2021',
    summary: null,
    subsections: [
      {
        title: null,
        bullets: [
          'Designed and implemented automated test suites covering front-end UI behavior, API response validation, and regression coverage — catching critical defects pre-deployment and reducing manual QA overhead.',
          'Co-led onboarding operations and IT infrastructure for 50+ incoming Early Careers engineers — the framework was adopted by leadership as the standard model for future cohort cycles.',
          'This internship led directly to a full-time offer and set the foundation for the engineering and product ownership trajectory that followed.',
        ],
      },
    ],
  },
]

const Experience = () => {
  return (
    <div className="experience">
      <h2 className="section-heading">Experience</h2>
      <div className="timeline">
        {EXPERIENCES.map((exp, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-marker" />
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-role">{exp.role}</h3>
                  <span className="timeline-company">{exp.company}</span>
                  {exp.team && <span className="timeline-team">{exp.team}</span>}
                </div>
                <span className="timeline-period">{exp.period}</span>
              </div>
              {exp.summary && <p className="timeline-summary">{exp.summary}</p>}
              {exp.subsections.map((sub, j) => (
                <div className="timeline-subsection" key={j}>
                  {sub.title && <h4 className="subsection-title">{sub.title}</h4>}
                  <ul className="timeline-bullets">
                    {sub.bullets.map((bullet, k) => (
                      <li key={k}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Experience
