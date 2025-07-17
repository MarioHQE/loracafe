// Toggle sidebar on mobile
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Navigation between pages
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('page-title');

// Load mock data
let appData = {
    products: [],
    orders: [],
    messages: [],
    customers: [],
    users: [],
    reports: []
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load mock data
    appData = mockData;
    
    // Set dashboard as active page
    document.querySelector('[data-page="dashboard"]').click();
    
    // Initialize charts
    initDashboardCharts();
    
    // Populate tables
    populateRecentOrders();
    populateProductsTable();
    populateUsersTable();
    populateCustomersTable();
    populateMessagesTable();
});

menuItems.forEach(item => {
    if (item.id !== 'logout') {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            if (!pageId) return;
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update page title
            pageTitle.textContent = item.querySelector('span').textContent;
            
            // Show selected page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${pageId}-page`) {
                    page.classList.add('active');
                    
                    // Initialize page-specific content
                    switch(pageId) {
                        case 'analytics':
                            initAnalyticsCharts();
                            break;
                        case 'reports':
                            populateReportsTable();
                            break;
                        case 'settings':
                            populateUsersTable();
                            break;
                    }
                }
            });
            
            // Close sidebar on mobile after selection
            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
            }
        });
    }
});

// Logout
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Here you would normally clear the session and redirect to login
        alert('Sesión cerrada');
        window.location.href = 'index.html';
    });
}

// Global search
const globalSearch = document.getElementById('global-search');
if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Search functionality would be implemented per page
        // For demo purposes, we'll just log the search term
        console.log('Searching for:', searchTerm);
    });
}

// Initialize dashboard charts
function initDashboardCharts() {
    // Sales by Category Chart
    const salesByCategoryCtx = document.getElementById('salesByCategoryChart').getContext('2d');
    new Chart(salesByCategoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Bebidas', 'Postres', 'Comidas Ligeras', 'Otros'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#5D4037',
                    '#8D6E63',
                    '#D7CCC8',
                    '#EFEBE9'
                ],
                borderWidth: 0
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

    // Monthly Revenue Chart
    const monthlyRevenueCtx = document.getElementById('monthlyRevenueChart').getContext('2d');
    new Chart(monthlyRevenueCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ingresos (S/)',
                data: [4500, 5200, 4800, 6100, 7300, 8900, 9200, 8800, 9500, 10200, 11500, 12500],
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

// Populate recent orders table
function populateRecentOrders() {
    const tableBody = document.querySelector('#recent-orders-table tbody');
    tableBody.innerHTML = '';
    
    appData.orders.slice(0, 5).forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>S/${order.total.toFixed(2)}</td>
            <td><span class="status ${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="action-btn view"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit"><i class="fas fa-edit"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Helper function to get status text
function getStatusText(status) {
    switch(status) {
        case 'completed': return 'Completado';
        case 'pending': return 'Pendiente';
        case 'processing': return 'En proceso';
        case 'cancelled': return 'Cancelado';
        default: return status;
    }
}