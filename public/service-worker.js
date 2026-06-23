const SW_VERSION = 'mvp-a06d-v1';
const CACHE_VERSION = SW_VERSION;
const STATIC_CACHE = `evolution-zero-pwa-${CACHE_VERSION}`;
const ASSET_CACHE_PREFIX = 'evolution-zero-assets-';
const CACHEABLE_ASSET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
const CACHEABLE_URLS = [
  'manifest.webmanifest',
  'apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-512-maskable.png',
].map((path) => new URL(path, self.registration.scope).href);
let activeAssetCacheName = null;

function getExtension(path = '') {
  const cleanPath = String(path).split('?')[0].split('#')[0];
  const dotIndex = cleanPath.lastIndexOf('.');

  return dotIndex >= 0 ? cleanPath.slice(dotIndex).toLowerCase() : '';
}

function isSameOriginAssetRequest(request) {
  try {
    const url = new URL(request.url);
    const scope = new URL(self.registration.scope);

    if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) {
      return false;
    }

    const relativePath = url.pathname.slice(scope.pathname.length).replace(/^\/+/, '');

    return relativePath.startsWith('assets/') && CACHEABLE_ASSET_EXTENSIONS.has(getExtension(relativePath));
  } catch {
    return false;
  }
}

function isValidAssetCacheName(cacheName) {
  return typeof cacheName === 'string' && cacheName.startsWith(ASSET_CACHE_PREFIX);
}

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
    return;
  }

  if (event.data?.type === 'SET_ASSET_CACHE' && isValidAssetCacheName(event.data.cacheName)) {
    activeAssetCacheName = event.data.cacheName;
    return;
  }

  if (event.data?.type === 'CLEAR_OLD_ASSET_CACHES' && isValidAssetCacheName(event.data.cacheName)) {
    const currentName = event.data.cacheName;
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(
          keys
            .filter((key) => key.startsWith(ASSET_CACHE_PREFIX) && key !== currentName)
            .map((key) => caches.delete(key)),
        )),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (activeAssetCacheName && isSameOriginAssetRequest(request)) {
    event.respondWith(
      caches.open(activeAssetCacheName)
        .then((cache) => cache.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            return fetch(request);
          })),
    );
    return;
  }

  if (!CACHEABLE_URLS.includes(request.url)) {
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
