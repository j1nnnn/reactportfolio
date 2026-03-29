import './index.scss'

const SKILL_CATEGORIES = [
  {
    name: 'Technical Product Ownership',
    skills: ['Product Vision & Roadmap', 'Backlog Ownership', 'Requirements & Acceptance Criteria', 'Release Planning', 'PI Planning', 'Stakeholder Communication', 'Sprint Reviews & Demos'],
  },
  {
    name: 'Frontend',
    skills: ['React 18', 'Angular 15+', 'React Native', 'Zustand', 'RxJS', 'TypeScript', 'JavaScript', 'Module Federation', 'WCAG 2.1', 'Bootstrap'],
  },
  {
    name: 'Backend',
    skills: ['Java 17', 'Spring Boot 3', 'Kafka', 'REST / GraphQL', 'Drools', 'OAuth 2.0 / JWT', 'Python 3', 'PHP'],
  },
  {
    name: 'Cloud & DevOps',
    skills: ['OpenShift', 'Azure (AZ-900)', 'PCF / TAS', 'GCP', 'Jenkins', 'Harness CD', 'IBM UCD', 'Docker', 'Splunk', 'SonarQube', 'Heroku'],
  },
  {
    name: 'AI / Machine Learning',
    skills: ['LLMs', 'RAG Pipelines', 'NLP', 'Generative AI', 'Computer Vision', 'Python ML', 'R', 'AI Pipeline Integration', 'Data Analytics'],
  },
  {
    name: 'Testing & QA',
    skills: ['Playwright (TypeScript)', 'E2E Automation', 'HP ALM Octane (SME)', 'Release-Gate Governance', 'CI/CD Integration', 'Unit Testing', 'SonarQube Gates'],
  },
  {
    name: 'Data & Databases',
    skills: ['MongoDB', 'Oracle DB', 'SQL / PL-SQL', 'PostgreSQL', 'Snowflake', 'Data Modeling', 'ETL Patterns'],
  },
  {
    name: 'Domain Expertise',
    skills: ['Wealth & Investment Mgmt', 'Portfolio Management', 'Banking & Lending', 'Regulatory Compliance', 'Financial Network Security', 'Smart City / IoT'],
  },
  {
    name: 'Design & Prototyping',
    skills: ['Figma', 'Rapid Prototyping', 'UX Design', 'Technical Diagrams', 'High-Fidelity Mockups'],
  },
  {
    name: 'Tools & Methodology',
    skills: ['JIRA', 'Confluence', 'GitHub', 'Agile / Scrum', 'SAFe', 'SDLC', 'Splunk SPL'],
  },
]

const Skills = () => {
  return (
    <div className="skills">
      <h2 className="section-heading">Skills</h2>
      <div className="skills-grid">
        {SKILL_CATEGORIES.map((cat) => (
          <div className="skill-category" key={cat.name}>
            <h3 className="category-name">{cat.name}</h3>
            <div className="skill-chips">
              {cat.skills.map((skill) => (
                <span className="skill-chip" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills
