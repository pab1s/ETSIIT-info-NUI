let tiempoUltimoClick = Date.now();

function resetearTiempo() {
  tiempoUltimoClick = Date.now();
}

function verificarTiempo() {
  const tiempoActual = Date.now();
  const tiempoTranscurrido = tiempoActual - tiempoUltimoClick;

  if (tiempoTranscurrido > 60000) { // Si no se hace nada en un minuto se vuelve a presentacion 
    // Realizar acciones o pulsar el botón automáticamente
    document.getElementById('timeout').click();
  }
}

// Configurar eventos
document.getElementById('timeout').addEventListener('click', resetearTiempo);

setInterval(verificarTiempo, 5000); // Verificar cada 5 segundos
