// Message Search
const messageSearch = document.getElementById('message-search');
if (messageSearch) {
    messageSearch.addEventListener('input', (e) => {
        filterMessages(e.target.value);
    });
}

// Populate messages table
function populateMessagesTable() {
    const tableBody = document.querySelector('#messages-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    appData.messages.forEach(message => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.subject}</td>
            <td class="message-content">${message.message}</td>
            <td>${message.date}</td>
            <td><span class="status ${message.status}">${message.status === 'new' ? 'Nuevo' : 'Leído'}</span></td>
            <td>
                <button class="action-btn view" data-id="${message.id}"><i class="fas fa-eye"></i></button>
                <button class="action-btn reply" data-id="${message.id}"><i class="fas fa-reply"></i></button>
                <button class="action-btn delete" data-id="${message.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('#messages-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', () => {
            const messageId = parseInt(btn.getAttribute('data-id'));
            const message = appData.messages.find(m => m.id === messageId);
            if (message) {
                viewMessage(message);
            }
        });
    });
    
    document.querySelectorAll('#messages-table .action-btn.reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const messageId = parseInt(btn.getAttribute('data-id'));
            const message = appData.messages.find(m => m.id === messageId);
            if (message) {
                replyToMessage(message);
            }
        });
    });
    
    document.querySelectorAll('#messages-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const messageId = parseInt(btn.getAttribute('data-id'));
            if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
                appData.messages = appData.messages.filter(m => m.id !== messageId);
                populateMessagesTable();
                alert('Mensaje eliminado con éxito');
            }
        });
    });
}

// View message details
function viewMessage(message) {
    const modalContent = `
        <div class="modal active" id="message-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Mensaje de ${message.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="message-details">
                        <div class="detail-item">
                            <label>Nombre:</label>
                            <span>${message.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${message.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Teléfono:</label>
                            <span>${message.phone}</span>
                        </div>
                        <div class="detail-item">
                            <label>Fecha:</label>
                            <span>${message.date}</span>
                        </div>
                        <div class="detail-item">
                            <label>Asunto:</label>
                            <span>${message.subject}</span>
                        </div>
                        <div class="detail-item full">
                            <label>Mensaje:</label>
                            <p>${message.message}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary reply-btn" data-id="${message.id}">
                        <i class="fas fa-reply"></i> Responder
                    </button>
                    <button type="button" class="btn close-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Add event listeners
    document.querySelector('#message-modal .close-modal').addEventListener('click', closeModal);
    document.querySelectorAll('#message-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.querySelector('.reply-btn').addEventListener('click', () => {
        closeModal();
        replyToMessage(message);
    });
    
    // Mark message as read
    const messageIndex = appData.messages.findIndex(m => m.id === message.id);
    if (messageIndex !== -1 && appData.messages[messageIndex].status === 'new') {
        appData.messages[messageIndex].status = 'read';
        populateMessagesTable();
    }
}

// Reply to message
function replyToMessage(message) {
    const modalContent = `
        <div class="modal active" id="reply-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Responder a ${message.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="reply-form">
                        <div class="form-group">
                            <label for="reply-to">Para:</label>
                            <input type="text" id="reply-to" class="form-control" 
                                value="${message.email}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="reply-subject">Asunto:</label>
                            <input type="text" id="reply-subject" class="form-control" 
                                value="Re: ${message.subject}">
                        </div>
                        <div class="form-group">
                            <label for="reply-message">Mensaje:</label>
                            <textarea id="reply-message" class="form-control" rows="8" required>
Estimado/a ${message.name},

Gracias por contactar con Cafetería Delicioso.

                            </textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="send-reply">
                        <i class="fas fa-paper-plane"></i> Enviar Respuesta
                    </button>
                    <button type="button" class="btn close-modal">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
    
    // Add event listeners
    document.querySelector('#reply-modal .close-modal').addEventListener('click', closeModal);
    document.querySelectorAll('#reply-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.getElementById('send-reply').addEventListener('click', () => {
        sendReply(message);
    });
}

// Send reply
function sendReply(message) {
    const subject = document.getElementById('reply-subject').value;
    const replyMessage = document.getElementById('reply-message').value;
    
    // In a real app, this would send the email
    // For demo, we'll just show a success message
    
    alert(`Respuesta enviada a ${message.email} con éxito!`);
    
    // Mark message as replied
    const messageIndex = appData.messages.findIndex(m => m.id === message.id);
    if (messageIndex !== -1) {
        appData.messages[messageIndex].status = 'replied';
        populateMessagesTable();
    }
    
    closeModal();
}

// Filter messages
function filterMessages(searchTerm) {
    const filtered = appData.messages.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tableBody = document.querySelector('#messages-table tbody');
    tableBody.innerHTML = '';
    
    filtered.forEach(message => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.subject}</td>
            <td class="message-content">${message.message}</td>
            <td>${message.date}</td>
            <td><span class="status ${message.status}">${message.status === 'new' ? 'Nuevo' : 'Leído'}</span></td>
            <td>
                <button class="action-btn view" data-id="${message.id}"><i class="fas fa-eye"></i></button>
                <button class="action-btn reply" data-id="${message.id}"><i class="fas fa-reply"></i></button>
                <button class="action-btn delete" data-id="${message.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Reattach event listeners
    document.querySelectorAll('#messages-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', () => {
            const messageId = parseInt(btn.getAttribute('data-id'));
            const message = appData.messages.find(m => m.id === messageId);
            if (message) {
                viewMessage(message);
            }
        });
    });
    
    document.querySelectorAll('#messages-table .action-btn.reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const messageId = parseInt(btn.getAttribute('data-id'));
            const message = appData.messages.find(m => m.id === messageId);
            if (message) {
                replyToMessage(message);
            }
        });
    });
    
    document.querySelectorAll('#messages-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const messageId = parseInt(btn.getAttribute('data-id'));
            if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
                appData.messages = appData.messages.filter(m => m.id !== messageId);
                populateMessagesTable();
                alert('Mensaje eliminado con éxito');
            }
        });
    });
}