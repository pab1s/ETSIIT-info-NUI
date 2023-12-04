document.addEventListener('DOMContentLoaded', function () {
    const authButton = document.getElementById('auth-button');
    
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
        if (authButton.textContent === 'Cerrar sesión') {
            // Proceso de logout
            fetch('/api/logout')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cerrar la sesión');
                    }
                })
                .catch(error => {
                    console.error('Error al cerrar la sesión:', error);
                });
        }
    });
});
