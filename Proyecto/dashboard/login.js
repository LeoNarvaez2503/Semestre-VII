document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeSlashIcon = document.getElementById('eyeSlashIcon');
    const rememberCheckbox = document.getElementById('remember');
    
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const buttonArrow = document.getElementById('buttonArrow');
    const buttonSpinner = document.getElementById('buttonSpinner');

    // 1. Redireccionar si ya hay sesión activa
    if (localStorage.getItem('access_token')) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Cargar usuario recordado si existe
    const rememberedUser = localStorage.getItem('remembered_username');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        rememberCheckbox.checked = true;
    }

    // 3. Conmutar visibilidad de contraseña
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeIcon.classList.add('hidden');
            eyeSlashIcon.classList.remove('hidden');
        } else {
            eyeIcon.classList.remove('hidden');
            eyeSlashIcon.classList.add('hidden');
        }
    });

    // 4. Procesar Envío del Formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Limpiar errores previos
        errorAlert.classList.add('hidden');

        // Estado de carga en el botón
        submitButton.disabled = true;
        buttonText.textContent = 'Iniciando sesión...';
        buttonArrow.classList.add('hidden');
        buttonSpinner.classList.remove('hidden');

        try {
            const response = await fetch('http://localhost:9000/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Capturar el mensaje de error del backend
                const errorText = data.detail || 'Credenciales incorrectas o usuario inactivo.';
                throw new Error(errorText);
            }

            // Guardar tokens en localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('token_type', data.token_type);

            // Guardar o eliminar el usuario recordado
            if (rememberCheckbox.checked) {
                localStorage.setItem('remembered_username', username);
            } else {
                localStorage.removeItem('remembered_username');
            }

            // Redireccionar al Dashboard
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error de autenticación:', error);
            // Mostrar alerta de error
            errorMessage.textContent = error.message;
            errorAlert.classList.remove('hidden');
        } finally {
            // Restaurar estado del botón
            submitButton.disabled = false;
            buttonText.textContent = 'Iniciar Sesión';
            buttonArrow.classList.remove('hidden');
            buttonSpinner.classList.add('hidden');
        }
    });
});
