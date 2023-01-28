function toggleVisibility() {
    var pass = document.getElementsByClassName("user-pass")[0];
    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}

function toggleVisibilityAlt() {
    var pass = document.getElementsByClassName("user-pass2")[0];
    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}
