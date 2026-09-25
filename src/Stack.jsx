import { useTranslation } from 'react-i18next';
import { ELEMENTS, FAMILY_HUES } from './data.js';

export function Stack() {
  const { t } = useTranslation('global');

  return (
    <section id="stack">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">{t('stack.eyebrow')}</span>
          <h2>{t('stack.title')}</h2>
          <p>{t('stack.intro')}</p>
        </div>
        <div className="ptable">
          {ELEMENTS.map((el) => (
            <div key={el.symbol} className={el.live ? 'el live' : 'el'} style={{ '--h': FAMILY_HUES[el.family] }}>
              <span className="n">{el.year}</span>
              <b>{el.symbol}</b>
              <span>{el.name}</span>
            </div>
          ))}
        </div>
        <div className="legend">
          {Object.entries(FAMILY_HUES).map(([family, hue]) => (
            <span key={family} style={{ '--h': hue }}><i />{t(`stack.families.${family}`)}</span>
          ))}
          <span className="key mono">{t('stack.liveKey')}</span>
        </div>
      </div>
    </section>
  );
}
