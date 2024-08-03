import './index.scss'
import AnimatedLetters from '../AnimatedLetters'
import LogoPic1 from '../../assets/images/splunkicon.png'
import { useEffect, useState } from 'react'
import Loader from 'react-loaders'

const Projects = () => {
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
            <div className='container education-page'>
                <div className='text-zone'>
                    <h1>
                        <AnimatedLetters 
                            letterClass={letterClass}
                            strArray={['M', 'y', ' ', 'P', 'r', 'o', 'j', 'e', 'c', 't', 's']}
                            idx={15}
                        />
                    </h1>
                    
                    <h2>
                        OpenFin Analyst Project
                    </h2>
                    <h3>
                        Q2 2023
                    </h3>
                    <p>
                        Provided Splunk implementations in the OpenFin application.
                    </p>
                    
                    
                </div>
            </div>

            <Loader type="ball-grid-beat" />
        </>
    )
}

export default Projects