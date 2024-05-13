// About.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faGitAlt, faGithub, faJsSquare, faJava, faCss3Alt, faHtml5 } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faFileWord, faTerminal } from '@fortawesome/free-solid-svg-icons';
import './styles.css'; // Asegúrate de tener los estilos CSS asociados
import 'bootstrap/dist/css/bootstrap.min.css';

export function About() {
  const IconBox = ({ icon, color }) => (
    <div className="icon-box">
      <FontAwesomeIcon icon={icon} style={{ color }} />
    </div>
  );

  function ResumeEdu(props) {
    return (
      <div className="resume-item">
        <h4>{props.title}</h4>
        <h5>{props.duration}</h5>
        <p>
          <em>{props.university}</em>
        </p>
      </div>
    );
  }

  function ResumePro(props) {
    return (
      <div className="resume-item">
        <h4>{props.title}</h4>
        <h5>
          {props.company} | {props.location} | {props.duration}
        </h5>
        <p>{props.description}</p>
        <p>
          <strong>Tecnologías utilizadas:</strong> {props.technologies}
        </p>
      </div>
    );
  }

  return (
    <section id="about" className="about">
      <div className="about-me container">
        <div className="section-title">
          <h2>Acerca de Mí</h2>
        </div>
        <div className="row">
          <div className="col-lg-4" data-aos="fade-right">
            <img src="https://unavatar.io/Jetoga99" className="img-fluid" alt="" />
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0" data-aos="fade-left">
            <h3>Desarrollador &amp; Analista de Datos</h3>
            <p className="fst-italic">
              ¡Hola! Soy Jesús, soy un analista de datos y desarrollador FullStack.
              En mis estudios universitarios desarrollé un gran interés por la programación, estadística y técnicas de machine learning.
            </p>
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i> <strong>Edad:</strong> <span>24</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i> <strong>Ciudad:</strong> <span>Ciudad de México, México</span>
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
          <h2>Resumen</h2>
          <p>Un poco de mí</p>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <h3 className="resume-title">Educación</h3>
            <ResumeEdu
              title="Ingeniería en Desarrollo de Software"
              duration="2024 - 2026"
              university="Universidad Virtual del Estado de Guanajuato"
            />
            <ResumeEdu
              title="Licenciatura en Física"
              duration="2018 - 2023"
              university="Universidad Nacional Autónoma de México"
            />
            <h3 className="resume-title">Cursos y Certificaciones</h3>
            <ResumeEdu title="Analisis de Datos de Google" duration="2022" university="Coursera" />
            <ResumeEdu title="NMA Deep Learning" duration="2022" university="Neuromatch Academy" />
            <ResumeEdu title="Scientific Computing with Python" duration="2022" university="freeCodeCamp" />
          </div>
          <div className="col-lg-6">
            <h3 className="resume-title">Experiencia Profesional</h3>
            <ResumePro
              title="ANALISTA BI SR Marketing & Promotion"
              company="Samsung"
              location="CDMX"
              duration="Nov 2023 - Presente"
              description="Mantenimiento y actualización de dashboards en Excel, mediante el uso de fórmulas y Visual Basic. Propuestas de migración a dashboards en PowerBI que permitieran un ciclo de mantenimiento más innovador y menos susceptible al error humano. Creación de código en Python para la extracción de datos en plataformas para posterior transformación y análisis de los datos."
              technologies="Excel, VBA, Python, PowerBI"
            />

            <ResumePro
              title="ANALISTA DE DATOS"
              company="SOPRIS Technologies, INC."
              location="CDMX"
              duration="Ago - Oct 2023"
              description="Mantenimiento y desarrollo de soluciones para creación de reportes a través de Plotly, Dash. Desarrollo mediante Git y extracción de datos mediante BigQuery para su posterior manipulación mediante Python. Creación y mantenimiento de dashboards mediante Looker Studio. Estudio y documentación de flujos de carga en Looker."
              technologies="Python, Dash, Git, BigQuery, Looker Studio"
            />

            <ResumePro
              title="SERVICIO SOCIAL"
              company="IIMAS, UNAM"
              location="CDMX"
              duration="Feb - Sep 2023"
              description="Desarrollo de mejoras en página web dedicada al análisis de tweets con enfoque principal al COVID-19, creación de formularios para la creación de usuarios, actualización de base de datos mediante operaciones CRUD con MySQL, React e integración con Django. Implementación de código para el análisis de tweets almacenados en MongoDB."
              technologies="Python, Django, React, Postman, MySQL, MongoDB"
            />

            <ResumePro
              title="ESPECIALISTA EN MINERÍA DE DATOS Y CRÉDITO"
              company="Fincomún"
              location="CDMX"
              duration="May - Jul 2023"
              description="Automatización de procesos para la asignación de créditos mediante políticas de decisión a través de la extracción de datos de productos de Buró de Crédito (Watch, Adviser). Elaboración de bases de datos para su posterior explotación y obtención de indicadores o entrega a proveedores."
              technologies="Python, R Studio, Excel, PowerBI"
            />

            <ResumePro
              title="ANALISTA DE RIESGOS"
              company="Fincomún"
              location="CDMX"
              duration="Ene - Abr 2023"
              description="Elaboración y actualización de reportes diarios para la detección temprana del deterioro de la cartera. Creación de dashboards mediante Python y PowerBI para observar datos históricos con el fin de detectar patrones para modificar políticas de riesgo. Creación de flujos de trabajo en Power Automate para el envío automático de reportes."
              technologies="Python, R Studio, Excel, PowerBI, Power Automate"
            />

            <ResumePro
              title="BECARIO DE RIESGOS"
              company="Fincomún"
              location="CDMX"
              duration="Oct 2022 - En 2023"
              description="Diseño de flujos de trabajo para la automatización de procesos en Excel a través de Python con el objetivo de obtención de métricas. Limpieza y transformación de datos mediante Python y R Studio. Creación de reportes para presentar a gerencia."
              technologies="Python, R Studio, Excel"
            />

            <ResumePro
              title="DESARROLLO WEB FREELANCE"
              company="Generation"
              location="CDMX"
              duration="Ago - Oct 2022"
              description="Maquetación y diseño de página web haciendo uso de CSS, HTML y Figma, desarrollo de interacción con la página mediante JavaScript y desarrollo de back-end al diseñar base de datos con MySQL e integración con Java."
              technologies="CSS, HTML, Figma, JavaScript, MySQL, Java, Git, Github"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
