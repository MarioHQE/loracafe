//Creacion de menu
const menu = [
  {
    id: 1,
    title: "Cafe Australiano",
    category: "Bebidas",
    price: 15.20,
    img:
      "../../Vista/Imagenes/img-carta/cafe-australiano.jpg",
    desc: `Deléitate con el Café Australiano, una mezcla suave y equilibrada con un toque de cacao y avellanas, ideal para acompañar una tarde especial. `,
  },
  {
    id: 2,
    title: "Cafe Helado",
    category: "Bebidas",
    price: 18.60,
    img:
      "../../Vista/Imagenes/img-carta/cafe-helado.jpg",
    desc: `Refrescante Café Helado, preparado con café artesanal, hielo triturado y un toque de crema, perfecto para días cálidos. `,
  },
  {
    id: 3,
    title: "Cafe Viena",
    category: "Bebidas",
    price: 14.50,
    img:
      "../../Vista/Imagenes/img-carta/cafe-viena.jpg",
    desc: `Café Viena, una elegante combinación de espresso intenso con crema batida, un clásico europeo que deleita. `,
  },
  {
    id: 4,
    title: "Cafe Liqueurs",
    category: "Bebidas",
    price: 19.60,
    img:
      "../../Vista/Imagenes/img-carta/cafe-liqueurs.jpg",
    desc: `Exquisito Café Liqueurs, fusionado con un licor premium que potencia su aroma y sabor único. `,
  },
  {
    id: 5,
    title: "Cafe Irish",
    category: "Bebidas",
    price: 18.60,
    img:
      "../../Vista/Imagenes/img-carta/cafe-irish.jpg",
    desc: `Café Irish, una mezcla reconfortante de café fuerte, whisky irlandés y una capa cremosa irresistible. `,
  },
  {
    id: 6,
    title: "Frappuccino",
    category: "Bebidas",
    price: 16.00,
    img:
      "../../Vista/Imagenes/img-carta/frapuccino.avif",
    desc: `Clásico Frappuccino, una bebida fría con base de café, leche y un toque de dulzura, coronada con crema batida. `,
  },
  {
    id: 7,
    title: "Cafe Inglés",
    category: "Bebidas",
    price: 15.70,
    img:
      "../../Vista/Imagenes/img-carta/cafe-ingles.jpg",
    desc: `Café Inglés, con un toque de canela y nuez moscada, una mezcla cálida y reconfortante. `,
  },
  {
    id: 8,
    title: "Caramel Frappuccino",
    category: "Bebidas",
    price: 16.50,
    img:
      "../../Vista/Imagenes/img-carta/caramel-frappuccino.webp",
    desc: `Caramel Frappuccino, una delicia helada con caramelo y café, perfecta para endulzar tu día. `,
  },
  {
    id: 9,
    title: "Triple Mocha Frappuccino",
    category: "Bebidas",
    price: 16.50,
    img:
      "../../Vista/Imagenes/img-carta/mocha-frappuccino.webp",
    desc: `Triple Mocha Frappuccino, con tres capas de chocolate y un toque de café, para los amantes del cacao. `,
  },
  {
    id: 10,
    title: "Chai Cream Frappuccino",
    category: "Bebidas",
    price: 22.00,
    img:
      "../../Vista/Imagenes/img-carta/chai cream - frappuccino.webp",
    desc: `Chai Cream Frappuccino, una mezcla cremosa con especias chai y un toque helado para sorprender tu paladar. `,
  },
  {
    id: 11,
    title: "Torta de chocolate",
    category: "Postres",
    price: 10.20,
    img:
      "../../Vista/Imagenes/img-carta/postre1.avif",
    desc: `Torta de Chocolate, con capas suaves y esponjosas, bañada en un ganache cremoso que te hará suspirar `,
  },
  {
    id: 12,
    title: "Gelatina",
    category: "Postres",
    price: 5.60,
    img:
      "../../Vista/Imagenes/img-carta/postre2.jpg",
    desc: `Gelatina fresca y colorida, una opción ligera y deliciosa para disfrutar en cualquier momento del día. `,
  },
  {
    id: 13,
    title: "Tiramisu",
    category: "Postres",
    price: 13.90,
    img:
      "../../Vista/Imagenes/img-carta/postre3.avif",
    desc: `Clásico Tiramisú italiano, con capas de bizcocho empapado en café y crema mascarpone. `,
  },
  {
    id: 14,
    title: "Tarta de queso",
    category: "Postres",
    price: 15.60,
    img:
      "../../Vista/Imagenes/img-carta/postre4.jpg",
    desc: `Tarta de Queso, con una base crujiente y un relleno cremoso, coronada con frutas frescas. `,
  },
  {
    id: 15,
    title: "Flan",
    category: "Postres",
    price: 3.60,
    img:
      "../../Vista/Imagenes/img-carta/postre5.webp",
    desc: `Flan suave y cremoso, con un caramelo que se deshace en tu boca. Un postre clásico e irresistible. `,
  },
  {
    id: 16,
    title: "Albaricoques con crema",
    category: "Postres",
    price: 14.60,
    img:
      "../../Vista/Imagenes/img-carta/postre6.webp",
    desc: `Albaricoques frescos acompañados de crema batida, un postre ligero y natural. `,
  },
  {
    id: 17,
    title: "Pay de fresa",
    category: "Postres",
    price: 15.70,
    img:
      "../../Vista/Imagenes/img-carta/postre7.jpeg",
    desc: `Pay de Fresa, con una base crujiente y un relleno dulce, decorado con fresas frescas. `,
  },
  {
    id: 18,
    title: "Tiramisu de cafe",
    category: "Postres",
    price: 16.50,
    img:
      "../../Vista/Imagenes/img-carta/postre8.jpg",
    desc: `Tiramisú de Café, una deliciosa variación del clásico, con un toque extra de espresso. `,
  },
  {
    id: 19,
    title: "Panna cotta",
    category: "Postres",
    price: 16.50,
    img:
      "../../Vista/Imagenes/img-carta/postre9.webp",
    desc: `Panna Cotta, un postre italiano suave y cremoso, servido con salsa de frutas. `,
  },
  {
    id: 20,
    title: "Torta de galleta",
    category: "Postres",
    price: 7.20,
    img:
      "../../Vista/Imagenes/img-carta/postre10.jpg",
    desc: `Torta de Galleta, una combinación de galletas y crema que encanta a todos. `,
  },
  {
    id: 21,
    title: "Chocotejas",
    category: "Market",
    price: 13.20,
    img:
      "../../Vista/Imagenes/img-carta/market1.jpg",
    desc: `Chocotejas artesanales, rellenas de dulce de leche y frutas secas, un clásico peruano. `,
  },
  {
    id: 22,
    title: "Cafe graneado",
    category: "Market",
    price: 16.60,
    img:
      "../../Vista/Imagenes/img-carta/market2.png",
    desc: `Café Graneado, ideal para los amantes del café fresco y de alta calidad. `,
  },
  {
    id: 23,
    title: "Aceite de oliva",
    category: "Market",
    price: 20.00,
    img:
      "../../Vista/Imagenes/img-carta/market3.png",
    desc: `Aceite de Oliva extra virgen, perfecto para realzar el sabor de tus platillos favoritos. `,
  },
  {
    id: 24,
    title: "Cacao",
    category: "Market",
    price: 15.50,
    img:
      "../../Vista/Imagenes/img-carta/market4.png",
    desc: `Cacao puro, ideal para preparar bebidas o postres con un sabor intenso y natural. `,
  },

];


// Seleccionar elementos del DOM
const cuentaCarritoElement = document.getElementById("cuenta-carrito");
const section = document.querySelector(".section-center");
const btnContainer = document.querySelector(".btn-container");
const carritoContador = document.getElementById("cuenta-carrito");

// Estado del carrito
let carrito = [];

// Reducir categorías
const categories = menu.reduce(
  (values, item) => {
    if (!values.includes(item.category)) {
      values.push(item.category);
    }
    return values;
  },
  ["Todos"]
);

// Crear botones de categoría
const categoryList = () => {
  const categoryBtns = categories
    .map((category) => {
      return `<button class="btn btn-outline-dark btn-item" data-id=${category}>${category}</button>`;
    })
    .join("");

  btnContainer.innerHTML = categoryBtns;

  const filterBtns = document.querySelectorAll(".btn-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const category = e.currentTarget.dataset.id;
      const menuCategory = menu.filter((menuItem) => {
        if (menuItem.category === category) {
          return menuItem;
        }
      });
      if (category === "Todos") {
        menuList(menu);
      } else {
        menuList(menuCategory);
      }
    });
  });
};

// Crear lista de menú
const menuList = (menuItems) => {
  let displayMenu = menuItems.map((item) => {
    return `
              <div class="menu-items col-lg-6 col-sm-12">
                  <img src="${item.img}" alt="${item.title}" class="photo" />
                  <div class="menu-info">
                      <div class="menu-title">
                          <h4>${item.title}</h4>
                      </div>
                      <div class="menu-text">
                          ${item.desc}
                      </div>
                      <div class="price-buy-container">
                          <h4 class="price">S/${item.price}</h4>
                          <button class="cart-button" data-id="${item.id}">
                              <span class="add-to-cart">Comprar</span>
                              <span class="added">Comprado</span>
                              <i class="fa-solid fa-mug-saucer"></i>
                              <i class="fa-solid fa-cube"></i>
                          </button>
                      </div>
                  </div>
              </div>
          `;
  }).join("");

  section.innerHTML = displayMenu;

  // Añadir eventos a los botones del carrito
  const cartButtons = document.querySelectorAll(".cart-button");
  cartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      const producto = menu.find((item) => item.id === id);
      agregarAlCarrito(producto);
      activarAnimacion(button); // Activar la animación
    });
  });
};

// Agregar al carrito (con persistencia en localStorage)
function agregarAlCarrito(producto) {
  let memoria = JSON.parse(localStorage.getItem("productos"));
  let cantidadProductoFinal;
  
  // Si no hay localStorage, crear uno nuevo
  if (!memoria || memoria.length === 0) {
    const nuevoProducto = getNuevoProductoParaMemoria(producto);
    localStorage.setItem("productos", JSON.stringify([nuevoProducto]));
    cantidadProductoFinal = 1;
  } else {
    const indiceProducto = memoria.findIndex((compra) => compra.id === producto.id);
    if (indiceProducto === -1) {
      const nuevoProducto = getNuevoProductoParaMemoria(producto);
      memoria.push(nuevoProducto);
      cantidadProductoFinal = 1;
    } else {
      memoria[indiceProducto].cantidad++;
      cantidadProductoFinal = memoria[indiceProducto].cantidad;
    }
    localStorage.setItem("productos", JSON.stringify(memoria));
  }
  
  actualizarNumeroCarrito();
  return cantidadProductoFinal;
}

// Crear el nuevo producto con cantidad inicial
function getNuevoProductoParaMemoria(producto) {
  const nuevoProducto = producto;
  nuevoProducto.cantidad = 1;
  return nuevoProducto;
}

// Actualizar el número del carrito
function actualizarNumeroCarrito() {
  let cuenta = 0;
  const memoria = JSON.parse(localStorage.getItem("productos"));
  if (memoria && memoria.length > 0) {
    cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
    cuentaCarritoElement.innerText = cuenta;
  } else {
    cuentaCarritoElement.innerText = 0;
  }
}

// Activar animación en el botón
const activarAnimacion = (button) => {
  button.classList.add("clicked");
  
  // Eliminar la clase después de la duración de la animación
  setTimeout(() => {
    button.classList.remove("clicked");
  }, 2000); // Duración acorde con la animación definida en CSS
};

// Inicializar la página
menuList(menu);
categoryList();
actualizarNumeroCarrito();
