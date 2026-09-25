import { useEffect, useRef } from 'react';
import { ATOM_ORBITS } from './data.js';

const TRAIL = 6;

// Núcleo: protones (p) y neutrones (n) en coordenadas relativas al radio de un nucleón.
// Se dibujan en orden: primero la capa de atrás, al final la de enfrente
const NUCLEONS = [
  [-1.7, 0, 'n'], [1.7, 0, 'p'], [-0.85, -1.47, 'p'], [0.85, -1.47, 'n'], [-0.85, 1.47, 'n'], [0.85, 1.47, 'p'],
  [0, 0, 'p'], [-0.85, -0.5, 'n'], [0.85, -0.5, 'p'], [0, 1, 'n'],
];

// Modelo atómico del hero: núcleo de protones y neutrones, tres órbitas elípticas y electrones con estela
export function Atom() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const root = document.documentElement;
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
    let size = 0;
    let colors = {};
    let raf = 0;
    let visible = true;

    const orbits = ATOM_ORBITS.map((o, k) => ({
      ...o,
      rad: (o.rot * Math.PI) / 180,
      electrons: o.electrons.map((label, i) => ({ label, phase: k * 0.9 + (i * Math.PI) / 2 })),
    }));

    const readColors = () => {
      const cs = getComputedStyle(root);
      colors = {
        orbit: cs.getPropertyValue('--orbit').trim(),
        electron: cs.getPropertyValue('--electron').trim(),
        text: cs.getPropertyValue('--text').trim(),
        muted: cs.getPropertyValue('--muted').trim(),
        glow: cs.getPropertyValue('--glow').trim(),
        bg: cs.getPropertyValue('--bg').trim(),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawNucleus = (c) => {
      const nr = size * 0.024;
      const halo = ctx.createRadialGradient(c, c, 0, c, c, size * 0.15);
      halo.addColorStop(0, colors.glow);
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(c, c, size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      NUCLEONS.forEach(([dx, dy, kind]) => {
        const x = c + dx * nr;
        const y = c + dy * nr;
        ctx.save();
        ctx.fillStyle = kind === 'p' ? colors.electron : colors.muted;
        ctx.shadowColor = colors.electron;
        ctx.shadowBlur = kind === 'p' ? 10 : 0;
        ctx.beginPath();
        ctx.arc(x, y, nr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Contorno con el color de fondo para separar las esferas y un brillo para dar volumen
        ctx.strokeStyle = colors.bg;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(x - nr * 0.35, y - nr * 0.35, nr * 0.32, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const draw = (t) => {
      if (!size) return;
      const animated = !reduceMq.matches;
      const c = size / 2;
      const rx = size * 0.17;
      const ry = size * 0.4;
      const fs = Math.max(11, Math.round(size * 0.028));
      const r0 = Math.max(3.5, size * 0.011);
      const labels = [];
      ctx.clearRect(0, 0, size, size);

      orbits.forEach((o) => {
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(o.rad);
        ctx.strokeStyle = colors.orbit;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      drawNucleus(c);

      orbits.forEach((o) => {
        const cr = Math.cos(o.rad);
        const sr = Math.sin(o.rad);
        const pos = (a) => {
          const lx = rx * Math.cos(a);
          const ly = ry * Math.sin(a);
          return [c + lx * cr - ly * sr, c + lx * sr + ly * cr];
        };

        o.electrons.forEach((e) => {
          const a = e.phase + t * o.speed;
          const named = Boolean(e.label);
          const r = named ? r0 : r0 * 0.7;

          if (animated) {
            const dir = o.speed > 0 ? -1 : 1;
            ctx.fillStyle = colors.electron;
            for (let k = 1; k <= TRAIL; k++) {
              const [qx, qy] = pos(a + dir * k * 0.045);
              ctx.globalAlpha = (named ? 0.45 : 0.3) * (1 - k / (TRAIL + 1));
              ctx.beginPath();
              ctx.arc(qx, qy, r * (1 - k / 9), 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          }

          const [x, y] = pos(a);
          ctx.save();
          ctx.globalAlpha = named ? 1 : 0.8;
          ctx.fillStyle = colors.electron;
          ctx.shadowColor = colors.electron;
          ctx.shadowBlur = named ? 16 : 10;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          if (named) labels.push({ x, y, label: e.label });
        });
      });

      ctx.font = `500 ${fs}px "IBM Plex Mono", Consolas, monospace`;
      labels.forEach((l) => {
        const dx = l.x - c;
        const dy = l.y - c;
        const d = Math.hypot(dx, dy) || 1;
        const w = ctx.measureText(l.label).width;
        const tx = l.x + (dx / d) * 14;
        let left = dx >= 0 ? tx : tx - w;
        left = Math.min(Math.max(left, 2), size - w - 2);
        const ty = Math.min(Math.max(l.y + (dy / d) * 14, fs), size - 4);
        ctx.fillStyle = colors.bg;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(left - 4, ty - fs + 1, w + 8, fs + 5);
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.text;
        ctx.fillText(l.label, left, ty + 1);
      });
    };

    const frame = (ms) => {
      draw(ms / 1000);
      raf = requestAnimationFrame(frame);
    };

    // Anima solo si está en pantalla y el usuario no pidió reducir movimiento
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMq.matches) draw(0);
      else if (visible) raf = requestAnimationFrame(frame);
    };
    const redrawStatic = () => { if (reduceMq.matches) draw(0); };
    const onTheme = () => { readColors(); redrawStatic(); };

    readColors();
    resize();
    start();

    const resizeObs = new ResizeObserver(() => { resize(); redrawStatic(); });
    resizeObs.observe(canvas);
    const themeObs = new MutationObserver(onTheme);
    themeObs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    const viewObs = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    viewObs.observe(canvas);
    darkMq.addEventListener('change', onTheme);
    reduceMq.addEventListener('change', start);
    document.fonts?.ready.then(redrawStatic);

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
      themeObs.disconnect();
      viewObs.disconnect();
      darkMq.removeEventListener('change', onTheme);
      reduceMq.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
