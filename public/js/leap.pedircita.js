class LeapMotionController {
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
