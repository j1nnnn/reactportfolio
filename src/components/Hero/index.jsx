import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const textVariants = {
  initial: { x: -500, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 1, staggerChildren: 0.1 } },
}

const sliderVariants = {
  initial: { x: 0 },
  animate: { x: '-220%', transition: { repeat: Infinity, repeatType: 'mirror', duration: 20 } },
}

const Hero = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [subtitleIndex, setSubtitleIndex] = useState(0)
  const nameArray = ['i', 'n']
  const subtitles = ['Full-Stack', 'Cloud-Native', 'AI / ML', 'FinTech']

  useEffect(() => {
    const timer = setTimeout(() => setLetterClass('text-animate-hover'), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setSubtitleIndex((p) => (p + 1) % subtitles.length), 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero">
      <motion.div className="hero-content" variants={textVariants} initial="initial" animate="animate">
        <motion.h1 className="hero-greeting" variants={textVariants}>
          <span className={letterClass}>H</span>
          <span className={`${letterClass} _12`}>i,</span>
          <br />
          <span className={`${letterClass} _13`}>I</span>
          <span className={`${letterClass} _14`}>&apos;m </span>
          <span className="hero-name">
            <AnimatedLetters letterClass={letterClass} strArray={['J', ...nameArray]} idx={15} />
          </span>
        </motion.h1>
        <motion.h2 className="hero-title" variants={textVariants}>Senior Software Engineer</motion.h2>
        <motion.div className="hero-subtitle" variants={textVariants}>
          <span className="subtitle-text" key={subtitleIndex}>{subtitles[subtitleIndex]}</span>
        </motion.div>
        <motion.div className="hero-ctas" variants={textVariants}>
          <motion.a href="#projects" className="cta-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>View My Work</motion.a>
          <motion.a href="#contact" className="cta-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Get In Touch</motion.a>
        </motion.div>
        <motion.img src="/reactportfolio/scroll.png" alt="" className="scroll-icon" animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </motion.div>
      <motion.div className="sliding-text" variants={sliderVariants} initial="initial" animate="animate">
        AI/ML Full-Stack Cloud-Native FinTech
      </motion.div>
    </div>
  )
}
export default Hero
