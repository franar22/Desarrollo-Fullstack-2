document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("registerForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        limpiarMensaje();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!nombre || !apellido || !email || !password) {
            mostrarError("Todos los campos son obligatorios");
            return;
        }

        if (password.length < 4 || password.length > 10) {
            mostrarError("La contraseña debe tener entre 4 y 10 caracteres");
            return;
        }

        
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        
        if (usuarios.some(usuario => usuario.email === email)) {
            mostrarError("Este correo ya está registrado");
            return;
        }

        
        usuarios.push({ nombre, apellido, email, password });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarExito("Registro exitoso. Ahora puedes iniciar sesión.");
        form.reset();
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
