// reports.js

/**
 * Este listener se ejecuta cuando el DOM está completamente cargado.
 * Su única función es configurar los event listeners si estamos en la página de reportes.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificamos si el elemento de la página de reportes existe y está activo.
    if (document.getElementById('reports-page')?.classList.contains('active')) {
        setupReportsEventListeners();
    }
});

/**
 * Configura los listeners para los botones de la página de reportes.
 */
function setupReportsEventListeners() {
    
    // 1. Botón para generar el Reporte de Productos (funcionalidad real)
    const productsReportBtn = document.querySelector('.generate-report[data-type="products"]');
    if (productsReportBtn) {
        productsReportBtn.addEventListener('click', () => {
            console.log("Iniciando la generación del reporte de productos...");
            
            // Le indicamos al navegador que navegue a la URL de nuestra API.
            // Como el backend responde con un Content-Type de 'application/pdf',
            // el navegador sabrá que debe abrirlo como un archivo PDF en una nueva pestaña.
            window.open('/api/reports/products', '_blank');
        });
    }

    // 2. Botones para otros reportes (funcionalidad no implementada)
    // Estos botones simplemente mostrarán una alerta para informar al usuario.
    const unimplementedButtons = document.querySelectorAll('.generate-report[data-type="sales"], .generate-report[data-type="customers"]');
    unimplementedButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Obtenemos el tipo de reporte del atributo 'data-type' del botón.
            const reportType = e.currentTarget.getAttribute('data-type');
            alert(`La generación del reporte de "${reportType}" aún no está implementada.`);
        });
    });

    // La tabla de "Reportes Generados" que tenías en el HTML original
    // ya no necesita ser llenada por JavaScript, ya que ahora generamos
    // los reportes al momento en lugar de almacenarlos. Puedes dejarla vacía
    // o eliminarla del HTML si lo prefieres.
}