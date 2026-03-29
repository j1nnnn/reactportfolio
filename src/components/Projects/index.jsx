import useScrollReveal from '../../hooks/useScrollReveal'
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
    description: 'Personal portfolio built with React and Vite. Single-page scroll design with animated interactions, Intersection Observer navigation, and EmailJS contact form.',
    tags: ['React', 'Vite', 'SCSS', 'EmailJS'],
    link: 'https://j1nnnn.github.io/reactportfolio/',
    github: 'https://github.com/j1nnnn/reactportfolio',
  },
]

const Projects = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className={`projects reveal ${isVisible ? 'revealed' : ''}`} ref={ref}>
      <h2 className="section-heading">Projects</h2>
      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <div className="project-card" key={project.name}>
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
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer">Live Demo</a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
