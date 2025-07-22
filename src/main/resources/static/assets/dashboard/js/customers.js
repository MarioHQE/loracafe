// customers.js

const API_URL_CUSTOMERS = '/api/dashboard/customers';

/**
 * Listener que se ejecuta cuando el DOM está completamente cargado.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Si la página de clientes es la que está activa, cargamos la tabla y configuramos los listeners.
    if (document.getElementById('customers-page')?.classList.contains('active')) {
        populateCustomersTable();
        setupCustomersEventListeners();
    }
});

/**
 * Configura los event listeners para la página de clientes, como la barra de búsqueda.
 */
function setupCustomersEventListeners() {
    const customerSearch = document.getElementById('customer-search');
    customerSearch?.addEventListener('input', (e) => {
        populateCustomersTable(e.target.value);
    });
}

/**
 * Rellena la tabla de clientes, que son usuarios con el rol 'CLIENTE'.
 * @param {string} searchTerm - Término opcional para buscar clientes.
 */
function populateCustomersTable(searchTerm = '') {
    const tableBody = document.querySelector('#customers-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando clientes...</td></tr>';

    const url = API_URL_CUSTOMERS; // La búsqueda se hará en el frontend por ahora

    fetch(url)
        .then(response => response.json())
        .then(customers => {
            tableBody.innerHTML = '';
            
            const filteredCustomers = searchTerm
                ? customers.filter(c => 
                    (c.nombre + ' ' + c.apellido).toLowerCase().includes(searchTerm.toLowerCase()) || 
                    c.email.toLowerCase().includes(searchTerm.toLowerCase()))
                : customers;

            if (filteredCustomers.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron clientes.</td></tr>';
                return;
            }
            
            filteredCustomers.forEach(customer => {
                const row = tableBody.insertRow();
                // ¡¡CAMBIO CLAVE AQUÍ!!
                // Ahora usamos el campo 'totalPedidos' que viene del DTO.
                row.innerHTML = `
                    <td>${customer.nombre} ${customer.apellido}</td>
                    <td>${customer.email}</td>
                    <td>${customer.telefono || 'N/A'}</td>
                    <td>${new Date(customer.fechaRegistro).toLocaleDateString()}</td>
                    <td>${customer.totalPedidos}</td>
                    <td>
                        <a href="/dashboard/users" class="action-btn edit" title="Gestionar en Usuarios"><i class="fas fa-edit"></i></a>
                    </td>
                `;
            });
        })
        .catch(error => {
            console.error('Error al cargar clientes:', error);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error al cargar los clientes.</td></tr>';
        });
}