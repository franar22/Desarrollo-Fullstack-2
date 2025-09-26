
(() => {
  try {
    const sessionRaw = localStorage.getItem('session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    
    const loginLink = document.querySelector('a[href="login.html"]');
    const registroLink = document.querySelector('a[href="registro.html"]');
    const adminLink = document.getElementById('adminLink');
    
    if (session) {
      if (loginLink) loginLink.style.display = 'none';
      if (registroLink) registroLink.style.display = 'none';
      
      if (session.role === 'Administrador' && adminLink) {
        adminLink.style.display = 'inline-block';
      }
      let logoutLink = document.getElementById('logoutLink');
      if (!logoutLink) {
        logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.id = 'logoutLink';
        logoutLink.textContent = 'Cerrar Sesión';
        logoutLink.className = 'nav-link';
        
        const carritoLink = document.querySelector('a[href="carrito.html"]');
        if (carritoLink && carritoLink.parentNode) {
          carritoLink.parentNode.insertBefore(logoutLink, carritoLink);
        }
      }
      logoutLink.style.display = 'inline-block';
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('session');
        window.location.reload();
      });
      
    } else {
      if (loginLink) loginLink.style.display = 'inline-block';
      if (registroLink) registroLink.style.display = 'inline-block';
      if (adminLink) adminLink.style.display = 'none';
      
      const logoutLink = document.getElementById('logoutLink');
      if (logoutLink) logoutLink.style.display = 'none';
    }
  } catch (error) {
    console.error('Error al manejar sesión:', error);
  }
})();


