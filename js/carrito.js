document.addEventListener('DOMContentLoaded', () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const carritoContainer = document.querySelector('.carrito-container');
  const cartCount = document.getElementById('cart-count');
  const totalElem = document.getElementById('total');

  function renderCarrito() {
    carritoContainer.innerHTML = '';
    let total = 0;

    carrito.forEach((producto, index) => {
      total += producto.precio;
      const div = document.createElement('div');
      div.classList.add('carrito-item');
      div.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}" width="80">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
      `;
      carritoContainer.appendChild(div);
    });

    totalElem.textContent = `Total: $${total}`;
    cartCount.textContent = `Carrito (${carrito.length})`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  carritoContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-eliminar')) {
      const index = parseInt(e.target.dataset.index);
      carrito.splice(index, 1);
      renderCarrito();
    }
  });

  document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito = [];
    renderCarrito();
  });

  renderCarrito();
});
