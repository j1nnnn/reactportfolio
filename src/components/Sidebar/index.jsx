import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome, faUser, faBriefcase, faCode,
  faFolder, faGraduationCap, faEnvelope,
  faBars, faClose
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import LogoS from '../../assets/images/logo-dj.png'
import './index.scss'

const NAV_ITEMS = [
  { id: 'hero', icon: faHome, label: 'Home' },
  { id: 'about', icon: faUser, label: 'About' },
  { id: 'experience', icon: faBriefcase, label: 'Experience' },
  { id: 'skills', icon: faCode, label: 'Skills' },
  { id: 'projects', icon: faFolder, label: 'Projects' },
  { id: 'education', icon: faGraduationCap, label: 'Education' },
  { id: 'contact', icon: faEnvelope, label: 'Contact' },
]

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className="sidebar">
      <a className="logo" href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
        <img src={LogoS} alt="Jin Lim" />
      </a>

      <nav className={mobileOpen ? 'mobile-show' : ''}>
        {NAV_ITEMS.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`nav-item ${activeSection === id ? 'active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
          >
            <FontAwesomeIcon icon={icon} />
            <span className="nav-label">{label}</span>
          </button>
        ))}

        <button className="close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </nav>

      <div className="social-links">
        <a href="https://www.linkedin.com/in/jinwoo-lim23" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <a href="https://www.github.com/j1nnnn" target="_blank" rel="noreferrer" aria-label="GitHub">
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>

      <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  )
}

export default Sidebar
