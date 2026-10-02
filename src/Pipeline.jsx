import { useEffect, useRef } from 'react';
import { drawStation, gear, packet } from './stations.js';

// Átomo original (SVG de 100×100): tres órbitas rx=20, ry=50 rotadas -30°, 30° y 90°, núcleo r=10.
// Al hacer scroll cada órbita se parte en dos mitades que salen disparadas como rayos rectos
// (arriba, abajo y a los lados), se curvan de regreso y se juntan debajo en un nodo de unión.
// De ahí nace el pipeline: serpentea entre los roles de la trayectoria y se ramifica a los proyectos.
const ORBITS = [
  { rot: -30, period: 3, electrons: [0, 0.5] },
  { rot: 30, period: -6, electrons: [0, 0.5] },
  { rot: 90, period: 3, electrons: [0.33, 0.83] },
];
const HALF_SAMPLES = 60;
const LANE_GAP = 9; // separación entre los 3 carriles paralelos
const FLOW_SPEED = 1500; // px/s con los que el pipeline se va llenando
const PACKET_SPACING = 140;
const PACKET_SPEED = 110; // px/s
const INTRO = { ring: 2, stagger: 0.2, core: 2, coreDur: 0.85 };

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (v) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;

function bezier(p0, p1, p2, p3, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    pts.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]);
  }
  return pts;
}

// Ruta ortogonal por esquinas dadas: tramos rectos muestreados cada `step` px y giros de 90°
// con una esquina apenas redondeada (radio suficiente para que los carriles paralelos no se doblen)
const CORNER = 18;
function orthoPath(corners, step = 6) {
  const pts = [corners[0]];
  const line = (a, b) => {
    const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let i = 1; i <= n; i++) pts.push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)]);
  };
  let from = corners[0];
  for (let i = 1; i < corners.length - 1; i++) {
    const [p, c, q] = [corners[i - 1], corners[i], corners[i + 1]];
    const lin = Math.hypot(c[0] - p[0], c[1] - p[1]) || 1, lout = Math.hypot(q[0] - c[0], q[1] - c[1]) || 1;
    const r = Math.min(CORNER, lin / 2, lout / 2);
    const enter = [c[0] - ((c[0] - p[0]) / lin) * r, c[1] - ((c[1] - p[1]) / lin) * r];
    const exit = [c[0] + ((q[0] - c[0]) / lout) * r, c[1] + ((q[1] - c[1]) / lout) * r];
    line(from, enter);
    pts.push(...bezier(enter, c, c, exit, 8).slice(1));
    from = exit;
  }
  line(from, corners[corners.length - 1]);
  return pts;
}

// Polilínea con longitudes acumuladas para ubicar puntos por distancia recorrida
function withLengths(pts) {
  const len = [0];
  for (let i = 1; i < pts.length; i++) {
    len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, len, total: len[len.length - 1] };
}

function indexAt(path, s) {
  const { len } = path;
  let lo = 0, hi = len.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (len[mid] <= s) lo = mid; else hi = mid;
  }
  return [lo, hi, (s - len[lo]) / (len[hi] - len[lo] || 1)];
}

function pointAt(path, s) {
  const [lo, hi, t] = indexAt(path, s);
  return [lerp(path.pts[lo][0], path.pts[hi][0], t), lerp(path.pts[lo][1], path.pts[hi][1], t)];
}

// Distancia recorrida hasta la coordenada y (estas rutas solo bajan)
function lengthAtY(path, y) {
  const { pts, len } = path;
  if (y <= pts[0][1]) return 0;
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][1] >= y) {
      const t = (y - pts[i - 1][1]) / (pts[i][1] - pts[i - 1][1] || 1);
      return lerp(len[i - 1], len[i], t);
    }
  }
  return path.total;
}

function strokePoly(ctx, pts, from = 0, to = pts.length - 1) {
  if (to - from < 1) return;
  ctx.beginPath();
  ctx.moveTo(pts[from][0], pts[from][1]);
  for (let i = from + 1; i <= to; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

// Recorta una ruta a sus primeros s px
function slicePath(path, s) {
  if (s >= path.total) return path.pts;
  const out = [];
  for (let i = 0; i < path.pts.length && path.len[i] < s; i++) out.push(path.pts[i]);
  out.push(pointAt(path, s));
  return out;
}

// Mitad j (0 o 1) de una órbita: de un extremo interior, pasando por la punta, al otro extremo
function halfRing(o, j, atom) {
  const phi = (o.rot * Math.PI) / 180;
  const rx = 20 * atom.k, ry = 50 * atom.k;
  const pts = [];
  for (let i = 0; i <= HALF_SAMPLES; i++) {
    const th = (j + i / HALF_SAMPLES) * Math.PI;
    const lx = rx * Math.cos(th), ly = ry * Math.sin(th);
    pts.push([atom.x + lx * Math.cos(phi) - ly * Math.sin(phi), atom.y + lx * Math.sin(phi) + ly * Math.cos(phi)]);
  }
  return pts;
}

function measure() {
  const sy = window.scrollY;
  const rect = (el) => el.getBoundingClientRect();
  const atomEl = document.querySelector('[data-atom]');
  if (!atomEl) return null;
  const a = rect(atomEl);
  const atom = { x: a.left + a.width / 2, y: a.top + a.height / 2 + sy, k: a.width / 100 };

  const stages = [...document.querySelectorAll('[data-stage]')].map((el) => {
    const r = rect(el);
    const row = rect(el.closest('.job') || el);
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 + sy, hue: Number(el.dataset.stage), icon: el.dataset.icon, top: row.top + sy, bottom: row.bottom + sy };
  });
  const sinks = [...document.querySelectorAll('[data-sink]')].map((el) => {
    const r = rect(el);
    return { x: r.left + r.width / 2, y: r.top + sy };
  });
  const head = document.querySelector('#trayectoria .sec-head');
  if (!stages.length || !head) return { atom, halves: [], stages: [], sinks: [], branches: [] };

  // Nodo de unión: en la columna del primer rol, a la altura del título de la sección
  const merge = [stages[0].x, rect(head).top + sy + 10];

  // Seis rayos: la dirección de cada uno es la de la punta de su mitad de órbita
  const rayLen = 46 * atom.k;
  const r0 = 13 * atom.k;
  const halves = [];
  ORBITS.forEach((o, i) => {
    [0, 1].forEach((j) => {
      const ring = halfRing(o, j, atom);
      const tip = ring[HALF_SAMPLES / 2];
      const d = Math.hypot(tip[0] - atom.x, tip[1] - atom.y) || 1;
      const dir = [(tip[0] - atom.x) / d, (tip[1] - atom.y) / d];
      const ray = ring.map((_, k) => {
        const r = r0 + (k / HALF_SAMPLES) * rayLen;
        return [atom.x + dir[0] * r, atom.y + dir[1] * r];
      });
      const end = ray[HALF_SAMPLES];
      const curve = bezier(end, [end[0] + dir[0] * 150, end[1] + dir[1] * 150], [merge[0], merge[1] - 260], merge, 90).slice(1);
      halves.push({ orbit: i, ring, ray, route: withLengths([...ray, ...curve]), rayLen: withLengths(ray).total });
    });
  });

  // Eje del pipeline: unión → cada rol (alternan izquierda/derecha) → salida hacia los proyectos.
  // Solo tramos verticales y horizontales: baja recto por la columna libre de cada rol y cambia
  // de lado con giros de 90° a la mitad del hueco entre roles
  const last = stages[stages.length - 1];
  const out = [stages[0].x, last.bottom + 120];
  const corners = [merge];
  const mids = [];
  stages.forEach((st, i) => {
    if (!i) return;
    const prev = stages[i - 1];
    const midY = (prev.bottom + st.top) / 2;
    if (prev.x !== st.x) corners.push([prev.x, midY], [st.x, midY]);
    mids.push([(prev.x + st.x) / 2, midY]); // engrane chico en cada cruce
  });
  if (last.x !== out[0]) corners.push([last.x, last.bottom + 60], [out[0], last.bottom + 60]);
  corners.push(out);
  const spine = withLengths(orthoPath(corners));
  spine.nrm = spine.pts.map((p, i, pts) => {
    const q = pts[Math.min(i + 1, pts.length - 1)], r = pts[Math.max(i - 1, 0)];
    const tx = q[0] - r[0], ty = q[1] - r[1];
    const tl = Math.hypot(tx, ty) || 1;
    return [-ty / tl, tx / tl];
  });
  // Distancia sobre el eje en la que el flujo llega a cada estación y a cada engrane
  stages.forEach((st) => { st.at = lengthAtY(spine, st.y); });
  const midsAt = mids.map(([x, y]) => {
    let best = 0, d = Infinity;
    spine.pts.forEach((p, i) => { const e = Math.hypot(p[0] - x, p[1] - y); if (e < d) { d = e; best = spine.len[i]; } });
    return best;
  });

  // Ramas: cada carril continúa como su propia rama hacia una tarjeta, sin cortes.
  // Se asignan en orden de izquierda a derecha (carril izquierdo → tarjeta más a la izquierda) y la rama
  // que va más lejos gira más arriba, así las tres quedan anidadas sin cruzarse
  const kLast = spine.pts.length - 1;
  const laneEnds = [0, 1, 2].map((i) => [
    spine.pts[kLast][0] + spine.nrm[kLast][0] * (i - 1) * LANE_GAP,
    spine.pts[kLast][1] + spine.nrm[kLast][1] * (i - 1) * LANE_GAP,
  ]);
  const lanesByX = [0, 1, 2].sort((p, q) => laneEnds[p][0] - laneEnds[q][0]);
  const sinksByX = sinks.map((_, k) => k).sort((p, q) => sinks[p].x - sinks[q].x);
  const reachOrder = sinks.map((sk) => Math.abs(sk.x - out[0])).sort((p, q) => p - q);
  const branches = sinks.map((sink, k) => {
    const lane = lanesByX[sinksByX.indexOf(k) % 3];
    const start = laneEnds[lane];
    const rank = reachOrder.indexOf(Math.abs(sink.x - out[0]));
    const turn = Math.max(start[1] + 20, sink.y - 40 - rank * 24);
    const path = withLengths(orthoPath([start, [start[0], turn], [sink.x, turn], [sink.x, sink.y]]));
    path.lane = lane;
    return path;
  });

  return { atom, merge, halves, spine, stages, sinks, branches, out, mids, midsAt };
}

export function Pipeline() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const root = document.documentElement;
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
    let w = 0, h = 0, raf = 0, colors = {}, geo = null;
    let built = 0; // y (documento) hasta donde ya se construyó el pipeline
    let flow = 0, branchFlow = 0, prev = 0; // longitud ya llenada del eje y de las ramas
    const t0 = performance.now();

    const readColors = () => {
      const cs = getComputedStyle(root);
      const v = (n) => cs.getPropertyValue(n).trim();
      colors = { pipe: v('--pipe'), glow: v('--pipe-glow'), core: v('--pipe-core'), bg: v('--bg'), sat: v('--stage-s'), lit: v('--stage-l') };
    };
    const hsl = (hue, a = 1) => `hsl(${hue} ${colors.sat} ${colors.lit} / ${a})`;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geo = measure();
    };

    const glowStroke = (pts, width, color, from, to) => {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = width * 3.5;
      strokePoly(ctx, pts, from, to);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      strokePoly(ctx, pts, from, to);
    };

    const dot = (x, y, r, color, halo = 3) => {
      ctx.fillStyle = colors.glow;
      ctx.beginPath();
      ctx.arc(x, y, r * halo, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const ringNode = (x, y, r, color) => {
      ctx.fillStyle = colors.bg;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    // Último rol que cruzó un paquete (define su color y su forma); antes del primero y hacia los proyectos, ninguno
    const stageAtY = (y) => {
      let at = -1;
      if (y > geo.out[1]) return at;
      geo.stages.forEach((s, i) => { if (s.y <= y) at = i; });
      return at;
    };

    // Punto del carril i en el índice k del eje: desplazado sobre la normal, paralelo al eje
    const lanePoint = (i, k) => {
      const { pts, nrm } = geo.spine;
      const off = (i - 1) * LANE_GAP;
      return [pts[k][0] + nrm[k][0] * off, pts[k][1] + nrm[k][1] * off];
    };

    const lanePointAt = (i, sLen) => {
      const [lo, hi, t] = indexAt(geo.spine, sLen);
      const a = lanePoint(i, lo), b = lanePoint(i, hi);
      return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
    };

    const draw = (now) => {
      if (!geo) return;
      const still = reduceMq.matches;
      const time = still ? 0 : (now - t0) / 1000;
      const intro = still ? 99 : time;
      const sy = window.scrollY;
      const { atom } = geo;
      const lw = Math.max(1.5, atom.k * 0.8);
      built = Math.max(built, sy + h * 0.82);
      const dt = clamp((now - prev) / 1000, 0, 0.1);
      prev = now;

      // Avance del desarme: 0 con el átomo completo; los rayos se enderezan y luego viajan a la unión
      const span = Math.max(380, (geo.merge?.[1] ?? h) - atom.y - h * 0.25);
      const m = clamp((sy - 20) / span);

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(0, -sy);

      // Rayos: mitad de órbita → recta → curva de regreso hasta la unión
      let joined = 1;
      geo.halves.forEach((hf, n) => {
        const st = smooth(m * 2.6 - n * 0.09); // enderezado
        const ext = smooth((m - 0.42 - n * 0.03) / 0.45); // recorrido hasta la unión
        joined = Math.min(joined, ext);
        const last = Math.round(clamp((intro - hf.orbit * INTRO.stagger) / INTRO.ring) * HALF_SAMPLES);

        if (st < 1) {
          const pts = hf.ring.map((p, k) => {
            const f = k / HALF_SAMPLES;
            const sk = smooth(st * 1.5 - (1 - f) * 0.5); // la punta se estira primero
            return [lerp(p[0], hf.ray[k][0], sk), lerp(p[1], hf.ray[k][1], sk)];
          });
          glowStroke(pts, lerp(lw, 1.6, st), colors.pipe, 0, last);
        } else {
          const reach = hf.rayLen + ext * (hf.route.total - hf.rayLen);
          glowStroke(slicePath(hf.route, reach), 1.6, colors.pipe);
          if (!still) {
            for (let s = (time * PACKET_SPEED + n * 31) % PACKET_SPACING; s < reach; s += PACKET_SPACING) {
              const [x, y] = pointAt(hf.route, s);
              dot(x, y, 2.4, colors.pipe);
            }
          }
        }
      });

      // Electrones: recorren las órbitas y se sueltan al partirse el átomo
      ORBITS.forEach((o, i) => {
        if (intro < i * INTRO.stagger) return;
        o.electrons.forEach((ph) => {
          const u = (((ph + (still ? 0 : time / o.period)) % 1) + 1) % 1;
          const j = u < 0.5 ? 0 : 1;
          const hf = geo.halves[i * 2 + j];
          if (!hf) return;
          const st = smooth(m * 2.6 - (i * 2 + j) * 0.09);
          if (st >= 1) return;
          const idx = (u * 2 - j) * HALF_SAMPLES;
          const k = Math.min(Math.floor(idx), HALF_SAMPLES - 1);
          const t = idx - k;
          const p = [lerp(hf.ring[k][0], hf.ring[k + 1][0], t), lerp(hf.ring[k][1], hf.ring[k + 1][1], t)];
          const q = [lerp(hf.ray[k][0], hf.ray[k + 1][0], t), lerp(hf.ray[k][1], hf.ray[k + 1][1], t)];
          ctx.globalAlpha = 1 - st;
          dot(lerp(p[0], q[0], st), lerp(p[1], q[1], st), Math.max(2.5, 2.2 * atom.k), colors.pipe, 2.2);
          ctx.globalAlpha = 1;
        });
      });

      if (geo.spine) {
        // Pipeline: tres carriles paralelos que se van llenando a lo largo del recorrido hasta donde llegó el scroll
        const { spine } = geo;
        const grow = (cur, target) => (still ? target : Math.min(target, cur + dt * FLOW_SPEED));
        flow = grow(flow, joined > 0.98 ? lengthAtY(spine, built) : 0);
        const branchTarget = flow >= spine.total - 1 ? Math.max(0, ...geo.branches.map((b) => lengthAtY(b, built))) : 0;
        branchFlow = grow(branchFlow, branchTarget);
        if (flow > 0) {
          const endS = flow;
          const [kEnd] = indexAt(spine, endS);
          const [kVis0] = indexAt(spine, lengthAtY(spine, sy - 40));
          const [kVis1] = indexAt(spine, lengthAtY(spine, sy + h + 40));
          const k1 = Math.min(kEnd, kVis1 + 1);
          for (let i = 0; i < 3; i++) {
            const lane = [];
            for (let k = kVis0; k <= k1; k++) lane.push(lanePoint(i, k));
            if (k1 === kEnd && k1 >= kVis0) lane.push(lanePointAt(i, endS));
            glowStroke(lane, 1.5, colors.pipe);
            if (still) continue;
            for (let s = (time * PACKET_SPEED + i * 47) % PACKET_SPACING; s < endS; s += PACKET_SPACING) {
              const [k] = indexAt(spine, s);
              if (k < kVis0 || k > k1) continue;
              const [x, y] = lanePoint(i, k);
              const at = stageAtY(y);
              ctx.fillStyle = colors.glow;
              packet(ctx, x, y, 6, at < 0 ? 0 : (at + 1) % 3);
              ctx.fillStyle = at < 0 ? colors.pipe : hsl(geo.stages[at].hue);
              packet(ctx, x, y, 2.6, at < 0 ? 0 : (at + 1) % 3);
            }
          }

          // Ramas hacia los proyectos
          geo.branches.forEach((b, k) => {
            const reach = Math.min(branchFlow, lengthAtY(b, built));
            if (reach <= 0) return;
            glowStroke(slicePath(b, reach), 1.5, colors.pipe);
            if (still) return;
            for (let s = (time * PACKET_SPEED + k * 53) % PACKET_SPACING; s < reach; s += PACKET_SPACING) {
              const [x, y] = pointAt(b, s);
              if (y > sy - 20 && y < sy + h + 20) dot(x, y, 2.4, colors.pipe);
            }
          });
        }

        // Nodo de unión donde se juntan los seis rayos
        if (joined > 0.6) {
          const on = smooth((joined - 0.6) / 0.4);
          const pulse = still ? 0 : (Math.sin(time * 3) + 1) / 2;
          dot(geo.merge[0], geo.merge[1], (5 + pulse * 1.5) * on, colors.pipe, 3.2);
        }

        // Engranes de los cruces: giran en sentidos alternos
        geo.mids.forEach(([x, y], i) => {
          if (flow < geo.midsAt[i]) return;
          const gr = w < 760 ? 16 : 24;
          ctx.fillStyle = colors.glow;
          ctx.beginPath();
          ctx.arc(x, y, gr * 1.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = colors.bg;
          ctx.beginPath();
          ctx.arc(x, y, gr * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = colors.pipe;
          ctx.lineWidth = 2.2;
          gear(ctx, x, y, gr, 10, (i % 2 ? -1 : 1) * time * 1.2);
        });

        // Estaciones: una por rol (fábrica, engranes, cerebro, base de datos…), se encienden al llegar el pipeline
        const stationR = w < 760 ? 19 : 30;
        geo.stages.forEach((s, i) => {
          const on = smooth((flow - s.at) / 60);
          if (!on) return;
          drawStation(ctx, {
            x: s.x, y: s.y, r: stationR * on, icon: s.icon, t: time + i * 0.37,
            color: hsl(s.hue), halo: hsl(s.hue, 0.16), bg: colors.bg,
          });
        });

        // Puertos de llegada en cada proyecto
        geo.sinks.forEach((s, k) => {
          const b = geo.branches[k];
          const on = b ? smooth((branchFlow - b.total + 30) / 30) : 0;
          if (on) ringNode(s.x, s.y, 7 * on, colors.pipe);
        });
      }

      // Núcleo: nace a los 2 s (0 → 12 → 10) y al desarmarse queda como la fuente de los rayos
      const ci = clamp((intro - INTRO.core) / INTRO.coreDur);
      if (ci > 0) {
        const grow = ci < 0.65 ? smooth(ci / 0.65) * 12 : lerp(12, 10, smooth((ci - 0.65) / 0.35));
        const r = lerp(grow * atom.k, 7, smooth(m * 2));
        const g = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, r * 2.2);
        g.addColorStop(0, colors.glow);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colors.core;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const frame = (now) => {
      draw(now);
      raf = requestAnimationFrame(frame);
    };
    // Con movimiento reducido no hay animación continua: solo se redibuja al hacer scroll
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMq.matches) draw(0);
      else raf = requestAnimationFrame(frame);
    };
    const redraw = () => { if (reduceMq.matches) draw(0); };
    const relayout = () => { geo = measure(); redraw(); };
    const onTheme = () => { readColors(); redraw(); };

    readColors();
    resize();
    start();

    const layoutObs = new ResizeObserver(relayout);
    layoutObs.observe(document.body);
    const themeObs = new MutationObserver(onTheme);
    themeObs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    const onResize = () => { resize(); redraw(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', redraw, { passive: true });
    window.addEventListener('load', relayout);
    darkMq.addEventListener('change', onTheme);
    reduceMq.addEventListener('change', start);
    document.fonts?.ready.then(relayout);

    return () => {
      cancelAnimationFrame(raf);
      layoutObs.disconnect();
      themeObs.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', redraw);
      window.removeEventListener('load', relayout);
      darkMq.removeEventListener('change', onTheme);
      reduceMq.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvasRef} className="pipeline" aria-hidden="true" />;
}
