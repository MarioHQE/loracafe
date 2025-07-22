// analytics.js

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('analytics-page')?.classList.contains('active')) {
        initAnalyticsPage();
    }
});

function initAnalyticsPage() {
    fetch('/api/dashboard/analytics-data')
        .then(response => {
            if (!response.ok) throw new Error('No se pudieron cargar los datos de analíticas.');
            return response.json();
        })
        .then(data => {
            renderAnalyticsCharts(data);
            renderAnalyticsTables(data);
        })
        .catch(error => {
            console.error("Error al inicializar analíticas:", error);
            const contentArea = document.getElementById('analytics-page');
            if (contentArea) contentArea.innerHTML = `<div class="error-message"><h3>Error</h3><p>${error.message}</p></div>`;
        });
}

function renderAnalyticsCharts(data) {
    const topProductsCtx = document.getElementById('top-products-chart')?.getContext('2d');
    if (topProductsCtx && data.topProducts) {
        new Chart(topProductsCtx, { type: 'bar', data: { labels: data.topProducts.labels, datasets: [{ label: 'Unidades Vendidas', data: data.topProducts.data, backgroundColor: '#5D4037' }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } } });
    }
    const revenueByHourCtx = document.getElementById('revenue-by-hour-chart')?.getContext('2d');
    if (revenueByHourCtx && data.revenueByHour) {
        new Chart(revenueByHourCtx, { type: 'line', data: { labels: data.revenueByHour.labels, datasets: [{ label: 'Ingresos (S/)', data: data.revenueByHour.data, borderColor: '#8D6E63', tension: 0.4, fill: true }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } } });
    }
}

function renderAnalyticsTables(data) {
    const topCustomersBody = document.querySelector('#top-customers-table tbody');
    if (topCustomersBody && data.topCustomers) {
        topCustomersBody.innerHTML = '';
        if(data.topCustomers.length === 0) topCustomersBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay datos.</td></tr>';
        else data.topCustomers.forEach(c => { topCustomersBody.innerHTML += `<tr><td>${c.nombre} ${c.apellido || ''}</td><td>${c.totalPedidos}</td><td>S/ ${parseFloat(c.totalGastado).toFixed(2)}</td></tr>`; });
    }
    const categoriesBody = document.querySelector('#categories-table tbody');
    if (categoriesBody && data.categorySummary) {
        categoriesBody.innerHTML = '';
        if(data.categorySummary.length === 0) categoriesBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay datos.</td></tr>';
        else data.categorySummary.forEach(cat => { categoriesBody.innerHTML += `<tr><td>${cat.categoria}</td><td>S/ ${parseFloat(cat.totalVentas).toFixed(2)}</td><td>${parseFloat(cat.porcentaje).toFixed(2)}%</td></tr>`; });
    }
}