// Carrito.js

// Referencias a los elementos del DOM.
const carritoContenido = document.getElementById("carrito-contenido");
const totalUnidades = document.getElementById("total-unidades");
const totalPrecio = document.getElementById("total-precio");
const subtotalPrecio = document.getElementById("subtotal-precio");
const modalPago = document.getElementById("modal-pago");
const cerrarModalBtn = document.getElementById("cerrar-modal");
const reiniciarBtn = document.getElementById("reiniciar-btn");
const comprarBtn = document.getElementById("comprar-btn");
const carritoResumen = document.getElementById("carrito-resumen");
const formularioPago = document.getElementById('formulario-pago');
const emptyCartMsg = document.getElementById("empty-cart-message");

/**
 * Listener principal que se ejecuta al cargar la página del carrito.
 */
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();

    if (comprarBtn) comprarBtn.addEventListener("click", mostrarModalPago);
    if (reiniciarBtn) reiniciarBtn.addEventListener("click", reiniciarCarrito);
    if (cerrarModalBtn) cerrarModalBtn.addEventListener("click", cerrarModalPago);
    
    // El listener del submit se asocia al formulario de pago de tarjeta
    if (formularioPago) {
        formularioPago.addEventListener("submit", (event) => {
            procesarCompra(event, 'tarjeta');
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === modalPago) cerrarModalPago();
    });
});

/**
 * Carga los productos desde localStorage y los renderiza en la página.
 */
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    
    if (!carritoContenido || !carritoResumen || !emptyCartMsg) return;

    carritoContenido.innerHTML = ""; 

    if (carrito.length === 0) {
        carritoResumen.style.display = "none";
        emptyCartMsg.style.display = "block";
    } else {
        carritoResumen.style.display = "block";
        emptyCartMsg.style.display = "none";

        let precioTotal = 0;
        carrito.forEach(producto => {
            const subtotal = producto.cantidad * producto.precio;
            precioTotal += subtotal;
            const row = carritoContenido.insertRow();
            row.innerHTML = `
                <td data-label="Producto"><div class="product-info"><img src="${producto.imagenUrl || '/Vista/Imagenes/img-carta/default-product.png'}" alt="${producto.nombre}"><span class="product-name">${producto.nombre}</span></div></td>
                <td data-label="Precio">S/ ${producto.precio.toFixed(2)}</td>
                <td data-label="Cantidad"><div class="quantity-controls"><button onclick="restarDelCarrito(${producto.id})">-</button><span>${producto.cantidad}</span><button onclick="sumarAlCarrito(${producto.id})">+</button></div></td>
                <td data-label="Subtotal">S/ ${subtotal.toFixed(2)}</td>
                <td><button class="remove-item-btn" onclick="eliminarDelCarrito(${producto.id})" title="Eliminar producto"><ion-icon name="trash-outline"></ion-icon></button></td>
            `;
        });

        subtotalPrecio.textContent = `S/ ${precioTotal.toFixed(2)}`;
        totalPrecio.textContent = `S/ ${precioTotal.toFixed(2)}`;
    }
    
    if (typeof actualizarContadorNavbar === 'function') {
        actualizarContadorNavbar();
    }
}

function sumarAlCarrito(productoId) {
    let carrito = JSON.parse(localStorage.getItem("productos")) || [];
    const indice = carrito.findIndex(p => p.id === productoId);
    if (indice !== -1) {
        carrito[indice].cantidad++;
        localStorage.setItem("productos", JSON.stringify(carrito));
        cargarCarrito();
    }
}

function restarDelCarrito(productoId) {
    let carrito = JSON.parse(localStorage.getItem("productos")) || [];
    const indice = carrito.findIndex(p => p.id === productoId);
    if (indice !== -1) {
        carrito[indice].cantidad--;
        if (carrito[indice].cantidad === 0) {
            carrito.splice(indice, 1);
        }
        localStorage.setItem("productos", JSON.stringify(carrito));
        cargarCarrito();
    }
}

function eliminarDelCarrito(productoId) {
    if (confirm("¿Quitar este producto del carrito?")) {
        let carrito = JSON.parse(localStorage.getItem("productos")) || [];
        const nuevoCarrito = carrito.filter(p => p.id !== productoId);
        localStorage.setItem("productos", JSON.stringify(nuevoCarrito));
        cargarCarrito();
    }
}

function reiniciarCarrito() {
    if (confirm("¿Vaciar todo el carrito?")) {
        localStorage.removeItem("productos");
        cargarCarrito();
    }
}

function mostrarModalPago() {
    if (!modalPago) return;
    const total = document.getElementById('total-precio').textContent;
    document.getElementById('modal-total-precio').textContent = total;
    modalPago.classList.add("active");
    setupPaymentMethodTabs(); 
}

function cerrarModalPago() { if (modalPago) modalPago.classList.remove("active"); }

function setupPaymentMethodTabs() {
    const methodBtns = document.querySelectorAll('.payment-method-btn');
    const paymentPanels = document.querySelectorAll('.payment-panel');
    const finalPayBtn = document.querySelector('.btn-pay-final');
    if (!finalPayBtn) return;

    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const method = btn.dataset.method;

            paymentPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `${method}-content`);
            });

            // Lógica para cambiar la acción del botón de pago
            if (method === 'billetera') {
                finalPayBtn.textContent = 'Confirmar Pago';
                finalPayBtn.removeAttribute('form'); // Desasociar del formulario de tarjeta
                // Asignamos un nuevo listener que llama a procesarCompra pero sin validación de tarjeta.
                finalPayBtn.onclick = () => procesarCompra(null, 'billetera');
            } else { // Tarjeta
                finalPayBtn.innerHTML = '<ion-icon name="shield-checkmark-outline"></ion-icon> Pagar Ahora';
                finalPayBtn.onclick = null; // Quitar el listener anterior
                // Volvemos a asociar el botón al formulario para que el 'submit' funcione.
                finalPayBtn.setAttribute('form', 'formulario-pago');
            }
        });
    });
    // Activar la primera pestaña por defecto al abrir
    methodBtns[0]?.click();
}

/**
 * ¡¡FUNCIÓN MEJORADA!!
 * Valida, construye el DTO y envía el pedido al backend.
 * Acepta un parámetro opcional para saber qué método de pago se usó.
 * @param {Event|null} event - El evento de submit del formulario.
 * @param {string} paymentMethod - 'tarjeta' o 'billetera'.
 */
function procesarCompra(event, paymentMethod = 'tarjeta') {
    if (event) {
        event.preventDefault(); // Prevenir recarga si es un evento de formulario
    }
    
    // Validar el formulario de tarjeta solo si es necesario
    if (paymentMethod === 'tarjeta' && !validarFormularioTarjeta()) {
        return; 
    }

    const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // El campo de dirección es común y siempre requerido
    const direccion = document.getElementById('direccion').value.trim();
    if (!direccion) {
        alert("La dirección de entrega es obligatoria.");
        document.getElementById('direccion').focus();
        return;
    }

    const orderRequest = {
        items: carrito.map(item => ({ productoId: item.id, cantidad: item.cantidad })),
        direccionEntrega: direccion,
        notas: `Pedido pagado con ${paymentMethod}`
    };

    const csrf = getCsrfToken();
    if (!csrf.token || !csrf.header) {
        alert("Error de seguridad. Por favor, recargue la página.");
        return;
    }

    fetch('/api/client/orders/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrf.header]: csrf.token
        },
        body: JSON.stringify(orderRequest)
    })
    .then(async response => {
        if (response.ok) return response.json();
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        if (response.status === 409) throw new Error('¡Ups! Uno de los productos se quedó sin stock.');
        if (response.status === 403) throw new Error('Debes iniciar sesión para comprar.');
        throw new Error('No se pudo procesar tu pedido.');
    })
    .then(pedidoCreado => {
        alert(`¡Compra realizada con éxito! Tu pedido es el #${pedidoCreado.id}.`);
        localStorage.removeItem("productos");
        cerrarModalPago();
        cargarCarrito();
    })
    .catch(error => {
        alert(error.message);
    });
}

/**
 * Valida únicamente los campos del formulario de la tarjeta.
 */
function validarFormularioTarjeta() {
    const camposRequeridos = document.querySelectorAll('#formulario-pago input[required]');
    for (const campo of camposRequeridos) {
        if (!campo.value.trim()) {
            alert(`El campo "${campo.placeholder || campo.id}" es obligatorio.`);
            campo.focus();
            return false;
        }
    }
    // Aquí irían validaciones más específicas de la tarjeta
    return true;
}

function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}