// orders.js

const API_URL_ORDERS = '/api/orders';
let currentPage = 0; // Para la paginación, empezamos en la página 0
const pageSize = 10; // 10 pedidos por página

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    // Si la página de pedidos es la que está activa al cargar...
    if (document.getElementById('orders-page')?.classList.contains('active')) {
        populateOrdersTable();
        setupOrderEventListeners();
    }
});

function setupOrderEventListeners() {
    const statusFilter = document.getElementById('order-status-filter');
    const dateFilter = document.getElementById('order-date-filter');
    
    // Añadimos listeners a los filtros
    statusFilter?.addEventListener('change', () => {
        currentPage = 0; // Reseteamos la página al cambiar el filtro
        populateOrdersTable();
    });

    dateFilter?.addEventListener('input', () => {
        currentPage = 0; // Reseteamos la página al cambiar el filtro
        populateOrdersTable();
    });

    // Aquí irían los listeners para "Nuevo Pedido", paginación, etc.
}


// ==================== LÓGICA DE DATOS (API) ====================

/**
 * Rellena la tabla de pedidos, aplicando filtros y paginación.
 */
function populateOrdersTable() {
    const tableBody = document.querySelector('#orders-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando pedidos...</td></tr>';
    
    // Recogemos los valores de los filtros
    const status = document.getElementById('order-status-filter').value;
    const date = document.getElementById('order-date-filter').value;

    // Construimos la URL con los parámetros de paginación y filtros
    let url = `${API_URL_ORDERS}?page=${currentPage}&size=${pageSize}&sort=fechaPedido,desc`;

    if (status && status !== 'all') {
        url += `&status=${status}`;
    }
    if (date) {
        url += `&date=${date}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(page => { // La API devuelve un objeto 'Page'
            tableBody.innerHTML = ''; // Limpiar la tabla
            const orders = page.content;

            if (orders.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron pedidos con los filtros seleccionados.</td></tr>';
            } else {
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    
                    // Formateamos la lista de productos
                    const productsList = order.detalles.map(item => `${item.cantidad} x ${item.producto.nombre}`).join('<br>');
                    
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.usuario ? order.usuario.nombre : 'N/A'}</td>
                        <td>${new Date(order.fechaPedido).toLocaleDateString()}</td>
                        <td>${productsList}</td>
                        <td>S/ ${order.total.toFixed(2)}</td>
                        <td>
                            <span class="status ${order.estado.toLowerCase().replace('_', '-')}">${order.estado.replace('_', ' ')}</span>
                        </td>
                        <td>
                            <button class="action-btn view" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn status-update" data-id="${order.id}"><i class="fas fa-sync-alt"></i></button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
            
            // Renderizar controles de paginación
            renderPaginationControls(page);
            attachOrderActionListeners();
        })
        .catch(error => {
            console.error('Error al cargar los pedidos:', error);
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Error al cargar los pedidos.</td></tr>';
        });
}

function attachOrderActionListeners() {
    // Listeners para el botón 'ver detalles'
    document.querySelectorAll('#orders-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.currentTarget.getAttribute('data-id');
            showOrderDetailsModal(orderId);
        });
    });
    
    // Listeners para el botón 'actualizar estado'
    document.querySelectorAll('#orders-table .action-btn.status-update').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.currentTarget.getAttribute('data-id');
            showUpdateStatusModal(orderId);
        });
    });
}


// ==================== LÓGICA DE PAGINACIÓN ====================

function renderPaginationControls(page) {
    const paginationContainer = document.getElementById('order-pagination') || createPaginationContainer();
    paginationContainer.innerHTML = '';
    
    const { totalPages, number: currentPageNumber, first, last } = page;

    // Botón "Anterior"
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Anterior';
    prevButton.disabled = first; // Deshabilitado si es la primera página
    prevButton.addEventListener('click', () => {
        if (!first) {
            currentPage--;
            populateOrdersTable();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Indicador de página
    const pageIndicator = document.createElement('span');
    pageIndicator.innerText = `Página ${currentPageNumber + 1} de ${totalPages}`;
    paginationContainer.appendChild(pageIndicator);

    // Botón "Siguiente"
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Siguiente';
    nextButton.disabled = last; // Deshabilitado si es la última página
    nextButton.addEventListener('click', () => {
        if (!last) {
            currentPage++;
            populateOrdersTable();
        }
    });
    paginationContainer.appendChild(nextButton);
}

function createPaginationContainer() {
    const container = document.createElement('div');
    container.id = 'order-pagination';
    container.className = 'pagination-controls'; // Añade una clase para estilos CSS
    document.querySelector('#orders-page .card').appendChild(container);
    return container;
}


// ==================== LÓGICA DE MODALES ====================

/**
 * Muestra el modal con los detalles de un pedido.
 * @param {number} orderId - El ID del pedido a mostrar.
 */
async function showOrderDetailsModal(orderId) {
    try {
        const response = await fetch(`${API_URL_ORDERS}/${orderId}`);
        if (!response.ok) throw new Error('Pedido no encontrado');
        const order = await response.json();

        const itemsHtml = order.detalles.map(item => `
            <tr>
                <td>${item.producto.nombre}</td>
                <td>${item.cantidad}</td>
                <td>S/ ${item.precioUnitario.toFixed(2)}</td>
                <td>S/ ${item.subtotal.toFixed(2)}</td>
            </tr>
        `).join('');

        const modalContent = `
        <div class="modal active" id="order-details-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Detalles del Pedido: ${order.id}</h3>
                    <button class="close-modal" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <!-- ... detalles del cliente, fecha, etc. ... -->
                    <h4>Productos</h4>
                    <table class="order-products-table">
                        <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr></thead>
                        <tbody>${itemsHtml}</tbody>
                    </table>
                    <div class="order-total">
                        <strong>Total:</strong>
                        <span>S/ ${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="modal-footer"><button type="button" class="btn" onclick="closeModal()">Cerrar</button></div>
            </div>
        </div>
        `;
        document.getElementById('modal-container').innerHTML = modalContent;
    } catch (error) {
        console.error('Error al mostrar detalles del pedido:', error);
        alert('No se pudieron cargar los detalles del pedido.');
    }
}

/**
 * Muestra el modal para actualizar el estado de un pedido.
 * @param {number} orderId - El ID del pedido a actualizar.
 */
async function showUpdateStatusModal(orderId) {
    const response = await fetch(`${API_URL_ORDERS}/${orderId}`);
    const order = await response.json();

    const statusOptions = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO']
        .map(status => `<option value="${status}" ${order.estado === status ? 'selected' : ''}>${status.replace('_', ' ')}</option>`)
        .join('');

    const modalContent = `
        <div class="modal active" id="update-status-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Actualizar Estado del Pedido: ${order.id}</h3>
                    <button class="close-modal" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="new-status">Nuevo Estado</label>
                        <select id="new-status" class="form-control">${statusOptions}</select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" onclick="closeModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="save-status-btn">Guardar</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalContent;

    document.getElementById('save-status-btn').addEventListener('click', () => updateOrderStatus(orderId));
}


function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('new-status').value;

    fetch(`${API_URL_ORDERS}/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al actualizar el estado.');
        return response.json();
    })
    .then(() => {
        alert('Estado del pedido actualizado con éxito.');
        closeModal();
        populateOrdersTable(); // Recargar la tabla
    })
    .catch(error => {
        console.error(error);
        alert('No se pudo actualizar el estado del pedido.');
    });
}

// Función global para cerrar modales
function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}