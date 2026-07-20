const CACHE = "uji-v1";
const OFFLINE_URL = "/";

const STATIC = [
  "/",
  "/products",
  "/manifest.json",
  "/assets/brand/uji-logo-forest-green-transparent.png",
  "/assets/brand/uji-logo-white-transparent.png",
  "/assets/brand/uji-logo-charcoal-transparent.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // API calls: network-first, no cache
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(e.request).catch(() => new Response(JSON.stringify({ message: "لا يوجد اتصال بالإنترنت" }), { headers: { "Content-Type": "application/json" } })));
    return;
  }
  // Assets: cache-first
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
      return cached || network;
    }).catch(() => caches.match(OFFLINE_URL))
  );
});
