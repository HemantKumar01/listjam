//* check for new messages in db(sent to user by others) and after getting them store them in clientSideStorage and delete from db
function checkForNewMessages(email = getEmail()) {
    const userMessagesRef = window.db.collection('userMessages').doc(email);
    userMessagesRef.get().then((doc) => {
        if (doc.exists) {
            console.log(doc.data())
            let data = doc.data().messages; //getting just the message array of data
            console.log(data)
            for (let message of data) {
                message = JSON.parse(message);
                //dont get confused; message owner here converted to message.sentBy in below function with owner as "me"
                createListItem(message.title, message.time, message.priority, "me", message.owner);
            }
        } else {
            console.log("no messages")
        }
        userMessagesRef.set({ //removing messages after viewing
            messages: []
        })
    })
}

//* function to be executed on user signIn (creates / updates user name and profiePic url)
function addUserToDatabase(email, name, profilePicUrl) {
    try {
        const userRef = window.db.collection("users").doc(email);
        userRef.set({
                name: name,
                image: profilePicUrl
            }).then(() => {
                console.log("name and email successfully written to db!");
            })
            .catch((error) => {
                console.error("Error writing name and email to db: ", error);
            });

    } catch (err) {
        console.error("error while updating/creating your profile in db:", err)
    }
}

//* function to search for user from users collection, to be executed when someone tries to add Friend;
//? @PARAM:  userEmail: email id of user you want to search (need not to be same as your email id)
async function searchUser(userEmail) {
    const userRef = window.db.collection("users").doc(userEmail);
    return new Promise(async (resolve, reject) => {
        try {
            let doc = await userRef.get();
            if (doc.exists) {
                console.log("friend found")
                resolve(doc.data())
            } else {
                console.log("User not found; showing invite link")
                //returning nothing so that on addFriend function we can show invite link
                resolve();
            }
        } catch (error) {
            console.log("Error getting user with email: ", email, error)
            reject(error)
        }
    })
}


/*
 * function to add listItem to friend's userMessages in db;
 * ( = sending listItem to user)
 */
function addToUserMessages(friendEmail, listItem) {
    const userRef = window.db.collection("userMessages").doc(friendEmail);
    userRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion(JSON.stringify(listItem))
    })
    console.log("message sent successfully");
}