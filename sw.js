const CACHE_NAME = 'pr-gilberto-v1';
const ASSETS = [
  '/',
  '/login.html',
  '/compra.html',
  '/dashboard.html',
  '/manifest.json',
  '/assets/pwa-icon-192.png',
  '/assets/pwa-icon-512.png'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('PWA Service Worker caching core assets');
      return cache.addAll(ASSETS).catch(err => console.warn('Failed to cache assets during install:', err));
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network first, fallback to cache for shell assets)
self.addEventListener('fetch', event => {
  // Ignore non-GET requests or external requests (like Supabase database calls)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If valid response, clone and update cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});
