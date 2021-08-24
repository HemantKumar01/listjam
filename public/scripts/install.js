var deferredPrompt;

function showInstallPromotion() {
    var div = document.querySelector(".promotion")
    div.innerHTML = `
        <img src = "/gifs/412-gift-outline.gif"
        height = "160px"
        width = "auto">
        <h3>
            Turn your Lists into Super Lists.
        </h3>
        <h1>
            Access List-Jam at your fingertips!
        </h1>
        <h3>
            List-Jam is better on the app, tap to install now.
        </h3>
        
        <div class="buttons">
            <button class="secondary" id="cancelInstall">Not Now</button>
            <button class="primary" id="install">Install</button>
        </div>
    `;
    div.style.top = "0";
    document.getElementById("cancelInstall").onclick = () => {
        hideInstallPromotion();
    }
    document.getElementById("install").onclick = async () => {
        // Hide the app provided install promotion
        hideInstallPromotion();
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const {
            outcome
        } = await deferredPrompt.userChoice;
        // Optionally, send analytics event with outcome of user choice
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
    }
}

function hideInstallPromotion() {
    document.querySelector(".promotion").style.top = "-100vh";
}

function showSuccessMessage() {
    var div = document.querySelector(".promotion");
    div.innerHTML = `
    <img src = "/gifs/1103-confetti-outline.gif" height="200px" width="auto">
    <h1>Congratulations!</h2>
    <p>
        List-Jam installed successfully.
        Now you can use it directly from your device
    </p>
    `;
    div.style.top = "0";
}
window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    hideInstallPromotion();
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    console.log('PWA was installed');
    showSuccessMessage();
});

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
});