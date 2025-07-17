// Generate report buttons
document.querySelectorAll('.generate-report').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const reportType = e.target.getAttribute('data-type');
        generateReport(reportType);
    });
});

// Generate report
function generateReport(type) {
    // In a real app, this would generate and download a report
    // For demo, we'll just create a mock report object
    
    const reportTypes = {
        sales: 'Reporte de Ventas',
        products: 'Reporte de Productos',
        customers: 'Reporte de Clientes'
    };
    
    const reportName = `${reportTypes[type]} - ${new Date().toLocaleDateString()}`;
    
    const newReport = {
        id: Date.now(),
        name: reportName,
        type: reportTypes[type],
        date: new Date().toISOString(),
        size: '1.2 MB'
    };
    
    // Add to reports list
    appData.reports.push(newReport);
    
    // Update reports table
    populateReportsTable();
    
    // Show success message
    alert(`Reporte "${reportName}" generado con éxito!`);
}

// Populate reports table
function populateReportsTable() {
    const tableBody = document.querySelector('#reports-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    appData.reports.forEach(report => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${report.name}</td>
            <td>${report.type}</td>
            <td>${new Date(report.date).toLocaleDateString()}</td>
            <td>${report.size}</td>
            <td>
                <button class="action-btn download" data-id="${report.id}">
                    <i class="fas fa-download"></i> Descargar
                </button>
                <button class="action-btn delete" data-id="${report.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('#reports-table .action-btn.download').forEach(btn => {
        btn.addEventListener('click', () => {
            const reportId = parseInt(btn.getAttribute('data-id'));
            const report = appData.reports.find(r => r.id === reportId);
            if (report) {
                downloadReport(report);
            }
        });
    });
    
    document.querySelectorAll('#reports-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const reportId = parseInt(btn.getAttribute('data-id'));
            if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
                appData.reports = appData.reports.filter(r => r.id !== reportId);
                populateReportsTable();
                alert('Reporte eliminado con éxito');
            }
        });
    });
}

// Download report
function downloadReport(report) {
    // In a real app, this would download the actual report file
    // For demo, we'll just show a success message
    alert(`Descargando reporte: ${report.name}`);
}