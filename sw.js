const CACHE = 'chromemory-permanent-v4';   // bumped version

const BASE = '/QRsuite';

const ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/sw.js`,
  `${BASE}/icon-192.png`,
  `${BASE}/icon-512.png`,
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap'
];

self.addEventListener('install', e => {
  console.log('📦 Installing cache v4');
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();        // Activate immediately
});

self.addEventListener('activate', e => {
  console.log('✅ Service worker v4 activated');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => {
          console.log('🗑 Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Network-first for HTML (so changes on GitHub show up quickly)
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(`${BASE}/index.html`))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
