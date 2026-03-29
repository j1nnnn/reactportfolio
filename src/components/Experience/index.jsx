import './index.scss'
import AnimatedLetters from '../AnimatedLetters'
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

                    <h5></h5>
                    <h2>
                        Wells Fargo
                    </h2>
                    <h3>
                        July 2023 - Current
                    </h3>
                    <p>
                        <b>Software Engineer</b>
                    </p>
                    <p>
                        300 St. Brevard, Charlotte
                    </p>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As a part of WIMT,
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h6></h6>

                    <h3>
                        July 2021 - August 2021
                    </h3>
                    <p>
                        <b>Technology Program Analyst</b>
                    </p>
                    <p>
                        300 St. Brevard, Charlotte
                    </p>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As a part of WIMT,
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h6></h6>

                    <h3>
                        July 2021 - August 2021
                    </h3>
                    <p>
                        <b>Technology Intern</b>
                    </p>
                    <p>
                        300 St. Brevard, Charlotte
                    </p>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>

                    <br/>
                    <br/>
                    <br/>
                    <br/>    

                    <h5></h5>
                    <h2>
                        New Jersey Institute of Technology
                    </h2>
                    <h3>
                        2021-2022
                    </h3>
                    <p>
                        <b>NJIT Career Development Services</b>
                    </p>
                    <p>
                        CDS Advisor
                    </p>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>
                    <h4>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blank
                    </h4>

                </div>
            </div>

            <Loader type="ball-grid-beat" />

        </>
    )
}

export default Experience