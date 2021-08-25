/*
 * filter message based on the query
 * @params: query: all|todo|done : what type of messages to show
 */

function filterMessages(query) {
    var tabs = document.querySelectorAll("#filter > .tab");

    Array.from(tabs).forEach(tab => {
        tab.classList.remove("active");
    });
    window.query = query.toLowerCase();
    document.getElementById(query).classList.add("active");
    if (window.friendActive) {
        showMessages(window.friendActive);
    } else {
        showMessages()
    }
}

//* function to show the fullscreen popup
//? @params: content: The HTML to show inside popup;
function showPopup(content) {
    var popup = document.querySelector(".popup");
    var popupContent = document.querySelector(".popup .content")
    popupContent.innerHTML = content;
    popup.style.opacity = "1";
    popup.style.transform = "scale(1)";
    popup.style.pointerEvents = "all";
}

function hidePopup() {
    var popup = document.querySelector(".popup");
    popup.style.transform = "scale(0.8)";
    popup.style.opacity = "0";
    popup.style.pointerEvents = "none";
}


//* function to get a unique message id(unique only for user's device) for creating a list Item
function getNewMessageId() {
    var messageNumber = +localStorage.messageNumber || 0; //* for creating its unique id
    localStorage.messageNumber = +messageNumber + 1;
    return (getEmail() + "m" + messageNumber);
}



// * function to add new messages in todo list
function addNewItem() {
    showPopup(`
    <h2>Add New List Item</h2>

    <label for="title"> Name </label>
    <input id="title" placeholder="name of item..." autocomplete="off" autocorrect="off" autofocus required/>
    
    <label for="priority">Priority</label>
    <select id="priority" required>
        <option value = "will_do_later">Less Important</option>
        <option value = "normal" selected> Normal </option>
        <option value = "important"> Important </option>
    </select>
    <div class="buttons">
        <button type="button" id="cancelButton" class="cancelButton secondary" onclick='hidePopup()'>Cancel</button>
        <button type="button" id="submitItem" class="cancelButton primary">Add</button>
    </div>
    `)
    let input = document.querySelector(".popup input#title");
    let okButton = document.querySelector("#submitItem");
    if (!okButton) {
        alert("Unable to create item. please try again later;")
        return;
    }
    onEnterPress(input, okButton) //?on pressing enter while typing on the input, click okButton 
    okButton.onclick = () => {
        const priority = document.querySelector(".popup select#priority").value;
        createListItem(input.value.trim(), Date.now(), priority, "me")
    };
}

//*creating new list item executed from addNewItem() or while updating new messages(lists) from db;
function createListItem(title = " ", dateTime = Date.now(), priority = "normal", owner = "me", sentBy) {
    var message = {};


    message.id = getNewMessageId();


    message.title = title;
    message.time = dateTime;
    message.status = "todo";
    message.priority = priority;
    message.owner = owner;
    message.sentBy = null;
    if (sentBy) {
        message.sentBy = sentBy;
    }

    var allMessages = localStorage.messages;
    //create a new list if localstorage item not present otherwise parse it
    allMessages = allMessages ? JSON.parse(allMessages) : [];
    allMessages.push(message);

    localStorage.messages = JSON.stringify(allMessages);

    if (owner === "me")
        hidePopup();

    if (window.tabActive === "recieved")
        showMessages("me");
}

function removeItem(messageId) {
    var allMessages = JSON.parse(localStorage.messages);

    var i;
    for (i = 0; i < allMessages.length; i++) {
        if (allMessages[i].id == messageId) {
            allMessages.splice(i, 1); //delete item at index i
        }
    }

    localStorage.messages = JSON.stringify(allMessages);

    showMessages(); //to refresh content
}

//* on enter press inside given input:HTML_DOM_ELEMENT(parameter 1),
//* click button:HTML_DOM_ELEMENT(parameter 2)
function onEnterPress(input, button) {
    //?storing the function so that the function is not overwritten, instead mearged with existing function;
    input.addEventListener("keyup", (e) => {
        if (e.keyCode == 13) {
            button.click();
        }
    })
}
//*changes tab on click (recieved/ send)
function changeTabUI(idOfTab) {
    const tabs = document.querySelectorAll("#mainTabs .mainTab")
    for (let tab of tabs) {
        tab.classList.remove("active"); //initially remove active class from all tabs

        if (tab.id == idOfTab) {
            tab.classList.add("active"); //add active class again to clicked tab after removing it
        }
    }
}

function showRecieved() {
    changeTabUI("recieved");

    window.tabActive = "recieved"; //can be sent|recieved

    document.querySelector(".newItem").style.display = "block";
    document.querySelector(".newFriend").style.display = "none";
    document.querySelector(".infoPane").style.display = "none";
    document.querySelector("body > header").style.display = "block";
    document.querySelector("#filter").style.display = "flex";


    showMessages();
}

function showFriends() {

    changeTabUI("send")

    window.friendActive = null;
    window.tabActive = "send"; //can be sent|recieved

    document.querySelector("#filter").style.display = "none";
    document.querySelector(".newItem").style.display = "none";
    document.querySelector(".infoPane").style.display = "none"
    document.querySelector("body > header").style.display = "block";


    workspace.innerHTML = "";
    workspace.style.flexDirection = "row"

    if (isUserSignedIn()) {
        document.querySelector(".newFriend").style.display = "block";

        let friends = localStorage.friends;
        if (friends) {
            friends = JSON.parse(friends);
        } else {
            friends = {};
            showEmpty("Add New Friend with your friend's email id to Get-Started.")
        }
        //*friends:[email:friend_object];
        /* 
        * friend_object
        ? {
        ?   name: friend_userName,
        ?   pic: friend_profilePicUrl,
        ? }
        */
        for (let email in friends) {
            friend = friends[email];
            workspace.innerHTML += `
                <div class="friend" onclick="showMessages('${email}')">
                    <img src="${friend.pic}" height="50px" width="50px">
                    <span class="name"> ${friend.name} </span>
                    <span class="email"> ${email} </span>
                </div>
            `
        }

    } else { //* if user is not signed in then show a sign in button
        workspace.innerHTML += `
            
            <button class='signInButton' onclick = 'signIn()'>
            <img src = "/images/Google_Logo.png"
            alt = "Google"
            height = "100%"
            width = "auto">
             Sign In
            </button>
            Sign In To Access This Feature
        `
    }
}

//* navBar (sidebar-right) functioning
const nav = document.querySelector("header nav#sideBar");

function showNav() {
    nav.style.right = "0";
}

function hideNav() {
    nav.style.right = "-100%";
}

//* set friend's name and profile photo on top info pane while viewing messages sent to a friend
//? @PARAM: email:- email of friend whose messages you are viewing. 
function setInfoPaneContent(email) {
    const friend = JSON.parse(localStorage.friends)[email];

    document.querySelector("body > header").style.display = "none";
    document.querySelector(".infoPane .name").innerHTML = friend.name;
    document.querySelector(".infoPane img#profilePic").src = friend.pic;

    document.querySelector(".infoPane").style.display = "block"
}

//* share share_object using web share api
//* fallback_text for browsers, that do not support it(copies a text)
//* onShareSuccess is a function to be executed if webShare API works
//* onFallback is a function to be executed if webShare API fails and insead fallback object text is copied;
/*
? share_object:{
?   url: A USVString representing a URL to be shared.
?   text: A USVString representing text to be shared.
?   title: A USVString representing the title to be shared.
?   files: A "FrozenArray" representing the array of files to be shared.
? }
? }
*/
async function share(share_object, onShareSuccess, fallback_text, onFallback) {
    try {
        await navigator.share(share_object)
        if (onShareSuccess)
            onShareSuccess()

    } catch (err) {
        console.error("error while sharing invite link", err);
        if (fallback_text) {
            navigator.clipboard.writeText(fallback_text)
            if (onFallback)
                onFallback()
        }
    }
}

//* Managing colors of <select> in sendInput(input box shown for sending messages to friends)
//* colors of select box will be based on text selected by user(lessImportant|normal|important);
//* for colors associated with respective texts see :root styling in style.css
function changeSelectColorBasedOnPriority() {
    const colorChart = {
        "will_do_later": "var(--msg-lessImportant-clr)",
        "normal": "var(--msg-normal-clr)",
        "important": "var(--msg-important-clr)",
    }

    const sendPrioritySelect = document.querySelector("#sendInput select");
    let priority = sendPrioritySelect.value;
    sendPrioritySelect.style.backgroundColor = colorChart[priority] || "var(--msg-normal-clr)";
}