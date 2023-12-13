/**
 * @file bottomBar.js - Script para la barra inferior de la página principal.
 * @author Luis Crespo Orti
 * @version 1.0
 */

/**
 * Evento que se ejecuta cuando el DOM se ha cargado completamente.
 *
 * Realiza una solicitud a la API '/api/userinfo' para obtener información del usuario y
 * actualiza la interfaz de usuario en consecuencia. También maneja el evento de clic en
 * el botón de autenticación para iniciar o cerrar sesión.
 *
 * @event DOMContentLoaded
 * @callback
 */
document.addEventListener('DOMContentLoaded', function () {
    const authButton = document.getElementById('auth-button');
    const authStatus = document.getElementById('auth-status');

    /**
     * Realiza una solicitud a la API '/api/userinfo' para obtener información del usuario y
     * actualiza la interfaz de usuario según el estado de autenticación.
     *
     * @function
     * @returns {Promise<void>} - Promesa que se resuelve después de actualizar la interfaz de usuario.
     */
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

    /**
     * Maneja el evento de clic en el botón de autenticación.
     *
     * @event click
     * @callback
     */
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