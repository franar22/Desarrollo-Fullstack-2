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

        // Usuarios registrados (cliente por defecto)
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (usuario) {
            const session = { email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, role: 'Cliente' };
            localStorage.setItem('session', JSON.stringify(session));
            mostrarExito(`Bienvenido, ${usuario.nombre} ${usuario.apellido}`);
            setTimeout(() => { window.location.href = 'index.html'; }, 600);
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
