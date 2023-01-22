var modal = document.getElementsByClassName("filter-modal")[0];

document.getElementsByClassName("filter-button")[0].onclick = () => {
    modal.style.display = "block";
};

document.getElementsByClassName("filter-modal-close")[0].onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    event.target == modal ? modal.style.display = "none" : null;
}
