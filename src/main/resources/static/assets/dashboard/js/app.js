// app.js

// ====================================================================
// ===                SCRIPT GLOBAL PARA EL DASHBOARD               ===
// ====================================================================


// ==================== CONSTANTES GLOBALES ====================
// URL de la API de pedidos, usada por funciones de modales.
const API_URL_ORDERS_GLOBAL = '/api/dashboard/orders';


// ==================== INICIALIZACIÓN PRINCIPAL ====================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica que se ejecuta en TODAS las páginas del Dashboard ---
    setupMobileMenu();
    setupDashboardLogout();
    initNotifications(); // El sistema de notificaciones debe estar en todas las páginas.

    // --- Lógica que se ejecuta SÓLO en la página principal del Dashboard ---
    if (document.getElementById('dashboard-page')?.classList.contains('active')) {
        initDashboardCharts();
        attachOrderActionListeners(); // Activa los botones en la tabla "Pedidos Recientes".

        setupGeneralReportButton();
    }
});


// ==================== FUNCIONES GLOBALES DE CONFIGURACIÓN ====================

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }
}

function setupDashboardLogout() {
    const logoutBtn = document.getElementById('logout-dashboard');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/logout';
            const csrf = getCsrfTokenForLogout();
            if (csrf.token && csrf.header) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = csrf.header;
                csrfInput.value = csrf.token;
                form.appendChild(csrfInput);
            }
            document.body.appendChild(form);
            form.submit();
        });
    }
}



// ==================== LÓGICA DE LOS GRÁFICOS DEL DASHBOARD ====================
function initDashboardCharts() {
    // Hacemos una petición a nuestro nuevo endpoint para los datos de los gráficos.
    fetch('/api/dashboard/chart-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos para los gráficos.');
            }
            return response.json();
        })
        .then(chartData => {
            // Una vez que tenemos los datos, creamos los gráficos.

            // --- Gráfico de Ventas por Categoría (Doughnut) ---
            const salesByCategoryCtx = document.getElementById('salesByCategoryChart')?.getContext('2d');
            if (salesByCategoryCtx && chartData.salesByCategory) {
                new Chart(salesByCategoryCtx, {
                    type: 'doughnut',
                    data: {
                        labels: chartData.salesByCategory.labels,
                        datasets: [{
                            data: chartData.salesByCategory.data,
                            backgroundColor: [
                                '#5D4037', // Marrón oscuro
                                '#8D6E63', // Marrón medio
                                '#BCAAA4', // Marrón claro
                                '#EFEBE9'  // Grisáceo
                            ],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                            legend: { 
                                position: 'right' 
                            } 
                        }
                    }
                });
            }

            // --- Gráfico de Ingresos Mensuales (Line) ---
            const monthlyRevenueCtx = document.getElementById('monthlyRevenueChart')?.getContext('2d');
            if (monthlyRevenueCtx && chartData.monthlyRevenue) {
                new Chart(monthlyRevenueCtx, {
                    type: 'line',
                    data: {
                        labels: chartData.monthlyRevenue.labels,
                        datasets: [{
                            label: 'Ingresos (S/)',
                            data: chartData.monthlyRevenue.data,
                            backgroundColor: 'rgba(93, 64, 55, 0.1)',
                            borderColor: '#5D4037',
                            borderWidth: 3,
                            pointBackgroundColor: '#5D4037',
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { 
                            y: { 
                                beginAtZero: true 
                            } 
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error("Error al inicializar los gráficos del dashboard:", error);
            // Opcional: podrías mostrar un mensaje de error en lugar de los lienzos de los gráficos.
            const chartBoxes = document.querySelectorAll('.chart-box');
            chartBoxes.forEach(box => {
                box.innerHTML = `<div style="text-align:center; padding-top: 50px; color: #cc0000;">${error.message}</div>`;
            });
        });
}// app.js

// ==================== LÓGICA DE NOTIFICACIONES (Global) ====================

function initNotifications() {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const button = document.getElementById('notification-button');
    const dropdown = document.getElementById('notification-dropdown');
    const badge = document.getElementById('notification-badge');
    const list = document.getElementById('notification-list');

    fetch('/api/dashboard/notifications/summary').then(res => res.json()).then(summary => {
        if (summary.totalUnread > 0) {
            badge.textContent = summary.totalUnread;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
    
    fetch('/api/dashboard/notifications').then(res => res.json()).then(notifications => {
        if (notifications.length > 0) {
            list.innerHTML = '';
            notifications.forEach(n => {
                const iconClass = n.tipo === 'PEDIDO' ? 'fa-shopping-cart' : 'fa-envelope';
                const item = document.createElement('a');
                item.href = n.url;
                item.className = 'notification-item';
                item.innerHTML = `<i class="fas ${iconClass}"></i><div class="notification-item-content"><p>${n.texto}</p><small>${new Date(n.fecha).toLocaleString()}</small></div>`;
                list.appendChild(item);
            });
        } else {
            list.innerHTML = '<p class="no-notifications">No hay notificaciones recientes.</p>';
        }
    }).catch(err => console.error("Error al cargar notificaciones:", err));

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active') && parseInt(badge.textContent) > 0) {
            markNotificationsAsRead();
        }
    });
    
    document.addEventListener('click', () => dropdown.classList.remove('active'));
    dropdown.addEventListener('click', (e) => e.stopPropagation());
}

function markNotificationsAsRead() {
    const csrf = getCsrfToken();
    const badge = document.getElementById('notification-badge');
    fetch('/api/dashboard/notifications/mark-as-read', {
        method: 'POST',
        headers: { [csrf.header]: csrf.token }
    })
    .then(response => {
        if (!response.ok) throw new Error("No se pudieron marcar las notificaciones como leídas.");
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
    })
    .catch(error => console.error(error.message));
}

// Añade esta función a tu archivo app.js
/**
 * Configura el event listener para el botón de "Generar Reporte"
 * en la página principal del dashboard.
 */
function setupGeneralReportButton() {
    const reportBtn = document.getElementById('generate-report');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            // Abre en una nueva pestaña la URL de la API que genera el PDF.
            window.open('/api/dashboard/reports/general', '_blank');
        });
    }
}


    // =================================================================
// FUNCIONES GLOBALES PARA PEDIDOS (MODALES Y ACCIONES)
// =================================================================

function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}

function getCsrfTokenForLogout() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const parameterName = document.querySelector("meta[name='_csrf_parameter']")?.content || '_csrf';
    return { token, header: parameterName };
}

function attachOrderActionListeners() {
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        if (!btn.dataset.listenerAttached) {
            btn.addEventListener('click', e => showOrderDetailsModal(e.currentTarget.dataset.id));
            btn.dataset.listenerAttached = 'true';
        }
    });
    document.querySelectorAll('.action-btn.status-update').forEach(btn => {
        if (!btn.dataset.listenerAttached) {
            btn.addEventListener('click', e => showUpdateStatusModal(e.currentTarget.dataset.id));
            btn.dataset.listenerAttached = 'true';
        }
    });
}

/**
 * Muestra el modal con los detalles de un pedido.
 */
async function showOrderDetailsModal(orderId) {
    try {
        const response = await fetch(`${API_URL_ORDERS_GLOBAL}/${orderId}`);
        if (!response.ok) throw new Error('Pedido no encontrado');
        const order = await response.json(); // Recibe PedidoDetalleDto
        const itemsHtml = order.detalles.map(item => `<tr><td>${item.productoNombre}</td><td>${item.cantidad}</td><td>S/ ${item.precioUnitario.toFixed(2)}</td><td>S/ ${item.subtotal.toFixed(2)}</td></tr>`).join('');
        const modalContent = `
            <div class="modal active" id="order-details-modal"><div class="modal-content">
                <div class="modal-header"><h3>Detalles del Pedido: ${order.id}</h3><button class="close-modal" onclick="closeModal()">×</button></div>
                <div class="modal-body">
                    <p><strong>Cliente:</strong> ${order.clienteNombre}</p>
                    <p><strong>Dirección:</strong> ${order.direccionEntrega}</p>
                    <h4>Productos</h4><table class="order-products-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>${itemsHtml}</tbody></table><div class="order-total"><strong>Total:</strong><span>S/ ${order.total.toFixed(2)}</span></div>
                </div>
                <div class="modal-footer"><button type="button" class="btn" onclick="closeModal()">Cerrar</button></div>
            </div></div>`;
        document.getElementById('modal-container').innerHTML = modalContent;
    } catch (error) { 
        console.error("Error al mostrar detalles:", error);
        alert('No se pudieron cargar los detalles del pedido.'); 
    }
}

/**
 * Muestra el modal para actualizar el estado de un pedido.
 */
async function showUpdateStatusModal(orderId) {
    try {
        const response = await fetch(`${API_URL_ORDERS_GLOBAL}/${orderId}`);
        const order = await response.json(); // Recibe PedidoDetalleDto
        const statusOptions = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'].map(s => `<option value="${s}" ${order.estado === s ? 'selected' : ''}>${s.replace('_', ' ')}</option>`).join('');
        const modalContent = `
            <div class="modal active" id="update-status-modal"><div class="modal-content">
                <div class="modal-header"><h3>Actualizar Estado: ${order.id}</h3><button class="close-modal" onclick="closeModal()">×</button></div>
                <div class="modal-body"><div class="form-group"><label>Nuevo Estado</label><select id="new-status" class="form-control">${statusOptions}</select></div></div>
                <div class="modal-footer"><button type="button" class="btn" onclick="closeModal()">Cancelar</button><button type="button" class="btn btn-primary" id="save-status-btn">Guardar</button></div>
            </div></div>`;
        document.getElementById('modal-container').innerHTML = modalContent;
        document.getElementById('save-status-btn').addEventListener('click', () => updateOrderStatus(orderId));
    } catch (error) {
        console.error("Error al mostrar modal de estado:", error);
        alert("No se pudo cargar la información del pedido.");
    }
}

/**
 * Envía la actualización de estado al backend.
 */
function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('new-status').value;
    const csrf = getCsrfToken();
    fetch(`${API_URL_ORDERS_GLOBAL}/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', [csrf.header]: csrf.token },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
        if (!response.ok) throw new Error("No se pudo actualizar el estado.");
        return response.json();
    })
    .then(() => {
        alert('Estado actualizado con éxito.');
        closeModal();
        // Si estamos en la página de pedidos, la recargamos. Si no, recargamos la página actual.
        if (document.getElementById('orders-page')?.classList.contains('active')) {
            populateOrdersTable(); // Función de orders.js
        } else {
            window.location.reload(); 
        }
    })
    .catch(err => alert(err.message));
}

/**
 * Cierra cualquier modal que esté abierto.
 */
function closeModal() { 
    document.getElementById('modal-container').innerHTML = ''; 
}
