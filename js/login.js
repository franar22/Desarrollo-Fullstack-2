document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        limpiarMensaje();

        if(validarFormulario()){
            mostrarExito();
            form.reset();
        }
    });

    const validarFormulario = () => {
        return validarEmail() && validarPassword();
    };

    const validarEmail = () => {
        const email = document.getElementById("email").value.trim();
        const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

        if(email === "" || email.length > 100){
            mostrarError("El correo es obligatorio y debe tener máximo 100 caracteres");
            return false;
        }

        if(!dominiosValidos.some(dominio => email.endsWith(dominio))){
            mostrarError("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
            return false;
        }

        return true;
    };

    const validarPassword = () => {
        const password = document.getElementById("password").value.trim();

        if(password === "" || password.length < 4 || password.length > 10){
            mostrarError("La contraseña debe tener entre 4 y 10 caracteres");
            return false;
        }

        return true;
    };

    const mostrarExito = () => {
        message.textContent = "Inicio de sesión exitoso";
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
