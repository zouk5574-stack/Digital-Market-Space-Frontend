// public/sw.js
const CACHE_NAME = 'dms-pwa-v1.0.0';

// URLs à cacher - adaptées à la structure React/Vite
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Vite génère des noms de fichiers avec hash, donc on cache dynamiquement
];

// Installation
self.addEventListener('install', (event) => {
  console.log('🔄 Installation PWA...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache PWA ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Active immédiatement
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('🎯 PWA Activée');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle immédiat
  );
});

// Intercepte les requêtes - STRATÉGIE AMÉLIORÉE
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les requêtes chrome-extension
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Pour les API, toujours aller au réseau d'abord
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache les réponses API réussies
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback API : retourne les données mockées du cache si disponible
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Fallback générique pour les API
              return new Response(
                JSON.stringify({ 
                  error: 'Hors ligne', 
                  message: 'Veuillez vous reconnecter' 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' } 
                }
              );
            });
        })
    );
    return;
  }

  // Pour les assets (CSS, JS, images) - Cache First
  if (event.request.destination === 'style' || 
      event.request.destination === 'script' || 
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Vérifie si on peut mettre en cache
              if (response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseToCache));
              }
              return response;
            })
            .catch(error => {
              console.log('Erreur fetch asset:', error);
              // Fallback pour les images
              if (event.request.destination === 'image') {
                return new Response(
                  '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f3f4f6"/><text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="#9ca3af">Image</text></svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
            });
        })
    );
    return;
  }

  // Pour les pages HTML - Network First
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache les pages HTML
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback : retourne la page d'accueil depuis le cache
        return caches.match('/')
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback ultime
            return new Response(
              `
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Digital Market Space - Hors ligne</title>
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .offline { color: #6b7280; }
                  </style>
                </head>
                <body>
                  <h1>📶 Hors ligne</h1>
                  <p>Digital Market Space nécessite une connexion Internet.</p>
                  <button onclick="location.reload()">Réessayer</button>
                </body>
              </html>
              `,
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
      })
  );
});

// Gestion des messages (pour les mises à jour)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});