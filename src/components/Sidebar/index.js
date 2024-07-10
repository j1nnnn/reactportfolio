import { Link, NavLink } from 'react-router-dom';
// import { Link } from 'react-scroll';
import './index.scss';
import LogoS from '../../assets/images/logo-dj.png'
import LogoSubtitle from '../../assets/images/logo_sub.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHome, faUser, faSchool, faComputer, faFolder, faGears, faBars, faClose, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';

const Sidebar = () => {
    const [showNav, setShowNav] = useState(false);

// const Sidebar = () => (
//     <div className='nav-bar'>
//         <Link className='logo' to='/'>
//             <img src={LogoS} alt="logo" />
//             <img className='sub-logo' src={LogoSubtitle} alt="jinwoo" />
//         </Link>
//         <nav>
//             <NavLink exact="true" activeclassname="active" to="/">
//                 <FontAwesomeIcon icon={faHome} color="#4d4d4e" />
//             </NavLink>
//             <NavLink exact="true" activeclassname="active" className="about-link" to="/about">
//                 <FontAwesomeIcon icon={faUser} color="#4d4d4e" />
//             </NavLink>
//             <NavLink exact="true" activeclassname="active" className="contact-link" to="/contact">
//                 <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e" />
//             </NavLink>
//         </nav>
//         <ul>
//             <li>
//                 <a target="_blank" rel='noreferrer' href="https://www.linkedin.com/in/cs22-jinwoo-lim">
//                     <FontAwesomeIcon icon={faLinkedin} color="#4d4d4e" />
//                 </a>
//             </li>
//             <li>
//                 <a target="_blank" rel='noreferrer' href="https://www.github.com/j1nnnn">
//                     <FontAwesomeIcon icon={faGithub} color="#4d4d4e" />
//                 </a>
//             </li>
//         </ul>
//     </div>
// )

    return (
        <div className='nav-bar'>
            <Link className='logo' to='/'>
                <img src={LogoS} alt="logo" />
                <img className='sub-logo' src={LogoSubtitle} alt="jinwoo" />
            </Link>
            <nav className={showNav ? 'mobile-show' : ''}>
                <NavLink onClick={() => setShowNav (false)} exact="true" activeclassname="active" to="/">
                    <FontAwesomeIcon icon={faHome} color="#4d4d4e" />
                </NavLink>
                <NavLink onClick={() => setShowNav (false)} activeclassname="active" className="about-link" to="/about">
                    <FontAwesomeIcon icon={faUser} color="#4d4d4e" />
                </NavLink>
                <NavLink onClick={() => setShowNav (false)} activeclassname="active" className="education-link" to="/education">
                    <FontAwesomeIcon icon={faSchool} color="#4d4d4e" />
                </NavLink>
                <NavLink onClick={() => setShowNav (false)} activeclassname="active" className="experience-link" to="/experience">
                    <FontAwesomeIcon icon={faFolder} color="#4d4d4e" />
                </NavLink>
                <NavLink onClick={() => setShowNav (false)} activeclassname="active" className="projects-link" to="/projects">
                    <FontAwesomeIcon icon={faComputer} color="#4d4d4e" />
                </NavLink>
                <NavLink onClick={() => setShowNav (false)} activeclassname="active" className="portfolio-link" to="/portfolio">
                    <FontAwesomeIcon icon={faSuitcase} color="#4d4d4e" />
                </NavLink>
                <NavLink onClick={() => setShowNav (false)} activeclassname="active" className="skills-link" to="/skills">
                    <FontAwesomeIcon icon={faGears} color="#4d4d4e" />
                </NavLink>
                <NavLink onClick={() => setShowNav (false)} activeclassname="active" className="contact-link" to="/contact">
                    <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e" />
                </NavLink>

                <FontAwesomeIcon 
                    onClick={() => setShowNav (false)}
                    icon={faClose}
                    color="#ffd700"
                    size='3x'
                    className='close-icon'
                />
            </nav>
            <ul>
                <li>
                    <a target="_blank" rel='noreferrer' href="https://www.linkedin.com/in/cs22-jinwoo-lim">
                        <FontAwesomeIcon icon={faLinkedin} color="#4d4d4e" />
                    </a>
                </li>
                <li>
                    <a target="_blank" rel='noreferrer' href="https://www.github.com/j1nnnn">
                        <FontAwesomeIcon icon={faGithub} color="#4d4d4e" />
                    </a>
                </li>
            </ul>
            <FontAwesomeIcon
                onClick={() => setShowNav(true)}
                icon={faBars}
                color="#ffd700"
                size="3x"
                className='hamburger-icon' 
            />
        </div>
    )
}

export default Sidebar
