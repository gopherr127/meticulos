importScripts('workbox-v3.1.0/workbox-sw.js')

self.workbox.skipWaiting();
self.workbox.clientsClaim();

self.workbox.precaching.precacheAndRoute([]);