import useScrollReveal from '../../hooks/useScrollReveal'
import './index.scss'

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
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className={`education reveal ${isVisible ? 'revealed' : ''}`} ref={ref}>
      <h2 className="section-heading">Education & Credentials</h2>
      <div className="education-grid">
        {EDUCATION.map((edu) => (
          <div className="education-card" key={edu.school}>
            <h3 className="edu-school">{edu.school}</h3>
            <p className="edu-degree">{edu.degree}</p>
            <span className="edu-period">{edu.period}</span>
            {edu.note && <span className="edu-note">{edu.note}</span>}
          </div>
        ))}
      </div>
      <div className="credentials">
        {CREDENTIALS.map((cred) => (
          <span className="credential-badge" key={cred}>{cred}</span>
        ))}
      </div>
    </div>
  )
}

export default Education
