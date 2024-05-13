import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Header} from './Header.jsx';
import {Background} from './Background.jsx'; // Importa el componente de fondo
import {About} from './About.jsx';
import Navbar from './Navbar';
import Portfolio from './Portfolio.jsx';
import './styles.css'; // Asegúrate de tener los estilos CSS asociados
 
export function App () {
  return (
    <Router>
      <Navbar/>

      <Background/>

      <Header/>

      <About />
      
      <Portfolio />

    </Router>
  );
};
