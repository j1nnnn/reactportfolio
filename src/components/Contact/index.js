import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

const Contact = () =>  {
    const [letterClass, setLetterClass] = useState('text-animate')
    const refForm = useRef()

    // useEffect causes routing problems, damage is not a function
    /*
    useEffect(() => {
        return setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 4000)
    }, [])
    */

    const sendEmail = (e) => {
        e.preventDefault()

        emailjs
            .sendForm(
                'service_dgrqdjh',
                'template_1i5m6la',
                refForm.current,
                'ESgAkwZi7oCyUfLpi'
            )
            .then(
                () => {
                    alert('Message successfully sent!')
                    window.location.reload(false)
                },
                () => {
                    alert('Failed to send the message, please try again!')
                }
            )
    }

    return (
    <>
        <div className='container contact-page'>
            <div className='text-zone'>
                <h1>
                    <AnimatedLetters
                        letterClass={letterClass}
                        strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'm', 'e']}
                        idx={15}
                    />
                </h1>
                <p>
                    I am interested in any opportunities - especially ambitious or large projects. 
                    However, if you have other request or question, don't hesitate to contact me 
                    using below form either. 
                    <br/><br/>
                    I am also open to any feedback regarding the design and content of this website!
                </p>
                <div className='contact-form'>
                    <form ref={refForm} onSubmit={sendEmail}>
                        <ul>
                            <li className='half'>
                                <input type="text" name="name" placeholder="Name" required font-family/>
                            </li>
                            <li className='half'>
                                <input type="email" name="email" placeholder="Email" required/>
                            </li>
                            <li>
                                <input placeholder="Subject" type="text" name="subject" required/>
                            </li>
                            <li>
                                <textarea placeholder="Message" name="message" required></textarea>
                            </li>
                            <li>
                                <input type="submit" className="flat-button" value="SEND" />
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
        <Loader type="ball-grid-beat" />   
    </>
    )
}

export default Contact
