import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3, faJs, faReact, faPython } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faFileWord, faTerminal } from '@fortawesome/free-solid-svg-icons';

const ICON_MAP = {
    faHtml5, faCss3, faJs, faReact, faDatabase, faFileWord, faTerminal, faPython,
};

const Card = ({ imageSrc, title, text, icons, refs }) => (
    <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
        <div className="card text-white">
            <img src={imageSrc} className="card-img-top" alt={title} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{text}</p>
                <div className="card-icons">
                    {icons.map((icon, index) => icon && (
                        <span key={index} aria-hidden="true">
                            <FontAwesomeIcon icon={icon} />
                        </span>
                    ))}
                </div>
                <a href={refs} target="_blank" className="stretched-link" rel="noopener noreferrer" aria-label={`View project: ${title}`}></a>
            </div>
        </div>
    </div>
);

const Portfolio = () => {
    const { t } = useTranslation('global');

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
                            title={project.title}
                            text={project.text}
                            icons={project.icons.map(icon => ICON_MAP[icon] ?? null)}
                            refs={project.refs}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
