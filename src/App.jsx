import React, { useState } from 'react';
import { Intro } from './Intro.jsx';
import {Header} from './Header.jsx';
import {Background} from './Background.jsx';
import {About} from './About.jsx';
import Navbar from './Navbar';
import Portfolio from './Portfolio.jsx';

export function App () {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}
      <Navbar/>
      <Background/>
      <Header/>
      <About />
      <Portfolio />
    </>
  );
};
