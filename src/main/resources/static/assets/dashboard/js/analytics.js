// analytics.js

/**
 * Este listener se ejecuta cuando el DOM está completamente cargado.
 * Si la página de analíticas es la que está activa, inicia la carga de todos los datos.
 */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('analytics-page')?.classList.contains('active')) {
        initAnalyticsPage();
    }
});

/**
 * Función principal que orquesta la carga de datos y la renderización de la página de analíticas.
 */
function initAnalyticsPage() {
    // Hacemos una única petición al backend para obtener todos los datos de analíticas.
    fetch('/api/dashboard/analytics-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos de analíticas desde el servidor.');
            }
            return response.json();
        })
        .then(data => {
            // Una vez que tenemos los datos, llamamos a las funciones para renderizar cada componente.
            renderAnalyticsCharts(data);
            renderAnalyticsTables(data);
        })
        .catch(error => {
            console.error("Error al inicializar la página de analíticas:", error);
            // Mostramos un mensaje de error en la UI si la carga de datos falla.
            const contentArea = document.getElementById('analytics-page');
            if (contentArea) {
                contentArea.innerHTML = `<div class="error-message"><h3>Error</h3><p>${error.message}</p></div>`;
            }
        });
}

/**
 * Renderiza los gráficos de Chart.js con los datos obtenidos de la API.
 * @param {object} data - El objeto de datos que contiene la información para los gráficos.
 */
function renderAnalyticsCharts(data) {
    // --- Gráfico de Productos Más Vendidos (Barra) ---
    const topProductsCtx = document.getElementById('top-products-chart')?.getContext('2d');
    if (topProductsCtx && data.topProducts) {
        new Chart(topProductsCtx, {
            type: 'bar',
            data: {
                labels: data.topProducts.labels,
                datasets: [{
                    label: 'Unidades Vendidas',
                    data: data.topProducts.data,
                    backgroundColor: '#5D4037',
                    borderColor: '#3E2723',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // --- Gráfico de Ingresos por Hora (Línea) ---
    const revenueByHourCtx = document.getElementById('revenue-by-hour-chart')?.getContext('2d');
    if (revenueByHourCtx && data.revenueByHour) {
        new Chart(revenueByHourCtx, {
            type: 'line',
            data: {
                labels: data.revenueByHour.labels,
                datasets: [{
                    label: 'Ingresos (S/)',
                    data: data.revenueByHour.data,
                    borderColor: '#8D6E63',
                    backgroundColor: 'rgba(141, 110, 99, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

/**
 * Rellena las tablas de la página de analíticas con los datos obtenidos de la API.
 * @param {object} data - El objeto de datos que contiene la información para las tablas.
 */
function renderAnalyticsTables(data) {
    // --- Tabla de Clientes Más Activos ---
    const topCustomersBody = document.querySelector('#top-customers-table tbody');
    if (topCustomersBody && data.topCustomers) {
        topCustomersBody.innerHTML = ''; // Limpiar cualquier contenido previo.
        if (data.topCustomers.length === 0) {
             topCustomersBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay datos de clientes.</td></tr>';
        } else {
            data.topCustomers.forEach(customer => {
                const row = topCustomersBody.insertRow();
                row.innerHTML = `
                    <td>${customer.nombre} ${customer.apellido || ''}</td>
                    <td>${customer.totalPedidos}</td>
                    <td>S/ ${parseFloat(customer.totalGastado).toFixed(2)}</td>
                `;
            });
        }
    }

    // --- Tabla de Resumen de Categorías ---
    const categoriesBody = document.querySelector('#categories-table tbody');
    if (categoriesBody && data.categorySummary) {
        categoriesBody.innerHTML = ''; // Limpiar cualquier contenido previo.
         if (data.categorySummary.length === 0) {
             categoriesBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay datos de categorías.</td></tr>';
        } else {
            data.categorySummary.forEach(cat => {
                const row = categoriesBody.insertRow();
                row.innerHTML = `
                    <td>${cat.categoria}</td>
                    <td>S/ ${parseFloat(cat.totalVentas).toFixed(2)}</td>
                    <td>${parseFloat(cat.porcentaje).toFixed(2)}%</td>
                `;
            });
        }
    }
}