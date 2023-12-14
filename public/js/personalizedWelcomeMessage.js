/**
 * Script para actualizar el mensaje de bienvenida en la página específica.
 */

document.addEventListener('DOMContentLoaded', function () {
    const welcomeMessage = document.querySelector('.welcome-message h1');

    // Verifica si el elemento welcomeMessage está presente
    if (!welcomeMessage) {
        return; // Si no está presente, no hace nada más
    }

    // Realiza la solicitud para obtener la información del usuario
    fetch('/api/userinfo')
        .then(response => {
            if (!response.ok) {
                throw new Error('No autenticado');
            }
            return response.json();
        })
        .then(data => {
            // Actualiza el mensaje de bienvenida con el nombre del usuario
            welcomeMessage.textContent = `${data.nombre}, ¿en qué podemos ayudarle?`;
        })
        .catch(error => {
            console.error('Error al obtener la información del usuario:', error);
        });
});

