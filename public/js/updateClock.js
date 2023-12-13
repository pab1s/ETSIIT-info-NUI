/**
 * @fileoverview Funciones para actualizar el reloj en la interfaz de usuario.
 * @author Pablo Olivares Martinez
 * @version 1.0
*/

/**
 * Función para actualizar el reloj en la interfaz de usuario.
 *
 * @function
 */
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const day = now.toLocaleDateString('es-ES', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());

  document.getElementById('clock').innerHTML = `${day}<br>${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

setInterval(updateClock, 1000);

updateClock();