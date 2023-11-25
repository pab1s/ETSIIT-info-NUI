window.addEventListener('load', function() {
    var iframe = document.getElementById('expediente-iframe');
    var modal = document.getElementById('expediente-modal');

    // Verifica si el iframe y el modal existen
    if (iframe && modal) {
        // Establece la URL del iframe para cargar el expediente
        iframe.src = '/api/expediente';

        // OPCIONAL: Puedes añadir un controlador de eventos para manejar errores de carga del iframe
        iframe.onerror = function() {
            console.error('Error al cargar el expediente.');
            // Aquí puedes mostrar un mensaje de error o manejar el error como prefieras
        };
    } else {
        console.error('Elementos del DOM no encontrados');
    }
});

// Función para mostrar el modal del expediente
function mostrarExpediente() {
    var modal = document.getElementById('expediente-modal');
    if (modal) {
        modal.style.display = 'block'; // Muestra el modal
    }
}
