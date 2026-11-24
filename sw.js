// Service worker for the Chatswood Chase Valet dashboard.
// Its only real job is to receive Web Push messages (sent by the
// notify-pickup Edge Function) and show a notification — so staff phones
// buzz even when the dashboard tab is closed or the phone is locked.
//
// Lives at the site root path (…/Valet/sw.js) so its scope covers the app.

// It also keeps a copy of the app on the device, so reopening or reloading the
// dashboard with no internet still opens it (cars then queue and sync later)
// instead of Chrome's "no internet" page.
//   • The page itself: network first, so a new release shows up on the next
//     load. If the network fails, or takes more than 4s, use the saved copy.
//   • Supabase library, fonts, images: saved copy first, refreshed in the
//     background.
//   • Supabase API calls (data, login) and anything that isn't a GET are never
//     touched: they always go straight to the network.
// Demo build: fully self-contained, no CDN. Everything the app needs is local.
const CACHE = 'valet-demo-v1';
const PRECACHE = [
  './index_v2.html',
  './ticket.html',
  './qrcode.min.js',
  './outage.html',
  './manifest.webmanifest',
  './logo-maroon.png',
  './logo-gold.png',
  './car-diagram.png',
  './icon.svg',
  './favicon-32.png?v=4',
];
// Pages that open with no internet: the app, the ticket page, the outage sheet.
const OFFLINE_PAGES = ['index_v2.html', 'ticket.html', 'outage.html'];
const STATIC_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // One missing file mustn't stop the rest from being saved.
  event.waitUntil(caches.open(CACHE).then((c) =>
    Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})))));
});
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const page = url.pathname.split('/').pop();
  if (req.mode === 'navigate' && url.origin === self.location.origin && OFFLINE_PAGES.includes(page)) {
    event.respondWith(networkFirst(req, './' + page));
    return;
  }
  const sameOriginStatic = url.origin === self.location.origin && /\.(png|jpg|svg|webp|webmanifest)$/.test(url.pathname);
  if (sameOriginStatic || STATIC_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req));
  }
});

async function networkFirst(req, key) {
  const cache = await caches.open(CACHE);
  const fromNet = fetch(req).then((res) => {
    if (res.ok) cache.put(key, res.clone());
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, 4000));
  try {
    const res = await Promise.race([fromNet, timeout]);
    if (res) return res;
  } catch (_) { /* offline — fall through to the saved copy */ }
  const saved = await cache.match(key);
  return saved || fromNet;   // nothing saved yet: keep waiting on the network
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(req);
  const fromNet = fetch(req).then((res) => {
    if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
    return res;
  });
  if (saved) { fromNet.catch(() => {}); return saved; }
  return fromNet;
}

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { title: '🔔 Car requested', body: event.data ? event.data.text() : '' }; }

  const title = data.title || '🔔 Car requested';
  const options = {
    body: data.body || 'A customer is ready for their car.',
    tag: data.tag || 'pickup',
    renotify: true,            // re-alert even if a notif with this tag exists
    requireInteraction: true,  // stays on screen until staff act on it
    icon: './icon.svg',
    badge: './icon.svg',
    vibrate: [300, 150, 300, 150, 300],
    data: { url: './index_v2.html' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Tapping the notification focuses an existing dashboard tab, or opens one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './index_v2.html';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url.includes('index_v2.html') && 'focus' in c) return c.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  })());
});
