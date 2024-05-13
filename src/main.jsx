import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.jsx'
import './styles.css'; // Asegúrate de tener los estilos CSS asociados

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
