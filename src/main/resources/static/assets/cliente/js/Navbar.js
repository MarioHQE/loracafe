// Esta función actualizará el contador del carrito en el navbar
function actualizarContadorNavbar() {
    const cuentaCarrito = document.getElementById("cuenta-carrito"); // Contador en el navbar
    const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    const totalProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    cuentaCarrito.textContent = totalProductos;
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", actualizarContadorNavbar);
