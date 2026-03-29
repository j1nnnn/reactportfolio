import './index.scss'

const PROJECTS = [
  {
    name: 'Financial Advisory Investment Platform',
    description: 'Enterprise micro-frontend platform managing billions in client investment assets. Sole engineer on the most complex module — asset allocation, portfolio rebalancing, and billing workflows.',
    tags: ['React 18', 'Zustand', 'Spring Boot', 'Kafka', 'OpenShift', 'Playwright'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'ReClassify',
    description: 'AI-driven asset reclassification platform combining LLM chat interface, RAG pipeline grounded in institutional data, and real-time compliance-aware approval dashboard. Built in 48 hours.',
    tags: ['AI/ML', 'LLM', 'RAG', 'React', 'NLP', 'Hackathon'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Market Relationships GUI',
    description: 'Replaced decades-old COBOL systems and manual Excel/email workflows with a production Angular platform for market-to-banker relationship management.',
    tags: ['Angular', 'Spring Boot', 'Oracle DB', 'Jenkins', 'Figma'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Account Maintenance GUI',
    description: 'First modern Angular + Spring Boot application in Wells Fargo Banking & Lending — ended legacy .NET reliance and set architecture standards for future development.',
    tags: ['Angular', 'Spring Boot', 'MongoDB', 'Java', 'REST APIs'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Pro-Link AI',
    description: 'AI-powered golf swing analysis platform using MediaPipe pose estimation, DTW-based ghost comparison, and professional archetype matching. Full-stack with Next.js and FastAPI.',
    tags: ['Next.js', 'React', 'FastAPI', 'MediaPipe', 'Python', 'AI/ML'],
    image: null,
    link: null,
    github: 'https://github.com/j1nnnn/AIProjectI',
  },
  {
    name: 'E2E Test Automation Program',
    description: 'Production release-gate framework spanning full micro-frontend architecture. Sole architect and SME — no code ships without sign-off. Built from zero in Playwright/TypeScript.',
    tags: ['Playwright', 'TypeScript', 'HP ALM Octane', 'CI/CD', 'Jenkins'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Scan2Invest',
    description: 'Computer Vision/AI mobile MVP — point camera at any product to identify investable assets with live market data. Won WIMT Hackathon, secured executive sponsorship.',
    tags: ['Computer Vision', 'React Native', 'AI/ML', 'Figma', 'REST APIs'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Career Showcase',
    description: 'Cross-business career fair format for Wells Fargo early talent community. Hosted 100+ attendees, adopted as a recurring initiative.',
    tags: ['Leadership', 'Event Management', 'Program Design'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'OpenFin Observability Dashboard',
    description: 'Enterprise observability dashboard for the OpenFin financial desktop platform. Led team of 6 analysts, built Splunk queries across 5 monitoring domains.',
    tags: ['Splunk', 'SPL', 'Dashboard Design', 'Data Visualization'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Customer Activity Dashboard',
    description: 'Cross-sector financial intelligence platform — unified real-time view of client activity across business lines. Top 3 finish at WIMT Hackathon.',
    tags: ['MongoDB', 'Angular', 'Kafka', 'RBAC', 'Hackathon'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Smart City of Aurora',
    description: 'Full-stack Smart City platform for Aurora, IL — real-time infrastructure mapping, smart parking, IoT sensor overlays. Senior capstone, 1st place midterm evaluation.',
    tags: ['React', 'Python', 'Google Maps API', 'GCP', 'IoT'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'University LMS',
    description: 'Full-featured Learning Management System with custom automated grading engine, What-If grade calculator, and role-based access for Students, Instructors, and Admins.',
    tags: ['PHP', 'JavaScript', 'Bootstrap', 'Heroku', 'RBAC'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'Human In Tech',
    description: 'Professional business website for a security camera and technology solutions company. Modern responsive design with service showcasing.',
    tags: ['React', 'Web Design', 'Responsive'],
    image: null,
    link: null,
    github: null,
  },
  {
    name: 'This Portfolio',
    description: 'Personal portfolio built with React and Vite. Single-page scroll design with animated interactions and EmailJS contact form.',
    tags: ['React', 'Vite', 'SCSS', 'EmailJS'],
    image: null,
    link: 'https://j1nnnn.github.io/reactportfolio/',
    github: 'https://github.com/j1nnnn/reactportfolio',
  },
]

const ProjectPreview = ({ name, image }) => {
  if (image) {
    return <div className="project-preview"><img src={image} alt={name} /></div>
  }
  // Generate initials for placeholder
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="project-preview project-preview-placeholder">
      <span className="preview-initials">{initials}</span>
    </div>
  )
}

const Projects = () => {
  return (
    <div className="projects">
      <h2 className="section-heading">Projects</h2>
      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <div className="project-card" key={project.name}>
            <ProjectPreview name={project.name} image={project.image} />
            <div className="project-body">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            {(project.link || project.github) && (
              <div className="project-links">
                {project.link && <a href={project.link} target="_blank" rel="noreferrer">Live Demo</a>}
                {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
export default Projects
