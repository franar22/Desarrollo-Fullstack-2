document.addEventListener('DOMContentLoaded', () => {
  const productos = [
    {id:1, nombre:"Zapatos de fútbol", precio:100, img:"img/zapatos.jpg", detalle:"Zapatos de fútbol con buena tracción."},
    {id:2, nombre:"Polera deportiva", precio:50, img:"img/poleron.webp", detalle:"Polera transpirable para entrenar."},
    {id:3, nombre:"Shorts deportivos", precio:40, img:"img/shorts.avif", detalle:"Shorts cómodos y flexibles."},
    {id:4, nombre:"Calcetines deportivos", precio:20, img:"img/calcetines.webp", detalle:"Calcetines resistentes y cómodos."}
  ];

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const productosGrid = document.querySelector('.productos-grid');
  const cartCount = document.getElementById('cart-count');

  function renderProductos() {
    productosGrid.innerHTML = '';
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('producto-card');
      card.innerHTML = `
        <img src="${prod.img}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>$${prod.precio}</p>
        <button class="btn-detalle" data-id="${prod.id}">Ver detalle</button>
        <button class="btn-add" data-id="${prod.id}">Añadir al carrito</button>
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
    const id = parseInt(e.target.dataset.id);
    if(e.target.classList.contains('btn-add')) {
      const producto = productos.find(p => p.id === id);
      carrito.push(producto);
      actualizarCarrito();
      alert(`${producto.nombre} añadido al carrito`);
    }
    if(e.target.classList.contains('btn-detalle')) {
      const producto = productos.find(p => p.id === id);
      localStorage.setItem("detalleProducto", JSON.stringify(producto));
      window.location.href = "detalle.html";
    }
  });

  renderProductos();
});
