class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.isInTimeout = false;
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
      const position = hand.palmPosition;
      const ciertaDistanciaX = 13;
  
      // Movimiento hacia la izquierda para invitado
      if (this.lastPosition && position[0] < this.lastPosition[0] - ciertaDistanciaX) {
        this.clickGuestAccessButton();
      }
      // Movimiento hacia la derecha para autenticarse
      if (this.lastPosition && position[0] > this.lastPosition[0] + ciertaDistanciaX) {
        this.clickGuestAccessIDButton();
      }
  
      // Actualiza la última posición de la mano
      this.lastPosition = position;
    }
  }
  
  clickGuestAccessButton() {
    const guestAccessButton = document.getElementById('guest-access');
    if (guestAccessButton) {
      this.startTimeout();
      guestAccessButton.click();
    }
  }
  
  clickGuestAccessIDButton() {
    const guestAccessButton = document.getElementById('authenticate');
    if (guestAccessButton) {
      this.startTimeout();
      guestAccessButton.click();
    }
  }

  startTimeout() {
    this.isInTimeout = true;
    setTimeout(() => {
      this.isInTimeout = false;
    }, 20000); // Espera de 1 segundo
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