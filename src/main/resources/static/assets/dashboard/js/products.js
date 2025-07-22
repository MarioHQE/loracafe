// products.js

const API_URL = '/api/dashboard/products';
const CATEGORIES_API_URL = '/api/dashboard/categories';
let categoriasCache = [];

/**
 * Obtiene el token y el header CSRF desde las metaetiquetas del HTML.
 */
function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-page')?.classList.contains('active')) {
        populateProductsTable();
        document.getElementById('add-product-btn')?.addEventListener('click', () => showProductModal());
        document.getElementById('product-search')?.addEventListener('input', (e) => populateProductsTable(e.target.value));
    }
});

/**
 * Carga y muestra los productos en la tabla, consumiendo el DTO del backend.
 */
function populateProductsTable(searchTerm = '') {
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando productos...</td></tr>';

    // La búsqueda requiere un endpoint específico, que por ahora no implementaremos en el DTO.
    // Para simplificar, la búsqueda se hará sobre la lista completa.
    const url = API_URL; // Siempre pedimos la lista completa

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('No se pudieron cargar los productos.');
            return res.json();
        })
        .then(products => {
            tableBody.innerHTML = '';
            
            // Filtramos en el frontend si hay un término de búsqueda
            const filteredProducts = searchTerm
                ? products.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                : products;

            if (filteredProducts.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron productos.</td></tr>';
                return;
            }
            
            filteredProducts.forEach(product => {
                const row = tableBody.insertRow();
                // ¡¡CAMBIO IMPORTANTE!! Usamos los campos del DTO.
                row.innerHTML = `
                    <td><img src="${product.imagenUrl || 'https://via.placeholder.com/80'}" alt="${product.nombre}" class="product-image"></td>
                    <td>${product.nombre}</td>
                    <td>${product.categoriaNombre}</td> 
                    <td>${product.descripcion}</td>
                    <td>S/ ${product.precio.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button class="action-btn edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                    </td>`;
            });
            attachActionListeners();
        })
        .catch(err => {
            console.error('Error al cargar productos:', err);
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Error al cargar los productos.</td></tr>';
        });
}

function attachActionListeners() {
    document.querySelectorAll('#products-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            // Para editar, necesitamos la entidad completa, no el DTO.
            const response = await fetch(`${API_URL}/${id}`); // Usamos el endpoint que devuelve la entidad
            if (response.ok) {
                const product = await response.json();
                showProductModal(product);
            } else { alert('No se pudo cargar el producto para editar.'); }
        });
    });

    document.querySelectorAll('#products-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                deleteProduct(e.currentTarget.dataset.id);
            }
        });
    });
}

function deleteProduct(id) {
    const csrf = getCsrfToken();
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { [csrf.header]: csrf.token }
    }).then(response => {
        if (response.ok) {
            alert('Producto eliminado con éxito.');
            populateProductsTable();
        } else { throw new Error('No se pudo eliminar el producto.'); }
    }).catch(err => alert(err.message));
}

async function showProductModal(product = null) {
    const isEditMode = product !== null;
    await loadCategoriesIntoCache();
    const categoryOptions = categoriasCache.map(cat => `<option value="${cat.id}" ${isEditMode && product.categoria && product.categoria.id === cat.id ? 'selected' : ''}>${cat.nombre}</option>`).join('');

    const modalContent = `
        <div class="modal active" id="product-modal"><div class="modal-content">
            <div class="modal-header"><h3>${isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h3><button class="close-modal" onclick="closeModal()">×</button></div>
            <div class="modal-body">
                <form id="product-form">
                    <input type="hidden" id="product-id" value="${isEditMode ? product.id : ''}">
                    <div class="grid-2">
                        <div class="form-group"><label>Nombre</label><input type="text" id="product-name" class="form-control" value="${isEditMode ? product.nombre : ''}" required></div>
                        <div class="form-group"><label>Categoría</label><select id="product-category" class="form-control" required><option value="">Seleccionar</option>${categoryOptions}</select></div>
                    </div>
                    <div class="form-group"><label>Descripción</label><textarea id="product-description" class="form-control" rows="3" required>${isEditMode ? product.descripcion : ''}</textarea></div>
                    <div class="grid-2">
                         <div class="form-group"><label>Precio (S/)</label><input type="number" id="product-price" class="form-control" step="0.01" min="0" value="${isEditMode ? product.precio : ''}" required></div>
                         <div class="form-group"><label>Stock</label><input type="number" id="product-stock" class="form-control" min="0" value="${isEditMode ? product.stock : ''}" required></div>
                    </div>
                    <div class="form-group"><label>URL de Imagen</label><input type="text" id="product-image-url" class="form-control" value="${isEditMode && product.imagenUrl ? product.imagenUrl : ''}"></div>
                </form>
            </div>
            <div class="modal-footer"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" id="save-product-btn">${isEditMode ? 'Actualizar' : 'Guardar'}</button></div>
        </div></div>`;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    document.getElementById('save-product-btn').addEventListener('click', saveProduct);
}

async function loadCategoriesIntoCache() {
    if (categoriasCache.length === 0) {
        try {
            const response = await fetch(CATEGORIES_API_URL);
            if (!response.ok) throw new Error('Error al cargar categorías');
            categoriasCache = await response.json();
        } catch (error) {
            console.error(error);
            alert('No se pudieron cargar las categorías.');
        }
    }
}

function saveProduct() {
    const id = document.getElementById('product-id').value;
    const isEditMode = id !== '';
    const productData = {
        nombre: document.getElementById('product-name').value,
        descripcion: document.getElementById('product-description').value,
        precio: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        imagenUrl: document.getElementById('product-image-url').value,
        categoria: { id: parseInt(document.getElementById('product-category').value) }
    };

    if (!productData.nombre || !productData.precio || !productData.stock || !productData.categoria.id) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }

    const csrf = getCsrfToken();
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', [csrf.header]: csrf.token },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error al guardar.`);
        return response.json();
    })
    .then(() => {
        alert(`Producto ${isEditMode ? 'actualizado' : 'creado'} con éxito.`);
        closeModal();
        populateProductsTable();
    })
    .catch(error => alert(error.message));
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}