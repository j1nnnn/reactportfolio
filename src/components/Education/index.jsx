import { motion } from 'framer-motion'
import './index.scss'

const variants = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const EDUCATION = [
  {
    school: 'Georgia Institute of Technology',
    degree: 'M.S. Analytics — Computational Data Science / AI/ML',
    period: 'In Progress',
    note: null,
  },
  {
    school: 'New Jersey Institute of Technology',
    degree: 'B.S. Computer Science — Ying Wu College of Computing',
    period: 'Sept 2018 — May 2022',
    note: 'Graduated Cum Laude',
  },
]

const CREDENTIALS = [
  'Azure AZ-900 Certified',
  'ISC2 Cybersecurity (In Progress)',
  'US Patent #US19372721',
]

const Education = () => {
  return (
    <motion.div className="education" variants={variants} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
      <motion.h2 className="section-heading" variants={variants}>Education & Credentials</motion.h2>
      <motion.div className="education-grid" variants={variants}>
        {EDUCATION.map((edu) => (
          <motion.div className="education-card" key={edu.school} variants={variants} whileHover={{ scale: 1.02 }}>
            <h3 className="edu-school">{edu.school}</h3>
            <p className="edu-degree">{edu.degree}</p>
            <span className="edu-period">{edu.period}</span>
            {edu.note && <span className="edu-note">{edu.note}</span>}
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="credentials" variants={variants}>
        {CREDENTIALS.map((cred) => (
          <motion.span className="credential-badge" key={cred} variants={variants} whileHover={{ scale: 1.05 }}>{cred}</motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Education
