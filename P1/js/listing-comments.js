var modal = document.getElementsByClassName("listing-comment-modal")[0];

document.getElementsByClassName("listing-comment-expand")[0].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("listing-comment-expand")[1].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("listing-comment-expand")[2].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("listing-comment-expand")[3].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("listing-comment-expand")[4].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("listing-comment-expand")[5].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("modal-close")[0].onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    event.target == modal ? modal.style.display = "none" : null;
}
