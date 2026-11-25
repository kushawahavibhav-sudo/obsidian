/** Probe whether Unsplash's CDN preserves attribution metadata in the original JPEG. */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const path = process.argv[2];
const buf = await readFile(path);
const m = await sharp(buf).metadata();

console.log('format', m.format, m.width + 'x' + m.height);
console.log('has exif:', !!m.exif, m.exif ? Object.keys(m.exif).length + ' fields' : '');
console.log('has iptc:', !!m.iptc);
console.log('has xmp:', !!m.xmp);
console.log('has icc:', !!m.icc);

if (m.exif) {
  const raw = m.exif;
  const dump = (o, depth = 0) => {
    for (const [k, v] of Object.entries(o)) {
      if (v && typeof v === 'object' && depth < 3) {
        console.log(' '.repeat(depth * 2) + k + ':');
        dump(v, depth + 1);
      } else {
        let s = String(v);
        if (s.length > 120) s = s.slice(0, 120) + '…';
        console.log(' '.repeat(depth * 2) + k + ' = ' + s);
      }
    }
  };
  dump(raw);
}
