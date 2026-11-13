/* ===== Ep. 2 pela visão da Isabela — new shots ===== */
const S3 = {};
const I_SK = CAST.isa.skin;
function bedroomIsa(t, o = {}) {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="${o.day ? "#8a8fa0" : "#1a1c2a"}"/>`;
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#3b2f4a" opacity="${o.day ? .15 : .4}"/>`;
  s += `<rect x="230" y="70" width="110" height="150" fill="${o.day ? "#b8c4d0" : "#0c1424"}" stroke="#e8dfe9" stroke-width="6"/><path d="M285 70 v150 M230 145 h110" stroke="#e8dfe9" stroke-width="4"/>`;
  s += `<svg x="230" y="70" width="110" height="150" viewBox="0 0 360 500" preserveAspectRatio="xMidYMid slice">${rain(t, 40, { o: .5, len: 40, w: 4, seed: 71 })}</svg>`;
  s += `<path d="M220 60 C230 120 226 200 214 240 L230 240 C236 200 236 120 232 60 Z M350 60 C340 120 344 200 356 240 L340 240 C334 200 334 120 338 60 Z" fill="#c98aa6" opacity=".85"/>`;
  s += `<g transform="translate(70 120)"><rect x="-34" y="-46" width="68" height="92" fill="#f0e6ee" stroke="${OL}" stroke-width="2"/><path d="M-24 -30 h48 M-24 -14 h40" stroke="#c9b9c6" stroke-width="3"/></g>`; // poster
  s += `<rect x="-40" y="540" width="440" height="200" fill="${o.day ? "#6e5f66" : "#241c26"}"/>`;
  return s;
}
function doorG(x, y, s, open = 0, light = .6) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
  g += `<rect x="-80" y="-220" width="160" height="440" fill="#0a0a10"/>`;
  if (open > 0) g += `<rect x="-80" y="-220" width="${f(160 * open)}" height="440" fill="#f2e2c0" opacity=".9"/>`;
  g += `<g transform="translate(-80 0) scale(${f(Math.max(.05, 1 - open * .8))} 1) translate(80 0)"><rect x="-80" y="-220" width="160" height="440" fill="#5a3b2a" stroke="${OL}" stroke-width="3"/><rect x="-60" y="-196" width="120" height="170" fill="none" stroke="#462c1e" stroke-width="4"/><rect x="-60" y="10" width="120" height="180" fill="none" stroke="#462c1e" stroke-width="4"/>` +
    `<circle cx="56" cy="0" r="9" fill="#d9b45c" stroke="${OL}" stroke-width="2"/><rect x="52" y="14" width="8" height="16" rx="3" fill="#111"/><rect x="54" y="18" width="4" height="8" fill="#ffe2a6" opacity="${light}"/></g>`;
  g += `<rect x="-80" y="218" width="160" height="6" fill="#ffd27a" opacity="${light * .8}"/>`;
  return g + `</g>`;
}
S3.lockHook = (lt, d, T, seg) => {
  let s = bedroomIsa(T) + full("#000", .25);
  s += doorG(250, 330, 1.2, 0, .9);
  s += charBust("isa", 110, 380, 1.25, { t: T, top: "blouse", turn: .5, look: [1, 0], brow: { sad: .7, raise: .5 }, wetEyes: true, talk: talkAmp(T, "I"), tilt: 4 });
  s += handG(200, 330, -20, .7, I_SK, "#e7d6bc", {});
  const punch = lt < .3 ? (1 - lt / .3) * .2 : 0;
  s = cam(s, { z: lerp(1.05, 1.18, ease(lt / d)) + punch, cy: 360, t: lt, sh: lt < .3 ? 3.5 : .4 });
  s += full("#fff", lt < .08 ? .4 * (1 - lt / .08) : 0);
  const p1 = seg.phrases[1];
  if (p1) s += bigTitle("TRANCADA PELO|PRÓPRIO PAI", pr(T, p1.a - .2, p1.a + .1), { y: 130, size: 30, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.3) + vign(.75);
};
S3.isaRoom = (lt, d, T, seg) => {
  let s = bedroomIsa(T);
  s += charBust("isa", 180, 350, 1.5, { t: T, top: "blouse", look: [.2, .1], brow: { angry: .5, sad: .4 }, wetEyes: true, talk: talkAmp(T, "I") });
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 340, t: lt, sh: .35 });
  const p3 = P("IA", 3);
  if (p3) s += bigTitle("A PROVA|ERA DELA?", pr(T, p3.a + .3, p3.a + .6), { y: 128, size: 34, col: "#fff", two: "#ffd400" });
  return s + gradeCold(.25) + vign(.72);
};
S3.glitch10 = (lt) => S2.glitch8(lt).split("8 HORAS ANTES").join("10 MINUTOS ANTES").replace(/font-size="38"/g, 'font-size="32"');
function hallNight(t) { return hallBg(t) + full("#0b0f1c", .55) + `<circle cx="70" cy="300" r="200" fill="url(#gLamp)" opacity=".9"/>`; }
S3.isaNight = (lt, d, T) => {
  let s = hallNight(T);
  s += charBust("isa", 180, 345, 1.5, { t: T, top: "blouse", look: [.4, 0], brow: { angry: .7 }, talk: talkAmp(T, "I"), lid: .95, rim: "#ffc56b" });
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 335, t: lt, sh: .4 });
  return s + gradeWarm(.08) + vign(.7);
};
S3.ricNight = (lt, d, T) => {
  let s = hallNight(T);
  s += charBust("ric", 180, 340, 1.5, { t: T, top: "suit", look: [-.4, .1], lid: .55, sneer: .5, brow: { angry: .5 }, talk: talkAmp(T, "R") * .8, rim: "#ffc56b", lightSide: -1 });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 330, t: lt, sh: .3 });
  return s + gradeWarm(.08) + vign(.7);
};
S3.ricPhone = (lt, d, T) => {
  let s = hallNight(T);
  s += charBust("ric", 140, 360, 1.3, { t: T, top: "suit", look: [.5, 0], lid: .6, sneer: .6, talk: talkAmp(T, "R") * .8, rim: "#ffc56b" });
  const up = eo(pr(lt, 0, .5));
  s += pinkPhone(rainPhotoInner(T), { x: 268, y: lerp(640, 470, up), s: .55, rot: -6, skin: CAST.ric.skin });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 380, t: lt, sh: .3 });
  return s + gradeWarm(.06) + vign(.7);
};
S3.phoneNight = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#120f14"/>`;
  s += pinkPhone(rainPhotoInner(T), { x: 180, y: 350, s: 1.0, skin: CAST.ric.skin });
  s = cam(s, { z: lerp(1.0, 1.15, ease(lt / d)), cy: 330, t: lt, sh: .4 });
  s += bigTitle("A FOTO DO|DESCONHECIDO", pr(lt, .5, .8), { y: 96, size: 30, col: "#fff", two: "#ff3b3b" });
  return s + vign(.7);
};
S3.ricSmugNight = (lt, d, T) => {
  let s = hallNight(T);
  s += charBust("ric", 180, 340, 1.5, { t: T, top: "suit", look: [-.2, 0], lid: .55, squint: .3, sneer: .9, smile: .2, brow: { raiseL: .7 }, talk: talkAmp(T, "R") * .7, rim: "#ffc56b", tilt: -3 });
  s = cam(s, { z: lerp(1.0, 1.15, ease(lt / d)), cy: 330, t: lt, sh: .3 });
  return s + gradeWarm(.06) + vign(.72);
};
S3.doorLock = (lt, d, T) => {
  let s = bedroomIsa(T) + full("#000", .3);
  const cl = 1 - eo(pr(lt, 0, .25));
  s += doorG(180, 330, 1.4, cl * .9, .9);
  s = cam(s, { z: 1.05 + (lt > .25 && lt < .5 ? .06 : 0), cy: 340, t: lt, sh: lt > .2 && lt < .5 ? 4 : .3 });
  s += bigTitle("A PROVA VIROU|CONTRA ELE", pr(lt, .25, .5), { y: 120, size: 30, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.3) + vign(.75);
};
S3.doorEar = (lt, d, T, seg) => {
  let s = bedroomIsa(T) + full("#000", .35);
  s += doorG(260, 330, 1.2, 0, .9);
  const sh = 120 + Math.sin(lt * 1.5) * 20;
  s += `<rect x="${f(160 + sh * .4)}" y="595" width="60" height="7" fill="#000" opacity=".7"/>`;
  s += charBust("isa", 120, 370, 1.3, { t: T, top: "blouse", turn: .7, look: [1, 0], lid: .7, brow: { raise: .4 }, tilt: 10 });
  s = cam(s, { z: lerp(1.05, 1.15, ease(lt / d)), cy: 360, t: lt, sh: .3 });
  const P1 = seg.phrases[1], P3 = seg.phrases[3];
  if (P1) s += popLabel(120, 150, "07:00 · CONFISSÃO", pr(T, P1.a, P1.a + .3), { bg: "#fff", size: 18, rot: -4 });
  if (P3) s += popLabel(240, 205, "09:00 · ???", pr(T, P3.a, P3.a + .3), { bg: "#ff3b3b", fg: "#fff", size: 20, rot: 5 });
  return s + gradeCold(.3) + vign(.75);
};
S3.clock3 = (lt, d, T, seg) => {
  let s = bedroomIsa(T) + full("#000", .45);
  s += `<g transform="translate(180 360)"><rect x="-90" y="-44" width="180" height="88" rx="14" fill="#0b0b0e" stroke="#333" stroke-width="3"/>${txt(0, 18, "03:00", { size: 52, fill: "#ff3b3b", w: 700 })}<circle r="160" fill="#ff3b3b" opacity=".06"/></g>`;
  s += charBust("isa", 300, 560, .9, { t: T, top: "blouse", turn: -.5, look: [-.9, -.2], lid: 1.1, brow: { raise: .8 }, pupilShrink: true });
  s = cam(s, { z: lerp(1.0, 1.12, ease(lt / d)), cy: 380, t: lt, sh: .3 });
  const p1 = seg.phrases[1];
  if (p1) s += bigTitle("QUEM VOLTOU|DA CHUVA?", pr(T, p1.a + .1, p1.a + .4), { y: 130, size: 32, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.35) + vign(.8);
};
S3.gracDoor = (lt, d, T) => {
  let s = bedroomIsa(T, { day: true }) + full("#000", .2);
  const op = eo(pr(lt, 0, .5));
  s += doorG(180, 330, 1.4, op * .8, 0);
  s += charBust("grac", 200, 380, 1.2 * Math.max(.01, op), { t: T, top: "uniform", look: [-.3, 0], lid: .9, brow: { sad: .5, raise: .3 }, talk: talkAmp(T, "G") });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 360, t: lt, sh: .3 });
  return s + gradeCold(.2) + vign(.65);
};
S3.isaListen = (lt, d, T) => {
  let s = bedroomIsa(T, { day: true });
  s += charBust("isa", 180, 350, 1.5, { t: T, top: "hoodie", look: [.6, 0], turn: .15, lid: 1.05, brow: { raise: .6 }, talk: talkAmp(T, "I") * .4 });
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  return s + gradeCold(.15) + vign(.62);
};
S3.stairsTop = (lt, d, T) => {
  let s = hallBg(T);
  s += charBust("paula", 270, 470, .55, { t: T, top: "blazer", look: [-.8, .1], turn: -.35, lid: .75, smile: .25 });
  s += charBust("moura", 210, 480, .58, { t: T, top: "jacket", look: [-.8, .2], turn: -.3, lid: .65 });
  s += charBust("ric", 120, 480, .66, { t: T, top: "suit", look: [-.5, .3], turn: .3, lid: .6, sneer: .5 });
  s += charBust("lucas", 40, 490, .6, { t: T, top: "teeDry", look: [.9, 0], turn: .5 });
  s = cam(s, { z: lerp(1.3, 1.45, ease(lt / d)), cx: 160, cy: 450, t: lt, sh: .3 });
  s += `<g transform="translate(300 720) scale(1.3)">${charBust("isa", 0, 0, 1, { t: T, top: "hoodie", turn: -1, look: [-1, .5], lid: .8 }).replace(/<g transform="scale\(1.12\)">/, '<g transform="scale(1.12)" opacity="1">')}</g>`;
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#000" opacity=".12"/>`;
  return s + gradeCold(.15) + vign(.65);
};
S3.lucasPlain = (lt, d, T) => {
  let s = hallBg(T) + full("#000", .12);
  s += charBust("lucas", 180, 352, 1.5, { t: T, top: "teeDry", look: [-.4, 0], turn: -.1, brow: { angry: .2 }, talk: talkAmp(T, "L") });
  return cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 340, t: lt, sh: .3 }) + gradeCold(.15) + vign(.62);
};
S3.lucasShoutPlain = (lt, d, T) => {
  let s = hallBg(T);
  s += charBust("lucas", 160, 360, 1.45, { t: T, top: "teeDry", look: [.5, 0], turn: .15, brow: { angry: 1 }, open: .3, talk: talkAmp(T, "L"), lid: 1.05 });
  return cam(s, { z: lerp(1.08, 1.0, eo(pr(lt, 0, .4))), cy: 350, t: lt, sh: lt < .5 ? 2.5 : .5 }) + gradeCold(.15) + vign(.62);
};
/* top-down: he counts, ten notes go into the inner pocket — seen clearly from the stairs */
S3.countReveal = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="url(#gMarble)"/>`;
  s += `<ellipse cx="180" cy="360" rx="150" ry="190" fill="#1f2a44" stroke="${OL}" stroke-width="3"/><circle cx="180" cy="210" r="56" fill="#a9adb3" stroke="${OL}" stroke-width="3"/><path d="M140 200 q40 -30 80 0" stroke="#dfe2e6" stroke-width="5" fill="none"/>`; // head+shoulders from above
  s += `<path d="M120 300 L150 470 L200 470 L190 300 Z" fill="#141c30" opacity=".6"/>`; // inner pocket shadow
  for (let i = 0; i < 6; i++) { const k = (lt * 2.6 + i / 6) % 1; s += note200(lerp(200, 270, k), 430 - Math.sin(k * Math.PI) * 40, lerp(-20, 25, k), .8); }
  const sl = ease(pr(T, seg.phrases[1] ? seg.phrases[1].a : seg.a + 1, seg.phrases[2] ? seg.phrases[2].a + .3 : seg.a + 2.2));
  for (let i = 0; i < 4; i++) s += note200(lerp(240 - i * 4, 158, sl), lerp(440 + i * 3, 360, sl), lerp(10, -70, sl), .8, 1 - sl * .5);
  s += handG(lerp(250, 168, sl), lerp(500, 400, sl), lerp(-20, -60, sl), .9, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1", curl: true });
  const q = pr(T, seg.phrases[2] ? seg.phrases[2].a : seg.a + 2, (seg.phrases[2] ? seg.phrases[2].a : seg.a + 2) + .3);
  if (q > 0) s += `<ellipse cx="165" cy="370" rx="${f(lerp(110, 72, eo(q)))}" ry="${f(lerp(130, 86, eo(q)))}" fill="none" stroke="#ff3b3b" stroke-width="5" opacity="${f(eo(q) * 100) / 100}"/>`;
  s = cam(s, { z: lerp(1.1, 1.25, ease(lt / d)), cy: 380, t: lt, sh: .5 });
  const p3 = seg.phrases[3];
  if (p3) s += bigTitle("ELE ESCONDEU|AS NOTAS", pr(T, p3.a, p3.a + .3), { y: 128, size: 36, col: "#fff", two: "#ff3b3b" });
  return s + gradeCold(.12) + vign(.65);
};
S3.phoneMine = (lt, d, T) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#d9ccb4"/>` + full("#000", .4);
  s += pinkPhone(rainPhotoInner(T), { x: 180, y: 350, s: 1.0, skin: CAST.moura.skin });
  s = cam(s, { z: lerp(1.0, 1.15, ease(lt / d)), cy: 330, t: lt, sh: .4 });
  s += bigTitle("O CELULAR|DELA", pr(lt, .2, .5), { y: 96, size: 34, col: "#fff", two: "#f29bb7" });
  return s + vign(.7);
};
S3.isaWindow = (lt, d, T) => {
  let s = bedroomIsa(T, { day: true }) + full("#000", .15);
  s += charBust("isa", 180, 360, 1.45, { t: T, top: "hoodie", look: [-.1, .7], lid: .75, brow: { sad: 1 }, wetEyes: true, talk: talkAmp(T, "I") * .3 });
  s += handG(250, 300, 0, .7, I_SK, "#7c6ca6", {});
  s += `<rect x="-40" y="-40" width="440" height="720" fill="#b8c4d0" opacity=".14"/>` + dropsGlass(T, 30, 12);
  s = cam(s, { z: lerp(1.0, 1.1, ease(lt / d)), cy: 350, t: lt, sh: .3 });
  return s + policeGlow(T, .18, 180, 600) + gradeCold(.25) + vign(.68);
};
S3.voteIsa = (lt, d, T, seg) => {
  let s = bedroomIsa(T, { day: true });
  const a = talkAmp(T, "I");
  s += charBust("isa", 180, 372, 1.55, { t: T, top: "hoodie", lid: .95, brow: { angry: .4, raiseL: .3 }, talk: a, nod: a * 2, tilt: Math.sin(lt * 1.1) * 2 });
  s = cam(s, { z: lerp(1.0, 1.08, ease(lt / d)), cy: 340, t: lt, sh: .3 });
  const Ps = seg.phrases;
  const card = (y, k, n, label, col, sel) => k <= 0 ? "" : `<g transform="translate(180 ${y}) scale(${f(eback(k) * (1 + sel * .06) * 100) / 100})"><rect x="-140" y="-34" width="280" height="68" rx="18" fill="${col}" stroke="#111" stroke-width="3"/><circle cx="-102" cy="0" r="22" fill="#fff"/>${txt(-102, 10, n, { size: 28, fill: col })}${txt(28, 9, label, { size: 19 })}</g>`;
  const pulse = (x) => .5 + .5 * Math.sin(T * 8 + x);
  if (Ps[1]) s += card(118, pr(T, Ps[1].a, Ps[1].a + .3), "1", "DEPOR PELO LUCAS", "#1f8a55", T > Ps[1].a && T < Ps[3].a ? pulse(0) : 0);
  if (Ps[3]) s += card(200, pr(T, Ps[3].a, Ps[3].a + .3), "2", "SEGUIR O PAI", "#c22b3a", T > Ps[3].a ? pulse(1) : 0);
  if (Ps[5] && T > Ps[5].a) s += popLabel(180, 272, "COMENTA 👇", pr(T, Ps[5].a, Ps[5].a + .3), { bg: "#ffd400", size: 20, rot: 3 });
  return s + gradeCold(.12) + vign(.62);
};
S3.subscribeIsa = (lt, d, T, seg) => S2.subscribeLock(lt, d, T, seg).replace("O QUE ELE VIU", "O QUE ELA VIU").replace("SAINDO PELOS FUNDOS?", "PELA FRESTA DA PORTA?");
S3.safeClue = (lt, d, T, seg) => {
  let s = `<rect x="-40" y="-40" width="440" height="720" fill="#050507"/>`;
  // door crack: a vertical slit of warm light showing the office
  const w = lerp(30, 150, ease(pr(lt, 0, .8)));
  let off = `<rect x="-40" y="-40" width="440" height="720" fill="#3b2a1c"/><circle cx="180" cy="200" r="200" fill="url(#gLamp)"/>`;
  off += `<g transform="translate(180 360)"><rect x="-110" y="-130" width="220" height="260" rx="10" fill="#4b4f57" stroke="${OL}" stroke-width="4"/><rect x="-96" y="-116" width="192" height="232" rx="8" fill="#5c616a"/>`;
  off += `<rect x="-70" y="-80" width="140" height="44" rx="6" fill="#0e1a12" stroke="#222" stroke-width="3"/>`;
  const P2 = seg.phrases[2], P3 = seg.phrases[3];
  const d1 = P2 && T > P2.a ? "1" : "_", d2 = P3 && T > P3.a ? "4" : "_";
  off += txt(0, -48, `${d1} ${d2} _ _ _ _`, { size: 26, fill: "#7dff9b", w: 700, ls: 2 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) off += `<rect x="${-54 + c * 40}" y="${-14 + r * 36}" width="28" height="26" rx="4" fill="#2a2d33"/>`;
  off += `</g>` + handG(220, 470, -30, .8, CAST.ric.skin, "#1f2a44", { watch: true, cuff: "#f3f3f1", curl: true });
  s += `<svg x="${f(180 - w / 2)}" y="-40" width="${f(w)}" height="720" viewBox="${f(180 - w / 2)} -40 ${f(w)} 720">${off}</svg>`;
  s += `<rect x="${f(180 - w / 2 - 40)}" y="-40" width="40" height="720" fill="#5a3b2a"/><rect x="${f(180 + w / 2)}" y="-40" width="40" height="720" fill="#4a2f22"/>`;
  s = cam(s, { z: lerp(1.0, 1.25, ease(lt / d)), cy: 330, t: lt, sh: .3 });
  if (P3) s += bigTitle("A SENHA|DO COFRE?", pr(T, P3.a + .3, P3.a + .6), { y: 120, size: 36, col: "#fff", two: "#7dff9b" });
  return s + vign(.7);
};
function overlayState(T) {
  const L1a = at("R2.a") - .2, L2a = at("II.p1") - .3;
  let k = 0, txtL = "";
  if (T >= L1a && T < L1a + 3) { k = Math.min(pr(T, L1a, L1a + .3), 1 - pr(T, L1a + 2.6, L1a + 3)); txtL = "O QUE TINHA NA FOTO?<small>DEPOIS, VEJA PELA VISÃO DO LUCAS</small>"; }
  if (T >= L2a && T < L2a + 3) { k = Math.min(pr(T, L2a, L2a + .3), 1 - pr(T, L2a + 2.6, L2a + 3)); txtL = "DEPOIS, VEJA PELA<small>VISÃO DO LUCAS</small>"; }
  return { letK: k, letHTML: txtL };
}
