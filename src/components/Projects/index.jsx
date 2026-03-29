import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import './index.scss'

const PROJECTS = [
  {
    name: 'Pro-Link AI',
    description: 'AI-powered golf swing analysis platform using MediaPipe pose estimation, DTW-based ghost comparison, and professional archetype matching. Full-stack with Next.js frontend and FastAPI backend.',
    tags: ['Next.js', 'React', 'FastAPI', 'MediaPipe', 'Python', 'AI/ML'],
    link: null,
    github: 'https://github.com/j1nnnn/AIProjectI',
  },
  {
    name: 'Human In Tech',
    description: 'Professional business website for a security camera and technology solutions company. Modern design with responsive layouts and service showcasing.',
    tags: ['React', 'Web Design', 'Responsive'],
    link: null,
    github: null,
  },
  {
    name: 'This Portfolio',
    description: 'Personal portfolio built with React and Vite. Single-page scroll design with Framer Motion animations, parallax effects, and EmailJS contact form.',
    tags: ['React', 'Vite', 'Framer Motion', 'SCSS'],
    link: 'https://j1nnnn.github.io/reactportfolio/',
    github: 'https://github.com/j1nnnn/reactportfolio',
  },
]

const variants = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const Projects = () => {
  const containerRef = useRef()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div className="projects" ref={containerRef} variants={variants} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
      <div className="progress-section">
        <h2 className="section-heading">Projects</h2>
        <motion.div className="progress-bar" style={{ scaleX }} />
      </div>
      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <motion.div className="project-card" key={project.name} variants={variants} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }}>
            <div className="project-body">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="project-links">
              {project.link && <a href={project.link} target="_blank" rel="noreferrer">Live Demo</a>}
              {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
export default Projects
