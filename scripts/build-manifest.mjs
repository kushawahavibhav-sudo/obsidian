/**
 * OBSIDIAN — manifest generator.
 * Reads the authoritative rights metadata that Unsplash's image CDN exposes via
 * `?fm=json` for every photo in the source list, then writes:
 *   - src/lib/manifest.ts  (typed React-side manifest)
 *   - public/images/CREDITS.md (attribution + licence record)
 *
 * IMPORTANT: the responsive `srcSet` is built from the variants that physically
 * exist on disk (probed with sharp), never from the source photo's original
 * pixel width. Several assets were downloaded at less than 1440px wide, so
 * trusting the CDN metadata produced references to files that do not exist.
 *
 * Usage: node scripts/build-manifest.mjs
 */
import { writeFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'images');

/** Single source of truth — mirrors scripts/download-images.mjs. */
const SOURCES = [
  { id: 'hero-atrium', photo: '1600607687939-ce8a6c25118c', role: 'Hero — Casa Lumen atrium' },
  { id: 'hero-stair', photo: '1600607688969-a5bfcd646154', role: 'Hero — Meridian staircase' },
  { id: 'project-meridian', photo: '1600585154340-be6161a56a0c', role: 'Project — Meridian House' },
  { id: 'project-meridian-alt', photo: '1600607687920-4e2a09cf159d', role: 'Project — Meridian House' },
  { id: 'project-casa-lumen', photo: '1600210492486-724fe5c67fb0', role: 'Project — Casa Lumen' },
  { id: 'project-casa-lumen-alt', photo: '1600566753190-17f0baa2a6c3', role: 'Project — Casa Lumen' },
  { id: 'project-quarry-house', photo: '1600607687644-c7171b42498f', role: 'Project — Quarry House' },
  { id: 'project-quarry-house-alt', photo: '1600607688960-e095ff83135c', role: 'Project — Quarry House' },
  { id: 'project-atelier-no7', photo: '1600585154526-990dced4db0d', role: 'Project — Atelier No.7' },
  { id: 'project-atelier-no7-alt', photo: '1600566753051-f0b89df2dd90', role: 'Project — Atelier No.7' },
  { id: 'detail-concrete', photo: '1511818966892-d7d671e672a2', role: 'Detail — board-formed concrete' },
  { id: 'detail-staircase', photo: '1497366754035-f200968a6e72', role: 'Detail — cantilevered stair' },
  { id: 'detail-joinery', photo: '1493809842364-78817add7ffb', role: 'Detail — oak joinery' },
  { id: 'studio-model', photo: '1503387762-592deb58ef4e', role: 'Studio — physical model' },
  { id: 'studio-drawing', photo: '1503387762-592deb58ef4e', role: 'Studio — working drawing' },
  { id: 'hospitality-lobby', photo: '1542314831-068cd1dbfeeb', role: 'Hospitality — lobby' },
  { id: 'hospitality-dining', photo: '1414235077428-338989a2e8c0', role: 'Hospitality — dining room' },
  { id: 'office-interior', photo: '1497366216548-37526070297c', role: 'Studio — workroom' },
  { id: 'texture-light', photo: '1479839672679-a46483c0e7c8', role: 'Texture — daylight wash' },
  { id: 'texture-shadow', photo: '1518005020951-eccb494ad742', role: 'Texture — raking shadow' },
];

/** Widths emitted by scripts/optimize-images.mjs. */
const WIDTHS = [480, 900, 1440, 2000];

function rightsFrom(meta) {
  const iptc = meta?.IPTC?.Copyright?.trim();
  const xmp = meta?.XMP?.rights?.trim();
  const raw = iptc || xmp || '';
  const cleaned = raw.replace(/^lang="[^"]*"\s*/, '').trim();
  return cleaned || 'Unsplash contributor';
}

/**
 * Re-use the credit already resolved on a previous run so the manifest can be
 * rebuilt without network access (and without losing attribution).
 */
async function cachedCredits() {
  try {
    const source = await readFile(path.join(ROOT, 'src', 'lib', 'manifest.ts'), 'utf8');
    const map = new Map();
    const re = /id:\s*'([a-z0-9-]+)'[\s\S]*?credit:\s*("(?:[^"\\]|\\.)*")/g;
    let m;
    while ((m = re.exec(source))) map.set(m[1], JSON.parse(m[2]));
    return map;
  } catch {
    return new Map();
  }
}

async function fetchMeta(photo) {
  const url = `https://images.unsplash.com/photo-${photo}?fm=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`metadata HTTP ${res.status} for ${photo}`);
  return res.json();
}

/** Probe the disk: which responsive variants actually exist for this id? */
async function variantsOnDisk(id) {
  const files = await readdir(IMG_DIR);
  return WIDTHS.filter((w) => files.includes(`${id}-${w}.webp`));
}

async function canonicalOnDisk(id) {
  const files = await readdir(IMG_DIR);
  if (files.includes(`${id}.webp`)) return `/images/${id}.webp`;
  return null;
}

async function dimensionsOf(relPath) {
  const file = path.join(IMG_DIR, path.basename(relPath));
  const meta = await sharp(file).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

async function main() {
  console.log('Resolving rights metadata from Unsplash CDN…\n');

  const cached = await cachedCredits();
  const resolved = [];

  for (const src of SOURCES) {
    let credit = cached.get(src.id);
    if (!credit) {
      try {
        const meta = await fetchMeta(src.photo);
        credit = rightsFrom(meta);
      } catch (err) {
        console.warn(`  ! ${src.id}: ${err.message} — using fallback credit`);
        credit = 'Unsplash contributor';
      }
    }

    const variants = await variantsOnDisk(src.id);
    if (variants.length === 0) {
      throw new Error(`No responsive variants found on disk for "${src.id}"`);
    }
    const canonical = await canonicalOnDisk(src.id);
    const { width, height } = await dimensionsOf(canonical ?? `/images/${src.id}-${variants.at(-1)}.webp`);

    resolved.push({ ...src, credit, width, height, variants, canonical });
    console.log(
      `  ✓ ${src.id.padEnd(28)} ${String(credit).padEnd(24)} ${variants.join('/')}w  ${width}×${height}`
    );
  }

  /* ---------------- manifest.ts ---------------- */
  const ts = `/**
 * Image manifest — GENERATED by scripts/build-manifest.mjs. Do not edit by hand.
 * Every path here points at a file that physically exists in /public/images.
 */
export interface ImageAsset {
  /** Canonical filename without extension, e.g. "hero-atrium" */
  id: string;
  /** Largest published WebP for this asset */
  src: string;
  /** Responsive srcset: "<url> 480w, <url> 900w, ..." */
  srcSet: string;
  /** Intrinsic width of the canonical asset */
  width: number;
  /** Intrinsic height of the canonical asset */
  height: number;
  /** Rights holder recorded by the Unsplash CDN */
  credit: string;
  /** Unsplash photo id, used to build the attribution link */
  photoId: string;
}

export const images: Record<string, ImageAsset> = {
${resolved
  .map(
    (r) => `  '${r.id}': {
    id: '${r.id}',
    src: '${r.canonical ?? `/images/${r.id}-${r.variants.at(-1)}.webp`}',
    width: ${r.width},
    height: ${r.height},
    credit: ${JSON.stringify(r.credit)},
    photoId: 'photo-${r.photo}',
    srcSet: ${JSON.stringify(r.variants.map((w) => `/images/${r.id}-${w}.webp ${w}w`).join(', '))},
  },`
  )
  .join('\n')}
};

export function img(id: string): ImageAsset {
  const found = images[id];
  if (!found) throw new Error(\`Unknown image id: \${id}\`);
  return found;
}

/** Every asset, in manifest order — used by the credits panel. */
export const allImages: ImageAsset[] = Object.values(images);
`;

await writeFile(path.join(ROOT, 'src', 'lib', 'manifest.ts'), ts, 'utf8');
console.log('\nWrote src/lib/manifest.ts');

/* ---------------- CREDITS.md ---------------- */
const md = `# Image Credits

All architectural photography on this site was sourced from **Unsplash** and downloaded
as WebP assets into \`/public/images/\` — no hotlinked or remote image URLs are used at runtime.
Each file is served responsively via \`srcset\`.

## Licence

All images are provided under the **Unsplash Licence**, which grants an irrevocable,
non-exclusive, worldwide copyright licence to download, copy, modify, distribute,
perform and use the photos for free, including commercially, without permission
or attribution. Attribution is nevertheless provided below as a matter of practice
and courtesy.

> Unsplash grants you an irrevocable, nonexclusive, worldwide copyright license to download,
> copy, modify, distribute, perform and use photos from Unsplash for free, including for
> commercial purposes, without permission and without attributing the photographer or Unsplash.
> This license does not include the right to compile photos from Unsplash to replicate a similar or
> competing service.

Full licence text: https://unsplash.com/license

## Photographs

Rights holders below were read from the copyright metadata served by the Unsplash
image CDN for each downloaded asset (\`?fm=json\`).

| Asset | Rights holder | Unsplash photo | Role on site |
| --- | --- | --- | --- |
${resolved
  .map(
    (r) =>
      `| \`${r.id}\` | ${r.credit} | [photo-${r.photo}](https://unsplash.com/photos/photo-${r.photo}) | ${r.role} |`
  )
  .join('\n')}

## Note on the studio identity

OBSIDIAN is a fictional design studio created for this site. The projects, people,
locations and studio history presented on the site are invented for the purposes
of this design demonstration. The photography is real and credited above.
`;

await writeFile(path.join(IMG_DIR, 'CREDITS.md'), md, 'utf8');
console.log('Wrote public/images/CREDITS.md');
}

main().catch((err) => {
  console.error('FAILED:', err.message);
  process.exitCode = 1;
});
