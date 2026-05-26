const SW_VERSION = 'mvp-a06d-v1';
const CACHE_VERSION = SW_VERSION;
const STATIC_CACHE = `evolution-zero-pwa-${CACHE_VERSION}`;
const CACHEABLE_URLS = [
  'manifest.webmanifest',
  'apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-512-maskable.png',
].map((path) => new URL(path, self.registration.scope).href);

self.addEventListener('install', () => {
  // No precache in A06. The app should keep updating from the network.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('evolution-zero-pwa-') && key !== STATIC_CACHE)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || !CACHEABLE_URLS.includes(request.url)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
        }

        return response;
      })
      .catch(() => caches.match(request)),
  );
});
