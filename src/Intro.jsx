import React, { useState, useEffect } from 'react';

const ATOM_SVG = `
<svg viewBox="0 0 100 100" width="60vmin" height="60vmin" overflow="visible"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ig" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0FFFFF" />
      <stop offset="100%" stop-color="#00FFFF" />
    </linearGradient>
    <filter id="iglow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Órbita 1: diagonal (-30°) -->
  <!-- gaps en posiciones 83-89 y 198-204 (igual que fondo: dasharray 109 6 offset 26) -->
  <g transform="rotate(-30, 50, 50)">
    <ellipse cx="50" cy="50" rx="20" ry="50"
      stroke="#00FFFF" fill="none" stroke-width="1.5"
      stroke-dasharray="0 230" stroke-dashoffset="0">
      <!-- Segmento 1: pos 0→83 -->
      <animate attributeName="stroke-dasharray"
        values="0 230;83 147" dur="0.722s" begin="0s" fill="freeze"/>
      <!-- Gap 1 aparece al llegar la bolita a pos 83 -->
      <animate attributeName="stroke-dasharray"
        values="83 147;83 6 0 141" calcMode="discrete"
        dur="0.001s" begin="0.722s" fill="freeze"/>
      <!-- Segmento 2: pos 89→198 -->
      <animate attributeName="stroke-dasharray"
        values="83 6 0 141;83 6 109 32" dur="0.948s" begin="0.774s" fill="freeze"/>
      <!-- Gap 2 aparece al llegar a pos 198 -->
      <animate attributeName="stroke-dasharray"
        values="83 6 109 32;83 6 109 6 0 26" calcMode="discrete"
        dur="0.001s" begin="1.722s" fill="freeze"/>
      <!-- Segmento 3: pos 204→230 -->
      <animate attributeName="stroke-dasharray"
        values="83 6 109 6 0 26;83 6 109 6 26 0" dur="0.226s" begin="1.774s" fill="freeze"/>
    </ellipse>
    <circle cx="0" cy="0" r="3" fill="#00FFFF" filter="url(#iglow)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="0s" fill="freeze"/>
      <animateMotion path="M 70,50 A 20,50 0 0,1 30,50 A 20,50 0 0,1 70,50"
        dur="2.0s" begin="0s" repeatCount="indefinite"/>
    </circle>
    <circle cx="0" cy="0" r="3" fill="#00FFFF" filter="url(#iglow)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="0s" fill="freeze"/>
      <animateMotion path="M 70,50 A 20,50 0 0,1 30,50 A 20,50 0 0,1 70,50"
        dur="2.9s" begin="0s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Órbita 2: diagonal (30°) -->
  <g transform="rotate(30, 50, 50)">
    <ellipse cx="50" cy="50" rx="20" ry="50"
      stroke="#00FFFF" fill="none" stroke-width="1.5"
      stroke-dasharray="0 230" stroke-dashoffset="0">
      <animate attributeName="stroke-dasharray"
        values="0 230;83 147" dur="0.722s" begin="0.2s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 147;83 6 0 141" calcMode="discrete"
        dur="0.001s" begin="0.922s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 6 0 141;83 6 109 32" dur="0.948s" begin="0.974s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 6 109 32;83 6 109 6 0 26" calcMode="discrete"
        dur="0.001s" begin="1.922s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 6 109 6 0 26;83 6 109 6 26 0" dur="0.226s" begin="1.974s" fill="freeze"/>
    </ellipse>
    <circle cx="0" cy="0" r="3" fill="#00FFFF" filter="url(#iglow)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="0.2s" fill="freeze"/>
      <animateMotion path="M 70,50 A 20,50 0 0,1 30,50 A 20,50 0 0,1 70,50"
        dur="2.0s" begin="0.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="0" cy="0" r="3" fill="#00FFFF" filter="url(#iglow)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="0.2s" fill="freeze"/>
      <animateMotion path="M 70,50 A 20,50 0 0,1 30,50 A 20,50 0 0,1 70,50"
        dur="2.9s" begin="0.2s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Órbita 3: horizontal (90°) -->
  <g transform="rotate(90, 50, 50)">
    <ellipse cx="50" cy="50" rx="20" ry="50"
      stroke="#00FFFF" fill="none" stroke-width="1.5"
      stroke-dasharray="0 230" stroke-dashoffset="0">
      <animate attributeName="stroke-dasharray"
        values="0 230;83 147" dur="0.722s" begin="0.4s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 147;83 6 0 141" calcMode="discrete"
        dur="0.001s" begin="1.122s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 6 0 141;83 6 109 32" dur="0.948s" begin="1.174s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 6 109 32;83 6 109 6 0 26" calcMode="discrete"
        dur="0.001s" begin="2.122s" fill="freeze"/>
      <animate attributeName="stroke-dasharray"
        values="83 6 109 6 0 26;83 6 109 6 26 0" dur="0.226s" begin="2.174s" fill="freeze"/>
    </ellipse>
    <circle cx="0" cy="0" r="3" fill="#00FFFF" filter="url(#iglow)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="0.4s" fill="freeze"/>
      <animateMotion path="M 70,50 A 20,50 0 0,1 30,50 A 20,50 0 0,1 70,50"
        dur="2.0s" begin="0.4s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Núcleo: nace diminuto y crece (cuando completa la primera órbita) -->
  <circle cx="50" cy="50" r="0" fill="url(#ig)" filter="url(#iglow)" opacity="0">
    <animate attributeName="opacity"
      from="0" to="1" dur="0.15s" begin="2.0s" fill="freeze"/>
    <animate attributeName="r"
      values="0.3;12;10"
      keyTimes="0;0.65;1"
      calcMode="spline"
      keySplines="0.2 0 0.8 1 ; 0.4 0 0.6 1"
      dur="0.85s" begin="2.0s" fill="freeze"/>
  </circle>
</svg>
`;

export function Intro({ onComplete }) {
  const [phase, setPhase] = useState('forming'); // 'forming' | 'sliding'

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('intro-active');

    // Átomo completamente formado ~3.3s — empezar slide
    const t1 = setTimeout(() => {
      setPhase('sliding');
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-revealing');
    }, 3300);

    // Transición completada — montar el sitio
    const t2 = setTimeout(() => {
      document.body.style.overflow = '';
      document.body.classList.remove('intro-revealing');
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = '';
      document.body.classList.remove('intro-active');
      document.body.classList.remove('intro-revealing');
    };
  }, [onComplete]);

  return (
    <div className={`intro-overlay${phase === 'sliding' ? ' intro-sliding' : ''}`}>
      <div
        className="intro-svg-wrapper"
        dangerouslySetInnerHTML={{ __html: ATOM_SVG }}
      />
    </div>
  );
}
