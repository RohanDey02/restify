let modal = document.getElementsByClassName("curr-card-modal")[0];

// document.getElementsByClassName("modal-test")[0].onclick() = () => {
//     modal.style.display = "block";
// }
document.getElementById("curr-res").onclick = () => {
    modal.style.display = "block";
}
document.getElementsByClassName("modal-close")[0].onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    event.target == modal ? modal.style.display = "none" : null;
}