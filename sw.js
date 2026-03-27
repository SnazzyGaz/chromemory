const CACHE = 'chromemory-permanent-v12';
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
  console.log('📦 Installing Chromemory cache v12');
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('✅ Service worker v12 activated');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Listen for messages from the page to bust the cache on demand
self.addEventListener('message', e => {
  if (e.data === 'bust-cache') {
    console.log('🔄 Busting cache — refetching all assets');
    caches.open(CACHE).then(cache =>
      Promise.all(
        ASSETS.map(url =>
          fetch(url, { cache: 'no-store' })
            .then(res => { if (res.ok) cache.put(url, res); })
            .catch(() => {})
        )
      )
    ).then(() => {
      // Notify all clients that the cache is fresh
      self.clients.matchAll().then(clients =>
        clients.forEach(c => c.postMessage('cache-busted'))
      );
    });
  }
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Only handle our own requests + Google Fonts
  if (!url.origin.includes('snazzygaz.github.io') &&
      !url.href.startsWith('https://fonts.googleapis.com')) {
    return;
  }

  // Never cache version.json — always goes to network
  if (url.pathname.endsWith('version.json')) {
    return;
  }

  // Cache-first for everything — fast + offline
  // Cache only gets updated when version.json triggers a bust from the page
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if (cached) return cached;
        // Not in cache — fetch and store
        return fetch(e.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return response;
        });
      })
      .catch(() => {
        // Offline fallback for navigation
        if (e.request.mode === 'navigate') {
          return caches.match(`${BASE_PATH}/index.html`);
        }
        return new Response('Offline', { status: 503 });
      })
  );
});
