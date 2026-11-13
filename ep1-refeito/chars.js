/* Character rig: outlined, cel-shaded cartoon heads and busts with expression controls. */
const OL = "#1c1310";            // outline colour
let UID = 0;                      // unique ids per frame (clip paths)
const uid = (p) => `${p}${++UID}`;
const F1 = (n) => Math.round(n * 10) / 10;
const CL = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const LP = (a, b, t) => a + (b - a) * t;
function hsh(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

const CAST = {
  lucas: { skin: "#9a6240", shade: "#74452b", light: "#b97c55", hair: "afro", hairC: "#17100c", hairH: "#3a2a20",
    brow: "#17100c", iris: "#4a2c16", lips: "#6b3527", lipsD: "#4d2219", jaw: "young" },
  isa:   { skin: "#f3cfae", shade: "#dca784", light: "#fde3c9", hair: "long", hairC: "#6b3f22", hairH: "#a2683e",
    brow: "#4d2e1a", iris: "#6a4320", lips: "#c9566a", lipsD: "#9c3a4d", lash: true, jaw: "soft", blushBase: .25, earring: "#f2d27a" },
  ric:   { skin: "#e9bc98", shade: "#c99272", light: "#f6d4b6", hair: "slick", hairC: "#a9adb3", hairH: "#dfe2e6",
    brow: "#7d8187", iris: "#2f4650", lips: "#9a5a4c", lipsD: "#6e3a30", beard: "#b6b9be", age: 1, jaw: "square" },
  maeI:  { skin: "#f4d3b8", shade: "#dbab8c", light: "#fde7d4", hair: "bob", hairC: "#e2bf6a", hairH: "#f8e3a4",
    brow: "#9a7a40", iris: "#3d6d80", lips: "#b3243f", lipsD: "#7e1328", lash: true, age: .6, jaw: "soft", shadow: "#7a5a8a", earring: "#f4efe6" },
  maeL:  { skin: "#a66d49", shade: "#7d4c30", light: "#c08860", hair: "bun", hairC: "#2e241d", hairH: "#8a7f76",
    brow: "#2a201a", iris: "#3a2214", lips: "#7a4434", lipsD: "#55291e", lash: true, age: .9, tired: 1, jaw: "soft" }
};

/* ---------- face parts ---------- */
function headPath(jaw) {
  if (jaw === "square") return "M-53 -28 C-55 -84 55 -84 53 -28 C54 6 50 34 34 52 C22 64 -22 64 -34 52 C-50 34 -54 6 -53 -28 Z";
  if (jaw === "soft") return "M-50 -30 C-52 -82 52 -82 50 -30 C50 8 42 38 22 56 C12 64 -12 64 -22 56 C-42 38 -50 8 -50 -30 Z";
  return "M-51 -30 C-53 -83 53 -83 51 -30 C51 8 44 38 24 56 C13 65 -13 65 -24 56 C-44 38 -51 8 -51 -30 Z";
}
function eye(c, p, side, cx, cy, sx, t) {
  // sx: horizontal squash from head turn; side -1 = screen-left eye
  const blink = p.blinkAmt || 0;
  const top = CL((p.lid ?? 1) * (1 - blink), 0, 1.35);
  const sq = CL((p.squint || 0) + (p.smileEyes || 0) * .5, 0, 1);
  const H = 10.5 * Math.max(1, top), w = 13.5 * sx, hb = 7.5 * (1 - sq * .7);
  let s = "";
  if (top < .12) {
    const happy = (p.smileEyes || 0) > .4;
    s += happy
      ? `<path d="M${F1(cx - w)} ${cy + 2} Q${cx} ${cy - 9} ${F1(cx + w)} ${cy + 2}" stroke="${OL}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
      : `<path d="M${F1(cx - w)} ${cy} Q${cx} ${cy + 5} ${F1(cx + w)} ${cy}" stroke="${OL}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
    if (c.lash) s += `<path d="M${F1(cx + side * w)} ${cy} l${F1(side * 5)} -2" stroke="${OL}" stroke-width="2.6" stroke-linecap="round"/>`;
    return s;
  }
  const id = uid("e");
  const topY = cy - H * 1.35, botY = cy + hb * .75;
  const shape = `M${F1(cx - w)} ${cy} Q${F1(cx - w * .55)} ${F1(topY)} ${cx} ${F1(topY)} Q${F1(cx + w * .55)} ${F1(topY)} ${F1(cx + w)} ${cy} Q${cx} ${F1(cy + hb * 1.5)} ${F1(cx - w)} ${cy} Z`;
  s += `<clipPath id="${id}"><path d="${shape}"/></clipPath>`;
  s += `<path d="${shape}" fill="#fbf7f2"/>`;
  const lx = CL((p.look ? p.look[0] : 0), -1, 1) * 6 * sx, ly = CL((p.look ? p.look[1] : 0), -1, 1) * 3.5;
  const ir = 7.8 * (p.pupilShrink ? .82 : 1);
  // lid line: apex slides from the top of the eye down toward the bottom as the eye closes
  const k = 1 - Math.min(1, top), apex = topY + k * (botY - topY) * 1.02;
  const lidAng = (p.lidTilt || 0) * side;              // tilted lids (angry/sad) per side
  const lcy = 2 * apex - cy;                             // quadratic control for that apex
  const lid = `M${F1(cx - w - 2)} ${F1(cy + (k > .02 ? lidAng : 0))} Q${cx} ${F1(lcy)} ${F1(cx + w + 2)} ${F1(cy - (k > .02 ? lidAng : 0))}`;
  s += `<g clip-path="url(#${id})">`;
  s += `<ellipse cx="${F1(cx + lx)}" cy="${F1(cy + ly)}" rx="${F1(ir * sx)}" ry="${F1(ir)}" fill="${c.iris}"/>`;
  s += `<ellipse cx="${F1(cx + lx)}" cy="${F1(cy + ly + ir * .35)}" rx="${F1(ir * .7 * sx)}" ry="${F1(ir * .45)}" fill="#fff" opacity=".12"/>`;
  s += `<ellipse cx="${F1(cx + lx)}" cy="${F1(cy + ly)}" rx="${F1(ir * .46 * sx * (p.pupilShrink ? .6 : 1))}" ry="${F1(ir * .46 * (p.pupilShrink ? .6 : 1))}" fill="#0b0705"/>`;
  s += `<circle cx="${F1(cx + lx + 2.6 * sx)}" cy="${F1(cy + ly - 2.8)}" r="2.3" fill="#fff"/><circle cx="${F1(cx + lx - 2.4 * sx)}" cy="${F1(cy + ly + 2.4)}" r="1.1" fill="#fff" opacity=".8"/>`;
  if (p.wetEyes) s += `<path d="M${F1(cx - w)} ${F1(cy + hb * .8)} Q${cx} ${F1(cy + hb * 1.7)} ${F1(cx + w)} ${F1(cy + hb * .8)}" stroke="#d6efff" stroke-width="2.4" fill="none" opacity=".9"/>`;
  // eyelid skin above the lid line + soft shadow under it
  s += `<path d="M${F1(cx - w - 3)} ${F1(topY - 8)} L${F1(cx + w + 3)} ${F1(topY - 8)} L${F1(cx + w + 2)} ${F1(cy - (k > .02 ? lidAng : 0))} Q${cx} ${F1(lcy)} ${F1(cx - w - 2)} ${F1(cy + (k > .02 ? lidAng : 0))} Z" fill="${c.skin}"/>`;
  s += `<path d="${lid}" stroke="${c.shade}" stroke-width="5" fill="none" opacity=".45" transform="translate(0 2.5)"/>`;
  s += `</g>`;
  if (k > .05) s += `<path d="M${F1(cx - w)} ${F1(cy - 1)} Q${cx} ${F1(2 * topY - cy - 2)} ${F1(cx + w)} ${F1(cy - 1)}" stroke="${c.shade}" stroke-width="2" fill="none" opacity=".8"/>`;
  s += `<path d="${lid}" stroke="${OL}" stroke-width="${c.lash ? 3.9 : 3.2}" fill="none" stroke-linecap="round"/>`;
  if (c.lash) s += `<path d="M${F1(cx + side * (w + 1))} ${F1(cy - 1)} l${F1(side * 5.5)} -3.5 M${F1(cx + side * (w - 3))} ${F1(apex + (cy - apex) * .35)} l${F1(side * 4)} -4" stroke="${OL}" stroke-width="2.2" stroke-linecap="round"/>`;
  s += `<path d="M${F1(cx - w * .8)} ${F1(cy + hb * 1.05)} Q${cx} ${F1(cy + hb * 1.6)} ${F1(cx + w * .8)} ${F1(cy + hb * 1.05)}" stroke="${c.shade}" stroke-width="1.8" fill="none" opacity=".9"/>`;
  if (c.shadow) s += `<path d="M${F1(cx - w)} ${F1(cy - 3)} Q${cx} ${F1(2 * topY - cy - 6)} ${F1(cx + w)} ${F1(cy - 3)}" stroke="${c.shadow}" stroke-width="4" fill="none" opacity=".35"/>`;
  if (c.tired || c.age) s += `<path d="M${F1(cx - w * .7)} ${F1(cy + hb * 1.5 + 4)} Q${cx} ${F1(cy + hb * 1.5 + 8)} ${F1(cx + w * .7)} ${F1(cy + hb * 1.5 + 4)}" stroke="${c.shade}" stroke-width="2" fill="none" opacity="${c.tired ? .95 : .6}"/>`;
  return s;
}
function brow(c, p, side, cx, by, sx) {
  const b = p.brow || {};
  const raise = (b.raise || 0) + (side < 0 ? (b.raiseL || 0) : (b.raiseR || 0));
  const angry = b.angry || 0, sad = b.sad || 0;
  const inner = by - raise * 6 + angry * 7 - sad * 8;
  const outer = by - raise * 5 - angry * 3 + sad * 4;
  const mid = (inner + outer) / 2 - 4 - raise * 2;
  const xi = cx - side * 11 * sx, xo = cx + side * 15 * sx, xm = cx + side * 2 * sx;
  const th = c.age ? 4.2 : (c.lash ? 3.4 : 4.6);
  return `<path d="M${F1(xi)} ${F1(inner + th * .5)} Q${F1(xm)} ${F1(mid)} ${F1(xo)} ${F1(outer)} Q${F1(xm)} ${F1(mid + th * 1.6)} ${F1(xi)} ${F1(inner + th * 1.4)} Z" fill="${c.brow}" stroke="${c.brow}" stroke-width="1.2" stroke-linejoin="round"/>`;
}
function mouth(c, p, mx, my, sx, t) {
  let o = CL(p.open || 0), smile = CL(p.smile || 0, -1, 1), wide = CL(p.wide || 0, -1, 1), sneer = p.sneer || 0;
  if (p.talk) { // viseme-ish: amplitude opens, character of sound alternates width
    const a = CL(p.talk);
    o = Math.max(o, a * .85);
    wide = LP(wide, Math.sin(t * 23) * .45 + Math.sin(t * 9.1) * .25, .7);
  }
  const w = (14 + wide * 4 + Math.max(0, smile) * 5 - o * 2) * sx;
  const cyL = my - smile * 6 - (sneer < 0 ? -sneer * 6 : 0), cyR = my - smile * 6 - (sneer > 0 ? sneer * 6 : 0);
  let s = "";
  if (o < .06) {
    const ctrl = my + smile * 10;
    s += `<path d="M${F1(mx - w)} ${F1(cyL)} Q${mx} ${F1(ctrl)} ${F1(mx + w)} ${F1(cyR)}" stroke="${OL}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M${F1(mx - w * .5)} ${F1(Math.max(cyL, cyR) + 6 + Math.max(0, smile) * 2)} Q${mx} ${F1(Math.max(cyL, cyR) + 9 + smile * 3)} ${F1(mx + w * .5)} ${F1(Math.max(cyL, cyR) + 6 + Math.max(0, smile) * 2)}" stroke="${c.lipsD}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/>`;
    if (c.lash) s += `<path d="M${F1(mx - w * .7)} ${F1((cyL + cyR) / 2 + smile * 4 - 2.5)} Q${mx} ${F1((cyL + cyR) / 2 + smile * 6 - 5)} ${F1(mx + w * .7)} ${F1((cyL + cyR) / 2 + smile * 4 - 2.5)}" stroke="${c.lips}" stroke-width="3.6" fill="none" opacity=".8" stroke-linecap="round"/>`;
    if (smile > .3) s += `<path d="M${F1(mx - w - 2)} ${F1(cyL - 2)} q-3 3 -1 6 M${F1(mx + w + 2)} ${F1(cyR - 2)} q3 3 1 6" stroke="${c.shade}" stroke-width="2" fill="none"/>`;
    return s;
  }
  const up = my - 1 - o * 2, low = my + 4 + o * 20 + Math.max(0, smile) * 5;
  const id = uid("m");
  const shape = `M${F1(mx - w)} ${F1(cyL)} Q${mx} ${F1(up - smile * 2)} ${F1(mx + w)} ${F1(cyR)} Q${F1(mx + w * .7)} ${F1(low)} ${mx} ${F1(low)} Q${F1(mx - w * .7)} ${F1(low)} ${F1(mx - w)} ${F1(cyL)} Z`;
  s += `<clipPath id="${id}"><path d="${shape}"/></clipPath>`;
  s += `<path d="${shape}" fill="#3a1110"/>`;
  s += `<g clip-path="url(#${id})">`;
  if (o > .12 || p.teeth) s += `<rect x="${F1(mx - w)}" y="${F1(up - 6)}" width="${F1(w * 2)}" height="${F1(5 + o * 4 + (p.teeth ? 3 : 0))}" rx="2" fill="#fbf8f2"/>`;
  if (p.teethLow) s += `<rect x="${F1(mx - w)}" y="${F1(low - 6)}" width="${F1(w * 2)}" height="7" fill="#f3efe6"/>`;
  if (o > .35) s += `<ellipse cx="${mx}" cy="${F1(low + 2)}" rx="${F1(w * .65)}" ry="${F1(5 + o * 4)}" fill="#c04a4f"/>`;
  s += `</g>`;
  s += `<path d="${shape}" fill="none" stroke="${OL}" stroke-width="2.6" stroke-linejoin="round"/>`;
  s += `<path d="M${F1(mx - w * .55)} ${F1(low + 4)} Q${mx} ${F1(low + 7)} ${F1(mx + w * .55)} ${F1(low + 4)}" stroke="${c.lipsD}" stroke-width="2.6" fill="none" opacity=".5" stroke-linecap="round"/>`;
  if (c.lash) s += `<path d="${shape}" fill="none" stroke="${c.lips}" stroke-width="1.8" opacity=".7"/>`;
  return s;
}
function nose(c, nx, ny, turn) {
  const d = turn * 4;
  return `<path d="M${F1(nx + 2 + d)} ${ny - 18} Q${F1(nx + 7 + d * 1.4)} ${ny - 2} ${F1(nx + 7 + d)} ${ny + 4}" stroke="${c.shade}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<path d="M${F1(nx - 8 + d)} ${ny + 3} Q${F1(nx - 2 + d)} ${ny + 9} ${F1(nx + 9 + d)} ${ny + 3}" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>` +
    `<ellipse cx="${F1(nx - 3 + d)}" cy="${ny - 5}" rx="3" ry="6" fill="${c.light}" opacity=".55"/>`;
}

/* ---------- hair ---------- */
function hairBack(c, p) {
  const C = p.wet ? shadeHex(c.hairC, -.25) : c.hairC;
  switch (c.hair) {
    case "long": {
      const sw = Math.sin((p.t || 0) * 1.6) * 3;
      return `<path d="M-58 -36 C-80 30 -76 120 ${F1(-70 + sw)} 196 C-40 210 40 210 ${F1(70 + sw)} 196 C76 120 80 30 58 -36 Z" fill="${C}" stroke="${OL}" stroke-width="2.6"/>` +
        `<path d="M-60 40 C-66 100 ${F1(-62 + sw)} 150 ${F1(-58 + sw)} 186 M60 40 C66 100 ${F1(62 + sw)} 150 ${F1(58 + sw)} 186" stroke="${shadeHex(c.hairC, -.25)}" stroke-width="3" fill="none"/>`;
    }
    case "bob": return `<path d="M-64 -30 C-82 30 -74 66 -52 78 L52 78 C74 66 82 30 64 -30 Z" fill="${C}" stroke="${OL}" stroke-width="2.6"/>`;
    case "bun": return `<circle cx="10" cy="-84" r="24" fill="${C}" stroke="${OL}" stroke-width="2.6"/><path d="M-6 -92 q16 -12 32 2" stroke="${c.hairH}" stroke-width="2.4" fill="none" opacity=".7"/>`;
  }
  return "";
}
function hairFront(c, p) {
  const C = p.wet ? shadeHex(c.hairC, -.3) : c.hairC, H = c.hairH;
  switch (c.hair) {
    case "afro": {
      let s = "";
      const cap = `M-55 -18 C-66 -60 -50 -98 -10 -104 C30 -110 64 -86 58 -30 C56 -22 54 -16 52 -12 C46 -40 30 -52 0 -54 C-28 -54 -46 -42 -55 -18 Z`;
      // bumpy silhouette from circles
      let blobs = "";
      for (let k = 0; k < 15; k++) {
        const a = Math.PI * (1.02 + .96 * k / 14);
        const r = 13 + hsh(k + 3) * 4;
        blobs += `<circle cx="${F1(Math.cos(a) * 50)}" cy="${F1(Math.sin(a) * 50 - 34)}" r="${F1(r)}"/>`;
      }
      s += `<g fill="${C}" stroke="${OL}" stroke-width="5">${blobs}</g><g fill="${C}">${blobs}</g><path d="${cap}" fill="${C}"/>`;
      for (let k = 0; k < 10; k++) {
        const a = Math.PI * (1.15 + .7 * k / 9), r = 30 + hsh(k) * 12;
        s += `<path d="M${F1(Math.cos(a) * r - 4)} ${F1(Math.sin(a) * r - 40)} q4 -4 8 0" stroke="${H}" stroke-width="2.2" fill="none" opacity="${p.wet ? .3 : .75}" stroke-linecap="round"/>`;
      }
      s += `<path d="M-52 -14 C-46 -30 -40 -36 -34 -40 M52 -12 C46 -28 40 -34 34 -38" stroke="${OL}" stroke-width="2.2" fill="none"/>`;
      // fade at sides
      s += `<path d="M-51 -20 L-52 4 L-47 2 L-46 -24 Z M51 -20 L52 4 L47 2 L46 -24 Z" fill="${C}" opacity=".55"/>`;
      if (p.wet) s += `<path d="M-30 -60 v12 M8 -72 v10 M34 -58 v12" stroke="#9fb6cf" stroke-width="1.6" opacity=".7"/>`;
      return s;
    }
    case "long":
      return `<path d="M-58 0 C-66 -88 66 -92 58 0 C54 -30 34 -56 4 -56 C-6 -40 -26 -26 -50 -16 C-54 -10 -56 -6 -58 0 Z" fill="${C}" stroke="${OL}" stroke-width="2.6" stroke-linejoin="round"/>` +
        `<path d="M-58 -4 C-72 40 -54 84 -64 124 C-68 144 -60 162 -48 172 C-44 156 -50 140 -47 122 C-40 84 -54 40 -46 -14 Z M58 -4 C72 40 54 84 64 124 C68 144 60 162 48 172 C44 156 50 140 47 122 C40 84 54 40 46 -14 Z" fill="${C}" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-56 30 C-62 70 -52 100 -58 130 M56 30 C62 70 52 100 58 130" stroke="${H}" stroke-width="2.2" fill="none" opacity=".6"/>` +
        `<path d="M-10 -66 C-30 -60 -44 -40 -50 -18 M20 -62 C38 -52 48 -34 52 -10" stroke="${H}" stroke-width="3" fill="none" opacity=".75" stroke-linecap="round"/>` +
        `<path d="M4 -56 C0 -44 -10 -34 -22 -28" stroke="${shadeHex(c.hairC, -.3)}" stroke-width="2" fill="none"/>`;
    case "slick":
      return `<path d="M-55 -16 C-62 -86 62 -90 55 -16 C52 -34 44 -50 22 -54 C0 -58 -30 -56 -46 -44 C-50 -36 -53 -26 -55 -16 Z" fill="${C}" stroke="${OL}" stroke-width="2.6"/>` +
        `<path d="M-40 -62 C-14 -74 20 -72 44 -56 M-34 -50 C-10 -60 18 -60 40 -46" stroke="${H}" stroke-width="2.6" fill="none" opacity=".9" stroke-linecap="round"/>` +
        `<path d="M-52 -16 C-54 -4 -53 6 -50 14 L-46 14 C-48 4 -48 -8 -46 -20 Z M52 -16 C54 -4 53 6 50 14 L46 14 C48 4 48 -8 46 -20 Z" fill="${C}" stroke="${OL}" stroke-width="1.8"/>`;
    case "bob":
      return `<path d="M-62 10 C-78 -100 78 -100 62 10 C58 -24 30 -50 -10 -48 C-30 -36 -48 -24 -62 10 Z" fill="${C}" stroke="${OL}" stroke-width="2.6"/>` +
        `<path d="M-62 4 C-68 32 -64 56 -54 72 L-42 70 C-50 50 -52 26 -48 -8 Z M62 4 C68 32 64 56 54 72 L42 70 C50 50 52 26 48 -8 Z" fill="${C}" stroke="${OL}" stroke-width="2.4"/>` +
        `<path d="M-30 -56 C-6 -66 24 -60 44 -40 M-48 -24 C-40 -40 -24 -50 -10 -48" stroke="${H}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    case "bun":
      return `<path d="M-52 -8 C-60 -82 60 -82 52 -8 C44 -46 22 -56 0 -56 C-22 -56 -44 -46 -52 -8 Z" fill="${C}" stroke="${OL}" stroke-width="2.6"/>` +
        `<path d="M-24 -66 C-38 -54 -46 -36 -50 -14 M18 -66 C30 -58 40 -46 46 -26" stroke="${H}" stroke-width="2.6" fill="none" opacity=".8"/>`;
  }
  return "";
}
function shadeHex(hex, k) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const m = (v) => Math.round(CL(k < 0 ? v * (1 + k) : v + (255 - v) * k, 0, 255));
  return "#" + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1);
}

/* ---------- clothing / torso ---------- */
function torso(c, p) {
  const top = p.top, br = Math.sin((p.t || 0) * 2.1) * 1.4; // breathing
  const shoulders = (col, colD) =>
    `<path d="M-128 250 C-126 168 -96 128 -40 116 L40 116 C96 128 126 168 128 250 Z" fill="${col}" stroke="${OL}" stroke-width="2.6"/>` +
    `<path d="M-128 250 C-126 190 -110 160 -84 142 C-96 176 -100 214 -98 250 Z" fill="${colD}" opacity=".7"/>`;
  let s = `<g transform="translate(0 ${F1(br)})">`;
  switch (top) {
    case "tee": {
      const col = p.wet ? "#3f5f59" : "#4f8279", colD = p.wet ? "#2c4542" : "#3a6560";
      s += shoulders(col, colD);
      s += `<path d="M-26 114 Q0 140 26 114" fill="none" stroke="${OL}" stroke-width="2.4"/><path d="M-22 116 Q0 134 22 116" fill="none" stroke="${colD}" stroke-width="4"/>`;
      s += `<path d="M-88 136 L-74 250 M88 136 L74 250" stroke="#b33a2c" stroke-width="15"/><path d="M-88 136 L-74 250 M88 136 L74 250" stroke="${OL}" stroke-width="1.6" opacity=".6"/>`;
      s += `<path d="M-40 180 q16 10 30 4 M30 200 q14 -6 26 2" stroke="${colD}" stroke-width="2.4" fill="none"/>`;
      if (p.wet) s += `<path d="M-60 160 v12 M44 150 v10 M10 190 v8" stroke="#a8c4e0" stroke-width="1.6" opacity=".6"/>`;
      break;
    }
    case "shirt":
      s += shoulders("#f4f2ec", "#d7d3c8");
      s += `<path d="M-26 112 L-8 146 L0 122 Z M26 112 L8 146 L0 122 Z" fill="#fff" stroke="${OL}" stroke-width="2.2" stroke-linejoin="round"/>`;
      s += `<path d="M0 122 V250" stroke="#cfcbc0" stroke-width="2"/><circle cy="168" r="2.6" fill="#bdb8ab"/><circle cy="210" r="2.6" fill="#bdb8ab"/>`;
      s += `<path d="M-96 166 q18 -12 34 -6 M96 166 q-18 -12 -34 -6" stroke="#cfcbc0" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      break;
    case "suit":
      s += shoulders("#1f2a44", "#141c30");
      s += `<path d="M-26 112 L0 190 L26 112 Z" fill="#f3f3f1" stroke="${OL}" stroke-width="2"/>`;
      s += `<path d="M-7 124 L7 124 L11 182 L0 198 L-11 182 Z" fill="#6a1a24" stroke="${OL}" stroke-width="1.8"/><path d="M-7 124 L7 124 L4 134 L-4 134 Z" fill="#4c1019"/>`;
      s += `<path d="M-26 112 L-52 206 L-8 160 Z M26 112 L52 206 L8 160 Z" fill="#2a3757" stroke="${OL}" stroke-width="2.2" stroke-linejoin="round"/>`;
      s += `<path d="M-74 168 l18 4" stroke="#d7b356" stroke-width="3.4" stroke-linecap="round"/><circle cx="-60" cy="166" r="3" fill="#e0c063"/>`;
      if (p.pocketGlow) s += `<rect x="30" y="160" width="40" height="12" rx="3" fill="none" stroke="#ff3b3b" stroke-width="3" opacity="${p.pocketGlow}"/>`;
      break;
    case "blouse":
      s += shoulders("#e7d6bc", "#cbb593");
      s += `<path d="M-26 114 Q0 146 26 114" fill="${c.skin}" stroke="${OL}" stroke-width="2.2"/><path d="M-20 122 Q0 148 20 122" fill="none" stroke="#d9b45c" stroke-width="1.8"/><circle cy="146" r="3.4" fill="#e8c35f" stroke="${OL}" stroke-width="1"/>`;
      break;
    case "luxe": {
      s += shoulders("#5e1b35", "#43112449".slice(0, 7));
      s += `<path d="M-34 114 Q0 154 34 114" fill="${c.skin}" stroke="${OL}" stroke-width="2.2"/>`;
      for (let i = 0; i < 13; i++) { const a = Math.PI * (.12 + .76 * i / 12); s += `<circle cx="${F1(-Math.cos(a) * 34)}" cy="${F1(114 + Math.sin(a) * 30)}" r="4.4" fill="#f7f2ea" stroke="#b9ab96" stroke-width=".9"/>`; }
      break;
    }
    case "simple":
      s += shoulders("#6d7f93", "#55667a");
      s += `<path d="M-26 114 Q0 136 26 114" fill="none" stroke="${OL}" stroke-width="2.4"/>`;
      s += `<path d="M-80 140 C-60 170 -70 220 -66 250 M80 140 C60 170 70 220 66 250" stroke="#9aa9b8" stroke-width="10" fill="none" opacity=".55"/>`;
      break;
  }
  return s + `</g>`;
}

/* ---------- full bust ---------- */
function charBust(name, x, y, sc, p = {}) {
  const c = Object.assign({}, CAST[name], p.override || {});
  const t = p.t || 0;
  // auto blink
  let blinkAmt = p.blinkAmt || 0;
  if (p.autoBlink !== false) {
    const per = 3.1 + hsh(name.length) * 1.5, ph = ((t + hsh(name.length * 3) * 3) % per);
    if (ph < .14) blinkAmt = Math.max(blinkAmt, Math.sin(ph / .14 * Math.PI));
  }
  const q = Object.assign({}, p, { blinkAmt, t });
  const turn = CL(p.turn || 0, -1, 1), tilt = p.tilt || 0, nod = p.nod || 0;
  const fx = turn * 12;
  const sxL = 1 - Math.max(0, turn) * .28, sxR = 1 + Math.min(0, turn) * .28;
  const head = headPath(c.jaw);
  const fid = uid("f");
  let H = "";
  H += `<g transform="translate(${F1(turn * 3)} ${F1(nod + 6)}) rotate(${F1(tilt)} 0 40)">`;
  // ears
  const earL = turn > .55 ? "" : `<ellipse cx="${F1(-50 + turn * 6)}" cy="4" rx="9" ry="14" fill="${c.skin}" stroke="${OL}" stroke-width="2.4"/><path d="M${F1(-51 + turn * 6)} -2 q-4 6 0 12" stroke="${c.shade}" stroke-width="2" fill="none"/>`;
  const earR = turn < -.55 ? "" : `<ellipse cx="${F1(50 + turn * 6)}" cy="4" rx="9" ry="14" fill="${c.skin}" stroke="${OL}" stroke-width="2.4"/><path d="M${F1(51 + turn * 6)} -2 q4 6 0 12" stroke="${c.shade}" stroke-width="2" fill="none"/>`;
  H += earL + earR;
  if (c.earring) H += `<circle cx="${F1(-50 + turn * 6)}" cy="22" r="4" fill="${c.earring}" stroke="${OL}" stroke-width="1.2"/><circle cx="${F1(50 + turn * 6)}" cy="22" r="4" fill="${c.earring}" stroke="${OL}" stroke-width="1.2"/>`;
  H += `<clipPath id="${fid}"><path d="${head}"/></clipPath>`;
  H += `<path d="${head}" fill="${c.skin}"/>`;
  H += `<g clip-path="url(#${fid})">`;
  // cel shade: side opposite the key light (key light from upper right by default)
  const ls = p.lightSide ?? 1;
  H += `<ellipse cx="${F1(-ls * 62 + turn * 10)}" cy="10" rx="36" ry="90" fill="${c.shade}" opacity=".55"/>`;
  H += `<path d="M-60 30 Q0 82 60 30 L60 80 L-60 80 Z" fill="${c.shade}" opacity=".35"/>`;
  H += `<ellipse cx="${F1(ls * 30 + turn * 8)}" cy="-44" rx="22" ry="12" fill="${c.light}" opacity=".5"/>`;
  if (p.rim) H += `<path d="${head}" fill="none" stroke="${p.rim}" stroke-width="5" opacity=".55" transform="translate(${F1(ls * 3)} 0)"/>`;
  // beard
  if (c.beard) H += `<path d="M-46 14 C-44 44 -26 62 0 64 C26 62 44 44 46 14 C40 28 30 36 14 32 C6 30 -6 30 -14 32 C-30 36 -40 28 -46 14 Z" fill="${c.beard}" opacity=".95"/>`;
  if (c.jaw === "young") H += `<path d="M-30 40 Q0 58 30 40" stroke="${c.shade}" stroke-width="2" fill="none" opacity=".5"/>`;
  H += `</g>`;
  H += `<path d="${head}" fill="none" stroke="${OL}" stroke-width="2.8"/>`;
  // features
  const ey = -4;
  if (c.age) H += `<path d="M${F1(-40 + fx)} -38 q8 -3 16 0 M${F1(24 + fx)} -38 q8 -3 16 0" stroke="${c.shade}" stroke-width="1.8" fill="none" opacity="${.5 * c.age}"/>`;
  H += eye(c, q, -1, F1(-21 * sxL + fx), ey, sxL, t) + eye(c, q, 1, F1(21 * sxR + fx), ey, sxR, t);
  H += brow(c, q, -1, F1(-21 * sxL + fx), -25, sxL) + brow(c, q, 1, F1(21 * sxR + fx), -25, sxR);
  H += nose(c, fx * 1.15, 18, turn);
  if (c.age) H += `<path d="M${F1(-17 + fx)} 26 q-8 10 -5 20 M${F1(17 + fx)} 26 q8 10 5 20" stroke="${c.shade}" stroke-width="2.2" fill="none" opacity="${.75 * c.age}"/>`;
  const blush = (p.blush || 0) + (c.blushBase || 0);
  if (blush > 0) H += `<ellipse cx="${F1(-31 + fx)}" cy="18" rx="10" ry="6" fill="#ef7f86" opacity="${F1(blush * .5 * 100) / 100}"/><ellipse cx="${F1(31 + fx)}" cy="18" rx="10" ry="6" fill="#ef7f86" opacity="${F1(blush * .5 * 100) / 100}"/>`;
  if (c.beard) H += `<path d="M${F1(-18 + fx)} 30 Q${F1(fx)} 24 ${F1(18 + fx)} 30 Q${F1(fx)} 36 ${F1(-18 + fx)} 30 Z" fill="${shadeHex(c.beard, -.15)}"/>`;
  H += mouth(c, q, F1(fx * 1.05), 37, Math.min(sxL, sxR) * .5 + .5, t);
  if (p.tear != null && p.tear !== false) {
    const k = p.tear % 1;
    H += `<path d="M${F1(22 + fx)} 8 Q${F1(25 + fx)} ${F1(14 + k * 22)} ${F1(21 + fx)} ${F1(18 + k * 34)}" stroke="#bfe3ff" stroke-width="2.6" fill="none" opacity=".85"/>`;
    H += `<path d="M${F1(21 + fx)} ${F1(14 + k * 34)} q-4 6 0 9 q4 -3 0 -9 Z" fill="#e4f4ff" stroke="#8fbde6" stroke-width="1"/>`;
  }
  if (p.sweat) H += `<path d="M42 -48 q-5 8 0 12 q5 -4 0 -12 Z" fill="#e4f4ff" stroke="#8fbde6" stroke-width="1.2"/>`;
  if (p.wet) H += `<path d="M-38 -12 v9 M-30 24 v7 M40 6 v8 M28 46 v6" stroke="#d6eaff" stroke-width="1.4" opacity=".6"/>`;
  H += hairFront(c, q);
  if (p.shadowFace) H += `<path d="${head}" fill="#000" opacity="${p.shadowFace}"/>`;
  H += `</g>`;
  const body = `<path d="M-23 50 L-25 120 L25 120 L23 50 Z" fill="${c.shade}" stroke="${OL}" stroke-width="2.4"/>` + torso(c, Object.assign({}, p, { t }));
  const lean = p.lean || 0, HS = 1.12;
  const HB = `<g transform="translate(${F1(turn * 3)} ${F1(nod + 6)}) rotate(${F1(tilt)} 0 40)">${hairBack(c, q)}</g>`;
  return `<g transform="translate(${F1(x)} ${F1(y)}) scale(${sc.toFixed(3)}) rotate(${F1(lean)} 0 200)">${HB}${body}<g transform="scale(${HS})">${H}</g></g>`;
}

/* ---------- hands ---------- */
function handG(x, y, rot, s, skin, sleeve, o = {}) {
  const sh = shadeHex(skin, -.22);
  let g = `<g transform="translate(${F1(x)} ${F1(y)}) rotate(${F1(rot)}) scale(${s})" stroke-linejoin="round">`;
  if (sleeve) g += `<path d="M-30 34 L-34 180 L34 180 L30 34 Z" fill="${sleeve}" stroke="${OL}" stroke-width="2.6"/>` + (o.cuff ? `<rect x="-32" y="28" width="64" height="18" rx="5" fill="${o.cuff}" stroke="${OL}" stroke-width="2.2"/>` : "");
  const fl = o.fist ? [16, 18, 17, 14] : o.curl ? [24, 27, 26, 21] : [38, 44, 42, 34];
  [-19, -7, 5, 17].forEach((fx, i) => {
    g += `<rect x="${fx - 6}" y="${-10 - fl[i]}" width="12" height="${fl[i] + 16}" rx="6" fill="${skin}" stroke="${OL}" stroke-width="2.4"/>`;
    g += `<path d="M${fx - 3} ${-6 - fl[i] * .45} h6" stroke="${sh}" stroke-width="1.6"/>`;
  });
  g += `<path d="M-26 -14 Q-28 30 -18 40 L20 40 Q30 30 28 -14 Z" fill="${skin}" stroke="${OL}" stroke-width="2.6"/>`;
  g += `<path d="M-26 6 Q-46 -6 -44 -22 Q-40 -30 -32 -22 Q-26 -12 -22 -2" fill="${skin}" stroke="${OL}" stroke-width="2.4"/>`;
  g += `<path d="M14 -10 Q22 10 12 34" stroke="${sh}" stroke-width="2.4" fill="none" opacity=".6"/>`;
  if (o.watch) g += `<rect x="-29" y="30" width="58" height="14" rx="4" fill="#c9992f" stroke="${OL}" stroke-width="2"/><circle cx="0" cy="37" r="10" fill="#f1d26d" stroke="${OL}" stroke-width="2"/><path d="M0 37 v-6 M0 37 h4" stroke="${OL}" stroke-width="1.4"/>`;
  if (o.ring) g += `<rect x="-13" y="-22" width="12" height="5" rx="2" fill="#ecc85a" stroke="${OL}" stroke-width="1"/>`;
  if (o.wet) g += `<circle cx="-8" cy="8" r="2.2" fill="#dbeeff" opacity=".8"/><circle cx="10" cy="-28" r="1.8" fill="#dbeeff" opacity=".8"/>`;
  return g + "</g>";
}

if (typeof module !== "undefined") module.exports = { charBust, handG, CAST, shadeHex };
