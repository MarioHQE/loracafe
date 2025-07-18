// customers.js

const API_URL_CUSTOMERS = '/api/customers';

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    // Si la página de clientes está activa, cargamos los datos.
    if (document.getElementById('customers-page')?.classList.contains('active')) {
        populateCustomersTable();
        setupCustomersEventListeners();
    }
});

function setupCustomersEventListeners() {
    const customerSearch = document.getElementById('customer-search');
    customerSearch?.addEventListener('input', (e) => {
        populateCustomersTable(e.target.value);
    });
}

// ==================== LÓGICA DE DATOS (API) ====================

/**
 * Rellena la tabla de clientes, que son usuarios con el rol 'CLIENTE'.
 * @param {string} searchTerm - Término opcional para buscar clientes.
 */
function populateCustomersTable(searchTerm = '') {
    const tableBody = document.querySelector('#customers-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando clientes...</td></tr>';

    // Construimos la URL para obtener solo clientes. Si hay búsqueda, la añadimos.
    const url = searchTerm 
        ? `${API_URL_CUSTOMERS}/search?term=${encodeURIComponent(searchTerm)}`
        : API_URL_CUSTOMERS;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(customers => {
            tableBody.innerHTML = '';
            if (customers.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron clientes.</td></tr>';
                return;
            }
            customers.forEach(customer => {
                const row = document.createElement('tr');
                // La API de clientes debería devolver también el total de pedidos.
                // Por ahora, usamos un placeholder.
                const totalPedidos = customer.totalPedidos || 0; 
                
                row.innerHTML = `
                    <td>${customer.nombre} ${customer.apellido}</td>
                    <td>${customer.email}</td>
                    <td>${customer.telefono || 'N/A'}</td>
                    <td>${new Date(customer.fechaRegistro).toLocaleDateString()}</td>
                    <td>${totalPedidos}</td>
                    <td>
                        <button class="action-btn view" data-id="${customer.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            // NOTA: Los listeners de editar/ver podrían redirigir al modal de usuario.
        })
        .catch(error => {
            console.error('Error al cargar clientes:', error);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error al cargar los clientes.</td></tr>';
        });
}