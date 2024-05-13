import React from 'react';
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './styles.css'; // Asegúrate de tener los estilos CSS asociados

export function Header () {
  return (
    
    <header id="header" className='header'>
      <div className="container">
        <h1><a>Jesús Torres García</a></h1>
        <h2>Desarrollador y <span>Analista de Datos</span> </h2>
        

        <nav id="navbar" className="navbar">
        <ul>
            <li><a className="nav-link active" href="#header">Inicio</a></li>
            <li><a className="nav-link" href="/about">Acerca de Mí</a></li>
            <li><a className="nav-link" href="/portfolio">Portafolio</a></li>
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
        </div>
      </div>
    </header>
  );
};

