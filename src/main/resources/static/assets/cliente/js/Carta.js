// Carta.js

/**
 * Listener principal que se ejecuta cuando el contenido HTML de la página está listo.
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carga inicial de todos los productos disponibles.
    fetchAndDisplayProducts('todos');

    // 2. Configura los listeners para los botones de filtro de categorías.
    setupFilterButtons();
});

/**
 * Selecciona todos los botones de filtro y les asigna un evento de clic.
 */
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll(".btn-item");
    filterButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            // Elimina la clase 'active' de todos los botones y la añade solo al que se hizo clic.
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Obtiene el ID de la categoría desde el atributo 'data-id-categoria'.
            const categoriaId = e.currentTarget.getAttribute('data-id-categoria');
            
            // Llama a la función para cargar y mostrar los productos de esa categoría.
            fetchAndDisplayProducts(categoriaId);
        });
    });
}

/**
 * Busca los productos en la API y los muestra en el contenedor principal.
 * @param {string} categoriaId - El ID de la categoría a filtrar. Si es 'todos', carga todos los productos.
 */
function fetchAndDisplayProducts(categoriaId) {
    const container = document.getElementById("productos-container");
    if (!container) {
        console.error("El contenedor de productos no fue encontrado.");
        return;
    }

    container.innerHTML = '<p style="text-align:center; color: #333;">Cargando productos...</p>';

    // Construimos la URL: si categoriaId es 'todos', no se añade ningún parámetro.
    // De lo contrario, se añade el parámetro ?categoriaId=N.
    const url = (categoriaId === 'todos')
        ? '/api/client/products'
        : `/api/client/products?categoriaId=${categoriaId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los productos desde el servidor.');
            }
            return response.json();
        })
        .then(productos => {
            container.innerHTML = ''; // Limpiar el mensaje de "cargando".
            
            if (productos.length === 0) {
                container.innerHTML = '<p style="text-align:center; color: #333;">No hay productos disponibles en esta categoría.</p>';
                return;
            }

            // Por cada producto recibido, generamos su HTML y lo añadimos al contenedor.
            productos.forEach(producto => {
                const productoHTML = `
                    <div class="menu-items col-lg-6 col-sm-12">
                        <img src="${producto.imagenUrl || '/Vista/Imagenes/img-carta/default-product.png'}" alt="${producto.nombre}" class="photo" />
                        <div class="menu-info">
                            <div class="menu-title">
                                <h4>${producto.nombre}</h4>
                            </div>
                            <div class="menu-text">
                                ${producto.descripcion}
                            </div>
                            <div class="price-buy-container">
                                <h4 class="price">S/ ${producto.precio.toFixed(2)}</h4>
                                <button class="cart-button" data-product-id="${producto.id}">
                                    <span class="add-to-cart">Comprar</span>
                                    <span class="added">Comprado</span>
                                    <i class="fa-solid fa-mug-saucer"></i>
                                    <i class="fa-solid fa-cube"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += productoHTML;
            });

            // Una vez que todos los botones de "Comprar" están en el DOM, les añadimos su funcionalidad.
            attachAddToCartListeners();
        })
        .catch(error => {
            console.error('Error al obtener productos:', error);
            container.innerHTML = '<p style="text-align:center; color: #cc0000;">Ocurrió un error al cargar los productos.</p>';
        });
}

/**
 * Añade los event listeners a todos los botones "Comprar".
 */
function attachAddToCartListeners() {
    const cartButtons = document.querySelectorAll(".cart-button");
    cartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-product-id'));
            
            // Cuando se hace clic, buscamos los detalles completos del producto en la API.
            fetch(`/api/client/products/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Producto no encontrado');
                    return res.json();
                })
                .then(producto => {
                    // Una vez que tenemos el producto, lo añadimos al carrito y mostramos la animación.
                    agregarAlCarrito(producto);
                    activarAnimacion(button);
                })
                .catch(err => {
                    console.error("Error al añadir al carrito:", err);
                    alert("No se pudo añadir el producto al carrito.");
                });
        });
    });
}

/**
 * Agrega un producto al carrito, que se almacena en el localStorage del navegador.
 * @param {object} producto - El objeto completo del producto a añadir.
 */
function agregarAlCarrito(producto) {
    // Obtenemos el carrito actual de localStorage, o un array vacío si no existe.
    let carrito = JSON.parse(localStorage.getItem("productos")) || [];
    
    // Buscamos si el producto ya está en el carrito.
    const indiceProducto = carrito.findIndex((item) => item.id === producto.id);

    if (indiceProducto === -1) {
        // Si el producto no está, lo añadimos al carrito con una cantidad inicial de 1.
        producto.cantidad = 1;
        carrito.push(producto);
    } else {
        // Si ya está en el carrito, simplemente incrementamos su cantidad.
        carrito[indiceProducto].cantidad++;
    }

    // Guardamos el carrito actualizado de vuelta en localStorage.
    localStorage.setItem("productos", JSON.stringify(carrito));
    
    // Actualizamos el contador visual del carrito en el navbar.
    // Esta función está en Navbar.js, pero la llamamos desde aquí.
    if (typeof actualizarContadorNavbar === 'function') {
        actualizarContadorNavbar();
    }
}

/**
 * Activa la animación del botón de compra para dar feedback visual al usuario.
 * @param {HTMLElement} button - El botón que fue presionado.
 */
function activarAnimacion(button) {
    button.classList.add("clicked");
    // Eliminamos la clase después de 2 segundos para que la animación pueda volver a ejecutarse.
    setTimeout(() => {
        button.classList.remove("clicked");
    }, 2000);
}