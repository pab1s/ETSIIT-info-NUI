/**
 * @file cargarExpediente.js - Script para la página de cargar expediente de la aplicación web de la ETSIIT.
 * @author Alvaro Carrillo
 * @version 1.0
 */

/**
 * Maneja el evento 'load' de la ventana y configura el contenido del iframe de expediente al cargar la página.
 *
 * @function
 * @name handleWindowLoad
 */
window.addEventListener('load', function () {
    /**
     * Elemento iframe que mostrará el expediente.
     *
     * @type {HTMLIFrameElement}
     */
    var iframe = document.getElementById('expediente-iframe');

    /**
     * Elemento modal que contiene el iframe de expediente.
     *
     * @type {HTMLElement}
     */
    var modal = document.getElementById('expediente-modal');

    /**
     * Configura la fuente del iframe y muestra el expediente en el modal.
     *
     * @function
     * @name configureExpedienteIframe
     */
    var configureExpedienteIframe = function () {
        if (iframe && modal) {
            iframe.src = '/api/expediente';

            /**
             * Manejador de eventos de error del iframe.
             *
             * @function
             * @name handleIframeError
             */
            iframe.onerror = function () {
                console.error('Error al cargar el expediente.');
            };

            // Muestra el expediente
            mostrarExpediente();
        } else {
            console.error('Elementos del DOM no encontrados');
        }
    };

    // Configura el contenido del iframe al cargar la página
    configureExpedienteIframe();
});

/**
 * Muestra el modal del expediente.
 *
 * @function
 * @name mostrarExpediente
 */
function mostrarExpediente() {
    /**
     * Elemento modal que contiene el iframe de expediente.
     *
     * @type {HTMLElement}
     */
    var modal = document.getElementById('expediente-modal');

    if (modal) {
        modal.style.display = 'block';
    }
}
