
const API_URL_USERS = '/api/users';

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('users-page')?.classList.contains('active')) {
        populateUsersTable();
        setupUsersEventListeners();
    }
});

function setupUsersEventListeners() {
    const addUserBtn = document.getElementById('add-user-btn');
    addUserBtn?.addEventListener('click', () => showUserModal());

    const userSearch = document.getElementById('user-search');
    userSearch?.addEventListener('input', (e) => populateUsersTable(e.target.value));
}

// ==================== LÓGICA DE DATOS (API) ====================

/**
 * @param {string} searchTerm 
 */
function populateUsersTable(searchTerm = '') {
    const tableBody = document.querySelector('#users-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando usuarios...</td></tr>';

    const url = searchTerm ? `${API_URL_USERS}/search?term=${encodeURIComponent(searchTerm)}` : API_URL_USERS;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(users => {
            tableBody.innerHTML = '';
            if (users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron usuarios.</td></tr>';
                return;
            }
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.nombre} ${user.apellido}</td>
                    <td>${user.email}</td>
                    <td><span class="role-badge role-${user.rol.toLowerCase()}">${user.rol}</span></td>
                    <td>${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                    <td><span class="status ${user.activo ? 'active' : 'inactive'}">${user.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                        <button class="action-btn edit" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            attachUserActionListeners();
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error al cargar los usuarios.</td></tr>';
        });
}

function attachUserActionListeners() {
    // Editar usuario
    document.querySelectorAll('#users-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', async e => {
            const userId = e.currentTarget.getAttribute('data-id');
            const response = await fetch(`${API_URL_USERS}/${userId}`);
            if (response.ok) {
                const user = await response.json();
                showUserModal(user);
            } else {
                alert('No se pudo cargar el usuario para editar.');
            }
        });
    });

    // Eliminar usuario
    document.querySelectorAll('#users-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', e => {
            const userId = e.currentTarget.getAttribute('data-id');
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                deleteUser(userId);
            }
        });
    });
}

function deleteUser(id) {
    fetch(`${API_URL_USERS}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Usuario eliminado con éxito.');
                populateUsersTable();
            } else {
                throw new Error('No se pudo eliminar el usuario.');
            }
        })
        .catch(error => {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar el usuario.');
        });
}

// ==================== LÓGICA DEL MODAL ====================

/**
 * @param {object|null} user 
 */
function showUserModal(user = null) {
    const isEditMode = user !== null;

    // Opciones para el rol y el estado
    const rolOptions = ['ADMIN', 'STAFF', 'CLIENTE'].map(rol => 
        `<option value="${rol}" ${isEditMode && user.rol === rol ? 'selected' : ''}>${rol}</option>`
    ).join('');
    const statusOptions = [
        { value: true, text: 'Activo' },
        { value: false, text: 'Inactivo' }
    ].map(status => 
        `<option value="${status.value}" ${isEditMode && user.activo === status.value ? 'selected' : ''}>${status.text}</option>`
    ).join('');

    const modalContent = `
        <div class="modal active" id="user-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                    <button class="close-modal" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <form id="user-form">
                        <input type="hidden" id="user-id" value="${isEditMode ? user.id : ''}">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="user-nombre">Nombre</label>
                                <input type="text" id="user-nombre" class="form-control" value="${isEditMode ? user.nombre : ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="user-apellido">Apellido</label>
                                <input type="text" id="user-apellido" class="form-control" value="${isEditMode ? user.apellido : ''}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="user-email">Email</label>
                            <input type="email" id="user-email" class="form-control" value="${isEditMode ? user.email : ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="user-password">Contraseña</label>
                            <input type="password" id="user-password" class="form-control" ${isEditMode ? 'placeholder="Dejar en blanco para no cambiar"' : 'required'}>
                        </div>
                        <div class="grid-2">
                             <div class="form-group">
                                <label for="user-rol">Rol</label>
                                <select id="user-rol" class="form-control" required>${rolOptions}</select>
                            </div>
                            <div class="form-group">
                                <label for="user-activo">Estado</label>
                                <select id="user-activo" class="form-control" required>${statusOptions}</select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" onclick="closeModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="save-user-btn">
                        ${isEditMode ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    `;

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
    
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `${API_URL_USERS}/${id}` : API_URL_USERS;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(error => { throw new Error(error.message || 'Error al guardar el usuario.') });
    })
    .then(() => {
        alert(`Usuario ${isEditMode ? 'actualizado' : 'creado'} con éxito.`);
        closeModal();
        populateUsersTable();
    })
    .catch(error => {
        console.error('Error al guardar el usuario:', error);
        alert(`Ocurrió un error: ${error.message}`);
    });
}


function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}