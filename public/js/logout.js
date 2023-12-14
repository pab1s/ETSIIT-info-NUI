/**
 * @file logout.js - Script para la página de cerrar sesión de la aplicación web de la ETSIIT.
 * @author Pablo Olivares Martinez
 * @version 1.0
 */

/**
 * Maneja el evento de clic en el botón de salida, realiza una solicitud para cerrar sesión y redirige a la página de inicio.
 *
 * @function
 * @name handleExitButtonClick
 * @param {Event} event - El objeto de evento del clic.
 */
document.getElementById('exit-button').addEventListener('click', function(event) {
    /**
     * Realiza una solicitud para cerrar la sesión a través de la API.
     *
     * @function
     * @name logoutRequest
     * @returns {Promise} - Promesa que se resuelve con los datos de la respuesta JSON.
     */
    const logoutRequest = () => {
        return fetch('/api/logout', { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No estás autenticado');
                }
                return response.json();
            });
    };

    // Maneja la solicitud de cerrar sesión
    logoutRequest()
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cerrar sesión: ' + error.message);
        })
        .finally(() => {
            // Redirige a la página de inicio después de manejar la solicitud
            window.location.href = '/';
        });
});
