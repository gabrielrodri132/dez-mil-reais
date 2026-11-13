/* ===== Episode 2 "A devolução" — scenes (appended after base.js helpers) ===== */
const L_SK = CAST.lucas.skin;

/* ---------- ep2 helpers ---------- */
function rain2(t, n = 46, o = {}) { return rain(t, n, Object.assign({ w: 2.3, len: 30, o: .38 }, o)); }
function strobe(t) { // police light phase: 1 = red, -1 = blue
  const ph = (t * 2.4) % 1; return ph < .5 ? Math.max(0, Math.sin(ph * 2 * Math.PI)) : -Math.max(0, Math.sin((ph - .5) * 2 * Math.PI));
}
function policeGlow(t, op = .5, cx = 300, cy = 120) {
  const s = strobe(t);
  const red = Math.max(0, s), blue = Math.max(0, -s);
  return `<circle cx="${cx}" cy="${cy}" r="320" fill="#ff1f3d" opacity="${f(red * op * 100) / 100}" style="mix-blend-mode:screen" filter="url(#fSoft)"/>` +
    `<circle cx="${360 - cx}" cy="${cy}" r="320" fill="#2b6dff" opacity="${f(blue * op * 100) / 100}" style="mix-blend-mode:screen" filter="url(#fSoft)"/>`;
}
function dropsGlass(t, n, seed = 1) {
  let s = `<g>`;
  for (let i = 0; i < n; i++) {
    const x = hash(i * 3 + seed) * 380 - 10, y0 = hash(i * 5 + seed) * 700 - 30, v = hash(i * 7 + seed);
    const y = v > .7 ? (y0 + t * 40 * v) % 680 - 20 : y0, r = 2 + hash(i * 11 + seed) * 5;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * .8)}" ry="${f(r)}" fill="#cfe2ff" opacity=".22"/><ellipse cx="${f(x - r * .25)}" cy="${f(y - r * .3)}" rx="${f(r * .25)}" ry="${f(r * .3)}" fill="#fff" opacity=".45"/>`;
  }
  return s + `</g>`;
}
let NOTITLE = false;
function bigTitle(text, p, o = {}) {
  if (p <= 0 || NOTITLE) return "";
  const y = o.y ?? 150, sz = o.size || 30, sc = eback(clamp(p * 1.5)), col = o.col || "#ff3b3b";
  const lines = text.split("|");
  let g = `<g transform="translate(180 ${y}) scale(${f(sc * 100) / 100}) rotate(${o.rot ?? -2})">`;
  lines.forEach((l, i) => {
    g += txt(0, i * sz * 1.08, l, { size: sz, fill: i === lines.length - 1 && o.two ? o.two : col, stroke: "#000", sw: 8, ls: .5 });
  });
  return g + `</g>`;
}
function note200(x, y, rot, s, op = 1) {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})" opacity="${op}">` +
    `<rect x="-52" y="-25" width="104" height="50" rx="3" fill="#c9884a" stroke="${OL}" stroke-width="2"/><rect x="-47" y="-20" width="94" height="40" rx="2" fill="none" stroke="#f0c48f" stroke-width="1.4"/>` +
    `<ellipse cx="-20" cy="2" rx="14" ry="12" fill="#a8652e"/><path d="M-30 -4 l6 -8 l4 6 l4 -6 l6 8" fill="#8a4c1e"/>` +
    `<text x="24" y="8" font-family="${FONT}" font-weight="900" font-size="20" fill="#fff4e4" text-anchor="middle">200</text>` +
    `<text x="-42" y="-10" font-family="${FONT}" font-weight="700" font-size="7" fill="#fff0dc">R$</text></g>`;
}
function wallet2(x, y, rot, s, o = {}) {
  // open wallet holding R$200 notes; o.cash 0..1 how many notes visible, o.flip for counting motion
  let g = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})">`;
  const n = Math.round((o.cash ?? 1) * 7);
  for (let i = 0; i < n; i++) {
    const lift = o.flip ? Math.max(0, Math.sin((o.flip * 3 - i * .35) * Math.PI)) * 22 : 0;
    g += note200(-6 + (i - 3) * 8, -78 + i * 2 - lift, (i - 3) * 5 - lift * .4, .92);
  }
  g += `<rect x="-112" y="-70" width="112" height="140" rx="10" fill="#1a1715" stroke="${OL}" stroke-width="2.6"/><rect x="-104" y="-62" width="96" height="124" rx="7" fill="none" stroke="#3b3632" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  g += `<rect x="-98" y="-40" width="84" height="52" rx="4" fill="#c9d8e2" opacity=".9" filter="url(#fBlur)"/>`;
  if (o.photoPeek) g += `<g transform="translate(-56 ${f(30 - o.photoPeek * 60)}) rotate(${f(-6 * o.photoPeek)})">${halfPhotoFront(.42)}</g>`;
  g += `<rect x="-98" y="24" width="84" height="9" rx="3" fill="#2a2522"/><rect x="-98" y="40" width="84" height="9" rx="3" fill="#2a2522"/>`;
  g += `<rect x="0" y="-70" width="112" height="140" rx="10" fill="#221e1b" stroke="${OL}" stroke-width="2.6"/><rect x="8" y="-62" width="96" height="124" rx="7" fill="none" stroke="#3b3632" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  return g + "</g>";
}
function hardHat(cx, cy, s) {
  return `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-62 -40 C-62 -112 62 -112 62 -40 Z" fill="#f2c230" stroke="${OL}" stroke-width="3"/><rect x="-74" y="-46" width="148" height="12" rx="6" fill="#e0ae1f" stroke="${OL}" stroke-width="3"/><path d="M-8 -104 h16 v58 h-16 Z" fill="#ffd95a" opacity=".7"/></g>`;
}
// torn half photo of Antônio (front), size ~ 120x150 at scale 1
function halfPhotoFront(s = 1, o = {}) {
  const id = uid("ph");
  let g = `<g transform="scale(${s})">`;
  const torn = "M-70 -86 L58 -86 L52 -60 L62 -36 L50 -10 L60 16 L48 40 L58 64 L50 86 L-70 86 Z";
  g += `<clipPath id="${id}"><path d="${torn}"/></clipPath>`;
  g += `<path d="${torn}" fill="#f4ecd8" stroke="#5a4a36" stroke-width="2"/>`;
  g += `<g clip-path="url(#${id})"><rect x="-64" y="-80" width="140" height="150" fill="#9fb7c9"/>`;
  g += `<rect x="-64" y="-80" width="140" height="56" fill="#c7d6df"/><rect x="-60" y="-70" width="140" height="34" fill="#264d73" stroke="#173350" stroke-width="2"/>`;
  g += `<text x="-6" y="-46" font-family="${FONT}" font-weight="900" font-size="20" fill="#fff" text-anchor="middle">SILVA &amp;</text>`;
  g += `<rect x="-64" y="40" width="140" height="40" fill="#8a7a62"/>`;
  g += `<g transform="translate(-6 30) scale(.42)">${charBust("anto", 0, 0, 1, { top: "teeDry", smile: .7, smileEyes: .3, t: 0, autoBlink: false })}${hardHat(0, -10, 1)}</g>`;
  g += `<rect x="-64" y="-80" width="140" height="150" fill="#d6a85c" opacity=".22" style="mix-blend-mode:multiply"/></g>`;
  g += `<path d="${torn}" fill="none" stroke="#f4ecd8" stroke-width="6" opacity=".9"/>`;
  return g + `</g>`;
}
function halfPhotoBack(s = 1) {
  const torn = "M70 -86 L-58 -86 L-52 -60 L-62 -36 L-50 -10 L-60 16 L-48 40 L-58 64 L-50 86 L70 86 Z";
  return `<g transform="scale(${s})"><path d="${torn}" fill="#efe6d0" stroke="#5a4a36" stroke-width="2"/>` +
    `<path d="M-40 -60 h90 M-40 -40 h70" stroke="#d9cfb7" stroke-width="2"/>` +
    `<text x="6" y="12" font-family="'DejaVu Serif', serif" font-style="italic" font-weight="700" font-size="22" fill="#c4121f" text-anchor="middle" transform="rotate(-6)">14/03/2006</text></g>`;
}
function handcuffs(x, y, s, open = 0) {
  const ring = (cx, rot) => `<g transform="translate(${cx} ${f(-open * 26)}) rotate(${rot})"><ellipse rx="35" ry="13" fill="none" stroke="#2a2d33" stroke-width="12"/><ellipse rx="35" ry="13" fill="none" stroke="#c9ced6" stroke-width="7"/><path d="M-22 -10 q22 -6 44 0" stroke="#fff" stroke-width="2.6" fill="none" opacity=".85"/><rect x="26" y="-8" width="14" height="16" rx="3" fill="#aab1bb" stroke="#2a2d33" stroke-width="2"/></g>`;
  let chain = ""; for (let i = 0; i < 4; i++) chain += `<ellipse cx="${-17 + i * 11}" cy="${f(2 + Math.sin(i * 1.7) * 2)}" rx="6" ry="4" fill="none" stroke="#c9ced6" stroke-width="3"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${ring(-50, 8 - open * 30)}${ring(50, -8 + open * 30)}${chain}</g>`;
}
function wrists(x, y, s, sleeve = "#4f8279", cuffs = true, open = 0) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
  g += handG(-52, -8, 8, 1, L_SK, sleeve, { fist: true }) + handG(52, -8, -8, 1, L_SK, sleeve, { fist: true });
  if (cuffs) g += handcuffs(0, 36, 1, open);
  return g + `</g>`;
}
function carInterior(t, o = {}) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#05070c"/>`;
  s += `<path d="M-40 60 L400 40 L400 420 L-40 440 Z" fill="${o.day ? "#5d6774" : "#0d1622"}"/>`; // window
  s += houses(t * 3, 400, 7, 120, 31, .8, o.day ? ["#7b8591", "#6c7580", "#8a929c"] : ["#101826", "#141e2e", "#0c1320"]);
  s += policeGlow(t, o.day ? .25 : .55, 300, 200);
  s += dropsGlass(t, 34, 4);
  s += `<path d="M-40 -40 L400 -40 L400 50 L-40 70 Z M-40 430 L400 410 L400 680 L-40 680 Z" fill="#0a0c10"/>`;
  s += `<path d="M-40 434 L400 414" stroke="#1d2129" stroke-width="10"/>`;
  return s;
}
function homeRoom(t) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#3d4650"/>`;
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#2b323a" opacity=".5"/>`;
  s += `<path d="M230 -40 C220 60 260 90 240 160 C230 200 260 220 250 260" stroke="#2a2f35" stroke-width="22" fill="none" opacity=".45"/>`; // water stain
  s += `<rect x="60" y="80" width="90" height="100" fill="#152033" stroke="#59616a" stroke-width="6"/><path d="M105 80 v100 M60 130 h90" stroke="#59616a" stroke-width="4"/>`;
  s += `<svg x="60" y="80" width="90" height="100" viewBox="0 0 360 400" preserveAspectRatio="xMidYMid slice">${rain(t, 40, { o: .5, len: 40, w: 4, seed: 41 })}</svg>`;
  s += `<line x1="200" y1="-40" x2="200" y2="40" stroke="#111" stroke-width="2"/><circle cx="200" cy="46" r="8" fill="#ffe2a6"/><circle cx="200" cy="46" r="120" fill="url(#gLamp)" opacity=".55"/>`;
  s += `<rect x="-40" y="520" width="440" height="200" fill="#3a3029"/>`;
  return s;
}
function bucket(x, y, t) {
  const k = (t * .9) % 1;
  return `<g transform="translate(${x} ${y})"><path d="M-22 -30 L22 -30 L18 10 L-18 10 Z" fill="#3b78a8" stroke="${OL}" stroke-width="2"/><ellipse cy="-30" rx="22" ry="5" fill="#1d3d56" stroke="${OL}" stroke-width="2"/>` +
    `<ellipse cx="0" cy="${f(-300 + k * 270)}" rx="2.4" ry="4" fill="#bfe0ff" opacity="${k < .97 ? .9 : 0}"/>` +
    (k > .9 ? `<ellipse cy="-30" rx="${f(4 + (k - .9) * 120)}" ry="2" fill="none" stroke="#bfe0ff" stroke-width="1.2" opacity=".8"/>` : "") + `</g>`;
}
function envelope(x, y, rot, s, hl = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-70" y="-40" width="140" height="80" fill="#f1ead8" stroke="${OL}" stroke-width="2.4"/><path d="M-70 -40 L0 8 L70 -40" fill="none" stroke="#c9bfa6" stroke-width="2.4"/>` +
    `<rect x="-64" y="12" width="128" height="22" fill="#b3261e"/>` + txt(0, 28, "HORIZONTE", { size: 13, fill: "#fff" }) +
    (hl > 0 ? `<ellipse cx="0" cy="23" rx="${f(lerp(110, 80, eo(hl)))}" ry="22" fill="none" stroke="#ff3b3b" stroke-width="5" opacity="${f(eo(hl) * 100) / 100}"/>` : "") + `</g>`;
}
function bed(x, y) {
  return `<g transform="translate(${x} ${y})"><rect x="-150" y="0" width="300" height="200" fill="#6a5a4e" stroke="${OL}" stroke-width="2.4"/><path d="M-150 0 C-90 -24 90 -24 150 0 L150 60 L-150 60 Z" fill="#8a9bb3" stroke="${OL}" stroke-width="2.4"/><path d="M-120 10 q40 -10 80 0 M10 6 q50 -10 100 2" stroke="#6e7f97" stroke-width="3" fill="none"/></g>`;
}
function portrait(x, y, s, older = true) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-44" y="-56" width="88" height="112" fill="#7a5a2e" stroke="${OL}" stroke-width="3"/><rect x="-36" y="-48" width="72" height="96" fill="#c2cdd6"/>` +
    `<svg x="-36" y="-48" width="72" height="96" viewBox="-60 -90 120 160">${charBust("anto", 0, 0, .55, { top: "shirt", smile: .4, t: 0, autoBlink: false, override: older ? { mustache: "#2a1d16" } : {} })}</svg>` +
    `<rect x="-36" y="-48" width="72" height="96" fill="#d6a85c" opacity=".18"/><path d="M-44 56 l-14 20 M44 56 l14 20" stroke="#5a4020" stroke-width="5"/></g>`;
}
function hallBg(t, o = {}) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#d9ccb4"/>`;
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#9fb3c6" opacity=".22"/>`; // cold morning
  for (let i = 0; i < 4; i++) s += `<rect x="${i * 120 - 30}" y="20" width="22" height="560" fill="#c8b897"/><rect x="${i * 120 - 34}" y="20" width="30" height="12" fill="#b8a581"/>`;
  s += `<rect x="40" y="70" width="80" height="150" fill="#b9c8d6" stroke="#9e8c6b" stroke-width="5"/><path d="M80 70 v150 M40 145 h80" stroke="#9e8c6b" stroke-width="3"/>`;
  // staircase on the right
  s += `<path d="M220 600 L400 260 L400 600 Z" fill="#c4b393"/>`;
  for (let i = 0; i < 9; i++) { const yy = 600 - i * 38, xx = 220 + i * 20; s += `<path d="M${xx} ${yy} L400 ${yy} L400 ${yy - 6} L${xx + 4} ${yy - 6} Z" fill="#e8dcc4" stroke="#a89474" stroke-width="1"/>`; }
  s += `<path d="M212 560 L392 220" stroke="#5a4020" stroke-width="7"/>`;
  for (let i = 0; i < 9; i++) s += `<line x1="${224 + i * 20}" y1="${f(538 - i * 38)}" x2="${224 + i * 20}" y2="${f(590 - i * 38)}" stroke="#5a4020" stroke-width="3"/>`;
  s += `<rect x="-40" y="560" width="440" height="160" fill="url(#gMarble)"/><path d="M-40 600 L400 640 M100 560 L40 700" stroke="#fff" stroke-width="2" opacity=".35"/>`;
  if (o.isa) s += isaSilhouette(o.isa);
  return s;
}
function isaSilhouette(op) {
  return `<g transform="translate(350 236)" opacity="${op}" filter="url(#fBlur)"><path d="M-14 0 C-16 -30 -10 -44 0 -46 C10 -44 16 -30 14 0 L16 40 L-16 40 Z" fill="#7c6ca6"/><circle cx="0" cy="-56" r="11" fill="#f3cfae"/><path d="M-12 -62 C-14 -40 -16 -24 -14 -16 M12 -62 C14 -40 16 -24 14 -16" stroke="#6b3f22" stroke-width="7"/></g>`;
}
function aparador(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="0" width="300" height="22" fill="#5a3b20" stroke="${OL}" stroke-width="2.4"/><rect x="-140" y="22" width="12" height="140" fill="#4a3018"/><rect x="128" y="22" width="12" height="140" fill="#4a3018"/>` +
    `<path d="M80 0 C70 -40 76 -70 92 -80 C108 -70 114 -40 104 0 Z" fill="#e8e2d6" stroke="${OL}" stroke-width="2"/><path d="M92 -80 q-20 -40 -30 -60 M92 -80 q10 -50 26 -70 M92 -80 q0 -40 -6 -76" stroke="#3e6b42" stroke-width="3" fill="none"/>` +
    `<g transform="translate(-70 -6)"><ellipse rx="22" ry="5" fill="#c9a04a"/><path d="M-12 -2 l6 -10 l10 4 l8 -6" stroke="#8a8f99" stroke-width="3" fill="none"/></g></g>`;
}
function policeCar(x, y, s, t) {
  const st = strobe(t);
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 0 L-110 -40 L-60 -70 L60 -70 L104 -40 L124 0 Z" fill="#f2f2f2" stroke="${OL}" stroke-width="3"/>` +
    `<path d="M-52 -64 L-28 -40 L28 -40 L52 -64 Z" fill="#1d2a3a"/><rect x="-124" y="-40" width="248" height="38" rx="6" fill="#111" stroke="${OL}" stroke-width="3"/><rect x="-124" y="-24" width="248" height="6" fill="#f2f2f2"/>` +
    `<text x="0" y="-8" font-family="${FONT}" font-weight="900" font-size="13" fill="#f2f2f2" text-anchor="middle">POLÍCIA</text>` +
    `<rect x="-30" y="-82" width="30" height="12" rx="4" fill="${st > 0 ? "#ff2a3d" : "#5a1018"}"/><rect x="0" y="-82" width="30" height="12" rx="4" fill="${st < 0 ? "#2b6dff" : "#10224a"}"/>` +
    `<circle cx="-78" cy="2" r="20" fill="#111" stroke="#333" stroke-width="4"/><circle cx="80" cy="2" r="20" fill="#111" stroke="#333" stroke-width="4"/></g>`;
}
function redHeels(x, y, s, t, wet = 1) {
  const shoe = (dx, rot) => `<g transform="translate(${dx} 0) rotate(${rot})"><path d="M-46 0 C-44 -14 -30 -18 -14 -22 C4 -26 22 -40 34 -46 L40 -44 L40 -36 C30 -26 26 -10 30 0 Z" fill="#c4121f" stroke="${OL}" stroke-width="2.6"/>` +
    `<path d="M30 0 L36 0 L40 -38" stroke="${OL}" stroke-width="5"/><path d="M-40 -6 C-30 -14 -10 -16 6 -20" stroke="#ff5a66" stroke-width="3" fill="none" opacity=".8"/>` +
    `<path d="M34 -2 l6 2" stroke="#4a3320" stroke-width="5" stroke-linecap="round"/></g>`;
  let g = `<g transform="translate(${x} ${y}) scale(${s})">${shoe(-30, 0)}${shoe(36, 6)}`;
  if (wet) for (let i = 0; i < 3; i++) { const k = ((t * .8 + i * .33) % 1); g += `<ellipse cx="${-30 + i * 34}" cy="${f(4 + k * 20)}" rx="2" ry="3.4" fill="#bfe0ff" opacity="${f((1 - k) * 100) / 100}"/>`; }
  return g + `</g>`;
}
function newspaper(x, y, s) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 -30 L110 -40 L118 40 L-104 46 Z" fill="#e4dfd2" stroke="#8a857a" stroke-width="1.6"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="M${-90 + i * 34} -22 v52" stroke="#b9b3a6" stroke-width="12" opacity=".5"/>`;
  g += txt(-40, -18, "DIÁRIO", { size: 12, fill: "#4a463e", w: 800 }) + `<path d="M-60 34 Q0 22 80 30" stroke="#8fa7bf" stroke-width="10" opacity=".35" fill="none"/>`;
  return g + `</g>`;
}
function chatBubbles(T, msgs, hdrStatus) {
  let g = chatHeader(hdrStatus || "online"); let y = 74;
  for (const m of msgs) {
    if (T < m.t - .8) break;
    if (T < m.t) { g += typing(14, y, T); break; }
    g += bubble(14, y, m.l, pr(T, m.t, m.t + .35), m.red ? { fill: "#3a1418" } : {});
    y += m.l.length * 18 + 26;
  }
  return g;
}
function overlayPale(op) { return `<rect x="-300" y="-300" width="960" height="1240" fill="#dfe8f0" opacity="${op}" style="mix-blend-mode:soft-light"/>`; }

/* ---------- shots ---------- */
const S2 = {};
const TTL = Object.assign({ facade: "ESTAVA DENTRO|DA CASA", phone: "QUEM TIROU|ESSA FOTO?", steady: "ELE CONHECE|ESSA FOTO" }, typeof TTL_OVR !== "undefined" ? TTL_OVR : {});
const P = (id, i) => TL.segs[id] ? TL.segs[id].phrases[i] : null;
/* 0. frame 0: handcuffs click inside the police car */
S2.cuffsHook = (lt, d, T, seg) => {
  let s = carInterior(T);
  const open = 1 - eo(pr(lt, 0, .12));
  s += wrists(180, 380, 1.15, "#4f8279", true, open);
  s += policeGlow(T, .25, 180, 380);
  const punch = lt < .3 ? (1 - lt / .3) * .25 : 0;
  s = cam(s, { z: lerp(1.08, 1.22, ease(lt / d)) + punch, cy: 380, t: lt, sh: lt < .3 ? 4 : .8 });
  s += full("#fff", lt < .08 ? .55 * (1 - lt / .08) : 0);
  const p1 = pr(T, seg.phrases[1].a - .1, seg.phrases[1].a + .25);
  s += bigTitle("PRESO POR SER|HONESTO?", p1, { y: 132, size: 31, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.25) + vign(.75);
};
S2.lucasCar = (lt, d, T) => {
  let s = carInterior(T);
  const st = strobe(T);
  s += charBust("lucas", 190, 360, 1.5, { t: T, top: "teeDry", look: [-.4, .5], lid: .8, brow: { sad: .4, angry: .3 }, talk: talkAmp(T, "L"), rim: st > 0 ? "#ff4d5e" : "#5a8dff", lightSide: st > 0 ? 1 : -1, turn: -.15 });
  s += wrists(190, 640, .9, "#4f8279", true, 0);
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 360, t: lt, sh: .6 });
  return s + policeGlow(T, .22) + gradeCold(.25) + vign(.75);
};
S2.glitch8 = (lt) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#050608"/>`;
  for (let i = 0; i < 14; i++) { const y = (hash(i + Math.floor(lt * 20)) * 640); s += `<rect x="-40" y="${f(y)}" width="440" height="${f(2 + hash(i * 3) * 10)}" fill="#fff" opacity="${f(hash(i * 7) * .12 * 100) / 100}"/>`; }
  const g = Math.sin(lt * 90) * 5 * (1 - pr(lt, .2, .5)), T8 = "8 HORAS ANTES";
  s += txt(180 + g, 322, T8, { size: 38, fill: "#ff3b3b", op: .7, ls: 2 }) + txt(180 - g, 318, T8, { size: 38, fill: "#38e1ff", op: .7, ls: 2 }) + txt(180, 320, T8, { size: 38, ls: 2 });
  s += txt(180, 362, "◀◀", { size: 22, fill: "#fff", op: .5 + .5 * Math.sin(lt * 12) });
  return s;
};
/* 1. counting the R$200 notes under the awning */
S2.countCash = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gNight)"/><circle cx="250" cy="20" r="300" fill="url(#gLamp)" opacity=".8"/>` + bokeh(lt, 7, 2, { r: 22, op: .3, h: 320 });
  let w = wallet2(180, 380, 0, 1.05, { flip: lt * .9 });
  const [ax, ay] = shake(lt * 1.7, 1.2);
  w += handG(62 + ax, 460 + ay, 28, .95, L_SK, "#3f5f59", { wet: true, curl: true }) + handG(300 - ax, 450 + ay, -34, .95, L_SK, "#3f5f59", { wet: true, curl: true });
  s += cam(w, { z: lerp(1.12, 1.32, ease(lt / d)), cy: 360, t: lt, sh: .8 });
  const n = Math.min(50, Math.round(50 * eo(pr(lt, .2, Math.max(.6, (seg.phrases[1] ? seg.phrases[1].a - seg.a : 1.6))))));
  s += txt(180, 150, `${n} × R$ 200`, { size: 40, fill: "#ffd27a", stroke: "#2a1606", sw: 8 });
  if (seg.phrases[1] && T > seg.phrases[1].a) s += popLabel(180, 200, "TUDO AQUI", pr(T, seg.phrases[1].a, seg.phrases[1].a + .3), { bg: "#7dff9b", size: 18, rot: 4 });
  return s + rain2(lt, 40) + gradeWarm(.12) + gradeCold(.2) + vign(.7);
};
/* 1b. the torn photo slides out, then flips to show the date */
S2.photoReveal = (lt, d, T, seg) => {
  const flipA = at("FLIP.a"), flipB = at("FLIP.b");
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#0a0d14"/><circle cx="180" cy="300" r="260" fill="url(#gLamp)" opacity=".5"/>`;
  const slide = eo(pr(lt, 0, .9));
  const fp = ease(pr(T, flipA + .1, flipA + .65)), sx = Math.cos(fp * Math.PI);
  let ph = sx >= 0 ? halfPhotoFront(1.55) : halfPhotoBack(1.55);
  ph = `<g transform="translate(180 ${f(lerp(520, 330, slide))}) rotate(${f(lerp(12, -3, slide))}) scale(${f(Math.max(.02, Math.abs(sx)) * 100) / 100} 1)">${ph}</g>`;
  s += handG(lerp(80, 60, slide), lerp(640, 470, slide), 30, 1, L_SK, "#3f5f59", { wet: true, curl: true });
  s += ph;
  s = cam(s, { z: lerp(1.0, 1.18, ease(pr(T, seg.a, flipB))), cy: 330, t: lt, sh: .5 });
  const p3 = P("L2", 3);
  if (p3 && T < flipA) s += bigTitle("O QUE O PAI DELE|FAZ NESSA CARTEIRA?", pr(T, p3.a, p3.a + .3), { y: 112, size: 25, col: "#fff", two: "#ffd400" });
  if (T > flipA + .7) s += popLabel(180, 545, "14/03/2006", pr(T, flipA + .7, flipA + 1), { bg: "#ff3b3b", fg: "#fff", size: 22 });
  // phone shutter at the end
  const sh = pr(T, flipB - .35, flipB - .2);
  if (sh > 0) s += `<rect x="-40" y="-40" width="440" height="720" fill="#fff" opacity="${f((1 - pr(T, flipB - .2, flipB)) * .8 * 100) / 100}"/>` + `<rect x="30" y="60" width="300" height="520" rx="20" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/>`;
  return s + rain2(lt * .4, 22, { o: .2 }) + vign(.75);
};
/* 2. home */
S2.homeWide = (lt, d, T) => {
  let s = homeRoom(T);
  s += portrait(300, 300, .8) + `<rect x="250" y="360" width="100" height="160" fill="#4a3a2e" stroke="${OL}" stroke-width="2"/>`;
  s += bed(230, 460);
  s += charBust("maeL", 250, 400, .78, { t: T, top: "simple", look: [-.9, .2], turn: -.4, lid: .8, brow: { sad: .6, raise: .5 }, talk: talkAmp(T, "C"), smile: -.3 });
  s += `<path d="M90 470 C140 450 330 450 380 470 L380 560 L90 560 Z" fill="#8a9bb3" stroke="${OL}" stroke-width="2.4"/>`;
  s += charBust("lucas", 70, 420, .85, { t: T, top: "tee", wet: true, turn: .5, look: [.9, .1], brow: { raise: .5 } });
  s += bucket(150, 600, T) + envelope(40, 610, -8, .55);
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 400, t: lt, sh: .3 });
  return s + gradeCold(.25) + vign(.7);
};
S2.lucasHome = (lt, d, T) => {
  let s = homeRoom(T);
  s += charBust("lucas", 180, 352, 1.5, { t: T, top: "tee", wet: true, look: [.5, .1], turn: .15, brow: { raise: .4, sad: .3 }, talk: talkAmp(T, "L") });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  return s + gradeCold(.2) + vign(.65);
};
S2.celiaPhone = (lt, d, T, seg) => {
  let s = homeRoom(T);
  s += charBust("maeL", 180, 350, 1.45, { t: T, top: "simple", look: [.2, .7], lid: 1.05, brow: { raise: .8, sad: .5 }, talk: talkAmp(T, "C"), pupilShrink: true, wetEyes: lt > 1.5, smile: -.3 });
  const inner = `<rect width="216" height="444" rx="26" fill="#111"/><g transform="translate(108 220) rotate(4)">${halfPhotoBack(1.2)}</g>`;
  s += phone(inner, { x: 270, y: 640, s: .5, rot: -12, skin: CAST.maeL.skin });
  s = cam(s, { z: lerp(1.0, 1.16, ease(lt / d)), cy: 360, t: lt, sh: .3 });
  const p1 = seg.phrases[1];
  if (p1) s += bigTitle("O DIA QUE|ELE NASCEU", pr(T, p1.a + .2, p1.a + .5), { y: 120, size: 30, col: "#fff", two: "#ffd400" });
  return s + gradeCold(.2) + vign(.7);
};
S2.lucasAsk = (lt, d, T) => {
  let s = homeRoom(T);
  s += charBust("lucas", 180, 352, 1.55, { t: T, top: "tee", wet: true, look: [.4, 0], brow: { raise: .6, sad: .6 }, talk: talkAmp(T, "L"), lean: -2 });
  s = cam(s, { z: lerp(1.04, 1.16, ease(lt / d)), cy: 330, t: lt, sh: .4 });
  return s + gradeCold(.22) + vign(.7);
};
S2.celiaGrab = (lt, d, T, seg) => {
  let s = homeRoom(T);
  s += charBust("maeL", 180, 340, 1.45, { t: T, top: "simple", look: [0, 0], lid: .95, brow: { angry: .3, sad: .8 }, talk: talkAmp(T, "C"), smile: -.4, wetEyes: true });
  const g = eo(pr(lt, .1, .4));
  s += handG(150, 700 - g * 60, 0, .9, L_SK, "#4f8279", { fist: true });
  s += handG(lerp(60, 140, g), lerp(720, 630, g), -70, .85, CAST.maeL.skin, "#6d7f93", { curl: true });
  s = cam(s, { z: lerp(1.05, 1.2, ease(lt / d)), cy: 360, t: lt, sh: g < 1 && g > 0 ? 2 : .4 });
  const p3 = seg.phrases[3];
  if (p3) s += bigTitle("O QUE ELA|ESCONDE?", pr(T, p3.a, p3.a + .3), { y: 120, size: 32, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.25) + vign(.72);
};
S2.lucasPortrait = (lt, d, T) => {
  let s = homeRoom(T) + full("#000", .2);
  s += charBust("lucas", 120, 380, 1.15, { t: T, top: "tee", wet: true, turn: .55, look: [1, .2], lid: .7, brow: { sad: .8 }, wetEyes: true, smile: -.2 });
  s += `<g filter="url(#fBlur)">${portrait(290, 520, 1.25)}</g>`;
  s = cam(s, { z: lerp(1.0, 1.08, ease(lt / d)), cx: lerp(180, 200, ease(lt / d)), cy: 400, t: lt, sh: .3 });
  return s + gradeCold(.3) + vign(.75);
};
/* 3. the mansion in the morning */
S2.gateMorning = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#8f9aa6"/><rect x="-40" y="-40" width="440" height="300" fill="#a9b3bd"/>`;
  s += `<rect x="-40" y="160" width="440" height="300" fill="#d7cdb8"/><rect x="-40" y="160" width="440" height="10" fill="#b5a888"/>`;
  let bars = ""; for (let i = 0; i < 14; i++) bars += `<rect x="${i * 30 - 4}" y="190" width="7" height="330" fill="#3a3326"/><circle cx="${i * 30}" cy="186" r="5" fill="#8a7a50"/>`;
  s += `<g opacity=".9">${bars}</g><rect x="-40" y="260" width="440" height="6" fill="#3a3326"/>`;
  s += `<rect x="-40" y="500" width="440" height="220" fill="#6d7278"/>`;
  const intro = clamp((seg.a - T) / 1.0); // establishing before Graça talks
  s += policeCar(260, 560, .9, T);
  s += charBust("grac", 250, 420, .78, { t: T, top: "uniform", look: [-.9, .1], turn: -.4, lid: .85, brow: { sad: .6 }, talk: talkAmp(T, "G") * .8, smile: -.2 });
  s += bike(70, 520, .9, 0, true, T) + charBust("lucas", 100, 430, .8, { t: T, top: "teeDry", look: [.9, 0], turn: .45, brow: { raise: .3 }, lid: .9 });
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cx: lerp(250, 180, ease(pr(lt, 0, 1.2))), cy: 430, t: lt, sh: .3 });
  return s + rain(lt, 18, { o: .15, len: 12, w: 1, seed: 51 }) + gradeCold(.32) + vign(.55);
};
S2.hallWide = (lt, d, T) => {
  let s = hallBg(T);
  s += charBust("paula", 300, 420, .72, { t: T, top: "blazer", look: [-.8, .1], turn: -.35, lid: .75, smile: .25, sneer: -.3 });
  s += charBust("moura", 225, 440, .78, { t: T, top: "jacket", look: [-.8, .2], turn: -.3, lid: .65, smile: 0 });
  s += `<g transform="translate(262 560)"><rect x="-10" y="-22" width="20" height="24" rx="3" fill="#f4efe6" stroke="${OL}" stroke-width="2"/><path d="M10 -16 q8 0 8 6 q0 6 -8 6" stroke="${OL}" stroke-width="2" fill="none"/></g>`;
  s += charBust("ric", 110, 440, .95, { t: T, top: "suit", look: [-.6, 0], turn: .2, lid: .6, brow: { raiseL: .5 }, sneer: .6, talk: talkAmp(T, "R") * .8 });
  s = cam(s, { z: lerp(1.0, 1.08, ease(lt / d)), cy: 420, t: lt, sh: .25 });
  return s + gradeCold(.18) + vign(.55);
};
S2.aparadorPlace = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .1);
  s += aparador(180, 470, 1.15);
  const p = ease(pr(lt, .1, .9));
  s += wallet(lerp(120, 150, p), lerp(520, 456, p), lerp(20, -6, p), .55, {});
  s += handG(lerp(110, 140, p) + (lt > 1.2 ? (lt - 1.2) * -60 : 0), lerp(580, 520, p) + (lt > 1.2 ? (lt - 1.2) * 90 : 0), 20, .7, L_SK, "#4f8279", { curl: true });
  s = cam(s, { z: lerp(1.25, 1.45, ease(lt / d)), cx: 160, cy: 450, t: lt, sh: .3 });
  s += bigTitle("A MESMA|CARTEIRA", pr(lt, .6, .9), { y: 130, size: 32, col: "#fff", two: "#ffd400" });
  return s + gradeCold(.15) + vign(.6);
};
S2.ricardoPhoto = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .15);
  const fr = ease(pr(lt, 0, .6));
  s += charBust("ric", 180, 340, 1.5, { t: T, top: "suit", look: [.1, .9], lid: lerp(.7, 1.15, fr), pupilShrink: fr > .5, brow: { raise: fr * .7, sad: fr * .3 }, smile: -.2, talk: talkAmp(T, "R") * .5, sweat: fr > .5, nod: 6 });
  s += overlayPale(fr * .5);
  s += `<g transform="translate(220 610) rotate(-8)">${halfPhotoFront(.85)}</g>` + handG(160, 650, 20, .8, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1", curl: true });
  s = cam(s, { z: lerp(1.1, 1.25, ease(lt / d)), cy: 380, t: lt, sh: .5 });
  return s + gradeCold(.2) + vign(.7);
};
S2.lucasSteady = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .12);
  s += charBust("lucas", 180, 352, 1.5, { t: T, top: "teeDry", look: [-.4, 0], turn: -.1, brow: { angry: .2 }, talk: talkAmp(T, "L") });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  s += bigTitle(TTL.steady, pr(lt, .5, .8), { y: 118, size: 30, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.15) + vign(.62);
};
S2.countHands = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#1f2a44"/>`;
  s += `<path d="M-40 -40 L400 -40 L400 680 L-40 680 Z" fill="#141c30" opacity=".4"/>`;
  for (let i = 0; i < 7; i++) {
    const k = (lt * 2.6 + i / 7) % 1, x = lerp(150, 240, k), y = 400 - Math.sin(k * Math.PI) * 60;
    s += note200(x, y, lerp(-20, 25, k), .95, i === 3 && lt > d * .5 ? 0 : 1);
  }
  s += note200(170, 440, -6, 1.05) + note200(176, 446, -2, 1.05);
  // a note sliding toward the jacket — easy to miss
  const sl = ease(pr(lt, d * .45, d * .8));
  if (sl > 0 && sl < 1) s += note200(lerp(200, 330, sl), lerp(380, 250, sl), 30, .8, 1 - sl * .6);
  s += handG(120, 520, 15, 1.05, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1", curl: true }) + handG(250, 500, -20, 1.05, CAST.ric.skin, "#1f2a44", { cuff: "#f3f3f1", curl: true });
  s = cam(s, { z: lerp(1.15, 1.3, ease(lt / d)), cy: 420, t: lt, sh: .4 });
  return s + gradeWarm(.1) + vign(.7);
};
S2.ricardoSmug = (lt, d, T) => {
  let s = hallBg(T);
  s += charBust("ric", 180, 340, 1.5, { t: T, top: "suit", lid: .6, squint: .2, sneer: .8, brow: { raiseL: .6, angry: .3 }, talk: talkAmp(T, "R") * .7, look: [.4, 0], tilt: -3 });
  const p3 = P("R3", 3), k = p3 ? pr(T, p3.a, p3.a + .25) : 0;
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)) + (k > 0 && k < 1 ? .06 * (1 - k) : 0), cy: 330, t: lt, sh: k > 0 && k < .6 ? 3.5 : .3 });
  if (k > 0) s += full("#ff0000", .12 * (1 - pr(T, p3.a, p3.a + .6))) + bigTitle("FALTAM|2 MIL?", k, { y: 128, size: 40, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.12) + vign(.6);
};
S2.lucasShout = (lt, d, T) => {
  let s = hallBg(T, { isa: pr(lt, d * .45, d * .7) });
  s += charBust("lucas", 160, 360, 1.45, { t: T, top: "teeDry", look: [.5, 0], turn: .15, brow: { angry: 1 }, open: .3, talk: talkAmp(T, "L"), lid: 1.05 });
  s = cam(s, { z: lerp(1.08, 1.0, eo(pr(lt, 0, .4))), cy: 350, t: lt, sh: lt < .5 ? 2.5 : .5 });
  return s + gradeCold(.15) + vign(.62);
};
/* 4. the proof */
function rainPhotoInner(T) {
  return `<rect width="216" height="444" rx="26" fill="#0c111b"/><rect x="0" y="80" width="216" height="290" fill="#101826"/>` +
    `<svg x="0" y="80" width="216" height="290" viewBox="40 200 280 380">${streetNight(0)}${charBust("lucas", 180, 420, 1.1, { t: 0, top: "tee", wet: true, look: [0, .8], lid: .9, autoBlink: false })}${wallet(180, 560, 0, .7, { open: 1, wet: true })}${rain(T, 40, { o: .4 })}</svg>` +
    `<rect x="0" y="80" width="216" height="290" fill="#fff" opacity=".06"/><text x="12" y="70" font-family="Inter, sans-serif" font-size="11" fill="#9aa3b5">Número desconhecido · 23:12</text>`;
}
function pinkPhone(inner, o) {
  return `<g><rect x="${f(o.x - 128 * o.s)}" y="${f(o.y - 242 * o.s)}" width="${f(256 * o.s)}" height="${f(484 * o.s)}" rx="${f(40 * o.s)}" fill="#f29bb7" stroke="${OL}" stroke-width="3" transform="rotate(${o.rot || 0} ${o.x} ${o.y})"/>${phone(inner, o)}</g>`;
}
S2.mouraPhone = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .08);
  s += charBust("moura", 130, 360, 1.25, { t: T, top: "jacket", look: [.6, 0], turn: .2, lid: .6, talk: talkAmp(T, "D") * .8, brow: { raiseR: .4 } });
  s += pinkPhone(rainPhotoInner(T), { x: 270, y: 470, s: .55, rot: 6, skin: CAST.moura.skin });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 380, t: lt, sh: .3 });
  return s + gradeCold(.15) + vign(.62);
};
S2.phoneClose = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#d9ccb4"/>` + full("#000", .4);
  s += pinkPhone(rainPhotoInner(T), { x: 180, y: 350, s: 1.0, skin: CAST.moura.skin });
  s = cam(s, { z: lerp(1.0, 1.15, ease(lt / d)), cy: 330, t: lt, sh: .4 });
  s += bigTitle(TTL.phone, pr(lt, .4, .7), { y: 96, size: 30, col: "#fff", two: "#ff3b3b" });
  return s + vign(.7);
};
S2.mouraArrest = (lt, d, T) => {
  let s = hallBg(T);
  s += charBust("moura", 180, 345, 1.45, { t: T, top: "jacket", look: [.2, 0], lid: .6, brow: { angry: .2 }, talk: talkAmp(T, "D") });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  return s + gradeCold(.15) + vign(.62);
};
S2.cuffsHall = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gMarble)"/>` + full("#000", .25);
  const open = 1 - eo(pr(lt, .05, .18));
  s += wrists(180, 360, 1.25, "#4f8279", true, open);
  s = cam(s, { z: 1.1 + (lt < .4 ? (.4 - lt) * .4 : 0), cy: 360, t: lt, sh: lt < .35 ? 4 : .3 });
  s += full("#fff", lt > .05 && lt < .15 ? .4 : 0);
  return s + vign(.7);
};
S2.isaStairs = (lt, d, T) => {
  let s = hallBg(T);
  const run = Math.sin(lt * 14) * 4;
  s += charBust("isa", lerp(240, 190, ease(lt / d)), 350 + run, 1.4, { t: T, top: "hoodie", look: [-.4, .1], turn: -.2, brow: { angry: .5, raise: .4 }, talk: talkAmp(T, "I"), open: .3, lid: 1.05 });
  s = cam(s, { z: 1.05, cy: 340, t: lt, sh: 2.4 });
  return s + speedLines(lt, .12, "#fff") + gradeCold(.12) + vign(.6);
};
S2.ricardoCold = (lt, d, T) => {
  let s = hallBg(T);
  s += charBust("ric", 180, 340, 1.5, { t: T, top: "suit", look: [.9, 0], turn: .35, lid: .55, brow: { angry: .5 }, talk: talkAmp(T, "R") * .7, smile: -.2 });
  s = cam(s, { z: lerp(1.0, 1.08, ease(lt / d)), cy: 330, t: lt, sh: .25 });
  return s + gradeCold(.15) + vign(.6);
};
S2.isaConfront = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .08);
  s += charBust("isa", 180, 345, 1.5, { t: T, top: "hoodie", look: [-.3, 0], brow: { angry: .8 }, talk: talkAmp(T, "I"), lid: .95, wetEyes: true });
  s = cam(s, { z: lerp(1.0, 1.14, ease(lt / d)), cy: 335, t: lt, sh: .4 });
  return s + gradeCold(.12) + vign(.62);
};
S2.ricardoPocket = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#d9ccb4"/>`;
  s += charBust("ric", 180, -40, 2.5, { t: T, top: "suit", lid: .6 });
  const p = ease(pr(lt, .1, .9)) * (1 - .25 * ease(pr(lt, 1.0, 1.4)));
  s += handG(lerp(150, 230, p), lerp(720, 520, p), lerp(-10, -40, p), .85, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1", curl: true });
  const q = pr(lt, .9, 1.2);
  if (q > 0) s += `<circle cx="246" cy="520" r="${f(lerp(90, 60, eo(q)))}" fill="none" stroke="#ff3b3b" stroke-width="5" opacity="${f(eo(q) * 100) / 100}"/>`;
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 440, t: lt, sh: .3 });
  return s + gradeCold(.12) + vign(.6);
};
S2.lucasMoved = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .1);
  s += charBust("lucas", 180, 352, 1.5, { t: T, top: "teeDry", look: [.6, -.2], turn: .2, brow: { sad: .5, raise: .4 }, wetEyes: true, talk: talkAmp(T, "L") * .5, smile: .05 });
  s += wrists(180, 650, .8, "#4f8279", true, 0);
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 360, t: lt, sh: .3 });
  return s + gradeWarm(.08) + vign(.62);
};
/* 5. the deal */
function folder(x, y, s, open) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-120" y="-80" width="240" height="160" rx="6" fill="#a8141f" stroke="${OL}" stroke-width="3"/>`;
  if (open > 0) {
    g += `<g transform="translate(0 ${f(-30 * open)})"><rect x="-108" y="-120" width="100" height="140" fill="#f6f3ea" stroke="${OL}" stroke-width="2"/>` + txt(-58, -96, "DECLARAÇÃO", { size: 10, fill: "#111" }) +
      `<path d="M-98 -80 h80 M-98 -66 h70 M-98 -52 h76 M-98 -38 h60" stroke="#9a968c" stroke-width="3"/><path d="M-96 0 h60" stroke="#111" stroke-width="1.6"/>` + txt(-66, 12, "assinatura", { size: 7, fill: "#666", w: 500 }) + `</g>`;
    g += `<g transform="translate(0 ${f(-30 * open)})"><rect x="4" y="-120" width="104" height="140" fill="#f3efe4" stroke="${OL}" stroke-width="2"/><rect x="4" y="-120" width="104" height="22" fill="#b3261e"/>` +
      txt(56, -104, "DESPEJO", { size: 11, fill: "#fff" }) + txt(56, -78, "HORIZONTE", { size: 10, fill: "#b3261e" }) + txt(56, -66, "ADMINISTRADORA", { size: 7, fill: "#b3261e" }) +
      `<path d="M14 -52 h84 M14 -40 h70 M14 -28 h80" stroke="#9a968c" stroke-width="3"/>` + txt(56, 6, "Dra. Paula Rezende", { size: 8, fill: "#111", w: 700, style: "italic" }) + `</g>`;
  }
  return g + `</g>`;
}
S2.paulaTalk = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .08);
  s += charBust("paula", 180, 340, 1.48, { t: T, top: "blazer", look: [.3, 0], lid: .7, smile: .3, sneer: -.4, brow: { raiseR: .4 }, talk: talkAmp(T, "P"), tilt: -2 });
  s += folder(250, 640, .6, 0);
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 360, t: lt, sh: .25 });
  return s + gradeCold(.12) + vign(.6);
};
S2.folderOpen = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#d9ccb4"/>` + full("#000", .3);
  s += folder(180, 400, 1.25, ease(pr(lt, .1, .7)));
  s = cam(s, { z: lerp(1.0, 1.2, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  return s + vign(.65);
};
S2.evictionMatch = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#151820"/>`;
  s += `<g transform="translate(0 -10)"><rect x="10" y="40" width="340" height="270" rx="10" fill="#3a3029" stroke="#fff" stroke-width="3"/>` + txt(180, 66, "EMBAIXO DA PORTA", { size: 14, fill: "#ffd400" }) + envelope(180, 190, -4, 1.4, pr(lt, .6, .9)) + `</g>`;
  s += `<g transform="translate(0 0)"><rect x="10" y="320" width="340" height="270" rx="10" fill="#d9ccb4" stroke="#fff" stroke-width="3"/>` + txt(180, 346, "NA PASTA DA ADVOGADA", { size: 14, fill: "#a8141f" }) +
    `<g transform="translate(180 500) scale(1.25)"><rect x="-52" y="-70" width="104" height="140" fill="#f3efe4" stroke="${OL}" stroke-width="2"/><rect x="-52" y="-70" width="104" height="22" fill="#b3261e"/>` + txt(0, -54, "DESPEJO", { size: 11, fill: "#fff" }) + txt(0, -28, "HORIZONTE", { size: 12, fill: "#b3261e" }) +
    (pr(lt, .9, 1.2) > 0 ? `<ellipse cx="0" cy="-32" rx="${f(lerp(80, 56, eo(pr(lt, .9, 1.2))))}" ry="16" fill="none" stroke="#ff3b3b" stroke-width="4"/>` : "") + `</g></g>`;
  const p2 = seg.phrases[1];
  if (p2) s += full("#000", .45 * pr(T, p2.a, p2.a + .3)) + bigTitle("O DESPEJO|ERA ELE", pr(T, p2.a, p2.a + .3), { y: 300, size: 40, col: "#fff", two: "#ff3b3b", rot: -4 });
  return cam(s, { z: lerp(1.0, 1.06, ease(lt / d)), cy: 320, t: lt, sh: .3 }) + vign(.55);
};
S2.lucasDefy = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .12);
  s += charBust("lucas", 180, 352, 1.55, { t: T, top: "teeDry", look: [.4, 0], brow: { angry: .9 }, lid: .8, talk: talkAmp(T, "L"), smile: -.2 });
  s = cam(s, { z: lerp(1.05, 1.18, ease(lt / d)), cy: 335, t: lt, sh: .3 });
  return s + gradeCold(.18) + vign(.68);
};
S2.paulaCruel = (lt, d, T, seg) => {
  let s = hallBg(T) + full("#000", .1);
  s += charBust("paula", 180, 340, 1.5, { t: T, top: "blazer", look: [-.2, 0], lid: .62, smile: .35, sneer: .5, brow: { raiseL: .5 }, talk: talkAmp(T, "P"), tilt: 3 });
  const p0 = seg.phrases[0], st = p0 ? pr(T, p0.a + (p0.b - p0.a) * .6, p0.a + (p0.b - p0.a) * .6 + .35) : 0;
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 340, t: lt, sh: st > 0 && st < .5 ? 3 : .25 });
  s += stamp(180, 150, "6 DIAS", st, { size: 44 });
  return s + gradeCold(.12) + vign(.62);
};
/* 6. out the back */
S2.ricardoBack = (lt, d, T) => {
  let s = hallBg(T);
  s += charBust("ric", 180, 340, 1.45, { t: T, top: "suit", look: [-.7, 0], turn: -.3, lid: .55, sneer: .6, talk: talkAmp(T, "R") * .7, tilt: 2 });
  s += handG(lerp(280, 330, ease(pr(lt, .3, .9))), 560, -60, .8, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1" });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 340, t: lt, sh: .25 });
  return s + gradeCold(.15) + vign(.6);
};
function laundryBg() {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#c9d1d6"/>`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 9; c++) s += `<rect x="${c * 44 - 20 + (r % 2) * 22}" y="${r * 44 - 30}" width="42" height="42" fill="#dfe5e8" stroke="#b3bcc2" stroke-width="1.2"/>`;
  s += `<g transform="translate(90 380)"><rect x="-60" y="-80" width="120" height="150" rx="8" fill="#f2f4f5" stroke="${OL}" stroke-width="2.4"/><circle cy="0" r="40" fill="#5f7b8f" stroke="${OL}" stroke-width="3"/><circle cy="0" r="30" fill="#8fb1c7"/><rect x="-50" y="-72" width="60" height="12" rx="4" fill="#cfd6db"/></g>`;
  s += `<rect x="-40" y="470" width="440" height="250" fill="#8f9aa2"/>`;
  return s;
}
S2.laundryPass = (lt, d, T) => {
  let s = laundryBg();
  s += newspaper(290, 520, .75) + redHeels(290, 506, .55, T);
  const x = lerp(-60, 420, ease(lt / d));
  s += `<g transform="translate(${f(x)} 0)">${charBust("moura", -40, 430, .9, { t: T, top: "jacket", turn: .6, look: [1, 0], lid: .6 })}${charBust("lucas", 50, 440, .85, { t: T, top: "teeDry", turn: .5, look: [.6, .5], lid: .7, brow: { sad: .4 } })}</g>`;
  s = cam(s, { z: 1.05, cx: lerp(160, 210, lt / d), cy: 420, t: lt, sh: .6 });
  return `<g filter="url(#fBlur)">${s}</g>` + gradeCold(.15) + vign(.6);
};
S2.carMsg = (lt, d, T, seg) => {
  let s = carInterior(T, { day: true });
  const msgs = [{ t: seg.phrases[0].a, l: ["Você devolveu."] }, { t: seg.phrases[1].a, l: ["*Eu disse que ia saber.*"], red: true }];
  const vib = msgs.some(m => T > m.t && T < m.t + .3) ? 2.4 : 0;
  s += phone(`<rect width="216" height="444" rx="26" fill="#0f1420"/>` + chatBubbles(T, msgs), { x: 180, y: 320, s: .9, t: lt, vib });
  s += handcuffs(180, 560, .9, 0);
  s = cam(s, { z: lerp(1.0, 1.08, ease(lt / d)), cy: 330, t: lt, sh: .6 });
  return s + policeGlow(T, .18) + gradeCold(.2) + vign(.7);
};
S2.facadeWindow = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#9aa5b0"/>`;
  s += `<rect x="-20" y="120" width="400" height="520" fill="#e3d8c2" stroke="#9e8c6b" stroke-width="4"/><path d="M-40 130 L180 30 L400 130 Z" fill="#7a5a44" stroke="${OL}" stroke-width="3"/>`;
  const win = (x, y, inner) => `<g transform="translate(${x} ${y})"><rect x="-46" y="-60" width="92" height="120" fill="#3a4654" stroke="#f4efe4" stroke-width="7"/>${inner}<path d="M0 -60 v120 M-46 0 h92" stroke="#f4efe4" stroke-width="4"/></g>`;
  const cl = ease(pr(lt, .4, 1.4));
  const curtain = `<rect x="-46" y="-60" width="${f(lerp(14, 92, cl))}" height="120" fill="#d8c3a0" opacity=".95"/><rect x="${f(46 - lerp(14, 46, cl))}" y="-60" width="${f(lerp(14, 46, cl))}" height="120" fill="#d8c3a0" opacity=".95"/>` +
    (cl < .7 ? `<g opacity="${f((1 - cl / .7) * 100) / 100}"><circle cx="8" cy="-10" r="10" fill="#0b0e14"/><path d="M-6 0 Q8 -4 22 0 L24 50 L-8 50 Z" fill="#0b0e14"/></g>` : "");
  const isaW = `<svg x="-46" y="-60" width="92" height="120" viewBox="90 240 180 235">${charBust("isa", 180, 360, 1, { t: T, top: "hoodie", look: [0, .6], brow: { sad: .9 }, wetEyes: true, lid: .8 })}</svg>` + handG(20, 30, 0, .3, CAST.isa.skin, "#7c6ca6", {});
  s += win(110, 230, curtain) + win(250, 230, isaW);
  s += win(110, 440, "") + win(250, 440, "") + `<rect x="150" y="500" width="60" height="140" fill="#5a3b20" stroke="${OL}" stroke-width="3"/>`;
  s += `<g opacity=".55">${dropsGlass(T, 26, 9)}</g>`;
  s = cam(s, { z: lerp(1.12, 1.3, ease(lt / d)), cx: lerp(180, 170, lt / d), cy: 260, t: lt, sh: .7 });
  const p1 = seg.phrases[1];
  if (p1) s += bigTitle(TTL.facade, pr(T, p1.a, p1.a + .3), { y: 165, size: 32, col: "#fff", two: "#ff3b3b" });
  return s + rain(lt, 30, { o: .25, w: 1.6, seed: 61 }) + policeGlow(T, .14) + gradeCold(.25) + vign(.65);
};
/* 7. the vote */
S2.vote = (lt, d, T, seg) => {
  let s = carInterior(T);
  const st = strobe(T), a = talkAmp(T, "L");
  s += charBust("lucas", 180, 372, 1.55, { t: T, top: "teeDry", lid: .92, brow: { raiseL: .4, sad: .4 }, talk: a, nod: a * 2, tilt: Math.sin(lt * 1.1) * 2, rim: st > 0 ? "#ff4d5e" : "#5a8dff", lightSide: st > 0 ? 1 : -1 });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  s += policeGlow(T, .16);
  const Ps = seg.phrases;
  const card = (y, k, n, label, col, sel) => k <= 0 ? "" : `<g transform="translate(180 ${y}) scale(${f(eback(k) * (1 + sel * .06) * 100) / 100})"><rect x="-140" y="-34" width="280" height="68" rx="18" fill="${col}" stroke="#111" stroke-width="3"/><circle cx="-102" cy="0" r="22" fill="#fff"/>${txt(-102, 10, n, { size: 28, fill: col })}${txt(22, 10, label, { size: 26 })}</g>`;
  const pulse = (x) => .5 + .5 * Math.sin(T * 8 + x);
  if (Ps[4]) s += card(118, pr(T, Ps[4].a, Ps[4].a + .3), "1", "ASSINAR", "#c22b3a", T > Ps[4].a && T < Ps[5].a ? pulse(0) : 0);
  if (Ps[5]) s += card(200, pr(T, Ps[5].a, Ps[5].a + .3), "2", "NÃO ASSINAR", "#1f8a55", T > Ps[5].a ? pulse(1) : 0);
  if (Ps[5] && T > Ps[5].b) s += popLabel(180, 272, "COMENTA 👇", pr(T, Ps[5].b, Ps[5].b + .3), { bg: "#ffd400", size: 20, rot: 3 });
  return s + gradeCold(.2) + vign(.65);
};
/* 8. subscriber reward */
S2.subscribeLock = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#07070a"/><circle cx="180" cy="300" r="240" fill="url(#gLampCold)" opacity=".8"/>`;
  s += txt(180, 120, "O QUE ELE VIU", { size: 26 }) + txt(180, 152, "SAINDO PELOS FUNDOS?", { size: 22, fill: "#ff4d4d" });
  const b = pr(lt, .3, .7), press = pr(lt, 1.6, 1.75) - pr(lt, 1.9, 2.05), done = lt > 1.8;
  if (b > 0) {
    const bs = eback(b) * (1 - press * .08);
    s += `<g transform="translate(180 330) scale(${f(bs * 100) / 100})"><rect x="-130" y="-30" width="260" height="60" rx="30" fill="${done ? "#3a3a3f" : "#e0262b"}" stroke="#111" stroke-width="3"/>${txt(0, 9, done ? "INSCRITO ✓" : "INSCREVER-SE", { size: 23, fill: "#fff" })}</g>`;
    const ring = done ? Math.sin(lt * 25) * 18 * Math.max(0, 1 - (lt - 1.8) / 1.2) : 0;
    s += `<g transform="translate(326 330) rotate(${f(ring)})"><circle r="24" fill="#fff" stroke="#111" stroke-width="3"/>${txt(0, 9, "🔔", { size: 24, fam: EMO, w: 400 })}</g>`;
    const away = ease(pr(lt, 2.2, 2.8)) * 90, cx = lerp(300, 196, ease(pr(lt, .8, 1.6))) + away, cy = lerp(640, 342, ease(pr(lt, .8, 1.6))) + press * 4 + away * 1.6;
    s += `<g transform="translate(${f(cx)} ${f(cy)}) scale(.5) rotate(-20)">${handG(0, 0, 0, 1, "#f1c9a6", null, {})}</g>`;
  }
  const lk = pr(lt, 2.0, 2.5);
  if (lk > 0) {
    const sh = Math.sin(lt * 30) * 3 * (1 - lk);
    s += `<g transform="translate(${f(180 + sh)} 420) scale(${f(eback(clamp(lk * 1.4)) * 100) / 100})"><path d="M-22 -20 v-18 a22 22 0 0 1 44 0 ${lk > .7 ? "v-8" : "v18"}" fill="none" stroke="#ffd400" stroke-width="8" transform="${lk > .7 ? "translate(14 -6) rotate(18)" : ""}"/><rect x="-34" y="-22" width="68" height="54" rx="8" fill="#ffd400" stroke="#111" stroke-width="3"/><circle cy="2" r="7" fill="#111"/></g>` +
      txt(180, 482, "PISTA PRA INSCRITOS", { size: 20, fill: "#ffd400", op: lk });
  }
  return s + vign(.5);
};
S2.heels = (lt, d, T, seg) => {
  let s = laundryBg() + full("#000", .2);
  s += newspaper(180, 430, 1.6) + redHeels(180, 400, 1.4, T);
  const p2 = seg.phrases[2], cloth = p2 ? ease(pr(T, p2.b - .2, p2.b + .5)) : 0;
  if (cloth > 0) s += `<path d="M${f(lerp(420, 60, cloth))} ${f(lerp(200, 330, cloth))} C${f(lerp(440, 120, cloth))} ${f(lerp(260, 300, cloth))} ${f(lerp(460, 260, cloth))} ${f(lerp(300, 300, cloth))} ${f(lerp(480, 320, cloth))} ${f(lerp(340, 340, cloth))} L${f(lerp(480, 330, cloth))} ${f(lerp(420, 470, cloth))} L${f(lerp(420, 40, cloth))} ${f(lerp(420, 470, cloth))} Z" fill="#e9e5dc" stroke="${OL}" stroke-width="2.4" opacity="${f(Math.min(1, cloth * 3) * 100) / 100}"/>` +
    handG(lerp(440, 300, cloth), lerp(160, 300, cloth), -120, .9, CAST.grac.skin, "#5d6b7d", { curl: true, cuff: "#fff" });
  s = cam(s, { z: lerp(1.15, 1.45, ease(lt / d)), cy: 400, t: lt, sh: .3 });
  const p0 = seg.phrases[0];
  if (p0) s += bigTitle("DE QUEM É|ESSE SALTO?", pr(T, p0.a + .1, p0.a + .4), { y: 128, size: 34, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.1) + vign(.7);
};

/* ---------- overlays read by stage.html ---------- */
function overlayState(T) {
  const L1a = at("L8.a") - .1, L2a = at("L13.a") - .3;
  let let_ = null, k = 0, txtL = "";
  if (T >= L1a && T < L1a + 3) { k = Math.min(pr(T, L1a, L1a + .3), 1 - pr(T, L1a + 2.6, L1a + 3)); txtL = "O QUE A ISABELA VIU?<small>DEPOIS, VEJA A VISÃO DELA</small>"; }
  if (T >= L2a && T < L2a + 3) { k = Math.min(pr(T, L2a, L2a + .3), 1 - pr(T, L2a + 2.6, L2a + 3)); txtL = "DEPOIS, VEJA PELA<small>VISÃO DA ISABELA</small>"; }
  return { letK: k, letHTML: txtL };
}
