//* update manually by deleting the caches and reloading
function clearCache() {
    if (!offline()) {
        if (window.isInstalled === true) {
            navigator.serviceWorker.ready.then(async (registration) => {
                registration.active.postMessage('update').then(async () => {
                    await registration.unregister();
                });

            })
        }
        alert("ListJam Updated!\n Reloading ListJam to complete update")
        window.location.reload(true);
    }
}

document.querySelector("#updateButton").onclick = () => {
    clearCache();
}