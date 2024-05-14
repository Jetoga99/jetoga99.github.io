import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3, faJs, faReact } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faFileWord, faTerminal } from '@fortawesome/free-solid-svg-icons';

const Portfolio = () => {
    const { t ,i18n} = useTranslation('global');

    const Card = ({ imageSrc, title, text, icons, refs }) => {
        return (
            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
                <div className="card text-white">
                    <img src={imageSrc} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{text}</p>
                        <div className="card-icons">
                            {icons.map((icon, index) => (
                                <a key={index}><FontAwesomeIcon icon={icon} /></a>
                            ))}
                        </div>
                        <a href={refs} target="_blank" className="stretched-link" rel="noopener noreferrer"></a>
                    </div>
                </div>
            </div>
        );
    };

    const projects = t('portfolio.projects', { returnObjects: true });

    return (
        <section id="portfolio" className="services">
            <div className="container">
                <div className="section-title">
                    <h2>{t('header.portfolio')}</h2>
                </div>

                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                    {projects.map((project, index) => (
                        <Card
                            key={index}
                            imageSrc={project.imageSrc}
                            title={t(project.title)}
                            text={t(project.text)}
                            icons={project.icons.map(icon => {
                                switch(icon) {
                                    case 'faHtml5': return faHtml5;
                                    case 'faCss3': return faCss3;
                                    case 'faJs': return faJs;
                                    case 'faReact': return faReact;
                                    case 'faDatabase': return faDatabase;
                                    case 'faFileWord': return faFileWord;
                                    case 'faTerminal': return faTerminal;
                                    default: return null;
                                }
                            })}
                            refs={project.refs}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
