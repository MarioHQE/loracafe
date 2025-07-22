// Navbar.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Actualizar el contador del carrito al cargar la página.
    actualizarContadorNavbar();

    // 2. Lógica para el menú hamburguesa en móviles.
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

    // 3. ¡NUEVA LÓGICA! Menú desplegable del usuario con clic.
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        const userMenuButton = userMenu.querySelector('.user-menu-button');
        
        userMenuButton.addEventListener('click', (event) => {
            // Evita que el clic se propague al 'document' y cierre el menú inmediatamente.
            event.stopPropagation(); 
            userMenu.classList.toggle('active');
        });

        // Cierra el menú si se hace clic en cualquier otro lugar de la página.
        document.addEventListener('click', () => {
            if (userMenu.classList.contains('active')) {
                userMenu.classList.remove('active');
            }
        });
    }
});

/**
 * Función global para actualizar el número en el ícono del carrito.
 */
function actualizarContadorNavbar() {
    const cuentaCarrito = document.getElementById("cuenta-carrito");
    if (!cuentaCarrito) return;

    const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    const totalProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);

    cuentaCarrito.textContent = totalProductos;
    
    if (totalProductos > 0) {
        cuentaCarrito.style.display = 'flex';
    } else {
        cuentaCarrito.style.display = 'none';
    }
}