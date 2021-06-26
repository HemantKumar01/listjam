var messageNumber = localStorage.getItem("srNo") || "0";

function signIn() {
    // Sign into Firebase using popup auth & Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}


document.getElementById("signin").onclick = signIn;

function onSignIn() {
    if (!isUserSignedIn()) {
        return
    }
    console.log("SIGNED IN: ", getUserName());
    checkForNewMessages();

    var avatar = document.querySelector("#avatar");
    avatar.style.display = "flex";
    document.querySelector("#account h3").innerHTML = getUserName();
    var pic = getProfilePicUrl();

    var userRef = firebase.firestore().collection("users");
    userRef.doc(getEmail()).set({
        name: getUserName(),
        image: pic
    })

    if (pic) {
        avatar.innerHTML = ``;
        avatar.style.background = `url(${pic}) no-repeat center`;
        avatar.style.backgroundSize = `100% auto`;
    }
    document.querySelector("#logged_in").style.display = "flex";
    localStorage.setItem("signed", "1");
    document.querySelector("#main #si").style.display = "none";
    var sent = document.querySelector("#sent");
    var recieved = document.querySelector("#recieved");
    var indicator = document.querySelector(".indicator");
    indicator.style.left = recieved.getBoundingClientRect().left + "px";
    indicator.style.width = recieved.clientWidth + "px";

}
// Signs-out of Friendly Chat.
function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
    localStorage.removeItem("signed");
    location.reload();
}

// Initiate Firebase Auth.
function initFirebaseAuth() {
    // Listen to auth state changes.
    var mainContentOnSI = document.querySelector("#main #si");
    console.log("init");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            onSignIn();
        } else {
            mainContentOnSI.style.display = "flex";
        }
    });
    if (!isUserSignedIn() && !localStorage.getItem("signed")) {
        mainContentOnSI.style.height = "100vh";
        document.body.style.overflow = "hidden";
    }
}

function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || NULL;
}

// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}

function getEmail() {
    return firebase.auth().currentUser.email;
}