// mi-cuenta.js

/**
 * Listener principal que se ejecuta cuando el DOM está completamente cargado.
 * Orquesta todas las inicializaciones de la página "Mi Cuenta".
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Configura la navegación por pestañas (Perfil, Pedidos, Mensajes).
    setupTabs();
    
    // 2. Carga los datos del perfil del usuario en el formulario.
    loadProfile();
    
    // 3. Carga el historial de pedidos del usuario.
    loadPedidos();
    
    // 4. Carga el historial de mensajes del usuario.
    loadMensajes();
    
    // 5. Configura el listener para el envío del formulario de actualización de perfil.
    setupProfileForm();
});

/**
 * Configura la lógica para mostrar y ocultar el contenido de las pestañas.
 */
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Oculta todas las pestañas y quita la clase activa de los botones
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(item => item.classList.remove('active'));

            // Muestra la pestaña seleccionada y marca el botón como activo
            tab.classList.add('active');
            const targetContent = document.getElementById(tab.dataset.tab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Carga los datos del perfil del usuario desde la API y los rellena en el formulario.
 */
function loadProfile() {
    fetch('/api/client/account/profile')
        .then(res => {
            if (!res.ok) throw new Error('No se pudo cargar el perfil. Por favor, inicie sesión de nuevo.');
            return res.json();
        })
        .then(user => {
            document.getElementById('profile-nombre').value = user.nombre || '';
            document.getElementById('profile-apellido').value = user.apellido || '';
            document.getElementById('profile-email').value = user.email || '';
            document.getElementById('profile-telefono').value = user.telefono || '';
            document.getElementById('profile-direccion').value = user.direccion || '';
        }).catch(err => {
            console.error("Error al cargar el perfil:", err);
            document.getElementById('profile-message').textContent = err.message;
            document.getElementById('profile-message').style.color = 'red';
        });
}

/**
 * Configura el formulario de perfil para que envíe los datos actualizados a la API.
 */
function setupProfileForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const profileData = {
            nombre: document.getElementById('profile-nombre').value,
            apellido: document.getElementById('profile-apellido').value,
            email: document.getElementById('profile-email').value,
            telefono: document.getElementById('profile-telefono').value,
            direccion: document.getElementById('profile-direccion').value,
        };

        const csrf = getCsrfToken();
        const messageDiv = document.getElementById('profile-message');
        messageDiv.textContent = 'Guardando...';
        messageDiv.style.color = 'black';

        fetch('/api/client/account/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                [csrf.header]: csrf.token
            },
            body: JSON.stringify(profileData)
        })
        .then(response => {
            if (response.ok) {
                messageDiv.textContent = '¡Perfil actualizado con éxito!';
                messageDiv.style.color = 'green';
            } else if (response.status === 409) { // 409 Conflict (email duplicado)
                messageDiv.textContent = 'Error: El correo electrónico ya está en uso por otra cuenta.';
                messageDiv.style.color = 'red';
            } else {
                throw new Error('No se pudo actualizar el perfil. Inténtelo más tarde.');
            }
        })
        .catch(error => {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.style.color = 'red';
        })
        .finally(() => {
             // Ocultar el mensaje después de 5 segundos
             setTimeout(() => { messageDiv.textContent = ''; }, 5000);
        });
    });
}

/**
 * Carga el historial de pedidos del usuario desde la API.
 */
function loadPedidos() {
    const container = document.getElementById("pedidos-container");
    if (!container) return;

    fetch('/api/client/orders/my-orders')
        .then(res => res.json())
        .then(pedidos => {
            container.innerHTML = "";
            if (pedidos.length === 0) {
                container.innerHTML = "<p>Aún no has realizado ningún pedido.</p>";
                return;
            }
            pedidos.forEach(p => {
                const pedidoHTML = `
                    <div class="pedido-item">
                        <p><strong>Pedido #${p.id}</strong> - ${new Date(p.fechaPedido).toLocaleDateString()}</p>
                        <p>Total: S/ ${p.total.toFixed(2)}</p>
                        <p>Estado: <strong>${p.estado.replace('_', ' ')}</strong></p>
                    </div>`;
                container.innerHTML += pedidoHTML;
            });
        }).catch(err => {
            console.error("Error al cargar pedidos:", err);
            container.innerHTML = "<p>Error al cargar tus pedidos.</p>";
        });
}

/**
 * Carga el historial de mensajes (y respuestas) del usuario desde la API.
 */
function loadMensajes() {
    const container = document.getElementById("mensajes-container");
    if (!container) return;
    
    fetch('/api/client/messages/my-messages')
        .then(res => res.json())
        .then(mensajes => {
            container.innerHTML = "";
            if (mensajes.length === 0) {
                container.innerHTML = "<p>No tienes mensajes. Puedes enviarnos uno desde la página 'Sobre Nosotros'.</p>";
                return;
            }
            mensajes.forEach(msg => {
                const mensajeHTML = `
                    <div class="mensaje-item">
                        <p><strong>Tú (${new Date(msg.fechaEnvio).toLocaleString('es-PE')}):</strong> ${msg.mensaje}</p>
                        ${msg.respuesta 
                            ? `<div class="respuesta-admin">
                                 <p><strong>Lora Café respondió (${new Date(msg.fechaRespuesta).toLocaleString('es-PE')}):</strong> ${msg.respuesta}</p>
                               </div>` 
                            : '<p><i>Aún sin respuesta.</i></p>'
                        }
                    </div>`;
                container.innerHTML += mensajeHTML;
            });
        }).catch(err => {
            console.error("Error al cargar mensajes:", err);
            container.innerHTML = "<p>Error al cargar tus mensajes.</p>";
        });
}

/**
 * Función de ayuda para obtener el token CSRF de las metaetiquetas del HTML.
 * @returns {object} - Un objeto con el token y el nombre del header.
 */
function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}