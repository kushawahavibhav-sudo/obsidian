/**
 * Verifies every image path referenced by src/lib/manifest.ts exists on disk.
 * Parses the actual `src` and `srcSet` strings rather than assuming a fixed
 * set of widths, so it reflects exactly what the browser will request.
 */
import { readFile, access, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = await readFile(path.join(root, 'src', 'lib', 'manifest.ts'), 'utf8');

const referenced = new Set();

/** src: '/images/foo.webp' */
for (const m of source.matchAll(/src:\s*'(\/images\/[^']+)'/g)) referenced.add(m[1]);

/** srcSet: "/images/a-480.webp 480w, /images/b-900.webp 900w" */
for (const m of source.matchAll(/srcSet:\s*"([^"]+)"/g)) {
  for (const part of m[1].split(',')) {
    const url = part.trim().split(/\s+/)[0];
    if (url?.startsWith('/images/')) referenced.add(url);
  }
}

let missing = 0;
for (const url of [...referenced].sort()) {
  const file = path.join(root, 'public', url.replace(/\//g, path.sep));
  try {
    await access(file, constants.R_OK);
  } catch {
    missing++;
    console.log(`  MISSING  ${url}`);
  }
}

/* Report any orphan WebP files that nothing references — dead weight. */
const disk = await readdir(path.join(root, 'public', 'images'));
const orphans = disk.filter(
  (f) => f.endsWith('.webp') && !referenced.has(`/images/${f}`)
);

console.log(`\nReferenced paths : ${referenced.size}`);
console.log(`Missing          : ${missing}`);
console.log(`Orphan webp      : ${orphans.length}${orphans.length ? ` (${orphans.join(', ')})` : ''}`);

if (missing > 0) {
  console.error('\n✗ Broken image references detected.');
  process.exit(1);
}
console.log('\n✓ All referenced images exist on disk.');
if (orphans.length > 0) {
  console.log('  (orphans are harmless but could be pruned)');
}
