/**
 * @file leap.im.js - Script para el controlador Leap Motion de la aplicación web de la ETSIT.
 * @author Ximo Sanz Tornero
 * @version 1.2
 */

/**
 * Clase que representa el controlador Leap Motion para la aplicación web de la ETSIT.
 *
 * @class
 * @version 1.2
 */
class LeapMotionController {

  /**
   * Constructor de la clase LeapMotionController.
   */
  constructor() {
    this.controller = new Leap.Controller({ enableGestures: true });
    this.selectedButton = 'guest';
    this.toggleButtonColor();
    this.tapCooldown = false;
    this.forwardGestureDetected = false;
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
   * Manejador de eventos cuando se obtiene un nuevo frame del Leap Motion.
   *
   * @param {Leap.Frame} frame - Marco de Leap Motion.
   */
  onFrame(frame) {
    if (frame.hands.length > 0) {
      const hand = frame.hands[0];
      
      if (!this.isInCooldown && hand.fingers.filter(finger => !finger.extended && finger.type !== 0).length === 4) {
        this.toggleSelectedButton();
        this.startCooldown(); // Iniciar el cooldown después de ejecutar la acción
      }

      // Detectar la primera parte del gesto "tap in" (movimiento hacia adelante)
      if (!this.forwardGestureDetected && hand.palmVelocity[2] < -800) {
        this.forwardGestureDetected = true;
      }

      // Detectar la segunda parte del gesto "tap in" (movimiento hacia atrás)
      if (this.forwardGestureDetected && hand.palmVelocity[2] > 800) {
        this.clickSelectedButton();
        this.forwardGestureDetected = false; // Resetear para el próximo gesto
      }
    }
  }

  /**
   * Inicia el cooldown para evitar acciones consecutivas.
   */
  startCooldown() {
    this.isInCooldown = true;
    setTimeout(() => {
      this.isInCooldown = false;
    }, 400);
  }

  /**
   * Inicia el cooldown para evitar acciones consecutivas de "tap".
   */
  startTapCooldown() {
    this.tapCooldown = true;
    setTimeout(() => {
      this.tapCooldown = false;
    }, 150);
  }

  /**
   * Alterna entre los botones 'guest' e 'id' y actualiza su color.
   */
  toggleSelectedButton() {
    this.selectedButton = this.selectedButton === 'guest' ? 'id' : 'guest';
    this.toggleButtonColor();
  }

  /**
   * Actualiza el color del botón activo.
   */
  toggleButtonColor() {
    const guestButton = document.getElementById('guest-access');
    const idButton = document.getElementById('authenticate');

    if (guestButton && idButton) {
      // Quitar la clase 'selected' de ambos botones
      guestButton.classList.remove('selected');
      idButton.classList.remove('selected');

      // Añadir la clase 'selected' al botón activo
      if (this.selectedButton === 'guest') {
        guestButton.classList.add('selected');
      } else if (this.selectedButton === 'id') {
        idButton.classList.add('selected');
      }
    }
  }

  /**
   * Ejecuta la acción correspondiente al botón seleccionado.
   */
  clickSelectedButton() {
    if (this.selectedButton === 'guest') {
      this.clickGuestAccessButton();
    } else if (this.selectedButton === 'id') {
      this.clickGuestAccessIDButton();
    }
  }

  /**
   * Simula el clic en el botón de acceso de invitado.
   */
  clickGuestAccessButton() {
    const guestAccessButton = document.getElementById('guest-access');
    if (guestAccessButton) {
      guestAccessButton.click();
    }
  }

  /**
   * Simula el clic en el botón de acceso ID.
   */
  clickGuestAccessIDButton() {
    const idAccessButton = document.getElementById('authenticate');
    if (idAccessButton) {
      idAccessButton.click();
    }
  }

  /**
   * Inicia el controlador Leap Motion y establece los manejadores de eventos.
   */
  start() {
    this.controller.on('init', this.onInit.bind(this));
    this.controller.on('exit', this.onExit.bind(this));
    this.controller.on('connect', this.onConnect.bind(this));
    this.controller.on('disconnect', this.onDisconnect.bind(this));
    this.controller.on('frame', this.onFrame.bind(this));

    this.controller.connect();
  }

  /**
   * Detiene el controlador Leap Motion.
   */
  stop() {
    this.controller.disconnect();
  }
}

/**
 * Manejador de eventos cuando el DOM está listo, instancia y arranca el Leap Motion Controller.
 */
window.addEventListener('DOMContentLoaded', (event) => {
  const leapMotionController = new LeapMotionController();
  leapMotionController.start();
});
