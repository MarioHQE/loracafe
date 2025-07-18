let currentSlide = 0; 
// Variable que almacena el índice actual del slide mostrado (inicia en 0).

const slides = document.querySelectorAll('.carousel-item'); 
// Selecciona todos los elementos con la clase "carousel-item", que representan los slides.

const totalSlides = slides.length; 
// Almacena el número total de slides en el carrusel.

/**
 * Muestra el slide correspondiente al índice proporcionado.
 * @param {number} index - Índice del slide a mostrar.
 */
function showSlide(index) {
    const slideWidth = 100; // Cada slide ocupa el 100% del contenedor en ancho.
    const carouselSlide = document.querySelector('.carousel-slide'); 
    // Selecciona el contenedor que envuelve todos los slides.

    carouselSlide.style.transform = `translateX(-${index * slideWidth}%)`; 
    // Mueve el contenedor en el eje X para mostrar el slide correcto.
}

/**
 * Muestra el siguiente slide.
 * Si el índice actual es el último slide, vuelve al primero (circular).
 */
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides; 
    // Incrementa el índice del slide actual y vuelve a 0 si llega al final.
    showSlide(currentSlide); 
    // Llama a la función para actualizar el slide visible.
}

/**
 * Muestra el slide anterior.
 * Si el índice actual es el primero, pasa al último (circular).
 */
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; 
    // Decrementa el índice del slide actual y, si es menor que 0, va al último slide.
    showSlide(currentSlide); 
    // Llama a la función para actualizar el slide visible.
}

// Selecciona los botones "prev" y "next" del carrusel
const prev = document.querySelector('.carousel-prev'); 
const next = document.querySelector('.carousel-next'); 

// Agrega un evento de clic al botón "prev" para mostrar el slide anterior
prev.addEventListener('click', prevSlide); 

// Agrega un evento de clic al botón "next" para mostrar el siguiente slide
next.addEventListener('click', nextSlide); 

// Configura un intervalo que cambia al siguiente slide automáticamente cada 5 segundos
setInterval(nextSlide, 5000); 


//Animacion hacia arriba de las promociones
document.addEventListener("DOMContentLoaded", () => {
    // Se selecciona el contenedor de la sección de promociones y el contenedor de las promociones
    const promocionesSection = document.querySelector("#promos-section");
    const promocionesGrid = document.querySelector(".promociones-grid");
  
    // Crear un nuevo IntersectionObserver para observar la visibilidad de la sección de promociones
    const observer = new IntersectionObserver((entries) => {
      // Itera sobre cada entrada (en este caso solo será una)
      entries.forEach(entry => {
        // Verifica si la sección de promociones está visible en el viewport
        if (entry.isIntersecting) {
          // Si la sección es visible, agrega la clase 'animate' a .promociones-grid
          // Esto activará la animación definida en CSS
          promocionesGrid.classList.add("animate");
  
          // Deja de observar la sección una vez que se ha animado
          // Esto evita que se siga observando si la sección ya se ha mostrado
          observer.unobserve(promocionesSection);
        }
      });
    }, {
      // Se establece el umbral de visibilidad al 50% (0.5)
      // Esto significa que la animación solo se activará cuando al menos el 50% de la sección sea visible en el viewport
      threshold: 0.5
    });
  
    // Inicia la observación de la sección de promociones
    observer.observe(promocionesSection);
  });