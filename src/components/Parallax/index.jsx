import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './index.scss'

const Parallax = ({ type }) => {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '500%'])
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="parallax" ref={ref}>
      <motion.h1 style={{ y: yText }}>
        {type === 'about' && 'Who I Am'}
        {type === 'projects' && "What I've Built"}
        {type === 'contact' && 'Get In Touch'}
      </motion.h1>
      <motion.div className="mountains" />
      <motion.div className="planets" style={{ y: yBg, backgroundImage: `url(${type === 'projects' ? '/reactportfolio/planets.png' : '/reactportfolio/sun.png'})` }} />
      <motion.div style={{ x: yBg }} className="stars" />
    </section>
  )
}
export default Parallax
