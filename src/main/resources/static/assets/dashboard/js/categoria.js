// categoria.js

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('categories-page')) {
        setupCategoryModal();
        loadCategories();
    }
});

function getCsrfHeaders() {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    return { [csrfHeader]: csrfToken };
}

const CATEGORY_API_BASE = '/api/dashboard/categories';

async function loadCategories() {
    const table = document.getElementById('categories-table').querySelector('tbody');
    table.innerHTML = '';
    try {
        const res = await fetch(CATEGORY_API_BASE);
        if (!res.ok) throw new Error('No se pudieron cargar las categorías');
        const categorias = await res.json();
        categorias.forEach(cat => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', cat.id);
            tr.innerHTML = `
                <td style="display:none;">${cat.id}</td>
                <td>${cat.nombre}</td>
                <td>${cat.descripcion || ''}</td>
                <td>${cat.imagenUrl ? `<img src="${cat.imagenUrl}" alt="img" style="width:40px;height:40px;object-fit:cover;">` : ''}</td>
                <td>${cat.activa ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-category-btn">Editar</button>
                    <button class="btn btn-sm btn-danger delete-category-btn">Eliminar</button>
                </td>
            `;
            table.appendChild(tr);
        });
        attachCategoryActionListeners();
    } catch (err) {
        table.innerHTML = `<tr><td colspan="6">${err.message}</td></tr>`;
    }
}

function attachCategoryActionListeners() {
    document.querySelectorAll('.edit-category-btn').forEach(btn => {
        btn.onclick = function() {
            const tr = this.closest('tr');
            const id = tr.getAttribute('data-id');
            const nombre = tr.children[1].textContent;
            const descripcion = tr.children[2].textContent;
            const imagenUrl = tr.children[3].querySelector('img') ? tr.children[3].querySelector('img').src : '';
            const activa = tr.children[4].textContent.trim() === 'Sí';
            // Llenar el modal
            document.getElementById('category-id').value = id;
            document.getElementById('category-nombre').value = nombre;
            document.getElementById('category-descripcion').value = descripcion;
            document.getElementById('category-imagenUrl').value = imagenUrl;
            document.getElementById('category-activa').checked = activa;
            document.getElementById('category-modal').style.display = 'block';
            document.getElementById('category-form-message').textContent = '';
        };
    });
    document.querySelectorAll('.delete-category-btn').forEach(btn => {
        btn.onclick = async function() {
            const tr = this.closest('tr');
            const id = tr.getAttribute('data-id');
            if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
                try {
                    const res = await fetch(`${CATEGORY_API_BASE}/${id}`, {
                        method: 'DELETE',
                        headers: { ...getCsrfHeaders() }
                    });
                    if (!res.ok) throw new Error('Error al eliminar la categoría');
                    loadCategories();
                } catch (err) {
                    alert(err.message);
                }
            }
        };
    });
}

function setupCategoryModal() {
    const modal = document.getElementById('category-modal');
    const openBtn = document.getElementById('add-category-btn');
    const closeBtn = document.getElementById('close-category-modal');
    const form = document.getElementById('category-form');
    const message = document.getElementById('category-form-message');

    openBtn.onclick = () => {
        form.reset();
        document.getElementById('category-id').value = '';
        modal.style.display = 'block';
        message.textContent = '';
    };
    closeBtn.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('category-id').value;
        const data = {
            nombre: form['nombre'].value,
            descripcion: form['descripcion'].value,
            imagenUrl: form['imagenUrl'].value,
            activa: form['activa'].checked
        };
        try {
            let res;
            if (id) {
                res = await fetch(`${CATEGORY_API_BASE}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
                    body: JSON.stringify(data)
                });
            } else {
                res = await fetch(CATEGORY_API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
                    body: JSON.stringify(data)
                });
            }
            if (!res.ok) throw new Error('Error al guardar la categoría');
            form.reset();
            modal.style.display = 'none';
            loadCategories();
        } catch (err) {
            message.textContent = err.message;
        }
    };
} 