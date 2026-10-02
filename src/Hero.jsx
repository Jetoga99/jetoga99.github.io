import { useTranslation } from 'react-i18next';
import { PROFILE } from './data.js';
import { Icon } from './Icon.jsx';

export function Hero() {
  const { t } = useTranslation('global');

  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <span className="state"><i />{t('hero.state')}</span>
          <h1>{PROFILE.name}</h1>
          <h2>{t('hero.role1')}<span>{t('hero.role2')}</span></h2>
          <p className="lede">
            {t('hero.lede1')}<strong>{t('hero.ledeStrong')}</strong>{t('hero.lede2')}
          </p>
          <div className="cta">
            <a className="btn primary" href="#trayectoria">{t('hero.ctaPrimary')}</a>
            <a className="btn ghost" href="#contacto">{t('hero.ctaSecondary')}</a>
          </div>
          <div className="social-links">
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" /></a>
            <a href={`mailto:${PROFILE.email}`} aria-label="Email"><Icon name="mail" /></a>
            <span className="mono">{t('hero.location')}</span>
          </div>
        </div>
        {/* El átomo lo dibuja Pipeline.jsx sobre este hueco */}
        <div className="atom-slot" data-atom aria-hidden="true" />
      </div>
      <a className="scroll-hint mono" href="#trayectoria">{t('hero.scroll')}<span aria-hidden="true">↓</span></a>
    </header>
  );
}
