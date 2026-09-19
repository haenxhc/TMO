const CACHE = "tmo-hq-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./app.html",
  "./chat.html",
  "./memes.html",
  "./defis.html",
  "./classement.html",
  "./css/style.css"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
