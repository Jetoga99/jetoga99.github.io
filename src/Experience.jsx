import { useTranslation } from 'react-i18next';
import { JOB_SPANS, SPECTRUM_START } from './data.js';

// Escala del espectro en unidades del viewBox (0–1000)
const X0 = 20;
const X1 = 980;
const HUE_FROM = 8; // rojo: roles más antiguos
const HUE_RANGE = 192; // hasta cian: rol actual

const monthIndex = ([year, month]) => (year - SPECTRUM_START[0]) * 12 + (month - SPECTRUM_START[1]);

function buildSpectrum() {
  const now = new Date();
  const total = monthIndex([now.getFullYear(), now.getMonth() + 1]) + 1;
  const sx = (m) => X0 + (m * (X1 - X0)) / total;
  const hueAt = (x) => Math.round(HUE_FROM + ((x - X0) / (X1 - X0)) * HUE_RANGE);

  const bands = {};
  Object.entries(JOB_SPANS).forEach(([id, span]) => {
    const x = sx(monthIndex(span.start));
    const end = span.end ? sx(monthIndex(span.end)) : X1;
    bands[id] = { ...span, x, w: end - x, hue: hueAt(x + (end - x) / 2) };
  });

  const years = [];
  for (let y = SPECTRUM_START[0] + 1; y <= now.getFullYear(); y++) {
    const x = sx(monthIndex([y, 1]));
    if (x - X0 > 40 && X1 - x > 40) years.push({ label: String(y), x });
  }
  return { bands, years };
}

const spectrumColor = (hue) => `hsl(${hue} var(--spec-s) var(--spec-l))`;

export function Experience() {
  const { t } = useTranslation('global');
  const jobs = t('experience.jobs', { returnObjects: true });
  const { bands, years } = buildSpectrum();
  const ticks = [
    { label: t('experience.axisStart'), x: X0, anchor: 'start' },
    ...years.map((y) => ({ ...y, anchor: 'middle' })),
    { label: t('experience.axisNow'), x: X1, anchor: 'end' },
  ];

  return (
    <section id="trayectoria">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">{t('experience.eyebrow')}</span>
          <h2>{t('experience.title')}</h2>
          <p>{t('experience.intro')}</p>
        </div>

        <figure className="spectrum">
          <div className="scroll">
            <svg viewBox="0 0 1000 156" role="img" aria-label={t('experience.ariaLabel')}>
              <defs>
                <linearGradient id="spectrum-continuum" x1="0" x2="1">
                  {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                    <stop key={p} offset={p} style={{ stopColor: spectrumColor(HUE_FROM + p * HUE_RANGE) }} />
                  ))}
                </linearGradient>
              </defs>
              <rect x={X0} y="34" width={X1 - X0} height="34" rx="2" fill="url(#spectrum-continuum)" style={{ opacity: 'var(--spec-dim)' }} />
              {Object.entries(bands).map(([id, b]) => {
                const y = b.row ? 76 : 34;
                const h = b.row ? 20 : 34;
                const cx = b.x + b.w / 2;
                return (
                  <g key={id}>
                    <rect x={b.x + 1} y={y} width={Math.max(b.w - 2, 1)} height={h} rx="2" style={{ fill: spectrumColor(b.hue) }} />
                    <rect x={cx - 1} y={y} width="2" height={h} fill="#ffffff" opacity="0.55" />
                    <text className="co" x={cx} y={b.row ? 112 : 24} textAnchor="middle">{b.label}</text>
                  </g>
                );
              })}
              <line x1={X0} x2={X1} y1="126" y2="126" className="axis" />
              {ticks.map((tick) => (
                <g key={tick.label}>
                  <line x1={tick.x} x2={tick.x} y1="122" y2="130" className="tick" />
                  <text x={tick.x} y="146" textAnchor={tick.anchor}>{tick.label}</text>
                </g>
              ))}
            </svg>
          </div>
          <figcaption><b>Fig. 1.</b> {t('experience.figure')}</figcaption>
        </figure>

        <div className="timeline">
          {jobs.map((job) => (
            <article key={job.id} className="job" style={{ '--h': bands[job.id]?.hue ?? 186 }}>
              <div className="when"><b>{job.start}</b>{job.end}</div>
              <span className="dot" />
              <div className="body">
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
