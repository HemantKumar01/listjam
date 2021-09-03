var userName, profilePic;

// Initiate Firebase Auth.
function initFirebaseAuth() {
    // Listen to auth state changes.;
    console.log("initializing firebase auth.");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            onSignIn();
        }
    });
}

//function to be executed above onAuthStateChange if the user is signed in
async function onSignIn() {
    if (!isUserSignedIn()) {
        return; //to prevent any unwanted error
    }

    userName = getUserName();
    profilePic = getProfilePicUrl();

    console.log("signed in :", userName)

    showSignedInUI();
    await addUserToDatabase(getEmail(), userName, profilePic);
    checkForNewMessages(getEmail()).then(() => {
        console.log("checking for realTime updates in messages")
        checkForRealtimeUpdatesInMessages(getEmail());
    });
}

//custom sign in to be executed on button click instead of auto-signin
function signIn(signInWithPopup = false) {
    if (offline()) { //?if user is offline, alert them about it and do not execute this function
        return;
    }

    // Sign into Firebase using popup auth & Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    if (signInWithPopup)
        firebase.auth().signInWithPopup(provider);
    else
        firebase.auth().signInWithRedirect(provider);
}

function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
    location.reload();
}

// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function getEmail() {
    return firebase.auth().currentUser.email;
}

function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || NULL;
}

// to check certain account dependent functions
function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}

function showSignedInUI() {
    if (!isUserSignedIn()) {
        return; //verifying
    }

    const avatars = document.querySelectorAll('.avatar');

    //change profile pic wherever avatar class is present
    if (profilePic) {
        for (let avatar of avatars) {
            avatar.innerHTML = " ";
            avatar.style.background = `url(${profilePic}) center / contain no-repeat`;
        }
    }

    //*converting signInButton to signOutButton;
    const signInButton = document.querySelector("#sideBar .signInButton");
    signInButton.innerHTML = "<i class='fas fa-door-closed'></i> Log Out"
    signInButton.onclick = signOut;
    signInButton.className = "signOutButton"; //now its literally signOut button

    //* displaying userName and EmailId On sidebar;
    let userNameContainer = document.querySelector("#sideBar .userName");
    let emailContainer = document.querySelector("#sideBar .email");
    userNameContainer.innerHTML = userName;
    // getting email directly from auth details as it is a little bit important
    emailContainer.innerHTML = getEmail();
}