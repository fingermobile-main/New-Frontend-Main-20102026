// FingerMobile Protocol Platform - Service Worker
// Version: 1.0
// Purpose: PWA offline support and caching

const CACHE_NAME = 'fingermobile-v1.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index_mobile.html',
  './onboarding_mobile_optimized.html',
  './forum_page_mobile_optimized.html',
  './member_landing_mobile_optimized.html',
  './beatwave_ng_mobile_optimized.html',
  './wallet_mobile_optimized.html',
  './marketplace_mobile_optimized.html',
  './community_mobile_optimized.html',
  './groups_mobile_optimized.html',
  './messages_mobile_optimized.html',
  './financials_mobile_optimized.html',
  './portfolio_mobile_optimized.html',
  './gems_mobile_optimized.html',
  './blogs_mobile_optimized.html',
  './trends_mobile_optimized.html',
  './gallery_mobile_optimized.html',
  './subscriptions_mobile_optimized.html',
  './referrals_mobile_optimized.html',
  './hallmarks_mobile_optimized.html',
  './fic_vault_mobile_optimized.html',
  './dancia4_tv_mobile_optimized.html',
  './finger_wars_mobile_optimized.html',
  './assets/icons/logo.png',
  './assets/icons/favicon.ico',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Fetch from network
        return fetch(fetchRequest).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        ).catch(() => {
          // Fallback for HTML requests - show offline page
          if (event.request.destination === 'document') {
            return caches.match('./index_mobile.html');
          }
        });
      })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: './assets/icons/icon-192.png',
    badge: './assets/icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Explore', icon: './assets/icons/icon-192.png' },
      { action: 'close', title: 'Close', icon: './assets/icons/icon-192.png' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FingerMobile', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./index_mobile.html')
    );
  }
});
