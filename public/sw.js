/* Lakbay Fitness Log - offline service worker.
 *
 * Strategy:
 *   navigations  -> network-first with a short timeout, falling back to the
 *                   cached app shell. Keeps deploys from serving a stale
 *                   index.html that points at deleted asset hashes.
 *   /assets/*    -> cache-first. Vite fingerprints these, so a hit is always
 *                   the right file and never needs revalidating.
 *   everything   -> stale-while-revalidate.
 */

const VERSION = 'v2';
const PRECACHE = `lakbay-fitness-precache-${VERSION}`;
const RUNTIME = `lakbay-fitness-runtime-${VERSION}`;
const CURRENT_CACHES = [PRECACHE, RUNTIME];

const APP_SHELL = '/fitness';
const PRECACHE_URLS = [APP_SHELL, '/manifest.json', '/favicon.svg'];

const NAVIGATION_TIMEOUT_MS = 3000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then(async (cache) => {
      // Deliberately not cache.addAll(): that rejects the whole install if a
      // single URL 404s, which would leave the app with no service worker at
      // all. Each entry is allowed to fail on its own.
      await Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

async function handleNavigation(request) {
  const cache = await caches.open(PRECACHE);
  try {
    // Testers are on patchy mobile data - never let a hanging request block
    // the shell when we already have a usable copy on disk.
    const response = await Promise.race([fetch(request), timeout(NAVIGATION_TIMEOUT_MS)]);
    if (response && response.ok) {
      cache.put(APP_SHELL, response.clone());
      return response;
    }
    throw new Error('bad response');
  } catch {
    const cached = await cache.match(APP_SHELL) || await caches.match(request);
    if (cached) return cached;
    return new Response(
      '<!doctype html><meta charset="utf-8"><title>Offline</title>' +
      '<body style="font-family:system-ui;padding:2rem;text-align:center">' +
      '<h1>Offline</h1><p>Open this app once while online to make it available offline.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok && response.type !== 'opaque') {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (sameOrigin && url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request, RUNTIME).catch(() => caches.match(request)));
    return;
  }

  // Google Fonts are immutable once published; keeping them lets the app look
  // the same offline instead of falling back to system fonts.
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;

  event.respondWith(staleWhileRevalidate(request).catch(() => caches.match(request)));
});
