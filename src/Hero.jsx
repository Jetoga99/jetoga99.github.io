import { useTranslation } from 'react-i18next';
import { Atom } from './Atom.jsx';
import { CONSTANTS, PROFILE } from './data.js';

export function Hero() {
  const { t } = useTranslation('global');
  const constants = t('hero.constants', { returnObjects: true });

  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <span className="state"><i />{t('hero.state')}</span>
          <div className="idrow">
            <div className="element" aria-hidden="true">
              <span className="z"><span>{PROFILE.element.z}</span><span>{PROFILE.element.since}</span></span>
              <b>{PROFILE.element.symbol}</b>
              <span className="nm">Jesús Torres</span>
              <span className="cf">{t('hero.tileRole')}</span>
            </div>
            <h1>{PROFILE.name}</h1>
          </div>
          <p className="lede">
            {t('hero.lede1')}<strong>{t('hero.ledeStrong')}</strong>{t('hero.lede2')}
          </p>
          <div className="cta">
            <a className="btn primary" href="#trayectoria">{t('hero.ctaPrimary')}</a>
            <a className="btn ghost" href="#contacto">{t('hero.ctaSecondary')}</a>
          </div>
          <div className="social">
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <span className="mono">{t('hero.location')}</span>
          </div>
        </div>

        <div className="atom">
          <Atom />
        </div>
      </div>

      <dl className="consts">
        {CONSTANTS.map((c, i) => (
          <div key={c.sym}>
            <dt><span className="sym">{c.sym}</span>{c.value}</dt>
            <dd>{constants[i]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
