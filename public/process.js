var tabs = document.querySelectorAll("#subTab > .tab");
var content = document.querySelector(".workplace");
// window.query = "todo"

var isEmpty = true;
window.showingRecieved = true;
window.filter = "todo";

var allData = {
    recieved: {},
    sent: {}
};
var messageNumber = localStorage.getItem("srNo") || "0";
messageNumber = parseInt(messageNumber);


function listItem(status, data, time, sender, id, recievedMessage = true, newMessage = false, ) {
    time = new Date(time);
    return `<div class="message ${status + (newMessage?" new":"")}" id="${id}">
                <input id = "list${id}"
                type = "checkbox"
                onclick = "removeItem(this.parentElement.id, ${recievedMessage})" 
                ${ status == "done" ? "checked" : " "}>
                <label for = "list${id}"> ${data}</label>
                <div>
                <p>${time.toLocaleDateString()} </p>
                <p>${time.toLocaleTimeString()}</p>
                </div>
                <p>${sender}</p>
            </div>`
}

function showEmpty() {
    content.style.alignContent = "center";
    content.style.justifyContent = "center";
    content.innerHTML =
        `<div class = "flexbox empty" style = " flex-direction:column; width:200px">
            <img src = "box.png" width = "100px" height = "auto" alt="nothing in here. list empty" />
           <h3> Nothing in here.</h3> <p> Congratulations!you have completed all of your list. </p>
            <div> Icons made by <a href = "https://www.freepik.com"
            title = "Freepik"> Freepik </a> from <a href="https://www.flaticon.com/" title="
            Flaticon ">www.flaticon.com</a>
            </div>
        </div>"
        `
}

function updateMessages(data) {

    content.style.alignContent = "flex-start";
    content.style.justifyContent = "flex-start";
    if (isEmpty) {
        content.innerHTML = "";
    }
    isEmpty = false
    var i;
    for (i = 0; i < data.length; i++) {
        messageNumber++;
        if (window.showingRecieved) {
            content.innerHTML = listItem(data[i].status, data[i].data, data[i].time, data[i].sender, "message" + messageNumber, true, true) + content.innerHTML;
        }
        allData.recieved["message" + messageNumber] = data[i];
    }
    localStorage.setItem("srNo", messageNumber.toString());
    localStorage.setItem("messages", JSON.stringify(allData));
}

//below function is called on clicking a button as defined in ./tabs.js
function showRecieved() {
    window.showingRecieved = true;
    var savedData = localStorage.getItem("messages");
    document.getElementById("send").style.display = "none";

    if (!savedData) {
        showEmpty();
        return;
    }
    isEmpty = false

    content.style.alignContent = "flex-start";
    content.style.justifyContent = "flex-start";

    savedData = JSON.parse(savedData);

    allData = savedData; //all data global object to further modify data;

    content.innerHTML = " ";

    var messageId = Object.keys(savedData.recieved);
    //we need to sort messages according to their time(at which they are sent);
    messageId.sort((a, b) => {
        timeOfa = new Date(savedData.recieved[a].time).getTime(); //a.time is in string format(ISC);
        timeOfb = new Date(savedData.recieved[b].time).getTime(); //a.time is in string format(ISC);

        if (timeOfa < timeOfb) {
            return 1;
        } else if (timeOfa > timeOfb) {
            return -1;
        }
        return 0;
    })

    var message;
    var i;
    var flag = true;
    for (i = 0; i < messageId.length; i++) {

        message = savedData.recieved[messageId[i]];

        if (window.filter == "all" || window.filter == message.status) {
            flag = false;
            content.innerHTML += listItem(message.status, message.data, message.time, message.sender, messageId[i], true);
        }
    }
    if (flag) { // if empty workplace
        showEmpty();
    }

}

//below function is called on clicking a button as defined in ./tabs.js
function showSent() {
    window.showingRecieved = false;
    document.getElementById("send").style.display = "flex";
    var savedData = localStorage.getItem("messages");
    if (!savedData) {
        showEmpty();
        return
    }
    isEmpty = false
    content.style.alignContent = "flex-start";
    content.style.justifyContent = "flex-start";

    savedData = JSON.parse(savedData);

    allData = savedData; //all data global object to further modify data;

    content.innerHTML = " ";

    var message;
    var messageId = Object.keys(savedData.sent);
    //we need to sort messages according to their time(at which they are sent);
    messageId.sort((a, b) => {
        timeOfa = new Date(savedData.sent[a].time).getTime(); //a.time is in string format(ISC);
        timeOfb = new Date(savedData.sent[b].time).getTime(); //a.time is in string format(ISC);

        if (timeOfa < timeOfb) {
            return 1;
        } else if (timeOfa > timeOfb) {
            return -1;
        }
        return 0;
    })

    var i;
    var flag = true;
    for (i = 0; i < messageId.length; i++) {
        message = savedData.sent[messageId[i]];
        if (window.filter == "all" || window.filter == message.status) {
            flag = false;
            content.innerHTML += listItem(message.status, message.data, message.time, message.sender, messageId[i], false);
        }
    }
    if (flag) { // if empty workplace
        showEmpty();
    }
}

function send() {
    // var data = document.querySelector("#send input").value;
    // firebase.firestore().collection('users').add({
    //     name: getUserName(),
    //     text: messageText,
    //     profilePicUrl: getProfilePicUrl(),
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
    // }).catch(function (error) {
    //     console.error('Error writing new message to database', error);
    // });
}

function checkForNewMessages() {
    console.log("Checking for new messages.")

}

document.getElementById("sendButton").onclick = send;