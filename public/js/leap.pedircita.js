/**
 * @file Controlador Leap Motion para la página de inicio de sesión.
 * @author Ximo Sanz Tornero & Pablo Olivares Martinez
 * @version 1.3
 */

// Variables globales
let gesture_timer = 0
let swipeDirection = ""
let navegandoFechas = true;


class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
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
            this.selectNextDate();
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
        this.clickSelectedDate();
        this.forwardGestureDetected = false;
      }
    }
  }

  startForwardGestureTimer() {
    this.forwardGestureTimer = setTimeout(() => {
      this.clickSelectedDate(); // Realizar la acción después de 0.5 segundos
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

  selectNextDate() {
    if (navegandoFechas) {
        // Simula la pulsación de la tecla de flecha derecha
        const event = new KeyboardEvent('keydown', { 'key': 'ArrowRight' });
        document.dispatchEvent(event);
    } else {
        // Simula la pulsación de la tecla de flecha hacia abajo
        const event = new KeyboardEvent('keydown', { 'key': 'ArrowDown' });
        document.dispatchEvent(event);
    }
  }

  clickSelectedDate() {
    if (navegandoFechas) {
        navegandoFechas = false; // Cambia al modo de navegación a horas
        this.changeButtonColorToRedForOneSecond();
    } else {
        navegandoFechas = true;
        // Simula la presión de la tecla Enter
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13, // Código de tecla para Enter
            code: 'Enter',
            which: 13
        });
        document.dispatchEvent(event);
    }
  }

  // AQUI HABRIA QUE HACER ALGO PARA QUE SE VIERA REALMENTE EL CAMBIO
  changeButtonColorToRedForOneSecond() {
    // Reemplaza 'current-hour-button-id' con el ID real del botón de la hora actual
    const currentHourButton = document.getElementById('body');
    if (currentHourButton) {
      currentHourButton.style.backgroundColor = 'red';

      // Cambia el color de vuelta después de 1 segundo
      setTimeout(() => {
          currentHourButton.style.backgroundColor = 'white';
      }, 1000);
    }
  }



  clickBackButton() {
      if (navegandoFechas) {
          // Si está navegando fechas, ejecuta la acción original
          const backButton = document.getElementById('vuelta-atras');
          if (backButton) {
              backButton.click();
          }
      } else {
          // Si está navegando horas, cambia a navegación de fechas
          navegandoFechas = true;
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
});

// Timer
setInterval(() => {
  gesture_timer += 200;
}, 200);

/*class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.tapCooldown = false;
    this.forwardGestureDetected = false;
    this.leftGestureDetected = false;
    this.lastClickTime = 0;
    this.selectedDateIndex = 0; // Índice de la fecha seleccionada
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


  onFrame(frame) {
    if (frame.hands.length > 0) {
      const hand = frame.hands[0];

      // Gestos para seleccionar la fecha
      if (this.isHandValid(hand)) {
        this.selectNextDate();
      }

      // Gestos de swipe
      if (!this.leftGestureDetected && hand.palmVelocity[0] < -300) { // Ajusta la sensibilidad según sea necesario
        this.leftGestureDetected = true;
      }

      if (this.leftGestureDetected && hand.palmVelocity[0] > 300) { // Ajusta la sensibilidad según sea necesario
        this.clickBackButton();
        this.leftGestureDetected = false;
      }

      // Gestos de tap in
      if (!this.forwardGestureDetected && hand.palmVelocity[2] < -700) {
        this.forwardGestureDetected = true;
      }
      if (this.forwardGestureDetected && hand.palmVelocity[2] > 700) {
        this.clickSelectedDate();
        this.forwardGestureDetected = false;
      }
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


  // Función para seleccionar la siguiente fecha
  selectNextDate() {
    const fechas = document.querySelectorAll('#fechas-container .fecha');
    if (fechas.length > 0) {
      // Eliminar la clase 'selected' de la fecha actual
      fechas[this.selectedDateIndex].classList.remove('selected');

      // Incrementar el índice y asegurar que no sobrepase la cantidad de fechas
      this.selectedDateIndex = (this.selectedDateIndex + 1) % fechas.length;

      // Añadir la clase 'selected' a la nueva fecha seleccionada
      fechas[this.selectedDateIndex].classList.add('selected');
    }
  }

  // Función para hacer clic en la fecha seleccionada
  clickSelectedDate() {
    const fechas = document.querySelectorAll('#fechas-container .fecha');
    if (fechas.length > 0 && fechas[this.selectedDateIndex]) {
      fechas[this.selectedDateIndex].click();
    }
  }


  start() {
    this.controller.on('init', this.onInit.bind(this));
    this.controller.on('exit', this.onExit.bind(this));
    this.controller.on('connect', this.onConnect.bind(this));
    this.controller.on('disconnect', this.onDisconnect.bind(this));
    this.controller.on('frame', this.onFrame.bind(this));

    this.controller.connect();
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
*/