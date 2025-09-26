document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        limpiarMensaje();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            mostrarError("Todos los campos son obligatorios");
            return;
        }

        // Admin hardcode
        if (email.toLowerCase() === 'admin@duocuc.cl' && password === 'admin') {
            const session = { email, nombre: 'Admin', apellido: '', role: 'Administrador' };
            localStorage.setItem('session', JSON.stringify(session));
            mostrarExito('Bienvenido, Administrador');
            setTimeout(() => { window.location.href = 'admin.html'; }, 600);
            form.reset();
            return;
        }

        // Usuarios registrados desde registro y desde admin (con roles)
        const regUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
        const adminUsers = JSON.parse(localStorage.getItem('usuariosAdmin')) || [];
        // Unificar por email. Prioriza contraseña exacta y respeta rol si existe en admin
        const merged = (() => {
            const map = new Map();
            regUsers.forEach(u => map.set((u.email||'').toLowerCase(), { nombre:u.nombre, apellido:u.apellido||'', email:u.email, password:u.password, role:'Cliente' }));
            adminUsers.forEach(u => map.set((u.correo||'').toLowerCase(), { nombre:u.nombre, apellido:u.apellidos||'', email:u.correo, password:u.password||'', role:u.tipo||'Cliente' }));
            return Array.from(map.values());
        })();
        const usuario = merged.find(u => u.email && u.email.toLowerCase() === email.toLowerCase() && (u.password||'') === password);

        if (usuario) {
            const session = { email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, role: usuario.role || 'Cliente' };
            localStorage.setItem('session', JSON.stringify(session));
            mostrarExito(`Bienvenido, ${usuario.nombre} ${usuario.apellido}`);
            setTimeout(() => { window.location.href = session.role === 'Administrador' ? 'admin.html' : 'index.html'; }, 600);
            form.reset();
        } else {
            mostrarError("Correo o contraseña incorrectos");
        }
    });

    const mostrarExito = (texto) => {
        message.textContent = texto;
        message.className = "message success";
        message.style.display = "block";
    };

    const mostrarError = (texto) => {
        message.textContent = texto;
        message.className = "message error";
        message.style.display = "block";
    };

    const limpiarMensaje = () => {
        message.textContent = "";
        message.className = "message";
        message.style.display = "none";
    };
});
