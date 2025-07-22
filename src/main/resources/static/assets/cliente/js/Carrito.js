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

let cardFormInstance = null;

/**
 * Listener principal que se ejecuta al cargar la página del carrito.
 */
// === MONTA EL SDK DE MERCADO PAGO DIRECTAMENTE ===
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

    // === INICIALIZACIÓN SDK MERCADO PAGO PARA PRÁCTICA ===
    const mp = new MercadoPago("APP_USR-2e01dac0-b3cf-40a1-b358-b86c7586eeeb");
    mp.cardForm({
        amount: "100.00",
        iframe: true,
        form: {
            id: "form-checkout",
            cardNumber: {
                id: "form-checkout__cardNumber",
                placeholder: "Numero de tarjeta",
            },
            expirationDate: {
                id: "form-checkout__expirationDate",
                placeholder: "MM/YY",
            },
            securityCode: {
                id: "form-checkout__securityCode",
                placeholder: "Código de seguridad",
            },
            cardholderName: {
                id: "form-checkout__cardholderName",
                placeholder: "Titular de la tarjeta",
            },
            issuer: {
                id: "form-checkout__issuer",
                placeholder: "Banco emisor",
            },
            installments: {
                id: "form-checkout__installments",
                placeholder: "Cuotas",
            },
            identificationType: {
                id: "form-checkout__identificationType",
                placeholder: "Tipo de documento",
            },
            identificationNumber: {
                id: "form-checkout__identificationNumber",
                placeholder: "Número del documento",
            },
            cardholderEmail: {
                id: "form-checkout__cardholderEmail",
                placeholder: "E-mail",
            },
        },
        callbacks: {
            onFormMounted: error => {
                if (error) return console.warn("Form Mounted handling error: ", error);
                console.log("Form mounted");
            },
            onSubmit: event => {
                event.preventDefault();
                alert('¡Práctica: datos listos para enviar al backend!');
            },
            onFetching: (resource) => {
                const progressBar = document.querySelector(".progress-bar");
                progressBar.removeAttribute("value");
                return () => {
                    progressBar.setAttribute("value", "0");
                };
            }
        },
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

function inicializarMercadoPago() {
    if (cardFormInstance) return; // Ya está inicializado
    const form = document.getElementById('form-checkout');
    if (!form) return;
    // Obtener la clave pública y el monto desde los atributos del formulario
    const publicKey = form.getAttribute('data-mp-public-key') || 'APP_USR-2e01dac0-b3cf-40a1-b358-b86c7586eeeb';
    const amount = getTotalPago();
    const mp = new MercadoPago(publicKey, { locale: 'es-PE' });
    cardFormInstance = mp.cardForm({
        amount: amount,
        autoMount: true,
        form: {
            id: 'form-checkout',
            cardholderName: { id: 'form-checkout__cardholderName', placeholder: 'Nombre en la tarjeta' },
            cardholderEmail: { id: 'form-checkout__cardholderEmail', placeholder: 'ejemplo@email.com' },
            cardNumber: { id: 'form-checkout__cardNumber', placeholder: 'Número de la tarjeta' },
            securityCode: { id: 'form-checkout__securityCode', placeholder: 'CVV' },
            expirationDate: { id: 'form-checkout__expirationDate', placeholder: 'MM/AA' },
            installments: { id: 'form-checkout__installments' },
            identificationType: { id: 'form-checkout__identificationType' },
            identificationNumber: { id: 'form-checkout__identificationNumber', placeholder: 'Documento' },
            issuer: { id: 'form-checkout__issuer' }
        },
        callbacks: {
            onFormMounted: error => {
                if (error) return console.warn('Form Mounted handling error: ', error);
            },
            onSubmit: event => {
                event.preventDefault();
                const data = cardFormInstance.getCardFormData();
                // Aquí debes enviar los datos a tu backend para crear el pago con la API de Mercado Pago
                fetch('/api/mercadopago/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Agrega CSRF si es necesario
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(result => {
                    if (result.status === 'approved') {
                        alert('¡Pago realizado con éxito!');
                        // Aquí puedes redirigir o mostrar confirmación
                    } else {
                        alert('Pago pendiente o fallido: ' + (result.status_detail || '')); 
                    }
                })
                .catch(err => {
                    alert('Error procesando el pago');
                    console.error(err);
                });
            },
            onFetching: (resource) => {
                document.querySelector('.progress-bar').removeAttribute('value');
                return () => {
                    document.querySelector('.progress-bar').setAttribute('value', '0');
                };
            }
        }
    });
}

function mostrarModalPago() {
    if (!modalPago) return;
    const total = document.getElementById('total-precio').textContent;
    document.getElementById('modal-total-precio').textContent = total;
    modalPago.classList.add("active");
    setupPaymentMethodTabs();
    setTimeout(() => {
        cardFormInstance = null; // Reinicia la instancia para forzar el montaje
        inicializarMercadoPago();
    }, 400);
}

function cerrarModalPago() {
    if (modalPago) modalPago.classList.remove("active");
    cardFormInstance = null; // Limpia la instancia para permitir el remount
}

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

            if (method === 'billetera') {
                finalPayBtn.textContent = 'Confirmar Pago';
                finalPayBtn.removeAttribute('form');
                finalPayBtn.onclick = () => procesarCompra(null, 'billetera');
                // No destruyas el CardForm ni limpies los divs
            } else {
                finalPayBtn.innerHTML = '<ion-icon name="shield-checkmark-outline"></ion-icon> Pagar Ahora';
                finalPayBtn.onclick = null;
                finalPayBtn.setAttribute('form', 'form-checkout');
                inicializarMercadoPago();
            }
        });
    });
    methodBtns[0]?.click();
}

function getTotalPago() {
    const total = document.getElementById('modal-total-precio');
    if (total) {
        return (total.textContent.replace(/[^\d.,]/g, '').replace(',', '.')) || '0.00';
    }
    return '0.00';
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

// === MODAL MERCADO PAGO ===
let cardFormInstanceModal = null;
let mpModalMounted = false;
document.addEventListener("DOMContentLoaded", () => {
    const modalMp = document.getElementById('modal-mp');
    const abrirModalMp = document.getElementById('abrir-modal-mp');
    const cerrarModalMp = document.getElementById('close-modal-mp');
    if (abrirModalMp && modalMp && cerrarModalMp) {
        abrirModalMp.addEventListener('click', () => {
            if (mpModalMounted) return;
            mpModalMounted = true;
            modalMp.style.display = 'block';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    ["form-checkout__cardNumber","form-checkout__expirationDate","form-checkout__securityCode"].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.innerHTML = '';
                    });
                    const mp = new MercadoPago("APP_USR-2e01dac0-b3cf-40a1-b358-b86c7586eeeb");
                    cardFormInstanceModal = mp.cardForm({
                        amount: "100.00",
                        iframe: true,
                        form: {
                            id: "form-checkout",
                            cardNumber: { id: "form-checkout__cardNumber", placeholder: "Numero de tarjeta" },
                            expirationDate: { id: "form-checkout__expirationDate", placeholder: "MM/YY" },
                            securityCode: { id: "form-checkout__securityCode", placeholder: "Código de seguridad" },
                            cardholderName: { id: "form-checkout__cardholderName", placeholder: "Titular de la tarjeta" },
                            issuer: { id: "form-checkout__issuer", placeholder: "Banco emisor" },
                            installments: { id: "form-checkout__installments", placeholder: "Cuotas" },
                            identificationType: { id: "form-checkout__identificationType", placeholder: "Tipo de documento" },
                            identificationNumber: { id: "form-checkout__identificationNumber", placeholder: "Número del documento" },
                            cardholderEmail: { id: "form-checkout__cardholderEmail", placeholder: "E-mail" },
                        },
                        callbacks: {
                            onFormMounted: error => {
                                if (error) return console.warn("Form Mounted handling error: ", error);
                                console.log("Form mounted");
                            },
                            onSubmit: event => {
                                event.preventDefault();
                                alert('¡Práctica: datos listos para enviar al backend!');
                            },
                            onFetching: (resource) => {
                                const progressBar = document.querySelector(".progress-bar");
                                progressBar.removeAttribute("value");
                                return () => {
                                    progressBar.setAttribute("value", "0");
                                };
                            }
                        },
                    });
                });
            }, 100000); // 700ms para asegurar visibilidad total
        });
        cerrarModalMp.addEventListener('click', () => {
            modalMp.style.display = 'none';
            document.getElementById('form-checkout').reset();
            ["form-checkout__cardNumber","form-checkout__expirationDate","form-checkout__securityCode"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = '';
            });
            cardFormInstanceModal = null;
            mpModalMounted = false;
        });
        window.addEventListener('click', (event) => {
            if (event.target === modalMp) {
                modalMp.style.display = 'none';
                document.getElementById('form-checkout').reset();
                ["form-checkout__cardNumber","form-checkout__expirationDate","form-checkout__securityCode"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.innerHTML = '';
                });
                cardFormInstanceModal = null;
                mpModalMounted = false;
            }
        });
    }
});