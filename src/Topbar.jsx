import { useTranslation } from 'react-i18next';

const LANGS = ['es', 'en'];

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch { /* almacenamiento bloqueado */ }
}

export function Topbar() {
  const { t, i18n } = useTranslation('global');

  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href="#inicio">
          <span className="mini" aria-hidden="true">Jt</span>jetoga.dev
        </a>
        <nav className="nav" aria-label={t('nav.sections')}>
          <a href="#stack">{t('nav.stack')}</a>
          <a href="#trayectoria">{t('nav.experience')}</a>
          <a href="#formacion">{t('nav.education')}</a>
          <a href="#proyectos">{t('nav.projects')}</a>
          <a href="#contacto">{t('nav.contact')}</a>
        </nav>
        <div className="controls">
          <div className="lang" role="group" aria-label={t('nav.language')}>
            {LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                aria-pressed={i18n.resolvedLanguage === lang}
                onClick={() => i18n.changeLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="iconbtn" type="button" onClick={toggleTheme} aria-label={t('nav.theme')} title={t('nav.theme')}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
