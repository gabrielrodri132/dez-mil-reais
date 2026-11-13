// usage: node snap.js t1 t2 ... -> snaps/t_<t>.jpg, plus contact sheet
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox','--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('PAGEERR', e.message));
  await pg.goto('file://' + path.resolve('stage.html')); await pg.waitForFunction(() => window.ready);
  require('fs').mkdirSync('snaps', { recursive: true });
  for (const t of process.argv.slice(2)) {
    await pg.evaluate((t) => renderAt(+t), t);
    await pg.screenshot({ path: `snaps/t_${t}.jpg`, type: 'jpeg', quality: 85 });
  }
  await b.close();
})();
