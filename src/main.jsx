import React from 'react';
import ReactDOM from 'react-dom/client';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { App } from './App.jsx';
import './styles.css';
import global_en from './translations/en/global.json';
import global_es from './translations/es/global.json';

const LANG_KEY = 'lang';

function savedLanguage() {
  try {
    return localStorage.getItem(LANG_KEY) || 'es';
  } catch {
    return 'es';
  }
}

i18next.init({
  interpolation: { escapeValue: false },
  lng: savedLanguage(),
  fallbackLng: 'es',
  supportedLngs: ['es', 'en'],
  resources: {
    en: { global: global_en },
    es: { global: global_es },
  },
});

// Mantiene <html lang> y la preferencia guardada al cambiar de idioma
const syncLanguage = (lng) => {
  document.documentElement.lang = lng;
  try { localStorage.setItem(LANG_KEY, lng); } catch { /* almacenamiento bloqueado */ }
};
syncLanguage(i18next.resolvedLanguage);
i18next.on('languageChanged', syncLanguage);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
);
