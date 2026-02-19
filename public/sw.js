const CACHE_VERSION = 'v2';
const CACHE_NAME = `24link-${CACHE_VERSION}`;

// Solo cachear assets estáticos esenciales (NO cachear rutas de navegación)
const STATIC_ASSETS = [
  '/manifest.json',
  '/images/icono-24link.png'
];

// Install: cachear solo assets estáticos y activar inmediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: limpiar TODOS los caches viejos y tomar control inmediato
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Network-First para navegación, Cache-First solo para assets estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Navegación (páginas HTML) → SIEMPRE red primero
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Peticiones API/Supabase → SIEMPRE red, nunca cachear
  if (request.url.includes('supabase') || request.url.includes('/api/') || request.url.includes('rest/v1')) {
    event.respondWith(fetch(request));
    return;
  }

  // Assets estáticos (imágenes, fuentes, manifest) → Cache-First con actualización
  if (request.destination === 'image' || request.destination === 'font' || request.url.includes('manifest.json')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // Todo lo demás (_nuxt chunks JS/CSS) → Network-First
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.url.includes('_nuxt/')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Escuchar mensaje para forzar actualización desde el cliente
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
