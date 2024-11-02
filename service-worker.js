const CACHE_NAME = 'vocab-game-v1';
const ASSETS = [
  '/german-vocab-game/',
  '/german-vocab-game/index.html',
  '/german-vocab-game/game.js',
  '/german-vocab-game/data/vocabulary.js',
  '/german-vocab-game/icon-192.png',
  '/german-vocab-game/icon-512.png',
  '/german-vocab-game/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
}); 