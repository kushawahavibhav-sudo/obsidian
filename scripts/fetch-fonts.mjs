/**
 * OBSIDIAN — font pipeline.
 * Pulls Cormorant Garamond + DM Sans woff2 files from Google Fonts, keeps only the
 * latin / latin-ext subsets, and writes a self-hosted @font-face stylesheet to
 * /public/fonts/fonts.css so the site never depends on a runtime CDN.
 *
 * Usage: node scripts/fetch-fonts.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'fonts');

const CSS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&' +
  'family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Only these subsets ship — keeps the payload small. */
const KEEP = new Set(['latin', 'latin-ext']);

async function main() {
  await mkdir(OUT, { recursive: true });

  const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`CSS fetch failed: HTTP ${res.status}`);
  const css = await res.text();

  // Google Fonts emits `/* subset */` before each @font-face block.
  const blocks = css.split('/*').slice(1);
  const faces = [];

  for (const raw of blocks) {
    const subset = raw.slice(0, raw.indexOf('*/')).trim();
    if (!KEEP.has(subset)) continue;

    const body = raw.slice(raw.indexOf('*/') + 2);
    const urlMatch = body.match(/src:\s*url\((https:[^)]+)\)/);
    if (!urlMatch) continue;

    const family = body.match(/font-family:\s*'([^']+)'/)?.[1];
    const style = body.match(/font-style:\s*([a-z]+)/)?.[1] ?? 'normal';
    const weight = body.match(/font-weight:\s*([0-9 ]+)/)?.[1].trim() ?? '400';
    const unicodeRange = body.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim();

    const fileName = `${family.toLowerCase().replace(/\s+/g, '-')}-${subset}-${style}-${weight.replace(/\s+/g, '_')}.woff2`;
    const buf = Buffer.from(await (await fetch(urlMatch[1], { headers: { 'User-Agent': UA } })).arrayBuffer());
    await writeFile(path.join(OUT, fileName), buf);

    faces.push({ family, style, weight, fileName, unicodeRange, bytes: buf.length });
    console.log(
      `  ✓ ${fileName.padEnd(48)} ${String(Math.round(buf.length / 1024)).padStart(4)} KB  [${subset}]`,
    );
  }

  const cssOut = [
    '/* OBSIDIAN — self-hosted typefaces.',
    ' * Cormorant Garamond & DM Sans, latin + latin-ext subsets.',
    ' * Source: Google Fonts (Open Font License 1.1).',
    ' * Self-hosted so the site renders identically with no runtime CDN dependency.',
    ' */',
    '',
    ...faces.map((f) => {
      const range = f.unicodeRange ? `\n  unicode-range: ${f.unicodeRange};` : '';
      return `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('/fonts/${f.fileName}') format('woff2');${range}
}`;
    }),
    '',
  ].join('\n');

  await writeFile(path.join(OUT, 'fonts.css'), cssOut, 'utf8');
  const total = faces.reduce((s, f) => s + f.bytes, 0);
  console.log(`\n${faces.length} font files · ${Math.round(total / 1024)} KB total`);
  console.log('Wrote public/fonts/fonts.css');
}

main().catch((err) => {
  console.error('FAILED:', err.message);
  process.exitCode = 1;
});
