// Customer Search
const customerSearch = document.getElementById('customer-search');
if (customerSearch) {
    customerSearch.addEventListener('input', (e) => {
        filterCustomers(e.target.value);
    });
}

// Populate customers table
function populateCustomersTable() {
    const tableBody = document.querySelector('#customers-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    appData.customers.forEach(customer => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.joinDate}</td>
            <td>${customer.orders}</td>
            <td>
                <button class="action-btn view" data-id="${customer.id}"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('#customers-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', () => {
            const customerId = parseInt(btn.getAttribute('data-id'));
            const customer = appData.customers.find(c => c.id === customerId);
            if (customer) {
                viewCustomer(customer);
            }
        });
    });
}

// View customer details
function viewCustomer(customer) {
    const modalContent = `
        <div class="modal active" id="customer-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Detalles del Cliente</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="customer-details">
                        <div class="detail-item">
                            <label>Nombre:</label>
                            <span>${customer.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${customer.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Teléfono:</label>
                            <span>${customer.phone}</span>
                        </div>
                        <div class="detail-item">
                            <label>Fecha de Registro:</label>
                            <span>${customer.joinDate}</span>
                        </div>
                        <div class="detail-item">
                            <label>Total de Pedidos:</label>
                            <span>${customer.orders}</span>
                        </div>
                        <div class="detail-item">
                            <label>Total Gastado:</label>
                            <span>S/${customer.totalSpent.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <h4>Historial de Pedidos</h4>
                    <table class="customer-orders">
                        <thead>
                            <tr>
                                <th>ID Pedido</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${getCustomerOrders(customer.id)}
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn close-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Add event listeners
    document.querySelector('#customer-modal .close-modal').addEventListener('click', closeModal);
    document.querySelectorAll('#customer-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
}

// Get customer orders for display
function getCustomerOrders(customerId) {
    // Filter orders for this customer
    const customerOrders = appData.orders.filter(order => 
        order.customerId === customerId
    );
    
    if (customerOrders.length === 0) {
        return '<tr><td colspan="4">No se encontraron pedidos</td></tr>';
    }
    
    return customerOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>S/${order.total.toFixed(2)}</td>
            <td><span class="status ${order.status}">${getStatusText(order.status)}</span></td>
        </tr>
    `).join('');
}

// Filter customers
function filterCustomers(searchTerm) {
    const filtered = appData.customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tableBody = document.querySelector('#customers-table tbody');
    tableBody.innerHTML = '';
    
    filtered.forEach(customer => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.joinDate}</td>
            <td>${customer.orders}</td>
            <td>
                <button class="action-btn view" data-id="${customer.id}"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Reattach event listeners
    document.querySelectorAll('#customers-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', () => {
            const customerId = parseInt(btn.getAttribute('data-id'));
            const customer = appData.customers.find(c => c.id === customerId);
            if (customer) {
                viewCustomer(customer);
            }
        });
    });
}