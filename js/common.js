// Shared utilities for all pages
(() => {
  try {
    const sessionRaw = localStorage.getItem('session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const adminLink = document.getElementById('adminLink');
    if (session && session.role === 'Administrador' && adminLink) {
      adminLink.style.display = 'inline-block';
    }
  } catch (error) {
    // swallow
  }
})();


