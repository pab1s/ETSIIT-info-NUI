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

  onFrame(frame) {
    if (frame.hands.length > 0) {
      const hand = frame.hands[0];

      // Gestos para cambiar de elemento en la lista
      if (!this.isInCooldown && hand.fingers.filter(finger => !finger.extended).length === 4) {
        this.clickNextButtonInList();
        this.startCooldown();
      }

      // Gestos de swipe
      if (hand.palmPosition[0] < -800) {
        this.clickBackButton();
      }

      // Gestos de "tap in"
      if (!this.forwardGestureDetected && hand.palmVelocity[2] < -800) {
        this.forwardGestureDetected = true;
      }
      if (this.forwardGestureDetected && hand.palmVelocity[2] > 800) {
        this.clickCurrentItemButton();
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


  // Función para hacer clic en el botón "Siguiente"
  clickNextButtonInList() {
    const nextButton = document.querySelector('.responsive-slider .next'); // Asumiendo que el botón "Siguiente" tiene la clase 'next'
    if (nextButton) {
      nextButton.click();
    }
  }

  // Función para hacer clic en el botón del elemento actual
  clickCurrentItemButton() {
    const currentItemButton = document.querySelector('.responsive-slider .act .act-button'); // Asumiendo que el botón del elemento actual tiene la clase 'act-button'
    if (currentItemButton) {
      currentItemButton.click();
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
