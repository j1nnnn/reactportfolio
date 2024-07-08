import AnimatedLetters from '../AnimatedLetters';
import { useEffect, useState } from 'react';
import "./index.scss";
import Loader from 'react-loaders';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const Portfolio = () => {
    const [letterClass, setLetterClass] = useState('text-animate');
    const [portfolio, setPortfolio] = useState([]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass('text-animate-hover');
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }); 

    useEffect(() => {
        getPortfolio();
    }, []);



    const getPortfolio = async () => {
        const querySnapshot = await getDocs(collection(db, 'portfolio'));
        setPortfolio(querySnapshot.docs.map((doc) => doc.data()));
    }
    
    
    const renderPortfolio = (portfolio) => {
        return ( // don't forget about the sort!!
            <div className="images-container">
                {
                    portfolio.sort((a,b) => a.dates > b.dates ? 1 : -1).map((port, idx) => {
                        return (
                            <div className="image-box" key={idx}>
                                <img 
                                src={port.image} 
                                className="portfolio-image"
                                alt="portfolio" />
                                <div className='content'>
                                    <p className='title'><b>{port.name}</b></p>
                                    <h3 className='dates'>{port.dates}</h3>
                                    <h4 className='description'>{port.description}</h4>
                                    <button className='btn' onClick={() => window.open(port.url)}
                                    >View</button>
                                </div>    
                            </div>
                        )
                    })
                }

            </div>
        );
    }
    

    return (
        <>
            <div className='container portfolio-page'>
                <h1 className="page-title">
                    <AnimatedLetters 
                        letterClass={letterClass}
                        strArray={"Portfolio".split("")}
                        idx={15}
                    />
                </h1>
                <div>{renderPortfolio(portfolio)}</div>
            </div>
            
            <Loader type="ball-grid-beat" />
        </>
    );
}

export default Portfolio