document.addEventListener('DOMContentLoaded', function () {
    const authButton = document.getElementById('auth-button');
    const authStatus = document.getElementById('auth-status');
    
    fetch('/api/userinfo')
        .then(response => {
            if (!response.ok) {
                throw new Error('No autenticado');
            }
            return response.json();
        })
        .then(data => {
            authButton.classList.add('logged-in');
            document.getElementById('auth-status').textContent = `Bienvenido, ${data.nombre} ${data.apellidos}!`;
            authButton.textContent = 'Cerrar sesión'; // Cambia el texto del botón a "Cerrar sesión"
        })
        .catch(error => {
            console.error('Error al obtener la información del usuario:', error);
            document.getElementById('auth-status').textContent = '';
            authButton.textContent = 'Iniciar sesión'; // Mantiene o cambia el texto a "Iniciar sesión"
        });

       authButton.addEventListener('click', function () {
        if (authButton.classList.contains('logged-in')) {
            fetch('/api/logout')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cerrar la sesión');
                    }
                    return response.text(); // O puedes esperar un JSON, dependiendo de tu API
                })
                .then(() => {
                    // Actualiza la UI para reflejar que el usuario está deslogueado
                    authStatus.textContent = '';
                    authButton.textContent = 'Iniciar sesión';
                    authButton.classList.remove('logged-in');
                    // Redirige al usuario a la página de inicio o pantalla de login
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Error al cerrar la sesión:', error);
                });
        } else {
            // Redirige al usuario a la pantalla de login si no está logueado
            window.location.href = '/';
        }
    });
});