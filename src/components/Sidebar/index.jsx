import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import LogoS from '../../assets/images/logo-dj.png'
import './index.scss'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const bgVariants = {
  open: { clipPath: 'circle(1200px at 50px 50px)', transition: { type: 'spring', stiffness: 20 } },
  closed: { clipPath: 'circle(30px at 50px 50px)', transition: { delay: 0.5, type: 'spring', stiffness: 400, damping: 40 } },
}

const linksVariants = {
  open: { transition: { staggerChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const itemVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 50, opacity: 0 },
}

const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id) }) },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    NAV_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }

  return (
    <motion.div className="sidebar" animate={open ? 'open' : 'closed'}>
      <motion.div className="sidebar-bg" variants={bgVariants}>
        <motion.div className="sidebar-links" variants={linksVariants}>
          {NAV_ITEMS.map(({ id, label }) => (
            <motion.a key={id} href={`#${id}`} variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className={activeSection === id ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo(id) }}>
              {label}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
      <button className="sidebar-toggle" onClick={() => setOpen((p) => !p)}>
        <svg width="23" height="23" viewBox="0 0 23 23">
          <motion.path strokeWidth="3" stroke="white" strokeLinecap="round" variants={{ closed: { d: 'M 2 2.5 L 20 2.5' }, open: { d: 'M 3 16.5 L 17 2.5' } }} />
          <motion.path strokeWidth="3" stroke="white" strokeLinecap="round" d="M 2 9.423 L 20 9.423" variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} />
          <motion.path strokeWidth="3" stroke="white" strokeLinecap="round" variants={{ closed: { d: 'M 2 16.346 L 20 16.346' }, open: { d: 'M 3 2.5 L 17 16.346' } }} />
        </svg>
      </button>
      <div className="sidebar-persistent">
        <a className="logo" href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
          <img src={LogoS} alt="Jin Lim" />
        </a>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/jinwoo-lim23" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="https://www.github.com/j1nnnn" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
        </div>
      </div>
    </motion.div>
  )
}
export default Sidebar
