import { useTranslation } from 'react-i18next';
import { JOB_SPANS, SPECTRUM_START } from './data.js';

const HUE_FROM = 8; // rojo: roles más antiguos
const HUE_RANGE = 172; // hasta cian: rol actual

const monthIndex = ([year, month]) => (year - SPECTRUM_START[0]) * 12 + (month - SPECTRUM_START[1]);

// Tono de cada etapa según el punto medio del rol en el tiempo; Pipeline.jsx lo lee de data-stage
function jobHues() {
  const now = new Date();
  const total = monthIndex([now.getFullYear(), now.getMonth() + 1]) + 1;
  const hues = {};
  Object.entries(JOB_SPANS).forEach(([id, span]) => {
    const start = monthIndex(span.start);
    const end = span.end ? monthIndex(span.end) : total;
    hues[id] = Math.round(HUE_FROM + ((start + end) / 2 / total) * HUE_RANGE);
  });
  return hues;
}

export function Experience() {
  const { t } = useTranslation('global');
  const jobs = t('experience.jobs', { returnObjects: true });
  const hues = jobHues();

  return (
    <section id="trayectoria">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <span className="eyebrow">{t('experience.eyebrow')}</span>
          <h2>{t('experience.title')}</h2>
          <p>{t('experience.intro')}</p>
        </div>

        <ol className="timeline">
          {jobs.map((job, i) => {
            const hue = hues[job.id] ?? 180;
            return (
              <li key={job.id} className="job" style={{ '--h': hue }}>
                <span className="node" data-stage={hue} data-icon={JOB_SPANS[job.id]?.icon} />
                <article className="panel" data-reveal>
                  <div className="job-head">
                    <span className="stage mono">stage_{String(jobs.length - i).padStart(2, '0')} · {JOB_SPANS[job.id]?.op}</span>
                    <span className="when mono">{job.start} → {job.end}</span>
                  </div>
                  <h3>{job.title}</h3>
                  <p className="org">
                    <strong>{job.company}</strong>{job.org && <> · {job.org}</>}
                  </p>
                  {job.roles && (
                    <div className="sub">
                      {job.roles.map((role) => (
                        <div key={role.title}><strong>{role.title}</strong><span className="mono">{role.when}</span></div>
                      ))}
                    </div>
                  )}
                  {job.bullets.length > 0 && (
                    <ul>{job.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                  )}
                  <div className="chips">{job.tech.map((tech) => <span key={tech} className="chip">{tech}</span>)}</div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
