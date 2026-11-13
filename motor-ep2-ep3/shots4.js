/* ===== Ep. 3 "Olha as câmeras" — Lucas. Calmer camera, one idea per shot. ===== */
const S4 = {};
const V_SK = CAST.maeI.skin;
const slowZ = (lt, d, a = 1.0, b = 1.08) => lerp(a, b, ease(clamp(lt / d)));

/* ---------- security camera footage ---------- */
function coatRack(x, y, s, o = {}) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
  g += `<rect x="-4" y="-150" width="8" height="300" fill="#4a3018" stroke="${OL}" stroke-width="2"/><path d="M-40 150 L0 128 L40 150" stroke="#4a3018" stroke-width="8" fill="none"/>`;
  g += `<path d="M-4 -140 l-26 -10 M4 -140 l26 -10" stroke="#4a3018" stroke-width="6"/>`;
  if (o.jacket !== false) {
    g += `<path d="M-34 -138 L34 -138 L46 30 L-46 30 Z" fill="#1f2a44" stroke="${OL}" stroke-width="2.6"/><path d="M-12 -138 L0 -90 L12 -138" fill="#f3f3f1" stroke="${OL}" stroke-width="2"/>`;
    g += `<path d="M0 -90 L0 30" stroke="#141c30" stroke-width="3"/><path d="M8 -60 h26 v6 h-26 Z" fill="#141c30"/>`;
    if (o.wallet !== false) g += `<rect x="8" y="-84" width="30" height="24" rx="3" fill="#0d0c0b" stroke="#e8e8e8" stroke-width="2.2"/><rect x="12" y="-80" width="22" height="5" fill="#c9884a"/>`;
  }
  return g + `</g>`;
}
function capeFigure(x, y, s, o = {}) {
  const reach = o.reach || 0;
  let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
  // arm reaching toward the jacket (to the right)
  if (reach > 0) {
    g += `<path d="M18 -96 Q${f(40 + reach * 30)} ${f(-100 - reach * 10)} ${f(52 + reach * 40)} ${f(-110 - reach * 6)}" stroke="#101014" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    g += `<g transform="translate(${f(56 + reach * 42)} ${f(-112 - reach * 6)})"><ellipse rx="7" ry="6" fill="${V_SK}" stroke="${OL}" stroke-width="1.6"/>` +
      (o.pearls ? [0, 1, 2, 3, 4].map(i => `<circle cx="${f(-10 + i * .6)}" cy="${f(-7 + i * 3.4)}" r="2.8" fill="#fbf9f3" stroke="#7a766c" stroke-width=".7"/><circle cx="${f(-10.8 + i * .6)}" cy="${f(-7.9 + i * 3.4)}" r=".9" fill="#fff"/>`).join("") : "") + `</g>`;
  }
  // hooded cloak from behind, floor length
  g += `<path d="M-30 -150 C-34 -176 34 -176 30 -150 C42 -120 46 -60 56 0 L-56 0 C-46 -60 -42 -120 -30 -150 Z" fill="#101014" stroke="#000" stroke-width="2.4"/>`;
  g += `<path d="M-22 -150 C-20 -168 20 -168 22 -150 C14 -140 -14 -140 -22 -150 Z" fill="#060608"/>`;
  g += `<path d="M-8 -120 C-12 -80 -14 -40 -18 0 M10 -110 C14 -70 16 -30 20 0" stroke="#1f1f26" stroke-width="2" fill="none"/>`;
  return g + `</g>`;
}
function cctvScene(t, o) {
  // fixed high-angle view of the hall: front door left, back corridor right, coat rack middle-right
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#7d7b74"/>`;
  s += `<path d="M-40 360 L400 330 L400 680 L-40 680 Z" fill="#a8a59b"/>`; // floor
  for (let i = 0; i < 7; i++) s += `<path d="M${-40 + i * 80} 360 L${-120 + i * 110} 680" stroke="#8e8b82" stroke-width="2"/>`;
  s += `<rect x="10" y="150" width="90" height="215" fill="#5a4a3a" stroke="#333" stroke-width="3"/><circle cx="88" cy="262" r="5" fill="#ccc"/>`; // front door
  s += txt(55, 140, "SAÍDA", { size: 11, fill: "#ddd", w: 700 });
  const bd = o.backOpen || 0;
  s += `<rect x="296" y="150" width="80" height="200" fill="#1a1a1a"/><rect x="296" y="150" width="${f(80 * (1 - bd * .85))}" height="200" fill="#4e463c" stroke="#333" stroke-width="3"/>`; // back door
  s += txt(336, 140, "FUNDOS", { size: 11, fill: "#ddd", w: 700 });
  s += coatRack(236, 330, .85, { wallet: o.wallet !== false, walletHl: o.walletHl });
  if (o.lucas != null) s += charBust("lucas", lerp(200, 60, o.lucas), 330, .62, { t, top: "tee", wet: true, turn: .7, look: [-1, 0], autoBlink: false });
  if (o.cape != null) s += capeFigure(o.capeX ?? 270, 380, .82, { reach: o.reach || 0, pearls: o.pearls });
  return s;
}
function cctvFrame(inner, T, stamp, o = {}) {
  // grey security look + scanlines + timestamp, drawn full-screen; o.cam moves only the footage
  let s = `<g filter="url(#fGray)">${o.cam ? cam(inner, o.cam) : inner}</g>`;
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#1e3a2a" opacity=".22" style="mix-blend-mode:multiply"/>`;
  let lines = ""; for (let y = -40; y < 680; y += 4) lines += `<rect x="-40" y="${y}" width="440" height="1.4" fill="#000" opacity=".16"/>`;
  s += lines;
  const band = (T * 90) % 760 - 60;
  s += `<rect x="-40" y="${f(band)}" width="440" height="22" fill="#fff" opacity=".05"/>`;
  s += txt(16, 112, stamp, { size: 15, fill: "#f2f2f2", anchor: "start", w: 700, fam: "'DejaVu Sans Mono', monospace" });
  s += txt(344, 112, "CAM 02", { size: 13, fill: "#f2f2f2", anchor: "end", w: 700, fam: "'DejaVu Sans Mono', monospace" });
  if (Math.floor(T * 2) % 2 === 0) s += `<circle cx="22" cy="130" r="5" fill="#ff2a2a"/>` + txt(32, 135, "REC", { size: 12, fill: "#ff6a6a", anchor: "start", w: 700 });
  if (o.paused) s += `<g transform="translate(330 134)"><rect x="-10" y="-10" width="7" height="20" fill="#fff"/><rect x="2" y="-10" width="7" height="20" fill="#fff"/></g>`;
  if (o.ff) s += txt(330, 142, "▶▶", { size: 20, fill: "#fff" });
  return s;
}
function hl(x, y, rx, ry, p) {
  if (p <= 0) return "";
  return `<ellipse cx="${x}" cy="${y}" rx="${f(lerp(rx * 1.6, rx, eo(p)))}" ry="${f(lerp(ry * 1.6, ry, eo(p)))}" fill="none" stroke="#ff2a2a" stroke-width="5" opacity="${f(Math.min(1, p * 2) * 100) / 100}"/>`;
}

/* ---------- places ---------- */
function interroBg() {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#7f8f88"/><rect x="-40" y="330" width="440" height="400" fill="#5d6b65"/><rect x="-40" y="326" width="440" height="8" fill="#47534e"/>`;
  s += `<rect x="40" y="90" width="90" height="90" fill="#cfe0e8" stroke="#3a4642" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<rect x="${52 + i * 20}" y="90" width="6" height="90" fill="#3a4642"/>`).join("");
  s += `<path d="M85 180 L40 520 L230 520 Z" fill="#fff8d8" opacity=".12"/>`;
  s += `<rect x="250" y="120" width="80" height="210" fill="#3e4a46" stroke="#2c3532" stroke-width="3"/><rect x="262" y="138" width="56" height="40" fill="#9fb3ba" opacity=".6"/>`;
  s += `<line x1="180" y1="-40" x2="180" y2="40" stroke="#111" stroke-width="2"/><path d="M150 40 h60 l-10 18 h-40 Z" fill="#2a2f2d"/><circle cx="180" cy="62" r="120" fill="url(#gLamp)" opacity=".5"/>`;
  return s;
}
function deskFront(y = 560) {
  return `<rect x="-40" y="${y}" width="440" height="200" fill="#6b5a48" stroke="${OL}" stroke-width="3"/><rect x="-40" y="${y}" width="440" height="12" fill="#806c57"/>`;
}
function paperSheet(x, y, rot, s, o = {}) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-60" y="-80" width="120" height="160" fill="#f6f3ea" stroke="${OL}" stroke-width="2"/>` +
    txt(0, -58, "DECLARAÇÃO", { size: 13, fill: "#111" }) +
    `<path d="M-48 -40 h96 M-48 -26 h86 M-48 -12 h92 M-48 2 h70" stroke="#9a968c" stroke-width="3"/>` +
    (o.hl ? `<rect x="-52" y="12" width="104" height="22" fill="#ffd400" opacity=".55"/>` : "") +
    txt(0, 28, "EU ROUBEI R$ 2.000", { size: 10.5, fill: "#b3261e" }) +
    `<path d="M-40 60 h80" stroke="#111" stroke-width="1.6"/>` + txt(0, 72, "assinatura", { size: 8, fill: "#666", w: 500 }) + `</g>`;
}
function pen(x, y, rot, s) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-4" y="-50" width="8" height="90" rx="3" fill="#1c3f8a" stroke="${OL}" stroke-width="1.6"/><path d="M-4 40 L0 52 L4 40 Z" fill="#c9a04a"/></g>`; }
function cellBg(t) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#4b4f52"/>`;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 6; c++) s += `<rect x="${c * 70 - 40 + (r % 2) * 35}" y="${r * 48 - 40}" width="68" height="46" fill="#55595c" opacity=".6"/>`;
  s += `<rect x="240" y="60" width="70" height="44" fill="#c8d6e0"/>` + [0, 1, 2].map(i => `<rect x="${250 + i * 22}" y="60" width="5" height="44" fill="#2a2d30"/>`).join("");
  s += `<path d="M275 104 L180 560 L380 560 Z" fill="#fff" opacity=".08"/>`;
  s += `<rect x="-40" y="470" width="300" height="34" fill="#6a6e70" stroke="${OL}" stroke-width="2"/><rect x="-40" y="560" width="440" height="160" fill="#3c4043"/>`;
  return s;
}
function bars(op = 1, blur = false) {
  let g = `<g opacity="${op}"${blur ? ' filter="url(#fBlur)"' : ""}>`;
  for (let i = 0; i < 8; i++) g += `<rect x="${-30 + i * 56}" y="-40" width="14" height="720" fill="#2a2d31" stroke="#111" stroke-width="2"/><rect x="${-27 + i * 56}" y="-40" width="4" height="720" fill="#6d737a"/>`;
  g += `<rect x="-40" y="120" width="440" height="14" fill="#2a2d31" stroke="#111" stroke-width="2"/><rect x="-40" y="520" width="440" height="14" fill="#2a2d31" stroke="#111" stroke-width="2"/>`;
  return g + `</g>`;
}
function corridorBg() {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#8a9a92"/><rect x="-40" y="360" width="440" height="360" fill="#6c7a73"/>`;
  s += `<path d="M-40 560 L400 560 L400 720 L-40 720 Z" fill="#8f8a7f"/>`;
  s += `<rect x="20" y="150" width="80" height="210" fill="#4e5c56" stroke="#2c3532" stroke-width="3"/><rect x="290" y="150" width="80" height="210" fill="#4e5c56" stroke="#2c3532" stroke-width="3"/>`;
  s += `<rect x="130" y="110" width="130" height="90" fill="#c9b48e" stroke="#7a6a50" stroke-width="3"/>` + [0, 1, 2].map(i => `<rect x="${142 + i * 40}" y="${122 + (i % 2) * 14}" width="30" height="36" fill="#f3efe4" transform="rotate(${i * 4 - 4} ${157 + i * 40} 140)"/>`).join("");
  s += txt(195, 96, "DELEGACIA DE POLÍCIA", { size: 11, fill: "#2a332f" });
  return s;
}
function officeWide(t) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#6e665c"/><rect x="-40" y="-40" width="440" height="720" fill="#0a0d14" opacity=".55"/>`;
  s += `<rect x="20" y="60" width="120" height="160" fill="#3d3a34" stroke="#2a2723" stroke-width="3"/>` + [0, 1, 2, 3].map(i => `<rect x="30" y="${74 + i * 36}" width="100" height="26" fill="#5a4a3a"/>`).join("");
  return s;
}
function squareBg(t) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#bcd3e2"/><rect x="-40" y="-40" width="440" height="200" fill="#d8e6ee"/>`;
  s += houses(0, 280, 7, 120, 31, .9, ["#c9bfb0", "#b9ae9d", "#d6ccbd"]);
  const tree = (x, y, r) => `<rect x="${x - 6}" y="${y}" width="12" height="${r * 1.6}" fill="#6b4a32"/><circle cx="${x}" cy="${y}" r="${r}" fill="#5f8f5a"/><circle cx="${x - r * .5}" cy="${y + r * .2}" r="${r * .7}" fill="#6ea368"/><circle cx="${x + r * .5}" cy="${y - r * .2}" r="${r * .6}" fill="#79ad72"/>`;
  s += tree(40, 250, 70) + tree(330, 230, 80);
  s += `<rect x="-40" y="420" width="440" height="300" fill="#a9a294"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M-40 ${440 + i * 46} L400 ${430 + i * 50}" stroke="#988f80" stroke-width="2"/>`).join("");
  s += `<g transform="translate(280 470)"><rect x="-70" y="-10" width="140" height="12" fill="#6b4a32" stroke="${OL}" stroke-width="2"/><rect x="-70" y="-40" width="140" height="10" fill="#6b4a32" stroke="${OL}" stroke-width="2"/><rect x="-62" y="2" width="8" height="34" fill="#333"/><rect x="54" y="2" width="8" height="34" fill="#333"/></g>`;
  s += `<rect x="96" y="210" width="6" height="220" fill="#2d3236"/><circle cx="99" cy="206" r="12" fill="#f1e7c8" stroke="#2d3236" stroke-width="3"/>`;
  return s;
}
function envelopeBig(x, y, rot, s, crush = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${f(s * (1 - crush * .25))} ${f(s * (1 - crush * .45))})"><path d="M-60 -36 L60 -36 L58 36 L-58 38 Z" fill="#c69a5c" stroke="${OL}" stroke-width="2.4"/>` +
    (crush > 0 ? `<path d="M-40 -20 l20 30 l14 -26 l22 34 M-30 20 l40 -10" stroke="#8a6532" stroke-width="2.4" fill="none"/>` : `<path d="M-60 -36 L0 6 L60 -36" fill="none" stroke="#8a6532" stroke-width="2.4"/>`) +
    `<rect x="-50" y="-48" width="20" height="14" fill="#c9884a" stroke="${OL}" stroke-width="1.4"/></g>`;
}
function delegaciaFront() {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#c5d6e2"/>`;
  s += `<rect x="-40" y="150" width="440" height="360" fill="#d9d2c3" stroke="#a89f8c" stroke-width="3"/><rect x="-40" y="164" width="440" height="40" fill="#264d73"/>`;
  s += txt(180, 191, "DELEGACIA DE POLÍCIA", { size: 18, fill: "#fff" });
  s += `<rect x="130" y="250" width="100" height="260" fill="#4e5c56" stroke="${OL}" stroke-width="3"/><rect x="20" y="200" width="80" height="80" fill="#9fb3c6" stroke="#a89f8c" stroke-width="4"/><rect x="260" y="200" width="80" height="80" fill="#9fb3c6" stroke="#a89f8c" stroke-width="4"/>`;
  s += `<rect x="-40" y="510" width="440" height="210" fill="#b4ada0"/><rect x="-40" y="510" width="440" height="10" fill="#8f897d"/>`;
  return s;
}

/* ---------- shots ---------- */
// 0. hook: the footage of the cape figure, freeze + circle
S4.hookCCTV = (lt, d, T, seg) => {
  const take = ease(pr(lt, .2, 2.4)), frz = lt > 2.6;
  const inner = cctvScene(T, { cape: 1, capeX: 268, reach: take, wallet: take < .92, backOpen: .9 });
  const z = lerp(1.0, 1.22, ease(pr(lt, 0, d)));
  let s = cctvFrame(inner, T, "HALL · 23:12:41", { paused: frz, cam: { z, cx: 250, cy: 320, t: lt, sh: .3 } });
  s += hl(f(180 + (272 - 250) * z), f(320 + (300 - 320) * z), 64 * z, 110 * z, pr(lt, 2.6, 3.0));
  const p1 = seg.phrases[1];
  if (p1) s += bigTitle("QUEM É ESSA|PESSOA?", pr(T, p1.a, p1.a + .3), { y: 132, size: 34, col: "#fff", two: "#ff3b3b" });
  return s + vign(.6);
};
S4.hookDeal = (lt, d, T) => {
  let s = interroBg() + deskFront(520) + paperSheet(180, 600, -4, 1.3) + pen(260, 600, 30, 1.1);
  s = cam(s, { z: slowZ(lt, d, 1.05, 1.18), cy: 520, t: lt, sh: .2 });
  return s + gradeCold(.15) + vign(.7);
};
// 1. recap — previous-episode shots, desaturated, with a tag
function noTitle(fn) { NOTITLE = true; try { return fn(); } finally { NOTITLE = false; } }
function recapWrap(inner, lt) {
  return `<g filter="url(#fSepia)">${inner}</g>` + `<rect x="-40" y="-40" width="440" height="720" fill="none" stroke="#000" stroke-width="40"/>` +
    `<g transform="translate(180 128)"><rect x="-108" y="-17" width="216" height="32" rx="16" fill="#111" opacity=".85"/>${txt(0, 6, "EPISÓDIO ANTERIOR", { size: 15, fill: "#ffd400", ls: 1 })}</g>`;
}
S4.recapA = (lt, d, T) => recapWrap(noTitle(() => S2.aparadorPlace(lt + .9, d + .9, T)), lt);
S4.recapB = (lt, d, T) => recapWrap(noTitle(() => S2.ricardoSmug(lt, d, T)), lt);
S4.recapC = (lt, d, T) => recapWrap(noTitle(() => S2.cuffsHall(lt, d, T)), lt);
S4.recapD = (lt, d, T) => recapWrap(noTitle(() => S2.folderOpen(lt + .7, d, T)), lt);
// 2. the deal — interrogation room
S4.roomWide = (lt, d, T, seg) => {
  let s = interroBg();
  s += charBust("moura", 290, 300, .62, { t: T, top: "jacket", look: [-.7, .2], turn: -.4, lid: .6 });
  s += charBust("paula", 230, 400, .95, { t: T, top: "blazer", look: [-.7, .1], turn: -.35, lid: .7, smile: .3, sneer: -.3, talk: talkAmp(T, "P") });
  s += charBust("lucas", 70, 470, 1.0, { t: T, top: "teeDry", look: [.9, .1], turn: .55, lid: .85, brow: { sad: .3 } });
  s += deskFront(560) + paperSheet(180, 610, -6, .8) + pen(240, 612, 40, .8);
  s += handG(240, 600, -30, .7, CAST.paula.skin, "#191a1f", { cuff: "#f6f3ee" });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.14), cx: lerp(180, 210, ease(lt / d)), cy: 400, t: lt, sh: .15 });
  return s + gradeCold(.12) + vign(.6);
};
S4.lucasRead = (lt, d, T) => {
  let s = interroBg();
  s += charBust("lucas", 180, 330, 1.45, { t: T, top: "teeDry", look: [0, .8], lid: .8, brow: { sad: .5, angry: .3 }, talk: talkAmp(T, "L") });
  s += deskFront(590) + paperSheet(180, 650, 0, 1.1, { hl: true });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.08), cy: 380, t: lt, sh: .15 });
  return s + gradeCold(.12) + vign(.62);
};
S4.paulaClose = (lt, d, T) => {
  let s = interroBg();
  s += charBust("paula", 180, 340, 1.45, { t: T, top: "blazer", look: [-.3, 0], lid: .68, smile: .2, sneer: .4, brow: { raiseL: .4 }, talk: talkAmp(T, "P"), tilt: -2 });
  s += deskFront(600);
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.08), cy: 360, t: lt, sh: .15 });
  return s + gradeCold(.12) + vign(.62);
};
S4.pushPaper = (lt, d, T) => {
  let s = interroBg() + deskFront(420);
  const p = ease(pr(lt, .15, 1.0));
  s += paperSheet(lerp(140, 230, p), lerp(520, 470, p), lerp(-4, 8, p), 1.25) + pen(110, 560, 20, 1);
  s += handG(lerp(80, 170, p), lerp(600, 540, p), -20, 1.0, L_SK, "#4f8279", {});
  s = cam(s, { z: 1.12, cy: 500, t: lt, sh: .15 });
  s += popLabel(180, 170, "VOCÊS ESCOLHERAM", pr(lt, .4, .7), { bg: "#111", fg: "#fff", size: 15, rot: -3 });
  s += popLabel(180, 208, "NÃO ASSINAR ✓", pr(lt, .55, .85), { bg: "#1f8a55", fg: "#fff", size: 22, rot: -3 });
  return s + gradeCold(.1) + vign(.55);
};
S4.lucasRefuse = (lt, d, T) => {
  let s = interroBg();
  s += charBust("lucas", 180, 330, 1.5, { t: T, top: "teeDry", look: [.3, 0], lid: .78, brow: { angry: .8 }, talk: talkAmp(T, "L") });
  s += deskFront(600);
  s = cam(s, { z: slowZ(lt, d, 1.04, 1.14), cy: 340, t: lt, sh: .15 });
  s += popLabel(180, 140, "NÃO ASSINAR ✓", 1, { bg: "#1f8a55", fg: "#fff", size: 16, rot: -3 });
  return s + gradeCold(.12) + vign(.62);
};
S4.paulaStand = (lt, d, T, seg) => {
  let s = interroBg();
  const up = ease(pr(lt, 0, .6));
  s += charBust("paula", 180, lerp(380, 330, up), 1.45, { t: T, top: "blazer", look: [0, .4], lid: .6, smile: .25, sneer: .7, brow: { angry: .3 }, talk: talkAmp(T, "P") });
  s += deskFront(600);
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.1), cy: 350, t: lt, sh: .15 });
  const p1 = seg.phrases[1];
  if (p1) s += bigTitle("A ESCOLHA|TEM UM PREÇO", pr(T, p1.a, p1.a + .3), { y: 128, size: 30, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.15) + vign(.65);
};
// 3. the cell and the memory
S4.cellSit = (lt, d, T) => {
  let s = cellBg(T);
  s += charBust("lucas", 170, 380, 1.05, { t: T, top: "teeDry", look: [0, .6], lid: lt > d * .45 ? .3 : .8, brow: { sad: .6 }, tilt: 4 });
  s += bars(1);
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.12), cy: 380, t: lt, sh: .1 });
  return s + gradeCold(.25) + vign(.7);
};
S4.gateMemory = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#a9b3bd"/><rect x="-40" y="160" width="440" height="300" fill="#d7cdb8"/>`;
  let b = ""; for (let i = 0; i < 14; i++) b += `<rect x="${i * 30 - 4}" y="190" width="7" height="330" fill="#3a3326"/>`;
  s += b + `<rect x="-40" y="260" width="440" height="6" fill="#3a3326"/><rect x="-40" y="500" width="440" height="220" fill="#6d7278"/>`;
  // the camera on top of the gate pillar
  s += `<rect x="150" y="100" width="60" height="70" fill="#cfc4ad" stroke="#9e8c6b" stroke-width="3"/>`;
  s += `<g transform="translate(180 92)"><rect x="-6" y="-4" width="12" height="14" fill="#555"/><path d="M-24 -20 L24 -20 L30 -6 L-18 -6 Z" fill="#e8e8e8" stroke="${OL}" stroke-width="2.4"/><circle cx="26" cy="-13" r="6" fill="#222" stroke="${OL}" stroke-width="2"/>` +
    `<circle cx="-14" cy="-13" r="3.2" fill="${Math.floor(T * 2.5) % 2 ? "#ff2a2a" : "#5a1018"}"/></g>`;
  const z = lerp(1.0, 2.6, ease(pr(lt, .4, d - .3)));
  s = cam(s, { z, cx: 180, cy: lerp(320, 90, ease(pr(lt, .4, d - .3))), t: lt, sh: .1 });
  s = `<g filter="url(#fSepia)">${s}</g>` + full("#fff", .08);
  s += `<g transform="translate(180 470)"><rect x="-74" y="-17" width="148" height="32" rx="16" fill="#111" opacity=".8"/>${txt(0, 6, "LEMBRANÇA", { size: 15, fill: "#fff", ls: 2 })}</g>`;
  if (lt > d * .7) s += hl(180, 316, 74, 52, pr(lt, d * .7, d * .7 + .3));
  return s + vign(.7);
};
S4.cellShout = (lt, d, T) => {
  let s = cellBg(T);
  s += charBust("lucas", 180, 350, 1.4, { t: T, top: "teeDry", look: [.2, 0], lid: 1.05, brow: { raise: .6, angry: .4 }, open: .3, talk: talkAmp(T, "L") });
  s += bars(1);
  s += handG(110, 380, 10, .85, L_SK, "#4f8279", { fist: true }) + handG(250, 380, -10, .85, L_SK, "#4f8279", { fist: true });
  s = cam(s, { z: slowZ(lt, d, 1.08, 1.0), cy: 350, t: lt, sh: .5 });
  return s + gradeCold(.22) + vign(.65);
};
S4.mouraFar = (lt, d, T) => {
  let s = corridorBg() + full("#000", .1);
  s += `<rect x="120" y="420" width="160" height="70" fill="#5a4a3a" stroke="${OL}" stroke-width="2"/>`;
  s += charBust("moura", 200, 360, .9, { t: T, top: "jacket", look: [-.5, 0], lid: .55, sneer: .4, talk: talkAmp(T, "D"), tilt: -3 });
  s += `<g transform="translate(250 410)"><rect x="-10" y="-22" width="20" height="24" rx="3" fill="#f4efe6" stroke="${OL}" stroke-width="2"/></g>`;
  s += bars(.9, true);
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.08), cy: 380, t: lt, sh: .1 });
  return s + gradeCold(.15) + vign(.6);
};
// 4. Graça arrives
S4.gracaArrive = (lt, d, T, seg) => {
  let s = corridorBg();
  const walk = ease(pr(lt, 0, 1.2));
  s += charBust("moura", 300, 400, .8, { t: T, top: "jacket", look: [-.8, 0], turn: -.4, lid: .7, brow: { raise: .5 } });
  s += charBust("grac", lerp(-20, 130, walk), 380, 1.05, { t: T, top: "uniform", look: [.8, 0], turn: .35, lid: .9, brow: { angry: .2 }, talk: talkAmp(T, "G") });
  const P2 = seg.phrases[2], up = P2 ? ease(pr(T, P2.a - .6, P2.a)) : 0;
  s += `<g transform="translate(${f(lerp(130, 200, up))} ${f(lerp(640, 520, up))}) rotate(-20)"><rect x="-10" y="-22" width="20" height="34" rx="4" fill="#2a63c9" stroke="${OL}" stroke-width="2"/><rect x="-6" y="-34" width="12" height="14" fill="#c9ced6" stroke="${OL}" stroke-width="2"/></g>`;
  s += handG(lerp(130, 200, up) - 2, lerp(660, 540, up), -10, .7, CAST.grac.skin, "#5d6b7d", { curl: true });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.1), cx: lerp(150, 190, walk), cy: 400, t: lt, sh: .15 });
  const P4 = seg.phrases[4];
  if (P4) s += bigTitle("O QUE A|CÂMERA VIU?", pr(T, P4.a + .2, P4.a + .5), { y: 128, size: 34, col: "#fff", two: "#ffd400" });
  return s + gradeCold(.1) + vign(.58);
};
// 5. watching the footage
function monitorWith(inner, w = 300, h = 240) {
  return `<g><rect x="${-w / 2 - 14}" y="${-h / 2 - 14}" width="${w + 28}" height="${h + 28}" rx="10" fill="#1a1c20" stroke="${OL}" stroke-width="3"/>` +
    `<svg x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" viewBox="-40 40 440 352" preserveAspectRatio="xMidYMid slice">${inner}</svg>` +
    `<rect x="-20" y="${h / 2 + 14}" width="40" height="30" fill="#2a2d31"/><rect x="-60" y="${h / 2 + 40}" width="120" height="10" rx="4" fill="#2a2d31"/></g>`;
}
S4.watchWide = (lt, d, T) => {
  let s = officeWide(T);
  const glow = `<circle cx="180" cy="460" r="260" fill="#9fd3ff" opacity=".18" filter="url(#fSoft)"/>`;
  s += glow;
  s += charBust("grac", 70, 300, .78, { t: T, top: "uniform", look: [.4, .8], turn: .3, lid: .9, rim: "#9fd3ff" });
  s += charBust("lucas", 290, 300, .8, { t: T, top: "teeDry", look: [-.4, .8], turn: -.3, lid: .9, brow: { raise: .4 }, rim: "#9fd3ff" });
  s += charBust("moura", 180, 330, .92, { t: T, top: "jacket", look: [0, .9], lid: .7, talk: talkAmp(T, "D"), rim: "#9fd3ff" });
  s += `<g transform="translate(180 520)">${monitorWith(cctvFrame(cctvScene(T, { lucas: .5 }), T, "HALL · 23:05:12"), 260, 200)}</g>`;
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.12), cy: 430, t: lt, sh: .1 });
  return s + vign(.65);
};
S4.footageExit = (lt, d, T) => {
  const k = ease(pr(lt, 0, d * .6));
  const z = slowZ(lt, d, 1.0, 1.35);
  let s = cctvFrame(cctvScene(T, { lucas: k, walletHl: lt > d * .55 }), T, "HALL · 23:05:" + String(12 + Math.floor(lt * 2)).padStart(2, "0"), { cam: { z, cx: 236, cy: 300, t: lt, sh: .1 } });
  const wx = 180 + (256 - 236) * z, wy = 320 + (275 - 300) * z;
  s += hl(f(wx), f(wy), 30 * z, 24 * z, pr(lt, d * .55, d * .55 + .3));
  if (lt > d * .6) s += popLabel(f(wx), f(wy - 50 * z), "CARTEIRA AINDA AQUI", pr(lt, d * .6, d * .6 + .3), { bg: "#ff2a2a", fg: "#fff", size: 14, rot: -3 });
  return s + vign(.55);
};
S4.footageFF = (lt, d, T) => {
  const m = Math.min(12, 5 + Math.floor(lt / d * 7));
  let s = cctvFrame(cctvScene(T, {}), T, `HALL · 23:${String(m).padStart(2, "0")}:${String(Math.floor(lt * 37) % 60).padStart(2, "0")}`, { ff: true });
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#fff" opacity="${f((.06 + .05 * Math.sin(lt * 40)) * 100) / 100}"/>`;
  return s + vign(.55);
};
S4.footageTake = (lt, d, T, seg) => {
  const enter = ease(pr(lt, 0, 1.2)), take = ease(pr(lt, 1.4, 2.8)), leave = ease(pr(lt, 3.0, d));
  const capeX = lt < 3.0 ? lerp(340, 268, enter) : lerp(268, 340, leave);
  let s = cctvFrame(cctvScene(T, { cape: 1, capeX, reach: lt < 3.0 ? take : 1 - leave, wallet: take < .92, backOpen: lt < 3.0 ? enter : 1 - leave * .5 }), T, `HALL · 23:12:${String(30 + Math.floor(lt * 3)).padStart(2, "0")}`, { cam: { z: slowZ(lt, d, 1.05, 1.2), cx: 260, cy: 320, t: lt, sh: .1 } });
  return s + vign(.6);
};
S4.mouraDecide = (lt, d, T) => {
  let s = officeWide(T) + `<circle cx="180" cy="520" r="260" fill="#9fd3ff" opacity=".15" filter="url(#fSoft)"/>`;
  s += charBust("moura", 180, 340, 1.45, { t: T, top: "jacket", look: [-.2, .2], lid: .65, brow: { angry: .3, sad: .3 }, smile: -.3, talk: talkAmp(T, "D"), rim: "#9fd3ff" });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.08), cy: 340, t: lt, sh: .1 });
  return s + vign(.62);
};
S4.cuffsOff = (lt, d, T) => {
  let s = officeWide(T) + full("#000", .1);
  const open = eo(pr(lt, .1, .6));
  s += wrists(180, 360, 1.2, "#4f8279", true, open);
  s = cam(s, { z: slowZ(lt, d, 1.1, 1.18), cy: 360, t: lt, sh: lt > .1 && lt < .35 ? 2.5 : .1 });
  s += bigTitle("LIVRE", pr(lt, .5, .8), { y: 160, size: 52, col: "#7dff9b", rot: -3 });
  return s + vign(.6);
};
S4.lucasFree = (lt, d, T) => {
  let s = officeWide(T) + `<circle cx="180" cy="520" r="260" fill="#9fd3ff" opacity=".12" filter="url(#fSoft)"/>`;
  s += charBust("lucas", 180, 345, 1.45, { t: T, top: "teeDry", look: [.4, .1], lid: .85, brow: { angry: .3, raise: .2 }, talk: talkAmp(T, "L") * .4 });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.1), cy: 340, t: lt, sh: .1 });
  return s + vign(.62);
};
// 6. the square at 9am
S4.squareWide = (lt, d, T) => {
  let s = squareBg(T);
  s += charBust("ric", 280, 405, .55, { t: T, top: "suit", look: [-.6, 0], turn: -.2, lid: .7, brow: { angry: .2 } });
  s += envelopeBig(300, 452, -8, .35);
  s += charBust("lucas", 50, 520, 1.15, { t: T, top: "teeDry", look: [1, -.1], turn: .7, lid: .85, brow: { raise: .3 } });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.1), cx: lerp(170, 220, ease(lt / d)), cy: 400, t: lt, sh: .1 });
  return s + gradeWarm(.08) + vign(.45);
};
S4.ricPale = (lt, d, T, seg) => {
  let s = squareBg(T);
  const P1 = seg.phrases[1], pale = P1 ? ease(pr(T, P1.a, P1.b)) : 0, crush = P1 ? ease(pr(T, P1.b, P1.b + .6)) : 0;
  s += charBust("ric", 180, 360, 1.35, { t: T, top: "suit", look: [lerp(0, .7, crush), lerp(.8, 0, crush)], lid: lerp(.7, 1.12, pale), pupilShrink: pale > .5, brow: { raise: pale * .7 }, sweat: pale > .6, smile: -.3 });
  s += overlayPale(pale * .55);
  s += `<g transform="translate(250 600) rotate(-14)"><rect x="-34" y="-62" width="68" height="124" rx="10" fill="#111" stroke="${OL}" stroke-width="3"/><rect x="-28" y="-54" width="56" height="104" rx="6" fill="#2a3346"/></g>`;
  s += handG(250, 640, -10, .75, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1", curl: true });
  s += envelopeBig(110, 640, 10, .9, crush) + handG(110, 680, 20, .75, CAST.ric.skin, "#1f2a44", { cuff: "#f3f3f1", fist: crush > .5, curl: crush <= .5 });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.1), cy: 400, t: lt, sh: crush > 0 && crush < 1 ? 1.5 : .1 });
  const P2 = seg.phrases[2];
  if (P2) s += bigTitle("QUEM ELE|IA PAGAR?", pr(T, P2.b - .1, P2.b + .2), { y: 128, size: 34, col: "#fff", two: "#ffd400" });
  return s + gradeWarm(.06) + vign(.55);
};
// 7. Isabela on the sidewalk
S4.sidewalkTwo = (lt, d, T) => {
  let s = delegaciaFront();
  const run = ease(pr(lt, 0, 1.0));
  s += charBust("lucas", 100, 420, 1.0, { t: T, top: "teeDry", look: [.8, 0], turn: .45, lid: .95, brow: { raise: .5 }, smile: .2 });
  s += charBust("isa", lerp(420, 260, run), 420 + Math.sin(lt * 14) * 3 * (1 - run), 1.0, { t: T, top: "hoodie", look: [-.8, 0], turn: -.45, brow: { sad: .7, raise: .4 }, wetEyes: true, talk: talkAmp(T, "I") });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.08), cy: 420, t: lt, sh: .1 });
  return s + gradeWarm(.06) + vign(.45);
};
S4.isaConfess = (lt, d, T) => {
  let s = delegaciaFront() + full("#000", .08);
  s += charBust("isa", 180, 345, 1.48, { t: T, top: "hoodie", look: [-.1, .3], lid: .8, brow: { sad: 1 }, wetEyes: true, talk: talkAmp(T, "I") });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.14), cy: 340, t: lt, sh: .1 });
  return s + vign(.6);
};
S4.lucasFreeze = (lt, d, T) => {
  let s = delegaciaFront();
  s += charBust("lucas", 180, 345, 1.5, { t: 0, top: "teeDry", look: [.2, 0], lid: 1.1, brow: { raise: .7, sad: .6 }, pupilShrink: true, autoBlink: false });
  s = cam(s, { z: lerp(1.05, 1.22, eo(pr(lt, 0, .5))), cy: 330, t: 0, sh: 0 });
  s = `<g filter="url(#fGray)">${s}</g>`;
  s += bigTitle("ELA|SABIA", pr(lt, .15, .45), { y: 440, size: 56, col: "#fff", two: "#ff3b3b" });
  return s + vign(.7);
};
// 8. vote
S4.vote3 = (lt, d, T, seg) => {
  let s = delegaciaFront() + full("#000", .12);
  const a = talkAmp(T, "L");
  s += charBust("lucas", 180, 372, 1.55, { t: T, top: "teeDry", lid: .9, brow: { sad: .5, angry: .2 }, talk: a, nod: a * 2, tilt: Math.sin(lt * 1.1) * 2 });
  s = cam(s, { z: slowZ(lt, d, 1.0, 1.08), cy: 340, t: lt, sh: .1 });
  const Ps = seg.phrases;
  const card = (y, k, n, label, col, sel) => k <= 0 ? "" : `<g transform="translate(180 ${y}) scale(${f(eback(k) * (1 + sel * .06) * 100) / 100})"><rect x="-140" y="-34" width="280" height="68" rx="18" fill="${col}" stroke="#111" stroke-width="3"/><circle cx="-102" cy="0" r="22" fill="#fff"/>${txt(-102, 10, n, { size: 28, fill: col })}${txt(26, 10, label, { size: 24 })}</g>`;
  const pulse = (x) => .5 + .5 * Math.sin(T * 8 + x);
  if (Ps[2]) s += card(118, pr(T, Ps[2].a, Ps[2].a + .3), "1", "PERDOAR", "#1f8a55", T > Ps[2].a && T < Ps[3].a ? pulse(0) : 0);
  if (Ps[3]) s += card(200, pr(T, Ps[3].a, Ps[3].a + .3), "2", "ME AFASTAR", "#c22b3a", T > Ps[3].a ? pulse(1) : 0);
  if (Ps[4] && T > Ps[4].a) s += popLabel(180, 272, "COMENTA 👇", pr(T, Ps[4].a, Ps[4].a + .3), { bg: "#ffd400", size: 20, rot: 3 });
  return s + vign(.6);
};
// 9. reward
S4.subscribe3 = (lt, d, T, seg) => S2.subscribeLock(lt, d, T, seg).replace("O QUE ELE VIU", "O DETALHE QUE").replace("SAINDO PELOS FUNDOS?", "O DELEGADO NÃO VIU");
S4.pearls = (lt, d, T, seg) => {
  const inner = cctvScene(T, { cape: 1, capeX: 268, reach: 1, wallet: false, backOpen: .9, pearls: true });
  const z = lerp(1.2, 4.6, ease(pr(lt, 0, 1.8)));
  let s = cctvFrame(inner, T, "HALL · 23:12:44 · ZOOM", { paused: true, cam: { z, cx: 345, cy: 282, t: lt, sh: 0 } });
  const g = pr(lt, 1.8, 2.4);
  if (g > 0) s += `<g transform="translate(214 300) scale(.55)" opacity="${f(Math.min(1, g * 2) * Math.max(0, Math.sin(lt * 5)) * 100) / 100}"><path d="M0 -30 L6 -6 L30 0 L6 6 L0 30 L-6 6 L-30 0 L-6 -6 Z" fill="#fff"/></g>`;
  const P1 = seg.phrases[1];
  if (P1) s += bigTitle("DE QUEM É ESSA|PULSEIRA?", pr(T, P1.a + .3, P1.a + .6), { y: 205, size: 30, col: "#fff", two: "#ffd400" });
  return s + vign(.65);
};

/* ---------- overlays: place cards + commenter mention ---------- */
function overlayState(T) {
  const out = { letK: 0, letHTML: "", menK: 0, menHTML: "", plK: 0, plHTML: "" };
  const m0 = at("L6.a") - .1;
  if (T >= m0 && T < m0 + 4.2) { out.menK = Math.min(pr(T, m0, m0 + .3), 1 - pr(T, m0 + 3.8, m0 + 4.2)); out.menHTML = "💡 ideia do <b>@Kaillanreis</b>"; }
  const places = [[at("P1.v0"), "DELEGACIA · 8h"], [at("L5.v0"), "CELA"], [at("D2.v0"), "SALA DO DELEGADO"], [at("L9.v0"), "PRAÇA · 9h"]];
  for (const [a, label] of places) if (T >= a && T < a + 2.4) { out.plK = Math.min(pr(T, a, a + .25), 1 - pr(T, a + 2.1, a + 2.4)); out.plHTML = label; }
  return out;
}
