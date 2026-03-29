import { motion } from 'framer-motion'
import './index.scss'

const variants = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

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
    <motion.div className="skills" variants={variants} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
      <motion.h2 className="section-heading" variants={variants}>Skills</motion.h2>
      <motion.div className="skills-grid" variants={variants}>
        {SKILL_CATEGORIES.map((cat) => (
          <motion.div className="skill-category" key={cat.name} variants={variants}>
            <h3 className="category-name">{cat.name}</h3>
            <div className="skill-chips">
              {cat.skills.map((skill) => (
                <motion.span className="skill-chip" key={skill} whileHover={{ scale: 1.1 }}>{skill}</motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Skills
