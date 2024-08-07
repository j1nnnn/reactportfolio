import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoTitle from '../../assets/images/logo-j.png';
import AnimatedLetters from '../AnimatedLetters';
import Logo from './Logo';
import './index.scss';
import Loader from 'react-loaders';


const Home = () => {
    const [letterClass, setLetterClass] = useState('text-animate')
    const nameArray = ['i', 'n']
    const jobArray = ['S', 'o', 'f', 't', 'w', 'a', 'r', 'e', ' ', 'E', 'n', 'g', 'i', 'n', 'e', 'e', 'r']

    // useEffect causes routing problems
    /* 

    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass('text-animate-hover')

        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    });

        }, 4000)
    }, [])
    */
    
    return (
        <>
        <div className="container home-page"> 
            <div className="text-zone">
                <h1>
                <span className={letterClass}>H</span>
                <span className={`${letterClass} _12`}>i,</span>
                <br />
                <span className={`${letterClass} _13`}>I</span>
                <span className={`${letterClass} _14`}>'m</span>
                <img src={LogoTitle} alt="developer" />
                <AnimatedLetters letterClass={letterClass}
                strArray={nameArray}
                idx={15}/>
                <br />
                <AnimatedLetters letterClass={letterClass}
                strArray={jobArray}
                idx={19}/>
                </h1>
                <h2>Software Engineering / Full-Stack / AI / Automation / Agile </h2>
                <Link to="/contact" className='flat-button'>CONTACT ME</Link>
            </div>

        </div>
        <Loader type="ball-grid-beat" />
        </>
    )
}

/*  
        The original with Logo for GSAP

            <Link to="/contact" className='flat-button'>CONTACT ME</Link>
        </div>
        <Logo />

    </div>
    <Loader type="pacman" />
    
    */

export default Home;
