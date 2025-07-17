// Initialize analytics charts
function initAnalyticsCharts() {
    // Top Products Chart
    const topProductsCtx = document.getElementById('top-products-chart').getContext('2d');
    new Chart(topProductsCtx, {
        type: 'bar',
        data: {
            labels: ['Café Americano', 'Capuchino', 'Tarta de Chocolate', 'Croissant', 'Té Verde','Agua'],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [320, 290, 180, 150, 120, 132],
                backgroundColor: '#5D4037',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Revenue by Hour Chart
    const revenueByHourCtx = document.getElementById('revenue-by-hour-chart').getContext('2d');
    new Chart(revenueByHourCtx, {
        type: 'line',
        data: {
            labels: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
            datasets: [{
                label: 'Ingresos (S/)',
                data: [120, 350, 420, 380, 510, 780, 650, 480, 320, 280, 180],
                backgroundColor: 'rgba(93, 64, 55, 0.1)',
                borderColor: '#5D4037',
                borderWidth: 3,
                pointBackgroundColor: '#5D4037',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Sales Trends Chart
    const salesTrendsCtx = document.getElementById('sales-trends-chart').getContext('2d');
    new Chart(salesTrendsCtx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [
                {
                    label: 'Esta Semana',
                    data: [1250, 1380, 1620, 1450, 1780, 2150, 1920],
                    borderColor: '#5D4037',
                    borderWidth: 3,
                    tension: 0.3
                },
                {
                    label: 'Semana Pasada',
                    data: [1100, 1300, 1450, 1320, 1650, 1950, 1800],
                    borderColor: '#8D6E63',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Populate top customers table
    const topCustomersBody = document.querySelector('#top-customers-table tbody');
    topCustomersBody.innerHTML = `
        <tr>
            <td>María Rodríguez</td>
            <td>12</td>
            <td>S/156.80</td>
        </tr>
        <tr>
            <td>Carlos López</td>
            <td>9</td>
            <td>S/112.50</td>
        </tr>
        <tr>
            <td>Ana Martínez</td>
            <td>7</td>
            <td>S/98.25</td>
        </tr>
    `;

    // Populate categories table
    const categoriesBody = document.querySelector('#categories-table tbody');
    categoriesBody.innerHTML = `
        <tr>
            <td>Bebidas</td>
            <td>S/1,850.75</td>
            <td>62%</td>
        </tr>
        <tr>
            <td>Postres</td>
            <td>S/780.50</td>
            <td>26%</td>
        </tr>
        <tr>
            <td>Comidas Ligeras</td>
            <td>S/365.25</td>
            <td>12%</td>
        </tr>
    `;
}