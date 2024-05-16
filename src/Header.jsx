import React, { useState } from 'react';
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEnvelope ,faFile, faCircleHalfStroke, faLanguage} from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './styles.css'; // Asegúrate de tener los estilos CSS asociados
import { useTranslation } from 'react-i18next';


export function Header () {
  const { t, i18n } = useTranslation('global');
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Estado para el idioma actual

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage); // Actualiza el estado del idioma actual
  };
  
  return (
    
    
    <header id="header" className='header'>
      <div className="container">
        <h1><a>Jesús Torres García</a></h1>
        <h2>{t("header.desc1")}<span>{t("header.desc2")}</span> </h2>
        

        <nav id="navbar" className="navbar">
        <ul>
            <li><a className="nav-link active" href="#header">{t("header.home")}</a></li>
            <li><a className="nav-link" href="/about">{t("header.about")}</a></li>
            <li><a className="nav-link" href="/portfolio">{t("header.portfolio")}</a></li>
            <li><FontAwesomeIcon id='toggle-language-btn' icon={faLanguage}    onClick={handleChangeLanguage}
                title={currentLanguage === 'en' ? 'Switch to Spanish' : 'Switch to English'}/></li>

            <li><FontAwesomeIcon id='toggle-theme-btn' icon={faCircleHalfStroke} /></li>

          </ul>
          <i id="mobilen" className="bi bi-list mobile-nav-toggle"></i>
        </nav>

        <div className="social-links">
          <a href="https://twitter.com/jetoga9" target="_self">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.linkedin.com/in/jesustorres-garcia/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="mailto:jetoga99@gmail.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://github.com/jetoga99" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="/Jesus_Torres_G_CurriculumVitae.pdf" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFile} />
          </a>

        </div>
      </div>
    </header>
  );
};

