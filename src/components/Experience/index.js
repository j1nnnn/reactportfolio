import './index.scss'
import AnimatedLetters from '../AnimatedLetters'
import LogoTitle from '../../assets/images/wellsfargo.png';
import LogoTitle2 from '../../assets/images/NJIT.png';
import { useEffect, useState } from 'react'
import Loader from 'react-loaders'

const Experience = () => {
    
    const [letterClass, setLetterClass] = useState('text-animate')

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

            <div className='container experience-page'>
                <div className='text-zone'>
                    <h1>
                        <AnimatedLetters 
                            letterClass={letterClass}
                            strArray={['E', 'x', 'p', 'e', 'r', 'i', 'e', 'n', 'c', 'e']}
                            idx={15}
                        />
                    </h1>
                    <img src={LogoTitle} alt="WellsFargo" class="image1"/>
                    <h2>
                        Wells Fargo
                    </h2>
                    <h3>
                        July 2023 - Current
                    </h3>
                    <p>
                        Software Engineer
                    </p>
                    <p>
                        <i>300 St. Brevard, Charlotte</i>
                    </p>
                    <h4>
                        Contributed to many of the Wealth and Investment management banking and Lending applications, by applying full-stack development, project management, UI/UX design, and to many of the SDLC / DevOps / Deployment processes
                    </h4>
                    <h4>
                    Implemented front-end frameworks, introduced new user interface and batch components integrating Kafka and creating new APIs
                    </h4>
                    <h6></h6>
                    
                    
                    {/* <img src={LogoTitle} alt="WellsFargo" class="image1"/>
                    <h2>
                        Wells Fargo
                    </h2>  */}
                    <h3>
                        July 2021 - August 2021
                    </h3>
                    
                    <p>
                        <b>Technology Program Analyst</b>
                    </p>
                    <p>
                        <i>300 St. Brevard, Charlotte</i>
                    </p>
                    <h4>
                        Developed automated unit tests for the front-end and back-end in banking software application in Wealth and Investment Management Technology while completing full migrations of software to the pivotal cloud foundries
                    </h4>
                    <h6></h6>

                    {/* <img src={LogoTitle} alt="WellsFargo" class="image1"/>
                    <h2>
                        Wells Fargo
                    </h2> */}
                    <h3>
                        July 2021 - August 2021
                    </h3>
                    <p>
                        <b>Technology Intern</b>
                    </p>
                    <p>
                        <i>300 St. Brevard, Charlotte</i>
                    </p>
                    <h4>
                    Developed automated unit tests for banking software applications in Wealth and Investment Management Technology while correcting issues and using Git to upload to Wells Fargo's developer services. 
                    Additionally, was a part of the agile transformation and became familiar with Scrum and Agile methodologies. 
                    </h4>

                    <br/>
                    <br/>
                    <br/>
                    <br/>    

                    <h5></h5>
                    <img src={LogoTitle2} alt="NJIT" class="image2"/>
                    <h2>
                        NJIT Career Development Services
                    </h2>
                    <h3>
                        2021-2022
                    </h3>
                    <p>
                        CDS Lead Advisor
                    </p>
                    <p>
                        <i>Address</i>
                    </p>
                    <h4>
                    Blank
                    </h4>
                   
                </div>
            </div>

            <Loader type="ball-grid-beat" />

        </>
    )
}

export default Experience