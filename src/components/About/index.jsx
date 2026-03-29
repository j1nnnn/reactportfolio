import { motion } from 'framer-motion'
import './index.scss'

const variants = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const HIGHLIGHTS = [
  { value: '4+', label: 'Years at Wells Fargo' },
  { value: 'US', label: 'Patent Holder' },
  { value: 'M.S.', label: 'Georgia Tech (In Progress)' },
  { value: '1st', label: 'Place Hackathon' },
]

const About = () => {
  return (
    <motion.div className="about" variants={variants} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
      <motion.h2 className="section-heading" variants={variants}>About Me</motion.h2>
      <motion.div className="about-content" variants={variants}>
        <motion.div className="about-text" variants={variants}>
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
        </motion.div>
        <motion.div className="highlights" variants={variants}>
          {HIGHLIGHTS.map(({ value, label }) => (
            <motion.div className="highlight-card" key={label} variants={variants} whileHover={{ scale: 1.05 }}>
              <span className="highlight-value">{value}</span>
              <span className="highlight-label">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default About
