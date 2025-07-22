// promotions.js

const API_URL_PROMOTIONS = '/api/dashboard/promotions';
const API_URL_PRODUCTS = '/api/dashboard/products'; // Necesitamos la API de productos

function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('promotions-page')?.classList.contains('active')) {
        populatePromotionsTable();
        document.getElementById('add-promotion-btn')?.addEventListener('click', () => showPromotionModal());
    }
});

function populatePromotionsTable() {
    const tableBody = document.querySelector('#promotions-table tbody');
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando promociones...</td></tr>';

    fetch(API_URL_PROMOTIONS)
        .then(res => res.json())
        .then(promotions => {
            tableBody.innerHTML = '';
            if (promotions.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay promociones creadas.</td></tr>';
                return;
            }
            promotions.forEach(promo => {
                const row = tableBody.insertRow();
                const vigencia = `${new Date(promo.fechaInicio).toLocaleDateString()} - ${new Date(promo.fechaFin).toLocaleDateString()}`;
                const descuento = promo.tipo === 'PORCENTAJE' ? `${promo.descuento}%` : `S/ ${promo.descuento.toFixed(2)}`;
                
                row.innerHTML = `
                    <td>${promo.nombre}</td>
                    <td>${promo.descripcion}</td>
                    <td>${descuento}</td>
                    <td>${vigencia}</td>
                    <td><span class="status ${promo.activa ? 'completed' : 'cancelled'}">${promo.activa ? 'Activa' : 'Inactiva'}</span></td>
                    <td>
                        <button class="action-btn edit" data-id="${promo.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${promo.id}"><i class="fas fa-trash"></i></button>
                    </td>`;
            });
            attachPromotionActionListeners();
        });
}

function attachPromotionActionListeners() {
    document.querySelectorAll('#promotions-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', async e => {
            const id = e.currentTarget.dataset.id;
            const response = await fetch(`${API_URL_PROMOTIONS}/${id}`);
            if (response.ok) {
                const promoToEdit = await response.json();
                showPromotionModal(promoToEdit);
            } else {
                alert("No se pudo cargar la promoción para editar.");
            }
        });
    });

    document.querySelectorAll('#promotions-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', e => {
            if (confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
                deletePromotion(e.currentTarget.dataset.id);
            }
        });
    });
}

function deletePromotion(id) {
    const csrf = getCsrfToken();
    fetch(`${API_URL_PROMOTIONS}/${id}`, {
        method: 'DELETE',
        headers: { [csrf.header]: csrf.token }
    }).then(response => {
        if (response.ok) {
            alert('Promoción eliminada con éxito.');
            populatePromotionsTable();
        } else { throw new Error('No se pudo eliminar la promoción.'); }
    }).catch(error => alert(error.message));
}

async function showPromotionModal(promo = null) {
    const isEditMode = promo !== null;
    
    // 1. Cargar todos los productos para mostrarlos como opciones
    let allProducts = [];
    try {
        const productResponse = await fetch(API_URL_PRODUCTS);
        allProducts = await productResponse.json();
    } catch (e) {
        alert("No se pudieron cargar los productos para asociar a la promoción.");
        return;
    }

    // 2. Crear la lista de checkboxes de productos
    const productIdsInPromo = isEditMode && promo.productos ? promo.productos.map(p => p.id) : [];
    const productOptions = allProducts.map(p => `
        <div class="product-checklist-item">
            <input type="checkbox" id="prod-${p.id}" name="productos" value="${p.id}" ${productIdsInPromo.includes(p.id) ? 'checked' : ''}>
            <label for="prod-${p.id}">${p.nombre}</label>
        </div>
    `).join('');

    const formatDateForInput = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

    const modalContent = `
        <div class="modal active" id="promotion-modal"><div class="modal-content">
            <div class="modal-header"><h3>${isEditMode ? 'Editar Promoción' : 'Nueva Promoción'}</h3><button class="close-modal" onclick="closeModal()">×</button></div>
            <div class="modal-body">
                <form id="promotion-form">
                    <input type="hidden" id="promo-id" value="${isEditMode ? promo.id : ''}">
                    <div class="form-group"><label>Nombre</label><input type="text" id="promo-nombre" class="form-control" value="${isEditMode ? promo.nombre : ''}" required></div>
                    <div class="form-group"><label>Descripción</label><textarea id="promo-descripcion" class="form-control" rows="3">${isEditMode ? promo.descripcion : ''}</textarea></div>
                    <div class="form-group"><label>URL de Imagen (para la promo)</label><input type="text" id="promo-imagenUrl" class="form-control" value="${isEditMode ? promo.imagenUrl || '' : ''}"></div>
                    <div class="grid-2">
                        <div class="form-group"><label>Tipo</label><select id="promo-tipo" class="form-control"><option value="PORCENTAJE" ${isEditMode && promo.tipo === 'PORCENTAJE' ? 'selected' : ''}>Porcentaje (%)</option><option value="MONTO_FIJO" ${isEditMode && promo.tipo === 'MONTO_FIJO' ? 'selected' : ''}>Precio Fijo (S/)</option></select></div>
                        <div class="form-group"><label>Valor</label><input type="number" id="promo-descuento" class="form-control" step="0.01" min="0" value="${isEditMode ? promo.descuento : ''}" required></div>
                    </div>
                    <div class="grid-2">
                        <div class="form-group"><label>Inicio</label><input type="date" id="promo-inicio" class="form-control" value="${isEditMode ? formatDateForInput(promo.fechaInicio) : ''}" required></div>
                        <div class="form-group"><label>Fin</label><input type="date" id="promo-fin" class="form-control" value="${isEditMode ? formatDateForInput(promo.fechaFin) : ''}" required></div>
                    </div>
                    <div class="form-group"><label>Estado</label><select id="promo-activa" class="form-control"><option value="true" ${isEditMode && promo.activa ? 'selected' : ''}>Activa</option><option value="false" ${isEditMode && !promo.activa ? 'selected' : ''}>Inactiva</option></select></div>
                    <div class="form-group"><label>Productos en Promoción</label><div class="product-checklist">${productOptions}</div></div>
                </form>
            </div>
            <div class="modal-footer"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" id="save-promo-btn">${isEditMode ? 'Actualizar' : 'Guardar'}</button></div>
        </div></div>`;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    document.getElementById('save-promo-btn').addEventListener('click', savePromotion);
}

function savePromotion() {
    const id = document.getElementById('promo-id').value;
    const isEditMode = id !== '';

    const fechaFin = new Date(document.getElementById('promo-fin').value);
    fechaFin.setHours(23, 59, 59);

    const selectedProducts = [];
    document.querySelectorAll('input[name="productos"]:checked').forEach(checkbox => {
        selectedProducts.push({ id: parseInt(checkbox.value) });
    });

    const promoData = {
        nombre: document.getElementById('promo-nombre').value,
        descripcion: document.getElementById('promo-descripcion').value,
        imagenUrl: document.getElementById('promo-imagenUrl').value,
        tipo: document.getElementById('promo-tipo').value,
        descuento: parseFloat(document.getElementById('promo-descuento').value),
        fechaInicio: new Date(document.getElementById('promo-inicio').value).toISOString(),
        fechaFin: fechaFin.toISOString(),
        activa: document.getElementById('promo-activa').value === 'true',
        productos: selectedProducts
    };

    if (!promoData.nombre || !promoData.descuento) {
        alert('Nombre y Valor son campos obligatorios.');
        return;
    }

    const csrf = getCsrfToken();
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `${API_URL_PROMOTIONS}/${id}` : API_URL_PROMOTIONS;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', [csrf.header]: csrf.token },
        body: JSON.stringify(promoData)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error al guardar la promoción.`);
        return response.json();
    })
    .then(() => {
        alert(`Promoción ${isEditMode ? 'actualizada' : 'creada'} con éxito.`);
        closeModal();
        populatePromotionsTable();
    })
    .catch(error => alert(error.message));
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}