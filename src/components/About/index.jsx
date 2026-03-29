import './index.scss'
import AnimatedLetters from '../AnimatedLetters'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngular, faCss3, faGitAlt, faHtml5, faJsSquare, faReact } from '@fortawesome/free-brands-svg-icons'
import Loader from 'react-loaders'

const About = () => {
    
    const [letterClass, setLetterClass] = useState('text-animate')

    // useEffect causes routing problems
    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    });

    return (
        <>
            <div className='container about-page'>
                
                <div className='text-zone'>
                    <br/><br/>
                    <h1>
                        <AnimatedLetters 
                            letterClass={letterClass}
                            strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
                            idx={15}
                        />
                    </h1>

                    <p>
                        Hello, my name is Jinwoo Lim or you can call me Jin. Welcome to my personal portfolio website! Originally from a small town, 
                        I have had ambitions in the Technology world ever since I had the opportunity to touch a computer. As I was pursuing a 
                        bachelor's degree in Computer Science, it confirmed my passion for cutting edge technology and I have since engaged in many 
                        challenging and diverse projects that required my leadership and technical skillsets. 
                    </p>
                    <p>
                        I'd like to believe I'm an ambitious, adaptive, naturally curious, creative problem solver who also loves to lead any 
                        conversation or implementation of recent innovations. I'd like to explore more into the field of programming and 
                        ultimately to the fantastic world of artificial intelligence. I was fortunate enough to have 
                        experience in leading and managing teams of developers, business analysts, and financial advisors to reinvent new applications
                        and frameworks of current softwares used at Wells Fargo. Along with the experience gained from business and programming projects done at NJIT,
                        I believe I can fulfill most positions in the software engineering world with skills that I have acquired throughout these years. 
                        I will always be striving for more business ideas that involves progress through technology! 
                    </p>
                    <p>
                        If I need to define myself in one sentence that would be a family person, caring son, sports fanatic,
                        an open artist, and tech obsessed!

                        <br/><br/><br/>
                        <i>Scroll down for information about the website!</i>
                        <br/><br/><br/>
                    </p>

                    
            
                    
                    <h1>
                        <AnimatedLetters 
                            letterClass={letterClass}
                            strArray={['A', 'b', 'o', 'u', 't', ' ', 't', 'h', 'e', ' ', 'W', 'e', 'b', 's', 'i', 't', 'e']}
                            idx={15}
                        />
                    </h1>
                    
                    <br/><br/><br/>
                    
                    <div className='boxA'>
                        <FontAwesomeIcon icon={faReact} color="#5ED4F4"/>
                    </div>
                    <div className='boxB'>
                        <FontAwesomeIcon icon={faHtml5} color="#F06529"/>
                    </div>
                    <div className='boxC'>
                        <FontAwesomeIcon icon={faJsSquare} color="#EFD81D"/>
                    </div>
                    <div className='boxD'>
                        <FontAwesomeIcon icon={faGitAlt} color="#EC4D28"/>
                    </div>


                    <div className='boxE'>
                        <p>There were many <b>React</b> Libraries along with components used to design and make the website aesthetically.</p>
                    </div>
                    <div className='boxF'>
                        <p>As an <b>HTML5</b> front-end website potentially using a backend, this website is using most recent and modern frameworks.</p>
                    </div>
                    <div className='boxG'>
                        <p><b>JavaScript, typescript, and JSX</b> are the languages that runs this website.</p>
                    </div>
                    <div className='boxH'>
                        <p><b>Github</b> and <b>Github Pages</b> is used to host and run this website on a repository.</p>
                    </div>


                    <div className='box1'>
                        <FontAwesomeIcon icon={faReact} color="#5ED4F4"/>
                    </div>
                    <div className='box2'>
                        <FontAwesomeIcon icon={faHtml5} color="#F06529"/>
                    </div>
                    <div className='box3'>
                        <FontAwesomeIcon icon={faJsSquare} color="#EFD81D"/>
                    </div>
                    <div className='box4'>
                        <FontAwesomeIcon icon={faGitAlt} color="#EC4D28"/>
                    </div>


                    <div className='box5'>
                        <p>There were many <b>React</b> Libraries along with components used to design and make the website aesthetically.</p>
                    </div>
                    <div className='box6'>
                        <p>As an <b>HTML5</b> front-end website potentially using a backend, this website is using most recent and modern frameworks.</p>
                    </div>
                    <div className='box7'>
                        <p><b>JavaScript, typescript, and JSX</b> are the languages that runs this website.</p>
                    </div>
                    <div className='box8'>
                        <p><b>Github</b> and <b>Github Pages</b> is used to host and run this website on a repository.</p>
                    </div>
                    
                </div>

                <div className='stage-cube-cont'>
                    <div className='cubespinner'>
                        <div className='face1'>
                            <FontAwesomeIcon icon={faAngular} color="#DD0031"/>
                        </div>
                        <div className='face2'>
                            <FontAwesomeIcon icon={faHtml5} color="#F06529"/>
                        </div>
                        <div className='face3'>
                            <FontAwesomeIcon icon={faCss3} color="#28A4D9"/>
                        </div>
                        <div className='face4'>
                            <FontAwesomeIcon icon={faReact} color="#5ED4F4"/>
                        </div>
                        <div className='face5'>
                            <FontAwesomeIcon icon={faJsSquare} color="#EFD81D"/>
                        </div>
                        <div className='face6'>
                            <FontAwesomeIcon icon={faGitAlt} color="#EC4D28"/>
                        </div>
                    </div>
                </div>

                
            </div>

            

            <Loader type="ball-grid-beat" />
        </>
    )
}
export default About