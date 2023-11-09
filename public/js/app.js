Leap.loop(function(frame) {
  // Aquí procesarás la información de los gestos
  frame.hands.forEach(function(hand, index) {
    // Aquí puedes detectar gestos y movimientos
    // Por ejemplo, si la mano está apuntando a algún icono específico
    if (hand.indexFinger.extended) {
      // Lógica para seleccionar un icono
      selectIcon(hand.indexFinger.tipPosition);
    }
  });
});

function selectIcon(position) {
  // Implementa la lógica para determinar qué icono se está seleccionando
  // Esto dependerá de la posición del dedo y la ubicación de los iconos en la pantalla
}
