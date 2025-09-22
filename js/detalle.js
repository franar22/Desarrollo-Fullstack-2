document.addEventListener('DOMContentLoaded', () => {
  const producto = JSON.parse(localStorage.getItem("detalleProducto"));
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const detalleContainer = document.querySelector('.detalle-container');
  const cartCount = document.getElementById('cart-count');

  if(producto){
    detalleContainer.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h2>${producto.nombre}</h2>
      <p>${producto.detalle}</p>
      <p>Precio: $${producto.precio}</p>
      <button id="btn-add">Añadir al carrito</button>
    `;
  }

  document.getElementById('btn-add').addEventListener('click', () => {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cartCount.textContent = `Carrito (${carrito.length})`;
    alert(`${producto.nombre} añadido al carrito`);
  });

  cartCount.textContent = `Carrito (${carrito.length})`;
});
