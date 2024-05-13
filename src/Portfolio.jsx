import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3, faJs, faReact } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faFileWord, faTerminal } from '@fortawesome/free-solid-svg-icons';

const Portfolio = () => {
    const Card = ({ imageSrc, title, text, icons,refs }) => {
        return (
            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
                <div className="card text-white">
                    <img src={imageSrc} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title" >{title}</h5>
                        <p className="card-text">{text}</p>
                        <div className="card-icons">
                            {icons.map((icon, index) => (
                                <a key={index}><FontAwesomeIcon icon={icon} /></a>
                            ))}
                        </div>
                        <a href={refs} target="_blank" className="stretched-link"></a>
                    </div>
                </div>
            </div>
        );
    };
    

    return (
        <section id="portfolio" className="services">
            <div className="container">
                <div className="section-title">
                    <h2>Portafolio</h2>
                    <p>Esto es lo que sé hacer</p>
                </div>

                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                        imageSrc="./Miopers.png"
                        title="MiOpERS"
                        text="Mejoras en página web para análisis de tweets sobre COVID-19, incluyendo formularios de usuario y operaciones CRUD con MySQL en Django. Integración de React y MongoDB para análisis de tweets."
                        icons={[faReact,faJs, faDatabase ]}
                        refs="http://www.miopers.unam.mx/covid/"
                        
                    />
  
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
