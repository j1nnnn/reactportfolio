import useScrollReveal from '../../hooks/useScrollReveal'
import './index.scss'

const HIGHLIGHTS = [
  { value: '4+', label: 'Years at Wells Fargo' },
  { value: 'US', label: 'Patent Holder' },
  { value: 'M.S.', label: 'Georgia Tech (In Progress)' },
  { value: '1st', label: 'Place Hackathon' },
]

const About = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className={`about reveal ${isVisible ? 'revealed' : ''}`} ref={ref}>
      <h2 className="section-heading">About Me</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            I'm a Senior Software Engineer at Wells Fargo with 4+ years of hands-on
            delivery in Wealth & Investment Management. I architect and ship
            production systems — React/Zustand micro-frontends, Java/Spring Boot
            microservices, Kafka event-driven pipelines, and business rules engines —
            while owning release governance through a Playwright E2E test automation
            program I built from scratch.
          </p>
          <p>
            I hold a US Patent for financial network security architecture, won a
            company-wide hackathon building a computer vision MVP in 48 hours, and I'm
            currently pursuing my M.S. in Analytics (AI/ML) at Georgia Tech. I'm
            driven by the intersection of engineering depth and product impact —
            building systems that solve real problems at scale.
          </p>
        </div>
        <div className="highlights">
          {HIGHLIGHTS.map(({ value, label }) => (
            <div className="highlight-card" key={label}>
              <span className="highlight-value">{value}</span>
              <span className="highlight-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
