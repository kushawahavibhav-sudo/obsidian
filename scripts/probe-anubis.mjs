/**
 * Downloads Anubis' challenge bundle and prints the hashing contract so the
 * proof-of-work solver can match it exactly.
 */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const res = await fetch('https://unsplash.com/photos/ce8a6c25118c', {
  headers: { 'User-Agent': UA },
});
const html = await res.text();

const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
console.log('scripts:', srcs);

for (const src of srcs) {
  const url = src.startsWith('http') ? src : `https://unsplash.com${src}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  const body = await r.text();
  console.log(`\n=== ${url} -> ${r.status}, ${body.length} bytes ===`);
  if (body.includes('randomData') || body.includes('sha256')) {
    console.log(body);
  }
}
