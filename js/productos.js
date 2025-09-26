document.addEventListener('DOMContentLoaded', () => {
  const PRODUCTS_KEY = 'productosData';
  const productosGrid = document.querySelector('.productos-grid');
  const cartCount = document.getElementById('cart-count');
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  function obtenerProductos() {
    // Verificar si existen datos, si no, inicializar
    let list = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    
    // Solo inicializar si no hay datos
    if (!list.length) {
      list = [
        { codigo:'P-1', nombre:'Zapatos de Fútbol', precio:49990, imagen:'img/zapatos.jpg', descripcion:'', stock: 10, categoria: 'deportes'},
        { codigo:'P-2', nombre:'Polerón Deportivo', precio:19990, imagen:'img/poleron.webp', descripcion:'', stock: 15, categoria: 'indumentaria'},
        { codigo:'P-3', nombre:'Shorts Deportivo', precio:14990, imagen:'img/shorts.avif', descripcion:'', stock: 20, categoria: 'indumentaria'},
        { codigo:'P-4', nombre:'Calcetines Deportivos', precio:4990, imagen:'img/calcetines.webp', descripcion:'', stock: 50, categoria: 'accesorios'}
      ];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
    }
    
    // Mostrar solo productos con stock >= 0 (incluye FREE con 0 stock si así se decide). Aquí filtramos stock > 0.
    return list.filter(p => typeof p.stock === 'number' ? p.stock > 0 : true);
  }

  function mapProductoParaVista(p) {
    return {
      codigo: p.codigo,
      nombre: p.nombre,
      precio: p.precio,
      img: p.imagen || 'img/Next.png',
      detalle: p.descripcion || ''
    };
  }

  function renderProductos() {
    const productos = obtenerProductos().map(mapProductoParaVista);
    productosGrid.innerHTML = '';
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('producto-card');
      card.innerHTML = `
        <img src="${prod.img}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>${new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(prod.precio)}</p>
        <button class="btn-detalle" data-code="${prod.codigo}">Ver detalle</button>
        <button class="btn-add" data-code="${prod.codigo}">Añadir al carrito</button>
      `;
      productosGrid.appendChild(card);
    });
    actualizarCarrito();
  }

  function actualizarCarrito() {
    cartCount.textContent = `Carrito (${carrito.length})`;
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  productosGrid.addEventListener('click', (e) => {
    const code = e.target.dataset.code;
    if (!code) return;
    const base = obtenerProductos();
    const encontrado = base.find(p => p.codigo === code);
    if (!encontrado) return;
    const productoVista = mapProductoParaVista(encontrado);

    if (e.target.classList.contains('btn-add')) {
      carrito.push(productoVista);
      actualizarCarrito();
      alert(`${productoVista.nombre} añadido al carrito`);
    }
    if (e.target.classList.contains('btn-detalle')) {
      localStorage.setItem('detalleProducto', JSON.stringify(productoVista));
      window.location.href = 'detalle.html';
    }
  });

  renderProductos();
});
