// Prints the exact shape of the studio content model (keys + types only).
import { readFileSync } from 'node:fs';

const src = readFileSync('src/lib/site.ts', 'utf8');

// --- pull each `export const NAME = ...` block ---
const names = [...src.matchAll(/^export const (\w+)[:=]/gm)].map((m) => m[1]);

for (const name of names) {
  const start = src.indexOf(`export const ${name}`);
  // find next top-level export or end
  const rest = src.slice(start + 1);
  const nextIdx = rest.search(/\nexport (const|interface|type) /);
  const block = nextIdx === -1 ? rest : rest.slice(0, nextIdx);

  console.log(`\n### ${name}`);
  // object literal keys
  const objKeys = [...block.matchAll(/^\s{2}(\w+):/gm)].map((m) => m[1]);
  if (objKeys.length) console.log('  obj keys:', objKeys.join(', '));
  // array element keys
  const arrKeys = [...block.matchAll(/\{[^{}]*?\n\s{4}(\w+):/g)].map((m) => m[1]);
  const uniq = [...new Set(arrKeys)];
  if (uniq.length) console.log('  arr keys:', uniq.join(', '));
  // simple array of strings
  const strArr = block.match(/\[\s*'[^']+'(,\s*'[^']+')*\s*\]/);
  if (strArr && !objKeys.length && !uniq.length)
    console.log('  string array:', strArr[0].slice(0, 200).replace(/\s+/g, ' '));
  // interfaces referenced
  const types = [...block.matchAll(/:\s*(\w+)\[\]/g)].map((m) => m[1]);
  if (types.length) console.log('  types:', [...new Set(types)].join(', '));
}

// --- exported interfaces ---
console.log('\n### interfaces');
for (const m of src.matchAll(/export interface (\w+) \{([\s\S]*?)\n\}/g)) {
  const fields = m[2]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && !l.startsWith('*'))
    .map((l) => l.replace(/\s*\/\/.*$/, '').trim())
    .filter(Boolean);
  console.log(`  ${m[1]}: ${fields.join(' | ')}`);
}

// --- exported types ---
console.log('\n### types');
for (const m of src.matchAll(/export type (\w+) =([^;]+);/g)) {
  console.log(`  ${m[1]} =${m[2].replace(/\s+/g, ' ').slice(0, 400)}`);
}
