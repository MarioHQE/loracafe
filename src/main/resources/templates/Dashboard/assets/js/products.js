// Add Product Button
const addProductBtn = document.getElementById('add-product-btn');
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        showProductModal();
    });
}

// Product Search
const productSearch = document.getElementById('product-search');
if (productSearch) {
    productSearch.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });
}

// Show product modal
function showProductModal(product = null) {
    const isEditMode = product !== null;
    
    const modalContent = `
        <div class="modal active" id="product-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="product-form">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="product-name">Nombre del Producto</label>
                                <input type="text" id="product-name" class="form-control" 
                                    value="${isEditMode ? product.name : ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="product-category">Categoría</label>
                                <select id="product-category" class="form-control" required>
                                    <option value="">Seleccionar categoría</option>
                                    <option value="bebidas" ${isEditMode && product.category === 'bebidas' ? 'selected' : ''}>Bebidas</option>
                                    <option value="postres" ${isEditMode && product.category === 'postres' ? 'selected' : ''}>Postres</option>
                                    <option value="comidas" ${isEditMode && product.category === 'comidas' ? 'selected' : ''}>Comidas Ligeras</option>
                                    <option value="otros" ${isEditMode && product.category === 'otros' ? 'selected' : ''}>Otros</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="product-description">Descripción</label>
                            <textarea id="product-description" class="form-control" rows="3" required>${isEditMode ? product.description : ''}</textarea>
                        </div>
                        
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="product-price">Precio (S/)</label>
                                <input type="number" id="product-price" class="form-control" 
                                    step="0.01" min="0" value="${isEditMode ? product.price : ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="product-stock">Stock</label>
                                <input type="number" id="product-stock" class="form-control" 
                                    min="0" value="${isEditMode ? product.stock : ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="product-image">Imagen del Producto</label>
                                <input type="file" id="product-image" class="form-control">
                                ${isEditMode ? `<img src="${product.image}" class="preview-image" alt="Preview">` : ''}
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="save-product">
                        ${isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                    <button type="button" class="btn close-modal">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Add event listeners
    document.querySelector('#product-modal .close-modal').addEventListener('click', closeModal);
    document.querySelectorAll('#product-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.getElementById('save-product').addEventListener('click', () => {
        saveProduct(isEditMode, product ? product.id : null);
    });
    
    // Image preview
    const imageInput = document.getElementById('product-image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.querySelector('.preview-image');
                    if (preview) {
                        preview.src = e.target.result;
                    } else {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.classList.add('preview-image');
                        this.parentNode.appendChild(img);
                    }
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// Close modal
function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// Save product
function saveProduct(isEdit, productId) {
    // In a real app, this would send data to the server
    // For demo, we'll just update the local data
    
    const productData = {
        id: isEdit ? productId : Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        image: document.querySelector('.preview-image') ? document.querySelector('.preview-image').src : 'https://via.placeholder.com/200'
    };
    
    if (isEdit) {
        // Update existing product
        const index = appData.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            appData.products[index] = productData;
        }
    } else {
        // Add new product
        appData.products.push(productData);
    }
    
    // Update table
    populateProductsTable();
    
    // Close modal
    closeModal();
    
    // Show success message
    alert(`Producto ${isEdit ? 'actualizado' : 'agregado'} con éxito!`);
}

// Populate products table
function populateProductsTable() {
    const tableBody = document.querySelector('#products-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    appData.products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.description}</td>
            <td>S/${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('#products-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'));
            const product = appData.products.find(p => p.id === productId);
            if (product) {
                showProductModal(product);
            }
        });
    });
    
    document.querySelectorAll('#products-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'));
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                appData.products = appData.products.filter(p => p.id !== productId);
                populateProductsTable();
                alert('Producto eliminado con éxito');
            }
        });
    });
}

// Filter products
function filterProducts(searchTerm) {
    const filtered = appData.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '';
    
    filtered.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.description}</td>
            <td>S/${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Reattach event listeners
    document.querySelectorAll('#products-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'));
            const product = appData.products.find(p => p.id === productId);
            if (product) {
                showProductModal(product);
            }
        });
    });
    
    document.querySelectorAll('#products-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'));
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                appData.products = appData.products.filter(p => p.id !== productId);
                populateProductsTable();
                alert('Producto eliminado con éxito');
            }
        });
    });
}