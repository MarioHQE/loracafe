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

    // SweetAlert2 global
    if (typeof Swal === 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
        document.head.appendChild(link);
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.head.appendChild(script);
    }
});