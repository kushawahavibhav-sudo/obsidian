/**
 * Saves Anubis' client bundle and prints how it submits the proof-of-work.
 */
import { writeFile } from 'node:fs/promises';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const res = await fetch('https://unsplash.com/photos/ce8a6c25118c', {
  headers: { 'User-Agent': UA },
});
const html = await res.text();

const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);

for (const src of srcs) {
  const url = src.startsWith('http') ? src : `https://unsplash.com${src}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  const body = await r.text();
  const name = src.split('/').pop().split('?')[0];
  await writeFile(`.tmp-${name}`, body);
  console.log(`${name}: ${r.status} ${body.length} bytes`);
}

const challenge = await import('node:fs/promises').then((fs) =>
  fs.readFile('.tmp-challenge.ef46db3751.js', 'utf8')
);

for (const key of ['pass-challenge', 'response', 'elapsedTime', 'nonce', 'redir', 'redirect']) {
  let i = challenge.indexOf(key);
  while (i !== -1) {
    console.log(`\n--- ${key} @${i} ---`);
    console.log(challenge.slice(Math.max(0, i - 400), i + 400));
    i = challenge.indexOf(key, i + key.length);
    if (i > 0 && key === 'nonce') break;
  }
}
