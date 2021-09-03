//just v-3 of cache will be present in users device as others are deleted
const cacheName = "listJamCache-v6";

const cacheFirstCache = [
    //? these files below will be first searched from cache instead of internet
    '/images/sticky-notes-outline.png',
    '/images/Google_Logo.png',
    '/images/og_image.png',
    '/images/icon.png',
    '/favicon.ico',

    '/style.css',

    '/scripts/components.js',
    '/scripts/messages.js', ,
    '/scripts/send.js',
    '/scripts/auth.js',
    "/scripts/update.js",
    '/scripts/firebaseSettings.js',
    '/scripts/firestore.js'
];

const internetFirstCache = [
    //? these files below will be first searched from cache instead of internet
    '/index.html',
    '/scripts/serviceWorker.js',
]

//* load content(cache first, if not found search over internet)
self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        //?if in internetFirstCache first load from internet, in case of unavailabilty load from cache.
        if (internetFirstCache.includes(e.request.url)) {
            return fetch(e.request).then((response) => {
                caches.open(cacheName).then((cache) => {
                    try {
                        cache.put(e.request, response.clone());
                    } catch (err) {
                        console.debug(`[service worker]: cannot cache response of ${e}
                            error: ${err}
                        `)
                    }
                });
                return response;
            }).catch(() => {
                return caches.match(e.request);
            })
        }

        //? first load from cache, and if not found then look over internet and cache it;
        const cachedContent = await caches.match(e.request);
        console.debug(`[service worker]: Fetching resource: ${e.request.url}`);
        if (cachedContent) { //? if cache found
            return cachedContent;
        }
        const response = await fetch(e.request);

        //? if cache not found then fetch it and add to cache
        try {
            if (e.request.method !== 'GET') {
                const cache = await caches.open(cacheName);
                console.debug(`[service worker]: Caching new resource: ${e.request.url}`);
                cache.put(e.request, response.clone());
            }
        } catch (err) {
            console.debug(`[service worker]: cannot cache response of ${e}
                response: ${response};
                error: ${err}
            `)
        } finally {
            return response;
        }
    })())
})


function clearCache() {
    caches.keys().then((cacheNames) => {
        for (let cache of cacheNames) {
            return caches.delete(cache);
        }
    });
    console.log("Caches cleared")
}

self.addEventListener("message", (event) => {
    if (event.data == "update") {
        clearCache();
    }
})

//*init the cache
self.addEventListener('install', (e) => {
    console.debug("[service worker]: install event fired.")

    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);

        console.debug("[service worker]: Caching all necessary content, to make the app work offline.")
        await cache.addAll(cacheFirstCache.concat(internetFirstCache));

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