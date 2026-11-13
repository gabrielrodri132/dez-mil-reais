"""Score + sound effects synthesized to the timeline, then mixed with the voice track (with ducking)."""
import json, os
import numpy as np
from scipy.signal import butter, sosfilt, lfilter

SR = 48000
ROOT = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(ROOT, "timeline.json")))
SHOTS = json.load(open(os.path.join(ROOT, "shots.json")))
DUR = TL["dur"]
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)

music = np.zeros((N, 2)); fx = np.zeros((N, 2)); amb = np.zeros((N, 2))


def seg(id_): return TL["segs"][id_]
def shot(name, k=0):
    xs = [s for s in SHOTS if s["name"] == name]; return xs[k]
def ph(id_, i): return seg(id_)["phrases"][i]["a"]

def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)

def add(buf, t, sig, gain=1.0, pan=0.0):
    i0 = int(t * SR)
    if i0 >= len(buf) or i0 + len(sig) <= 0: return
    if sig.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    a = max(0, i0); b = min(len(buf), i0 + len(sig))
    buf[a:b] += sig[a - i0:b - i0] * gain

def env_ad(n, a, d):
    e = np.ones(n); ai = int(a * SR); di = int(d * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if di: e[-di:] *= np.linspace(1, 0, di)
    return e

def tvec(d): return np.arange(int(d * SR)) / SR

# ---------- instruments ----------
def boom(d=2.2):
    t = tvec(d); f = 90 * np.exp(-t * 3) + 30
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    n = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 9) * .5
    return np.tanh((s + n) * 1.6) * .9

def hit(d=.6):
    t = tvec(d); s = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 6) + 40) / SR) * np.exp(-t * 7)
    return s + bp(rng.standard_normal(len(t)), 1500, 5000) * np.exp(-t * 30) * .3

def whoosh(d=.7, up=True):
    t = tvec(d); n = rng.standard_normal(len(t)); out = np.zeros_like(n)
    # sweep via chunked band-pass
    K = 24
    for k in range(K):
        a, b = k * len(t) // K, (k + 1) * len(t) // K
        fr = 300 * (12 ** (k / K if up else 1 - k / K))
        out[a:b] = bp(n, fr, fr * 1.8)[a:b]
    return out * np.sin(np.pi * t / d) ** 2 * .9

def riser(d=2.0):
    t = tvec(d); f = 200 * (8 ** (t / d))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * .25 + whoosh(d) * .6
    return s * (t / d) ** 2

def buzz(n=2):
    out = np.zeros(int((n * .45 + .4) * SR))
    for i in range(n):
        t = tvec(.32); s = np.sign(np.sin(2 * np.pi * 150 * t)) * .5 + np.sin(2 * np.pi * 300 * t) * .3
        s = lp(s, 900) * env_ad(len(t), .01, .05)
        add1(out, i * .45, s)
    return out * .5

def add1(buf, t, s):
    i0 = int(t * SR); b = min(len(buf), i0 + len(s)); buf[i0:b] += s[: b - i0]

def ping():
    t = tvec(.5); s = np.sin(2 * np.pi * 1318 * t) * np.exp(-t * 10) * .5
    t2 = tvec(.5); s2 = np.sin(2 * np.pi * 1760 * t2) * np.exp(-t2 * 9) * .4
    out = np.zeros(int(.62 * SR)); add1(out, 0, s); add1(out, .09, s2); return out * .6

def stampSnd():
    return hit(.5) * .9 + lp(rng.standard_normal(int(.25 * SR)), 2000).tolist().__len__() * 0 if False else hit(.5) * .9

def tick():
    t = tvec(.05); return bp(rng.standard_normal(len(t)), 2500, 6000) * np.exp(-t * 120) * .6

def heartbeat():
    out = np.zeros(int(.8 * SR))
    for at, f0 in ((0, 62), (.22, 55)):
        t = tvec(.3); add1(out, at, np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 4) + 30) / SR) * np.exp(-t * 12))
    return out * .9

def tape_stop(d=.8):
    t = tvec(d); f = 220 * (1 - t / d) ** 2 + 20
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .3
    return lp(s, 1200) * (1 - t / d)

def click():
    t = tvec(.06); return bp(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t * 90) * .8

def bell():
    t = tvec(1.6); s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dcy) * a for f, a, dcy in ((1760, .5, 3), (2640, .3, 4), (3520, .2, 6), (4410, .12, 7)))
    return s * .55

def sparkle(d=1.2):
    out = np.zeros(int(d * SR))
    for i in range(14):
        f0 = 2000 + rng.random() * 3000; t = tvec(.25)
        add1(out, rng.random() * (d - .3), np.sin(2 * np.pi * f0 * t) * np.exp(-t * 18) * .25)
    return out

def flutter(d=2.4):
    t = tvec(d); n = bp(rng.standard_normal(len(t)), 800, 4000)
    return n * (.5 + .5 * np.sign(np.sin(2 * np.pi * 11 * t))) * np.exp(-t * .8) * .25

def cough():
    out = np.zeros(int(1.0 * SR))
    for at in (0, .32):
        t = tvec(.22); add1(out, at, bp(rng.standard_normal(len(t)), 300, 1800) * np.exp(-t * 14) * .7)
    return out

# ---------- music beds ----------
def note_freq(n): return 440 * 2 ** ((n - 69) / 12)

def drone(d, root=38, bright=150):
    t = tvec(d); s = np.zeros(len(t))
    for det in (0, .3, -.25):
        s += np.sign(np.sin(2 * np.pi * (note_freq(root) + det) * t)) * .2
    s += np.sin(2 * np.pi * note_freq(root - 12) * t) * .4
    s = lp(s, bright)
    wob = 1 + .25 * np.sin(2 * np.pi * .13 * t)
    return s * wob

def pad(d, chords, rate):
    out = np.zeros(int(d * SR)); L = int(rate * SR)
    for k in range(int(np.ceil(d / rate))):
        ch = chords[k % len(chords)]; t = tvec(rate + .8); s = np.zeros(len(t))
        for n in ch:
            for det in (-.15, .15): s += np.sin(2 * np.pi * (note_freq(n) + det) * t) + .3 * np.sin(4 * np.pi * (note_freq(n) + det) * t)
        s = lp(s, 1600) * env_ad(len(t), .5, .9) * .12
        i0 = k * L; b = min(len(out), i0 + len(s)); out[i0:b] += s[: b - i0]
    return out

def pluck_seq(d, notes, step, decay=5.0, gain=.25):
    out = np.zeros(int(d * SR))
    for k in range(int(d / step)):
        n = notes[k % len(notes)]
        if n is None: continue
        t = tvec(min(1.2, step * 4)); f0 = note_freq(n)
        s = (np.sin(2 * np.pi * f0 * t) + .4 * np.sin(4 * np.pi * f0 * t) + .15 * np.sin(6 * np.pi * f0 * t)) * np.exp(-t * decay)
        add1(out, k * step, s * gain)
    return out

def pulse(d, bpm=92, gain=.5):
    out = np.zeros(int(d * SR)); step = 60 / bpm
    for k in range(int(d / step)):
        t = tvec(.35); f = 55 * np.exp(-t * 8) + 38
        add1(out, k * step, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * gain)
        if k % 2 == 1: add1(out, k * step, tick() * .4)
    return out

def put_music(a, b, sig, gain, fade_in=.3, fade_out=.4):
    n = int((b - a) * SR); sig = sig[:n]
    e = env_ad(len(sig), fade_in, fade_out)
    add(music, a, sig * e, gain)

def rain_noise(d, gain):
    n = rng.standard_normal(int(d * SR))
    s = bp(n, 900, 7000) * .6 + lp(n, 400) * .25
    return s * gain

# ---------- ep2 extra instruments ----------
def cuff_click():
    out = np.zeros(int(.9 * SR))
    for at, g in ((0, 1.0), (.045, .7), (.09, .5)):
        t = tvec(.08); add1(out, at, bp(rng.standard_normal(len(t)), 2500, 9000) * np.exp(-t * 70) * g)
    t = tvec(.8); ring = sum(np.sin(2 * np.pi * fq * t) * np.exp(-t * dc) for fq, dc in ((2350, 9), (3710, 12), (5230, 16))) * .12
    add1(out, .01, ring); return out
def heel_step():
    t = tvec(.12); return bp(rng.standard_normal(len(t)), 1800, 6000) * np.exp(-t * 60) * .9 + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 50) * .2
def shutter():
    out = np.zeros(int(.3 * SR)); add1(out, 0, click()); add1(out, .09, click() * .8); return out
def siren(d):
    t = tvec(d); f = 760 + 220 * np.sign(np.sin(2 * np.pi * .9 * t)); s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return lp(s, 2000) * .25
def door_creak():
    t = tvec(1.0); f = 300 + 120 * np.sin(2 * np.pi * 1.3 * t)
    return bp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .3, 300, 2500) * env_ad(len(t), .1, .3)

def at_(ref):
    sid, rest = ref.split(".", 1); sg = TL["segs"][sid]
    if rest == "v0": return sg["v0"]
    if rest == "a": return sg["a"]
    if rest == "b": return sg["b"]
    if rest.startswith("p"):
        e = rest.endswith("e"); i = int(rest[1:].rstrip("e")); ph = sg["phrases"][i]
        return ph["b"] if e else ph["a"]
def sh(name): return [s for s in SHOTS if s["name"] == name][0]

# ---------- arrange ----------
# Act 0: car hook (night)
a, b = 0, at_("GL.v0")
put_music(a, b, drone(b, 36, 160) + pulse(b, 96, .5), .9, .05, .3)
add(fx, 0.0, cuff_click(), 1.2); add(fx, 0.02, boom(1.8), .8)
add(amb, 0, rain_noise(b, .08) * env_ad(int(b * SR), .1, .2), 1)
add(amb, 0, siren(b) * env_ad(int(b * SR), .3, .3), .35)
add(fx, at_("L1.p1") - .05, hit(.6), .8)
add(fx, at_("L1.p2") - .1, whoosh(.5), .3)
add(fx, at_("GL.v0"), tape_stop(.8), .6); add(fx, at_("GL.v0") + .2, whoosh(.9, False), .5)
# Act 1: rain, counting, photo
a, b = at_("L2.v0"), at_("C2.v0")
put_music(a, b, drone(b - a, 40, 220) + pluck_seq(b - a, [64, 67, 71, 74], .2, 6, .08), .9)
add(amb, a, rain_noise(b - a, .14) * env_ad(int((b - a) * SR), .3, .4), 1)
for k in range(16): add(fx, a + .2 + k * .11, tick(), .45)
ph = sh("photoReveal")["a"]
add(fx, ph, whoosh(.6), .4); add(fx, at_("L2.p3") - .05, boom(1.8), .8); add(fx, at_("L2.p3"), hit(.6), .7)
add(fx, at_("FLIP.a") + .1, whoosh(.5), .4)
fa = at_("FLIP.a"); add(fx, fa + .7, hit(.5), .8)
for k in range(3): add(fx, fa + .2 + k * .55, heartbeat(), .8)
add(fx, at_("FLIP.b") - .35, shutter(), 1.0)
# Act 2: home (sad, tense)
a, b = at_("C2.v0"), at_("G1.v0")
put_music(a, b, pad(b - a, [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 48, 52]], 2.6) * .9 + drone(b - a, 38, 140) * .5, .9)
add(amb, a, rain_noise(b - a, .05), 1)
add(fx, at_("C3.p1") - .1, boom(1.6), .6)
add(fx, at_("C4.v0") + .15, hit(.5), .8)
add(fx, at_("C4.p3"), boom(1.6), .6)
# Act 3: mansion morning (cold)
a, b = at_("G1.v0"), at_("L8.v0")
put_music(a, b, drone(b - a, 36, 140) + pluck_seq(b - a, [48, None, None, 51, None, None, 47, None], .42, 3, .2), .85)
add(amb, a, siren(1.2) * env_ad(int(1.2 * SR), .05, .6), .25)
add(fx, at_("G1.v0") + .3, door_creak(), .5)
for k in range(4): add(fx, at_("R1.v0") + .1 + k * .32, heel_step(), .35)
add(fx, sh("aparadorPlace")["a"] + .8, hit(.4), .7)
add(fx, at_("R2.v0"), boom(2.0), .7); add(fx, at_("R2.v0") + .05, hit(.6), .6)
for k in range(int((at_("R3.p2") - at_("R3.v0")) / .16)): add(fx, at_("R3.v0") + k * .16, tick(), .55)
add(fx, at_("R3.p3") - .02, boom(2.2), 1.0); add(fx, at_("R3.p3"), hit(.8), .9)
# Act 4: proof, arrest, Isabela
a, b = at_("L8.v0"), at_("P1.v0")
put_music(a, b, drone(b - a, 34, 120) + pulse(b - a, 100, .45), .9)
add(fx, at_("L8.v0"), hit(.5), .6)
add(fx, at_("D1.p0") + .4, buzz(1), .5)
add(fx, sh("cuffsHall")["a"] + .06, cuff_click(), 1.2); add(fx, sh("cuffsHall")["a"] + .06, boom(1.4), .6)
for k in range(5): add(fx, at_("I1.v0") + k * .14, heel_step() * .6, .4)
add(fx, at_("I2.p1"), boom(1.4), .4)
add(fx, sh("ricardoPocket")["a"] + .9, hit(.5), .7)
# Act 5: the deal
a, b = at_("P1.v0"), at_("U1.v0")
put_music(a, b, drone(b - a, 33, 110) + pluck_seq(b - a, [45, None, 48, None, 44, None, None, None], .5, 3, .18), .85)
for k in range(3): add(fx, at_("P1.v0") + k * .35, heel_step(), .4)
add(fx, sh("folderOpen")["a"] + .1, whoosh(.5), .35)
add(fx, at_("L11.p1"), boom(2.0), .9); add(fx, at_("L11.p1"), hit(.6), .8)
p0a, p0b = at_("P2.p0"), at_("P2.p0e"); add(fx, p0a + (p0b - p0a) * .6, hit(.7), 1.0)
# Act 6: out the back, car, window
a, b = at_("U1.v0") - .4, at_("L14.v0")
put_music(a, b, drone(b - a, 38, 180) + pad(b - a, [[50, 53, 57], [46, 50, 53]], 3) * .7, .85)
add(amb, at_("U1.v0"), siren(b - at_("U1.v0")) * env_ad(int((b - at_("U1.v0")) * SR), .5, .5), .2)
add(amb, at_("U1.v0"), rain_noise(b - at_("U1.v0"), .09), 1)
add(fx, at_("U1.v0") - .1, buzz(2), .9)
add(fx, at_("U1.p1") - .02, boom(1.6), .8)
add(fx, at_("L13.p1"), boom(2.0), .8)
# Act 7: vote
a, b = at_("L14.v0"), at_("L15.v0")
put_music(a, b, pad(b - a, [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], 2.0) * 1.1 + pulse(b - a, 92, .32), .85, .4, .4)
add(fx, at_("L14.p4"), hit(.4), .6); add(fx, at_("L14.p5"), hit(.4), .6)
# Act 8: reward + heels
a, b = at_("L15.v0"), DUR
put_music(a, b, drone(b - a, 33, 130) + pluck_seq(b - a, [52, None, 55, None, 51, None, None, None], .45, 3, .15), .9, .3, .3)
sub = sh("subscribeLock")["a"]
add(fx, sub + .3, whoosh(.6), .4); add(fx, sub + 1.6, click(), 1.0); add(fx, sub + 1.8, bell(), .8); add(fx, sub + 1.8, sparkle(1.2), .6)
add(fx, sub + 2.0, hit(.4), .5); add(fx, sub + 2.4, tick(), .9)
hv = sh("heels")["a"]
add(fx, hv, boom(2.2), .8)
for k in range(10): add(fx, hv + .6 + k * .7, tick() * .5, .3)
add(fx, at_("L16.p2e") - .1, whoosh(.5), .4)
add(fx, DUR - .12, cuff_click()[: int(.12 * SR)], 1.1)  # loop back into frame 0

# ---------- mix ----------
voice = np.fromfile(os.path.join(ROOT, "voice.f32"), dtype=np.float32).astype(float)
v = np.zeros(N); v[: len(voice)] = voice
# ducking envelope from voice
fr = 960; nfr = N // fr
ve = np.sqrt(np.mean(v[: nfr * fr].reshape(nfr, fr) ** 2, 1))
act = (ve > .02).astype(float)
act = np.convolve(act, np.ones(12) / 12, mode="same")
duck = np.repeat(1 - .55 * np.clip(act * 1.5, 0, 1), fr); duck = np.pad(duck, (0, N - len(duck)), constant_values=1)
mix = music * duck[:, None] * .55 + fx * .8 + amb * duck[:, None] * .9
vs = np.stack([v, v], 1)
mix = mix + vs * 1.0
# soft limiter
pk = np.max(np.abs(mix)); mix = np.tanh(mix / max(pk, 1e-9) * 1.4) / np.tanh(1.4) * .95
mix = mix[: int(DUR * SR)]
mix.astype(np.float32).tofile(os.path.join(ROOT, "mix.f32"))
print("mix ok", DUR, float(np.max(np.abs(mix))))
