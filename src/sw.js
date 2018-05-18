importScripts('workbox-v3.0.0-alpha.6/workbox-sw.js')

self.workbox.skipWaiting();
self.workbox.clientsClaim();

// self.addEventListener('install', (event) => {
//   console.log('[Service Worker] Like, the service worker was installed and junk.');
//   console.log(event);
// });

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Notification';
  const options = {
    body: `${event.data.text()}`,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.workbox.precaching.precacheAndRoute([]);

// self.addEventListener('fetch', (event) => {
//   console.log('[Service Worker] Request received.');
//   console.log(event);
// });