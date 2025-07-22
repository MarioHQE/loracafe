// orders.js

const API_URL_ORDERS = '/api/dashboard/orders';
let currentPage = 0;
const pageSize = 10;

function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('orders-page')?.classList.contains('active')) {
        populateOrdersTable();
        setupOrderEventListeners();
    }
});

function setupOrderEventListeners() {
    const statusFilter = document.getElementById('order-status-filter');
    const dateFilter = document.getElementById('order-date-filter');
    
    statusFilter?.addEventListener('change', () => { currentPage = 0; populateOrdersTable(); });
    dateFilter?.addEventListener('input', () => { currentPage = 0; populateOrdersTable(); });
}

function populateOrdersTable() {
    const tableBody = document.querySelector('#orders-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando pedidos...</td></tr>';
    
    const status = document.getElementById('order-status-filter').value;
    const date = document.getElementById('order-date-filter').value;

    let url = `${API_URL_ORDERS}?page=${currentPage}&size=${pageSize}&sort=fechaPedido,desc`;
    if (status && status !== 'all') url += `&status=${status}`;
    if (date) url += `&date=${date}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar los pedidos.");
            return response.json();
        })
        .then(page => {
            tableBody.innerHTML = '';
            const orders = page.content;

            if (orders.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron pedidos.</td></tr>';
            } else {
                orders.forEach(order => {
                    const row = tableBody.insertRow();
                    const productsList = order.productos.join('<br>');
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.clienteNombre}</td>
                        <td>${new Date(order.fechaPedido).toLocaleDateString()}</td>
                        <td>${productsList}</td>
                        <td>S/ ${order.total.toFixed(2)}</td>
                        <td><span class="status ${order.estado.toLowerCase().replace('_', '-')}">${order.estado.replace('_', ' ')}</span></td>
                        <td>
                            <button class="action-btn view" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn status-update" data-id="${order.id}"><i class="fas fa-sync-alt"></i></button>
                        </td>`;
                });
            }
            renderPaginationControls(page);
            attachOrderActionListeners();
        })
        .catch(error => {
            console.error('Error al cargar pedidos:', error);
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">${error.message}</td></tr>`;
        });
}



function renderPaginationControls(page) {
    let paginationContainer = document.getElementById('order-pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'order-pagination';
        paginationContainer.className = 'pagination-controls';
        document.querySelector('#orders-page .card')?.appendChild(paginationContainer);
    }
    paginationContainer.innerHTML = '';
    
    if (page.totalPages <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Anterior';
    prevButton.disabled = page.first;
    prevButton.addEventListener('click', () => { if (!page.first) { currentPage--; populateOrdersTable(); } });
    paginationContainer.appendChild(prevButton);

    const pageIndicator = document.createElement('span');
    pageIndicator.innerText = `Página ${page.number + 1} de ${page.totalPages}`;
    paginationContainer.appendChild(pageIndicator);

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Siguiente';
    nextButton.disabled = page.last;
    nextButton.addEventListener('click', () => { if (!page.last) { currentPage++; populateOrdersTable(); } });
    paginationContainer.appendChild(nextButton);
}

