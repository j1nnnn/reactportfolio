import './index.scss';
import AnimatedLetters from '../AnimatedLetters';
import LogoTitle from '../../assets/images/NJIT.png';
import { useEffect, useState } from 'react';
import Loader from 'react-loaders';

const Education = () => {
    
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
            <div className='container education-page'>
                <div className='text-zone'>
                    <h1>
                        <AnimatedLetters 
                            letterClass={letterClass}
                            strArray={['E', 'd', 'u', 'c', 'a', 't', 'i', 'o', 'n']}
                            idx={15}
                        />
                    </h1>
                    <img src={LogoTitle} alt="NJIT" class='image2'/>
                    <h2>
                        New Jersey Institute of Technology
                    </h2>
                    <h3>
                        Sept. 2018 - May 2022
                    </h3>
                    <p>
                        Bachelor's Degree in <i>Computer Science</i> from Ying Wu College of Computing.
                        <br></br>
                        Graduated Cum Laude.
                    </p>
                    <p>
                        <b>Relevant Coursework</b>
                    </p>
                    <h4>
                        Guided Design in Software Engineering
                    </h4>
                    <h4>
                        Computer Architechure
                    </h4>
                    <h4>
                        Principles of Operating Systems
                    </h4>
                    <h4>
                        Tech Entrepreneurship
                    </h4>
                    <h4>
                        Professional Development in Engineering
                    </h4>
                    <h4>
                        Senior Project Capestone
                    </h4>
                    <h5></h5>

                    <h2>
                        Graduate School
                    </h2>
                    <h3>
                        2023 - 2025
                    </h3>
                    <p>
                        Graduate's Degree in <i>blank</i> 
                        <br></br>
                        Graduated <i>blank</i>
                    </p>
                    <p>
                        <b>Relevant Coursework</b>
                    </p>
                    <h4>
                    Class 1
                    </h4>
                    <h4>
                    Class 1
                    </h4>
                    <h4>
                    Class 1
                    </h4>
                    <h4>
                    Class 1
                    </h4>
                    <h5></h5>

                </div>
            </div>

            <Loader type="ball-grid-beat" />
        </>
    )

}


export default Education