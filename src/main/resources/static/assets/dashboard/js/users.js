// users.js

const API_URL_USERS = '/api/dashboard/users';

function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('users-page')?.classList.contains('active')) {
        populateUsersTable();
        document.getElementById('add-user-btn')?.addEventListener('click', () => showUserModal());
        document.getElementById('user-search')?.addEventListener('input', (e) => populateUsersTable(e.target.value));
    }
});

function populateUsersTable(searchTerm = '') {
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando usuarios...</td></tr>';

    const url = searchTerm ? `${API_URL_USERS}/search?term=${encodeURIComponent(searchTerm)}` : API_URL_USERS;

    fetch(url)
        .then(res => res.json())
        .then(users => {
            tableBody.innerHTML = '';
            if (users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron usuarios.</td></tr>';
                return;
            }
            users.forEach(user => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${user.nombre} ${user.apellido}</td>
                    <td>${user.email}</td>
                    <td><span class="role-badge role-${user.rol.toLowerCase()}">${user.rol}</span></td>
                    <td>${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                    <td><span class="status ${user.activo ? 'completed' : 'cancelled'}">${user.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                        <button class="action-btn edit" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </td>`;
            });
            attachUserActionListeners();
        })
        .catch(err => {
            console.error('Error al cargar usuarios:', err);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error al cargar los usuarios.</td></tr>';
        });
}

function attachUserActionListeners() {
    document.querySelectorAll('#users-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', async e => {
            const userId = e.currentTarget.dataset.id;
            const response = await fetch(`${API_URL_USERS}/${userId}`);
            if (response.ok) {
                const user = await response.json();
                showUserModal(user);
            } else { alert('No se pudo cargar el usuario para editar.'); }
        });
    });

    document.querySelectorAll('#users-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', e => {
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                deleteUser(e.currentTarget.dataset.id);
            }
        });
    });
}

function deleteUser(id) {
    const csrf = getCsrfToken();
    fetch(`${API_URL_USERS}/${id}`, {
        method: 'DELETE',
        headers: { [csrf.header]: csrf.token }
    }).then(response => {
        if (response.ok) {
            alert('Usuario eliminado con éxito.');
            populateUsersTable();
        } else { throw new Error('No se pudo eliminar el usuario.'); }
    }).catch(error => {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario.');
    });
}

function showUserModal(user = null) {
    const isEditMode = user !== null;
    const rolOptions = ['ADMIN', 'STAFF', 'CLIENTE'].map(rol => `<option value="${rol}" ${isEditMode && user.rol === rol ? 'selected' : ''}>${rol}</option>`).join('');
    const statusOptions = [{ v: true, t: 'Activo' }, { v: false, t: 'Inactivo' }].map(s => `<option value="${s.v}" ${isEditMode && user.activo === s.v ? 'selected' : ''}>${s.t}</option>`).join('');

    const modalContent = `
        <div class="modal active" id="user-modal">
            <div class="modal-content">
                <div class="modal-header"><h3>${isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h3><button class="close-modal" onclick="closeModal()">×</button></div>
                <div class="modal-body">
                    <form id="user-form">
                        <input type="hidden" id="user-id" value="${isEditMode ? user.id : ''}">
                        <div class="grid-2">
                            <div class="form-group"><label>Nombre</label><input type="text" id="user-nombre" class="form-control" value="${isEditMode ? user.nombre : ''}" required></div>
                            <div class="form-group"><label>Apellido</label><input type="text" id="user-apellido" class="form-control" value="${isEditMode ? user.apellido : ''}" required></div>
                        </div>
                        <div class="form-group"><label>Email</label><input type="email" id="user-email" class="form-control" value="${isEditMode ? user.email : ''}" required></div>
                        <div class="form-group"><label>Contraseña</label><input type="password" id="user-password" class="form-control" ${isEditMode ? 'placeholder="Dejar en blanco para no cambiar"' : 'required'}></div>
                        <div class="grid-2">
                            <div class="form-group"><label>Rol</label><select id="user-rol" class="form-control" required>${rolOptions}</select></div>
                            <div class="form-group"><label>Estado</label><select id="user-activo" class="form-control" required>${statusOptions}</select></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer"><button type="button" class="btn" onclick="closeModal()">Cancelar</button><button type="button" class="btn btn-primary" id="save-user-btn">${isEditMode ? 'Actualizar' : 'Guardar'}</button></div>
            </div>
        </div>`;

    document.getElementById('modal-container').innerHTML = modalContent;
    document.getElementById('save-user-btn').addEventListener('click', saveUser);
}

function saveUser() {
    const id = document.getElementById('user-id').value;
    const isEditMode = id !== '';
    const userData = {
        nombre: document.getElementById('user-nombre').value,
        apellido: document.getElementById('user-apellido').value,
        email: document.getElementById('user-email').value,
        rol: document.getElementById('user-rol').value,
        activo: document.getElementById('user-activo').value === 'true'
    };
    const password = document.getElementById('user-password').value;
    if (password) {
        userData.password = password;
    }
    if (!isEditMode && !password) {
        alert('La contraseña es requerida para nuevos usuarios.');
        return;
    }

    const csrf = getCsrfToken();
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `${API_URL_USERS}/${id}` : API_URL_USERS;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', [csrf.header]: csrf.token },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) return response.json();
        return response.json().then(error => { throw new Error(error.message || 'Error al guardar.') });
    })
    .then(() => {
        alert(`Usuario ${isEditMode ? 'actualizado' : 'creado'} con éxito.`);
        closeModal();
        populateUsersTable();
    })
    .catch(error => {
        console.error('Error al guardar usuario:', error);
        alert(`Ocurrió un error: ${error.message}`);
    });
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}