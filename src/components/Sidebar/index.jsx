import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faBriefcase, faCode, faFolder, faGraduationCap, faEnvelope, faBars, faClose } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import LogoS from '../../assets/images/logo-dj.png'
import './index.scss'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: faHome },
  { id: 'about', label: 'About', icon: faUser },
  { id: 'experience', label: 'Experience', icon: faBriefcase },
  { id: 'skills', label: 'Skills', icon: faCode },
  { id: 'projects', label: 'Projects', icon: faFolder },
  { id: 'education', label: 'Education', icon: faGraduationCap },
  { id: 'contact', label: 'Contact', icon: faEnvelope },
]

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id) }) },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    NAV_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  return (
    <div className="sidebar">
      <a className="logo" href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
        <img src={LogoS} alt="Jin Lim" />
      </a>
      <nav className="nav-links">
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollTo(id) }}>
            <FontAwesomeIcon icon={icon} />
            <span className="nav-label">{label}</span>
          </a>
        ))}
      </nav>
      <div className="social-links">
        <a href="https://www.linkedin.com/in/jinwoo-lim23" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
        <a href="https://www.github.com/j1nnnn" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
      </div>

      {/* Mobile hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={menuOpen ? faClose : faBars} />
      </button>
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollTo(id) }}>
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
export default Sidebar
