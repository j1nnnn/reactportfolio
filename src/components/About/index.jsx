import './index.scss'

const HIGHLIGHTS = [
  { value: '4+', label: 'Years at Wells Fargo' },
  { value: 'US', label: 'Patent Holder' },
  { value: 'M.S.', label: 'Georgia Tech (In Progress)' },
  { value: '3x', label: 'Hackathon Placements' },
]

const About = () => {
  return (
    <div className="about">
      <h2 className="section-heading">About Me</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            I'm a software engineer who owns product — and a technical product
            owner who still writes the code. At Wells Fargo's Wealth & Investment
            Management Technology, I operate across both disciplines
            simultaneously. I architect and ship production systems: React
            18/Zustand micro-frontends, Java/Spring Boot microservices, Kafka
            event-driven pipelines, business rules engines, and Red Hat OpenShift
            cloud deployments. And I own the product side of what I build:
            requirements gathering, API contract definition, sprint planning,
            release readiness reporting, and executive-level delivery
            communication.
          </p>
          <p>
            What really drives me is where technology meets real human impact.
            I'm pursuing my M.S. in Analytics (AI/ML) at Georgia Tech because I
            believe the next generation of enterprise platforms will be defined
            by how intelligently they use data to serve people. I'm actively
            prototyping with LLMs and RAG pipelines in regulated financial
            workflows, exploring how generative AI can accelerate
            decision-making without compromising compliance and auditability.
          </p>
          <p>
            My technical depth makes me a better product owner. I can evaluate
            engineering tradeoffs, write acceptance criteria that match how the
            system behaves, and have honest conversations with dev teams about
            feasibility. My product instincts make me a better engineer — I build
            for the user, not just the ticket.
          </p>
          <p>
            When I'm not building platforms or studying machine learning, I'm
            editing vlogs, experimenting with content creation, and finding ways
            to make complex technical ideas accessible to a wider audience.
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
