function addNewFriend() {
    if (offline()) { //?if user is offline, alert them about it and do not execute this function
        return;
    }

    showPopup(`
        <div class="loader" style="display:none;">
            <div class="spinner"></div>
        </div>

        <h2>Add Friend</h2>
        <label for="addFriendInput">Email of your friend:</label>
        <input type = "email"
        id="addFriendInput"
        placeholder = "listjam@gmail.com"
        autofocus required />
        <div class = "buttons">
                <button type="button" class="cancelButton secondary" onclick ='hidePopup()'>
                    Cancel
                </button>
                <button type="button" id="searchFriend" class = "primary" value="Search">
                    Search
                 </button>
        </div>
    `)
    let searchFriendButton = document.querySelector(".popup #searchFriend");
    let input = document.querySelector(".popup #addFriendInput");

    onEnterPress(input, searchFriendButton); //? when enter is pressed inside passed input, click sesearchFriendButton
    searchFriendButton.addEventListener('click', async () => {
        //? validating email
        if (input.validity.typeMismatch) {
            alert("Email address seems invalid!");
            return;
        } else {
            input.setCustomValidity("");
        }

        //? getting email and searching for it
        const friendEmail = input.value.trim();
        if (friendEmail == getEmail()) {
            hidePopup();
            return;
        }
        const loader = document.querySelector(".popup .loader");

        loader.style.display = "grid";
        let friend = await searchUser(friendEmail);
        loader.style.display = "none";

        //* if friend found add new friend_object to localstorage.
        /* 
        * friend_object
        ? friendEmail: {
        ?   name: friend_userName,
        ?   pic: friend_profilePicUrl,
        ? }
        */
        if (friend) {
            console.log(friend);
            let friends = localStorage.friends || JSON.stringify({});
            friends = JSON.parse(friends)
            friends[friendEmail] = { // add friend object at beginning of array
                name: friend.name,
                pic: friend.image
            }
            localStorage.friends = JSON.stringify(friends);

            hidePopup();
            showFriends(); //? reloading friends list

        } else {
            const modal = document.querySelector(".popup .content");
            modal.innerHTML = `
                <h2>Add Friend </h2>
                <p style="text-align:center; max-width:200px; display:block; margin:0 auto;">
                    <strong>Your Friend is not found on list jam.</strong>
                    <br>
                    The good news is you can still invite them to list jam
                    and then connect with them.
                </p>
                <button type="button" class="primary invite">
                    <i class = "fas fa-user-plus" > </i>
                    Invite
                </button>
            `
            const inviteButton = document.querySelector(".popup .content .invite");
            inviteButton.onclick = () => {
                share({ //function share is defined in components.js using web share api
                        url: "https://list-jam.web.app/",
                        text: ` let's join using list-jam.
                            List-jam is the simplest way to create, maintain
                            and share <i> list items/to do tasks </i>
                            with each other`,
                        title: 'List-Jam invitation'
                    },
                    null, //onShareSuccess function
                    "https://list-jam.web.app", //to copy if webShare API does not work
                    () => { //on fallback function
                        alert("link copied!")
                    }
                );
            }
        }
    })

}

function sendMessage() {
    if (offline()) { //?if user is offline, alert them about it and do not execute this function
        return;
    }

    try {
        let friend = window.friendActive;
        let message = document.querySelector("#sendInput input").value.trim();
        let msgPriority = document.querySelector("#sendInput select").value.trim() || "normal";

        if (!message) {
            return;
        }


        let listItem = { //? creating the complete list item 
            id: getNewMessageId(),
            title: message,
            time: Date.now(),
            status: "todo",
            priority: msgPriority,
            owner: {
                name: userName || getUserName(),
                email: getEmail(),
                pic: profilePic || getProfilePicUrl()
            }
        }

        //? storing to localStorage to see sent message
        let friendMessagesLocal = localStorage.friendMessages; //fallback as string so that we can parse it also
        if (!friendMessagesLocal) {
            friendMessagesLocal = {};
        } else {
            friendMessagesLocal = JSON.parse(friendMessagesLocal);
        }

        friendMessagesLocal[friend] = friendMessagesLocal[friend] || []
        friendMessagesLocal[friend].push(listItem);

        localStorage.friendMessages = JSON.stringify(friendMessagesLocal);

        addToUserMessages(friend, listItem); //?add to userMessages[friend_email] in db

        showMessages(friend);

    } catch (err) {
        console.log("error while sending message:", err);
        alert("Error: Cannot send list item!")
    }
}