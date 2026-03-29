import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import './index.scss'

const variants = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const Contact = () => {
  const formRef = useRef()
  const svgRef = useRef()
  const isInView = useInView(svgRef, { margin: '-100px' })

  const sendEmail = (e) => {
    e.preventDefault()
    emailjs
      .sendForm('service_dgrqdjh', 'template_1i5m6la', formRef.current, 'ESgAkwZi7oCyUfLpi')
      .then(() => { alert('Message sent successfully!'); formRef.current.reset() }, () => { alert('Failed to send — please try again.') })
  }

  return (
    <motion.div className="contact" ref={svgRef} variants={variants} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
      <h2 className="section-heading">Get In Touch</h2>
      <div className="contact-wrapper">
        <motion.div className="phone-svg" initial={{ opacity: 1 }} whileInView={{ opacity: 0 }} transition={{ delay: 3, duration: 1 }}>
          <svg viewBox="0 0 32.666 32.666">
            <motion.path
              strokeWidth={0.2}
              fill="none"
              stroke="var(--color-primary)"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 3 }}
              d="M28.189,16.504h-1.666c0-5.437-4.422-9.858-9.856-9.858l-0.001-1.664C23.021,4.979,28.189,10.149,28.189,16.504z M19.189,5.209c0.915,0,1.664-0.748,1.664-1.666V1.666C20.854,0.748,20.104,0,19.189,0s-1.666,0.748-1.666,1.666v1.877C17.523,4.461,18.273,5.209,19.189,5.209z M13.685,16.504c0-3.046,2.479-5.524,5.523-5.524v-1.664c-3.966,0-7.187,3.222-7.187,7.188H13.685z M28.189,16.504c0,4.971-4.047,9.02-9.022,9.02c-1.573,0-3.062-0.4-4.362-1.112l-4.6,4.6C9.437,29.781,8.493,30.334,7.4,30.334c-2.106,0-3.816-1.71-3.816-3.816c0-1.093,0.553-2.037,1.322-2.805l4.6-4.6c-0.711-1.3-1.112-2.789-1.112-4.362C8.394,9.782,13.22,4.982,19.189,4.982"
            />
          </svg>
        </motion.div>
        <motion.div className="contact-layout" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 4, duration: 1 }}>
          <div className="contact-info">
            <p>I'm interested in ambitious projects and new opportunities. Whether you have a question or just want to connect, feel free to reach out.</p>
            <div className="contact-links">
              <a href="mailto:devj491@outlook.com"><FontAwesomeIcon icon={faEnvelope} /> devj491@outlook.com</a>
              <a href="https://www.linkedin.com/in/jinwoo-lim23" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a>
              <a href="https://www.github.com/j1nnnn" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /> GitHub</a>
            </div>
          </div>
          <form ref={formRef} onSubmit={sendEmail} className="contact-form">
            <div className="form-row">
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email" required />
            </div>
            <input type="text" name="subject" placeholder="Subject" required />
            <textarea name="message" placeholder="Message" rows="6" required />
            <motion.button type="submit" className="submit-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send Message</motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
export default Contact
