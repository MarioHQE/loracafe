// Inicio.js

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Lógica del carrusel principal ---
    let currentSlide = 0; 
    const slides = document.querySelectorAll('.carousel-item'); 
    if (slides.length > 0) {
        const totalSlides = slides.length; 
        const carouselSlide = document.querySelector('.carousel-slide');
        const prevButton = document.querySelector('.carousel-prev'); 
        const nextButton = document.querySelector('.carousel-next');

        function showSlide(index) {
            const slideWidth = 100;
            if(carouselSlide) carouselSlide.style.transform = `translateX(-${index * slideWidth}%)`; 
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides; 
            showSlide(currentSlide); 
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; 
            showSlide(currentSlide); 
        }

        prevButton?.addEventListener('click', prevSlide); 
        nextButton?.addEventListener('click', nextSlide); 
        setInterval(nextSlide, 5000);
    }
    
    // --- Lógica para la animación de la sección de promociones ---
    const promocionesSection = document.querySelector("#promos-section");
    const promocionesGrid = document.querySelector(".promociones-grid");
    if (promocionesSection && promocionesGrid) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    promocionesGrid.classList.add("animate");
                    observer.unobserve(promocionesSection);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(promocionesSection);
    }

    // --- Carga dinámica de promociones ---
    cargarPromociones();
});

/**
 * Obtiene las promociones activas desde la API y las muestra en la página.
 */
function cargarPromociones() {
    const container = document.getElementById("promociones-grid-container");
    if (!container) return;
    container.innerHTML = "<p>Cargando ofertas...</p>";

    fetch('/api/client/promotions/active')
        .then(response => response.json())
        .then(promociones => {
            container.innerHTML = "";
            if (promociones.length === 0) {
                container.innerHTML = "<p>No hay promociones activas en este momento.</p>";
                return;
            }

            promociones.forEach(promo => {
                if (!promo.producto) 
                    return; // Si una promo no tiene producto, la saltamos

                const promoElement = document.createElement('div');
                promoElement.className = 'promocion';
                
                promoElement.innerHTML = `
                    <img src="${promo.producto.imagenUrl || '/Vista/Imagenes/img-inicio/promo-default.jpg'}" alt="${promo.producto.nombre}">
                    <h3>${promo.nombre}</h3>
                    <p class="descripcion">${promo.descripcion}</p>
                    <p class="precio">
                        <strong>S/ ${promo.producto.precioFinal.toFixed(2)}</strong> 
                        <span>S/ ${promo.producto.precioOriginal.toFixed(2)}</span>
                    </p>
                    <button class="add-promo-to-cart-btn" data-product-id="${promo.producto.id}">Añadir al Carrito</button>
                `;
                container.appendChild(promoElement);
            });

            attachPromoAddToCartListeners(); // Añadir listeners a los nuevos botones
        })
        .catch(error => {
            console.error("Error al cargar promociones:", error);
            container.innerHTML = "<p>Ocurrió un error al cargar las promociones.</p>";
        });
}

// AÑADE ESTA NUEVA FUNCIÓN a Inicio.js
function attachPromoAddToCartListeners() {
    document.querySelectorAll('.add-promo-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            
            // Reutilizamos la lógica de Carta.js
            fetch(`/api/client/products/${productId}`)
                .then(res => res.json())
                .then(producto => {
                    // Estas funciones deben estar disponibles globalmente o importadas
                    if (typeof agregarAlCarrito === "function") {
                         agregarAlCarrito(producto);
                         alert(`¡"${producto.nombre}" añadido al carrito!`);
                    }
                });
        });
    });
}

// AÑADE ESTA NUEVA FUNCIÓN a Inicio.js (o asegúrate de que esté en un script global)
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("productos")) || [];
    const indiceProducto = carrito.findIndex((item) => item.id === producto.id);
    if (indiceProducto === -1) {
        producto.cantidad = 1;
        carrito.push(producto);
    } else {
        carrito[indiceProducto].cantidad++;
    }
    localStorage.setItem("productos", JSON.stringify(carrito));
    if (typeof actualizarContadorNavbar === 'function') {
        actualizarContadorNavbar();
    }
}
