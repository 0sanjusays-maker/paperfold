/* ==========================================================================
   Patte mein basa Suraj — Madhubani animatic scenes
   Flat colour, double outlines, patterned fills. Everything is inline SVG so
   the whole reel stays a single self-contained page.
   ========================================================================== */
(function (global) {
  "use strict";

  const C = {
    ink: "#241a12",
    paper: "#f8efdb",
    ivory: "#fbf3e2",
    gold: "#e8b04b",
    deepGold: "#c98a24",
    saffron: "#f2a03d",
    verm: "#cf3f2e",
    terra: "#a8401f",
    mud: "#c9743f",
    leafDark: "#22543a",
    leaf: "#3d7a4c",
    leafLight: "#7fa858",
    indigo: "#18213d",
    night: "#0c1129",
    night2: "#151d3d",
    river: "#2d6f79",
    riverDeep: "#1d4f5e",
    pink: "#d97a8c",
    skin: "#e7bd93",
    hair: "#1a1410",
    white: "#fdf8ec",
  };

  /* ------------------------------------------------------------- patterns */

  function pat(id, w, h, body) {
    return `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">${body}</pattern>`;
  }

  function defs(p) {
    return `<defs>
      ${pat(p + "-dots", 18, 18, `<circle cx="4" cy="4" r="2" fill="${C.ink}" opacity=".5"/>`)}
      ${pat(p + "-cross", 20, 20, `<path d="M0 0l20 20M20 0L0 20" stroke="${C.ink}" stroke-width="1.4" opacity=".38"/>`)}
      ${pat(p + "-scales", 30, 30, `<path d="M-15 15a15 15 0 0 0 30 0M0 30a15 15 0 0 0 30 0" fill="none" stroke="${C.ink}" stroke-width="1.6" opacity=".35"/>`)}
      ${pat(p + "-weave", 18, 18, `<path d="M0 9h18M9 0v18" stroke="${C.ink}" stroke-width="1.3" opacity=".3"/>`)}
      ${pat(p + "-golddots", 16, 16, `<circle cx="4" cy="4" r="2.2" fill="${C.gold}"/>`)}
      ${pat(p + "-petals", 26, 26, `<path d="M13 3c4 6 4 11 0 17-4-6-4-11 0-17z" fill="none" stroke="${C.ink}" stroke-width="1.3" opacity=".32"/>`)}
      ${pat(p + "-lines", 14, 14, `<path d="M0 14L14 0" stroke="${C.ink}" stroke-width="1.2" opacity=".26"/>`)}
      ${pat(p + "-wave", 48, 22, `<path d="M0 16q12-10 24 0t24 0" fill="none" stroke="${C.ivory}" stroke-width="2.6" opacity=".55"/>`)}
      <radialGradient id="${p}-glow">
        <stop offset="0%" stop-color="#ffd489" stop-opacity=".85"/>
        <stop offset="45%" stop-color="#f6b03c" stop-opacity=".38"/>
        <stop offset="100%" stop-color="#f2a03d" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${p}-warm">
        <stop offset="0%" stop-color="#fff3d0" stop-opacity=".8"/>
        <stop offset="100%" stop-color="#ffc972" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
  }

  const svgOpen = (p, body, bg) =>
    `<svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      ${defs(p)}
      <rect width="1080" height="1920" fill="${bg || C.paper}"/>
      ${body}
      <rect width="1080" height="1920" fill="url(#${p}-dots)" opacity=".09"/>
    </svg>`;

  const enter = (at, inner, cls) =>
    `<g class="enter ${cls || ""}" data-at="${at}" style="--p:0">${inner}</g>`;

  /* --------------------------------------------------------------- pieces */

  function sun(cx, cy, r, o) {
    o = o || {};
    const p = o.p || "s";
    const col = o.color || C.gold;
    const rays = o.rays === 0 ? "" : rayRing(cx, cy, r * 1.04, r * (o.rayLen || 0.34), o.rayColor || col, o.rayCount || 28, o.rayClass || "rayturn");
    const fy = cy + (o.faceY || 0) * r;
    const face = o.face === false ? "" : `
      <ellipse cx="${cx - r * 0.24}" cy="${fy - r * 0.06}" rx="${r * 0.13}" ry="${r * 0.095}" fill="${C.white}" stroke="${C.ink}" stroke-width="${r * 0.032}"/>
      <ellipse cx="${cx + r * 0.24}" cy="${fy - r * 0.06}" rx="${r * 0.13}" ry="${r * 0.095}" fill="${C.white}" stroke="${C.ink}" stroke-width="${r * 0.032}"/>
      <circle cx="${cx - r * 0.235}" cy="${fy - r * 0.04}" r="${r * 0.052}" fill="${C.ink}"/>
      <circle cx="${cx + r * 0.245}" cy="${fy - r * 0.04}" r="${r * 0.052}" fill="${C.ink}"/>
      <path d="M ${cx - r * 0.36} ${fy - r * 0.23} q ${r * 0.13} ${-r * 0.1} ${r * 0.25} ${-r * 0.02}" fill="none" stroke="${C.ink}" stroke-width="${r * 0.04}" stroke-linecap="round"/>
      <path d="M ${cx + r * 0.11} ${fy - r * 0.25} q ${r * 0.13} ${-r * 0.08} ${r * 0.25} ${r * 0.02}" fill="none" stroke="${C.ink}" stroke-width="${r * 0.04}" stroke-linecap="round"/>
      <path d="M ${cx - r * 0.19} ${fy + r * 0.2} q ${r * 0.19} ${r * 0.16} ${r * 0.38} 0" fill="${C.verm}" stroke="${C.ink}" stroke-width="${r * 0.034}" stroke-linecap="round"/>
`;
    return `<g class="${o.cls || ""}">
      ${o.glow === false ? "" : `<circle cx="${cx}" cy="${cy}" r="${r * 2.1}" fill="url(#${p || "s"}-glow)" class="glowpulse"/>`}
      ${rays}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" stroke="${C.ink}" stroke-width="${Math.max(3, r * 0.035)}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.82}" fill="none" stroke="${C.ink}" stroke-width="${Math.max(2, r * 0.02)}" opacity=".45"/>
      ${face}
    </g>`;
  }

  function rayRing(cx, cy, r0, len, color, count, cls) {
    let d = "";
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const w = 0.052;
      const x1 = cx + Math.cos(a - w) * r0,
        y1 = cy + Math.sin(a - w) * r0;
      const x2 = cx + Math.cos(a) * (r0 + len),
        y2 = cy + Math.sin(a) * (r0 + len);
      const x3 = cx + Math.cos(a + w) * r0,
        y3 = cy + Math.sin(a + w) * r0;
      d += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}Z" fill="${color}" stroke="${C.ink}" stroke-width="${Math.max(1.4, len * 0.045)}"/>`;
    }
    return `<g class="${cls || ""}" style="transform-origin:${cx}px ${cy}px">${d}</g>`;
  }

  function leaf(cx, cy, w, h, rot, o) {
    o = o || {};
    const fill = o.fill || C.leaf;
    const vein = o.vein || C.ivory;
    const id = o.p || "leaf";
    let veins = "";
    const n = o.veins || 9;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      const yy = -h * t;
      const span = Math.sin(t * Math.PI * 0.92) * w * 0.42;
      veins += `<path d="M0 ${yy} Q ${span * 0.55} ${yy - h * 0.05} ${span} ${yy - h * 0.1}
                       M0 ${yy} Q ${-span * 0.55} ${yy - h * 0.05} ${-span} ${yy - h * 0.1}"
                 fill="none" stroke="${vein}" stroke-width="${o.veinW || 3.4}" stroke-linecap="round" opacity="${o.veinOpacity || 0.75}"/>`;
    }
    const body = `
      <g class="${o.cls || ""}">
        <path d="M0 0 C ${-w * 0.52} ${-h * 0.16} ${-w * 0.5} ${-h * 0.78} 0 ${-h} C ${w * 0.5} ${-h * 0.78} ${w * 0.52} ${-h * 0.16} 0 0 Z"
              fill="${fill}" stroke="${C.ink}" stroke-width="${o.strokeW || 6}"/>
        <path d="M0 0 C ${-w * 0.52} ${-h * 0.16} ${-w * 0.5} ${-h * 0.78} 0 ${-h} C ${w * 0.5} ${-h * 0.78} ${w * 0.52} ${-h * 0.16} 0 0 Z"
              fill="url(#${id}-${o.pattern || "dots"})" opacity="${o.patternOpacity || 0.22}"/>
        <path d="M0 -2 V ${-h + 6}" stroke="${vein}" stroke-width="${o.midW || 6}" stroke-linecap="round" opacity=".9"/>
        ${veins}
      </g>`;
    return `<g transform="translate(${cx} ${cy}) rotate(${rot || 0})">${body}</g>`;
  }

  function lotus(cx, cy, s, color, o) {
    o = o || {};
    const col = color || C.pink;
    let petals = "";
    for (let i = -2; i <= 2; i++) {
      const a = i * 26;
      petals += `<g transform="rotate(${a})"><path d="M0 0 C ${-s * 0.24} ${-s * 0.5} ${-s * 0.16} ${-s * 0.95} 0 ${-s * 1.05} C ${s * 0.16} ${-s * 0.95} ${s * 0.24} ${-s * 0.5} 0 0 Z"
        fill="${col}" stroke="${C.ink}" stroke-width="${s * 0.055}"/></g>`;
    }
    return `<g transform="translate(${cx} ${cy})" class="${o.cls || ""}">
      ${petals}
      <circle cx="0" cy="-8" r="${s * 0.2}" fill="${C.gold}" stroke="${C.ink}" stroke-width="${s * 0.05}"/>
    </g>`;
  }

  function fish(cx, cy, s, color, flip, o) {
    o = o || {};
    return `<g transform="translate(${cx} ${cy}) scale(${flip ? -s : s} ${s})" class="${o.cls || ""}">
      <path d="M-46 0 C -30 -22 22 -26 44 -4 C 22 20 -30 22 -46 0 Z" fill="${color || C.gold}" stroke="${C.ink}" stroke-width="4"/>
      <path d="M-46 0 L -72 -20 L -66 0 L -72 20 Z" fill="${color || C.gold}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M4 -18 Q 12 -34 22 -20" fill="${color || C.gold}" stroke="${C.ink}" stroke-width="4"/>
      <circle cx="28" cy="-4" r="4.6" fill="${C.ink}"/>
      <path d="M-10 -8 q 12 8 0 16 M 4 -10 q 12 9 0 18" fill="none" stroke="${C.ink}" stroke-width="2.4" opacity=".55"/>
    </g>`;
  }

  function diya(cx, cy, s, o) {
    o = o || {};
    const fl = o.flame === false ? "" : `
      <g class="flicker" style="transform-origin:${cx}px ${cy - 24 * s}px">
        <circle cx="${cx}" cy="${cy - 62 * s}" r="${130 * s}" fill="url(#${o.p || "s"}-warm)"/>
        <path d="M ${cx} ${cy - 26 * s}
                 C ${cx - 24 * s} ${cy - 58 * s} ${cx - 14 * s} ${cy - 84 * s} ${cx} ${cy - 104 * s}
                 C ${cx + 14 * s} ${cy - 84 * s} ${cx + 24 * s} ${cy - 58 * s} ${cx} ${cy - 26 * s} Z"
              fill="${C.gold}" stroke="${C.ink}" stroke-width="${2.6 * s}"/>
        <path d="M ${cx} ${cy - 34 * s}
                 C ${cx - 12 * s} ${cy - 56 * s} ${cx - 7 * s} ${cy - 74 * s} ${cx} ${cy - 86 * s}
                 C ${cx + 7 * s} ${cy - 74 * s} ${cx + 12 * s} ${cy - 56 * s} ${cx} ${cy - 34 * s} Z"
              fill="${C.ivory}"/>
        <path d="M ${cx - 2 * s} ${cy - 32 * s} q ${4 * s} ${-4 * s} ${4 * s} 0" stroke="${C.ink}" stroke-width="${2 * s}" fill="none"/>
      </g>`;
    return `<g class="${o.cls || ""}">
      <ellipse cx="${cx}" cy="${cy + 8 * s}" rx="${70 * s}" ry="${18 * s}" fill="${C.ink}" opacity=".22"/>
      <path d="M ${cx - 70 * s} ${cy - 18 * s} Q ${cx} ${cy + 46 * s} ${cx + 70 * s} ${cy - 18 * s}
               Q ${cx} ${cy + 4 * s} ${cx - 70 * s} ${cy - 18 * s} Z" fill="${C.terra}" stroke="${C.ink}" stroke-width="${3.4 * s}"/>
      <path d="M ${cx - 70 * s} ${cy - 18 * s} Q ${cx} ${cy + 2 * s} ${cx + 70 * s} ${cy - 18 * s}
               Q ${cx} ${cy + 26 * s} ${cx - 70 * s} ${cy - 18 * s} Z" fill="${C.verm}" opacity=".85"/>
      <ellipse cx="${cx}" cy="${cy - 18 * s}" rx="${70 * s}" ry="${9 * s}" fill="${C.gold}" stroke="${C.ink}" stroke-width="${2.6 * s}"/>
      <path d="M ${cx - 70 * s} ${cy - 18 * s} Q ${cx} ${cy - 8 * s} ${cx + 70 * s} ${cy - 18 * s}" fill="none" stroke="${C.ivory}" stroke-width="${2.4 * s}" opacity=".65"/>
      <path d="M ${cx} ${cy - 22 * s} l 0 ${6 * s}" stroke="${C.ink}" stroke-width="${3 * s}"/>
      ${fl}
    </g>`;
  }


  function reflection(cx, y0, w, n, color, o) {
    o = o || {};
    let s = "";
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const y = y0 + i * (o.gap || 62);
      const ww = w * (0.3 + t * 0.68) * (0.72 + 0.28 * Math.cos(i * 1.9));
      const x = cx - ww / 2 + Math.sin(i * 2.3) * (o.sway || 10);
      s += `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} q ${(ww / 4).toFixed(1)} ${-7} ${(ww / 2).toFixed(1)} 0 t ${(ww / 2).toFixed(1)} 0"
              fill="none" stroke="${color || C.gold}" stroke-width="${(o.width || 13) * (1 - t * 0.55)}"
              stroke-linecap="round" opacity="${(0.85 - t * 0.55).toFixed(2)}" class="reflection"/>`;
    }
    return `<g>${s}</g>`;
  }

  function soop(cx, cy, w, o) {
    o = o || {};
    const h = w * 0.25;
    const fill = o.fill || C.gold;
    const rim = o.rim || C.deepGold;
    const scallops = Array.from({ length: 9 }, (_, i) => {
      const x = -w * 0.42 + (i * w * 0.84) / 8;
      return `<circle cx="${x.toFixed(1)}" cy="${(h * 0.52).toFixed(1)}" r="${(w * 0.028).toFixed(1)}" fill="${C.ivory}" opacity=".55"/>`;
    }).join("");
    return `<g transform="translate(${cx} ${cy})" class="${o.cls || ""}">
      <ellipse cx="0" cy="${h * 1.05}" rx="${w * 0.48}" ry="${h * 0.3}" fill="${C.ink}" opacity=".15"/>
      <path d="M ${-w / 2} 0 C ${-w * 0.47} ${h * 0.6} ${-w * 0.38} ${h} ${-w * 0.3} ${h * 1.04}
               L ${w * 0.3} ${h * 1.04} C ${w * 0.38} ${h} ${w * 0.47} ${h * 0.6} ${w / 2} 0 Z"
            fill="${fill}" stroke="${C.ink}" stroke-width="5"/>
      <path d="M ${-w / 2} 0 C ${-w * 0.47} ${h * 0.6} ${-w * 0.38} ${h} ${-w * 0.3} ${h * 1.04}
               L ${w * 0.3} ${h * 1.04} C ${w * 0.38} ${h} ${w * 0.47} ${h * 0.6} ${w / 2} 0 Z"
            fill="url(#${o.p || "s"}-weave)" opacity=".45"/>
      ${scallops}
      <path d="M ${-w * 0.31} ${h * 0.98} L ${w * 0.31} ${h * 0.98}" stroke="${rim}" stroke-width="${h * 0.16}"/>
      <path d="M ${-w * 0.31} ${h * 0.98} L ${w * 0.31} ${h * 0.98}" stroke="${C.ink}" stroke-width="${h * 0.05}" opacity=".55"/>
      <ellipse cx="0" cy="0" rx="${w / 2}" ry="${h * 0.31}" fill="${o.inner || C.ivory}" stroke="${C.ink}" stroke-width="4.5"/>
      <ellipse cx="0" cy="${h * 0.04}" rx="${w * 0.45}" ry="${h * 0.24}" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".3"/>
      ${o.items || ""}
    </g>`;
  }

  function ghat(x, y, w, o) {
    o = o || {};
    const steps = o.steps || 7;
    const sh = o.h || 64;
    const inset = o.inset == null ? 54 : o.inset;
    let s = "";
    for (let i = 0; i < steps; i++) {
      const px = x - i * inset;
      const sy = y + i * sh;
      s += `<rect x="${px}" y="${sy}" width="${w + i * inset}" height="${sh}" fill="${i % 2 ? o.c1 || "#d9b184" : o.c2 || "#e8c9a2"}" stroke="${C.ink}" stroke-width="3.5"/>`;
      s += `<rect x="${px}" y="${sy}" width="${w + i * inset}" height="${sh * 0.16}" fill="${C.ink}" opacity=".13"/>`;
      s += `<rect x="${px + 8}" y="${sy + sh * 0.3}" width="${w + i * inset - 16}" height="2" fill="${C.ink}" opacity=".16"/>`;
    }
    s += `<path d="M ${x} ${y} L ${x - (steps - 1) * inset} ${y + (steps - 1) * sh} L ${x - (steps - 1) * inset} ${y + steps * sh} L ${x} ${y + sh} Z"
            fill="#b5814f" stroke="${C.ink}" stroke-width="4" opacity=".95"/>`;
    s += `<path d="M ${x} ${y} L ${x} ${y + sh}" stroke="${C.ivory}" stroke-width="3" opacity=".35"/>`;
    return `<g class="${o.cls || ""}">${s}</g>`;
  }

  function hut(x, y, s, o) {
    o = o || {};
    return `<g transform="translate(${x} ${y}) scale(${s})" class="${o.cls || ""}">
      <rect x="-110" y="-150" width="220" height="150" fill="${o.wall || C.mud}" stroke="${C.ink}" stroke-width="6"/>
      <rect x="-110" y="-88" width="220" height="30" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>
      <path d="M -96 -88 q 20 22 40 0 q 20 22 40 0 q 20 22 40 0 q 20 22 40 0" fill="none" stroke="${C.ink}" stroke-width="3" opacity=".5"/>
      <path d="M -150 -148 L 0 -250 L 150 -148 Z" fill="${o.roof || "#8c5a30"}" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M -150 -148 L 150 -148" stroke="${C.ink}" stroke-width="5"/>
      <path d="M -110 -148 L -110 -130 M 110 -148 L 110 -130" stroke="${C.ink}" stroke-width="4"/>
      <path d="M -34 -150 L -34 0 L 34 0 L 34 -150 Z" fill="${C.terra}" stroke="${C.ink}" stroke-width="5"/>
      <path d="M 0 -270 v 20" stroke="${C.ink}" stroke-width="4"/>
      <circle cx="0" cy="-272" r="6" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>
    </g>`;
  }

  function tree(x, y, s, o) {
    o = o || {};
    return `<g transform="translate(${x} ${y}) scale(${s})" class="${o.cls || ""}">
      <path d="M -14 0 L -8 -120 L 8 -120 L 14 0 Z" fill="#7a4f2a" stroke="${C.ink}" stroke-width="5"/>
      <circle cx="0" cy="-150" r="58" fill="${o.leaf || C.leaf}" stroke="${C.ink}" stroke-width="5"/>
      <circle cx="-46" cy="-118" r="40" fill="${o.leaf || C.leaf}" stroke="${C.ink}" stroke-width="5"/>
      <circle cx="46" cy="-118" r="40" fill="${o.leaf || C.leaf}" stroke="${C.ink}" stroke-width="5"/>
      <circle cx="0" cy="-150" r="58" fill="url(#t-scales)" opacity=".25"/>
    </g>`;
  }

  /* --------------------------------------------------------------- figure */

  const ARM = {
    namaste: {
      l: "M -58 -330 Q -80 -304 -74 -276 Q -62 -256 -14 -252",
      r: "M 58 -330 Q 80 -304 74 -276 Q 62 -256 14 -252",
      hands: [[-14, -252], [14, -252]],
    },
    cupped: {
      l: "M -58 -330 Q -78 -300 -70 -278 Q -56 -264 -42 -262",
      r: "M 58 -330 Q 78 -300 70 -278 Q 56 -264 42 -262",
      hands: [[-42, -262], [42, -262]],
    },
    soop: {
      l: "M -58 -330 Q -92 -320 -112 -306 L -118 -292",
      r: "M 58 -330 Q 92 -320 112 -306 L 118 -292",
      hands: [[-118, -292], [118, -292]],
    },
    holdR: {
      l: "M -58 -330 Q -80 -294 -76 -250",
      r: "M 58 -330 Q 86 -302 100 -292 L 148 -282",
      hands: [[-76, -248], [148, -282]],
    },
    holdL: {
      l: "M -58 -330 Q -86 -302 -100 -292 L -148 -282",
      r: "M 58 -330 Q 80 -294 76 -250",
      hands: [[-148, -282], [76, -248]],
    },
    offer: {
      l: "M -58 -330 Q -80 -294 -76 -250",
      r: "M 58 -330 Q 84 -334 86 -350 L 96 -388",
      hands: [[-76, -248], [96, -388]],
    },
    bless: {
      l: "M -58 -330 Q -80 -306 -82 -294 L -94 -280",
      r: "M 58 -330 Q 80 -306 82 -294 L 94 -280",
      hands: [[-94, -278], [94, -278]],
    },
    daura: {
      l: "M -58 -330 Q -80 -294 -76 -250",
      r: "M 58 -330 Q 94 -352 82 -376 L 58 -402",
      hands: [[-76, -248], [58, -402]],
    },
    down: {
      l: "M -58 -330 Q -78 -292 -74 -248",
      r: "M 58 -330 Q 78 -292 74 -248",
      hands: [[-74, -246], [74, -246]],
    },
  };

  function woman(o) {
    o = o || {};
    const x = o.x || 0,
      y = o.y || 0,
      s = o.s == null ? 1 : o.s;
    const saree = o.saree || C.verm,
      blouse = o.blouse || C.gold,
      pallu = o.pallu || C.saffron,
      skin = o.skin || C.skin,
      hair = o.hair || C.hair,
      border = o.border || C.gold;
    const p = o.p || "s";
    const arm = ARM[o.pose || "namaste"];
    const child = !!o.child;
    const sleepy = !!o.sleepy;
    const hr = child ? 32 : 36;
    const hcy = child ? -390 : -398;

    const eyes = sleepy
      ? `<path d="M -23 ${hcy - 2} q 10 9 20 0" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/>
         <path d="M 3 ${hcy - 2} q 10 9 20 0" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/>`
      : `<ellipse cx="-13" cy="${hcy - 2}" rx="9" ry="6.2" fill="${C.white}" stroke="${C.ink}" stroke-width="3.2"/>
         <ellipse cx="13" cy="${hcy - 2}" rx="9" ry="6.2" fill="${C.white}" stroke="${C.ink}" stroke-width="3.2"/>
         <circle cx="-12.4" cy="${hcy - 2}" r="4" fill="${C.ink}"/>
         <circle cx="12.4" cy="${hcy - 2}" r="4" fill="${C.ink}"/>
         <circle cx="-11" cy="${hcy - 3.6}" r="1.3" fill="${C.white}"/>
         <circle cx="13.8" cy="${hcy - 3.6}" r="1.3" fill="${C.white}"/>`;

    const brows = sleepy
      ? ""
      : `<path d="M -23 ${hcy - 16} q 10 -6 19 -1" fill="none" stroke="${C.ink}" stroke-width="4.2" stroke-linecap="round"/>
         <path d="M 4 ${hcy - 17} q 10 -5 19 1" fill="none" stroke="${C.ink}" stroke-width="4.2" stroke-linecap="round"/>`;

    const hairShape = `
      <path d="M ${-hr + 1} ${hcy - 14} C ${-hr - 2} ${hcy - 54} ${hr + 2} ${hcy - 54} ${hr - 1} ${hcy - 14}
               C ${hr - 8} ${hcy - 33} ${-hr + 8} ${hcy - 33} ${-hr + 1} ${hcy - 14} Z"
            fill="${hair}" stroke="${C.ink}" stroke-width="4.6" stroke-linejoin="round"/>
      <path d="M 0 ${hcy - 44} L 0 ${hcy - 30}" stroke="${C.ink}" stroke-width="2.4" opacity=".45"/>
      ${child ? "" : `<circle cx="${-hr - 1}" cy="${hcy - 30}" r="14" fill="${hair}" stroke="${C.ink}" stroke-width="4"/>`}`;

    const plaits = child
      ? `<g class="sway">
           <path d="M ${-hr + 7} ${hcy - 2} q -26 34 -22 70 q 2 26 -2 42" fill="none" stroke="${hair}" stroke-width="9" stroke-linecap="round"/>
           <path d="M ${hr - 7} ${hcy - 2} q 26 34 22 70 q -2 26 2 42" fill="none" stroke="${hair}" stroke-width="9" stroke-linecap="round"/>
           <circle cx="${-hr + 5}" cy="${hcy + 108}" r="5.4" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.2"/>
           <circle cx="${hr - 5}" cy="${hcy + 108}" r="5.4" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.2"/>
         </g>`
      : "";

    const hem = 4;
    const skirt = `
      <path d="M -44 -208 L -86 ${hem} Q 0 ${hem + 15} 86 ${hem} L 44 -208 Z"
            fill="${saree}" stroke="${C.ink}" stroke-width="5"/>
      <path d="M -44 -208 L -86 ${hem} Q 0 ${hem + 15} 86 ${hem} L 44 -208 Z"
            fill="url(#${p}-${o.clothPattern || "petals"})" opacity=".28"/>
      <path d="M -86 ${hem + 2} Q 0 ${hem + 17} 86 ${hem + 2}" fill="none" stroke="${border}" stroke-width="11"/>
      <path d="M -86 ${hem + 2} Q 0 ${hem + 17} 86 ${hem + 2}" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".45"/>
      <path d="M -26 -202 L -54 ${hem - 2} M -4 -202 L -8 ${hem} M 18 -200 L 28 ${hem} M 36 -200 L 58 ${hem - 2}"
            stroke="${C.ink}" stroke-width="2.2" opacity=".3" fill="none"/>`;

    const torso = `
      <path d="M -58 -332 C -64 -294 -58 -248 -46 -208 L 46 -208 C 58 -248 64 -294 58 -332 Z"
            fill="${saree}" stroke="${C.ink}" stroke-width="5"/>
      <path d="M -58 -332 C -64 -294 -58 -248 -46 -208 L 46 -208 C 58 -248 64 -294 58 -332 Z"
            fill="url(#${p}-lines)" opacity=".3"/>
      <path d="M -40 -330 L -30 -210 M 40 -330 L 30 -210" stroke="${C.ink}" stroke-width="2" opacity=".2" fill="none"/>`;

    const palluShape = `
      <path d="M -54 -340 C -18 -322 14 -286 40 -240 L 58 -206 L 18 -198 C -6 -246 -34 -282 -66 -310 Z"
            fill="${pallu}" stroke="${C.ink}" stroke-width="4.4"/>
      <path d="M -54 -340 C -18 -322 14 -286 40 -240 L 58 -206 L 18 -198 C -6 -246 -34 -282 -66 -310 Z"
            fill="url(#${p}-petals)" opacity=".35"/>
      <path d="M 58 -206 L 74 -116 L 44 -108 L 18 -198 Z" fill="${pallu}" stroke="${C.ink}" stroke-width="4.4"/>
      <path d="M 74 -116 L 44 -108" stroke="${border}" stroke-width="8"/>
      <path d="M -54 -340 C -18 -322 14 -286 40 -240 L 58 -206" fill="none" stroke="${border}" stroke-width="6"/>
      <path d="M 58 -206 L 18 -198" stroke="${border}" stroke-width="4" opacity=".8"/>`;

    const armsSvg = `
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${arm.l}" stroke="${C.ink}" stroke-width="26"/>
        <path d="${arm.r}" stroke="${C.ink}" stroke-width="26"/>
        <path d="${arm.l}" stroke="${skin}" stroke-width="20"/>
        <path d="${arm.r}" stroke="${skin}" stroke-width="20"/>
        <path d="${arm.l}" stroke="${C.ink}" stroke-width="30" stroke-dasharray="34 999"/>
        <path d="${arm.r}" stroke="${C.ink}" stroke-width="30" stroke-dasharray="34 999"/>
        <path d="${arm.l}" stroke="${blouse}" stroke-width="25" stroke-dasharray="34 999"/>
        <path d="${arm.r}" stroke="${blouse}" stroke-width="25" stroke-dasharray="34 999"/>
      </g>`;

    const hands = arm.hands
      .map(
        (h) => `<circle cx="${h[0]}" cy="${h[1]}" r="13" fill="none" stroke="${C.gold}" stroke-width="4.5"/>
                <circle cx="${h[0]}" cy="${h[1]}" r="10.5" fill="${skin}" stroke="${C.ink}" stroke-width="3.4"/>`
      )
      .join("");

    const necklace = `<path d="M -22 -344 q 22 20 44 0" fill="none" stroke="${C.gold}" stroke-width="5.5" stroke-linecap="round"/>
      <circle cx="0" cy="${-324}" r="4.6" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.8"/>`;

    const inner = `<g transform="translate(${x} ${y}) scale(${s})" class="${o.cls || ""}">
      <g class="${o.bob ? "bob" : ""}">
        <ellipse cx="0" cy="10" rx="98" ry="14" fill="${C.ink}" opacity=".14"/>
        ${skirt}
        ${torso}
        ${palluShape}
        <path d="M -11 -358 h 22 v -22 h -22 z" fill="${skin}" stroke="${C.ink}" stroke-width="4"/>
        ${armsSvg}
        ${hands}
        ${necklace}
        <rect x="-11" y="${hcy + hr - 2}" width="22" height="16" fill="${skin}" stroke="${C.ink}" stroke-width="4"/>
        <ellipse cx="0" cy="${hcy}" rx="${hr}" ry="${hr + 1}" fill="${skin}" stroke="${C.ink}" stroke-width="4.6"/>
        ${hairShape}
        ${o.headscarf ? `<path d="M ${-hr - 4} ${hcy - 2} C ${-hr - 8} ${hcy - 58} ${hr + 8} ${hcy - 58} ${hr + 4} ${hcy - 2}
              C ${hr + 14} ${hcy + 44} ${hr + 40} ${hcy + 96} ${hr + 26} ${hcy + 132}
              L ${hr - 4} ${hcy + 116} C ${hr + 14} ${hcy + 70} ${hr + 2} ${hcy + 24} ${-hr + 2} ${hcy - 8} Z"
              fill="${o.scarf || pallu}" stroke="${C.ink}" stroke-width="4.4"/>
          <path d="M ${-hr - 4} ${hcy - 2} C ${-hr - 8} ${hcy - 58} ${hr + 8} ${hcy - 58} ${hr + 4} ${hcy - 2}" fill="none" stroke="${border}" stroke-width="5"/>` : ""}
        ${plaits}
        ${brows}
        ${eyes}
        <path d="M 0 ${hcy + 7} L 0 ${hcy + 16} q 0 3 -4 4" fill="none" stroke="${C.ink}" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M -10 ${hcy + 27} q 10 8 20 0" fill="${C.verm}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="${hcy - 24}" r="4.4" fill="${C.verm}"/>
        <circle cx="${-hr + 1}" cy="${hcy + 8}" r="5.8" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.2"/>
        <circle cx="${hr - 1}" cy="${hcy + 8}" r="5.8" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.2"/>
      </g>
    </g>`;
    if (o.clipAbove != null) {
      const cid = `clip-${p}-${Math.round(x)}-${Math.round(y)}`;
      return `<defs><clipPath id="${cid}"><rect x="-700" y="${o.clipAbove - 2600}" width="2400" height="2600"/></clipPath></defs>
        <g clip-path="url(#${cid})">${inner}</g>`;
    }
    return inner;
  }

  /* --------------------------------------------------------------- scenes */

  const scenes = [];

  function add(o) {
    scenes.push(o);
  }

  /* 01 — 0:00–0:04  Kelwa ke paat ---------------------------------------- */
  (function () {
    const p = "s1";
    const veins = `
      <g stroke="${C.ivory}" stroke-width="5" stroke-linecap="round" opacity=".85">
        <path d="M0 0 V -1560" stroke-width="9" opacity=".9"/>
      </g>`;
    const body = `
      <rect width="1080" height="1920" fill="${C.leafDark}"/>
      <rect width="1080" height="1920" fill="url(#${p}-petals)" opacity=".2"/>
      ${leaf(360, 1820, 940, 1720, -12, { p, fill: C.leaf, vein: "#e9f0cf", veins: 8, veinW: 5, patternOpacity: 0.18 })}
      ${leaf(820, 1880, 620, 1180, 16, { p, fill: "#4d8b57", vein: "#dbe9bd", veins: 6, veinW: 4.4, patternOpacity: 0.16 })}
      <g stroke="${C.ivory}" fill="none" opacity=".9" class="wave">
        <path d="M120 1500 q 60 -22 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0" stroke-width="7"/>
        <path d="M60 1580 q 60 -20 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0" stroke-width="4" opacity=".6"/>
      </g>
      ${fish(230, 1690, 0.72, C.gold, false, { cls: "drift" })}
      ${fish(880, 1760, 0.58, C.saffron, true, { cls: "drift" })}
      ${lotus(150, 1300, 70, C.pink, { cls: "sway" })}
      ${lotus(930, 1180, 54, C.ivory, { cls: "sway" })}
      <g>
        <circle cx="620" cy="900" r="190" fill="url(#${p}-warm)" class="glowpulse"/>
        <g class="drift">
          <ellipse cx="620" cy="900" rx="80" ry="94" fill="${C.gold}" stroke="${C.ink}" stroke-width="6"/>
          <ellipse cx="596" cy="872" rx="24" ry="30" fill="${C.ivory}" opacity=".7"/>
          <circle cx="620" cy="912" r="40" fill="${C.verm}" stroke="${C.ink}" stroke-width="4.5"/>
          ${rayRing(620, 912, 44, 18, C.saffron, 12, "rayturn")}
          <circle cx="620" cy="912" r="15" fill="${C.gold}"/>
        </g>
      </g>
      <g opacity=".55" stroke="${C.ivory}" stroke-width="3" fill="none">
        <path d="M 300 150 C 360 120 420 120 480 150 C 420 180 360 180 300 150 Z"/>
        <path d="M 780 250 C 830 226 880 226 930 250 C 880 274 830 274 780 250 Z"/>
      </g>
      ${Array.from({ length: 14 }, (_, i) => {
        const x = (i * 173 + 60) % 1000 + 40;
        const y = ((i * 251) % 620) + 90;
        return `<circle cx="${x}" cy="${y}" r="${3 + (i % 3) * 2}" fill="${i % 3 ? C.ivory : C.gold}" opacity=".5" class="twinkle" style="animation-delay:-${(i * 0.4).toFixed(1)}s"/>`;
      }).join("")}
      <circle cx="620" cy="900" r="400" fill="url(#${p}-glow)" opacity=".55"/>`;
    add({
      t0: 0,
      t1: 4,
      title: "Kelwa ke paat",
      cue: "Extreme close-up: banana leaf opens, veins turn into river waves, a golden dew-drop blinks a tiny sun.",
      note: "Pehle second mein visual surprise — drop par sun.",
      svg: svgOpen(p, body, C.leafDark),
    });
  })();

  /* 02 — 0:04–0:09  Gudiya sees the drop -------------------------------- */
  (function () {
    const p = "s2";
    const body = `
      <rect width="1080" height="1920" fill="${C.paper}"/>
      <rect width="1080" height="620" fill="${C.saffron}" opacity=".22"/>
      <circle cx="250" cy="560" r="330" fill="${C.gold}" opacity=".2"/>
      ${sun(250, 560, 190, { p, rays: 0, face: false })}
      <g opacity=".55" fill="none" stroke="${C.ink}" stroke-width="4">
        <path d="M 0 1180 C 260 1120 380 1030 540 1020 C 720 1010 860 1080 1080 1060"/>
        <path d="M 0 1230 C 260 1170 390 1080 540 1070 C 720 1060 870 1130 1080 1110" stroke-dasharray="18 14"/>
      </g>
      <g opacity=".5">
        ${leaf(130, 1170, 320, 520, 24, { p, fill: C.leaf, vein: C.ivory, veins: 5, veinW: 3 })}
      </g>
      <!-- Maa's hand, offering marigolds -->
      <g transform="translate(-40 1180) rotate(-9)">
        <path d="M 0 0 C 90 -26 190 -34 268 -6" fill="none" stroke="${C.ink}" stroke-width="86" stroke-linecap="round"/>
        <path d="M 0 0 C 90 -26 190 -34 268 -6" fill="none" stroke="${C.skin}" stroke-width="70" stroke-linecap="round"/>
        <path d="M 200 -30 C 200 -60 232 -64 240 -30" fill="none" stroke="${C.ink}" stroke-width="6"/>
        <g class="floatup">
          ${[0, 1, 2].map((i) => `<circle cx="${262 + i * 30}" cy="${-44 - (i % 2) * 26}" r="21" fill="${i % 2 ? C.saffron : C.gold}" stroke="${C.ink}" stroke-width="4"/>`).join("")}
        </g>
        <path d="M 226 -78 q 44 -30 92 -6" stroke="${C.leaf}" stroke-width="9" fill="none"/>
      </g>
      ${woman({ x: 610, y: 1980, s: 2.15, pose: "cupped", saree: C.verm, blouse: C.gold, pallu: C.saffron, child: true, p })}
      <g class="drift">
        <circle cx="610" cy="1424" r="180" fill="url(#${p}-glow)" class="glowpulse"/>
        <ellipse cx="610" cy="1424" rx="64" ry="74" fill="${C.gold}" stroke="${C.ink}" stroke-width="6"/>
        <ellipse cx="610" cy="1424" rx="40" ry="48" fill="${C.saffron}" stroke="${C.ink}" stroke-width="3.6"/>
        ${rayRing(610, 1424, 44, 16, C.gold, 12, "rayturn")}
        <circle cx="610" cy="1424" r="16" fill="${C.ivory}" opacity=".9"/>
        <ellipse cx="586" cy="1390" rx="16" ry="20" fill="${C.ivory}" opacity=".8"/>
      </g>
      <g opacity=".9" stroke="${C.ink}" stroke-width="3" fill="none">
        <path d="M 560 1520 l 14 18 M 660 1530 l -12 16" opacity=".35"/>
      </g>
      ${fish(190, 1740, 0.8, C.gold, false, { cls: "drift" })}
      ${lotus(940, 1690, 74, C.pink, { cls: "sway" })}`;
    add({
      t0: 4,
      t1: 9,
      title: "Boond mein suraj",
      cue: "Pull out to Gudiya staring at the drop; the tiny sun sits in her eye. Maa's hand enters with marigolds; the leaf's vein becomes the road to the ghat.",
      note: "Maa ka haath left se — soft, warm, no face needed.",
      svg: svgOpen(p, body, C.paper),
    });
  })();

  /* 03 — 0:09–0:17  Aangan, soop taiyari -------------------------------- */
  (function () {
    const p = "s3";
    const items = `
      <g class="enter" data-at="1.2" style="--p:0">
        <circle cx="-64" cy="-26" r="34" fill="${C.saffron}" stroke="${C.ink}" stroke-width="4"/>
        <circle cx="-64" cy="-26" r="10" fill="url(#${p}-dots)"/>
      </g>
      <g class="enter" data-at="2.0" style="--p:0">
        <ellipse cx="18" cy="-34" rx="19" ry="38" fill="${C.leafLight}" stroke="${C.ink}" stroke-width="4"/>
        <ellipse cx="46" cy="-22" rx="17" ry="32" fill="${C.leaf}" stroke="${C.ink}" stroke-width="4"/>
      </g>
      <g class="enter" data-at="2.8" style="--p:0">
        <circle cx="104" cy="-32" r="30" fill="#8a5a34" stroke="${C.ink}" stroke-width="4"/>
        <path d="M 84 -50 q 20 -12 40 0 M 84 -32 q 20 -12 40 0" stroke="${C.ink}" stroke-width="2.6" fill="none" opacity=".55"/>
      </g>
      <g class="enter" data-at="3.6" style="--p:0">
        <circle cx="-142" cy="-14" r="20" fill="${C.verm}" stroke="${C.ink}" stroke-width="4"/>
        <circle cx="-104" cy="-8" r="20" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
      </g>
      <g class="enter" data-at="4.4" style="--p:0">
        ${lotus(-16, -30, 30, C.pink)}
        ${lotus(66, -40, 22, C.ivory)}
      </g>
      <g class="enter" data-at="5.2" style="--p:0">
        ${fish(-10, 46, 0.36, C.gold, false)}
        ${fish(74, 56, 0.3, C.saffron, true)}
      </g>
      <g class="enter" data-at="6.0" style="--p:0">
        ${lotus(-52, 62, 20, C.saffron)}
      </g>`;

    const body = `
      <rect width="1080" height="1920" fill="${C.mud}"/>
      <rect width="1080" height="1920" fill="url(#${p}-scales)" opacity=".18"/>
      <!-- painted wall band -->
      <rect x="0" y="180" width="1080" height="150" fill="${C.ivory}" stroke="${C.ink}" stroke-width="6"/>
      <g opacity=".9">
        ${fish(180, 255, 0.5, C.verm, false)}
        ${fish(440, 255, 0.5, C.gold, true)}
        ${lotus(680, 300, 34, C.pink)}
        ${fish(880, 255, 0.45, C.leaf, false)}
      </g>
      <rect x="0" y="330" width="1080" height="26" fill="${C.ink}" opacity=".55"/>
      <rect x="0" y="1400" width="1080" height="520" fill="#d99a5a"/>
      <rect x="0" y="1400" width="1080" height="18" fill="${C.ink}"/>
      <g opacity=".5" stroke="${C.ivory}" stroke-width="3" fill="none">
        <path d="M 0 1440 H 1080 M 0 1480 H 1080 M 0 1520 H 1080"/>
      </g>
      <!-- doorway -->
      <g>
        <path d="M 60 1400 L 60 700 Q 60 540 220 540 Q 380 540 380 700 L 380 1400 Z" fill="${C.terra}" stroke="${C.ink}" stroke-width="8"/>
        <path d="M 110 1400 L 110 720 Q 110 600 220 600 Q 330 600 330 720 L 330 1400 Z" fill="${C.indigo}" stroke="${C.ink}" stroke-width="6"/>
        ${diya(220, 960, 0.52, { p })}
        <path d="M 60 700 L 380 700" stroke="${C.ink}" stroke-width="6"/>
      </g>
      <g opacity=".55">
        ${lotus(520, 780, 44, C.verm)}
        ${lotus(720, 880, 34, C.gold)}
        ${fish(880, 720, 0.34, C.ivory, false)}
        ${fish(360, 900, 0.3, C.ivory, true)}
      </g>
      <!-- hanging marigold garland -->
      <g>
        <path d="M 420 120 C 520 260 740 250 900 120" fill="none" stroke="${C.ink}" stroke-width="4"/>
        ${Array.from({ length: 11 }, (_, i) => {
          const t = i / 10;
          const x = 420 + t * 480;
          const yy = 120 + Math.sin(t * Math.PI) * 118;
          return `<circle cx="${x}" cy="${yy + 16}" r="16" fill="${i % 2 ? C.saffron : C.verm}" stroke="${C.ink}" stroke-width="3.5"/>`;
        }).join("")}
      </g>
      <!-- sugarcane -->
      ${Array.from({ length: 4 }, (_, i) => {
        const x = 830 + i * 66;
        return `<g><path d="M ${x} 1420 L ${x - 26} 520" stroke="${i % 2 ? "#7f9a3e" : "#93a94a"}" stroke-width="34"/>
        <path d="M ${x} 1420 L ${x - 26} 520" stroke="${C.ink}" stroke-width="40" opacity=".9" stroke-dasharray="2 999"/>
        <path d="M ${x} 1420 L ${x - 26} 520" stroke="${C.ink}" stroke-width="4" fill="none"/>
        ${[0, 1, 2, 3].map((k) => `<path d="M ${x - k * 7} ${1320 - k * 220} q 46 -34 84 -6" fill="none" stroke="${C.leaf}" stroke-width="8"/>
        <path d="M ${x - k * 7} ${1320 - k * 220} q 46 -34 84 -6" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".4"/>`).join("")}</g>`;
      }).join("")}
      <!-- rangoli -->
      <g transform="translate(540 1700)" opacity=".85">
        <circle r="150" fill="none" stroke="${C.ivory}" stroke-width="6"/>
        <circle r="112" fill="none" stroke="${C.verm}" stroke-width="10" stroke-dasharray="18 16"/>
        ${lotus(0, 6, 78, C.verm)}
      </g>
      ${woman({ x: 300, y: 1490, s: 0.82, pose: "bless", saree: C.verm, blouse: C.gold, pallu: C.saffron, p, bob: true })}
      ${woman({ x: 810, y: 1470, s: 0.78, pose: "bless", saree: C.leaf, blouse: C.gold, pallu: "#e9c26a", hair: "#cfc6b6", p, bob: true })}
      ${woman({ x: 660, y: 1620, s: 0.5, pose: "offer", saree: C.pink, blouse: C.verm, pallu: C.gold, child: true, p })}
      <g transform="translate(560 1300)">
        <rect x="-150" y="0" width="300" height="26" fill="#8a5a34" stroke="${C.ink}" stroke-width="5"/>
        <rect x="-120" y="26" width="26" height="100" fill="#8a5a34" stroke="${C.ink}" stroke-width="5"/>
        <rect x="94" y="26" width="26" height="100" fill="#8a5a34" stroke="${C.ink}" stroke-width="5"/>
        ${soop(0, -20, 380, { p, items, fill: "#e5b15c" })}
      </g>`;
    add({
      t0: 9,
      t1: 17,
      title: "Soop sajta hai",
      cue: "Aangan: Maa and Dadi arrange the soop. Thekua, kela, nariyal, phal, phool — one new thing lands on every vocal beat. Lotus and fish motifs bloom inside the tray.",
      note: "Har beat par ek nayi cheez — seehsa rhythm.",
      svg: svgOpen(p, body, C.mud),
    });
  })();

  /* 04 — 0:17–0:25  Procession to the ghat ------------------------------ */
  (function () {
    const p = "s4";
    const strip = (odd) => `
      <g>
        ${hut(160 + (odd ? 540 : 0), 1420, 0.9)}
        ${tree(480 + (odd ? 200 : 0), 1420, 0.82)}
        ${tree(700 + (odd ? 320 : 0), 1430, 0.6, { leaf: "#356b45" })}
        ${hut(960 + (odd ? 120 : 0), 1424, 0.72)}
        ${tree(60 + (odd ? 700 : 0), 1428, 0.52)}
      </g>`;
    const body = `
      <rect width="1080" height="1920" fill="#f7d9a0"/>
      <rect y="0" width="1080" height="260" fill="#f2a03d"/>
      <rect y="260" width="1080" height="200" fill="#ee8a4a"/>
      <rect y="460" width="1080" height="220" fill="#e4674b"/>
      <rect y="680" width="1080" height="240" fill="#d4553f"/>
      ${sun(760, 900, 150, { p, color: C.gold, rays: 20, face: false })}
      <rect y="900" width="1080" height="1020" fill="#e8c9a2"/>
      <rect y="900" width="1080" height="16" fill="${C.ink}" opacity=".35"/>
      <g class="scrollstrip">${strip(0)}${strip(1)}${strip(0)}</g>
      <!-- field + path -->
      <path d="M 0 1500 C 300 1470 700 1520 1080 1480 L 1080 1920 L 0 1920 Z" fill="#d9a96b"/>
      <path d="M 0 1560 C 320 1520 700 1580 1080 1540" fill="none" stroke="${C.ivory}" stroke-width="8" stroke-dasharray="26 22" opacity=".7"/>
      <g class="wave" opacity=".5">
        <path d="M 0 1640 q 60 -18 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0" fill="none" stroke="${C.leafDark}" stroke-width="6"/>
      </g>
      <!-- vein-path becoming the river -->
      <g opacity=".8">
        <path d="M 0 1900 C 420 1820 760 1740 1080 1600" fill="none" stroke="${C.river}" stroke-width="26" stroke-linecap="round"/>
        <path d="M 0 1900 C 420 1820 760 1740 1080 1600" fill="none" stroke="${C.ivory}" stroke-width="3" stroke-dasharray="16 18"/>
      </g>
      ${woman({ x: 320, y: 1560, s: 0.8, pose: "daura", saree: C.leaf, blouse: C.gold, pallu: "#e9c26a", hair: "#cfc6b6", p, bob: true })}
      <g class="bob">
        ${woman({ x: 520, y: 1580, s: 0.8, pose: "holdR", saree: C.verm, blouse: C.gold, pallu: C.saffron, p })}
      </g>
      ${woman({ x: 700, y: 1610, s: 0.54, pose: "holdL", saree: C.pink, blouse: C.verm, pallu: C.gold, child: true, p, bob: true })}
      <!-- daura on Dadi's head -->
      <g transform="translate(312 1212) rotate(-5)">
        <path d="M -58 0 L 58 0 L 40 -54 L -40 -54 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
        <path d="M -58 0 L 58 0" stroke="${C.ink}" stroke-width="3"/>
        <path d="M -34 -54 q 34 -18 68 0" fill="none" stroke="${C.ink}" stroke-width="3"/>
        <path d="M -20 -30 L 20 -30" stroke="${C.ink}" stroke-width="2" opacity=".4"/>
      </g>
      <g opacity=".8" fill="${C.ink}">
        <path d="M 180 300 q 22 -18 44 0 q -22 -8 -44 0" />
        <path d="M 250 350 q 22 -18 44 0 q -22 -8 -44 0" />
      </g>`;
    add({
      t0: 17,
      t1: 25,
      title: "Ghat ki raah",
      cue: "Side-scrolling walk: Gudiya holds Maa's hand, Dadi balances the daura. Trees and houses loop behind; the leaf-vein road turns into the river bank.",
      note: "Walking loop — chhota dupatta hilta rahe.",
      svg: svgOpen(p, body, "#f7d9a0"),
    });
  })();

  /* 05 — 0:25–0:33  Ghat wide, dusk ------------------------------------- */
  (function () {
    const p = "s5";
    const body = `
      <g class="cam">
      <rect width="1080" height="1920" fill="#f2a03d"/>
      <rect y="0" width="1080" height="240" fill="#f9e0b0"/>
      <rect y="240" width="1080" height="220" fill="#f7c987"/>
      <rect y="460" width="1080" height="220" fill="#f2a03d"/>
      <rect y="680" width="1080" height="200" fill="#e4674b"/>
      <rect y="880" width="1080" height="80" fill="#cf3f2e"/>
      ${sun(520, 940, 200, { p, color: "#f6b53f", faceY: -0.5 })}
      <rect y="960" width="1080" height="960" fill="${C.river}"/>
      ${reflection(520, 1000, 220, 8, C.gold, { gap: 58, width: 15 })}
      <g stroke="${C.ivory}" fill="none" opacity=".45">
        ${Array.from({ length: 8 }, (_, i) => `<path d="M ${40 + i * 40} ${1080 + i * 96} q 80 -20 160 0 t 160 0 t 160 0" stroke-width="${4 + (i % 3)}" opacity="${0.8 - i * 0.06}"/>`).join("")}
      </g>
      ${ghat(880, 1140, 300, { steps: 7, h: 64, inset: 46, c1: "#d9b184", c2: "#e8c9a2" })}
      <!-- diyas along the bank -->
      ${Array.from({ length: 3 }, (_, i) => diya(180 + i * 120, 1320 + (i % 2) * 20, 0.5, { p })).join("")}
      ${diya(700, 1172, 0.44, { p })}
      ${diya(830, 1364, 0.4, { p })}
      ${woman({ x: 720, y: 1332, s: 0.46, pose: "namaste", saree: C.verm, blouse: C.gold, pallu: C.saffron, p })}
      ${woman({ x: 800, y: 1396, s: 0.4, pose: "holdR", saree: C.pink, blouse: C.verm, pallu: C.gold, child: true, p })}
      ${woman({ x: 872, y: 1332, s: 0.42, pose: "soop", saree: C.leaf, blouse: C.gold, pallu: "#e9c26a", hair: "#cfc6b6", p })}
      ${soop(872, 1210, 118, { p, fill: "#e5b15c" })}
      <!-- foreground lotus and fish -->
      ${lotus(940, 1780, 92, C.pink, { cls: "sway" })}
      ${lotus(120, 1840, 74, C.ivory, { cls: "sway" })}
      ${fish(300, 1700, 0.9, C.gold, false, { cls: "drift" })}
      </g>`;
    add({
      t0: 25,
      t1: 33,
      title: "Ghat ka reveal",
      cue: "Wide reveal of the ghat: orange sky, sun mirrored in the water, diyas like golden dots on the bank. Slow push in toward Maa's soop.",
      note: "Camera push — bas thoda, 8% se zyada nahi.",
      svg: svgOpen(p, body, "#f2a03d"),
    });
  })();

  /* 06 — 0:33–0:45  Sandhya arghya (the hold) ---------------------------- */
  (function () {
    const p = "s6";
    const body = `
      <rect width="1080" height="1920" fill="#e4674b"/>
      <rect y="0" width="1080" height="300" fill="#f7c987"/>
      <rect y="300" width="1080" height="260" fill="#f2a03d"/>
      <rect y="560" width="1080" height="240" fill="#e4674b"/>
      <rect y="800" width="1080" height="120" fill="#cf3f2e"/>
      ${sun(540, 980, 330, { p, color: "#f6b53f", faceY: -0.46 })}
      <rect y="980" width="1080" height="940" fill="${C.river}"/>
      ${reflection(540, 1004, 200, 9, C.gold, { gap: 54, width: 16 })}
      <g stroke="${C.ivory}" fill="none" opacity=".4">
        ${Array.from({ length: 7 }, (_, i) => `<path d="M ${-40 + i * 40} ${1180 + i * 92} q 90 -22 180 0 t 180 0 t 180 0 t 180 0" stroke-width="${4 + (i % 3)}"/>`).join("")}
      </g>
      <!-- bank right -->
      <path d="M 700 1400 C 860 1370 980 1380 1080 1400 L 1080 1920 L 700 1920 Z" fill="#d9a96b" stroke="${C.ink}" stroke-width="5"/>
      <path d="M 700 1400 C 860 1370 980 1380 1080 1400" stroke="${C.ink}" stroke-width="5" fill="none"/>
      <path d="M 700 1400 C 860 1370 980 1380 1080 1400 L 1080 1470 C 980 1450 860 1440 700 1470 Z" fill="#c98a5e" opacity=".55"/>
      ${woman({ x: 800, y: 1830, s: 0.72, pose: "namaste", saree: C.leaf, blouse: C.gold, pallu: "#e9c26a", hair: "#d9d2c6", p })}
      ${woman({ x: 950, y: 1880, s: 0.54, pose: "namaste", saree: C.pink, blouse: C.verm, pallu: C.gold, child: true, p, bob: true })}
      <!-- Maa in the water, soop held up -->
      ${woman({ x: 470, y: 1560, s: 0.95, pose: "soop", saree: C.verm, blouse: C.gold, pallu: C.saffron, p, clipAbove: 1362 })}
      <g class="paper-lift">
        ${soop(470, 1284, 240, { p, fill: "#e5b15c", items: `
          <circle cx="-70" cy="-24" r="26" fill="${C.saffron}" stroke="${C.ink}" stroke-width="4"/>
          <circle cx="0" cy="-30" r="26" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
          <circle cx="70" cy="-24" r="26" fill="${C.verm}" stroke="${C.ink}" stroke-width="4"/>
          ${lotus(-28, -50, 26, C.pink)}
        ` })}
      </g>
      <!-- ripples -->
      <g transform="translate(470 1560)" stroke="${C.ivory}" fill="none" stroke-width="4">
        <ellipse rx="80" ry="18" class="ripple" opacity=".7"/>
        <ellipse rx="80" ry="18" class="ripple" opacity=".7" style="animation-delay:-1.4s"/>
        <ellipse rx="80" ry="18" class="ripple" opacity=".7" style="animation-delay:-2.8s"/>
      </g>
      <!-- water motifs -->
      <g opacity=".9">
        ${lotus(220, 1780, 86, C.pink, { cls: "sway" })}
        ${lotus(760, 1810, 60, C.ivory, { cls: "sway" })}
        ${fish(300, 1660, 0.8, C.gold, false, { cls: "drift" })}
        ${fish(640, 1720, 0.6, C.saffron, true, { cls: "drift" })}
      </g>`;
    add({
      t0: 33,
      t1: 45,
      title: "Sandhya arghya",
      cue: "Maa stands in the water and lifts the soop; the setting sun aligns behind it. Dadi and Gudiya fold their hands on the bank. Ripples open into lotus and fish patterns.",
      note: "Long hold — longest note par cut mat karo.",
      svg: svgOpen(p, body, "#e4674b"),
    });
  })();

  /* 07 — 0:45–0:48  Sun sinks ------------------------------------------- */
  (function () {
    const p = "s7";
    const body = `
      <rect width="1080" height="1920" fill="#cf3f2e"/>
      <rect y="0" width="1080" height="280" fill="#6d4a7a"/>
      <rect y="280" width="1080" height="240" fill="#a04f66"/>
      <rect y="520" width="1080" height="220" fill="#cf3f2e"/>
      <rect y="740" width="1080" height="200" fill="#e4674b"/>
      <rect y="940" width="1080" height="140" fill="#f2a03d"/>
      <g class="sink">
        ${sun(540, 1080, 250, { p, color: "#f6b53f", face: false })}
      </g>
      <rect y="1080" width="1080" height="840" fill="#2b5d6b"/>
      ${reflection(540, 1096, 230, 10, C.gold, { gap: 56, width: 16 })}
      <g stroke="${C.ivory}" fill="none" opacity=".35">
        ${Array.from({ length: 8 }, (_, i) => `<path d="M ${-60 + i * 30} ${1160 + i * 88} q 100 -22 200 0 t 200 0 t 200 0 t 200 0 t 200 0" stroke-width="5"/>`).join("")}
      </g>
      <g fill="none" stroke="${C.ink}" stroke-width="4" opacity=".8">
        <path d="M 220 360 q 26 -20 52 0 M 260 392 q 20 -16 40 0 M 780 300 q 30 -22 60 0" />
      </g>
      ${lotus(150, 1820, 80, C.pink, { cls: "sway" })}
      ${fish(840, 1700, 0.8, C.gold, true, { cls: "drift" })}`;
    add({
      t0: 45,
      t1: 48,
      title: "Suraj doobta hai",
      cue: "The sun slides behind the horizon, reflection thinning on the water.",
      note: "Match cut ka pehla half — doobta suraj.",
      svg: svgOpen(p, body, "#cf3f2e"),
    });
  })();

  /* 07b — 0:48–0:51  Diya / night --------------------------------------- */
  (function () {
    const p = "s7b";
    const stars = Array.from({ length: 26 }, (_, i) => {
      const x = (i * 197 + 63) % 1040 + 20;
      const y = ((i * 331) % 1180) + 80;
      return `<g class="twinkle" style="animation-delay:-${(i * 0.37).toFixed(2)}s">
        <path d="M ${x} ${y - 9} L ${x + 3} ${y - 2} L ${x + 10} ${y} L ${x + 3} ${y + 2} L ${x} ${y + 9} L ${x - 3} ${y + 2} L ${x - 10} ${y} L ${x - 3} ${y - 2} Z" fill="${i % 3 ? C.gold : C.ivory}"/>
      </g>`;
    }).join("");
    const body = `
      <rect width="1080" height="1920" fill="${C.night}"/>
      <rect y="0" width="1080" height="520" fill="#151d3d"/>
      <rect y="520" width="1080" height="420" fill="${C.indigo}"/>
      <rect y="940" width="1080" height="200" fill="#1d2a4d"/>
      ${stars}
      <circle cx="880" cy="260" r="86" fill="${C.ivory}" opacity=".9"/>
      <circle cx="906" cy="246" r="78" fill="#151d3d"/>
      <path d="M 0 1220 L 180 1150 L 360 1210 L 540 1140 L 740 1210 L 900 1150 L 1080 1210 L 1080 1920 L 0 1920 Z" fill="#0a0f22"/>
      <g stroke="${C.gold}" stroke-width="4" fill="none" opacity=".55">
        <path d="M 80 1320 q 60 -24 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0"/>
        <path d="M 20 1400 q 60 -22 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0"/>
      </g>
      <g transform="translate(540 1450)">
        <circle cx="0" cy="0" r="300" fill="${C.gold}" opacity=".12" class="glowpulse"/>
        ${diya(0, 0, 3.4, { p })}
      </g>
      ${lotus(150, 1720, 88, C.verm, { cls: "sway" })}
      ${lotus(930, 1760, 66, C.saffron, { cls: "sway" })}
      ${fish(300, 1620, 0.7, C.gold, false, { cls: "drift" })}`;
    add({
      t0: 48,
      t1: 51,
      title: "Diya ban jata hai",
      cue: "Match cut: the sinking sun becomes the flame of a diya. Indigo night, stars switching on one by one in a Madhubani border.",
      note: "Sun → diya flame: exact same position, exact same size.",
      svg: svgOpen(p, body, C.night),
    });
  })();

  /* 08 — 0:51–0:59  Pre-dawn walk --------------------------------------- */
  (function () {
    const p = "s8";
    const strip = (odd) => `
      <g>
        ${hut(160 + (odd ? 540 : 0), 1420, 0.9, { wall: "#8a5a52", roof: "#5c3a3f" })}
        ${tree(480 + (odd ? 200 : 0), 1420, 0.8, { leaf: "#37566b" })}
        ${tree(700 + (odd ? 320 : 0), 1430, 0.58, { leaf: "#2f4a5e" })}
        ${hut(960 + (odd ? 120 : 0), 1424, 0.72, { wall: "#8a5a52", roof: "#5c3a3f" })}
        ${tree(60 + (odd ? 700 : 0), 1428, 0.5, { leaf: "#31505f" })}
      </g>`;
    const stars = Array.from({ length: 18 }, (_, i) => {
      const x = (i * 271 + 41) % 1040 + 20;
      const y = ((i * 173) % 520) + 80;
      return `<circle cx="${x}" cy="${y}" r="${2 + (i % 3)}" fill="${C.ivory}" class="twinkle" style="animation-delay:-${(i * 0.4).toFixed(2)}s" opacity=".8"/>`;
    }).join("");
    const body = `
      <rect width="1080" height="1920" fill="#4b3a66"/>
      <rect y="0" width="1080" height="380" fill="#212a4e"/>
      <rect y="380" width="1080" height="260" fill="#4b3a66"/>
      <rect y="640" width="1080" height="140" fill="#8a5470"/>
      <rect y="780" width="1080" height="120" fill="#c9746f"/>
      ${stars}
      <circle cx="220" cy="250" r="62" fill="${C.ivory}" opacity=".92"/>
      <circle cx="244" cy="238" r="56" fill="#212a4e"/>
      <rect y="900" width="1080" height="1020" fill="#8b7896"/>
      <g class="scrollstrip">${strip(0)}${strip(1)}${strip(0)}</g>
      <path d="M 0 1500 C 300 1470 700 1520 1080 1480 L 1080 1920 L 0 1920 Z" fill="#7a6887"/>
      <path d="M 0 1560 C 320 1520 700 1580 1080 1540" fill="none" stroke="${C.ivory}" stroke-width="8" stroke-dasharray="26 22" opacity=".45"/>
      ${woman({ x: 320, y: 1560, s: 0.8, pose: "offer", saree: "#3d5a72", blouse: C.gold, pallu: "#8fa3b8", hair: "#d9d2c6", p, bob: true })}
      ${woman({ x: 520, y: 1580, s: 0.8, pose: "holdR", saree: "#9a4a5e", blouse: C.gold, pallu: "#c98a5e", p, bob: true })}
      ${woman({ x: 700, y: 1610, s: 0.56, pose: "holdL", saree: C.pink, blouse: C.verm, pallu: C.gold, child: true, sleepy: true, p, bob: true })}
      <g opacity=".7">
        <path d="M 0 1900 C 420 1820 760 1740 1080 1600" fill="none" stroke="#2b5f74" stroke-width="24" stroke-linecap="round"/>
        <path d="M 0 1900 C 420 1820 760 1740 1080 1600" fill="none" stroke="${C.ivory}" stroke-width="3" stroke-dasharray="16 18"/>
      </g>
      ${lotus(150, 1800, 70, "#b06a86", { cls: "sway" })}
      ${fish(900, 1810, 0.7, "#c9a06a", true, { cls: "drift" })}`;
    add({
      t0: 51,
      t1: 59,
      title: "Neend mein subah",
      cue: "Pre-dawn return walk. Same shot as the evening, same rhythm — but the sky climbs from deep blue to violet to saffron. Gudiya walks half asleep, one flower in her hand.",
      note: "Repeat exact camera — shaam-subah ka connection.",
      svg: svgOpen(p, body, "#4b3a66"),
    });
  })();

  /* 09 — 0:59–1:10  Usha arghya ----------------------------------------- */
  (function () {
    const p = "s9";
    const body = `
      <rect width="1080" height="1920" fill="#2b2a52"/>
      <rect y="0" width="1080" height="280" fill="${C.indigo}"/>
      <rect y="280" width="1080" height="240" fill="#4b3a66"/>
      <rect y="520" width="1080" height="200" fill="#8a5470"/>
      <rect y="720" width="1080" height="180" fill="#d97a6a"/>
      <rect y="900" width="1080" height="120" fill="#f2a03d"/>
      <g class="ray-sweep">
        ${sun(540, 1020, 320, { p, color: "#f6b53f", faceY: -0.42 })}
      </g>
      <rect y="1020" width="1080" height="900" fill="#356f78"/>
      ${reflection(540, 1046, 250, 10, C.gold, { gap: 54, width: 17 })}
      <!-- the first ray spreading gold patterns on water -->
      <path d="M 540 1020 L 1080 1560 L 1080 1920 L 300 1920 Z" fill="${C.gold}" opacity=".18" class="ray-sweep"/>
      <g stroke="${C.ivory}" fill="none" opacity=".4">
        ${Array.from({ length: 7 }, (_, i) => `<path d="M ${-60 + i * 34} ${1180 + i * 88} q 100 -22 200 0 t 200 0 t 200 0 t 200 0 t 200 0" stroke-width="5"/>`).join("")}
      </g>
      <!-- gold Madhubani pattern rising on the water -->
      <g opacity=".9">
        ${fish(250, 1720, 1.0, C.gold, false, { cls: "drift" })}
        ${fish(800, 1800, 0.78, C.saffron, true, { cls: "drift" })}
        ${lotus(600, 1810, 86, C.gold, { cls: "sway" })}
        ${lotus(120, 1600, 60, C.saffron, { cls: "sway" })}
      </g>
      <!-- reflection Gudiya is looking at -->
      <g transform="translate(300 1660)">
        <ellipse rx="170" ry="60" fill="${C.gold}" opacity=".3" class="glowpulse"/>
        <circle r="66" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
        ${rayRing(0, 0, 70, 26, C.saffron, 16, "rayturn")}
        <ellipse rx="150" ry="52" fill="none" stroke="${C.ivory}" stroke-width="3" opacity=".7" class="ripple"/>
      </g>
      ${woman({ x: 330, y: 1520, s: 0.68, pose: "namaste", saree: C.pink, blouse: C.verm, pallu: C.gold, child: true, p })}
      ${woman({ x: 800, y: 1520, s: 0.9, pose: "soop", saree: C.verm, blouse: C.gold, pallu: C.saffron, p, clipAbove: 1332 })}
      <g transform="translate(800 1332)" stroke="${C.ivory}" fill="none" stroke-width="3.5" opacity=".8">
        <ellipse rx="110" ry="22" class="ripple"/>
        <ellipse rx="110" ry="22" class="ripple" style="animation-delay:-2s"/>
      </g>
      <g class="paper-lift">
        ${soop(800, 1257, 236, { p, fill: "#e5b15c", items: `<circle cx="-60" cy="-24" r="24" fill="${C.saffron}" stroke="${C.ink}" stroke-width="4"/>
          <circle cx="10" cy="-30" r="24" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
          ${lotus(70, -26, 24, C.pink)}` })}
      </g>
      ${woman({ x: 950, y: 1560, s: 0.56, pose: "namaste", saree: C.leaf, blouse: C.gold, pallu: "#e9c26a", hair: "#d9d2c6", p })}`;
    add({
      t0: 59,
      t1: 70,
      title: "Usha arghya",
      cue: "Maa lifts the soop again. The first ray breaks the horizon and runs across the water, leaving golden Madhubani patterns. Gudiya sees the full sun where the small drop once was.",
      note: "Opening ki boond = closing ka suraj.",
      svg: svgOpen(p, body, "#2b2a52"),
    });
  })();

  /* 10 — 1:10–1:13  Title ---------------------------------------------- */
  (function () {
    const p = "s10";
    const body = `
      <rect width="1080" height="1920" fill="${C.ivory}"/>
      <rect x="40" y="40" width="1000" height="1840" fill="none" stroke="${C.ink}" stroke-width="6"/>
      <rect x="62" y="62" width="956" height="1796" fill="none" stroke="${C.verm}" stroke-width="3"/>
      ${sun(540, 760, 330, { p, color: C.gold, face: false })}
      <g opacity=".55">
        <circle cx="540" cy="760" r="232" fill="none" stroke="${C.verm}" stroke-width="3" stroke-dasharray="4 16"/>
        <circle cx="540" cy="760" r="150" fill="none" stroke="${C.ivory}" stroke-width="4" opacity=".8"/>
        ${Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return `<circle cx="${(540 + Math.cos(a) * 190).toFixed(1)}" cy="${(760 + Math.sin(a) * 190).toFixed(1)}" r="7" fill="${C.verm}"/>`;
        }).join("")}
      </g>
      <g opacity=".25">
        ${Array.from({ length: 40 }, (_, i) => {
          const t = i / 40;
          return `<circle cx="${110 + (i * 137) % 860}" cy="${1180 + ((i * 211) % 620)}" r="${4 + (i % 4) * 3}" fill="${i % 2 ? C.gold : C.verm}"/>`;
        }).join("")}
      </g>
      <g transform="translate(0 60)">
        ${woman({ x: 330, y: 1640, s: 0.78, pose: "namaste", saree: C.verm, blouse: C.gold, pallu: C.saffron, p })}
        ${woman({ x: 540, y: 1620, s: 0.78, pose: "namaste", saree: C.leaf, blouse: C.gold, pallu: "#e9c26a", hair: "#d9d2c6", p })}
        ${woman({ x: 730, y: 1680, s: 0.6, pose: "namaste", saree: C.pink, blouse: C.verm, pallu: C.gold, child: true, p })}
      </g>
      <path d="M 90 1500 q 450 -60 900 0" fill="none" stroke="${C.verm}" stroke-width="5" stroke-dasharray="16 14"/>
      ${lotus(140, 1800, 72, C.pink, { cls: "sway" })}
      ${lotus(940, 1800, 72, C.pink, { cls: "sway" })}`;
    add({
      t0: 70,
      t1: 73,
      title: "Teen peedhiyan",
      cue: "Maa, Dadi and Gudiya fold their hands in one frame. Title: “छठ — आस्था की रोशनी, पीढ़ी-दर-पीढ़ी”.",
      note: "Text overlay HTML mein — clean mode mein bhi dikhega.",
      titleCard: true,
      svg: svgOpen(p, body, C.ivory),
    });
  })();

  /* 10b — 1:13–1:15  Seamless loop ------------------------------------- */
  (function () {
    const p = "s10b";
    const body = `
      <rect width="1080" height="1920" fill="${C.leafDark}"/>
      <rect width="1080" height="1920" fill="url(#${p}-petals)" opacity=".18"/>
      ${leaf(360, 1820, 940, 1720, -12, { p, fill: C.leaf, vein: "#e9f0cf", veins: 8, veinW: 5, patternOpacity: 0.18 })}
      ${leaf(820, 1880, 620, 1180, 16, { p, fill: "#4d8b57", vein: "#dbe9bd", veins: 6, veinW: 4.4, patternOpacity: 0.16 })}
      <g stroke="${C.ivory}" fill="none" opacity=".85" class="wave">
        <path d="M120 1500 q 60 -22 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0" stroke-width="7"/>
      </g>
      <g class="collapse">
        ${sun(620, 900, 150, { p, color: C.gold, face: true })}
      </g>
      <g>
        <circle cx="620" cy="900" r="74" fill="${C.gold}" opacity=".3" class="glowpulse"/>
        <ellipse cx="620" cy="900" rx="74" ry="86" fill="${C.gold}" stroke="${C.ink}" stroke-width="6"/>
        <ellipse cx="600" cy="876" rx="22" ry="28" fill="${C.ivory}" opacity=".7"/>
      </g>
      ${fish(230, 1690, 0.72, C.gold, false, { cls: "drift" })}
      ${lotus(150, 1300, 70, C.pink, { cls: "sway" })}`;
    add({
      t0: 73,
      t1: 75,
      title: "Loop",
      cue: "The great sun folds back into a single golden drop on the banana leaf — the exact opening frame, ready to loop.",
      note: "Aakhri 2 second = pehle 2 second. Seamless.",
      svg: svgOpen(p, body, C.leafDark),
    });
  })();

  global.REEL_KIT = { C, defs, svgOpen, sun, leaf, lotus, fish, diya, soop, ghat, hut, tree, woman };
  global.REEL_SCENES = scenes;
  global.REEL_TOTAL = scenes[scenes.length - 1].t1;
})(typeof window !== "undefined" ? window : globalThis);
