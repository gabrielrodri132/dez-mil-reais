"""Build the episode timeline from the voice clips: trims, aligns phrases/words to speech,
computes per-speaker mouth envelopes and writes timeline.json + voice.wav."""
import json, os, re, subprocess, sys
import numpy as np

SR = 48000
FPS = 30
ROOT = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(ROOT, "script.json")))
TEMPO = float(os.environ.get("TEMPO", "1.08"))


def load(path, fx=None):
    af = []
    if fx: af.append(fx)
    if TEMPO != 1.0: af.append(f"atempo={TEMPO}")
    cmd = ["ffmpeg", "-v", "error", "-i", path] + (["-af", ",".join(af)] if af else []) + ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def rms_frames(x, hop):
    n = len(x) // hop
    if n == 0: return np.zeros(1)
    return np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)


def trim(x):
    r = rms_frames(x, 480)  # 10 ms
    db = 20 * np.log10(r + 1e-9)
    thr = max(db.max() - 38, -55)
    idx = np.where(db > thr)[0]
    if len(idx) == 0: return x
    a = max(0, idx[0] * 480 - 2400); b = min(len(x), (idx[-1] + 1) * 480 + 4800)
    return x[a:b]


def islands(x):
    r = rms_frames(x, 480); db = 20 * np.log10(r + 1e-9)
    thr = db.max() - 30
    voiced = db > thr
    segs, i, n = [], 0, len(voiced)
    while i < n:
        if voiced[i]:
            j = i
            while j < n and voiced[j]: j += 1
            segs.append([i / 100, j / 100]); i = j
        else: i += 1
    # merge gaps shorter than 0.17 s
    out = []
    for s in segs:
        if out and s[0] - out[-1][1] < .17: out[-1][1] = s[1]
        else: out.append(s)
    return out


def syl(w):
    return max(1, len(re.findall(r"[aeiouáéíóúâêôãõày]+", w.lower())))


def align(phrases, isl, dur):
    """Assign phrase boundaries to inter-island gaps by DP on cumulative syllable proportion."""
    weights = np.array([sum(syl(w) for w in p.split()) for p in phrases], float)
    cum = np.cumsum(weights) / weights.sum()
    if len(isl) < len(phrases):  # fall back to proportional split of the voiced span
        a0, a1 = (isl[0][0], isl[-1][1]) if isl else (0, dur)
        edges = [a0] + [a0 + (a1 - a0) * c for c in cum]
        return [[edges[i], edges[i + 1]] for i in range(len(phrases))]
    vt = np.array([b - a for a, b in isl]); vc = np.cumsum(vt) / vt.sum()  # voiced cumulative at end of each island
    P, N = len(phrases), len(isl)
    INF = 1e9
    dp = np.full((P + 1, N + 1), INF); bk = np.zeros((P + 1, N + 1), int); dp[0][0] = 0
    for p in range(1, P + 1):
        for n in range(p, N + 1):
            for m in range(p - 1, n):
                c = dp[p - 1][m] + (vc[n - 1] - cum[p - 1]) ** 2
                if c < dp[p][n]: dp[p][n] = c; bk[p][n] = m
    res, n = [], N
    for p in range(P, 0, -1):
        m = bk[p][n]; res.append([isl[m][0], isl[n - 1][1]]); n = m
    return res[::-1]


OFF = json.load(open(os.path.join(ROOT, "vo_offsets.json")))
BIG = os.path.join(ROOT, "isa.wav")
_big = {}


def compress_gaps(x, max_gap=.42, keep=.32):
    """Shorten long internal pauses (from [pause] tags) so the episode keeps its pace."""
    r = rms_frames(x, 480); db = 20 * np.log10(r + 1e-9)
    sil = db < db.max() - 34
    out, i, n = [], 0, len(sil)
    last = 0
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]: j += 1
            if i > 0 and j < n and (j - i) / 100 > max_gap:
                a = i * 480; b = j * 480; k = int(keep * SR)
                out.append(x[last:a + k // 2]); last = b - k // 2
            i = j
        else: i += 1
    out.append(x[last:])
    y = np.concatenate(out)
    return y


def clip_audio(name, who):
    path = os.path.join(ROOT, "vo", f"{name}.mp3")
    fx = None
    if who == "U":  # whispered phone voice: band-limit + slight echo
        fx = "highpass=f=220,lowpass=f=5200,aecho=0.8:0.55:45|90:0.25|0.15,volume=1.35"
    if os.path.exists(path):
        x = load(path, fx)
    elif name in OFF["off"] and os.path.exists(os.path.join(ROOT, OFF["off"][name][2])):
        o = OFF["off"][name]; a = o[0]; d = o[1] / OFF["SR"]; src = os.path.join(ROOT, o[2])
        tmp = os.path.join(ROOT, "vo_cache"); os.makedirs(tmp, exist_ok=True)
        cp = os.path.join(tmp, f"{name}.wav")
        if not os.path.exists(cp):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.4f}", "-t", f"{d:.4f}", "-i", src, "-c:a", "pcm_s16le", cp], check=True)
        x = load(cp, fx)
    else:
        return None
    return compress_gaps(trim(x))


def placeholder(phr, name=None):
    """Synthetic stand-in so visuals can be developed before the real clips arrive."""
    parts = []
    tot = OFF["off"][name][1] / OFF["SR"] * .8 / TEMPO if name in OFF["off"] else None
    w = [sum(syl(x) for x in p.split()) for p in phr]
    for i, p in enumerate(phr):
        d = sum(syl(w) for w in p.split()) / 5.6 + .15
        if tot: d = max(.3, (tot - .35 * (len(phr) - 1)) * w[i] / sum(w))
        t = np.arange(int(d * SR)) / SR
        parts.append(.2 * np.sin(2 * np.pi * 180 * t) * (.6 + .4 * np.sin(2 * np.pi * 5 * t)))
        if i < len(phr) - 1: parts.append(np.zeros(int(.35 * SR)))
    return np.concatenate(parts).astype(np.float32)


def main():
    clips, meta = {}, {}
    for name, c in S["clips"].items():
        x = clip_audio(name, c["who"])
        real = x is not None
        if not real: x = placeholder(c["phrases"], name)
        dur = len(x) / SR
        isl = islands(x)
        ph = align(c["phrases"], isl, dur)
        if "upto" in c and real:
            k = c["upto"]; cut = ph[k][1] + .12
            x = x[: int(cut * SR)]; dur = len(x) / SR
            c["phrases"] = c["phrases"][: k + 1]; ph = ph[: k + 1]
        env = rms_frames(x, SR // FPS)
        env = env / (np.percentile(env, 95) + 1e-9)
        env = np.clip(env, 0, 1.3)
        env = np.convolve(env, [.25, .5, .25], mode="same")
        clips[name] = x
        meta[name] = {"dur": dur, "phr": ph, "env": env, "real": real}
        print(f"{name:4s} {dur:5.2f}s islands={len(isl):2d} real={real}")

    t = 0.0; segs = {}; order = []
    for s in S["segments"]:
        t += s.get("pre", 0)
        if "clip" in s:
            m = meta[s["clip"]]; a = t; b = t + m["dur"]
            phrases = []; words = []
            for k, (pa, pb) in enumerate(m["phr"]):
                text = S["clips"][s["clip"]]["phrases"][k]
                phrases.append({"a": round(a + pa, 3), "b": round(a + pb, 3), "text": text})
                ws = text.split(); wt = np.array([syl(w) + .6 for w in ws]); wc = np.concatenate([[0], np.cumsum(wt) / wt.sum()])
                for i, w in enumerate(ws):
                    words.append({"a": round(a + pa + (pb - pa) * wc[i], 3), "b": round(a + pa + (pb - pa) * wc[i + 1], 3), "w": w})
            segs[s["id"]] = {"a": round(a, 3), "b": round(b, 3), "v0": round(a - s.get("pre", 0), 3), "clip": s["clip"],
                             "who": S["clips"][s["clip"]]["who"], "phrases": phrases, "words": words}
            t = b
        else:
            segs[s["id"]] = {"a": round(t, 3), "b": round(t + s["dur"], 3), "v0": round(t - s.get("pre", 0), 3), "phrases": [], "words": []}
            t += s["dur"]
        t += s.get("post", 0)
        order.append(s["id"])
    total = t
    nF = int(np.ceil(total * FPS)) + 1
    envs = {k: np.zeros(nF) for k in "LURICGDP"}
    voice = np.zeros(int(total * SR) + SR, np.float32)
    for sid in order:
        sg = segs[sid]
        if "clip" not in sg: continue
        x = clips[sg["clip"]]; i0 = int(sg["a"] * SR)
        voice[i0:i0 + len(x)] += x
        e = meta[sg["clip"]]["env"]; f0 = int(round(sg["a"] * FPS))
        n = min(len(e), nF - f0); envs[sg["who"]][f0:f0 + n] = np.maximum(envs[sg["who"]][f0:f0 + n], e[:n])
    voice = voice[: int(total * SR)]
    pk = np.max(np.abs(voice)) + 1e-9
    voice = voice / pk * .89
    voice.astype(np.float32).tofile(os.path.join(ROOT, "voice.f32"))
    out = {"dur": round(total, 3), "fps": FPS, "order": order, "segs": segs,
           "env": {k: [round(float(v), 2) for v in envs[k]] for k in envs},
           "real": all(m["real"] for m in meta.values())}
    json.dump(out, open(os.path.join(ROOT, "timeline.json"), "w"), ensure_ascii=False)
    print(f"TOTAL {total:.2f}s  real={out['real']}")


if __name__ == "__main__":
    main()
