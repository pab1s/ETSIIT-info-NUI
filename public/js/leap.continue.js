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
    this.tapCooldown = false;
    this.forwardGestureDetected = false;
    this.leftGestureDetected = false;
    this.lastClickTime = 0;
    this.currentButtonIndex = 0;
    this.buttons = [];
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
    let gestureString = "";

    if (frame.gestures.length > 0) {
        for (var i = 0; i < frame.gestures.length; i++) {
            var gesture = frame.gestures[i];

            switch (gesture.type) {
                case "swipe":
                    let isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);

                    if (gesture_timer > 1500) {
                        if (!isHorizontal) {
                            if (gesture.direction[1] > 0) {
                                swipeDirection = "up";
                                this.clickLoginButton();
                            } 
                        }
                        console.log(swipeDirection);
                        gesture_timer = 0;
                    }
                    break;

                default:
                    gestureString += "unknown gesture type";
            }
        }
    }

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
            this.clickNextButtonInList();
            this.lastClickTime = currentTime;
        }
      }

      // Gestos de swipe
      if (!this.leftGestureDetected && hand.palmVelocity[0] < -300) { // Ajusta la sensibilidad según sea necesario
        this.leftGestureDetected = true;
      }

      if (this.leftGestureDetected && hand.palmVelocity[0] > 300) { // Ajusta la sensibilidad según sea necesario
        this.clickBackButton();
        this.leftGestureDetected = false;
      }

      // Gestos de tap in equivalente al del dedo índice cuando haya mejores condiciones de luz
      if (!this.forwardGestureDetected && hand.palmVelocity[2] < -700) {
        this.forwardGestureDetected = true;
      }
      if (this.forwardGestureDetected && hand.palmVelocity[2] > 700) {
        this.clickCurrentItemButton();
        this.forwardGestureDetected = false;
      }
    }
  }

  startForwardGestureTimer() {
    this.forwardGestureTimer = setTimeout(() => {
      this.clickCurrentItemButton(); // Realizar la acción después de 0.5 segundos
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

  clickBackButton() {
    const backButton = document.getElementById('vuelta-atras');
    if (backButton) {
      backButton.click();
    }
  }

  // Función para cambiar entre los botones
  clickNextButtonInList() {
    if (this.buttons.length === 0) {
      // Inicializa la lista de botones la primera vez
      this.buttons = Array.from(document.querySelectorAll('.button-container button'));
      // Marca el primer botón como seleccionado al cargar la página
      this.selectButton(0);
    }

    // Cambia el índice del botón actual
    this.currentButtonIndex = (this.currentButtonIndex + 1) % this.buttons.length;
    
    // Marca el botón actualmente seleccionado
    this.selectButton(this.currentButtonIndex);
  }

  // Función para marcar un botón como seleccionado
  selectButton(index) {
    // Elimina la clase 'selected' de todos los botones
    this.buttons.forEach(button => button.classList.remove('selected'));

    // Añade la clase 'selected' al botón actual
    this.buttons[index].classList.add('selected');
  }

  // Función para hacer clic en el botón actualmente seleccionado
  clickCurrentItemButton() {
    if (this.buttons.length > 0 && this.buttons[this.currentButtonIndex]) {
      this.buttons[this.currentButtonIndex].click();
    }
  }


  // Función para presionar el boton de iniciar / cerrar sesión
  clickLoginButton() {
    const loginButton = document.getElementById('auth-button');
    if (loginButton) {
      loginButton.click();
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
  leapMotionController.clickNextButtonInList(); // Esto lo hacemos para que al entrar ya haya algo seleccionado
});

// Timer
setInterval(() => {
  gesture_timer += 200;
}, 200);