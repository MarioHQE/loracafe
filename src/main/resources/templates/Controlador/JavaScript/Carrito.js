// Referencias del DOM
const carritoContenido = document.getElementById("carrito-contenido");
const totalUnidades = document.getElementById("total-unidades");
const totalPrecio = document.getElementById("total-precio");
const modalPago = document.getElementById("modal-pago");
const cerrarModalBtn = document.getElementById("cerrar-modal");
const finalizarPagoBtn = document.getElementById("finalizar-pago-btn");
const reiniciarBtn = document.getElementById("reiniciar-btn");
const comprarBtn = document.getElementById("comprar-btn");
const carritoResumen = document.getElementById("carrito-resumen");

// Función para cargar el carrito desde LocalStorage
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    carritoContenido.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        // Mostrar mensaje si el carrito está vacío
        carritoContenido.innerHTML = `<p>Ups! El carrito está vacío, elige algunos productos.</p>`;
        carritoResumen.style.display = "none"; // Ocultar resumen
    } else {
        let unidades = 0;
        let precioTotal = 0;

        carrito.forEach(producto => {
            const item = document.createElement("div");
            item.classList.add("carrito-item");
            item.innerHTML = `
                <img src="${producto.img}" alt="${producto.title}">
                <p>${producto.title}</p>
                <p>S/${producto.price.toFixed(2)}</p>
                <div class="carrito-controles">
                    <button onclick="restarAlCarrito(${producto.id})">-</button>
                    <p>${producto.cantidad}</p>
                    <button onclick="agregarAlCarrito(${producto.id})">+</button>
                </div>
            `;
            carritoContenido.appendChild(item);

            unidades += producto.cantidad;
            precioTotal += producto.cantidad * producto.price;
        });

        carritoResumen.style.display = "block"; // Mostrar resumen
        totalUnidades.textContent = unidades;
        totalPrecio.textContent = precioTotal.toFixed(2);

        // Actualizar el contador del carrito en el navbar
        actualizarContadorCarrito(unidades);
    }
}

// Función para actualizar el contador del carrito en el navbar
function actualizarContadorCarrito(cantidad) {
    const contadorCarrito = document.getElementById("contador-carrito");
    if (contadorCarrito) {
        contadorCarrito.textContent = cantidad;
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = menu.find(item => item.id === id);

    const index = carrito.findIndex(item => item.id === id);
    if (index === -1) {
        carrito.push({ ...producto, cantidad: 1 });
    } else {
        carrito[index].cantidad += 1;
    }
    localStorage.setItem("productos", JSON.stringify(carrito));
    cargarCarrito();
}

// Función para restar productos del carrito
function restarAlCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito[index].cantidad -= 1;
        if (carrito[index].cantidad === 0) {
            carrito.splice(index, 1);
        }
    }
    localStorage.setItem("productos", JSON.stringify(carrito));
    cargarCarrito();
}

// Función para mostrar el modal de pago
function mostrarModalPago() {
    modalPago.classList.add("active");
}

// Función para cerrar el modal
cerrarModalBtn.addEventListener("click", () => {
    modalPago.classList.remove("active");
});

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    if (event.target === modalPago) {
        modalPago.classList.remove("active");
    }
};

// Validaciones adicionales para los campos del formulario de pago
function validarTexto(campo) {
    const regexTexto = /^[A-Za-z\s]+$/; // Solo letras y espacios
    if (!regexTexto.test(campo.value)) {
        alert("El campo " + campo.placeholder + " solo puede contener letras.");
        campo.focus();
        return false;
    }
    return true;
}

function validarNumeroTarjeta() {
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    if (numeroTarjeta.value.length !== 16 || isNaN(numeroTarjeta.value)) {
        alert("El número de tarjeta debe tener 16 dígitos.");
        numeroTarjeta.focus();
        return false;
    }
    return true;
}

function validarFechaExpiracion() {
    const fechaExpiracion = document.getElementById('fecha-expiracion');
    const fechaActual = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
    if (fechaExpiracion.value < fechaActual) {
        alert("La tarjeta está vencida.");
        fechaExpiracion.focus();
        return false;
    }
    return true;
}

function validarCorreo() {
    const correo = document.getElementById('email');
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexCorreo.test(correo.value)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        correo.focus();
        return false;
    }
    return true;
}

// Función para validar que todos los campos estén llenos
function validarCamposLlenos() {
    const campos = document.querySelectorAll('#formulario-pago input');
    for (let campo of campos) {
        if (campo.value.trim() === "") {
            alert("Por favor, completa todos los campos.");
            campo.focus();
            return false;
        }
    }
    return true;
}

// Función para validar el formulario de pago
function validarFormularioPago() {
    const nombreTarjeta = document.getElementById('nombre-tarjeta');
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    const cvv = document.getElementById('cvv');
    const fechaExpiracion = document.getElementById('fecha-expiracion');
    const correo = document.getElementById('email');

    if (!validarCamposLlenos()) return false;  // Verificar si todos los campos están llenos

    if (!validarTexto(nombreTarjeta)) return false;
    if (!validarNumeroTarjeta()) return false;
    if (cvv.value.length !== 3 || isNaN(cvv.value)) {
        alert("El CVV debe tener 3 dígitos.");
        return false;
    }
    if (!validarFechaExpiracion()) return false;
    if (!validarCorreo()) return false;

    return true;
}

// Vinculamos la validación al evento de envío del formulario
const formularioPago = document.getElementById('formulario-pago');
formularioPago.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar envío del formulario por defecto

    if (validarFormularioPago()) {
        alert("¡Compra realizada con éxito!");
        localStorage.removeItem("productos"); // Vaciar el carrito
        modalPago.classList.remove("active"); // Cerrar modal
        cargarCarrito(); // Actualizar carrito
    }
});

// Inicializar el carrito al cargar la página
cargarCarrito();

// Vincular el botón de comprar al modal
if (comprarBtn) {
    comprarBtn.addEventListener("click", mostrarModalPago);
}

const reiniciarCarritoBtn = document.getElementById("reiniciar-btn");

// Vincular el evento click al botón de reiniciar carrito
reiniciarBtn.addEventListener("click", () => {
    if (confirm("¿Deseas reiniciar el carrito?")) {
        localStorage.removeItem("productos");
        cargarCarrito();
    }
});
