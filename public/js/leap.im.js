class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.isInTimeout = false;
    this.lastPosition = null;}

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
      const ciertaDistanciaXder = 15;
  
      // Movimiento hacia la izquierda para invitado
      if (this.lastPosition && position[0] < this.lastPosition[0] - ciertaDistanciaX) {
        this.clickGuestAccessButton();
      }
      // Movimiento hacia la derecha para autenticarse
      if (this.lastPosition && position[0] > this.lastPosition[0] + ciertaDistanciaXder) {
        this.clickGuestAccessIDButton();
      }
  
      // Actualiza la última posición de la mano
      this.lastPosition = position;
    }
  }
  
  clickGuestAccessButton() {
    const guestAccessButton = document.getElementById('guest-access');
    this.startTimeout();  
    if (guestAccessButton) {
      guestAccessButton.click();
    }
  }
  
  clickGuestAccessIDButton() {
    // Primero, intentamos cerrar cualquier stream de cámara activo.
    this.closeCameraStreams();
  
    // Luego, desactivamos el Leap Motion.
    this.deactivateLeapMotion();
  
    // Esperamos un poco para que el hardware de la cámara se libere tras desconectar el Leap Motion.
    setTimeout(() => {
      // Ahora intentamos acceder al botón de autenticación.
      const guestAccessButton = document.getElementById('authenticate');
      if (guestAccessButton) {
        guestAccessButton.click();
      }
  
      // Después de intentar la autenticación, esperamos 10 segundos antes de reactivar el Leap Motion.
      setTimeout(() => {
        this.activateLeapMotion();
      }, 10000);
    }, 1000); // Retraso para dar tiempo a la cámara de liberarse, ajusta este tiempo según sea necesario.
  }
  
  closeCameraStreams() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      })
      .catch(err => console.error('Error al cerrar streams de la cámara:', err));
  }
  
  deactivateLeapMotion() {
    this.controller.disconnect(); // Desconectar el Leap Motion
  }
  
  activateLeapMotion() {
    // Antes de reconectar el Leap Motion, asegurémonos de que los streams de la cámara están cerrados.
    this.closeCameraStreams();
    setTimeout(() => {
      this.controller.connect(); // Reconectar el Leap Motion
    }, 1000); // Retraso para dar tiempo a la cámara de ser cerrada, ajusta este tiempo según sea necesario.
  }
  
  startTimeout() {
    this.isInTimeout = true;
    setTimeout(() => {
      this.isInTimeout = false;
    }, 3000); // Espera de 1 segundo y medio
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