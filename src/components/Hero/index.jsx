import { useEffect, useState } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

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
      <div className="hero-content">
        <h1 className="hero-greeting">
          <span className={letterClass}>H</span>
          <span className={`${letterClass} _12`}>i,</span>
          <br />
          <span className={`${letterClass} _13`}>I</span>
          <span className={`${letterClass} _14`} style={{ marginRight: '16px' }}>&apos;m</span>
          <span className="hero-name">
            <AnimatedLetters letterClass={letterClass} strArray={['J', ...nameArray]} idx={15} />
          </span>
        </h1>
        <h2 className="hero-title">Senior Software Engineer</h2>
        <div className="hero-subtitle">
          <span className="subtitle-text" key={subtitleIndex}>{subtitles[subtitleIndex]}</span>
        </div>
        <div className="hero-ctas">
          <a href="#projects" className="cta-primary">View My Work</a>
          <a href="#contact" className="cta-secondary">Get In Touch</a>
        </div>
      </div>
    </div>
  )
}
export default Hero
