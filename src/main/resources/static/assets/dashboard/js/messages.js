// messages.js

const API_URL_MESSAGES = '/api/dashboard/messages';

function getCsrfToken() {
    const token = document.querySelector("meta[name='_csrf']")?.content;
    const header = document.querySelector("meta[name='_csrf_header']")?.content;
    return { token, header };
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('messages-page')?.classList.contains('active')) {
        populateMessagesTable();
    }
});

function populateMessagesTable() {
    const tableBody = document.querySelector('#messages-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando mensajes...</td></tr>';

    fetch(API_URL_MESSAGES)
        .then(res => res.json())
        .then(messages => {
            tableBody.innerHTML = '';
            if (messages.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay mensajes.</td></tr>';
                return;
            }
            messages.forEach(msg => {
                const row = tableBody.insertRow();
                const statusClass = msg.estado.toLowerCase();
                row.innerHTML = `
                    <td>${msg.nombre}</td>
                    <td>${msg.email}</td>
                    <td>${msg.asunto}</td>
                    <td class="message-content">${msg.mensaje}</td>
                    <td>${new Date(msg.fechaEnvio).toLocaleString()}</td>
                    <td><span class="status ${statusClass}">${msg.estado}</span></td>
                    <td>
                        <button class="action-btn view" data-id="${msg.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn reply" data-id="${msg.id}"><i class="fas fa-reply"></i></button>
                        <button class="action-btn delete" data-id="${msg.id}"><i class="fas fa-trash"></i></button>
                    </td>`;
            });
            attachMessageActionListeners();
        })
        .catch(error => {
            console.error('Error al cargar mensajes:', error);
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Error al cargar los mensajes.</td></tr>';
        });
}

function attachMessageActionListeners() {
    document.querySelectorAll('#messages-table .action-btn.view').forEach(btn => btn.addEventListener('click', e => viewMessage(e.currentTarget.dataset.id)));
    document.querySelectorAll('#messages-table .action-btn.reply').forEach(btn => btn.addEventListener('click', e => replyToMessage(e.currentTarget.dataset.id)));
    document.querySelectorAll('#messages-table .action-btn.delete').forEach(btn => btn.addEventListener('click', e => deleteMessage(e.currentTarget.dataset.id)));
}

function deleteMessage(id) {
    if (!confirm('¿Seguro que quieres eliminar este mensaje?')) return;
    const csrf = getCsrfToken();
    fetch(`${API_URL_MESSAGES}/${id}`, { 
        method: 'DELETE',
        headers: { [csrf.header]: csrf.token }
    }).then(res => {
        if (res.ok) {
            alert('Mensaje eliminado.');
            populateMessagesTable();
        } else { throw new Error('Error al eliminar'); }
    }).catch(err => alert(err.message));
}

async function viewMessage(id) {
    const res = await fetch(`${API_URL_MESSAGES}/${id}`);
    if (!res.ok) { alert('Mensaje no encontrado'); return; }
    const msg = await res.json();
    const modalContent = `
        <div class="modal active"><div class="modal-content">
            <div class="modal-header"><h3>Mensaje de ${msg.nombre}</h3><button class="close-modal" onclick="closeModal(true)">×</button></div>
            <div class="modal-body"><p><strong>De:</strong> ${msg.nombre} (${msg.email})</p><p><strong>Fecha:</strong> ${new Date(msg.fechaEnvio).toLocaleString()}</p><p><strong>Asunto:</strong> ${msg.asunto}</p><hr><p>${msg.mensaje}</p>${msg.respuesta ? `<h4>Respuesta:</h4><p>${msg.respuesta}</p>` : ''}</div>
        </div></div>`;
    document.getElementById('modal-container').innerHTML = modalContent;
}

async function replyToMessage(id) {
    const res = await fetch(`${API_URL_MESSAGES}/${id}`);
    if (!res.ok) { alert('Mensaje no encontrado'); return; }
    const msg = await res.json();
    const modalContent = `
        <div class="modal active"><div class="modal-content">
            <div class="modal-header"><h3>Responder a ${msg.nombre}</h3><button class="close-modal" onclick="closeModal()">×</button></div>
            <div class="modal-body">
                <p><strong>Mensaje Original:</strong> ${msg.mensaje}</p><hr>
                <div class="form-group"><label for="reply-message">Tu Respuesta:</label><textarea id="reply-message" class="form-control" rows="8" required>${msg.respuesta || ''}</textarea></div>
            </div>
            <div class="modal-footer"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" id="send-reply-btn">Enviar Respuesta</button></div>
        </div></div>`;
    document.getElementById('modal-container').innerHTML = modalContent;
    document.getElementById('send-reply-btn').onclick = () => sendReply(id);
}

function sendReply(id) {
    const respuesta = document.getElementById('reply-message').value;
    if (!respuesta.trim()) { alert('La respuesta no puede estar vacía.'); return; }
    
    const csrf = getCsrfToken(); // Obtenemos el token
    
    fetch(`${API_URL_MESSAGES}/${id}/reply`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            [csrf.header]: csrf.token // Enviamos el token
        },
        body: JSON.stringify({ respuesta: respuesta })
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al enviar la respuesta.');
        return res.json();
    })
    .then(() => {
        alert('Respuesta enviada con éxito.');
        closeModal(true); // Cierra y recarga la tabla
    })
    .catch(err => alert(err.message));
}

function closeModal(reload = false) {
    document.getElementById('modal-container').innerHTML = '';
    if (reload) {
        populateMessagesTable();
    }
}