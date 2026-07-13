#!/usr/bin/env node
/**
 * Pings every remote image the app ships and fails if any is dead.
 *
 * Two Unsplash ids 404ed silently for months: a raw <img> renders a broken
 * image and says nothing, and a unit test cannot see the network. This is the
 * only check that can catch the *next* one — so it runs on a schedule in CI,
 * not on every push (it depends on a third party being up, which is not a
 * reason to block a merge).
 */

import { communities, exploreImages, posts, stories, users } from '../src/lib/mock-data.ts';

const CONCURRENCY = 6;
const TIMEOUT_MS = 15_000;

/** Every distinct remote image URL the app can render. */
function collectUrls() {
  const urls = new Set();
  for (const p of posts) {
    if (!p.media) continue;
    for (const src of Array.isArray(p.media.src) ? p.media.src : [p.media.src]) urls.add(src);
  }
  for (const c of communities) if (c.cover) urls.add(c.cover);
  for (const s of stories) if (s.thumbnail) urls.add(s.thumbnail);
  for (const u of users) if (u.avatar) urls.add(u.avatar);
  for (const src of exploreImages) urls.add(src);
  return [...urls];
}

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // HEAD is enough and avoids pulling the bytes.
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    return { url, ok: res.ok, status: res.status };
  } catch (err) {
    return { url, ok: false, status: err.name === 'AbortError' ? 'timeout' : 'network error' };
  } finally {
    clearTimeout(timer);
  }
}

/** Simple worker pool — a burst of 40 parallel requests invites rate limiting. */
async function run(urls) {
  const results = [];
  const queue = [...urls];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    let url;
    while ((url = queue.shift())) results.push(await check(url));
  });
  await Promise.all(workers);
  return results;
}

const urls = collectUrls();
console.log(`Checking ${urls.length} remote images…`);

const results = await run(urls);
const dead = results.filter((r) => !r.ok);

for (const { url, status } of dead) console.error(`DEAD (${status}) ${url}`);

if (dead.length) {
  console.error(`\n${dead.length} of ${urls.length} images are unreachable.`);
  process.exit(1);
}

console.log(`All ${urls.length} images OK.`);
