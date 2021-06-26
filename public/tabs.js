function configureTabs() {
    var sent = document.querySelector("#sent");
    var recieved = document.querySelector("#recieved");
    var indicator = document.querySelector(".indicator");

    sent.onclick = () => {
        sent.classList.add("active");
        recieved.classList.remove("active");
        showSent();
        indicator.style.left = sent.getBoundingClientRect().left + "px";
        indicator.style.width = sent.clientWidth + "px";
    }
    recieved.onclick = () => {
        sent.classList.remove("active");
        recieved.classList.add("active");
        showRecieved();
        indicator.style.left = recieved.getBoundingClientRect().left + "px";
        indicator.style.width = recieved.clientWidth + "px";
    }
}