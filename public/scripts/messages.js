var workspace = document.querySelector(".workspace");
/*
* an array of all message objects;
? message object = 
?    message {
?        id:"m" + messageNumber
?        title: "",
?        time: Date().now(),
?        status:"done|todo",
?        priority:"will_do_later|normal|important"
?    }
*/
var messages = []


//function to return HTML for a list items
function getListItem(message) {
    var {
        id,
        title,
        time,
        status = "todo",
        priority = "normal"
    } = message
    const dateTime = new Date(time);

    return `<div class="message ${priority}">

                <input class= "list"
                type = "checkbox"
                onclick = "changeStatus('${message.id}')" 
                ${ status == "done" ? "checked" : " "}>

                <div class="title">${title}</div>

                <div class="time">
                    <p>${dateTime.toLocaleDateString()} </p>
                    <p>${dateTime.toLocaleTimeString()}</p>
                </div>

                <div class="close" data-id="${id}" onclick='removeItem(this.getAttribute("data-id"))'>x</div>
                
            </div>`
}

function showMessages() {
    var messages = localStorage.messages;

    if (!messages) {
        showEmpty();
        return;
    }

    messages = JSON.parse(messages);

    var query = window.query;
    workspace.innerHTML = "";

    var empty = true
    messages.forEach((message) => {
        if (query == "all" || query == message.status.toLowerCase()) {
            empty = false
            workspace.innerHTML += getListItem(message);
        }
    })
    if (empty) {
        showEmpty();
    }
}

function showEmpty() {
    workspace.style.alignContent = "center";
    workspace.style.justifyContent = "center";

    workspace.innerHTML = "";

    workspace.innerHTML +=
        `<div class = "flexbox empty"
        style = " flex-direction:column; width:200px" >

            <img src = "/images/sticky-notes-outline.png"
            width = "200px"
            height = "auto"
            alt = "nothing in here. list empty" />

            <h3> Nothing in here. </h3>
            <p> woohoo! you have completed all of your list </p>
        </div>
        `
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