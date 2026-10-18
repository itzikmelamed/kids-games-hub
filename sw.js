const CACHE = 'kids-games-v4';
const ASSETS = ['.', 'index.html', 'styles.css', 'app.js', 'audio.js', 'audio-manifest.js', 'audio-data-1.js', 'audio-data-2.js', 'audio-data-3.js', 'audio-data-4.js', 'audio-data-5.js', 'audio-data-6.js', 'audio-data-7.js', 'audio-data-8.js', 'audio-data-9.js', 'audio-data-10.js', 'audio-data-11.js', 'audio-data-12.js', 'audio-data-13.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// network-first: fresh version when online, cache fallback when offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
