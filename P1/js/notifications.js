var modal = document.getElementsByClassName("notification-modal")[0];

document.getElementsByClassName("notification-expand")[0].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[1].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[2].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[3].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[4].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[5].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[6].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[7].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[8].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("notification-expand")[9].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("modal-close")[0].onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    event.target == modal ? modal.style.display = "none" : null;
}
