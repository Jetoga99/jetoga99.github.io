import { useTranslation } from 'react-i18next';

export function Projects() {
  const { t } = useTranslation('global');
  const items = t('projects.items', { returnObjects: true });

  return (
    <section id="proyectos">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <span className="eyebrow">{t('projects.eyebrow')}</span>
          <h2>{t('projects.title')}</h2>
          <p>{t('projects.intro')}</p>
        </div>
        <div className="projects">
          {items.map((p, i) => (
            <a key={p.href} className="card" href={p.href} target="_blank" rel="noopener noreferrer" data-reveal>
              {/* Puerto donde termina la rama del pipeline */}
              <span className="port" data-sink aria-hidden="true" />
              <img src={p.image} alt={p.title} loading="lazy" />
              <div className="in">
                <span className="exp mono">output_{String(i + 1).padStart(2, '0')}{p.status && <span className="tag-new">{p.status}</span>}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="chips">{p.tech.map((tech) => <span key={tech} className="chip">{tech}</span>)}</div>
                <span className="go">{p.link}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
