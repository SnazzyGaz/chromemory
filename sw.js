const CACHE = 'chromemory-permanent-v12';   // ← Increase this number every time you make changes
const BASE_PATH = '/chromemory';

const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/sw.js`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  `${BASE_PATH}/screenshot-wide.png`,
  `${BASE_PATH}/screenshot-narrow.png`,
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap'
];

self.addEventListener('install', e => {
  console.log(`📦 Installing Chromemory cache ${CACHE}`);
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log(`✅ Service worker ${CACHE} activated`);
  e.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys.filter(k => k !== CACHE).map(k => {
            console.log(`🗑️ Deleting old cache: ${k}`);
            return caches.delete(k);
          })
        )
      )
      .then(() => self.clients.claim())
      .then(() => {
        // Tell every open tab to do a hard reload so they get the fresh assets
        return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      })
      .then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
      })
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Only handle our own requests + Google Fonts
  if (!url.origin.includes('snazzygaz.github.io') &&
      !url.href.startsWith('https://fonts.googleapis.com')) {
    return;
  }

  // Never cache version.json — always hit the network
  if (url.pathname.endsWith('version.json')) {
    return;
  }

  // Network-first for HTML, manifest, and SW itself
  // This ensures the freshest shell is always served when online
  if (
    e.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('manifest.json') ||
    url.pathname.endsWith('sw.js')
  ) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(e.request).then(cached =>
            cached || caches.match(`${BASE_PATH}/index.html`)
          )
        )
    );
    return;
  }

  // Cache-first for everything else (icons, fonts, images)
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request)).catch(
      () => new Response('Offline', { status: 503 })
    )
  );
});
