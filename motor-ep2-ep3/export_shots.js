const vm = require('vm'), fs = require('fs');
const ctx = {}; vm.createContext(ctx);
for (const f of ['chars.js', 'tl.js', 'scenes.js']) vm.runInContext(fs.readFileSync(f, 'utf8').replace(/^const (TL|SH|CAST) =/m, 'var $1 ='), ctx, { filename: f });
vm.runInContext('buildShots(); this.__out = SHOTS.map(s => ({ name: s.name, a: +s.a.toFixed(3), b: +s.b.toFixed(3) }));', ctx);
fs.writeFileSync('shots.json', JSON.stringify(ctx.__out, null, 0));
console.log(ctx.__out.map(s => `${s.name}:${s.a}-${s.b}`).join('\n'));
