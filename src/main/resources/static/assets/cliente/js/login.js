// login.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".contenedor");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    if (container && registerBtn && loginBtn) {
        registerBtn.addEventListener("click", () => container.classList.add("active"));
        loginBtn.addEventListener("click", () => container.classList.remove("active"));
    }

    const registrationErrorMessage = document.querySelector(".form-box.register .alert-danger");
    if (registrationErrorMessage && container) {
        container.classList.add("active");
    }
});