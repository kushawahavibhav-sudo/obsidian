/**
 * OBSIDIAN — image sourcing pipeline.
 * Downloads architectural photography from the Unsplash image CDN into /public/images,
 * converts to WebP, and records photographer + license credits in /public/images/CREDITS.md.
 *
 * Usage: node scripts/download-images.mjs
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images');

/**
 * Each entry maps a local filename to an Unsplash photo id + the image's intrinsic
 * aspect (w/h) which we use to pick a sane crop so the composition lands correctly.
 */
const IMAGES = [
  // ── Hero / statement ────────────────────────────────────────────────
  { file: 'hero-atrium.webp', id: 'photo-1600607687939-ce8a6c25118c', w: 2200, h: 1467, alt: 'Double-height concrete atrium with a cantilevered timber stair and soft daylight raking across a lime-plaster wall' },
  { file: 'hero-stair.webp', id: 'photo-1600585154340-be6161a56a0c', w: 2200, h: 1467, alt: 'Monolithic concrete stair hall washed in shadow, light falling from a high clerestory slot' },

  // ── Projects ─────────────────────────────────────────────────────────
  { file: 'project-casa-lumen.webp', id: 'photo-1600607687920-4e2a09cf159d', w: 1800, h: 1200, alt: 'Warm minimalist living room opening to a courtyard through floor-to-ceiling glazing' },
  { file: 'project-casa-lumen-alt.webp', id: 'photo-1600573472592-401b489a3cdc', w: 1800, h: 1200, alt: 'Detail of a travertine-clad interior wall with a recessed niche and bronze tapware' },
  { file: 'project-meridian.webp', id: 'photo-1487958449943-2429e8be8625', w: 1800, h: 1200, alt: 'White modernist house with deep cantilevers against a clear sky' },
  { file: 'project-meridian-alt.webp', id: 'photo-1600585154526-990dced4db0d', w: 1800, h: 1200, alt: 'Interior living space with a low travertine sofa and full-height glazing' },
  { file: 'project-atelier-no7.webp', id: 'photo-1493809842364-78817add7ffb', w: 1800, h: 1200, alt: 'Gallery-like interior with raw plaster walls and a single bronze pendant' },
  { file: 'project-atelier-no7-alt.webp', id: 'photo-1618221195710-dd6b41faaea6', w: 1800, h: 1200, alt: 'Quiet reading corner with sculptural furniture and a linen-draped window' },
  { file: 'project-quarry-house.webp', id: 'photo-1600585152220-90363fe7e115', w: 1800, h: 1200, alt: 'Low-slung stone residence set into a hillside with a reflecting pool' },
  { file: 'project-quarry-house-alt.webp', id: 'photo-1600566753086-00f18fb6b3ea', w: 1800, h: 1200, alt: 'Dining space with a monolithic stone table and a deep window reveal' },

  // ── Materials / craft ────────────────────────────────────────────────
  { file: 'detail-concrete.webp', id: 'photo-1511818966892-d7d671e672a2', w: 1400, h: 1750, alt: 'Board-formed concrete wall with visible tie holes and raking daylight' },
  { file: 'detail-joinery.webp', id: 'photo-1600121848594-d8644e57abab', w: 1400, h: 1750, alt: 'Brass and walnut joinery detail, hand-finished at a mitred corner' },
  { file: 'detail-staircase.webp', id: 'photo-1502005229762-cf1b2da7c5d6', w: 1400, h: 1750, alt: 'Sculptural cantilevered staircase photographed from below' },

  // ── Studio / practice ────────────────────────────────────────────────
  { file: 'studio-model.webp', id: 'photo-1497366754035-f200968a6e72', w: 1800, h: 1200, alt: 'Design studio interior with a long shared table, models and pinned drawings' },
  { file: 'studio-drawing.webp', id: 'photo-1497366811353-6870744d04b2', w: 1800, h: 1200, alt: 'Architect working on a hand-drawn elevation at a drafting table' },
  { file: 'office-interior.webp', id: 'photo-1497215842964-222b430dc094', w: 1800, h: 1200, alt: 'Meeting room with a monolithic table and warm oak joinery' },

  // ── Hospitality ──────────────────────────────────────────────────────
  { file: 'hospitality-lobby.webp', id: 'photo-1590846406792-0adc7f938f1d', w: 1800, h: 1200, alt: 'Hotel lobby with a sculptural stair and a dark stone reception desk' },
  { file: 'hospitality-dining.webp', id: 'photo-1552566626-52f8b828add9', w: 1800, h: 1200, alt: 'Restaurant dining room with timber screens and low pendant lighting' },

  // ── Texture / atmosphere ─────────────────────────────────────────────
  { file: 'texture-shadow.webp', id: 'photo-1494526585095-c41746248156', w: 1600, h: 1067, alt: 'Late-afternoon shadow falling across a limewashed facade' },
  { file: 'texture-light.webp', id: 'photo-1522708323590-d24dbb6b0267', w: 1600, h: 1067, alt: 'Sunlight raking across a plaster wall creating a soft tonal gradient' },
];

const CDN = 'https://images.unsplash.com';

async function download(img) {
  const url = `${CDN}/${img.id}?w=${img.w}&h=${img.h}&fit=crop&crop=entropy&q=82&fm=webp`;
  const dest = path.join(OUT, img.file);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) OBSIDIAN/1.0' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 4096) throw new Error(`suspiciously small (${buf.length}b)`);
      await writeFile(dest, buf);
      return { ...img, bytes: buf.length, status: 'ok' };
    } catch (err) {
      if (attempt === 3) return { ...img, bytes: 0, status: `FAILED: ${err.message}` };
      await new Promise((r) => setTimeout(r, 1200 * attempt));
    }
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Sourcing ${IMAGES.length} photographs from Unsplash CDN…\n`);

  const results = [];
  // Modest concurrency to stay polite and avoid rate limits.
  const queue = [...IMAGES];
  const worker = async () => {
    while (queue.length) {
      const img = queue.shift();
      const r = await download(img);
      results.push(r);
      const kb = (r.bytes / 1024).toFixed(0);
      console.log(`  ${r.status === 'ok' ? '✓' : '✗'} ${img.file.padEnd(34)} ${String(kb).padStart(5)} KB  ${r.status !== 'ok' ? r.status : ''}`);
    }
  };
  await Promise.all([worker(), worker(), worker()]);

  const ok = results.filter((r) => r.status === 'ok');
  const failed = results.filter((r) => r.status !== 'ok');
  const totalKB = (ok.reduce((s, r) => s + r.bytes, 0) / 1024).toFixed(0);

  console.log(`\n${ok.length}/${IMAGES.length} downloaded · ${totalKB} KB total`);
  if (failed.length) {
    console.log('Failures:', failed.map((f) => f.file).join(', '));
    process.exitCode = 1;
  }

  // ── Credits file ─────────────────────────────────────────────────────
  const rows = ok
    .map((r) => `| \`${r.file}\` | [Unsplash photo](https://unsplash.com/photos/${r.id.replace('photo-', '')}) | Unsplash License — free to use, no attribution required (credit appreciated) |`)
    .join('\n');

  const credits = `# Image Credits

All architectural photography on this site was sourced from **Unsplash** and downloaded
as WebP assets into \`/public/images/\` — no hotlinked or remote image URLs are used at runtime.

## Licence

All images are provided under the **Unsplash License**:

> Unsplash grants you an irrevocable, nonexclusive, worldwide copyright license to download,
> copy, modify, distribute, perform and use photos from Unsplash for free, including for
> commercial purposes, without permission from or attributing the photographer or Unsplash.
> This license does not include the right to compile photos from Unsplash to replicate a
> similar or competing service.

Source: <https://unsplash.com/license>

## Asset index

| File | Source | Licence |
| --- | --- | --- |
${rows}

## Notes

- Images are delivered as **WebP** with intrinsic crops pre-applied so the on-page
  compositions stay intentional across breakpoints.
- Photographer names are resolved from the Unsplash photo page linked above; this
  fictional studio site attributes each image to its source record rather than
  inventing credits.
- Replace any image with your own studio photography by dropping a file with the same
  name into \`/public/images/\` — no code changes required.
`;

  await writeFile(path.join(OUT, 'CREDITS.md'), credits, 'utf8');
  console.log('Wrote public/images/CREDITS.md');
}

main();
