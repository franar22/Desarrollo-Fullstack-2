(() => {
  const formatChileanPeso = (value) => {
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    } catch (error) {
      return `$${value}`;
    }
  };

  const storageKey = 'productosData';
  let productList = [];

  try {
    const existing = localStorage.getItem(storageKey);
    productList = existing ? JSON.parse(existing) : [];
  } catch (error) {
    productList = [];
  }

  if (!Array.isArray(productList) || productList.length === 0) {
    productList = [
      { codigo: 'P-1', nombre: 'Zapatos de Fútbol', precio: 49990, imagen: 'img/zapatos.jpg', descripcion: '', stock: 10, categoria: 'deportes' },
      { codigo: 'P-2', nombre: 'Polerón Deportivo', precio: 19990, imagen: 'img/poleron.webp', descripcion: '', stock: 15, categoria: 'indumentaria' },
      { codigo: 'P-3', nombre: 'Shorts Deportivo', precio: 14990, imagen: 'img/shorts.avif', descripcion: '', stock: 20, categoria: 'indumentaria' },
      { codigo: 'P-4', nombre: 'Calcetines Deportivos', precio: 4990, imagen: 'img/calcetines.webp', descripcion: '', stock: 50, categoria: 'accesorios' }
    ];
    try {
      localStorage.setItem(storageKey, JSON.stringify(productList));
    } catch (error) {
      // ignore write errors
    }
  }

  const container = document.getElementById('homeProductos');
  if (!container) return;

  container.innerHTML = productList.slice(0, 4).map((product) => {
    const safeImage = product.imagen || 'img/Next.png';
    return (
      '<div class="producto-card">' +
      '<img src="' + safeImage + '" alt="' + product.nombre + '">' +
      '<h3>' + product.nombre + '</h3>' +
      '<p>Precio: ' + formatChileanPeso(product.precio) + '</p>' +
      '<button class="btn-detalle" data-code="' + product.codigo + '">Ver Detalle</button>' +
      '</div>'
    );
  }).join('');

  container.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || !(target instanceof Element)) return;
    const code = target.getAttribute('data-code');
    if (!code) return;
    const product = productList.find((p) => p.codigo === code);
    if (!product) return;
    const detail = { nombre: product.nombre, precio: product.precio, img: product.imagen, detalle: product.descripcion };
    try {
      localStorage.setItem('detalleProducto', JSON.stringify(detail));
    } catch (error) {
      // 
    }
    window.location.href = 'detalle.html';
  });
})();


