//just v-3 of cache will be present in users device as others are deleted
const cacheName = "listJamCache-v4";

const contentToCache = [
    '/index.html',
    '/style.css',

    '/images/sticky-notes-outline.png',
    '/images/og_image.png',
    '/images/icon.png',
    '/favicon.ico',

    '/scripts/components.js',
    '/scripts/firebaseSettings.js',
    '/scripts/messages.js',
    '/scripts/serviceWorker.js'
];


//* load content(cache first, if not found search over internet)
self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const cachedContent = await caches.match(e.request);
        console.log(`[service worker]: Fetching resource: ${e.request.url}`);
        if (cachedContent) { //if cache found
            return cachedContent;
        }

        //if cache not found then fetch it and add to cache
        const response = await fetch(e.request);
        try {
            if (e.request.method !== 'GET') {
                const cache = await caches.open(cacheName);
                console.log(`[service worker]: Caching new resource: ${e.request.url}`);
                cache.put(e.request, response.clone());
            }
        } catch (err) {
            console.log(`[service worker]: cannot cache response of ${e}
                response: ${response};
                error: ${err}
            `)
        } finally {
            return response;
        }
    })())
})


//*init the cache
self.addEventListener('install', (e) => {
    console.log("[service worker]: install event fired.")

    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);

        console.log("[service worker]: Caching all necessary content, to make the app work offline.")
        await cache.addAll(contentToCache);
    })())

})

// * to delete outdated caches;
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (localCacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    if (cacheName != localCacheName) {
                        return true;
                    }
                }).map(function (localCacheName) {
                    return caches.delete(localCacheName);
                })
            );
        })
    );
});