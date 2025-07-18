// app.js

// ==================== LÓGICA GLOBAL DE LA APLICACIÓN ====================

/**
 * Este listener se ejecuta una vez que todo el contenido HTML de la página ha sido cargado.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Configurar el menú lateral para que se abra y cierre en móviles.
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 2. Configurar el botón de cerrar sesión (logout).
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // En una aplicación real con Spring Security, esto haría una petición POST a /logout.
            // Por ahora, simulamos el logout y redirigimos a una página de login.
            alert('Sesión cerrada (simulación).');
            window.location.href = '/login'; // Asumimos que tendrás una ruta /login en el futuro.
        });
    }

    // 3. Inicializar componentes específicos de la página que está activa.
    // Verificamos si la página del dashboard es la que se muestra para cargar los gráficos.
    // La clase 'active' la añade Thymeleaf en el servidor.
    if (document.getElementById('dashboard-page')?.classList.contains('active')) {
        initDashboardCharts();
    }
});


// ==================== LÓGICA ESPECÍFICA DEL DASHBOARD ====================

/**
 * Inicializa los gráficos del dashboard. Esta función ahora obtiene los datos
 * dinámicamente desde la API del backend en lugar de usar datos de prueba.
 */
function initDashboardCharts() {
    // Hacemos una petición a nuestro nuevo endpoint para los datos de los gráficos.
    fetch('/api/dashboard/chart-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos para los gráficos.');
            }
            return response.json();
        })
        .then(chartData => {
            // Una vez que tenemos los datos, creamos los gráficos.

            // --- Gráfico de Ventas por Categoría (Doughnut) ---
            const salesByCategoryCtx = document.getElementById('salesByCategoryChart')?.getContext('2d');
            if (salesByCategoryCtx && chartData.salesByCategory) {
                new Chart(salesByCategoryCtx, {
                    type: 'doughnut',
                    data: {
                        labels: chartData.salesByCategory.labels,
                        datasets: [{
                            data: chartData.salesByCategory.data,
                            backgroundColor: [
                                '#5D4037', // Marrón oscuro
                                '#8D6E63', // Marrón medio
                                '#BCAAA4', // Marrón claro
                                '#EFEBE9'  // Grisáceo
                            ],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                            legend: { 
                                position: 'right' 
                            } 
                        }
                    }
                });
            }

            // --- Gráfico de Ingresos Mensuales (Line) ---
            const monthlyRevenueCtx = document.getElementById('monthlyRevenueChart')?.getContext('2d');
            if (monthlyRevenueCtx && chartData.monthlyRevenue) {
                new Chart(monthlyRevenueCtx, {
                    type: 'line',
                    data: {
                        labels: chartData.monthlyRevenue.labels,
                        datasets: [{
                            label: 'Ingresos (S/)',
                            data: chartData.monthlyRevenue.data,
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
            }
        })
        .catch(error => {
            console.error("Error al inicializar los gráficos del dashboard:", error);
            // Opcional: podrías mostrar un mensaje de error en lugar de los lienzos de los gráficos.
            const chartBoxes = document.querySelectorAll('.chart-box');
            chartBoxes.forEach(box => {
                box.innerHTML = `<div style="text-align:center; padding-top: 50px; color: #cc0000;">${error.message}</div>`;
            });
        });
}