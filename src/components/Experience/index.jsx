import useScrollReveal from '../../hooks/useScrollReveal'
import './index.scss'

const EXPERIENCES = [
  {
    role: 'Software Engineer',
    company: 'Wells Fargo',
    team: 'Wealth & Investment Technology — Portfolio Management',
    period: '2023 — Present',
    bullets: [
      'Sole engineer and SME for a Playwright E2E test automation program that gates every production release — built the entire test catalog from scratch across a micro-frontend platform.',
      "Own the platform's most complex asset allocation and billing workflow — a multi-persona, role-gated module serving Financial Advisor, Admin, and Operations views from a shared Zustand state model.",
      'Built dynamic, data-driven UI modules within a React/Zustand micro-frontend (Module Federation) architecture, consuming Kafka event streams for real-time state synchronization.',
      'Designed Spring Boot microservice endpoints for investment portfolio data aggregation, transformation, and serving to the React frontend.',
    ],
  },
  {
    role: 'Technology Analyst',
    company: 'Wells Fargo',
    team: 'Cloud Modernization & Innovation',
    period: '2022 — 2023',
    bullets: [
      'Awarded US Patent #US19372721 — designed a system for securing financial entity networks and presented technical justification to senior leadership for USPTO filing.',
      'Won WIMT Hackathon as tech lead for "Scan2Invest" — built a Computer Vision/AI mobile MVP in 48 hours; secured executive sponsorship.',
      'Executed zero-downtime PCF cloud migration of legacy investment applications.',
    ],
  },
  {
    role: 'Technology Intern',
    company: 'Wells Fargo',
    period: '2021',
    bullets: [
      'Built automated test suites catching critical pre-production defects; co-led IT onboarding infrastructure for 50+ engineers — model adopted for future cohorts.',
    ],
  },
]

const Experience = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className={`experience reveal ${isVisible ? 'revealed' : ''}`} ref={ref}>
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
