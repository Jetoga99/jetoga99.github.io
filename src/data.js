// Datos que no dependen del idioma. Los textos traducibles viven en src/translations/[lang]/global.json

export const PROFILE = {
  name: 'Jesús Torres García',
  email: 'jetoga99@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jtorresgarcia/',
  github: 'https://github.com/jetoga99',
  // Ficha de elemento: Z = 99 por jetoga99 (también el número atómico del einstenio)
  element: { z: 99, symbol: 'Jt', since: 2026 },
};

// Formulario de contacto: desactivado por ahora (se muestra solo el correo). Cambiar a true para mostrarlo
export const CONTACT_FORM_ENABLED = false;

// Servicio que reenvía el formulario de contacto al correo (GitHub Pages no tiene backend).
// Se puede cambiar con la variable VITE_CONTACT_ENDPOINT en un archivo .env.local
export const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || `https://formsubmit.co/ajax/${PROFILE.email}`;

// Periodo real de cada rol como [año, mes]; end: null = presente. Define el tono de su etapa en el pipeline.
// El id enlaza con experience.jobs[].id del JSON. icon = estación que dibuja Pipeline.jsx; op = nombre del paso
export const SPECTRUM_START = [2022, 8];

export const JOB_SPANS = {
  generation: { label: 'Generation', start: [2022, 8], end: [2022, 10], icon: 'code', op: 'build()' },
  fincomun: { label: 'Fincomún', start: [2022, 10], end: [2023, 8], icon: 'brain', op: 'model()' },
  iimas: { label: 'IIMAS', start: [2023, 2], end: [2023, 10], icon: 'database', op: 'store()' },
  sopris: { label: 'SOPRIS', start: [2023, 8], end: [2023, 11], icon: 'chart', op: 'visualize()' },
  samsung: { label: 'Samsung', start: [2023, 11], end: [2025, 5], icon: 'funnel', op: 'ingest()' },
  mobo: { label: 'MOBO', start: [2025, 5], end: [2026, 1], icon: 'gears', op: 'transform()' },
  takeda: { label: 'Takeda', start: [2026, 1], end: null, icon: 'factory', op: 'process()' },
};
