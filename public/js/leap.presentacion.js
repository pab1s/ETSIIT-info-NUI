/**
 * @file Controlador Leap Motion para la página de inicio de sesión.
 * @author Ximo Sanz Tornero & Pablo Olivares Martinez
 * @version 1.3
 */

class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.tapCooldown = false;
    this.forwardGestureDetected = false;
  }

  onInit() {
    console.log('Leap Motion se ha inicializado.');
  }

  onExit() {
    console.log('Leap Motion se ha cerrado.');
  }

  onConnect() {
    console.log('Leap Motion se ha conectado.');
  }

  onDisconnect() {
    console.log('Leap Motion se ha desconectado.');
  }

  isIndexPointingForward(hand) {
    const indexFinger = hand.fingers.find(finger => finger.type === 1); // Tipo 1 es el dedo índice
  
    if (indexFinger) {
      const isIndexExtended = indexFinger.extended;
      const areOtherFingersExtended = hand.fingers.filter(finger => finger.type !== 1).some(finger => finger.extended);
  
      // Verificar que solo el dedo índice esté extendido y que ningún otro dedo lo esté
      return isIndexExtended && !areOtherFingersExtended && indexFinger.direction[2] < -0.7;
    }
  
    return false;
  }

 

  // Importante le quito funcionalidades al leap normal porque lo implementamos nosotros.
  onFrame(frame) {

    if (frame.hands.length > 0) {
      const hand = frame.hands[0];

      // Gesto para aceptar en los menús
      if (this.isIndexPointingForward(hand)) {
        if (!this.forwardGestureDetected) {
          this.forwardGestureDetected = true;
          this.startForwardGestureTimer();
        }
      } else {
        this.forwardGestureDetected = false;
        this.resetForwardGestureTimer();
      }

      // Gestos de tap in equivalente al del dedo índice cuando haya mejores condiciones de luz
      if (!this.forwardGestureDetected && hand.palmVelocity[2] < -700) {
        this.forwardGestureDetected = true;
      }
      if (this.forwardGestureDetected && hand.palmVelocity[2] > 700) {
        this.clickEnter();
        this.forwardGestureDetected = false;
      }
    }
  }

  startForwardGestureTimer() {
    this.forwardGestureTimer = setTimeout(() => {
      this.clickEnter(); // Realizar la acción después de 0.5 segundos
      this.resetForwardGestureTimer();
    }, 500); // Tiempo de espera de 0.5 segundos, ajustable según sea necesario
  }

  resetForwardGestureTimer() {
    if (this.forwardGestureTimer) {
      clearTimeout(this.forwardGestureTimer);
      this.forwardGestureTimer = null;
    }
  }

  startCooldown() {
    this.isInCooldown = true;
    setTimeout(() => {
      this.isInCooldown = false;
    }, 400); // Cooldown de 1 segundo, ajustable según necesidad
  }

  clickEnter() {
      const event = new KeyboardEvent('keydown', {
          key: 'Enter',
          keyCode: 13, // Código de tecla para Enter
          code: 'Enter',
          which: 13
      });
      document.dispatchEvent(event);
  }

   /**
     * Inicia el controlador Leap Motion y establece los manejadores de eventos.
     */
   start() {
        Leap.loop({ enableGestures: true }, (frame) => {
            this.onFrame(frame);
        });
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

// Timer
setInterval(() => {
  gesture_timer += 200;
}, 200);