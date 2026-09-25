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

// Constantes del hero; el texto de cada una está en hero.constants del JSON, en el mismo orden
export const CONSTANTS = [
  { sym: 'Z', value: ' = 99' },
  { sym: 't', value: '₀ = 2022' },
  { sym: 'N', value: ' = 9' },
  { sym: 'ħ', value: ' · UNAM' },
];

// Átomo del hero: tres órbitas como en el diseño original; '' = electrón sin nombre
export const ATOM_ORBITS = [
  { rot: -30, speed: 0.3, electrons: ['Scala', '', 'SQL', ''] },
  { rot: 30, speed: -0.24, electrons: ['Apache Spark', '', '', ''] },
  { rot: 90, speed: 0.2, electrons: ['Iceberg', '', 'Airflow', ''] },
];

// Tabla periódica del stack. year = año en que se usó por primera vez en un rol; live = uso diario hoy
export const FAMILY_HUES = { processing: 186, orchestration: 262, storage: 118, bi: 32 };

export const ELEMENTS = [
  { symbol: 'Sc', name: 'Scala', year: 2026, family: 'processing', live: true },
  { symbol: 'Sp', name: 'Apache Spark', year: 2026, family: 'processing', live: true },
  { symbol: 'Ib', name: 'Apache Iceberg', year: 2026, family: 'processing', live: true },
  { symbol: 'Sq', name: 'SQL', year: 2022, family: 'processing', live: true },
  { symbol: 'Py', name: 'Python', year: 2022, family: 'processing' },
  { symbol: 'R', name: 'R', year: 2022, family: 'processing' },
  { symbol: 'Af', name: 'Apache Airflow', year: 2026, family: 'orchestration', live: true },
  { symbol: 'Pf', name: 'Prefect', year: 2025, family: 'orchestration' },
  { symbol: 'Gc', name: 'Google Cloud', year: 2023, family: 'orchestration' },
  { symbol: 'Bq', name: 'BigQuery', year: 2023, family: 'orchestration' },
  { symbol: 'Is', name: 'SSIS', year: 2025, family: 'orchestration' },
  { symbol: 'As', name: 'SSAS', year: 2025, family: 'orchestration' },
  { symbol: 'Gt', name: 'Git', year: 2022, family: 'orchestration' },
  { symbol: 'Ms', name: 'SQL Server', year: 2025, family: 'storage' },
  { symbol: 'Pg', name: 'PostgreSQL', year: 2025, family: 'storage' },
  { symbol: 'My', name: 'MySQL', year: 2022, family: 'storage' },
  { symbol: 'Mg', name: 'MongoDB', year: 2023, family: 'storage' },
  { symbol: 'Pb', name: 'Power BI', year: 2023, family: 'bi' },
  { symbol: 'Ls', name: 'Looker Studio', year: 2023, family: 'bi' },
  { symbol: 'Ds', name: 'Dash', year: 2023, family: 'bi' },
  { symbol: 'Dj', name: 'Django', year: 2023, family: 'bi' },
  { symbol: 'Rc', name: 'React', year: 2023, family: 'bi' },
  { symbol: 'Jv', name: 'Java', year: 2022, family: 'bi' },
  { symbol: 'Js', name: 'JavaScript', year: 2022, family: 'bi' },
];

// Espectro de carrera: periodo real de cada rol como [año, mes]; end: null = presente.
// El id enlaza con experience.jobs[].id del JSON. row 1 = banda inferior (roles que se traslapan)
export const SPECTRUM_START = [2022, 8];

export const JOB_SPANS = {
  generation: { label: 'Generation', start: [2022, 8], end: [2022, 10] },
  fincomun: { label: 'Fincomún', start: [2022, 10], end: [2023, 8] },
  iimas: { label: 'IIMAS', start: [2023, 2], end: [2023, 10], row: 1 },
  sopris: { label: 'SOPRIS', start: [2023, 8], end: [2023, 11] },
  samsung: { label: 'Samsung', start: [2023, 11], end: [2025, 5] },
  mobo: { label: 'MOBO', start: [2025, 5], end: [2026, 1] },
  takeda: { label: 'Takeda', start: [2026, 1], end: null },
};
