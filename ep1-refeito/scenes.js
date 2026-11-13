/* Scenes for "Dez Mil Reais" ep.1 — 360x640 SVG space. Depends on chars.js and TL (timeline). */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eo = (x) => 1 - Math.pow(1 - x, 3);
const eback = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const pr = (t, a, b) => clamp((t - a) / (b - a));
const f = (n) => Math.round(n * 10) / 10;
const hash = hsh;
function shake(t, a) {
  return [a * (Math.sin(t * 11.3) + .6 * Math.sin(t * 5.7 + 2) + .3 * Math.sin(t * 23.1)),
          a * (Math.sin(t * 9.1 + 1) + .6 * Math.sin(t * 4.3) + .3 * Math.sin(t * 19.7 + 3))];
}
function cam(inner, o = {}) {
  const z = o.z || 1, cx = o.cx ?? 180, cy = o.cy ?? 320, [sx, sy] = shake(o.t || 0, o.sh || 0);
  return `<g transform="translate(${f(180 + sx + (o.dx || 0))} ${f(320 + sy + (o.dy || 0))}) rotate(${f(o.rot || 0)}) scale(${z.toFixed(4)}) translate(${f(-cx)} ${f(-cy)})">${inner}</g>`;
}
const FONT = "'Inter Display', Inter, 'DejaVu Sans', sans-serif";
const EMO = "'Noto Color Emoji', sans-serif";
function txt(x, y, s, o = {}) {
  const sz = o.size || 20;
  return `<text x="${f(x)}" y="${f(y)}" font-family="${o.fam || FONT}" font-size="${sz}" font-weight="${o.w || 900}" fill="${o.fill || "#fff"}" text-anchor="${o.anchor || "middle"}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 6}" paint-order="stroke" stroke-linejoin="round"` : ""}${o.ls ? ` letter-spacing="${o.ls}"` : ""}${o.op != null ? ` opacity="${f(o.op * 100) / 100}"` : ""}${o.style ? ` font-style="${o.style}"` : ""}>${s}</text>`;
}
const full = (fill, op = 1) => `<rect x="-300" y="-300" width="960" height="1240" fill="${fill}" opacity="${f(op * 100) / 100}"/>`;
function gradeCold(op) { return `<rect x="-300" y="-300" width="960" height="1240" fill="#1d3554" opacity="${op}" style="mix-blend-mode:multiply"/>`; }
function gradeWarm(op) { return `<rect x="-300" y="-300" width="960" height="1240" fill="#ffb347" opacity="${op}" style="mix-blend-mode:soft-light"/>`; }
function vign(op = .6) { return `<rect x="-300" y="-300" width="960" height="1240" fill="url(#gVig)" opacity="${op}"/>`; }

function rain(t, n = 80, o = {}) {
  const c = o.c || "#b8cde6", op = o.o ?? .45, len = o.len || 26, spd = o.spd || 950, ang = o.ang ?? .16, w = o.w || 1.4, seed = o.seed || 1;
  let s = `<g stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}">`;
  for (let i = 0; i < n; i++) {
    const v = .75 + hash(i * 5 + seed) * .5;
    const y = ((hash(i * 7 + seed) * 720 + t * spd * v) % 720) - 40;
    const x = ((hash(i * 3 + seed) * 440 - y * ang) % 440 + 440) % 440 - 40;
    s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - len * ang)}" y2="${f(y + len * v)}"/>`;
  }
  return s + "</g>";
}
function ripples(t, n, cx, cy, rx, ry, c = "#cfe0ff") {
  let s = `<g fill="none" stroke="${c}" stroke-width="1.2">`;
  for (let i = 0; i < n; i++) {
    const p = (t / 1.1 + hash(i * 9)) % 1, a = hash(i * 13) * 6.283, d = Math.sqrt(hash(i * 17));
    const x = cx + Math.cos(a) * rx * d * .85, y = cy + Math.sin(a) * ry * d * .85;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(2 + p * 16)}" ry="${f(1 + p * 6)}" opacity="${f((1 - p) * .55 * 100) / 100}"/>`;
  }
  return s + "</g>";
}
function bokeh(t, n, seed, o = {}) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = hash(i * 3 + seed) * 360, y = (o.y0 || 0) + hash(i * 5 + seed) * (o.h || 640);
    const r = (o.r || 18) * (.6 + hash(i * 7 + seed)), op = (o.op || .5) * (.6 + .4 * Math.sin(t * 1.3 + i));
    s += `<circle cx="${f(x + Math.sin(t * .4 + i) * 6)}" cy="${f(y)}" r="${f(r)}" fill="url(#${o.g || "gBokeh"})" opacity="${f(op * 100) / 100}"/>`;
  }
  return s;
}
function speedLines(t, op = .5, col = "#fff") {
  let s = `<g stroke="${col}" stroke-linecap="round" opacity="${op}">`;
  for (let i = 0; i < 28; i++) {
    const a = hash(i) * 6.283, r0 = 210 + hash(i * 3 + Math.floor(t * 12)) * 60;
    s += `<line x1="${f(180 + Math.cos(a) * r0)}" y1="${f(320 + Math.sin(a) * r0 * 1.6)}" x2="${f(180 + Math.cos(a) * 520)}" y2="${f(320 + Math.sin(a) * 900)}" stroke-width="${f(1 + hash(i * 7) * 3)}"/>`;
  }
  return s + "</g>";
}
/* comic-style pop label */
function popLabel(x, y, text, p, o = {}) {
  if (p <= 0) return "";
  const sc = eback(clamp(p * 1.6)), sz = o.size || 22, w = text.replace(/<[^>]+>/g, "").length * sz * .6 + 26;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${o.rot || -4}) scale(${f(sc * 100) / 100})">` +
    `<rect x="${f(-w / 2)}" y="${f(-sz * .95)}" width="${f(w)}" height="${f(sz * 1.5)}" rx="${o.rx ?? 8}" fill="${o.bg || "#ffd400"}" stroke="#111" stroke-width="3"/>` +
    txt(0, sz * .2, text, { size: sz, fill: o.fg || "#111", fam: o.fam }) + `</g>`;
}
function stamp(x, y, text, p, o = {}) {
  if (p <= 0) return "";
  const k = clamp(p * 3), sc = lerp(2.4, 1, eo(k)), op = Math.min(1, k * 1.5);
  const sz = o.size || 30, w = text.length * sz * .66 + 24;
  return `<g transform="translate(${x} ${y}) rotate(${o.rot ?? -12}) scale(${f(sc * 100) / 100})" opacity="${f(op * 100) / 100}">` +
    `<rect x="${f(-w / 2)}" y="${f(-sz * .9)}" width="${f(w)}" height="${f(sz * 1.45)}" rx="6" fill="none" stroke="${o.c || "#e0262b"}" stroke-width="5"/>` +
    txt(0, sz * .25, text, { size: sz, fill: o.c || "#e0262b", ls: 1 }) + `</g>`;
}

/* ---------- props ---------- */
function note(x, y, rot, s, op = 1) {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})" opacity="${op}">` +
    `<rect x="-52" y="-25" width="104" height="50" rx="3" fill="#4f84b8" stroke="${OL}" stroke-width="2"/><rect x="-47" y="-20" width="94" height="40" rx="2" fill="none" stroke="#9cc0e3" stroke-width="1.4"/>` +
    `<circle cx="-22" cy="0" r="13" fill="#6f9fcf"/><path d="M-30 0 q8 -8 16 0 q-8 8 -16 0" fill="#3e6f9f"/>` +
    `<text x="24" y="8" font-family="${FONT}" font-weight="900" font-size="20" fill="#e7f1fb" text-anchor="middle">100</text>` +
    `<text x="-42" y="-10" font-family="${FONT}" font-weight="700" font-size="7" fill="#dceaf7">R$</text></g>`;
}
function wallet(x, y, rot, s, o = {}) {
  const open = o.open || 0;
  let g = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})">`;
  if (open < .05) {
    g += `<rect x="-60" y="-38" width="120" height="76" rx="10" fill="#1a1715" stroke="${OL}" stroke-width="2.6"/><rect x="-53" y="-31" width="106" height="62" rx="7" fill="none" stroke="#3b3632" stroke-width="1.6" stroke-dasharray="4 3"/><path d="M-52 -18 h40" stroke="#4a4440" stroke-width="2"/>`;
    if (o.wet) g += `<path d="M-40 -30 h6 M20 -20 h5 M-10 24 h6" stroke="#dcefff" stroke-width="2" opacity=".6" stroke-linecap="round"/>`;
  } else {
    const sx = lerp(-1, 1, open);
    for (let i = 0; i < 6 && open > .45; i++) g += note(-6 + (i - 2.5) * 9, -46 - eo(pr(open, .45, 1)) * 40 + i * 2, (i - 2.5) * 6, .9);
    g += `<rect x="-112" y="-70" width="112" height="140" rx="10" fill="#1a1715" stroke="${OL}" stroke-width="2.6"/><rect x="-104" y="-62" width="96" height="124" rx="7" fill="none" stroke="#3b3632" stroke-width="1.6" stroke-dasharray="4 3"/>`;
    if (o.idCard) g += o.idCard;
    else g += `<rect x="-98" y="-40" width="84" height="52" rx="4" fill="#c9d8e2" opacity=".9" filter="url(#fBlur)"/>`;
    g += `<rect x="-98" y="24" width="84" height="9" rx="3" fill="#2a2522"/><rect x="-98" y="40" width="84" height="9" rx="3" fill="#2a2522"/>`;
    g += `<g transform="scale(${sx.toFixed(3)} 1)"><rect x="0" y="-70" width="112" height="140" rx="10" fill="${sx < 0 ? "#141110" : "#221e1b"}" stroke="${OL}" stroke-width="2.6"/><rect x="8" y="-62" width="96" height="124" rx="7" fill="none" stroke="#3b3632" stroke-width="1.6" stroke-dasharray="4 3"/></g>`;
  }
  return g + "</g>";
}
function idCard(reveal, t) {
  // driver licence style card with Ricardo's face — reveal 0..1 (blur → sharp)
  let g = `<g transform="translate(-56 -12)">`;
  g += `<rect x="-46" y="-30" width="92" height="60" rx="5" fill="#dfe9d6" stroke="${OL}" stroke-width="1.6"/><rect x="-46" y="-30" width="92" height="12" rx="4" fill="#3c7d4e"/>`;
  g += `<text x="0" y="-21" font-family="${FONT}" font-size="6.5" font-weight="900" fill="#fff" text-anchor="middle">CARTEIRA DE HABILITAÇÃO</text>`;
  g += `<rect x="-41" y="-14" width="26" height="34" fill="#c9d3c0"/>`;
  g += `<g transform="translate(-28 1) scale(.17)">${charBust("ric", 0, 0, 1, { top: "suit", lid: .8, t: 0, autoBlink: false, sneer: .4 })}</g>`;
  g += `<text x="-10" y="-6" font-family="${FONT}" font-size="5" font-weight="700" fill="#556">NOME</text>`;
  g += `<text x="-10" y="2" font-family="${FONT}" font-size="7.4" font-weight="900" fill="#111">RICARDO</text>`;
  g += `<text x="-10" y="10" font-family="${FONT}" font-size="6.4" font-weight="900" fill="#111">ALBUQUERQUE</text>`;
  g += `<path d="M-10 16 h40 M-10 21 h30" stroke="#9aa59a" stroke-width="2"/>`;
  g += `</g>`;
  const blur = (1 - reveal) * 4;
  return blur > .2 ? `<g filter="url(#fBlur)">${g}</g>` : g;
}
function sneaker(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 C-70 -30 -50 -44 -20 -44 L10 -44 C30 -30 60 -24 76 -10 L80 0 Z" fill="#8c8a84" stroke="${OL}" stroke-width="2.4"/>` +
    `<rect x="-74" y="-4" width="158" height="14" rx="6" fill="#e2ddd2" stroke="${OL}" stroke-width="2.2"/>` +
    `<path d="M-30 -44 L-6 -16 M-16 -44 L6 -22 M-2 -44 L18 -26" stroke="#e6e2d8" stroke-width="3"/>` +
    `<path d="M-66 -40 L-80 -260 L10 -260 L0 -40 Z" fill="#2f3b4d" stroke="${OL}" stroke-width="2.6"/><path d="M-70 -46 L2 -46" stroke="#24303f" stroke-width="6"/></g>`;
}
function phone(inner, o = {}) {
  const x = o.x ?? 180, y = o.y ?? 330, s = o.s || 1, [vx, vy] = o.vib ? shake(o.t * 6, o.vib) : [0, 0];
  const sk = o.skin || CAST.lucas.skin;
  let g = `<g transform="translate(${f(x + vx)} ${f(y + vy)}) scale(${s}) rotate(${o.rot || 0})">`;
  g += `<ellipse cx="-30" cy="250" rx="120" ry="80" fill="${sk}" stroke="${OL}" stroke-width="3"/>`;
  g += `<rect x="-120" y="-235" width="240" height="470" rx="36" fill="#0a0b0e" stroke="#000" stroke-width="4"/><rect x="-116" y="-231" width="232" height="462" rx="33" fill="none" stroke="#3a3f4b" stroke-width="2"/>`;
  g += `<g transform="translate(-108 -222)"><rect width="216" height="444" rx="26" fill="url(#gScreen)"/>${inner}</g>`;
  g += `<rect x="-30" y="-218" width="60" height="16" rx="8" fill="#000"/>`;
  g += `<rect x="-146" y="66" width="44" height="24" rx="12" fill="${sk}" stroke="${OL}" stroke-width="2.4" transform="rotate(-20 -122 81)"/>`;
  g += `<rect x="104" y="16" width="40" height="22" rx="11" fill="${sk}" stroke="${OL}" stroke-width="2.4"/><rect x="106" y="54" width="38" height="22" rx="11" fill="${sk}" stroke="${OL}" stroke-width="2.4"/>`;
  if (o.drops) for (let i = 0; i < 10; i++) g += `<circle cx="${f(-100 + hash(i * 3) * 200)}" cy="${f(-200 + hash(i * 5) * 400)}" r="${f(2 + hash(i) * 4)}" fill="#cfe2ff" opacity=".3"/>`;
  return g + "</g>";
}
function bubble(x, y, lines, p, o = {}) {
  const w = Math.min(196, Math.max(...lines.map(l => l.replace(/\*/g, "").length)) * 7.3 + 26), h = lines.length * 18 + 14;
  const sc = .6 + .4 * eback(clamp(p * 1.4));
  let g = `<g transform="translate(${x} ${y}) scale(${f(sc * 100) / 100})" opacity="${f(clamp(p * 3) * 100) / 100}">`;
  g += `<rect width="${f(w)}" height="${h}" rx="14" fill="${o.fill || "#262c38"}"/><path d="M0 ${h - 12} L-6 ${h} L10 ${h - 4} Z" fill="${o.fill || "#262c38"}"/>`;
  lines.forEach((l, i) => {
    const hl = l.startsWith("*");
    g += `<text x="13" y="${23 + i * 18}" font-family="Inter, sans-serif" font-size="13.4" font-weight="${hl ? 800 : 500}" fill="${hl ? "#ff4d4d" : "#eef1f6"}">${l.replace(/\*/g, "")}</text>`;
  });
  return g + "</g>";
}
function typing(x, y, t) {
  let g = `<g transform="translate(${x} ${y})"><rect width="54" height="30" rx="14" fill="#262c38"/>`;
  for (let i = 0; i < 3; i++) g += `<circle cx="${15 + i * 12}" cy="15" r="3.6" fill="#a6aebd" opacity="${f((.4 + .6 * Math.max(0, Math.sin(t * 8 - i))) * 100) / 100}"/>`;
  return g + "</g>";
}
function chatHeader(status) {
  return `<rect width="216" height="58" fill="#141821"/><circle cx="30" cy="34" r="15" fill="#3a1d22"/>` +
    `<text x="30" y="40" font-family="Inter, sans-serif" font-size="16" font-weight="800" fill="#ff6b6b" text-anchor="middle">?</text>` +
    `<text x="54" y="31" font-family="Inter, sans-serif" font-size="12.5" font-weight="700" fill="#eef1f6">Número desconhecido</text>` +
    `<text x="54" y="46" font-family="Inter, sans-serif" font-size="10.5" fill="${status === "digitando…" ? "#7fd18b" : "#9aa3b5"}">${status}</text>`;
}
function chatScreen(T, msgs) {
  const typingNow = msgs.some(m => T >= m.t - .9 && T < m.t);
  let g = chatHeader(typingNow ? "digitando…" : "online");
  let y = 74;
  for (const m of msgs) {
    if (T < m.t - .9) break;
    if (T < m.t) { g += typing(14, y, T); break; }
    g += bubble(14, y, m.l, pr(T, m.t, m.t + .35));
    y += m.l.length * 18 + 26;
  }
  return g;
}
function bike(x, y, s, wa, broken, t) {
  const sp = (cx) => { let r = ""; for (let i = 0; i < 4; i++) { const a = wa + i * Math.PI / 4; r += `<line x1="${f(cx + Math.cos(a) * 20)}" y1="${f(34 + Math.sin(a) * 20)}" x2="${f(cx - Math.cos(a) * 20)}" y2="${f(34 - Math.sin(a) * 20)}"/>`; } return r; };
  let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${s})" stroke-linecap="round" stroke-linejoin="round">`;
  g += `<g fill="none" stroke="#15171b" stroke-width="6"><circle cx="-32" cy="34" r="22"/><circle cx="50" cy="34" r="22"/></g>`;
  g += `<g stroke="#8a8f99" stroke-width="1">${sp(-32)}${sp(50)}</g>`;
  g += `<path d="M-32 34 L-2 -6 L40 -6 L50 34 M-2 -6 L10 30 L40 -6 M-32 34 L10 30" fill="none" stroke="${OL}" stroke-width="7.5"/><path d="M-32 34 L-2 -6 L40 -6 L50 34 M-2 -6 L10 30 L40 -6 M-32 34 L10 30" fill="none" stroke="#2f7ea3" stroke-width="4.5"/>`;
  g += `<path d="M44 -6 L46 -20 L58 -22" fill="none" stroke="#202227" stroke-width="4"/><path d="M-12 -10 h18" stroke="#202227" stroke-width="6"/>`;
  if (broken) { const sw = Math.sin(t * 3) * 3; g += `<path d="M10 30 Q${f(-6 + sw)} 52 ${f(-14 + sw)} 58" fill="none" stroke="#6b6f78" stroke-width="2" stroke-dasharray="3 2"/>`; }
  else g += `<path d="M10 30 L-32 34" stroke="#6b6f78" stroke-width="2" stroke-dasharray="3 2"/>`;
  return g + "</g>";
}
function ik(hx, hy, fx, fy, a, b) {
  const dx = fx - hx, dy = fy - hy, d = Math.min(Math.hypot(dx, dy), a + b - .01);
  const th = Math.atan2(dy, dx), al = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const k1 = [hx + a * Math.cos(th - al), hy + a * Math.sin(th - al)], k2 = [hx + a * Math.cos(th + al), hy + a * Math.sin(th + al)];
  return k1[0] > k2[0] ? k1 : k2;
}
function sideMan(x, y, s, pose, ph, o = {}) {
  const C = CAST.lucas, skin = C.skin, sh = o.wet ? "#3f5f59" : "#4f8279", jeans = "#2c3747";
  const lean = pose === "ride" ? 14 : (o.slump ? 10 : 4);
  const hip = [0, 0], shd = [lean * .9, -58], head = [lean * 1.25 + 6, -84 + (o.headDown || 0)];
  const leg = (foot, col) => { const k = ik(hip[0], hip[1], foot[0], foot[1], 36, 36); return `<path d="M0 0 L${f(k[0])} ${f(k[1])} L${f(foot[0])} ${f(foot[1])}" stroke="${OL}" stroke-width="14" fill="none"/><path d="M0 0 L${f(k[0])} ${f(k[1])} L${f(foot[0])} ${f(foot[1])}" stroke="${col}" stroke-width="10" fill="none"/><ellipse cx="${f(foot[0] + 6)}" cy="${f(foot[1] + 2)}" rx="10" ry="5" fill="#e2ddd2" stroke="${OL}" stroke-width="2"/>`; };
  let far, near;
  if (pose === "ride") { const pc = [12, 36], r = 14; far = leg([pc[0] + Math.cos(ph + Math.PI) * r, pc[1] + Math.sin(ph + Math.PI) * r], "#1f2733"); near = leg([pc[0] + Math.cos(ph) * r, pc[1] + Math.sin(ph) * r], jeans); }
  else { const st = (p) => [Math.sin(p) * 16, 68 - Math.max(0, Math.cos(p)) * 7]; far = leg(st(ph + Math.PI), "#1f2733"); near = leg(st(ph), jeans); }
  const handT = o.hand || [44, -40], el = [(shd[0] + handT[0]) / 2, (shd[1] + handT[1]) / 2 + 8];
  let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${s})" stroke-linecap="round" stroke-linejoin="round">`;
  g += far;
  g += `<g transform="rotate(${lean * .6} ${f(shd[0] - 25)} -46)"><rect x="${f(shd[0] - 44)}" y="-70" width="34" height="44" rx="6" fill="#b33a2c" stroke="${OL}" stroke-width="2.4"/><rect x="${f(shd[0] - 44)}" y="-70" width="34" height="10" rx="5" fill="#d0503f"/><text x="${f(shd[0] - 27)}" y="-40" font-family="${FONT}" font-size="9" font-weight="900" fill="#fff" text-anchor="middle">FOME</text></g>`;
  g += `<path d="M0 0 L${f(shd[0])} ${f(shd[1])}" stroke="${OL}" stroke-width="26"/><path d="M0 0 L${f(shd[0])} ${f(shd[1])}" stroke="${sh}" stroke-width="21"/>`;
  g += `<circle cx="${f(head[0])}" cy="${f(head[1])}" r="16" fill="${skin}" stroke="${OL}" stroke-width="2.4"/>`;
  g += `<circle cx="${f(head[0] + 8)}" cy="${f(head[1] - 2)}" r="2" fill="${OL}"/>`;
  let hb = ""; for (let k = 0; k < 8; k++) { const a = Math.PI * (1.0 + .95 * k / 7); hb += `<circle cx="${f(head[0] - 2 + Math.cos(a) * 14)}" cy="${f(head[1] - 3 + Math.sin(a) * 14)}" r="7"/>`; }
  g += `<g fill="${C.hairC}" stroke="${OL}" stroke-width="3">${hb}</g><g fill="${C.hairC}">${hb}</g><circle cx="${f(head[0] - 10)}" cy="${f(head[1] + 1)}" r="7" fill="${C.hairC}"/>`;
  g += near;
  g += `<path d="M${f(shd[0])} ${f(shd[1] + 4)} L${f(el[0])} ${f(el[1])} L${f(handT[0])} ${f(handT[1])}" stroke="${OL}" stroke-width="12" fill="none"/><path d="M${f(shd[0])} ${f(shd[1] + 4)} L${f(el[0])} ${f(el[1])} L${f(handT[0])} ${f(handT[1])}" stroke="${sh}" stroke-width="8" fill="none"/><circle cx="${f(handT[0])}" cy="${f(handT[1])}" r="5.5" fill="${skin}" stroke="${OL}" stroke-width="2"/>`;
  return g + "</g>";
}

/* ---------- environments ---------- */
function houses(off, y0, n, hBase, seed, sc, col) {
  let s = ""; const span = n * 64;
  for (let i = 0; i < n; i++) {
    const w = 54 + hash(i + seed) * 26, h = hBase + hash(i * 3 + seed) * hBase * .9;
    const x = ((i * 64 - off) % span + span) % span - 70, c = col[Math.floor(hash(i * 11 + seed) * col.length)];
    s += `<rect x="${f(x)}" y="${f(y0 - h)}" width="${f(w)}" height="${f(h)}" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>`;
    s += `<rect x="${f(x - 3)}" y="${f(y0 - h - 5)}" width="${f(w + 6)}" height="6" fill="rgba(0,0,0,.3)"/>`;
    for (let r = 0; r < Math.floor(h / 30); r++) for (let k = 0; k < 2; k++) {
      const lit = hash(i * 7 + r * 3 + k + seed) > .6;
      s += `<rect x="${f(x + 10 + k * (w / 2 - 4))}" y="${f(y0 - h + 12 + r * 30)}" width="${f(sc * 12)}" height="${f(sc * 12)}" fill="${lit ? "#f6c77f" : "rgba(20,20,30,.45)"}"/>`;
    }
  }
  return s;
}
function chandelier(cx, cy, s, t) {
  let g = `<g transform="translate(${cx} ${cy}) scale(${s})"><line x1="0" y1="-200" x2="0" y2="-40" stroke="#c9a04a" stroke-width="3"/>`;
  g += `<circle r="70" fill="url(#gBokeh)" opacity=".8"/><ellipse cy="-10" rx="56" ry="12" fill="none" stroke="#d9b45c" stroke-width="5"/><ellipse cy="14" rx="38" ry="9" fill="none" stroke="#d9b45c" stroke-width="4"/>`;
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * 6.283, x = Math.cos(a) * 54, y = -10 + Math.sin(a) * 11, tw = .5 + .5 * Math.sin(t * 3 + i * 1.7);
    g += `<path d="M${f(x)} ${f(y)} l-3 10 l3 8 l3 -8 Z" fill="#fff6d8" opacity="${f((.55 + .45 * tw) * 100) / 100}"/>`;
    if (i % 3 === 0) g += `<circle cx="${f(x)}" cy="${f(y + 12)}" r="${f(1.5 + tw * 2.5)}" fill="#fff"/>`;
  }
  return g + "</g>";
}
function mansionBg() {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gGold)"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${i * 110 - 20}" y="60" width="28" height="560" fill="#5a3b14" opacity=".5"/><rect x="${i * 110 - 26}" y="60" width="40" height="14" fill="#c9a04a" opacity=".6"/>`;
  s += `<rect x="-40" y="100" width="440" height="3" fill="#c9a04a" opacity=".5"/>`;
  s += `<rect x="40" y="150" width="70" height="90" fill="#3b2410" stroke="#c9a04a" stroke-width="3" opacity=".7"/><rect x="250" y="140" width="80" height="100" fill="#3b2410" stroke="#c9a04a" stroke-width="3" opacity=".7"/>`;
  return s;
}
function streetNight(off) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gNight)"/>`;
  s += houses(off * 8, 420, 8, 150, 13, .9, ["#121a27", "#162030", "#0f1621"]);
  s += `<rect x="270" y="150" width="7" height="300" fill="#202a38"/><path d="M273 150 q-30 0 -40 14" stroke="#202a38" stroke-width="6" fill="none"/><ellipse cx="232" cy="168" rx="12" ry="5" fill="#ffd27a"/>`;
  s += `<path d="M232 170 L150 460 L330 460 Z" fill="#ffd27a" opacity=".1"/><circle cx="232" cy="170" r="80" fill="url(#gLamp)"/>`;
  s += `<rect x="-40" y="440" width="440" height="240" fill="#0d131d"/>`;
  s += `<rect x="215" y="470" width="34" height="170" fill="#ffd27a" opacity=".12"/>`;
  return s;
}
function table(y, o = {}) {
  return `<rect x="-60" y="${y}" width="480" height="300" fill="url(#gCloth)" stroke="${OL}" stroke-width="2.6"/><rect x="-60" y="${y}" width="480" height="10" fill="#fff" opacity=".5"/>` +
    (o.plate ? `<ellipse cx="${o.plate}" cy="${y + 40}" rx="56" ry="16" fill="#fbf8f1" stroke="#d6b65a" stroke-width="3"/><path d="M${o.plate - 20} ${y + 38} q20 -10 40 0 q-20 10 -40 0" fill="#7a4b2e"/>` : "");
}

/* ---------- shots ---------- */
const SH = {};
/* HOOK: wallet opening in the rain, cash fans out */
SH.walletHook = (lt, d, T) => {
  const open = ease(pr(lt, .2, 1.6));
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gNight)"/><circle cx="260" cy="40" r="300" fill="url(#gLamp)"/>`;
  s += bokeh(lt, 8, 2, { r: 22, op: .35, h: 360 });
  let w = wallet(180, 360, 0, 1, { open, wet: true });
  const [ax, ay] = shake(lt * 1.7, 1.6), [bx, by] = shake(lt * 1.9 + 4, 1.6), sk = CAST.lucas.skin;
  w += handG(68 + ax, 440 + ay, 28, .95, sk, "#4f8279", { wet: true, curl: true });
  w += handG(180 + 112 * lerp(-1, 1, open) + 6 + bx, 440 + by, -28, .95, sk, "#4f8279", { wet: true, curl: true });
  s += cam(w, { z: lerp(1.05, 1.45, ease(pr(lt, 0, d))) + .08 * Math.max(0, 1 - Math.abs(lt - 1.6) * 5), cy: 340, t: lt, sh: 1.3 });
  s += rain(lt * .6, 80, { o: .4, seed: 3 });
  const pp = pr(lt, 1.5, 1.9);
  if (pp > 0) s += `<g transform="translate(180 150) scale(${f(eback(pp) * 100) / 100})">${txt(0, 0, "R$ 10.000", { size: 52, fill: "#7dff9b", stroke: "#06210f", sw: 9, ls: 1 })}</g>`;
  return s + gradeWarm(.18) + vign(.7);
};
/* Lucas crouched in the rain, wallet in hand (first face of the story) */
SH.lucasRainWallet = (lt, d, T) => {
  let s = streetNight(0) + full("#000", .25);
  s += charBust("lucas", 180, 360, 1.5, { t: T, top: "tee", wet: true, look: [0, .8], lid: 1.15, brow: { raise: .9 }, open: .25, pupilShrink: true, rim: "#9cc3ff", lightSide: 1, talk: talkAmp(T, "L") * .6 });
  s += wallet(180, 600, -8, 1.05, { wet: true });
  s += handG(110, 640, 20, .9, CAST.lucas.skin, "#3f5f59", { wet: true, curl: true }) + handG(255, 640, -20, .9, CAST.lucas.skin, "#3f5f59", { wet: true, curl: true });
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 360, t: lt, sh: 1.2 });
  return s + rain(lt, 100, { o: .5, seed: 7 }) + gradeCold(.4) + vign(.7);
};
/* unknown message on phone */
SH.phoneThreat = (lt, d, T, seg) => {
  const P = seg.phrases;
  const t0 = P[0].a, t1 = P[1] ? P[1].a : P[0].b;
  let inner = `<rect width="216" height="444" rx="26" fill="#0f1420"/>` + chatHeader(T < t0 ? "digitando…" : "online");
  if (T < t0) inner += typing(14, 74, T);
  else inner += bubble(14, 74, ["Devolva… ou fique."], pr(T, t0, t0 + .35));
  if (T >= t1 - .6 && T < t1) inner += typing(14, 120, T);
  if (T >= t1) inner += bubble(14, 120, ["*Eu vou saber.*"], pr(T, t1, t1 + .35), { fill: "#3a1418" });
  let s = streetNight(0) + full("#000", .55);
  const vib = (T > seg.a - .3 && T < seg.a + .4) || (T > t1 && T < t1 + .4) ? 3 : 0;
  s += phone(inner, { x: 180, y: 340, s: .98, t: lt, drops: true, vib });
  const z = lerp(1.0, 1.08, ease(lt / d)) + (T > t1 ? ease(pr(T, t1, t1 + .3)) * .55 : 0);
  s = cam(s, { z, cy: T > t1 ? lerp(330, 205, ease(pr(T, t1, t1 + .3))) : 330, cx: T > t1 ? lerp(180, 135, ease(pr(T, t1, t1 + .3))) : 180, t: lt, sh: 1.1 });
  s += rain(lt, 50, { o: .25, seed: 13 }) + gradeCold(.2);
  if (T > t1) s += full("#ff0000", .12 * (1 - pr(T, t1, t1 + .5)));
  return s + vign(.75);
};
/* someone is watching: wide street, Lucas foreground, silhouette under far lamp */
SH.watcher = (lt, d, T) => {
  let s = streetNight(lt * .2);
  // silhouette
  const sx = 250, sy = 400;
  s += `<g transform="translate(${sx} ${sy})"><path d="M-14 0 C-16 -40 -12 -60 0 -62 C12 -60 16 -40 14 0 L18 60 L-18 60 Z" fill="#05070b"/><circle cx="0" cy="-74" r="11" fill="#05070b"/><path d="M-12 -82 q12 -12 24 0 v6 h-24 Z" fill="#05070b"/>` +
    `<rect x="6" y="-56" width="7" height="12" rx="2" fill="#bfe3ff" opacity="${f((.6 + .4 * Math.sin(lt * 6)) * 100) / 100}"/><circle cx="9" cy="-52" r="16" fill="url(#gLampCold)" opacity=".9"/></g>`;
  const p = pr(lt, .5, .9);
  if (p > 0) s += `<circle cx="${sx}" cy="${sy - 30}" r="${f(lerp(80, 52, eo(p)))}" fill="none" stroke="#ff3b3b" stroke-width="4" opacity="${f(eo(p) * 100) / 100}"/>` + popLabel(sx, sy - 105, "QUEM?", p, { bg: "#ff3b3b", fg: "#fff", size: 18 });
  // Lucas back-of-head over shoulder foreground
  s += charBust("lucas", 70, 560, 1.15, { t: T, top: "tee", wet: true, turn: .85, look: [1, 0], lid: 1.2, brow: { raise: 1 }, open: .2, rim: "#9cc3ff" });
  s = cam(s, { z: lerp(1.0, 1.18, ease(lt / d)), cx: lerp(180, 205, ease(lt / d)), cy: 400, t: lt, sh: 1.2 });
  return s + rain(lt, 90, { o: .45, seed: 5 }) + gradeCold(.4) + vign(.75);
};
/* Lucas close-up turning to camera */
SH.lucasTurn = (lt, d, T) => {
  let s = streetNight(0) + full("#000", .35);
  const tr = ease(pr(lt, 0, .6));
  s += charBust("lucas", 180, 342, 1.55, { t: T, top: "tee", wet: true, turn: lerp(.7, 0, tr), look: [lerp(1, 0, tr), 0], lid: .95, brow: { angry: .35, sad: .4 }, smile: -.25, talk: talkAmp(T, "L"), rim: "#9cc3ff", wetEyes: true });
  s = cam(s, { z: lerp(1.0, 1.15, ease(lt / d)), cy: 330, t: lt, sh: .9 });
  return s + rain(lt, 70, { o: .4, seed: 9 }) + gradeCold(.35) + vign(.7);
};
/* "48 HORAS ANTES" rewind glitch */
SH.glitch = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#050608"/>`;
  for (let i = 0; i < 14; i++) { const y = (hash(i + Math.floor(lt * 20)) * 640); s += `<rect x="-40" y="${f(y)}" width="440" height="${f(2 + hash(i * 3) * 10)}" fill="#fff" opacity="${f(hash(i * 7) * .12 * 100) / 100}"/>`; }
  const g = Math.sin(lt * 90) * 5 * (1 - pr(lt, .2, .5));
  s += txt(180 + g, 322, "48 HORAS ANTES", { size: 36, fill: "#ff3b3b", op: .7, ls: 2 }) + txt(180 - g, 318, "48 HORAS ANTES", { size: 36, fill: "#38e1ff", op: .7, ls: 2 }) + txt(180, 320, "48 HORAS ANTES", { size: 36, ls: 2 });
  s += txt(180, 360, "◀◀", { size: 22, fill: "#fff", op: .5 + .5 * Math.sin(lt * 12) });
  return s;
};
/* delivery ride through the favela at dusk */
SH.ride = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gDusk)"/><circle cx="90" cy="250" r="34" fill="#f2b98a" opacity=".55"/>`;
  s += houses(lt * 10, 380, 9, 70, 1, .8, ["#6e5f66", "#7b6a62", "#5f6470", "#806a5c"]);
  s += `<rect x="-40" y="378" width="440" height="12" fill="#4e4448"/>`;
  s += houses(lt * 42, 470, 8, 110, 7, 1, ["#9c7b68", "#7f8b84", "#a68c6c", "#727892", "#a07a72", "#8d6f5d"]);
  for (let i = 0; i < 3; i++) { const x = ((i * 160 - lt * 42) % 480 + 480) % 480 - 60; s += `<path d="M${f(x)} 300 Q${f(x + 80)} 330 ${f(x + 160)} 300" stroke="#1e1a1f" stroke-width="1.4" fill="none"/><rect x="${f(x)}" y="290" width="5" height="190" fill="#3a3237"/>`; }
  s += `<rect x="-40" y="470" width="440" height="210" fill="#3a3a40"/><rect x="-40" y="470" width="440" height="8" fill="#5b5a5f"/>`;
  for (let i = 0; i < 6; i++) { const x = ((i * 80 - lt * 120) % 480 + 480) % 480 - 60; s += `<rect x="${f(x)}" y="560" width="40" height="5" fill="#77767a" opacity=".6"/>`; }
  const ph = lt * 7, bob = Math.sin(ph * 2) * 1.2;
  s += `<ellipse cx="185" cy="530" rx="90" ry="8" fill="#000" opacity=".25"/>`;
  s += bike(170, 460 + bob, 1.25, -lt * 9, false, lt) + sideMan(168, 452 + bob, 1.25, "ride", ph, { hand: [60, -24] });
  s = cam(s, { z: lerp(1.0, 1.1, lt / d), cy: 400, t: lt, sh: .8 });
  const p1 = seg.phrases[1] ? pr(T, seg.phrases[1].a, seg.phrases[1].a + .4) : 0;
  s += popLabel(250, 200, "R$ 60/dia", p1, { bg: "#7dff9b", size: 22, rot: 6 });
  return s + gradeWarm(.15) + `<rect x="-40" y="-40" width="440" height="720" fill="#38304a" opacity=".16"/>` + vign(.5);
};
/* sick mother in the kitchen */
SH.kitchen = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gKitchen)"/>`;
  for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) s += `<rect x="${c * 46 + (r % 2) * 23 - 10}" y="${180 + r * 30}" width="44" height="28" fill="#5d6a69" opacity=".35"/>`;
  s += `<rect x="40" y="70" width="110" height="90" fill="#1d2430"/><path d="M95 70 v90 M40 115 h110" stroke="#56605f" stroke-width="5"/><rect x="34" y="64" width="122" height="102" fill="none" stroke="#56605f" stroke-width="6"/>`;
  s += `<line x1="180" y1="0" x2="180" y2="60" stroke="#222" stroke-width="2"/><circle cx="180" cy="66" r="9" fill="#fff6c9"/><circle cx="180" cy="66" r="80" fill="url(#gLamp)" opacity=".5"/>`;
  s += `<rect x="236" y="300" width="22" height="34" rx="4" fill="#e6b03a" stroke="${OL}" stroke-width="2"/><rect x="232" y="296" width="30" height="8" rx="3" fill="#fff" stroke="${OL}" stroke-width="2"/><text x="247" y="322" font-family="${FONT}" font-size="7" font-weight="900" fill="${OL}" text-anchor="middle">Rx</text>`;
  const cough = (lt % 2.2) < .9;
  const [cx, cy] = cough ? shake(lt * 3, 2.2) : [0, 0];
  s += charBust("maeL", 170 + cx, 380 + cy, 1.15, { t: T, top: "simple", smile: -.5, open: cough ? .5 : 0, brow: { sad: .9 }, lid: cough ? .1 : .7, look: [.3, .4], tilt: cough ? 8 : 3 });
  if (cough) s += handG(205 + cx, 480 + cy, -30, .55, CAST.maeL.skin, "#6d7f93", { curl: true });
  s += `<rect x="-40" y="580" width="440" height="100" fill="#5a4636" stroke="${OL}" stroke-width="2"/><rect x="40" y="540" width="34" height="40" rx="4" fill="#d7d2c4" stroke="${OL}" stroke-width="2"/>`;
  s = cam(s, { z: lerp(1.05, 1.18, ease(lt / d)), cy: 380, t: lt, sh: .7 });
  return s + gradeCold(.3) + vign(.7);
};
/* eviction notice slam */
SH.eviction = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#3c4446"/>`;
  s += `<g transform="rotate(-3 180 320)"><rect x="70" y="170" width="220" height="290" fill="#f3efe4" stroke="${OL}" stroke-width="3"/><rect x="70" y="170" width="220" height="44" fill="#b3261e"/>` +
    txt(180, 200, "AVISO DE DESPEJO", { size: 19, fill: "#fff" }) + txt(180, 268, "R$ 3.800", { size: 42, fill: "#b3261e" }) +
    `<path d="M95 300 h170 M95 320 h140 M95 340 h160 M95 360 h110 M95 380 h150" stroke="#9a968c" stroke-width="4"/><circle cx="180" cy="176" r="9" fill="#d9483b" stroke="${OL}" stroke-width="2"/></g>`;
  const P = seg.phrases;
  const st = P[3] ? pr(T, P[3].a + (P[3].b - P[3].a) * .25, P[3].a + (P[3].b - P[3].a) * .25 + .35) : 0;
  s += stamp(190, 410, "7 DIAS", st, { size: 40 });
  s = cam(s, { z: lerp(1.1, 1.35, ease(lt / d)) + (st > 0 && st < 1 ? .05 * (1 - st) : 0), cy: 320, t: lt, sh: st > 0 && st < .5 ? 3 : .5 });
  const ru = P[4] ? pr(T, P[4].a, P[4].a + .3) : 0;
  if (ru > 0) s += full("#000", .45 * ru) + popLabel(180, 540, "OU A RUA.", ru, { bg: "#ff3b3b", fg: "#fff", size: 26 });
  return s + gradeCold(.25) + vign(.8);
};
/* meeting Isabela at the mansion gate */
SH.gate = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gWarm)"/>`;
  s += `<rect x="-40" y="120" width="440" height="560" fill="#e9dcc4"/><rect x="-40" y="120" width="440" height="14" fill="#cdb995"/>`;
  s += `<circle cx="40" cy="170" r="40" fill="url(#gBokeh)"/><circle cx="330" cy="200" r="34" fill="url(#gBokeh)"/>`;
  let bars = ""; for (let i = 0; i < 14; i++) bars += `<rect x="${i * 30 - 4}" y="150" width="7" height="420" fill="#4a3b26"/><circle cx="${i * 30}" cy="146" r="5" fill="#c9a04a"/>`;
  s += `<g opacity=".85">${bars}</g><rect x="-40" y="230" width="440" height="7" fill="#4a3b26"/><rect x="-40" y="540" width="440" height="140" fill="#b9a68a"/>`;
  const look = lt > 1.0;
  s += charBust("lucas", 95, 420, .82, { t: T, top: "tee", look: [.9, .1], turn: .35, smile: look ? .7 : .2, smileEyes: look ? .4 : 0, blush: look ? .6 : 0, talk: 0 });
  s += charBust("isa", 268, 424, .8, { t: T, top: "blouse", look: [-.9, .1], turn: -.35, smile: .7, blush: lt > .7 ? .6 : 0, smileEyes: lt > 1.4 ? .5 : 0 });
  const reach = ease(pr(lt, .3, 1.3)), bx = lerp(150, 182, reach);
  s += `<g transform="translate(${f(bx)} 500)"><path d="M-14 -20 Q0 -44 14 -20" stroke="#8a6a44" stroke-width="3" fill="none"/><rect x="-26" y="-22" width="52" height="58" rx="3" fill="#c79a62" stroke="${OL}" stroke-width="2.4"/><rect x="-26" y="-22" width="52" height="8" fill="#a97d48"/></g>`;
  // floating hearts
  for (let i = 0; i < 4; i++) { const p = ((lt - 1 - i * .35) / 2); if (p > 0 && p < 1) s += txt(180 + Math.sin(i * 2 + lt * 2) * 20, 400 - p * 120, "♥", { size: 18 + i * 3, fill: "#ff5d7a", op: 1 - p }); }
  s = cam(s, { z: lerp(1.05, 1.16, lt / d), cy: 400, t: lt, sh: .4 });
  return s + gradeWarm(.3) + vign(.45);
};
/* both laughing together (bus/açaí montage) */
SH.together = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#e8b47a"/>` + bokeh(lt, 12, 8, { r: 30, op: .55, h: 400 });
  const b1 = Math.abs(Math.sin(lt * 8)) * 3, b2 = Math.abs(Math.sin(lt * 8 + 1)) * 3;
  s += charBust("lucas", 100, 380 - b1, .86, { t: T, top: "tee", turn: .3, open: .55, smile: .9, smileEyes: .9, lid: .1, tilt: -6, blush: .5 });
  s += charBust("isa", 262, 384 - b2, .84, { t: T, top: "blouse", turn: -.3, open: .5, smile: .9, smileEyes: .9, lid: .1, tilt: 8, blush: .7 });
  s += `<rect x="-40" y="520" width="440" height="160" fill="#c78a52" stroke="${OL}" stroke-width="2"/><path d="M130 520 Q180 590 230 520 Z" fill="#f2f2ee" stroke="${OL}" stroke-width="2"/><ellipse cx="180" cy="520" rx="50" ry="12" fill="#4b1f4f" stroke="${OL}" stroke-width="2"/><circle cx="168" cy="516" r="6" fill="#e64b5c"/><circle cx="192" cy="519" r="5" fill="#f3d36b"/>`;
  s = cam(s, { z: lerp(1.0, 1.12, lt / d), cy: 420, t: lt, sh: .4 });
  return s + gradeWarm(.3) + vign(.4);
};
/* notification: dinner invite */
SH.invite = (lt, d, T) => {
  const sl = eo(pr(lt, .15, .55));
  let inner = `<rect width="216" height="444" rx="26" fill="#18202e"/><circle cx="160" cy="330" r="110" fill="#2f4766" opacity=".6"/>` +
    `<text x="108" y="104" font-family="Inter, sans-serif" font-size="50" font-weight="300" fill="#fff" text-anchor="middle">19:12</text>` +
    `<text x="108" y="130" font-family="Inter, sans-serif" font-size="12" fill="#c5cbe0" text-anchor="middle">quinta-feira</text>`;
  inner += `<g transform="translate(10 ${f(lerp(120, 156, sl))})" opacity="${f(sl * 100) / 100}"><rect width="196" height="74" rx="16" fill="#eef1f6" opacity=".95"/><rect x="12" y="14" width="26" height="26" rx="7" fill="#2ec46b"/><text x="25" y="32" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">I</text>` +
    `<text x="46" y="26" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#111">Isabela 💛</text><text x="182" y="26" font-family="Inter, sans-serif" font-size="10" fill="#666" text-anchor="end">agora</text>` +
    `<text x="46" y="46" font-family="Inter, sans-serif" font-size="12" fill="#222">Meu pai quer te conhecer.</text><text x="46" y="62" font-family="Inter, sans-serif" font-size="12" fill="#222">Jantar sábado 😬</text></g>`;
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#1a1410"/>` + bokeh(lt, 8, 12, { r: 30, op: .4 });
  s += phone(inner, { x: 180, y: 360, s: .95, vib: lt > .15 && lt < .8 ? 2.5 : 0, t: lt });
  s = cam(s, { z: lerp(1.0, 1.3, ease(pr(lt, .6, d))), cy: lerp(330, 220, ease(pr(lt, .6, d))), t: lt, sh: .4 });
  return s + gradeWarm(.2) + vign(.6);
};
/* dinner wide shot */
SH.dinnerWide = (lt, d, T) => {
  let s = mansionBg() + chandelier(180, 110, 1, lt);
  s += `<path d="M120 300 L240 300 L420 680 L-60 680 Z" fill="url(#gCloth)" stroke="${OL}" stroke-width="2"/>`;
  for (let i = 0; i < 3; i++) { const y = 360 + i * 80, fl = .7 + .3 * Math.sin(lt * 14 + i); s += `<rect x="178" y="${y - 30 - i * 10}" width="4" height="${30 + i * 10}" fill="#f4ecd6"/><ellipse cx="180" cy="${y - 34 - i * 10}" rx="${2.5 + i}" ry="${f(5 * fl + i)}" fill="#ffd27a"/><circle cx="180" cy="${y - 34 - i * 10}" r="${18 + i * 6}" fill="url(#gBokeh)" opacity=".5"/>`; }
  s += charBust("lucas", 150, 272, .3, { t: T, top: "shirt", look: [.3, .3], smile: -.1, sweat: true });
  s += charBust("isa", 212, 274, .29, { t: T, top: "blouse", look: [-.6, .3], smile: .1 });
  s += charBust("ric", 30, 560, .95, { t: T, top: "suit", turn: .55, look: [.9, -.3], lid: .7, brow: { angry: .3 }, sneer: .4 });
  s += charBust("maeI", 334, 560, .9, { t: T, top: "luxe", turn: -.55, look: [-.9, -.3], lid: .8, smile: .2, sneer: -.5 });
  s = cam(s, { z: lerp(1.0, 1.15, ease(lt / d)), cy: 330, t: lt, sh: .3 });
  return s + gradeWarm(.2) + vign(.55);
};
/* Ricardo close-up talking */
SH.ricardo = (lt, d, T, seg, o = {}) => {
  let s = mansionBg() + bokeh(lt, 10, 21, { r: 28, op: .5, h: 360 }) + `<g filter="url(#fSoft)">${chandelier(250, 90, .8, lt)}</g>`;
  const a = talkAmp(T, "R");
  s += charBust("ric", 180, 342, 1.5, { t: T, top: "suit", lid: .6, squint: .2, brow: { raiseL: .55 + a * .3, angry: .35 }, sneer: .75, smile: -.05, talk: a * .7, look: [-.25, .05], turn: .18, tilt: -3 + Math.sin(lt * 1.3) * 2, nod: a * 2, pocketGlow: o.glow || 0 });
  s += handG(70, 640, 15, .85, CAST.ric.skin, "#1f2a44", { watch: true, curl: true, cuff: "#f3f3f1" });
  s += table(610, {});
  s = cam(s, { z: lerp(1.02, 1.18, ease(lt / d)), cy: 330, t: lt, sh: .3 });
  return s + gradeWarm(.16) + vign(.6);
};
/* Lucas embarrassed reaction at the dinner */
SH.lucasEmbarrassed = (lt, d, T) => {
  let s = mansionBg() + `<g filter="url(#fSoft)">${chandelier(90, 80, .7, lt)}</g>` + bokeh(lt, 6, 51, { r: 26, op: .4, h: 300 });
  s += charBust("lucas", 180, 352, 1.5, { t: T, top: "shirt", look: [-.5, .5], turn: -.15, brow: { sad: .7, raise: .3 }, smile: -.15, sneer: .2, sweat: true, blush: .4, lid: .85, tilt: 2 });
  s += table(615, { plate: 180 });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 330, t: lt, sh: .5 });
  return s + gradeWarm(.12) + vign(.6);
};
/* mother laughing */
SH.maeLaugh = (lt, d, T) => {
  let s = mansionBg() + bokeh(lt, 9, 31, { r: 26, op: .5, h: 380 });
  const a = talkAmp(T, "M"), b = Math.abs(Math.sin(lt * 7)) * 3 * (a > .1 ? 1 : .3);
  s += charBust("maeI", 180, 342 - b, 1.45, { t: T, top: "luxe", open: Math.max(.45, a * .9), smile: .85, smileEyes: .9, lid: .15, teeth: true, tilt: 6 + Math.sin(lt * 7) * 2, turn: -.15 });
  s += handG(262, 500, -20, .66, CAST.maeI.skin, "#5e1b35", { curl: true, ring: true });
  s = cam(s, { z: lerp(1.05, 1.18, lt / d), cy: 330, t: lt, sh: .4 });
  return s + gradeWarm(.16) + vign(.6);
};
/* mother orders the plate removed; maid hand takes plate */
SH.maePlate = (lt, d, T) => {
  let s = mansionBg() + bokeh(lt, 8, 41, { r: 26, op: .5, h: 360 });
  const a = talkAmp(T, "M");
  s += charBust("maeI", 140, 345, 1.35, { t: T, top: "luxe", talk: a, lid: .52, squint: .2, sneer: -.7, smile: .2, brow: { raiseR: .7, angry: .2 }, look: [.9, .1], turn: .3, tilt: -6 });
  const p = ease(pr(lt, d * .45, d * .9));
  s += table(600, {});
  s += `<g transform="translate(${f(lerp(250, 470, p))} 625)"><ellipse rx="64" ry="16" fill="#fbf8f1" stroke="#d6b65a" stroke-width="4"/><path d="M-22 -2 q22 -10 44 0 q-22 10 -44 0" fill="#7a4b2e"/></g>`;
  s += handG(lerp(330, 540, p), 610, -90, 1, "#f6f6f6", "#151515", { curl: true, cuff: "#ffffff" });
  s = cam(s, { z: lerp(1.05, 1.15, lt / d), cy: 350, t: lt, sh: .3 });
  return s + gradeWarm(.16) + vign(.6);
};
/* Lucas confused by the silverware */
SH.forks = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#efe6d2"/>`;
  s += `<circle cx="200" cy="330" r="118" fill="#fbf8f1" stroke="#d6b65a" stroke-width="6"/><circle cx="200" cy="330" r="88" fill="none" stroke="#eadfc4" stroke-width="2"/>`;
  const fork = (x, y, l, lift = 0, rot = 0) => `<g transform="translate(${x} ${f(y - lift)}) rotate(${rot})"><rect x="-4" y="0" width="8" height="${l}" rx="4" fill="#d6dade" stroke="${OL}" stroke-width="1.6"/><path d="M-9 0 v-26 M-3 0 v-26 M3 0 v-26 M9 0 v-26 M-9 0 h18" stroke="#d6dade" stroke-width="3.5" stroke-linecap="round"/></g>`;
  const reach = ease(pr(lt, .1, 1)), lift = ease(pr(lt, 1.1, 1.6)) * 24;
  s += fork(40, 270, 150, lift, lift * .3) + fork(64, 262, 165) + fork(88, 254, 175);
  s += `<rect x="318" y="250" width="8" height="180" rx="4" fill="#d6dade" stroke="${OL}" stroke-width="1.6"/><rect x="336" y="240" width="8" height="190" rx="4" fill="#d6dade" stroke="${OL}" stroke-width="1.6"/>`;
  s += handG(lerp(-40, 40, reach), lerp(620, 440 - lift, reach), 15, .9, CAST.lucas.skin, "#f4f2ec", { curl: true, cuff: "#ffffff" });
  for (let i = 0; i < 3; i++) s += txt(90 + i * 16, 200 - Math.sin(lt * 4 + i) * 4, "?", { size: 26, fill: "#b3261e", op: pr(lt, .8 + i * .2, 1.1 + i * .2) });
  s = cam(s, { z: lerp(1.0, 1.25, ease(pr(lt, 0, d))), cx: lerp(180, 110, ease(pr(lt, .6, d))), cy: 330, t: lt, sh: .2 });
  return s + gradeWarm(.12) + vign(.5);
};
/* Lucas holds back: jaw tight, fist */
SH.lucasFist = (lt, d, T) => {
  let s = mansionBg() + bokeh(lt, 6, 61, { r: 26, op: .35, h: 300 });
  s += charBust("lucas", 180, 342, 1.5, { t: T, top: "shirt", look: [.6, .2], brow: { angry: .8 }, smile: -.35, lid: .75, wetEyes: true, talk: talkAmp(T, "L") * .35 });
  s += table(600, {});
  const sq = Math.sin(lt * 30) * .8;
  s += handG(275 + sq, 640, 0, .75, CAST.lucas.skin, "#f4f2ec", { fist: true, cuff: "#fff" });
  s = cam(s, { z: lerp(1.0, 1.14, ease(lt / d)), cy: 340, t: lt, sh: .6 });
  return s + gradeWarm(.08) + full("#20140a", .15) + vign(.65);
};
/* PLANT: Ricardo puts his thick wallet into his inner pocket */
SH.pocketPlant = (lt, d, T) => {
  let s = mansionBg() + bokeh(lt, 6, 71, { r: 24, op: .35, h: 300 });
  // torso close-up of the suit
  s += charBust("ric", 180, -40, 2.5, { t: T, top: "suit", lid: .6, sneer: .5 });
  const p = ease(pr(lt, .1, 1.1));
  const wx = lerp(330, 240, p), wy = lerp(700, 560, p);
  s += wallet(wx, wy, lerp(30, -8, p), .55, {});
  s += handG(wx + 6, wy + 40, lerp(-10, -30, p), .8, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1", curl: true });
  const q = pr(lt, 1.2, 1.5);
  if (q > 0) s += `<circle cx="244" cy="560" r="${f(lerp(90, 62, eo(q)))}" fill="none" stroke="#ff3b3b" stroke-width="5" opacity="${f(eo(q) * 100) / 100}"/>` + popLabel(180, 420, "👀 GUARDA ESSE DETALHE", q, { bg: "#ffd400", size: 17, rot: -3 });
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 420, t: lt, sh: .3 });
  return s + gradeWarm(.15) + vign(.6);
};
/* note thrown on the floor next to the sneaker */
SH.noteDrop = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gMarble)"/><path d="M-20 120 Q120 180 380 90 M-20 420 Q160 380 380 470 M60 640 Q100 400 300 -20" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/>`;
  s += sneaker(250, 580, 1.2);
  const fp = pr(lt, .25, Math.min(d, 2.6)), fe = eo(fp);
  const ny = lerp(-60, 560, fe), nx = 150 + Math.sin(lt * 1.9) * 40 * (1 - fe), rot = Math.sin(lt * 2.2) * 40 * (1 - fe) + 8;
  s += `<ellipse cx="${f(nx)}" cy="580" rx="${f(30 + fe * 20)}" ry="6" fill="#000" opacity="${f(fe * .25 * 100) / 100}"/>`;
  s += note(nx, ny, rot, 1.05);
  s += handG(110, lerp(-30, -90, pr(lt, .2, 1)), 180, .9, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1" });
  s = cam(s, { z: lerp(1.25, 1.05, ease(lt / d)), cy: lerp(260, 440, ease(pr(lt, 0, 2.6))), t: lt, sh: .2 });
  return s + gradeWarm(.15) + vign(.55);
};
/* note on the floor, close-up (humiliation beat) */
SH.noteFloor = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gMarble)"/>`;
  s += note(180, 340, 8, 2.2) + sneaker(330, 470, 1.3);
  s = cam(s, { z: lerp(1.0, 1.25, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  return s + full("#000", .15) + vign(.75);
};
/* Isabela silent, looking down */
SH.isaDown = (lt, d, T) => {
  const p = ease(pr(lt, .2, 1.4));
  let s = mansionBg() + bokeh(lt, 6, 61, { r: 26, op: .4, h: 300 });
  s += charBust("isa", 180, 352, 1.5, { t: T, top: "blouse", look: [lerp(-.8, 0, p), lerp(0, 1, p)], lid: lerp(1, .42, p), nod: p * 10, tilt: p * 4, smile: -.4, brow: { sad: .9 }, wetEyes: p > .5 });
  s = cam(s, { z: lerp(1.05, 1.22, ease(lt / d)), cy: 330, t: lt, sh: .25 });
  return s + full("#3a3f48", .3 * p) + vign(.7);
};
/* walking in the rain with the broken bike */
SH.rainWalk = (lt, d, T) => {
  let s = streetNight(lt);
  const x = lerp(70, 150, lt / d), ph = lt * 3.4;
  s += `<ellipse cx="${f(x + 40)}" cy="520" rx="90" ry="8" fill="#000" opacity=".4"/>`;
  s += bike(x + 52, 456, 1.2, -lt * 2.2, true, lt) + sideMan(x, 440, 1.2, "walk", ph, { wet: true, slump: true, headDown: 4, hand: [70, -36] });
  s += ripples(lt, 10, 180, 540, 170, 60);
  s = cam(s, { z: lerp(1.08, 1.2, lt / d), cy: 420, t: lt, sh: 1.6 });
  return s + rain(lt, 120, { o: .5, seed: 5 }) + gradeCold(.4) + vign(.7);
};
/* phone buzzing */
SH.phoneBuzz = (lt, d, T) => {
  const inner = `<rect width="216" height="444" rx="26" fill="#0f1420"/>` +
    `<text x="108" y="104" font-family="Inter, sans-serif" font-size="50" font-weight="300" fill="#fff" text-anchor="middle">23:58</text>` +
    `<g transform="translate(10 150)"><rect width="196" height="70" rx="16" fill="#e9ecf2" opacity=".95"/><circle cx="25" cy="27" r="13" fill="#3a1d22"/><text x="25" y="32" font-family="Inter, sans-serif" font-size="14" font-weight="800" fill="#ff6b6b" text-anchor="middle">?</text>` +
    `<text x="46" y="26" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#111">Número desconhecido</text><text x="46" y="47" font-family="Inter, sans-serif" font-size="12" fill="#333">Nova mensagem</text></g>`;
  let s = streetNight(0) + full("#000", .45);
  s += phone(inner, { x: 180, y: 350, s: .95, vib: (lt % 1.1) < .55 ? 3 : 0, t: lt, drops: true });
  s = cam(s, { z: lerp(1.0, 1.12, lt / d), cy: 330, t: lt, sh: 1.2 });
  return s + rain(lt, 60, { o: .3, seed: 11 }) + gradeCold(.3) + vign(.7);
};
/* chat with the unknown */
SH.chat = (lt, d, T, seg) => {
  const P = seg.phrases;
  const msgs = [{ t: P[0].a, l: ["Eu vi o que fizeram", "com você."] }, { t: P[1].a, l: ["Quer mudar de vida?"] }, { t: P[2].a, l: ["*Olhe pra baixo.*"] }];
  let s = streetNight(0) + full("#000", .5);
  const vib = msgs.some(m => T > m.t && T < m.t + .3) ? 2.2 : 0;
  s += phone(`<rect width="216" height="444" rx="26" fill="#0f1420"/>` + chatScreen(T, msgs), { x: 180, y: 340, s: .98, t: lt, drops: true, vib });
  s = cam(s, { z: lerp(1.04, 1.14, lt / d), cy: 330, t: lt, sh: 1 });
  return s + rain(lt, 50, { o: .25, seed: 13 }) + gradeCold(.22) + vign(.7);
};
/* Lucas looks down */
SH.lookDown = (lt, d, T) => {
  let s = streetNight(0) + full("#000", .3);
  const p = ease(pr(lt, 0, .5));
  s += charBust("lucas", 180, 342, 1.5, { t: T, top: "tee", wet: true, look: [0, lerp(0, 1, p)], lid: lerp(1.1, .65, p), nod: p * 12, brow: { raise: .6 }, open: .15, rim: "#9cc3ff" });
  s = cam(s, { z: lerp(1.0, 1.12, lt / d), cy: lerp(330, 380, p), t: lt, sh: 1.6 });
  return s + rain(lt, 90, { o: .45, seed: 17 }) + gradeCold(.45) + vign(.7);
};
/* pan down to wallet in the puddle */
SH.puddle = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="1180" fill="#0c1018"/>`;
  for (let i = 0; i < 160; i++) s += `<circle cx="${f(hash(i) * 360)}" cy="${f(hash(i * 2) * 1100)}" r="${f(.6 + hash(i * 3) * 1.4)}" fill="#2a3242"/>`;
  s += `<path d="M40 660 C20 580 120 540 200 556 C300 570 350 640 320 720 C290 800 160 820 90 780 C40 750 56 700 40 660 Z" fill="url(#gPuddle)" stroke="#000" stroke-width="2"/>`;
  s += `<ellipse cx="230" cy="620" rx="36" ry="18" fill="#ffd27a" opacity=".35" filter="url(#fSoft)"/><ellipse cx="230" cy="620" rx="10" ry="5" fill="#fff2c8" opacity=".8"/>`;
  s += ripples(lt, 12, 185, 680, 130, 90);
  s += wallet(160, 700, -12, .78, { wet: true });
  const p = ease(pr(lt, 0, Math.min(d, 1.8)));
  s = `<g transform="translate(0 ${f(lerp(-40, -420, p))})">${s}</g>`;
  s = cam(s, { z: lerp(1.0, 1.3, ease(pr(lt, 1.0, d))), cy: 300, t: lt, sh: 1.1 });
  return s + rain(lt, 60, { o: .3, seed: 19, ang: .02 }) + gradeCold(.35) + vign(.75);
};
/* wallet open: cash + counting */
SH.walletOpen = (lt, d, T, seg, o = {}) => {
  const open = o.idPhase ? 1 : ease(pr(lt, .1, 1.1));
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gNight)"/><circle cx="260" cy="40" r="300" fill="url(#gLampCold)"/>`;
  s += bokeh(lt, 7, 4, { r: 22, op: .35, g: "gLampCold", h: 320 });
  const idr = o.idPhase ? ease(pr(lt, .2, 1.0)) : 0;
  let w = wallet(180, 360, 0, 1, { open, wet: true, idCard: o.idPhase ? idCard(idr, lt) : null });
  const sk = CAST.lucas.skin, [ax, ay] = shake(lt * 1.7, 1.5);
  w += handG(68 + ax, 440 + ay, 28, .95, sk, "#3f5f59", { wet: true, curl: true }) + handG(298 + ax, 440 - ay, -28, .95, sk, "#3f5f59", { wet: true, curl: true });
  const z = o.idPhase ? lerp(1.3, 2.4, ease(pr(lt, .1, 1.2))) : lerp(1.1, 1.35, ease(lt / d));
  s += cam(w, { z, cx: o.idPhase ? lerp(180, 124, ease(pr(lt, .1, 1.2))) : 180, cy: o.idPhase ? lerp(350, 348, ease(pr(lt, .1, 1.2))) : 340, t: lt, sh: o.idPhase ? .6 : 1.2 });
  s += rain(lt * .5, 70, { o: .3, seed: 9 });
  if (!o.idPhase) {
    const cnt = Math.round(10000 * eo(pr(lt, .8, Math.min(d, 2.2))));
    if (lt > .8) s += txt(180, 150, `R$ ${cnt.toLocaleString("pt-BR")}`, { size: 44, fill: "#7dff9b", stroke: "#06210f", sw: 8 });
    const P = seg.phrases;
    if (P[2] && T > P[2].a) {
      const k = pr(T, P[2].a, P[2].a + .3);
      s += popLabel(110, 230, "🏠 ALUGUEL", k, { bg: "#fff", size: 16, rot: -6 }) + popLabel(250, 270, "💊 REMÉDIO", pr(T, P[2].a + .8, P[2].a + 1.1), { bg: "#fff", size: 16, rot: 5 });
    }
  }
  return s + gradeCold(o.idPhase ? .25 : .35) + vign(.7);
};
/* reveal flash: ID name + flashback of the pocket */
SH.reveal = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#0a0c12"/>`;
  s += `<g transform="translate(180 300) scale(${f(lerp(3.4, 3.0, ease(pr(lt, 0, d))) * 100) / 100})">${idCard(1, lt).replace('translate(-56 -12)', 'translate(0 0)')}</g>`;
  const k = pr(lt, .05, .3);
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#ff1a1a" opacity="${f((1 - k) * .35 * 100) / 100}"/>`;
  s += speedLines(lt, .25 * (1 - pr(lt, .4, 1.2)));
  if (lt > .25) s += popLabel(180, 470, "O PAI DELA!", pr(lt, .25, .55), { bg: "#ff3b3b", fg: "#fff", size: 30, rot: -5 });
  // flashback inset
  const fb = pr(lt, .9, 1.2);
  if (fb > 0) {
    s += `<g opacity="${f(fb * 100) / 100}" transform="translate(250 120) rotate(4)"><rect x="-80" y="-60" width="160" height="120" fill="#fff" stroke="#111" stroke-width="3"/>` +
      `<svg x="-74" y="-54" width="148" height="108" viewBox="120 440 240 175" preserveAspectRatio="xMidYMid slice">${SH.pocketPlant(1.6, 2, T)}</svg>` +
      `<rect x="-74" y="-54" width="148" height="108" fill="#d9b06b" opacity=".25"/>` + txt(0, 74, "LEMBRA?", { size: 14, fill: "#ffd400" }) + `</g>`;
  }
  return cam(s, { z: 1, t: lt, sh: (1 - pr(lt, 0, .6)) * 4 }) + vign(.75);
};
/* Lucas shocked */
SH.shock = (lt, d, T) => {
  let s = streetNight(0) + full("#000", .35);
  s += charBust("lucas", 180, 342, 1.55, { t: T, top: "tee", wet: true, lid: 1.32, pupilShrink: true, brow: { raise: 1.3 }, open: .45, talk: talkAmp(T, "L") * .5, rim: "#9cc3ff" });
  s = cam(s, { z: lerp(1.3, 1.05, eo(pr(lt, 0, .5))), cy: 330, t: lt, sh: 1.5 });
  return s + rain(lt, 80, { o: .45, seed: 21 }) + gradeCold(.4) + speedLines(lt, .18) + vign(.7);
};
/* final message again, eye reflection */
SH.phoneFinal = (lt, d, T, seg) => SH.phoneThreat(lt, d, T, seg);
/* Lucas to camera */
SH.lucasCam = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#06080c"/><circle cx="330" cy="200" r="260" fill="url(#gLampCold)"/>`;
  const a = talkAmp(T, "L");
  s += charBust("lucas", 180, 362, 1.55, { t: T, top: "tee", wet: true, lid: .92, brow: { raiseL: .4, sad: .2 }, talk: a, smile: .05, tilt: Math.sin(lt * 1.1) * 2, nod: a * 2, rim: "#9cc3ff" });
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 330, t: lt, sh: .3 });
  return s + rain(lt * .4, 25, { o: .18, seed: 31 }) + gradeCold(.2) + vign(.6);
};
/* choice cards over Lucas */
SH.choices = (lt, d, T, seg) => {
  let s = SH.lucasCam(lt + 3, d, T);
  const P = seg.phrases;
  const k1 = pr(T, P[1].a, P[1].a + .3), k2 = pr(T, P[2].a, P[2].a + .3);
  const card = (y, k, n, label, col, sel) => k <= 0 ? "" : `<g transform="translate(180 ${y}) scale(${f(eback(k) * (1 + sel * .06) * 100) / 100})"><rect x="-130" y="-34" width="260" height="68" rx="18" fill="${col}" stroke="#111" stroke-width="3"/><circle cx="-92" cy="0" r="22" fill="#fff"/>${txt(-92, 10, n, { size: 28, fill: col })}${txt(26, 10, label, { size: 28 })}</g>`;
  const pulse = (x) => .5 + .5 * Math.sin(T * 8 + x);
  s += card(120, k1, "1", "DEVOLVER", "#1f8a55", T > P[1].a && T < P[2].a ? pulse(0) : 0);
  s += card(205, k2, "2", "FICAR", "#c22b3a", T > P[2].a ? pulse(1) : 0);
  if (P[3] && T > P[3].a) s += popLabel(180, 280, "COMENTA 👇", pr(T, P[3].a, P[3].a + .3), { bg: "#ffd400", size: 20, rot: 3 });
  return s;
};
/* subscribe CTA with reward */
SH.subscribe = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#07070a"/>`;
  s += `<circle cx="180" cy="230" r="220" fill="url(#gLampCold)" opacity=".8"/>`;
  // mystery silhouette with locked question mark
  s += `<g transform="translate(180 215) scale(.85)"><path d="M-60 140 C-70 60 -50 20 0 16 C50 20 70 60 60 140 Z" fill="#000"/><circle cy="-30" r="44" fill="#000"/><path d="M-46 -48 q46 -46 92 0 v14 h-92 Z" fill="#000"/>` +
    `<circle cx="9" cy="-40" r="2.5" fill="#ff3b3b" opacity="${f((.5 + .5 * Math.sin(lt * 5)) * 100) / 100}"/><circle cx="-12" cy="-40" r="2.5" fill="#ff3b3b" opacity="${f((.5 + .5 * Math.sin(lt * 5)) * 100) / 100}"/></g>`;
  s += txt(180, 92, "QUEM É O", { size: 26, fill: "#fff" }) + txt(180, 122, "NÚMERO DESCONHECIDO?", { size: 22, fill: "#ff4d4d" });
  const qv = 1 + .08 * Math.sin(lt * 4);
  s += `<g transform="translate(180 200) scale(${f(qv * 100) / 100})">${txt(0, 22, "?", { size: 90, fill: "#ff3b3b", stroke: "#000", sw: 6 })}</g>`;
  // gift / reward badge
  const g = pr(lt, .4, .8);
  if (g > 0) s += `<g transform="translate(180 345) scale(${f(eback(g) * 100) / 100})"><rect x="-148" y="-30" width="296" height="60" rx="14" fill="#ffd400" stroke="#111" stroke-width="3"/>${txt(-118, 12, "🎁", { size: 28, fam: EMO, w: 400 })}${txt(16, -2, "INSCRITOS DESCOBREM", { size: 15, fill: "#111" })}${txt(16, 18, "PRIMEIRO NO EP. 2", { size: 15, fill: "#111" })}</g>`;
  // subscribe button being pressed
  const b = pr(lt, 1.0, 1.4), press = pr(lt, 2.0, 2.15) - pr(lt, 2.3, 2.45), done = lt > 2.2;
  if (b > 0) {
    const bs = eback(b) * (1 - press * .08);
    s += `<g transform="translate(180 420) scale(${f(bs * 100) / 100})"><rect x="-120" y="-28" width="240" height="56" rx="28" fill="${done ? "#3a3a3f" : "#e0262b"}" stroke="#111" stroke-width="3"/>${txt(0, 9, done ? "INSCRITO ✓" : "INSCREVER-SE", { size: 22, fill: "#fff" })}</g>`;
    // bell
    const ring = done ? Math.sin(lt * 25) * 18 * Math.max(0, 1 - (lt - 2.2) / 1.2) : 0;
    s += `<g transform="translate(316 420) rotate(${f(ring)})"><circle r="24" fill="#fff" stroke="#111" stroke-width="3"/>${txt(0, 9, "🔔", { size: 24, fam: EMO, w: 400 })}</g>`;
    // cursor hand
    const away = ease(pr(lt, 2.6, 3.2)) * 90, cx = lerp(300, 196, ease(pr(lt, 1.3, 2.0))) + away, cy = lerp(640, 432, ease(pr(lt, 1.3, 2.0))) + press * 4 + away * 1.6;
    s += `<g transform="translate(${f(cx)} ${f(cy)}) scale(.5) rotate(-20)">${handG(0, 0, 0, 1, "#f1c9a6", null, {})}</g>`;
    if (done) for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283, r = 40 + (lt - 2.2) * 140; if (r < 200) s += `<circle cx="${f(180 + Math.cos(a) * r)}" cy="${f(420 + Math.sin(a) * r * .6)}" r="4" fill="${["#ffd400", "#ff3b3b", "#7dff9b", "#38e1ff"][i % 4]}" opacity="${f((1 - r / 200) * 100) / 100}"/>`; }
  }
  return s + vign(.5);
};
SH.black = () => `<rect x="-40" y="-40" width="440" height="720" fill="#000"/>`;

/* ---------- shot list, anchored to timeline segments/phrases ---------- */
function talkAmp(T, who) {
  const e = TL.env[who]; if (!e) return 0;
  const i = Math.floor(T * TL.fps); return Math.min(1, (e[i] || 0) * 1.1);
}
function at(ref) {
  // "SEG.v0" visual start, "SEG.a" audio start, "SEG.b", "SEG.p2" phrase start, "SEG.p2e" phrase end, "+0.3" offsets
  const m = ref.match(/^([A-Za-z0-9]+)\.(v0|a|b|p(\d+)(e|@[\d.]+)?)([+-][\d.]+)?$/);
  const sg = TL.segs[m[1]]; let t;
  if (m[2] === "v0") t = sg.v0; else if (m[2] === "a") t = sg.a; else if (m[2] === "b") t = sg.b;
  else { const p = sg.phrases[+m[3]]; t = !m[4] ? p.a : m[4] === "e" ? p.b : p.a + (p.b - p.a) * parseFloat(m[4].slice(1)); }
  return t + (m[5] ? parseFloat(m[5]) : 0);
}
let SHOTS = [];
function buildShots() {
  const L = [
    ["L1.v0", "L1.p2-0.1", "walletHook", "L1"],
    ["L1.p2-0.1", "U1a.v0", "lucasRainWallet", "L1"],
    ["U1a.v0", "L2.v0", "phoneThreat", "U1a"],
    ["L2.v0", "L2.p1-0.05", "watcher", "L2"],
    ["L2.p1-0.05", "GL.v0", "lucasTurn", "L2"],
    ["GL.v0", "L3.v0", "glitch", "GL"],
    ["L3.v0", "L3.p2-0.1", "ride", "L3"],
    ["L3.p2-0.1", "L3.p3-0.1", "kitchen", "L3"],
    ["L3.p3-0.1", "L5.v0", "eviction", "L3"],
    ["L5.v0", "L5.p2-0.1", "gate", "L5"],
    ["L5.p2-0.1", "L5.p3-0.05", "together", "L5"],
    ["L5.p3-0.05", "R1.v0", "invite", "L5"],
    ["R1.v0", "R1.a-0.05", "dinnerWide", "R1"],
    ["R1.a-0.05", "R1.b-0.15", "ricardo", "R1"],
    ["R1.b-0.15", "M1.v0", "lucasEmbarrassed", "R1"],
    ["M1.v0", "M1.p1-0.05", "maeLaugh", "M1"],
    ["M1.p1-0.05", "M1.p2-0.05", "maePlate", "M1"],
    ["M1.p2-0.05", "L7.v0", "forks", "M1"],
    ["L7.v0", "L7.p1-0.05", "lucasFist", "L7"],
    ["L7.p1-0.05", "R2.v0", "pocketPlant", "L7"],
    ["R2.v0", "R2.p2-0.05", "noteDrop", "R2"],
    ["R2.p2-0.05", "L8.v0", "ricardo", "R2"],
    ["L8.v0", "L8.p2-0.05", "noteFloor", "L8"],
    ["L8.p2-0.05", "L8.p3-0.05", "isaDown", "L8"],
    ["L8.p3-0.05", "L8.p5-0.05", "rainWalk", "L8"],
    ["L8.p5-0.05", "U2.v0", "phoneBuzz", "L8"],
    ["U2.v0", "U2.p2+0.25", "chat", "U2"],
    ["U2.p2+0.25", "L10.v0", "lookDown", "U2"],
    ["L10.v0", "L10.p1-0.05", "puddle", "L10"],
    ["L10.p1-0.05", "L10.p3-0.05", "walletOpen", "L10"],
    ["L10.p3-0.05", "L10.p4-0.05", "walletID", "L10"],
    ["L10.p4-0.05", "L10.p4@0.62", "reveal", "L10"],
    ["L10.p4@0.62", "U1b.v0", "shock", "L10"],
    ["U1b.v0", "L12.v0", "phoneFinal", "U1b"],
    ["L12.v0", "L12.p1-0.1", "lucasCam", "L12"],
    ["L12.p1-0.1", "L12.p4-0.1", "choices", "L12"],
    ["L12.p4-0.1", "END", "subscribe", "L12"],
  ];
  SH.walletID = (lt, d, T, seg) => SH.walletOpen(lt, d, T, seg, { idPhase: true });
  SHOTS = L.map(([a, b, fn, seg]) => ({ a: at(a), b: b === "END" ? TL.dur : at(b), fn: SH[fn], name: fn, seg: TL.segs[seg] }));
  for (let i = 1; i < SHOTS.length; i++) SHOTS[i].a = SHOTS[i - 1].b; // contiguous
  SHOTS[0].a = 0;
}
// shot length trims: the shock beat lives only between reveal end and the next segment start — keep a minimum
function frame(T) {
  UID = 0;
  let sh = SHOTS[SHOTS.length - 1];
  for (const s of SHOTS) if (T >= s.a && T < s.b) { sh = s; break; }
  const lt = T - sh.a, d = Math.max(.1, sh.b - sh.a);
  let out = sh.fn(lt, d, T, sh.seg);
  const fin = pr(lt, 0, .1);
  if (fin < 1 && sh !== SHOTS[0]) out += `<rect x="-40" y="-40" width="440" height="720" fill="#fff" opacity="${f((1 - fin) * .22 * 100) / 100}"/>`;
  if (T > TL.dur - .5) out += full("#000", pr(T, TL.dur - .5, TL.dur));
  return out;
}

/* ---------- captions ---------- */
let CAPS = [];
function buildCaps() {
  CAPS = [];
  for (const id of TL.order) {
    const sg = TL.segs[id]; if (!sg.words.length) continue;
    let cur = [], len = 0;
    const flush = () => { if (cur.length) CAPS.push({ who: sg.who, words: cur }); cur = []; len = 0; };
    sg.words.forEach((w, i) => {
      const clean = w.w.replace(/^\(risos\)$/, "");
      if (!clean) return;
      cur.push(w); len += clean.length;
      if (cur.length >= 3 || len > 13 || /[.,?!…:]$/.test(clean) || i === sg.words.length - 1) flush();
    });
    flush();
  }
  for (let i = 0; i < CAPS.length; i++) {
    const c = CAPS[i]; c.a = c.words[0].a - .04;
    const nx = CAPS[i + 1];
    c.b = Math.min(c.words[c.words.length - 1].b + .35, nx ? nx.words[0].a - .04 : 1e9);
  }
}
function captionHTML(T) {
  const c = CAPS.find(c => T >= c.a && T < c.b); if (!c) return { key: null, html: "" };
  const words = c.words.map(w => {
    const on = T >= w.a - .03;
    const cur = T >= w.a - .03 && T < w.b;
    return `<span class="${cur ? "cur" : on ? "on" : "off"}">${w.w}</span>`;
  }).join(" ");
  return { key: c.a, html: words, who: c.who };
}
