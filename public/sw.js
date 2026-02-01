// Enhanced service worker for comprehensive offline functionality
const CACHE_NAME = 'mandi-platform-v2';
const RUNTIME_CACHE = 'mandi-runtime-v2';
const DATA_CACHE = 'mandi-data-v2';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, DATA_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first with cache fallback strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached data if network fails
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                console.log('[SW] Serving cached API data:', url.pathname);
                return cachedResponse;
              }
              // Return offline response
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'You are currently offline. Some features may be limited.' 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' },
                  status: 503
                }
              );
            });
          });
      })
    );
    return;
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', url.pathname);
        return cachedResponse;
      }

      return caches.open(RUNTIME_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Offline', { status: 503 });
          });
      });
    })
  );
});

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Sync pending transactions when back online
async function syncTransactions() {
  try {
    const cache = await caches.open(DATA_CACHE);
    const requests = await cache.keys();
    
    // Find pending transaction requests
    const pendingRequests = requests.filter(req => 
      req.url.includes('/api/transactions') && req.method === 'POST'
    );

    console.log('[SW] Syncing', pendingRequests.length, 'pending transactions');

    for (const request of pendingRequests) {
      try {
        await fetch(request);
        await cache.delete(request);
        console.log('[SW] Synced transaction:', request.url);
      } catch (error) {
        console.error('[SW] Failed to sync transaction:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Push notification support (for future use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Mandi Platform';
  const options = {
    body: data.body || 'New update available',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: data.url || '/',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});