/* Service worker ya Daftari Langu: inaiwezesha app kufanya kazi bila intaneti. */
const VERSION = "daftari-v2";
const SHELL = [
  "/",
  "/privacy",
  "/manifest.webmanifest",
  "/static/style.css",
  "/static/app.js",
  "/static/icon-192.png",
  "/static/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function remember(request, response) {
  if (response && response.ok) {
    const copy = response.clone();
    caches.open(VERSION).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Kurasa: jaribu mtandao kwanza, kisha tumia nakala iliyohifadhiwa.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => remember(req, res))
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/")))
    );
    return;
  }

  // Faili nyingine: toa haraka kutoka hifadhi, na zisasishe nyuma ya pazia.
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req)
        .then((res) => remember(req, res))
        .catch(() => hit);
      return hit || network;
    })
  );
});
