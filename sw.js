/**
 * ASTRONOVA - Service Worker for 100% Offline Capability (PWA)
 */

const CACHE_NAME = 'astronova-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/space-bg.css',
  './css/components.css',
  './css/responsive.css',
  './js/spaceBackground.js',
  './js/soundEffects.js',
  './js/deviceAuth.js',
  './js/aiAssistant.js',
  './js/introAnimation.js',
  './js/imageProcessor.js',
  './js/comparison.js',
  './js/earthTwin.js',
  './js/missionControl.js',
  './js/disasterMap.js',
  './js/cropMonitor.js',
  './js/analytics.js',
  './js/demoData.js',
  './js/presentationMode.js',
  './js/speechRecognition.js',
  './js/cameraScanner.js',
  './js/storageManager.js',
  './js/reportGenerator.js',
  './js/i18n.js',
  './js/app.js',
  './assets/logo.png',
  './assets/favicon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First strategy: fetch live files first, fallback to cache if offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && e.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(e.request))
  );
});
