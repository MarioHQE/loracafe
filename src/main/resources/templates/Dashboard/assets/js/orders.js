// Referencias a elementos del DOM
let ordersTableBody = document.querySelector('#orders-table tbody');
let orderStatusFilter = document.getElementById('order-status-filter');
let orderDateFilter = document.getElementById('order-date-filter');
let addOrderBtn = document.getElementById('add-order-btn');

// Inicializar la página de pedidos
function initOrdersPage() {
    // Cargar y mostrar los pedidos
    populateOrdersTable();
    
    // Configurar event listeners para los filtros
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }
    
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', filterOrders);
    }
    
    // Configurar botón para agregar pedido
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', showAddOrderModal);
    }
}

// Función para poblar la tabla de pedidos
function populateOrdersTable(orders = appData.orders) {
    if (!ordersTableBody) return;
    
    ordersTableBody.innerHTML = '';
    
    if (orders && orders.length > 0) {
        orders.forEach(order => {
            const row = document.createElement('tr');
            
            // Formatear la lista de productos
            let productsList = order.items.map(item => 
                `${item.quantity} x ${item.product}`
            ).join(', ');
            
            // Acortar la lista si es muy larga
            if (productsList.length > 50) {
                productsList = productsList.substring(0, 50) + '...';
            }
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td title="${order.items.map(item => `${item.quantity} x ${item.product}`).join(', ')}">
                    ${productsList}
                </td>
                <td>S/${order.total.toFixed(2)}</td>
                <td><span class="status ${order.status}">${getOrderStatusText(order.status)}</span></td>
                <td>
                    <button class="action-btn view" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" data-id="${order.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn status-update" data-id="${order.id}"><i class="fas fa-sync-alt"></i></button>
                </td>
            `;
            
            ordersTableBody.appendChild(row);
        });
        
        // Añadir event listeners a los botones de acción
        attachOrderActionListeners();
    } else {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7">No se encontraron pedidos</td>
            </tr>
        `;
    }
}

// Función para obtener el texto del estado del pedido
function getOrderStatusText(status) {
    const statusTexts = {
        'pending': 'Pendiente',
        'processing': 'En proceso',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    };
    
    return statusTexts[status] || status;
}

// Función para adjuntar event listeners a los botones de acción de los pedidos
function attachOrderActionListeners() {
    // Botón Ver
    document.querySelectorAll('#orders-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            const order = appData.orders.find(o => o.id === orderId);
            if (order) viewOrderDetails(order);
        });
    });
    
    // Botón Editar
    document.querySelectorAll('#orders-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            const order = appData.orders.find(o => o.id === orderId);
            if (order) showEditOrderModal(order);
        });
    });
    
    // Botón Cambiar Estado
    document.querySelectorAll('#orders-table .action-btn.status-update').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            const order = appData.orders.find(o => o.id === orderId);
            if (order) showUpdateStatusModal(order);
        });
    });
}

// Función para ver detalles de un pedido
function viewOrderDetails(order) {
    const modalContent = `
        <div class="modal active" id="order-details-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Detalles del Pedido: ${order.id}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="order-details-grid">
                        <div class="detail-item">
                            <label>Cliente:</label>
                            <span>${order.customer}</span>
                        </div>
                        <div class="detail-item">
                            <label>Fecha:</label>
                            <span>${order.date}</span>
                        </div>
                        <div class="detail-item">
                            <label>Estado:</label>
                            <span class="status ${order.status}">${getOrderStatusText(order.status)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Total:</label>
                            <span>S/${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <h4>Productos</h4>
                    <table class="order-products-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.product}</td>
                                    <td>${item.quantity}</td>
                                    <td>S/${item.price.toFixed(2)}</td>
                                    <td>S/${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="order-total">
                        <label>Total:</label>
                        <span>S/${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn close-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Añadir event listeners para cerrar el modal
    document.querySelectorAll('#order-details-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
}

// Función para mostrar el modal de actualización de estado
function showUpdateStatusModal(order) {
    const modalContent = `
        <div class="modal active" id="update-status-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Actualizar Estado del Pedido: ${order.id}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="update-status-form">
                        <div class="form-group">
                            <label for="new-status">Nuevo Estado</label>
                            <select id="new-status" class="form-control">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En proceso</option>
                                <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completado</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="save-status">Guardar Cambios</button>
                    <button type="button" class="btn close-modal">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Añadir event listeners
    document.querySelectorAll('#update-status-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.getElementById('save-status').addEventListener('click', () => {
        const newStatus = document.getElementById('new-status').value;
        updateOrderStatus(order.id, newStatus);
    });
}

// Función para actualizar el estado de un pedido
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = appData.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        appData.orders[orderIndex].status = newStatus;
        populateOrdersTable(); // Actualizar la tabla
        closeModal();
        alert('Estado del pedido actualizado con éxito');
    }
}

// Función para mostrar el modal de edición de pedido
function showEditOrderModal(order) {
    // Obtener lista de productos para el selector
    const productsOptions = appData.products.map(product => 
        `<option value="${product.id}" data-price="${product.price}">${product.name} - S/${product.price.toFixed(2)}</option>`
    ).join('');
    
    // Generar filas de productos actuales
    const currentItems = order.items.map(item => {
        const product = appData.products.find(p => p.name === item.product);
        return `
            <tr>
                <td>
                    <select class="form-control product-select" required>
                        <option value="">Seleccionar producto</option>
                        ${productsOptions}
                    </select>
                </td>
                <td>
                    <input type="number" class="form-control quantity" min="1" value="${item.quantity}" required>
                </td>
                <td class="price">S/${item.price.toFixed(2)}</td>
                <td class="subtotal">S/${(item.quantity * item.price).toFixed(2)}</td>
                <td>
                    <button type="button" class="btn btn-danger remove-item"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    
    const modalContent = `
        <div class="modal active" id="edit-order-modal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>Editar Pedido: ${order.id}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="edit-order-form">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="edit-customer">Cliente</label>
                                <input type="text" id="edit-customer" class="form-control" value="${order.customer}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-date">Fecha</label>
                                <input type="date" id="edit-date" class="form-control" value="${order.date}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Productos</label>
                            <table class="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="order-items-body">
                                    ${currentItems}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" class="text-right"><strong>Total:</strong></td>
                                        <td id="order-total-display">S/${order.total.toFixed(2)}</td>
                                        <td>
                                            <button type="button" class="btn btn-primary" id="add-item">
                                                <i class="fas fa-plus"></i> Añadir
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-status">Estado</label>
                            <select id="edit-status" class="form-control">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En proceso</option>
                                <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completado</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="save-order">Guardar Cambios</button>
                    <button type="button" class="btn close-modal">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Añadir event listeners
    document.querySelectorAll('#edit-order-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Configurar funcionalidad para añadir productos
    document.getElementById('add-item').addEventListener('click', addOrderItemRow);
    
    // Configurar funcionalidad para eliminar productos
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('tr').remove();
            calculateOrderTotal();
        });
    });
    
    // Configurar cambio en la selección de productos
    document.querySelectorAll('.product-select').forEach(select => {
        // Encontrar el producto por nombre (asumiendo que el nombre es único) o por precio
        const row = select.closest('tr');
        const priceCell = row.querySelector('.price');
        const currentPrice = parseFloat(priceCell.textContent.replace('S/', ''));
        
        // Buscar la opción que tenga el mismo precio
        const optionToSelect = Array.from(select.options).find(option => {
            const optionPrice = parseFloat(option.getAttribute('data-price'));
            return optionPrice === currentPrice;
        });
        
        if (optionToSelect) {
            select.value = optionToSelect.value;
        }
        
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value) {
                const price = parseFloat(selectedOption.getAttribute('data-price'));
                const row = this.closest('tr');
                row.querySelector('.price').textContent = `S/${price.toFixed(2)}`;
                
                // Actualizar subtotal
                const quantity = parseInt(row.querySelector('.quantity').value) || 1;
                row.querySelector('.subtotal').textContent = `S/${(quantity * price).toFixed(2)}`;
                calculateOrderTotal();
            }
        });
    });
    
    // Configurar cambio en la cantidad
    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('input', function() {
            const row = this.closest('tr');
            const price = parseFloat(row.querySelector('.price').textContent.replace('S/', ''));
            const quantity = parseInt(this.value) || 1;
            row.querySelector('.subtotal').textContent = `S/${(quantity * price).toFixed(2)}`;
            calculateOrderTotal();
        });
    });
    
    // Guardar los cambios
    document.getElementById('save-order').addEventListener('click', () => {
        saveOrderChanges(order.id);
    });
}

// Función para añadir una nueva fila de producto
function addOrderItemRow() {
    const tbody = document.getElementById('order-items-body');
    const productsOptions = appData.products.map(product => 
        `<option value="${product.id}" data-price="${product.price}">${product.name} - S/${product.price.toFixed(2)}</option>`
    ).join('');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <select class="form-control product-select" required>
                <option value="">Seleccionar producto</option>
                ${productsOptions}
            </select>
        </td>
        <td>
            <input type="number" class="form-control quantity" min="1" value="1" required>
        </td>
        <td class="price">S/0.00</td>
        <td class="subtotal">S/0.00</td>
        <td>
            <button type="button" class="btn btn-danger remove-item"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    tbody.appendChild(row);
    
    // Configurar event listeners para la nueva fila
    row.querySelector('.product-select').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            const price = parseFloat(selectedOption.getAttribute('data-price'));
            row.querySelector('.price').textContent = `S/${price.toFixed(2)}`;
            
            // Actualizar subtotal
            const quantity = parseInt(row.querySelector('.quantity').value) || 1;
            row.querySelector('.subtotal').textContent = `S/${(quantity * price).toFixed(2)}`;
            calculateOrderTotal();
        }
    });
    
    row.querySelector('.quantity').addEventListener('input', function() {
        const price = parseFloat(row.querySelector('.price').textContent.replace('S/', '')) || 0;
        const quantity = parseInt(this.value) || 1;
        row.querySelector('.subtotal').textContent = `S/${(quantity * price).toFixed(2)}`;
        calculateOrderTotal();
    });
    
    row.querySelector('.remove-item').addEventListener('click', function() {
        row.remove();
        calculateOrderTotal();
    });
}

// Función para calcular el total del pedido
function calculateOrderTotal() {
    let total = 0;
    document.querySelectorAll('#order-items-body tr').forEach(row => {
        const subtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('S/', '')) || 0;
        total += subtotal;
    });
    
    document.getElementById('order-total-display').textContent = `S/${total.toFixed(2)}`;
}

// Función para guardar los cambios en un pedido
function saveOrderChanges(orderId) {
    const orderIndex = appData.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    // Recoger los datos del formulario
    const customer = document.getElementById('edit-customer').value;
    const date = document.getElementById('edit-date').value;
    const status = document.getElementById('edit-status').value;
    
    // Recoger los productos
    const items = [];
    document.querySelectorAll('#order-items-body tr').forEach(row => {
        const productId = row.querySelector('.product-select').value;
        const product = appData.products.find(p => p.id === productId);
        const quantity = parseInt(row.querySelector('.quantity').value) || 1;
        const price = parseFloat(row.querySelector('.price').textContent.replace('S/', ''));
        
        if (product) {
            items.push({
                productId: product.id,
                product: product.name,
                quantity: quantity,
                price: price
            });
        }
    });
    
    // Calcular el total
    const total = parseFloat(document.getElementById('order-total-display').textContent.replace('S/', ''));
    
    // Actualizar el pedido
    appData.orders[orderIndex] = {
        ...appData.orders[orderIndex],
        customer,
        date,
        status,
        items,
        total
    };
    
    // Actualizar la tabla de pedidos
    populateOrdersTable();
    closeModal();
    alert('Pedido actualizado con éxito');
}

// Función para mostrar el modal de agregar pedido
function showAddOrderModal() {
    const modalContent = `
        <div class="modal active" id="add-order-modal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>Agregar Nuevo Pedido</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-order-form">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="new-customer">Cliente</label>
                                <select id="new-customer" class="form-control" required>
                                    <option value="">Seleccionar cliente</option>
                                    ${appData.customers.map(customer => 
                                        `<option value="${customer.id}">${customer.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="new-date">Fecha</label>
                                <input type="date" id="new-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Productos</label>
                            <table class="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="new-order-items-body">
                                    <!-- Los productos se añadirán aquí -->
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" class="text-right"><strong>Total:</strong></td>
                                        <td id="new-order-total-display">S/0.00</td>
                                        <td>
                                            <button type="button" class="btn btn-primary" id="add-new-item">
                                                <i class="fas fa-plus"></i> Añadir
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <div class="form-group">
                            <label for="new-status">Estado</label>
                            <select id="new-status" class="form-control">
                                <option value="pending">Pendiente</option>
                                <option value="processing">En proceso</option>
                                <option value="completed">Completado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="create-order">Crear Pedido</button>
                    <button type="button" class="btn close-modal">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Añadir event listeners
    document.querySelectorAll('#add-order-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Añadir la primera fila de producto
    addNewOrderItemRow();
    
    // Configurar botón para añadir más productos
    document.getElementById('add-new-item').addEventListener('click', addNewOrderItemRow);
    
    // Guardar el nuevo pedido
    document.getElementById('create-order').addEventListener('click', createNewOrder);
}

// Función para añadir una nueva fila de producto en el modal de nuevo pedido
function addNewOrderItemRow() {
    const tbody = document.getElementById('new-order-items-body');
    const productsOptions = appData.products.map(product => 
        `<option value="${product.id}" data-price="${product.price}">${product.name} - S/${product.price.toFixed(2)}</option>`
    ).join('');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <select class="form-control product-select" required>
                <option value="">Seleccionar producto</option>
                ${productsOptions}
            </select>
        </td>
        <td>
            <input type="number" class="form-control quantity" min="1" value="1" required>
        </td>
        <td class="price">S/0.00</td>
        <td class="subtotal">S/0.00</td>
        <td>
            <button type="button" class="btn btn-danger remove-item"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    tbody.appendChild(row);
    
    // Configurar event listeners para la nueva fila
    row.querySelector('.product-select').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            const price = parseFloat(selectedOption.getAttribute('data-price'));
            row.querySelector('.price').textContent = `S/${price.toFixed(2)}`;
            
            // Actualizar subtotal
            const quantity = parseInt(row.querySelector('.quantity').value) || 1;
            row.querySelector('.subtotal').textContent = `S/${(quantity * price).toFixed(2)}`;
            calculateNewOrderTotal();
        } else {
            // Resetear valores si no hay selección
            row.querySelector('.price').textContent = 'S/0.00';
            row.querySelector('.subtotal').textContent = 'S/0.00';
        }
    });
    
    row.querySelector('.quantity').addEventListener('input', function() {
        const price = parseFloat(row.querySelector('.price').textContent.replace('S/', '')) || 0;
        const quantity = parseInt(this.value) || 1;
        row.querySelector('.subtotal').textContent = `S/${(quantity * price).toFixed(2)}`;
        calculateNewOrderTotal();
    });
    
    row.querySelector('.remove-item').addEventListener('click', function() {
        row.remove();
        calculateNewOrderTotal();
    });
}

// Función para calcular el total del nuevo pedido
function calculateNewOrderTotal() {
    let total = 0;
    document.querySelectorAll('#new-order-items-body tr').forEach(row => {
        const subtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('S/', '')) || 0;
        total += subtotal;
    });
    
    document.getElementById('new-order-total-display').textContent = `S/${total.toFixed(2)}`;
}

// Función para crear un nuevo pedido
function createNewOrder() {
    // Recoger los datos del formulario
    const customerId = document.getElementById('new-customer').value;
    const customer = appData.customers.find(c => c.id == customerId)?.name || 'Cliente Nuevo';
    const date = document.getElementById('new-date').value;
    const status = document.getElementById('new-status').value;
    
    // Recoger los productos
    const items = [];
    let hasValidProducts = false;
    document.querySelectorAll('#new-order-items-body tr').forEach(row => {
        const productId = row.querySelector('.product-select').value;
        const product = appData.products.find(p => p.id == productId);
        const quantity = parseInt(row.querySelector('.quantity').value) || 1;
        const price = parseFloat(row.querySelector('.price').textContent.replace('S/', ''));
        
        if (product && productId) { // Verificar que haya un producto válido
            items.push({
                productId: product.id,
                product: product.name,
                quantity: quantity,
                price: price
            });
            hasValidProducts = true;
        }
    });
    
    // Validar que hay al menos un producto
    if (!hasValidProducts) {
        alert('Debe agregar al menos un producto válido al pedido');
        return;
    }
    
    // Calcular el total
    const total = parseFloat(document.getElementById('new-order-total-display').textContent.replace('S/', ''));
    
    // Crear el nuevo pedido
    const newOrder = {
        id: `ORD-${Date.now().toString().substr(-6)}`,
        customer,
        customerId,
        date,
        status,
        items,
        total
    };
    
    // Agregar el pedido a los datos
    appData.orders.push(newOrder);
    
    // Actualizar la tabla de pedidos
    populateOrdersTable();
    closeModal();
    alert('Pedido creado con éxito');
}

// Función para filtrar pedidos
function filterOrders() {
    const status = orderStatusFilter.value;
    const date = orderDateFilter.value;
    
    let filteredOrders = appData.orders;
    
    // Filtrar por estado
    if (status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    // Filtrar por fecha
    if (date) {
        filteredOrders = filteredOrders.filter(order => order.date === date);
    }
    
    // Repoblar la tabla con los pedidos filtrados
    populateOrdersTable(filteredOrders);
}

// Función para cerrar modales
function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// Inicialización al cargar
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar si estamos en la página de pedidos
    if (document.getElementById('orders-page')?.classList.contains('active')) {
        initOrdersPage();
    }
    
    // Evento para el menú de pedidos
    document.querySelector('.menu-item[data-page="orders"]')?.addEventListener('click', function() {
        setTimeout(initOrdersPage, 300);
    });
});