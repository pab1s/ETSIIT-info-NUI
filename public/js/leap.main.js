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
        this.tapCooldown = false;
        this.forwardGestureDetected = false;
        this.lastClickTime = 0;
    }

    clickCurrentItemButton() {
      const currentItemButton = document.querySelector('.responsive-slider .act .act-button'); // Asumiendo que el botón del elemento actual tiene la clase 'act-button'
      if (currentItemButton) {
        currentItemButton.click();
      }
    }


      // Función para hacer clic en el botón "Siguiente"
    clickNextButtonInList() {
      const nextButton = document.querySelector('.responsive-slider .next'); // Asumiendo que el botón "Siguiente" tiene la clase 'next'
      if (nextButton) {
        nextButton.click();
      }
    }

    isHandValid(hand) {
      return hand.fingers.filter(finger => finger.type !== 0).every(finger => {
          return finger.extended && finger.direction[1] < -0.7;
      });
    }

    clickBackButton() {
      const backButton = document.getElementById('vuelta-atras');
      if (backButton) {
        backButton.click();
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

    /**
     * Manejador de eventos cuando se obtiene un nuevo frame del Leap Motion.
     *
     * @param {Leap.Frame} frame - Marco de Leap Motion.
     */
onFrame(frame) {
    let gestureString = "";

    if (frame.gestures.length > 0) {
        for (var i = 0; i < frame.gestures.length; i++) {
            var gesture = frame.gestures[i];

            switch (gesture.type) {
                case "swipe":
                    let isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);

                    if (gesture_timer > 1500) {
                        if (isHorizontal) {
                            if (gesture.direction[0] > 0) {
                                swipeDirection = "right";
                                console.log("Moviste hacia la derecha");
                            } else {
                                swipeDirection = "left";
                                this.clickNextButtonInList();
                            }
                        } else {
                            if (gesture.direction[1] > 0) {
                                swipeDirection = "up";
                                this.clickBackButton();
                            } else {
                                swipeDirection = "down";
                                console.log("Debería iniciar sesión");
                            }
                        }
                        console.log(swipeDirection);
                        gesture_timer = 0;
                    }
                    break;

                case "screenTap":
                    this.clickCurrentItemButton();
                    break;

                case "keyTap":
                    console.log("Ha tocado una tecla");
                    break;

                default:
                    gestureString += "unknown gesture type";
            }
        }
    }
  
    // Lógica para detectar el nuevo gesto de bajar los dedos
    if (frame.hands.length > 0) {
        const hand = frame.hands[0];

        if (this.isHandValid(hand)) {
            const currentTime = new Date().getTime();
            if (currentTime - this.lastClickTime > 400) {
              console.log("BAJASTE LOS DEDOS");
              this.lastClickTime = currentTime;
            }
        }
    }
}


// DOM Ready Event
window.addEventListener('DOMContentLoaded', (event) => {
    const leapMotionController = new LeapMotionController();
    leapMotionController.start();
});

// Timer
setInterval(() => {
    gesture_timer += 200;
  }, 200);
