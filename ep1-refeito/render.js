// node render.js <worker> <nworkers>  — renders shot chunks to parts/NNN.mp4
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const { spawn } = require('child_process');
const FPS = 30;
(async () => {
  const W = +(process.argv[2] || 0), NW = +(process.argv[3] || 1);
  const shots = JSON.parse(fs.readFileSync('shots.json', 'utf8'));
  const TL = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
  const total = Math.round(TL.dur * FPS);
  // chunk boundaries at shot cuts, in frames
  const cuts = [...new Set(shots.map(s => Math.round(s.a * FPS)).concat([total]))].filter(f => f >= 0 && f <= total).sort((a, b) => a - b);
  const chunks = []; for (let i = 0; i < cuts.length - 1; i++) if (cuts[i + 1] > cuts[i]) chunks.push([cuts[i], cuts[i + 1]]);
  fs.mkdirSync('parts', { recursive: true });
  fs.writeFileSync('parts/list.txt', chunks.map((c, i) => `file '${String(i).padStart(3, '0')}.mp4'`).join('\n') + '\n');
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('PAGEERR', e.message));
  await pg.goto('file://' + path.resolve('stage.html')); await pg.waitForFunction(() => window.ready);
  const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
  for (let ci = 0; ci < chunks.length; ci++) {
    if (ci % NW !== W) continue;
    if (only && !only.includes(ci)) continue;
    const out = `parts/${String(ci).padStart(3, '0')}.mp4`;
    if (!only && fs.existsSync(out)) continue;
    const [f0, f1] = chunks[ci];
    const tmp = out.replace('.mp4', '.tmp.mp4');
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), tmp]);
    for (let fr = f0; fr < f1; fr++) {
      await pg.evaluate((t) => renderAt(t), fr / FPS);
      const buf = await pg.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    const code = await new Promise(r => ff.on('close', r));
    if (code === 0) fs.renameSync(tmp, out); else console.log('ffmpeg failed', ci);
    console.log(`chunk ${ci} done (${f1 - f0} frames)`);
  }
  await b.close();
})();
