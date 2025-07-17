// Add User Button
const addUserBtn = document.getElementById('add-user-btn');
if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
        showUserModal();
    });
}

// Populate users table
function populateUsersTable() {
    const tableBody = document.querySelector('#users-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    appData.users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.lastLogin}</td>
            <td><span class="status ${user.status}">${user.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="action-btn edit" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${user.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('#users-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = parseInt(btn.getAttribute('data-id'));
            const user = appData.users.find(u => u.id === userId);
            if (user) {
                showUserModal(user);
            }
        });
    });
    
    document.querySelectorAll('#users-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = parseInt(btn.getAttribute('data-id'));
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                appData.users = appData.users.filter(u => u.id !== userId);
                populateUsersTable();
                alert('Usuario eliminado con éxito');
            }
        });
    });
}

// Show user modal
function showUserModal(user = null) {
    const isEditMode = user !== null;
    
    const modalContent = `
        <div class="modal active" id="user-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEditMode ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="user-form">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="user-name">Nombre Completo</label>
                                <input type="text" id="user-name" class="form-control" 
                                    value="${isEditMode ? user.name : ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="user-email">Email</label>
                                <input type="email" id="user-email" class="form-control" 
                                    value="${isEditMode ? user.email : ''}" required>
                            </div>
                        </div>
                        
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="user-role">Rol</label>
                                <select id="user-role" class="form-control" required>
                                    <option value="admin" ${isEditMode && user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                                    <option value="manager" ${isEditMode && user.role === 'manager' ? 'selected' : ''}>Manager</option>
                                    <option value="staff" ${isEditMode && user.role === 'staff' ? 'selected' : ''}>Personal</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="user-status">Estado</label>
                                <select id="user-status" class="form-control" required>
                                    <option value="active" ${isEditMode && user.status === 'active' ? 'selected' : ''}>Activo</option>
                                    <option value="inactive" ${isEditMode && user.status === 'inactive' ? 'selected' : ''}>Inactivo</option>
                                </select>
                            </div>
                        </div>
                        
                        ${!isEditMode ? `
                        <div class="form-group">
                            <label for="user-password">Contraseña</label>
                            <input type="password" id="user-password" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="user-confirm-password">Confirmar Contraseña</label>
                            <input type="password" id="user-confirm-password" class="form-control" required>
                        </div>
                        ` : ''}
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="save-user">
                        ${isEditMode ? 'Actualizar Usuario' : 'Guardar Usuario'}
                    </button>
                    <button type="button" class="btn close-modal">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Add event listeners
    document.querySelector('#user-modal .close-modal').addEventListener('click', closeModal);
    document.querySelectorAll('#user-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.getElementById('save-user').addEventListener('click', () => {
        saveUser(isEditMode, user ? user.id : null);
    });
}

// Save user
function saveUser(isEdit, userId) {
    // In a real app, this would send data to the server
    // For demo, we'll just update the local data
    
    const userData = {
        id: isEdit ? userId : Date.now(),
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        role: document.getElementById('user-role').value,
        status: document.getElementById('user-status').value,
        lastLogin: new Date().toLocaleString()
    };
    
    if (!isEdit) {
        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // In a real app, we would hash the password
        userData.password = password;
    }
    
    if (isEdit) {
        // Update existing user
        const index = appData.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            appData.users[index] = userData;
        }
    } else {
        // Add new user
        appData.users.push(userData);
    }
    
    // Update table
    populateUsersTable();
    
    // Close modal
    closeModal();
    
    // Show success message
    alert(`Usuario ${isEdit ? 'actualizado' : 'agregado'} con éxito!`);
}