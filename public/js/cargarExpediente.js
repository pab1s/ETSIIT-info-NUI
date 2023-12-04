window.addEventListener('load', function() {
    var iframe = document.getElementById('expediente-iframe');
    var modal = document.getElementById('expediente-modal');

    // Verifica si el iframe y el modal existen
    if (iframe && modal) {
        // Establece la URL del iframe para cargar el expediente
        iframe.src = '/api/expediente';

        // OPCIONAL: Añade un controlador de eventos para manejar errores de carga del iframe
        iframe.onerror = function() {
            console.error('Error al cargar el expediente.');
            // Manejo del error
        };

        // Llama a la función para mostrar el modal
        mostrarExpediente();
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


/* Codigo html asociado
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trámites Administrativos</title>
        <link rel="stylesheet" href="../css/tramites.css"> <!-- Enlace a CSS -->
        <script src="../js/cargarExpediente.js" defer></script> <!-- Enlace a JS -->
    </head>
    <body>
        <div id="expediente-modal" width="100%" height="2000px" margin-top="20%" style="display:none;">
            <iframe id="expediente-iframe" src="" width="100%" height="100%" style="border:none;"></iframe>
        </div>
    </body>
</html>
*/