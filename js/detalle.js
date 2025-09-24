document.addEventListener('DOMContentLoaded', () => {
  const producto = JSON.parse(localStorage.getItem('detalleProducto'));
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const detalleContainer = document.querySelector('.detalle-container');
  const cartCount = document.getElementById('cart-count');

  function actualizarCarrito() {
    if (cartCount) cartCount.textContent = `Carrito (${carrito.length})`;
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  if (producto) {
    detalleContainer.innerHTML = `
      <div class="producto-detalle">
        <img src="${producto.img}" alt="${producto.nombre}" style="max-width:320px;">
        <div class="info">
          <h2>${producto.nombre}</h2>
          <p>${producto.detalle || ''}</p>
          <p><strong>Precio:</strong> ${new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(producto.precio)}</p>
          <button id="btn-add" class="btn">Añadir al carrito</button>
        </div>
      </div>
    `;
    const btn = document.getElementById('btn-add');
    if (btn) {
      btn.addEventListener('click', () => {
        carrito.push(producto);
        actualizarCarrito();
        alert(`${producto.nombre} añadido al carrito`);
      });
    }
  } else {
    detalleContainer.innerHTML = `<p>No se encontró información del producto. Vuelve a <a href="productos.html">Productos</a>.</p>`;
  }

  actualizarCarrito();
});
