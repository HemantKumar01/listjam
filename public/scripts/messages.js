const workspace = document.querySelector(".workspace");
/*
* an array of all message objects;
? message object = 
?    message {
?        id: userEmailId + "m" + messageNumber
?        title: "",
?        time: Date().now(),
?        status:"done|todo",
?        priority:"will_do_later|normal|important",
*       //below items are used only for sent/recieved messages. 
*       //also message object does not include id, it will be added while reading from db
?        owner: "me"|friendObject:{name, pic, email},
?        sentBy: FriendOwner {name, email, pic}
?    }
*/
var messages = []


//* html element to add to workspace after rendering friend's messages.
const sendInputText = `
<div id="sendInput" class = "flexbox">
    <select id = "priority"
    onchange = "changeSelectColorBasedOnPriority()"
    required>
        <option value = "will_do_later"> Less Important </option>
        <option value = "normal" selected> Normal </option>
        <option value = "important"> Important </option> 
    </select>
    <input type = "text"
     max = "100"
     placeholder = "send..." id="sendItem" />
    <button class="sendButton" onclick = "sendMessage()">
        <i class = "fas fa-paper-plane"> </i>
    </button>
</div>
`

/*
*function to return HTML for a list items
?   @PARAM:
?       1.) message: a message Object as defined above;
?       2.) isMyList: is the message created by me(+ recieved) or showing in sent
?           [sent list items' checkbox should be disabled]
*/
function getListItem(message, isMyList = true, sentBySomeone = false) {
    var {
        id,
        title,
        time,
        status = "todo",
        priority = "normal"
    } = message
    const dateTime = new Date(time);
    if (message.sentBy) {
        return `<div class="message ${priority} sent">
        ${isMyList ?    //? if my list, then show checkbox, else if friends list then hide checkbox
            `<div class="close" data-id="${id}" onclick='removeItem(this.getAttribute("data-id"))'>x</div>
                <input class= "list"
                type = "checkbox"
                ${message.id ? `onclick = "changeStatus('${message.id}')"` : " "}  
                ${status == "done" ? "checked" : " "}>`
            :
                ""
            }
            <div class="title">${title}</div>
            <img class="sentAvatar" src=${message.sentBy.pic}>
            <div class="time">
                <p>${dateTime.toLocaleDateString()} </p>
                <p>${dateTime.toLocaleTimeString()}</p>
            </div>                
        </img>`

    } else {
        return `<div class="message ${priority}">
                ${isMyList ?    //? if my list, then show checkbox, else if friends list then hide checkbox
                `<div class="close" data-id="${id}" onclick='removeItem(this.getAttribute("data-id"))'>x</div>
                    
                    <input class= "list"
                    type = "checkbox"
                    ${message.id ? `onclick = "changeStatus('${message.id}')"` : " "}  
                    ${status == "done" ? "checked" : " "}>`
                :
                ""
                }
                <div class="title">${title}</div>

                <div class="time">
                    <p>${dateTime.toLocaleDateString()} </p>
                    <p>${dateTime.toLocaleTimeString()}</p>
                </div>                
            </div>`
    }
}


/* 
 ? PARAM: 
 ? 1.) person: the person whose messages to show(default to 'me'(my List), it should be email of friend)
 */
function showMessages(person = "me") {
    workspace.innerHTML = "";

    if (person == "me") {
        if (navigator.onLine) {
            if (isUserSignedIn())
                checkForNewMessages(getEmail());
        }

        window.friendActive = null;

        document.querySelector(".infoPane").style.display = "none"

        var messages = localStorage.messages;
        if (!messages) {
            showEmpty();
            return;
        }
        messages = JSON.parse(messages);
    } else {
        window.friendActive = person; //? to know whom to send from same ui;
        setInfoPaneContent(person)
        document.querySelector(".newFriend").style.display = "none";

        var messages = localStorage.friendMessages;
        if (!messages) {
            showEmpty("try sending something to your new list-jam friend", "friend");
            return;
        }

        //* defining messages to show it later down below in this function
        messages = JSON.parse(messages)[person]; //? show person's message (person = email of friend)

    }

    var query = window.query;
    var isMyList = (person == "me");

    var empty = true
    messages.forEach((message) => {
        if (query == "all" || query == message.status.toLowerCase()) {
            empty = false
            workspace.innerHTML += getListItem(message, isMyList, (message.sentBy != null));
        }
    })
    if (empty) { //? even if message object is present, and nothing is rendered by above method(the object is empty) then showEmpty
        showEmpty();
        return;
    }
    if (person != "me") {
        //* add input and button to send something to the friend.
        workspace.innerHTML += sendInputText;
        const sendInputElement = document.querySelector("#sendInput");
        let sendInputTextInput = document.querySelector("#sendInput #sendItem"); //the actual input inside sendInput element
        onEnterPress(
            sendInputTextInput,
            document.querySelector("#sendInput .sendButton")
        ) //? while entering a text in ${sendInput} input field, if enter is pressed, then send list item

        //*positioning the sendInput box (input box to send messages to friends) at the bottom
        sendInputElement.style.bottom = "auto";
        sendInputElement.style.top = workspace.scrollHeight - sendInputElement.clientHeight + "px";

        //*scrolling to bottom so that user always see recent messages first
        //* and can send messages easily(user can scroll upwards(opposite) to see previous messages)
        sendInputElement.scrollIntoView();

    }
}
//* person = me|friend
function showEmpty(text, person = "me") {
    workspace.style.alignContent = "center";
    workspace.style.justifyContent = "center";
    workspace.style.flexDirection = "row"

    workspace.innerHTML = "";

    if (!text) {
        text = "woohoo! you have completed all of your list"
    }

    workspace.innerHTML +=
        `<div class = "flexbox empty"
        style = " flex-direction:column; width:200px" >

            <img src = "/images/sticky-notes-outline.png"
            width = "200px"
            height = "auto"
            alt = "nothing in here. list empty" />

            <h3> Nothing in here.</h3>
            <p> ${text} </p>
        </div>
        `

    if (person != "me") {
        //* add input and button to send something to the friend.
        workspace.innerHTML += sendInputText
    }
}

function changeStatus(id) {
    var messages = JSON.parse(localStorage.messages)

    for (message of messages) {
        if (message.id == id) {
            //invert status between todo and done
            message.status = message.status == "todo" ? "done" : "todo";
        }
    }
    localStorage.messages = JSON.stringify(messages)
    showMessages()
}