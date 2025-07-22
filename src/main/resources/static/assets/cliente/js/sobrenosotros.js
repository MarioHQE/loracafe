// sobrenosotros.js

document.addEventListener("DOMContentLoaded", () => {
    initToggleButton();
    initScrollAnimations();
    initContactForm();
});

function initToggleButton() {
    const extraContent = document.getElementById("extraContent");
    const toggleButton = document.getElementById("toggleButton");
    if (!extraContent || !toggleButton) return;
    extraContent.style.display = "none";
    toggleButton.addEventListener("click", () => {
        const isHidden = extraContent.style.display === "none";
        extraContent.style.display = isHidden ? "inline" : "none";
        toggleButton.textContent = isHidden ? "Leer Menos" : "Leer Más";
    });
}

function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.animate-left, .animate-right, .mision, .vision, .promocion img');
    if (elementsToAnimate.length === 0) return;
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    elementsToAnimate.forEach(element => observer.observe(element));
}

function initContactForm() {
    const form = document.getElementById("contact-form");
    const modal = document.getElementById("success-modal");
    const closeModalButton = document.getElementById("close-modal");

    if (!form || !modal || !closeModalButton) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const mensaje = form.querySelector("textarea").value.trim();
        if (mensaje.length < 10) {
            alert("El mensaje debe tener al menos 10 caracteres.");
            return;
        }

        const messageData = { asunto: 'Consulta desde Mi Cuenta', mensaje: mensaje };
        const csrf = getCsrfToken();

        fetch('/api/client/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', [csrf.header]: csrf.token },
            body: JSON.stringify(messageData),
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) throw new Error('Debes iniciar sesión para enviar un mensaje.');
                throw new Error('No se pudo enviar el mensaje.');
            }
            return true;
        })
        .then(() => {
            modal.style.display = "flex";
            form.reset();
        })
        .catch(error => alert(error.message));
    });

    closeModalButton.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });
}

function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}