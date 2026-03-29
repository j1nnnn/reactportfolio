import './index.scss'

const EXPERIENCES = [
  {
    role: 'Software Engineer — Technical Product Owner',
    company: 'Wells Fargo',
    team: 'Wealth & Investment Technology — Portfolio Management',
    period: '2023 — Present',
    bullets: [
      'Senior-level full-stack engineer and de facto Technical Product Owner across two enterprise investment platforms inside Wells Fargo\'s highest revenue-generating division.',
      'Sole senior engineer on the platform\'s most complex module — a multi-persona asset allocation, portfolio rebalancing, and billing workflow handling real client investment assets in real time.',
      'Own the product backlog, release planning, and sprint execution — defining sprint goals, prioritizing features against competing demands from compliance, operations, and business leadership.',
      'Architected and delivered across every layer: React 18/Zustand micro-frontend components, Spring Boot REST microservices, Kafka event-driven pipelines, and business rules engine logic on Red Hat OpenShift.',
      'Sole architect and SME of the Playwright (TypeScript) E2E release-gate automation program — no code ships to production without this program\'s sign-off.',
      'Led PI planning sessions, sprint reviews, and executive stakeholder demonstrations — translating architecture decisions into business-facing impact narratives.',
      'Mentored a junior engineer who is now an SME responsible for production deployments.',
    ],
  },
  {
    role: 'Full-Stack Engineer — Banking & Lending',
    company: 'Wells Fargo',
    team: 'Wealth & Investment Technology — Banking, Lending & Trust',
    period: '2023 — 2024',
    bullets: [
      'Built the first modern Angular + Spring Boot production application within the Banking, Lending & Trust division — ending reliance on legacy .NET servers.',
      'Delivered Account Maintenance GUI and Market Relationships GUI to production — replacing COBOL-era systems and manual Excel/email workflows.',
      'Sole frontend owner and co-owner of backend delivery across both platforms, managing the full lifecycle from requirements through OpenShift deployment.',
    ],
  },
  {
    role: 'Technology Analyst',
    company: 'Wells Fargo',
    team: 'Cloud Modernization & Innovation',
    period: '2022 — 2023',
    bullets: [
      'Awarded US Patent #US19372721 — designed a system for securing financial entity networks and navigated the full USPTO filing process.',
      'Won WIMT Hackathon as tech lead for "Scan2Invest" — built a Computer Vision/AI mobile MVP in 48 hours; secured executive sponsorship.',
      'Executed zero-downtime PCF cloud migration of legacy investment applications, coordinating CI/CD pipeline configuration with DevOps.',
    ],
  },
  {
    role: 'Technology Intern',
    company: 'Wells Fargo',
    period: '2021',
    bullets: [
      'Built automated test suites catching critical pre-production defects across front-end UI, API validation, and regression coverage.',
      'Co-led IT onboarding infrastructure for 50+ Early Careers engineers — framework adopted as the standard model for future cohorts.',
      'Internship led directly to a full-time offer.',
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
              <ul className="timeline-bullets">
                {exp.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Experience
