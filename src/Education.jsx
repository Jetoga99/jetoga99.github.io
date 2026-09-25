import { useTranslation } from 'react-i18next';

export function Education() {
  const { t } = useTranslation('global');
  const degrees = t('education.degrees', { returnObjects: true });
  const certs = t('education.certs', { returnObjects: true });

  return (
    <section id="formacion">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">{t('education.eyebrow')}</span>
          <h2>{t('education.title')}</h2>
        </div>
        <div className="two">
          <div>
            <h3 className="subhead">{t('education.degreesTitle')}</h3>
            <div className="list">
              {degrees.map((d) => (
                <div key={d.title} className="row">
                  <h4>{d.title}</h4>
                  <span className="mono">{d.years}</span>
                  <p>{d.place}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="subhead">{t('education.certsTitle')}</h3>
            <div className="list">
              {certs.map((c) => (
                <div key={c.title} className="row">
                  <h4>{c.title}{c.isNew && <span className="tag-new">{t('education.new')}</span>}</h4>
                  {c.year && <span className="mono">{c.year}</span>}
                  {c.issuer && <p>{c.issuer}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
