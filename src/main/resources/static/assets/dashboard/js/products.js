// products.js

// Variable global para almacenar las categorías y evitar cargarlas cada vez que se abre el modal.
let categoriasCache = [];
const API_URL = '/api/products';
const CATEGORIES_API_URL = '/api/categories';

// ==================== INICIALIZACIÓN ====================
// Se ejecuta cuando el DOM está completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Si la página de productos es la que está activa al cargar...
    if (document.getElementById('products-page')?.classList.contains('active')) {
        populateProductsTable();
        setupEventListeners();
    }
});

// Función para configurar todos los event listeners de la página de productos.
function setupEventListeners() {
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => showProductModal());
    }

    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        // Usamos 'input' para buscar mientras se escribe.
        productSearch.addEventListener('input', (e) => {
            populateProductsTable(e.target.value);
        });
    }
}

// ==================== LÓGICA DE DATOS (API) ====================

/**
 * Rellena la tabla de productos, opcionalmente filtrando por un término de búsqueda.
 * @param {string} searchTerm - El término para buscar en los nombres de productos.
 */
function populateProductsTable(searchTerm = '') {
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando productos...</td></tr>';

    // Si hay un término de búsqueda, ajustamos la URL.
    // NOTA: Esto requiere un endpoint en el backend: /api/products/search?term=...
    const url = searchTerm 
        ? `${API_URL}/search?term=${encodeURIComponent(searchTerm)}` 
        : API_URL;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir nuevos datos.
            if (products.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron productos.</td></tr>';
                return;
            }
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${product.imagenUrl || 'https://via.placeholder.com/80'}" alt="${product.nombre}" class="product-image"></td>
                    <td>${product.nombre}</td>
                    <td>${product.categoria ? product.categoria.nombre : 'N/A'}</td>
                    <td>${product.descripcion}</td>
                    <td>S/ ${product.precio.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button class="action-btn edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            // Una vez que los botones están en el DOM, les añadimos sus listeners.
            attachActionListeners();
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Error al cargar los productos. Intente de nuevo más tarde.</td></tr>';
        });
}

/**
 * Añade los event listeners a los botones de "editar" y "eliminar" de la tabla.
 */
function attachActionListeners() {
    // Listeners para botones de editar
    document.querySelectorAll('#products-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const productId = e.currentTarget.getAttribute('data-id');
            try {
                const response = await fetch(`${API_URL}/${productId}`);
                if (!response.ok) throw new Error('Producto no encontrado');
                const product = await response.json();
                showProductModal(product);
            } catch (error) {
                console.error('Error al obtener producto para editar:', error);
                alert('No se pudo cargar el producto para editar.');
            }
        });
    });

    // Listeners para botones de eliminar
    document.querySelectorAll('#products-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.getAttribute('data-id');
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                deleteProduct(productId);
            }
        });
    });
}

/**
 * Elimina un producto llamando a la API.
 * @param {number} id - El ID del producto a eliminar.
 */
function deleteProduct(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Producto eliminado con éxito.');
                populateProductsTable(); // Recargar la tabla
            } else {
                throw new Error('No se pudo eliminar el producto.');
            }
        })
        .catch(error => {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar el producto.');
        });
}


// ==================== LÓGICA DEL MODAL (FORMULARIO) ====================

/**
 * Muestra el modal para crear o editar un producto.
 * @param {object|null} product - El objeto del producto a editar, o null para crear uno nuevo.
 */
async function showProductModal(product = null) {
    const isEditMode = product !== null;

    // Cargar categorías antes de mostrar el modal.
    await loadCategoriesIntoCache();

    const categoryOptions = categoriasCache.map(cat => 
        `<option value="${cat.id}" ${isEditMode && product.categoria && product.categoria.id === cat.id ? 'selected' : ''}>
            ${cat.nombre}
        </option>`
    ).join('');

    const modalContent = `
        <div class="modal active" id="product-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
                    <button class="close-modal" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <form id="product-form">
                        <input type="hidden" id="product-id" value="${isEditMode ? product.id : ''}">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="product-name">Nombre</label>
                                <input type="text" id="product-name" class="form-control" value="${isEditMode ? product.nombre : ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="product-category">Categoría</label>
                                <select id="product-category" class="form-control" required>
                                    <option value="">Seleccionar categoría</option>
                                    ${categoryOptions}
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="product-description">Descripción</label>
                            <textarea id="product-description" class="form-control" rows="3" required>${isEditMode ? product.descripcion : ''}</textarea>
                        </div>
                        <div class="grid-2">
                             <div class="form-group">
                                <label for="product-price">Precio (S/)</label>
                                <input type="number" id="product-price" class="form-control" step="0.01" min="0" value="${isEditMode ? product.precio : ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="product-stock">Stock</label>
                                <input type="number" id="product-stock" class="form-control" min="0" value="${isEditMode ? product.stock : ''}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="product-image-url">URL de la Imagen</label>
                            <input type="text" id="product-image-url" class="form-control" value="${isEditMode && product.imagenUrl ? product.imagenUrl : ''}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" onclick="closeModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="save-product-btn">
                        ${isEditMode ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Añadir listener al botón de guardar del modal
    document.getElementById('save-product-btn').addEventListener('click', saveProduct);
}

/**
 * Carga las categorías desde la API y las guarda en caché si aún no se han cargado.
 */
async function loadCategoriesIntoCache() {
    if (categoriasCache.length === 0) {
        try {
            const response = await fetch(CATEGORIES_API_URL);
            if (!response.ok) throw new Error('Error al cargar categorías');
            categoriasCache = await response.json();
        } catch (error) {
            console.error(error);
            alert('No se pudieron cargar las categorías para el formulario.');
        }
    }
}

/**
 * Recoge los datos del formulario y los envía a la API para crear o actualizar un producto.
 */
function saveProduct() {
    const id = document.getElementById('product-id').value;
    const isEditMode = id !== '';

    // Construir el objeto del producto con los datos del formulario.
    const productData = {
        nombre: document.getElementById('product-name').value,
        descripcion: document.getElementById('product-description').value,
        precio: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        imagenUrl: document.getElementById('product-image-url').value,
        // Para la categoría, enviamos un objeto solo con el ID. Spring Boot lo asociará correctamente.
        categoria: {
            id: parseInt(document.getElementById('product-category').value)
        }
    };
    
    // Validaciones básicas
    if (!productData.nombre || !productData.precio || !productData.stock || !productData.categoria.id) {
        alert('Por favor, complete todos los campos requeridos (Nombre, Precio, Stock, Categoría).');
        return;
    }

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            // Podríamos leer el cuerpo del error para un mensaje más específico.
            throw new Error(`Error al guardar el producto. Estado: ${response.status}`);
        }
    })
    .then(() => {
        alert(`Producto ${isEditMode ? 'actualizado' : 'creado'} con éxito.`);
        closeModal();
        populateProductsTable(); // Recargar la tabla para mostrar los cambios.
    })
    .catch(error => {
        console.error('Error al guardar el producto:', error);
        alert('Ocurrió un error al guardar el producto.');
    });
}

/**
 * Cierra cualquier modal que esté abierto.
 */
function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}