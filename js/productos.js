document.addEventListener('DOMContentLoaded', () => {
  const PRODUCTS_KEY = 'productosData';
  
  function obtenerProductos() {
    let productos = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    if (!productos.length) {
      productos = [
        {codigo:'P-1', nombre:"Zapatos de fútbol", precio:49990, imagen:"img/zapatos.jpg", descripcion:"Zapatos de fútbol con buena tracción.", stock: 10, categoria: 'deportes'},
        {codigo:'P-2', nombre:"Polerón deportivo", precio:19990, imagen:"img/poleron.webp", descripcion:"Polerón transpirable para entrenar.", stock: 15, categoria: 'indumentaria'},
        {codigo:'P-3', nombre:"Shorts deportivos", precio:14990, imagen:"img/shorts.avif", descripcion:"Shorts cómodos y flexibles.", stock: 20, categoria: 'indumentaria'},
        {codigo:'P-4', nombre:"Calcetines deportivos", precio:4990, imagen:"img/calcetines.webp", descripcion:"Calcetines resistentes y cómodos.", stock: 50, categoria: 'accesorios'},
        {codigo:'P-5', nombre:"Balón de fútbol", precio:59990, imagen:"img/balon.webp", descripcion:"Balón oficial de entrenamiento de alta durabilidad.", stock: 8, categoria: 'deportes'},
        {codigo:'P-6', nombre:"Guantes de portero", precio:79990, imagen:"img/guantes.jpg", descripcion:"Guantes con excelente agarre y comodidad.", stock: 12, categoria: 'deportes'},
        {codigo:'P-7', nombre:"Mochila deportiva", precio:69990, imagen:"img/mochila.jpg", descripcion:"Mochila ligera y resistente para deportes.", stock: 6, categoria: 'accesorios'},
        {codigo:'P-8', nombre:"Botella de agua", precio:7990, imagen:"img/botella.jpg", descripcion:"Botella reutilizable, ideal para entrenamientos.", stock: 25, categoria: 'accesorios'}
      ];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productos));
    }
    
    return productos.filter(p => p.stock > 0);
  }
  
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const productosGrid = document.querySelector('.productos-grid');
  const cartCount = document.getElementById('cart-count');

  function renderProductos() {
    const productos = obtenerProductos();
    productosGrid.innerHTML = '';
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('producto-card');
      const precioFormateado = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(prod.precio);
      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>${precioFormateado}</p>
        <button class="btn-detalle" data-code="${prod.codigo}">Ver detalle</button>
        <button class="btn-add" data-code="${prod.codigo}">Añadir al carrito</button>
      `;
      productosGrid.appendChild(card);
    });
    actualizarCarrito();
  }

  function actualizarCarrito() {
    cartCount.textContent = `Carrito (${carrito.length})`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  productosGrid.addEventListener('click', (e) => {
    const code = e.target.dataset.code;
    if (!code) return;
    
    const productos = obtenerProductos();
    const producto = productos.find(p => p.codigo === code);
    if (!producto) return;
    
    if(e.target.classList.contains('btn-add')) {
      const productoCarrito = {
        id: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        img: producto.imagen,
        detalle: producto.descripcion
      };
      carrito.push(productoCarrito);
      actualizarCarrito();
      alert(`${producto.nombre} añadido al carrito`);
    }
    if(e.target.classList.contains('btn-detalle')) {
      const productoDetalle = {
        id: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        img: producto.imagen,
        detalle: producto.descripcion
      };
      localStorage.setItem("detalleProducto", JSON.stringify(productoDetalle));
      window.location.href = "detalle.html";
    }
  });

  renderProductos();
});
