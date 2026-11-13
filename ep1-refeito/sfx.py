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

# ---------- arrange ----------
S = {s["name"] + ("" if i == 0 else str(i)): s for i, s in enumerate(SHOTS)}
def S1(name, k=0): return shot(name, k)

L1, U1a, L2, GL, L3, L5 = seg("L1"), seg("U1a"), seg("L2"), seg("GL"), seg("L3"), seg("L5")
R1, M1, L7, R2, L8, U2, L10, U1b, L12 = seg("R1"), seg("M1"), seg("L7"), seg("R2"), seg("L8"), seg("U2"), seg("L10"), seg("U1b"), seg("L12")

# Act 1: night hook
put_music(0, GL["v0"], drone(GL["v0"], 38, 170) + pulse(GL["v0"], 96, .55), .9)
add(amb, 0, rain_noise(GL["v0"], .10) * env_ad(int(GL["v0"] * SR), .2, .2), 1)
add(fx, 0.02, boom(), .9)
add(fx, S1("walletHook")["a"] + 1.5, hit(), .7)
add(fx, S1("lucasRainWallet")["a"], whoosh(.5), .35)
add(fx, U1a["v0"] - .1, buzz(2), .9)
add(fx, U1a["phrases"][1]["a"] - .02, boom(1.6), .8)
add(fx, S1("watcher")["a"] + .5, hit(), .6)
# rewind
add(fx, GL["v0"], tape_stop(.8), .6); add(fx, GL["v0"] + .2, whoosh(.9, False), .5)

# Act 2: life (warm-sad)
a, b = L3["v0"], L5["v0"]
put_music(a, b, pad(b - a, [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]], 2.4) + pluck_seq(b - a, [69, None, 64, None, 67, None, 64, 62], .3, 6, .12), 1.0)
add(fx, S1("kitchen")["a"] + .1, cough(), .5)
st = L3["phrases"][3]; add(fx, st["a"] + (st["b"] - st["a"]) * .25, hit(.7), 1.0)
add(fx, L3["phrases"][4]["a"], boom(1.4), .55)
# romance
a, b = L5["v0"], L5["phrases"][3]["a"]
put_music(a, b, pad(b - a, [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]], 1.6) + pluck_seq(b - a, [72, 76, 79, 76, 74, 77, 81, 77], .2, 7, .1), 1.0, .4, .3)
add(fx, L5["phrases"][3]["a"] - .05, ping(), .7)
a, b = L5["phrases"][3]["a"], R1["a"]
put_music(a, b, drone(b - a, 41, 220) + riser(b - a) * .8, .8, .1, .2)

# Act 3: dinner (cold, tense)
a, b = R1["v0"], L7["phrases"][1]["a"]
put_music(a, b, drone(b - a, 36, 140) + pluck_seq(b - a, [48, None, None, 51, None, None, 47, None], .42, 3, .2), .85)
add(fx, R1["v0"], boom(1.8), .6)
add(fx, R1["phrases"][0]["a"] - .05, hit(.5), .5)
add(fx, S1("lucasEmbarrassed")["a"], whoosh(.4), .3)
add(fx, S1("forks")["a"] + 1.1, tick(), .8)
a, b = L7["phrases"][1]["a"], L8["phrases"][3]["a"]
put_music(a, b, drone(b - a, 34, 120) + pulse(b - a, 70, .4), .9)
add(fx, S1("pocketPlant")["a"] + 1.2, hit(.5), .7)
add(fx, S1("noteDrop")["a"] + .2, flutter(2.4), .9)
add(fx, L8["v0"], boom(1.6), .7)
add(fx, S1("isaDown")["a"] + .2, whoosh(.6, False), .25)

# Act 4: rain + phone
a, b = L8["phrases"][3]["a"], L10["v0"]
put_music(a, b, drone(b - a, 38, 180) + pad(b - a, [[50, 53, 57], [46, 50, 53]], 3) * .7, .85)
add(amb, a, rain_noise(L12["v0"] - a, .14) * env_ad(int((L12["v0"] - a) * SR), .5, .5), 1)
add(fx, L8["phrases"][5]["a"] + .5, buzz(3), .9)
for i in range(3): add(fx, U2["phrases"][i]["a"], ping(), .7)
add(fx, U2["phrases"][2]["a"] - .02, boom(1.6), .6)

# Act 5: wallet + reveal
a, b = L10["v0"], L10["phrases"][3]["a"]
put_music(a, b, drone(b - a, 40, 260) + pluck_seq(b - a, [64, 67, 71, 74], .18, 6, .08), .9)
for k in range(14): add(fx, S1("walletOpen")["a"] + .8 + k * .1, tick(), .5)
a, b = L10["phrases"][3]["a"], L10["phrases"][4]["a"]
for k in range(int((b - a) / .55) + 1): add(fx, a + k * .55, heartbeat(), .9)
add(fx, b - 1.2, riser(1.2), .7)
add(fx, S1("reveal")["a"], boom(2.6), 1.0); add(fx, S1("reveal")["a"], hit(.8), .9)
add(fx, S1("reveal")["a"] + .9, whoosh(.5), .4)
add(fx, U1b["v0"] - .05, buzz(2), .8)
add(fx, U1b["phrases"][1]["a"] - .02, boom(1.6), .8)
put_music(S1("reveal")["a"], L12["v0"], drone(L12["v0"] - S1("reveal")["a"], 33, 120), 1.0)

# Act 6: CTA
a, b = L12["v0"], DUR
put_music(a, b, pad(b - a, [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], 2.0) * 1.2 + pulse(b - a, 92, .35), .85, .5, 1.2)
k1, k2 = L12["phrases"][1]["a"], L12["phrases"][2]["a"]
add(fx, k1, hit(.4), .6); add(fx, k2, hit(.4), .6)
sub = S1("subscribe")["a"]
add(fx, sub, whoosh(.6), .5); add(fx, sub + .4, sparkle(), .6)
add(fx, sub + 1.0, hit(.4), .4)
add(fx, sub + 2.0, click(), 1.0); add(fx, sub + 2.2, bell(), .8); add(fx, sub + 2.2, sparkle(1.4), .7)

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
