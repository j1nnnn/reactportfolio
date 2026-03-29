import './index.scss'

const SKILL_CATEGORIES = [
  {
    name: 'Languages',
    skills: ['Java 17', 'TypeScript', 'JavaScript', 'Python 3', 'R', 'SQL'],
  },
  {
    name: 'Frontend',
    skills: ['React 18', 'Angular 15+', 'Zustand', 'RxJS', 'Module Federation', 'WCAG 2.1'],
  },
  {
    name: 'Backend',
    skills: ['Spring Boot 3', 'Kafka', 'REST', 'GraphQL', 'Drools', 'OAuth 2.0 / JWT'],
  },
  {
    name: 'Cloud & DevOps',
    skills: ['OpenShift', 'Azure', 'Jenkins', 'Harness CD', 'Docker', 'Splunk'],
  },
  {
    name: 'Testing',
    skills: ['Playwright', 'E2E Automation', 'HP ALM Octane', 'CI/CD Integration'],
  },
  {
    name: 'Data & AI',
    skills: ['MongoDB', 'Oracle DB', 'Python ML', 'LLM Prototyping'],
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
