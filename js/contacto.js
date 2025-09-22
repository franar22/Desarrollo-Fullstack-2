document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("contactForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        limpiarMensaje();

        if (validarFormulario()) {
            mostrarExito();
            form.reset();
        }
    });

    const validarFormulario = () => {
        return validarNombre() && validarEmail() && validarMensaje();
    };

    const validarNombre = () => {
        const nombre = document.getElementById("nombre").value.trim();
        if (nombre === "" || nombre.length > 40) {
            mostrarError("El nombre es obligatorio y debe tener máximo 40 caracteres");
            return false;
        }
        return true;
    };

    const validarEmail = () => {
        const email = document.getElementById("email").value.trim();
        const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        if (email === "" || email.length > 100) {
            mostrarError("El correo es obligatorio y debe tener máximo 100 caracteres");
            return false;
        }
        if (!dominiosValidos.some(d => email.endsWith(d))) {
            mostrarError("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
            return false;
        }
        return true;
    };

    const validarMensaje = () => {
        const mensaje = document.getElementById("mensaje").value.trim();
        if (mensaje === "" || mensaje.length > 500) {
            mostrarError("El mensaje es obligatorio y debe tener máximo 500 caracteres");
            return false;
        }
        return true;
    };

    const mostrarExito = () => {
        message.textContent = "Mensaje enviado ✅";
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
