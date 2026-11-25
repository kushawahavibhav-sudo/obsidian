/**
 * Extracts the proof-of-work hashing contract from Anubis' sha256 worker.
 */
import { writeFile } from 'node:fs/promises';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const res = await fetch('https://unsplash.com/photos/ce8a6c25118c', {
  headers: { 'User-Agent': UA },
});
const html = await res.text();

const readJson = (id) => {
  const raw = html.match(
    new RegExp(`<script id="${id}" type="application/json">([\\s\\S]*?)</script>`)
  )?.[1];
  if (raw === undefined) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const version = readJson('anubis_version');
const basePrefix = readJson('anubis_base_prefix') ?? '';

console.log('version     =', JSON.stringify(version));
console.log('base_prefix =', JSON.stringify(basePrefix));

const workerUrl = `https://unsplash.com${basePrefix}/.within.website/x/cmd/anubis/static/js/worker/sha256.mjs?cacheBuster=${version}`;
const w = await fetch(workerUrl, { headers: { 'User-Agent': UA } });
const body = await w.text();
await writeFile('.tmp-worker.js', body);
console.log(`worker: ${w.status}, ${body.length} bytes`);

// Pull out the interesting identifiers and the surrounding logic.
for (const key of ['randomData', 'nonce', 'difficulty', 'startsWith', 'sha256', 'toString', 'subtle', 'digest']) {
  const idxs = [];
  let i = body.indexOf(key);
  while (i !== -1 && idxs.length < 4) {
    idxs.push(i);
    i = body.indexOf(key, i + 1);
  }
  for (const idx of idxs) {
    console.log(`\n--- ${key} @${idx} ---`);
    console.log(body.slice(Math.max(0, idx - 260), idx + 260));
  }
}
