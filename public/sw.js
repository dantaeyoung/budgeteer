const CACHE_NAME = 'budgeteer-v1'

// Files to cache
const FILES_TO_CACHE = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png']

// Install service worker
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE)
    }),
  )
  self.skipWaiting()
})

// Activate and clean up old caches
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Serve cached content when offline
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request).then((response) => {
        return (
          response ||
          fetch(evt.request).then((response) => {
            cache.put(evt.request, response.clone())
            return response
          })
        )
      })
    }),
  )
})
