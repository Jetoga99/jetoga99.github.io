import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next';

import {App} from './App.jsx'
import './styles.css'; // Asegúrate de tener los estilos CSS asociados
import global_en from './translations/en/global.json';
import global_es from './translations/es/global.json';
import i18next from 'i18next';

i18next.init({
  interpolation:{escapeValue:false},
  lng:'es',
  resources:{
    en:{global:global_en},
    es:{global:global_es}
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
)
