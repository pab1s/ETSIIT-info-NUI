/**
 * @file leap.im.js - Script para el controlador Leap Motion de la aplicación web de la ETSIT.
 * @author Pablo Olivares Martinez & Ximo Sanz Tornero
 * @version 1.0
 */

/**
 * DISCLAIMER: Este script está en desuso. Se ha reemplazado por el script leap.im.js.
 * Abandono este tipo de implementacion, los css estan mal hecho es imposible adivinar 
 * donde esta el error sin revisar todo el codigo. Funciona el puntero pero nunca 
 * consigue llegar hasta abajo, se tendria que agachar hasta el bajo de la pantalla 
 * 4K para presionar un boton a media altura.
*/

/**
 * Clase que representa el controlador Leap Motion para la aplicación web de la ETSIT.
 *
 * @class
 * @version 1.0
 */
class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.pointer = document.getElementById('pointer');
  }
  /**
   * Manejador de eventos cuando se inicializa el Leap Motion.
   */
  onInit() {
    console.log('Leap Motion se ha inicializado.');
  }

  /**
   * Manejador de eventos cuando se cierra el Leap Motion.
   */
  onExit() {
    console.log('Leap Motion se ha cerrado.');
  }

  /**
   * Manejador de eventos cuando se conecta el Leap Motion.
   */
  onConnect() {
    console.log('Leap Motion se ha conectado.');
  }

  /**
   * Manejador de eventos cuando se desconecta el Leap Motion.
   */
  onDisconnect() {
    console.log('Leap Motion se ha desconectado.');
  }

  /**
   * Inicializa la posición del puntero en el centro de la pantalla.
   */
  initializePointerPosition() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Posicionar el puntero en el centro de la pantalla
    this.pointer.style.left = `${screenWidth / 2}px`;
    this.pointer.style.top = `${screenHeight / 2}px`;
  }

  /**
   * Manejador de eventos cuando se obtiene un nuevo frame del Leap Motion.
   * Se encarga de mover el puntero según la posición de la mano.
   *
   * @param {Leap.Frame} frame - Marco de Leap Motion.
   */
  onFrame(frame) {
    if (frame.hands.length > 0) {
      const hand = frame.hands[0];

      // Verifica si los cuatro dedos (índice, medio, anular, meñique) están extendidos y el pulgar no
      const isCorrectFingerPosture = hand.fingers.every(finger => {
        if (finger.type === 0) { // Pulgar
          return !finger.extended;
        } else {
          return finger.extended;
        }
      });

      if (isCorrectFingerPosture) {
        const handX = hand.palmPosition[0];
        const handY = hand.palmPosition[1];
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Ajustes para una mayor sensibilidad y centrar el puntero
        const sensitivityXMultiplier = 2; // Aumentar para más sensibilidad
        const sensitivityYMultiplier = 8; // Aumentar para más sensibilidad
        const centerOffsetX = screenWidth / 2;
        const centerOffsetY = screenHeight * 10 / 11;
        const screenX = ((handX * sensitivityXMultiplier) + centerOffsetX);
        const screenY = centerOffsetY - (handY * sensitivityYMultiplier);

        this.pointer.style.left = `${screenX}px`;
        this.pointer.style.top = `${screenY}px`;

        // Desplazamiento automático al llegar a los bordes superior/inferior
        this.autoScroll(screenY);
      }
    }
  }

  /**
   * Desplaza la página automáticamente cuando el puntero llega a los bordes 
   * superior/inferior de la pantalla.
   * 
   * @param {number} screenY - Posición Y del puntero en la pantalla.
   */
  autoScroll(screenY) {
    const scrollThreshold = 50; // Distancia en píxeles desde el borde para activar el desplazamiento
    const scrollSpeed = 30; // Velocidad de desplazamiento

    if (screenY < scrollThreshold) {
      // Desplazarse hacia arriba
      window.scrollBy(0, -scrollSpeed);
    } else if (screenY > (window.innerHeight - scrollThreshold)) {
      // Desplazarse hacia abajo
      window.scrollBy(0, scrollSpeed);
    }
  }

  /**
   * Arranca el Leap Motion Controller. Registra los manejadores de eventos.
   */
  log(frame) {
    console.log('Timestamp:', frame.timestamp);

    if (frame.hands) {
      frame.hands.forEach((hand, index) => {
        console.log(`Mano ${index + 1}:`);
        console.log(`  ID: ${hand.id}`);
        console.log(`  Tipo de mano: ${hand.type}`);
        console.log(`  Posición: (${hand.palmPosition[0]}, ${hand.palmPosition[1]}, ${hand.palmPosition[2]})`);
        console.log(`  Dirección: (${hand.direction[0]}, ${hand.direction[1]}, ${hand.direction[2]})`);
      });
    }

    if (frame.fingers) {
      frame.fingers.forEach((finger, index) => {
        console.log(`Dedo ${index + 1}:`);
        console.log(`  ID: ${finger.id}`);
        console.log(`  Tipo de dedo: ${finger.type}`);
        console.log(`  Posición: (${finger.tipPosition[0]}, ${finger.tipPosition[1]}, ${finger.tipPosition[2]})`);
      });
    }

    if (frame.tools) {
      frame.tools.forEach((tool, index) => {
        console.log(`Herramienta ${index + 1}:`);
        console.log(`  ID: ${tool.id}`);
        console.log(`  Posición: (${tool.tipPosition[0]}, ${tool.tipPosition[1]}, ${tool.tipPosition[2]})`);
      });
    }

    if (frame.gestures) {
      frame.gestures.forEach((gesture, index) => {
        console.log(`Gesto ${index + 1}:`);
        console.log(`  Tipo: ${gesture.type}`);
        console.log(`  Estado: ${gesture.state}`);
      });
    }

    if (frame.hands.length > 0) {
      const hand = frame.hands[0]; // Usa la primera mano detectada
      const handX = hand.palmPosition[0];
      const handY = hand.palmPosition[1];

      // Mapeo de las coordenadas de Leap a las coordenadas de la pantalla (ajusta según sea necesario)
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const screenX = (handX + 150) * screenWidth / 300; // Centramos el eje X: 0 está en el medio de la pantalla
      const screenY = screenHeight - (handY + 150) * screenHeight / 300; // Centramos el eje Y y lo invertimos para que coincida con el sistema de coordenadas de la pantalla

      // Setear la posición del puntero
      this.pointer.style.left = `${screenX}px`;
      this.pointer.style.top = `${screenY}px`;

      this.handleVerticalScroll(hand);
    }
  }
  
  /**
   * Maneja el scroll vertical de la página.
   * 
   * @param {Leap.Hand} hand - Mano detectada por Leap Motion.
   */
  handleVerticalScroll(hand) {
    // Obtén la velocidad en el eje Y de la mano
    const verticalSpeed = hand.palmVelocity[1];

    // Definir una sensibilidad para determinar qué tan rápido debe moverse la mano para que se registre como scroll
    const sensitivity = 200;

    if (Math.abs(verticalSpeed) > sensitivity) {
      // Convertir la velocidad de la mano en un valor de scroll
      // Usar un divisor para disminuir la velocidad de scroll
      const scrollAmount = verticalSpeed / 2;

      // Ejecutar el scroll
      window.scrollBy(0, -scrollAmount);
    }
  }

  /**
   * Arranca el Leap Motion Controller. Registra los manejadores de eventos.
   */
  start() {
    this.controller.on('init', this.onInit.bind(this));
    this.controller.on('exit', this.onExit.bind(this));
    this.controller.on('connect', this.onConnect.bind(this));
    this.controller.on('disconnect', this.onDisconnect.bind(this));
    this.controller.on('frame', this.onFrame.bind(this));

    this.controller.connect();

    this.initializePointerPosition(); // Inicializar la posición del puntero
  }

  stop() {
    this.controller.disconnect();
  }
}

// Cuando el DOM esté listo, instancia y arranca el Leap Motion Controller
window.addEventListener('DOMContentLoaded', (event) => {
  const leapMotionController = new LeapMotionController();
  leapMotionController.start();
});