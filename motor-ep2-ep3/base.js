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
