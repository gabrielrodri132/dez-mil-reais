/* ---------- timing helpers, shot list, frame and captions ---------- */
function talkAmp(T, who) {
  const e = TL.env[who]; if (!e) return 0;
  const i = Math.floor(T * TL.fps); return Math.min(1, (e[i] || 0) * 1.1);
}
function at(ref) {
  const m = ref.match(/^([A-Za-z0-9]+)\.(v0|a|b|p(\d+)(e|@[\d.]+)?)([+-][\d.]+)?$/);
  const sg = TL.segs[m[1]]; let t;
  if (m[2] === "v0") t = sg.v0; else if (m[2] === "a") t = sg.a; else if (m[2] === "b") t = sg.b;
  else { const p = sg.phrases[+m[3]]; t = !m[4] ? p.a : m[4] === "e" ? p.b : p.a + (p.b - p.a) * parseFloat(m[4].slice(1)); }
  return t + (m[5] ? parseFloat(m[5]) : 0);
}
let SHOTS = [];
function buildShots() {
  const L = [
    ["IA.v0", "IA.p2-0.1", "lockHook", "IA"],
    ["IA.p2-0.1", "GL.v0", "isaRoom", "IA"],
    ["GL.v0", "IB.v0", "glitch10", "GL"],
    ["IB.v0", "RA.v0", "isaNight", "IB"],
    ["RA.v0", "IC.v0", "ricNight", "RA"],
    ["IC.v0", "RB.v0", "isaNight", "IC"],
    ["RB.v0", "ID.v0", "ricPhone", "RB"],
    ["ID.v0", "RC.v0", "phoneNight", "ID"],
    ["RC.v0", "LOCK.v0", "ricSmugNight", "RC"],
    ["LOCK.v0", "RD.v0", "doorLock", "LOCK"],
    ["RD.v0", "IE.v0", "doorEar", "RD"],
    ["IE.v0", "GA.v0", "clock3", "IE"],
    ["GA.v0", "IF.v0", "gracDoor", "GA"],
    ["IF.v0", "IG.v0", "isaListen", "IF"],
    ["IG.v0", "R2.v0", "stairsTop", "IG"],
    ["R2.v0", "L7.v0", "ricardoPhoto", "R2"],
    ["L7.v0", "R3.v0", "lucasPlain", "L7"],
    ["R3.v0", "L8.v0", "countReveal", "R3"],
    ["L8.v0", "D1.v0", "lucasShoutPlain", "L8"],
    ["D1.v0", "IH.v0", "mouraPhone", "D1"],
    ["IH.v0", "D2.v0", "phoneMine", "IH"],
    ["D2.v0", "D2.b-0.05", "mouraArrest", "D2"],
    ["D2.b-0.05", "I1.v0", "cuffsHall", "D2"],
    ["I1.v0", "R4.v0", "isaStairs", "I1"],
    ["R4.v0", "I2.v0", "ricardoCold", "R4"],
    ["I2.v0", "I2.p3-0.05", "isaConfront", "I2"],
    ["I2.p3-0.05", "II.v0", "ricardoPocket", "I2"],
    ["II.v0", "II.p1-0.05", "isaWindow", "II"],
    ["II.p1-0.05", "IJ.v0", "facadeWindow", "II"],
    ["IJ.v0", "IK.v0", "voteIsa", "IJ"],
    ["IK.v0", "IL.v0-0.4", "subscribeIsa", "IK"],
    ["IL.v0-0.4", "END", "safeClue", "IL"],
  ];
  const ALL = Object.assign({}, S2, S3);
  SHOTS = L.map(([a, b, fn, seg]) => ({ a: at(a), b: b === "END" ? TL.dur : at(b), fn: ALL[fn], name: fn, seg: TL.segs[seg] }));
  for (let i = 1; i < SHOTS.length; i++) SHOTS[i].a = SHOTS[i - 1].b;
  SHOTS[0].a = 0;
}
function frame(T) {
  UID = 0;
  let sh = SHOTS[SHOTS.length - 1];
  for (const s of SHOTS) if (T >= s.a && T < s.b) { sh = s; break; }
  const lt = T - sh.a, d = Math.max(.1, sh.b - sh.a);
  let out = sh.fn(lt, d, T, sh.seg);
  const fin = pr(lt, 0, .1);
  if (fin < 1 && sh !== SHOTS[0]) out += `<rect x="-40" y="-40" width="440" height="720" fill="#fff" opacity="${f((1 - fin) * .18 * 100) / 100}"/>`;
  if (T > TL.dur - .45) out += full("#000", pr(T, TL.dur - .45, TL.dur - .1));
  return out;
}
let CAPS = [];
function buildCaps() {
  CAPS = [];
  for (const id of TL.order) {
    const sg = TL.segs[id]; if (!sg.words.length) continue;
    let cur = [], len = 0;
    const flush = () => { if (cur.length) CAPS.push({ who: sg.who, words: cur }); cur = []; len = 0; };
    sg.words.forEach((w, i) => {
      cur.push(w); len += w.w.length;
      if (cur.length >= 3 || len > 13 || /[.,?!…:]$/.test(w.w) || i === sg.words.length - 1) flush();
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
    const on = T >= w.a - .03, cur = T >= w.a - .03 && T < w.b;
    return `<span class="${cur ? "cur" : on ? "on" : "off"}">${w.w}</span>`;
  }).join(" ");
  return { key: c.a, html: words, who: c.who };
}
