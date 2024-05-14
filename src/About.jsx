// About.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faGitAlt, faGithub, faJsSquare, faJava, faCss3Alt, faHtml5 } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faFileWord, faTerminal } from '@fortawesome/free-solid-svg-icons';
import './styles.css'; // Asegúrate de tener los estilos CSS asociados
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

export function About() {
  const { t, i18n } = useTranslation('global');

  const IconBox = ({ icon, color }) => (
    <div className="icon-box">
      <FontAwesomeIcon icon={icon} style={{ color }} />
    </div>
  );

  function ResumeEdu(props) {
    return (
      <div className="resume-item">
        <h4>{t(props.title)}</h4>
        <h5>{props.duration}</h5>
        <p>
          <em>{t(props.university)}</em>
        </p>
      </div>
    );
  }

  function ResumePro(props) {
    return (
      <div className="resume-item">
        <h4>{t(props.title)}</h4>
        <h5>
          {t(props.company)} | {t(props.location)} | {props.duration}
        </h5>
        <p>{t(props.description)}</p>
        <p>
          <strong> {t(props.technologies)}</strong>
        </p>
      </div>
    );
  }


  return (
    <section id="about" className="about">
      <div className="about-me container">
        <div className="section-title">
          <h2>{t("about.header1")}</h2>
        </div>
        <div className="row">
          <div className="col-lg-4" data-aos="fade-right">
            <img src="https://unavatar.io/Jetoga99" className="img-fluid" alt="" />
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0" data-aos="fade-left">
            <h3>{t("about.title1")}</h3>
            <p className="fst-italic">{t("about.desc")}</p>
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i> <strong>Edad:</strong> <span>24</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i> <strong>Ciudad:</strong> <span>Ciudad de México</span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i> <strong>Email:</strong> <span>jetoga99@gmail.com</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i> <strong>Freelance:</strong> <span>Disponible</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="interests">
              <div className="section-title">
                <h2>Skills</h2>
              </div>
              <div className="box">
                <div className="icon-box">
                  <img src="https://raw.githubusercontent.com/kiewic/icons/master/svg/PowerBiLogo100x100.svg" alt="Power BI" />
                  <h3>Power BI</h3>
                </div>
                <IconBox icon={faPython} color="#ffcc25" />
                <IconBox icon={faDatabase} color="#5578ff" />
                <IconBox icon={faGitAlt} color="#f84600" />
                <IconBox icon={faGithub} color="#ffffff" />
                <IconBox icon={faJsSquare} color="#fbff00" />
                <IconBox icon={faJava} color="#f18724" />
                <IconBox icon={faTerminal} color="#fdfdfd" />
                <IconBox icon={faCss3Alt} color="#264de4" />
                <IconBox icon={faHtml5} color="#ff2600" />
                <IconBox icon={faFileWord} color="#0051ff" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="section-title">
          <h2>{t("about.resume")}</h2>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <h3 className="resume-title">{t("about.education.title")}</h3>
            {t('about.education.degrees', { returnObjects: true }).map((degree, index) => (
                    <ResumeEdu
                      key={index}
                      title={degree.degree}
                      duration={degree.years}
                      university={degree.location}
                    />
                  ))}
            <h3 className="resume-title">{t("about.certifications.title")}</h3>
            {t('about.certifications.certs', { returnObjects: true }).map((cert, index) => (
                    <ResumeEdu
                      key={index}
                      title={cert.course}
                      duration={cert.year}
                      university={cert.location}
                    />
                  ))} 
         </div>
          <div className="col-lg-6">
            <h3 className="resume-title">{t("about.jobs.title")}</h3>
            {t('about.jobs.exp', { returnObjects: true }).map((job, index) => (
                <ResumePro
                  key={index}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  duration={job.duration}
                  description={job.description}
                  technologies={job.technologies}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
