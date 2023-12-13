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
        this.selectedButton = 'guest';
        this.toggleButtonColor();
        this.tapCooldown = false;
        this.forwardGestureDetected = false;
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
                    /*
                    case "circle":
                        if (gesture_timer > 1500) {
                            console.log("Ha hecho un círculo")
                            gesture_timer = 0
                        }
                        break;
                        */

                    case "swipe":
                        let isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);

                        if (gesture_timer > 1500) {
                            if (isHorizontal) {
                                if (gesture.direction[0] > 0) {
                                    swipeDirection = "right";
                                    this.toggleSelectedButton();
                                } else {
                                    swipeDirection = "left";
                                }
                            } else {
                                if (gesture.direction[1] > 0) {
                                    swipeDirection = "up";
                                } else {
                                    swipeDirection = "down";
                                }
                            }
                            console.log(swipeDirection);
                            gesture_timer = 0
                        }
                        break;

                    case "screenTap":
                        console.log("Ha tocado la pantalla")
                        this.clickSelectedButton();
                        break;

                    case "keyTap":
                        console.log("Ha tocado una tecla")
                        break;

                    default:
                        gestureString += "unknown gesture type";
                }
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
