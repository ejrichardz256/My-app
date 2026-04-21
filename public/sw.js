self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // This keeps the app working on your phone
  e.respondWith(fetch(e.request));
});
