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
    showMessages();
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

// * function to add new messages in todo list
function addNewItem() {
    showPopup(`
    <h2>Add New List Item</h2>

    <label for="title"> Name </label>
    <input id="title" placeholder="name of item..." autocomplete="off" autocorrect="off" autofocus required/>
    
    <label for="priority">Priority</label>
    <select id="priority" required>
        <option value = "will_do_later">Will Do Later</option>
        <option value = "normal" selected> Normal </option>
        <option value = "important"> Important </option>
    </select>
    <div class="buttons">
        <button type="button" id="cancelButton" class="cancelButton secondary" onclick='hidePopup()'>Cancel</button>
        <button type="button" id="submitItem" class="cancelButton primary">Add</button>
    </div>
    `)
    const okButton = document.querySelector("#submitItem");
    if (!okButton) {
        alert("Unable to create item. please try again later;")
        return;
    }
    okButton.onclick = () => {
        var message = {};
        var messageNumber = localStorage.messageNumber || 0; //* for creating its unique id

        message.id = "m" + messageNumber;
        localStorage.messageNumber = messageNumber + 1;

        message.title = document.querySelector(".popup input#title").value;
        message.time = Date.now();
        message.status = "todo";
        message.priority = document.querySelector(".popup select#priority").value;

        var allMessages = localStorage.messages;
        //create a new list if localstorage item not present otherwise parse it
        allMessages = allMessages ? JSON.parse(allMessages) : [];
        allMessages.push(message);

        localStorage.messages = JSON.stringify(allMessages);
        hidePopup();
        showMessages();
    }
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