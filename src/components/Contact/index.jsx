import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import './index.scss'

const Contact = () => {
  const formRef = useRef()

  const sendEmail = (e) => {
    e.preventDefault()
    emailjs
      .sendForm('service_dgrqdjh', 'template_1i5m6la', formRef.current, 'ESgAkwZi7oCyUfLpi')
      .then(
        () => {
          alert('Message sent successfully!')
          formRef.current.reset()
        },
        () => {
          alert('Failed to send — please try again.')
        }
      )
  }

  return (
    <div className="contact">
      <h2 className="section-heading">Get In Touch</h2>
      <div className="contact-layout">
        <div className="contact-info">
          <p>
            I'm interested in ambitious projects and new opportunities. Whether you
            have a question or just want to connect, feel free to reach out.
          </p>
          <div className="contact-links">
            <a href="mailto:devj491@outlook.com">
              <FontAwesomeIcon icon={faEnvelope} /> devj491@outlook.com
            </a>
            <a href="https://www.linkedin.com/in/jinwoo-lim23" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>
            <a href="https://www.github.com/j1nnnn" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </div>
        </div>
        <form ref={formRef} onSubmit={sendEmail} className="contact-form">
          <div className="form-row">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
          </div>
          <input type="text" name="subject" placeholder="Subject" required />
          <textarea name="message" placeholder="Message" rows="6" required />
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact
