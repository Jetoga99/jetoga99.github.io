// Íconos animados de las estaciones del pipeline, dibujados en canvas.
// Cada función recibe el contexto ya trasladado al centro de la estación, el medio tamaño s del
// ícono, el tiempo t en segundos y el color de trazo. Todo se dibuja en unidades de s.

const TAU = Math.PI * 2;

export function gear(ctx, cx, cy, r, teeth, angle) {
  const inner = r * 0.74;
  const step = TAU / teeth;
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a = angle + i * step;
    const pts = [[inner, a], [r, a + step * 0.18], [r, a + step * 0.5], [inner, a + step * 0.68]];
    pts.forEach(([rad, ang], k) => {
      const x = cx + rad * Math.cos(ang);
      const y = cy + rad * Math.sin(ang);
      if (i === 0 && k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
  }
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.28, 0, TAU);
  ctx.stroke();
}

function poly(ctx, pts, s, close = true) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s)));
  if (close) ctx.closePath();
  ctx.stroke();
}

const ICONS = {
  // Fábrica con chimenea que echa humo: procesamiento a escala
  factory(ctx, s, t, color) {
    poly(ctx, [[-1, 1], [-1, -0.1], [-0.45, 0.25], [-0.45, -0.1], [0.1, 0.25], [0.35, 0.25], [0.35, -0.8], [0.65, -0.8], [0.65, 0.25], [1, 0.25], [1, 1]], s);
    ctx.fillStyle = color;
    [-0.62, -0.12, 0.38].forEach((x) => ctx.fillRect(x * s, 0.52 * s, 0.24 * s, 0.22 * s));
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.55 + i / 3) % 1;
      ctx.globalAlpha = (1 - p) * 0.8;
      ctx.beginPath();
      ctx.arc((0.5 + p * 0.35) * s, (-0.95 - p * 0.75) * s, (0.12 + p * 0.2) * s, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  // Dos engranes acoplados: transformación (ETL)
  gears(ctx, s, t) {
    gear(ctx, -0.28 * s, 0.18 * s, 0.68 * s, 9, t * 1.2);
    gear(ctx, 0.62 * s, -0.5 * s, 0.42 * s, 6, -t * 1.2 * 1.5 + 0.3);
  },

  // Cerebro con sinapsis que se encienden: modelos y minería de datos
  brain(ctx, s, t, color) {
    // Contorno de circunvoluciones: arcos que sobresalen alrededor de una elipse
    const bumps = 10;
    ctx.beginPath();
    for (let i = 0; i < bumps; i++) {
      const a = (i / bumps) * TAU;
      ctx.moveTo(0.74 * s * Math.cos(a) + 0.3 * s * Math.cos(a - 1.2), -0.05 * s + 0.6 * s * Math.sin(a) + 0.3 * s * Math.sin(a - 1.2));
      ctx.arc(0.74 * s * Math.cos(a), -0.05 * s + 0.6 * s * Math.sin(a), 0.3 * s, a - 1.2, a + 1.2);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -0.85 * s);
    ctx.bezierCurveTo(0.22 * s, -0.4 * s, -0.22 * s, 0.2 * s, 0, 0.75 * s);
    ctx.stroke();
    [[-0.5, -0.3, 0.32, 0.2, 2.6], [-0.48, 0.3, 0.26, 3.6, 5.9], [0.5, -0.25, 0.3, 3.6, 6.6], [0.46, 0.32, 0.26, 0.4, 3.2]].forEach(([x, y, r, a0, a1]) => {
      ctx.beginPath();
      ctx.arc(x * s, y * s, r * s, a0, a1);
      ctx.stroke();
    });
    ctx.fillStyle = color;
    [[-0.7, -0.05], [-0.2, -0.55], [0.25, 0.1], [0.72, 0.05], [-0.25, 0.5], [0.3, -0.6]].forEach(([x, y], i) => {
      ctx.globalAlpha = Math.max(0, Math.sin(t * 4 + i * 1.9));
      ctx.beginPath();
      ctx.arc(x * s, y * s, 0.11 * s, 0, TAU);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  },

  // Base de datos: cilindro cuyos discos se iluminan en secuencia
  database(ctx, s, t, color) {
    const rx = 0.8 * s, ry = 0.24 * s;
    const levels = [-0.7, -0.2, 0.3, 0.8].map((y) => y * s);
    const lit = Math.floor(t * 2.5) % 3;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(0, levels[lit + 1], rx, ry, 0, 0, Math.PI);
    ctx.lineTo(-rx, levels[lit]);
    ctx.ellipse(0, levels[lit], rx, ry, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.ellipse(0, levels[0], rx, ry, 0, 0, TAU);
    ctx.stroke();
    levels.slice(1).forEach((y) => {
      ctx.beginPath();
      ctx.ellipse(0, y, rx, ry, 0, 0, Math.PI);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(-rx, levels[0]);
    ctx.lineTo(-rx, levels[3]);
    ctx.moveTo(rx, levels[0]);
    ctx.lineTo(rx, levels[3]);
    ctx.stroke();
  },

  // Gráfica de barras viva: visualización y dashboards
  chart(ctx, s, t, color) {
    poly(ctx, [[-0.9, -0.9], [-0.9, 0.85], [0.95, 0.85]], s, false);
    ctx.fillStyle = color;
    [0, 1, 2].forEach((i) => {
      const hgt = 0.35 + 0.95 * ((Math.sin(t * 2.2 + i * 1.4) + 1) / 2);
      ctx.fillRect((-0.6 + i * 0.52) * s, (0.72 - hgt) * s, 0.34 * s, hgt * s);
    });
  },

  // Embudo que deja caer gotas: ingesta y scraping
  funnel(ctx, s, t, color) {
    poly(ctx, [[-1, -0.75], [1, -0.75], [0.18, 0.15], [0.18, 0.6], [-0.18, 0.6], [-0.18, 0.15]], s);
    ctx.fillStyle = color;
    [[-0.5, -0.95], [0.1, -1.05], [0.55, -0.95]].forEach(([x, y], i) => {
      ctx.globalAlpha = (Math.sin(t * 3 + i * 2) + 1) / 2;
      ctx.fillRect((x - 0.08) * s, (y - 0.08) * s, 0.16 * s, 0.16 * s);
    });
    for (let i = 0; i < 2; i++) {
      const p = (t * 1.3 + i / 2) % 1;
      ctx.globalAlpha = 1 - p;
      ctx.beginPath();
      ctx.arc(0, (0.72 + p * 0.5) * s, 0.1 * s, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  // </> con cursor: el origen, desarrollo de software
  code(ctx, s, t, color) {
    poly(ctx, [[-0.35, -0.55], [-0.95, 0], [-0.35, 0.55]], s, false);
    poly(ctx, [[0.35, -0.55], [0.95, 0], [0.35, 0.55]], s, false);
    poly(ctx, [[0.15, -0.7], [-0.15, 0.7]], s, false);
    if (Math.floor(t * 2) % 2) {
      ctx.fillStyle = color;
      ctx.fillRect(0.5 * s, 0.75 * s, 0.4 * s, 0.12 * s);
    }
  },
};

// Estación completa: carcasa circular con halo que respira y el ícono adentro
export function drawStation(ctx, { x, y, r, icon, t, color, halo, bg }) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, r * (1.45 + 0.15 * Math.sin(t * 2.4)), 0, TAU);
  ctx.fill();
  ctx.fillStyle = bg;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
  ctx.stroke();
  // Marcas de "válvula" en la carcasa, girando despacio
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const a = t * 0.4 + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.arc(0, 0, r + 5, a, a + 0.35);
    ctx.stroke();
  }
  ctx.lineWidth = 1.8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  (ICONS[icon] || ICONS.gears)(ctx, r * 0.56, t, color);
  ctx.restore();
}

// Forma de un paquete según la estación que cruzó: círculo → cuadro → rombo
export function packet(ctx, x, y, r, shape) {
  ctx.beginPath();
  if (shape === 1) ctx.rect(x - r, y - r, r * 2, r * 2);
  else if (shape === 2) {
    ctx.moveTo(x, y - r * 1.35);
    ctx.lineTo(x + r * 1.35, y);
    ctx.lineTo(x, y + r * 1.35);
    ctx.lineTo(x - r * 1.35, y);
    ctx.closePath();
  } else ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}
