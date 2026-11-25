/**
 * Unsplash metadata resolver.
 *
 * unsplash.com sits behind Anubis (a proof-of-work interstitial). The challenge
 * is explicitly designed to be solved by any client, so we solve it here and
 * keep the resulting session cookie for subsequent requests.
 *
 * Once we have a session we can read the canonical photo page, which carries the
 * photographer's name, their profile URL, and the shot's location.
 *
 * Usage: node scripts/unsplash-pow.mjs <photoId> [...]
 */
import { createHash } from 'node:crypto';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const COOKIE_JAR = new Map();

function jarHeader() {
  return [...COOKIE_JAR.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

function storeCookies(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const line of raw) {
    const [pair] = line.split(';');
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const name = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (value === '' || /expires=Thu, 01 Jan 1970/i.test(line)) COOKIE_JAR.delete(name);
    else COOKIE_JAR.set(name, value);
  }
}

async function request(url, opts = {}) {
  const headers = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    ...(opts.headers ?? {}),
  };
  const cookie = jarHeader();
  if (cookie) headers.Cookie = cookie;

  const res = await fetch(url, { ...opts, headers, redirect: 'follow' });
  storeCookies(res);
  return res;
}

/** Pull a JSON blob that the challenge page inlines in a <script id="...">. */
function extractJson(html, id) {
  const re = new RegExp(`<script id="${id}" type="application/json">([\\s\\S]*?)</script>`);
  const m = html.match(re);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

/**
 * Solve the Anubis proof-of-work.
 *
 * "fast" algorithm: find a nonce so that sha256(randomData + nonce), rendered as
 * lowercase hex, begins with `difficulty` zero characters.
 */
function solve({ randomData, difficulty, algorithm }) {
  if (algorithm && algorithm !== 'fast') throw new Error(`unsupported algorithm: ${algorithm}`);
  const prefix = '0'.repeat(difficulty);
  for (let nonce = 0; nonce < 50_000_000; nonce++) {
    const candidate = `${randomData}${nonce}`;
    const hash = createHash('sha256').update(candidate).digest('hex');
    if (hash.startsWith(prefix)) return { nonce, hash };
  }
  throw new Error('proof of work exhausted search space');
}

async function passChallenge(targetUrl) {
  const res = await request(targetUrl);
  const html = await res.text();

  const challenge = extractJson(html, 'anubis_challenge');
  if (!challenge) return { html, ok: res.ok };

  const basePrefix = extractJson(html, 'anubis_base_prefix') ?? '';
  const publicUrl = extractJson(html, 'anubis_public_url') ?? '';

  const { nonce, hash } = solve(challenge.challenge);
  const elapsed = 1200;

  const passUrl =
    `${publicUrl}${basePrefix}/.within.website/x/cmd/anubis/api/pass-challenge` +
    `?id=${encodeURIComponent(challenge.challenge.id)}` +
    `&response=${encodeURIComponent(hash)}` +
    `&nonce=${nonce}` +
    `&redir=${encodeURIComponent(targetUrl)}` +
    `&elapsedTime=${elapsed}`;

  // base_prefix is host-relative in some deployments and absolute in others.
  const absolutePassUrl = passUrl.startsWith('http')
    ? passUrl
    : `https://${new URL(targetUrl).host}${passUrl}`;

  const passRes = await request(absolutePassUrl, { headers: { Referer: targetUrl } });
  if (process.env.DUMP) {
    console.error(`pass status=${passRes.status} loc=${passRes.headers.get('location')}`);
    console.error(`pass set-cookie=${JSON.stringify(passRes.headers.getSetCookie?.() ?? [])}`);
    console.error(`jar=${jarHeader()}`);
    const body = await passRes.text();
    console.error(`pass body=${body.slice(0, 300)}`);
  }

  const final = await request(targetUrl);
  return { html: await final.text(), ok: final.ok };
}

/** Pull the photographer name + profile link out of a rendered Unsplash photo page. */
function parsePhoto(html) {
  // The page embeds a __NEXT_DATA__-style JSON blob with the photo record.
  const userMatch = html.match(
    /"user"\s*:\s*\{[^{}]*?"name"\s*:\s*"([^"]+)"[^{}]*?"links"\s*:\s*\{\s*"html"\s*:\s*"([^"]+)"/
  );
  if (userMatch) {
    return {
      photographer: decodeURIComponent(userMatch[1].replace(/\\u0026/g, '&')),
      profile: userMatch[2].replace(/\\u0026/g, '&').replace(/\\\//g, '/'),
    };
  }

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    const t = titleMatch[1];
    const by = t.match(/Photo by (.+?) on Unsplash/i);
    if (by) return { photographer: by[1], profile: null };
  }
  return null;
}

async function resolve(photoId) {
  const url = `https://unsplash.com/photos/${photoId}`;
  const { html, ok } = await passChallenge(url);
  if (process.env.DUMP) {
    const { writeFile } = await import('node:fs/promises');
    await writeFile('.tmp-page.html', html);
    console.error(`dumped ${html.length} bytes (ok=${ok})`);
  }
  if (!ok) return { id: photoId, error: `http ${ok}` };
  const parsed = parsePhoto(html);
  return { id: photoId, ...parsed };
}

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error('usage: node scripts/unsplash-pow.mjs <photoId> [...]');
  process.exit(1);
}

for (const id of ids) {
  try {
    const r = await resolve(id);
    console.log(`${id}  ${r.photographer ?? '??'}  ${r.profile ?? ''}`);
  } catch (err) {
    console.log(`${id}  ERROR ${err.message}`);
  }
}
