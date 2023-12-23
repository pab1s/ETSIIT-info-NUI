/**
 * @file Controlador Leap Motion para la página de inicio de sesión.
 * @author Ximo Sanz Tornero & Pablo Olivares Martinez
 * @version 1.3
 */

// Variables globales
let gesture_timer = 0
let swipeDirection = ""

class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.selectedButton = 'guest';
    this.toggleButtonColor();
    this.tapCooldown = false;
    this.forwardGestureDetected = false;
    this.leftGestureDetected = false;
    this.lastClickTime = 0;
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

  isHandValid(hand) {
    return hand.fingers.filter(finger => finger.type !== 0).every(finger => {
        return finger.extended && finger.direction[1] < -0.7;
    });
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

      // Gestos para moverse en la lista
      if (this.isHandValid(hand)) {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastClickTime > 400) {
            this.toggleSelectedButton();
            this.lastClickTime = currentTime;
        }
      }

      // Gestos de swipe
      if (!this.leftGestureDetected && hand.palmVelocity[0] < -300) { // Ajusta la sensibilidad según sea necesario
        this.leftGestureDetected = true;
      }

      if (this.leftGestureDetected && hand.palmVelocity[0] > 300) { // Ajusta la sensibilidad según sea necesario
        this.clickBackButton();                                     // Añadir presentacion de como usar el leap
        this.leftGestureDetected = false;
      }

      // Gestos de tap in equivalente al del dedo índice cuando haya mejores condiciones de luz
      if (!this.forwardGestureDetected && hand.palmVelocity[2] < -700) {
        this.forwardGestureDetected = true;
      }
      if (this.forwardGestureDetected && hand.palmVelocity[2] > 700) {
        this.clickSelectedButton();
        this.forwardGestureDetected = false;
      }
    }
  }

  startForwardGestureTimer() {
    this.forwardGestureTimer = setTimeout(() => {
      this.clickSelectedButton();
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

  // Con este boton se vuelve a la presentación de la página
  clickBackButton() {
    const backButton = document.getElementById('vuelta-atras');
    if (backButton) {
      backButton.click();
    }
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