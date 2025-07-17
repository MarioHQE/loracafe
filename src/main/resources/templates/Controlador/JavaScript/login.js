const container = document.querySelector(".contenedor");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});
loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

// Selecciona los formularios y botones necesarios
const registerForm = document.querySelector(".form-box.register form");
const loginForm = document.querySelector(".form-box.login form");
const registerButton = document.querySelector(".btn.register-btn");
const loginButton = document.querySelector(".btn.login-btn");
const modal = document.createElement("div");

// Modal de bienvenida
function createModal(name) {
    modal.id = "welcome-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    modal.innerHTML = `
        <div style="
                    background: linear-gradient(135deg, #e27107, #c07733);
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    color: white;
                ">
            <img 
                src="../../Vista/Imagenes/img-login/user.svg"
                alt="Bienvenido" 
                style="width: 100px; height: 100px; border-radius: 10%; margin-bottom: 15px;"
            >
            <h2 style="margin-bottom: 10px;">¡Bienvenido, ${name}!</h2>
            <p style="margin-bottom: 20px; font-size: 14px;">Estamos felices de verte aquí. ¡Esperamos que disfrutes tu experiencia!</p>
            <button id="close-modal" style="
                padding: 10px 20px; 
                background: white; 
                color: black; 
                border: none; 
                border-radius: 5px; 
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            ">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// Registro
registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = registerForm.querySelector(
        'input[placeholder="Nombre de usuario"]'
    ).value;
    const email = registerForm.querySelector(
        'input[placeholder="Correo electrónico"]'
    ).value;
    const password = registerForm.querySelector(
        'input[placeholder="Contraseña"]'
    ).value;

    // Validar que no haya campos vacíos
    if (!username || !email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Almacena los datos del usuario en localStorage
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    registerForm.reset();
});

// Inicio de sesión
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = loginForm.querySelector(
        'input[placeholder="Nombre de usuario"]'
    ).value;
    const password = loginForm.querySelector(
        'input[placeholder="Contraseña"]'
    ).value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("No hay usuarios registrados. Por favor, regístrate primero.");
        return;
    }

    if (user.username === username && user.password === password) {
        // Muestra el modal de bienvenida
        createModal(user.username);
        loginForm.reset();
    } else {
        alert("Nombre de usuario o contraseña incorrectos.");
    }
});

// Cambio entre formularios (registro e inicio de sesión)
registerButton.addEventListener("click", () => {
    document.querySelector(".form-box.login").style.display = "none";
    document.querySelector(".form-box.register").style.display = "block";
});

loginButton.addEventListener("click", () => {
    document.querySelector(".form-box.register").style.display = "none";
    document.querySelector(".form-box.login").style.display = "block";
});
