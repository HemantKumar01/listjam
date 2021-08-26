document.addEventListener('DOMContentLoaded', function () {

    //initalize the sign-in system
    initFirebaseAuth();
    window.db = firebase.firestore();
    if (location.hostname === "localhost") {
        window.db.useEmulator("localhost", 8080);
    }

    // // The Firebase SDK is initialized and available here!
    //
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    firebase.performance(); // call to activate
    //

    try {
        let app = firebase.app();
        let features = [
            // 'auth',
            // 'database',
            // 'functions',
            // 'messaging',
            // 'storage',
            'firestore',
            'analytics',
            'remoteConfig',
            'performance',
        ].filter(feature => typeof app[feature] === 'function');
    } catch (e) {
        console.error(e);
    }
});