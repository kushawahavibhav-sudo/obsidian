import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

try {
  execFileSync(process.execPath, ['--check', 'scripts/build-manifest.mjs'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  console.log('PARSE OK');
} catch (e) {
  const out = (e.stderr || '') + (e.stdout || '');
  console.log('--- stderr ---');
  console.log(out);
  const m = /build-manifest\.mjs:(\d+)/.exec(out);
  if (m) {
    const ln = Number(m[1]);
    const L = fs.readFileSync('scripts/build-manifest.mjs', 'utf8').split(/\r?\n/);
    console.log('--- context around line ' + ln + ' ---');
    for (let i = ln - 6; i <= ln + 3; i++) {
      if (i < 1 || i > L.length) continue;
      console.log(String(i).padStart(4) + ': ' + JSON.stringify(L[i - 1]));
    }
  }
}
