/* Crystalline / zeolite-inspired SVG abstractions.
   Each is drawn with currentColor so it follows --accent automatically.
   Use:  <div data-vis="mfi"></div>
   Available: mfi, fau, cha, lta, channels, porosity, dual, mor, globe, dotfield */

(function () {
  const V = {};

  // Helper to wrap an SVG with consistent viewBox
  const wrap = (inner, w = 400, h = 500, opts = {}) =>
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="${opts.par || 'xMidYMid slice'}" role="img" aria-label="${opts.alt || ''}">${inner}</svg>`;

  /* ---------- MFI: channels with intersecting straight + sinusoidal pores ---------- */
  V.mfi = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    // straight vertical channels
    let lines = "";
    for (let x = 40; x <= 360; x += 28) {
      const op = 0.15 + (Math.sin(x) + 1) * 0.1;
      lines += `<line x1="${x}" y1="-10" x2="${x}" y2="510" stroke="currentColor" stroke-width="0.9" opacity="${op.toFixed(2)}"/>`;
    }
    // sinusoidal cross channels
    let waves = "";
    for (let y = 40; y <= 480; y += 36) {
      let d = `M -10 ${y}`;
      for (let x = 0; x <= 410; x += 8) {
        const yy = y + Math.sin((x + y) * 0.05) * 6;
        d += ` L ${x} ${yy.toFixed(2)}`;
      }
      waves += `<path d="${d}" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.22"/>`;
    }
    // pore intersections — small accent dots
    let dots = "";
    for (let x = 40; x <= 360; x += 56) {
      for (let y = 60; y <= 460; y += 72) {
        dots += `<circle cx="${x}" cy="${y}" r="2.2" fill="currentColor" opacity="0.85"/>`;
      }
    }
    return wrap(bg + lines + waves + dots, 400, 500, { alt: "MFI channel system" });
  };

  /* ---------- FAU: hexagonal cage tessellation ---------- */
  V.fau = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    const R = 26;
    const dy = R * Math.sqrt(3);
    const hex = (cx, cy, r, op) => {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 6 + i * Math.PI / 3;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="0.9" opacity="${op}"/>`;
    };
    let g = "";
    let row = 0;
    for (let y = -dy; y < 520 + dy; y += dy) {
      const off = (row % 2) ? R * 1.5 : 0;
      for (let x = -R; x < 420 + R; x += R * 3) {
        // distance from center for fade
        const cx = x + off;
        const cy = y;
        const d = Math.hypot(cx - 200, cy - 250) / 280;
        const op = Math.max(0.12, 0.8 - d);
        g += hex(cx, cy, R, op.toFixed(2));
      }
      row++;
    }
    // dots inside cages
    let dots = "";
    row = 0;
    for (let y = -dy; y < 520 + dy; y += dy) {
      const off = (row % 2) ? R * 1.5 : 0;
      for (let x = -R; x < 420 + R; x += R * 3) {
        const cx = x + off, cy = y;
        const d = Math.hypot(cx - 200, cy - 250) / 280;
        if (d < 0.7) dots += `<circle cx="${cx}" cy="${cy}" r="1.8" fill="currentColor" opacity="${(0.9 - d).toFixed(2)}"/>`;
      }
      row++;
    }
    return wrap(bg + g + dots, 400, 500, { alt: "FAU cage tessellation" });
  };

  /* ---------- CHA: layered planes with d-windows ---------- */
  V.cha = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    let g = "";
    // stacked perspective layers
    for (let i = 0; i < 8; i++) {
      const y = 70 + i * 50;
      const skew = 14;
      const op = 0.18 + i * 0.04;
      g += `<path d="M 20 ${y} L 380 ${y - skew} L 380 ${y - skew + 22} L 20 ${y + 22} Z" fill="none" stroke="currentColor" stroke-width="0.7" opacity="${op.toFixed(2)}"/>`;
      // window apertures along each layer
      for (let x = 50; x < 380; x += 50) {
        const yy = y + 11 - (x - 20) * skew / 360 + 11/2 - 11;
        g += `<ellipse cx="${x}" cy="${(y + 11 - (x - 20) * skew / 360).toFixed(1)}" rx="9" ry="3" fill="none" stroke="currentColor" stroke-width="0.8" opacity="${(op + 0.15).toFixed(2)}"/>`;
      }
    }
    return wrap(bg + g, 400, 500, { alt: "CHA layered structure" });
  };

  /* ---------- LTA: cubic cage isometric ---------- */
  V.lta = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    // isometric cube grid
    const draw = (cx, cy, s, op) => {
      const k = 0.866;
      const pts = {
        a: [cx - s, cy],            // left
        b: [cx, cy - s * k],        // top
        c: [cx + s, cy],            // right
        d: [cx, cy + s * k],        // bottom
        e: [cx, cy - s * 1.8 * k],  // top-back
      };
      // front face outline
      let r = `<polygon points="${pts.a[0]},${pts.a[1]} ${pts.b[0]},${pts.b[1]} ${pts.c[0]},${pts.c[1]} ${pts.d[0]},${pts.d[1]}" fill="none" stroke="currentColor" stroke-width="0.9" opacity="${op}"/>`;
      // vertical edges
      r += `<line x1="${pts.a[0]}" y1="${pts.a[1]}" x2="${pts.a[0]}" y2="${pts.a[1] - s}" stroke="currentColor" stroke-width="0.9" opacity="${op}"/>`;
      r += `<line x1="${pts.c[0]}" y1="${pts.c[1]}" x2="${pts.c[0]}" y2="${pts.c[1] - s}" stroke="currentColor" stroke-width="0.9" opacity="${op}"/>`;
      r += `<line x1="${pts.b[0]}" y1="${pts.b[1]}" x2="${pts.b[0]}" y2="${pts.b[1] - s}" stroke="currentColor" stroke-width="0.9" opacity="${op}"/>`;
      // top diamond
      const ty = pts.b[1] - s;
      r += `<polygon points="${pts.a[0]},${pts.a[1] - s} ${pts.b[0]},${ty} ${pts.c[0]},${pts.c[1] - s} ${pts.b[0]},${pts.b[1]}" fill="none" stroke="currentColor" stroke-width="0.9" opacity="${op}"/>`;
      // node at corners
      Object.values(pts).slice(0, 4).forEach(p => {
        r += `<circle cx="${p[0]}" cy="${p[1]}" r="1.8" fill="currentColor" opacity="${(Number(op) + 0.2).toFixed(2)}"/>`;
      });
      return r;
    };
    let g = "";
    const s = 36;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const cx = 50 + col * s * 2.0 + (row % 2 ? s : 0);
        const cy = 100 + row * s * 1.4;
        const d = Math.hypot(cx - 200, cy - 250) / 260;
        if (d > 1.05) continue;
        g += draw(cx, cy, s * 0.7, +(0.75 - d).toFixed(2));
      }
    }
    return wrap(bg + g, 400, 500, { alt: "LTA cubic cages" });
  };

  /* ---------- CHANNELS: parallel pores diagonal cut ---------- */
  V.channels = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    let g = `<g transform="rotate(-22 200 250)">`;
    for (let x = -100; x < 500; x += 14) {
      const op = 0.12 + Math.abs(Math.sin(x * 0.13)) * 0.5;
      g += `<line x1="${x}" y1="-100" x2="${x}" y2="600" stroke="currentColor" stroke-width="0.8" opacity="${op.toFixed(2)}"/>`;
    }
    g += `</g>`;
    return wrap(bg + g, 400, 500, { alt: "Pore channels" });
  };

  /* ---------- POROSITY field: organic porosity blob ---------- */
  V.porosity = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    let g = "";
    // pseudo-random pore distribution (deterministic seed)
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 90; i++) {
      const x = rnd() * 400;
      const y = rnd() * 500;
      const r = 4 + rnd() * 18;
      const op = 0.12 + rnd() * 0.4;
      g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="0.8" opacity="${op.toFixed(2)}"/>`;
    }
    for (let i = 0; i < 120; i++) {
      const x = rnd() * 400, y = rnd() * 500;
      g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.2" fill="currentColor" opacity="0.55"/>`;
    }
    return wrap(bg + g, 400, 500, { alt: "Porosity field" });
  };

  /* ---------- DUAL: two intersecting linear systems ---------- */
  V.dual = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    let g = "";
    g += `<g opacity="0.55">`;
    for (let x = 0; x < 400; x += 20) {
      g += `<line x1="${x}" y1="0" x2="${x + 80}" y2="500" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>`;
    }
    g += `</g><g opacity="0.55">`;
    for (let x = 0; x < 400; x += 20) {
      g += `<line x1="${x}" y1="0" x2="${x - 80}" y2="500" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>`;
    }
    g += `</g>`;
    return wrap(bg + g, 400, 500, { alt: "Dual channel system" });
  };

  /* ---------- MOR: ladder/zigzag ---------- */
  V.mor = () => {
    const bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    let g = "";
    for (let col = 0; col < 7; col++) {
      const cx = 40 + col * 55;
      // vertical rails
      g += `<line x1="${cx - 12}" y1="20" x2="${cx - 12}" y2="480" stroke="currentColor" stroke-width="0.9" opacity="0.35"/>`;
      g += `<line x1="${cx + 12}" y1="20" x2="${cx + 12}" y2="480" stroke="currentColor" stroke-width="0.9" opacity="0.35"/>`;
      // zigzag
      let d = `M ${cx - 12} 30`;
      for (let y = 30; y < 480; y += 24) {
        d += ` L ${cx + 12} ${y + 12} L ${cx - 12} ${y + 24}`;
      }
      g += `<path d="${d}" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>`;
    }
    return wrap(bg + g, 400, 500, { alt: "MOR ladder structure" });
  };

  /* ---------- DOTFIELD: subtle background ---------- */
  V.dotfield = () => {
    let bg = `<rect width="400" height="500" fill="var(--paper-2)"/>`;
    let g = "";
    for (let x = 14; x < 400; x += 18) {
      for (let y = 14; y < 500; y += 18) {
        const d = Math.hypot(x - 200, y - 250) / 260;
        const op = Math.max(0.05, 0.55 - d * 0.4);
        g += `<circle cx="${x}" cy="${y}" r="0.9" fill="currentColor" opacity="${op.toFixed(2)}"/>`;
      }
    }
    return wrap(bg + g, 400, 500, { alt: "Dot field" });
  };

  /* ---------- GLOBE: minimalist wireframe map ---------- */
  V.globe = (w = 1200, h = 600, points = []) => {
    let g = `<rect width="${w}" height="${h}" fill="transparent"/>`;
    // graticule — latitude lines
    for (let lat = -60; lat <= 60; lat += 20) {
      const y = h / 2 - (lat / 90) * (h / 2 - 20);
      g += `<line x1="20" y1="${y}" x2="${w - 20}" y2="${y}" stroke="currentColor" stroke-width="0.5" opacity="0.18"/>`;
    }
    // longitude lines (curved sin)
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = w / 2 + (lon / 180) * (w / 2 - 20);
      let d = `M ${x} 20`;
      for (let yy = 20; yy <= h - 20; yy += 6) {
        const lat = (h / 2 - yy) / (h / 2 - 20) * 90;
        const xx = x + Math.cos(lat * Math.PI / 180) * 2;
        d += ` L ${xx.toFixed(1)} ${yy}`;
      }
      g += `<path d="${d}" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.14"/>`;
    }
    // continents — simplified polylines (very abstract dot density per region)
    // We'll plot a coarse landmass dot mask
    const dots = [
      // North America
      [0.18,0.30],[0.20,0.32],[0.22,0.30],[0.24,0.32],[0.22,0.36],[0.20,0.38],[0.24,0.40],[0.22,0.44],[0.18,0.34],[0.16,0.36],[0.26,0.36],[0.28,0.42],[0.22,0.50],
      // South America
      [0.30,0.55],[0.31,0.60],[0.30,0.66],[0.28,0.72],[0.32,0.70],[0.34,0.60],[0.30,0.58],
      // Europe
      [0.48,0.25],[0.50,0.28],[0.52,0.30],[0.54,0.28],[0.50,0.32],[0.52,0.26],[0.48,0.30],
      // Africa
      [0.52,0.42],[0.54,0.48],[0.52,0.54],[0.56,0.50],[0.54,0.58],[0.50,0.50],[0.52,0.62],[0.50,0.60],
      // Middle East
      [0.58,0.38],[0.60,0.40],[0.56,0.36],
      // Asia
      [0.62,0.30],[0.65,0.32],[0.68,0.30],[0.72,0.32],[0.75,0.30],[0.70,0.36],[0.78,0.34],[0.74,0.28],[0.68,0.36],[0.80,0.40],
      // SE Asia
      [0.76,0.46],[0.78,0.50],[0.80,0.48],
      // Australia
      [0.84,0.62],[0.86,0.64],[0.88,0.62],[0.84,0.66],[0.86,0.60],
      // Japan (highlight)
      [0.83,0.36],[0.84,0.34],[0.85,0.38]
    ];
    dots.forEach(([fx, fy]) => {
      g += `<circle cx="${(fx * w).toFixed(1)}" cy="${(fy * h).toFixed(1)}" r="1.6" fill="currentColor" opacity="0.45"/>`;
    });

    // active collaboration nodes & lines
    // Tokyo as anchor
    const tokyo = [0.84, 0.36];
    points.forEach(p => {
      const [fx, fy] = p.coords;
      const x1 = tokyo[0] * w, y1 = tokyo[1] * h;
      const x2 = fx * w, y2 = fy * h;
      // arc midpoint
      const mx = (x1 + x2) / 2;
      const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.18;
      g += `<path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.45"/>`;
    });
    // anchor (Tokyo)
    g += `<circle cx="${(tokyo[0] * w).toFixed(1)}" cy="${(tokyo[1] * h).toFixed(1)}" r="6" fill="currentColor"/>`;
    g += `<circle cx="${(tokyo[0] * w).toFixed(1)}" cy="${(tokyo[1] * h).toFixed(1)}" r="11" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>`;
    g += `<text x="${(tokyo[0] * w + 14).toFixed(0)}" y="${(tokyo[1] * h - 8).toFixed(0)}" font-family="ui-monospace, monospace" font-size="11" fill="currentColor" letter-spacing="2" text-transform="uppercase">TOKYO · HQ</text>`;
    // collab nodes
    points.forEach(p => {
      const [fx, fy] = p.coords;
      const x = fx * w, y = fy * h;
      g += `<circle cx="${x}" cy="${y}" r="3.5" fill="currentColor"/>`;
      g += `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>`;
      g += `<text x="${(x + 10).toFixed(0)}" y="${(y + 4).toFixed(0)}" font-family="ui-monospace, monospace" font-size="9" fill="currentColor" opacity="0.9" letter-spacing="1.5">${p.label}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Global collaborations">${g}</svg>`;
  };

  /* ---------- DOM injection ---------- */
  function inject() {
    document.querySelectorAll("[data-vis]").forEach(el => {
      if (el.dataset.visDone) return;
      const kind = el.dataset.vis;
      if (V[kind]) {
        if (kind === "globe") {
          const pts = el.dataset.points ? JSON.parse(el.dataset.points) : [];
          el.innerHTML = V.globe(1200, 600, pts);
        } else {
          el.innerHTML = V[kind]();
        }
        el.dataset.visDone = "1";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
  window.__rsVis = { V, inject };
})();
