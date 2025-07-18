// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    const extraContent = document.getElementById("extraContent"); 
    // Selecciona el contenido extra que se mostrará o se ocultará.
    const toggleButton = document.getElementById("toggleButton"); 
    // Selecciona el botón que alternará el estado del contenido.

    extraContent.style.display = "none"; 
    // Inicialmente oculta el contenido extra.

    toggleButton.addEventListener("click", () => {
        // Agrega un evento de clic al botón para alternar la visibilidad del contenido extra.
        if (extraContent.style.display === "none") {
            extraContent.style.display = "inline"; 
            // Muestra el contenido extra.
            toggleButton.textContent = "Leer Menos"; 
            // Cambia el texto del botón.
        } else {
            extraContent.style.display = "none"; 
            // Oculta el contenido extra.
            toggleButton.textContent = "Leer Más"; 
            // Cambia el texto del botón.
        }
    });
});

// Animaciones para elementos con clases 'animate-left' y 'animate-right'
const elements = document.querySelectorAll('.animate-left, .animate-right'); 
// Selecciona todos los elementos con estas clases.

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); 
      // Agrega la clase "visible" a los elementos que son visibles en la pantalla.
    }
  });
});

elements.forEach(element => {
  observer.observe(element); 
  // Observa cada elemento para aplicar la animación cuando se vuelva visible.
});

// Animaciones para las secciones de misión y visión
document.addEventListener("DOMContentLoaded", () => {
    const mission = document.querySelector(".mision"); 
    // Selecciona el elemento de la misión.
    const vision = document.querySelector(".vision"); 
    // Selecciona el elemento de la visión.

    const observerOptions = {
        threshold: 0.5, 
        // Configura el umbral al 50% (se activa cuando la mitad del elemento es visible).
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible"); 
                // Agrega la clase "visible" cuando el elemento es visible.
            }
        });
    }, observerOptions);

    observer.observe(mission); 
    // Observa la misión.
    observer.observe(vision); 
    // Observa la visión.
});

// Animación para las imágenes del equipo
document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".promocion img"); 
    // Selecciona todas las imágenes dentro de la clase "promocion".

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate"); 
            // Agrega la clase "animate" a las imágenes visibles.
            observer.unobserve(entry.target); 
            // Deja de observar la imagen una vez que se ha animado.
          }
        });
      },
      {
        threshold: 0.2, 
        // Configura el umbral al 20% (se activa cuando el 20% de la imagen es visible).
      }
    );

    images.forEach(image => {
      observer.observe(image); 
      // Observa cada imagen.
    });
  });

// Validación del formulario de contacto y manejo del modal
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contacto form"); 
    // Selecciona el formulario dentro de la sección de contacto.
    const modal = document.getElementById("success-modal"); 
    // Selecciona el modal de éxito.
    const closeModalButton = document.getElementById("close-modal"); 
    // Selecciona el botón para cerrar el modal.

    form.addEventListener("submit", (event) => {
      event.preventDefault(); 
      // Evita el comportamiento predeterminado del formulario (recarga de página).

      // Obtener valores de los campos
      const nombres = form.querySelector("input[placeholder='Nombres']").value.trim();
      const apellidos = form.querySelector("input[placeholder='Apellidos']").value.trim();
      const correo = form.querySelector("input[placeholder='Correo electrónico']").value.trim();
      const celular = form.querySelector("input[placeholder='Celular']").value.trim();
      const mensaje = form.querySelector("textarea[placeholder='Mensaje...']").value.trim();

      // Validaciones
      if (!nombres || !apellidos || !correo || !celular || !mensaje) {
        alert("Por favor, complete todos los campos."); 
        // Muestra una alerta si algún campo está vacío.
        return;
      }

      if (!/^[a-zA-Z\s]+$/.test(nombres) || !/^[a-zA-Z\s]+$/.test(apellidos)) {
        alert("Nombres y apellidos solo deben contener letras."); 
        // Valida que los nombres y apellidos contengan solo letras.
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Por favor, ingrese un correo electrónico válido."); 
        // Valida el formato del correo electrónico.
        return;
      }

      if (!/^\d{9}$/.test(celular)) {
        alert("El celular debe contener exactamente 9 dígitos."); 
        // Valida que el celular tenga 9 dígitos.
        return;
      }

      if (mensaje.length < 10) {
        alert("El mensaje debe contener al menos 10 caracteres."); 
        // Valida que el mensaje tenga al menos 10 caracteres.
        return;
      }

      // Si todas las validaciones pasan, muestra el modal
      modal.style.display = "flex"; 
      // Muestra el modal.
      form.reset(); 
      // Limpia el formulario.
    });

    // Cierra el modal al hacer clic en el botón "Cerrar"
    closeModalButton.addEventListener("click", () => {
      modal.style.display = "none"; 
      // Oculta el modal.
    });

    // Cierra el modal al hacer clic fuera del contenido del modal
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none"; 
        // Oculta el modal si se hace clic fuera de él.
      }
    });
  });