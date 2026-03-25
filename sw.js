const CACHE = 'chromemory-permanent-v5';   // ← bump version when you make changes

const BASE_PATH = '/chromemory';

const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/sw.js`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap'
];

self.addEventListener('install', e => {
  console.log('📦 Installing Chromemory cache v5');
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('✅ Service worker v5 activated');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip requests that don't belong to our app (e.g. chrome-extension, other domains)
  if (!url.origin.includes('snazzygaz.github.io') && 
      !url.href.startsWith('https://fonts.googleapis.com')) {
    return;
  }

  // Network-first for HTML navigation
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(`${BASE_PATH}/index.html`))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => new Response('Offline', { status: 503 }))
  );
});
