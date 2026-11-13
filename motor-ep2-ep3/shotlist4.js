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
    ["L1.v0", "L1.p2-0.1", "hookCCTV", "L1"],
    ["L1.p2-0.1", "L2.v0", "hookDeal", "L1"],
    ["L2.v0", "L2.p1-0.05", "recapA", "L2"],
    ["L2.p1-0.05", "L2.p2-0.05", "recapB", "L2"],
    ["L2.p2-0.05", "L2.p3-0.05", "recapC", "L2"],
    ["L2.p3-0.05", "P1.v0", "recapD", "L2"],
    ["P1.v0", "L3.v0", "roomWide", "P1"],
    ["L3.v0", "P2.v0", "lucasRead", "L3"],
    ["P2.v0", "PUSH.v0", "paulaClose", "P2"],
    ["PUSH.v0", "L4.v0", "pushPaper", "PUSH"],
    ["L4.v0", "P3.v0", "lucasRefuse", "L4"],
    ["P3.v0", "L5.v0", "paulaStand", "P3"],
    ["L5.v0", "L5.p1-0.1", "cellSit", "L5"],
    ["L5.p1-0.1", "L6.v0", "gateMemory", "L5"],
    ["L6.v0", "D1.v0", "cellShout", "L6"],
    ["D1.v0", "G1.v0", "mouraFar", "D1"],
    ["G1.v0", "D2.v0", "gracaArrive", "G1"],
    ["D2.v0", "D2.p1-0.1", "watchWide", "D2"],
    ["D2.p1-0.1", "FF.v0", "footageExit", "D2"],
    ["FF.v0", "L7.v0", "footageFF", "FF"],
    ["L7.v0", "D3.v0", "footageTake", "L7"],
    ["D3.v0", "FREE.v0", "mouraDecide", "D3"],
    ["FREE.v0", "L8.v0", "cuffsOff", "FREE"],
    ["L8.v0", "L9.v0", "lucasFree", "L8"],
    ["L9.v0", "L10.v0", "squareWide", "L9"],
    ["L10.v0", "I1.v0", "ricPale", "L10"],
    ["I1.v0", "I1.p2-0.1", "sidewalkTwo", "I1"],
    ["I1.p2-0.1", "HOLD.v0", "isaConfess", "I1"],
    ["HOLD.v0", "L11.v0", "lucasFreeze", "HOLD"],
    ["L11.v0", "L12.v0", "vote3", "L11"],
    ["L12.v0", "L12.p1-0.3", "subscribe3", "L12"],
    ["L12.p1-0.3", "END", "pearls", "L12"],
  ];
  const ALL = Object.assign({}, S2, S4);
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
  if (fin < 1 && sh !== SHOTS[0]) out += `<rect x="-40" y="-40" width="440" height="720" fill="#fff" opacity="${f((1 - fin) * .07 * 100) / 100}"/>`;
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
      if (cur.length >= 4 || len > 17 || /[.,?!…:]$/.test(w.w) || i === sg.words.length - 1) flush();
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
