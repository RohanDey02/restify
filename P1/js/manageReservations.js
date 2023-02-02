let modalPending = document.getElementById("modal-pending");
let modalPastFirst = document.getElementById("modal-past-first");
let modalPastSecond = document.getElementById("modal-past-second");
let modalPastThird = document.getElementById("modal-past-third");

document.getElementById("curr-res1").onclick = () => {
    modalPending.style.display = "block";
}
document.getElementById("curr-res2").onclick = () => {
    modalPastFirst.style.display = "block";
}
document.getElementById("curr-res3").onclick = () => {
    modalPastSecond.style.display = "block";
}
document.getElementById("curr-res4").onclick = () => {
    modalPastThird.style.display = "block";
}

document.getElementById("modal-close-pending").onclick = () => {
    modalPending.style.display = "none";
};
document.getElementById("approve-button").onclick = () => {
    modalPending.style.display = "none";
};
document.getElementById("deny-button").onclick = () => {
    modalPending.style.display = "none";
};
document.getElementById("modal-close-past-first").onclick = () => {
    modalPastFirst.style.display = "none";
};
document.getElementById("modal-close-past-second").onclick = () => {
    modalPastSecond.style.display = "none";
};
document.getElementById("cancel-button").onclick = () => {
    modalPastSecond.style.display = "none";
};
document.getElementById("modal-close-past-third").onclick = () => {
    modalPastThird.style.display = "none";
};

window.onclick = (event) => {
    event.target == modalPending ? modalPending.style.display = "none" : 
    event.target == modalPastFirst ? modalPastFirst.style.display = "none" : 
    event.target == modalPastSecond ? modalPastSecond.style.display = "none" : 
    event.target == modalPastThird ? modalPastThird.style.display = "none" : null;
}