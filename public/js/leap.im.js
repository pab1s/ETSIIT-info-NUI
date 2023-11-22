class LeapMotionController {
    constructor() {
      this.controller = new Leap.Controller();
      this.pointer = document.getElementById('pointer');
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
      if (frame.gestures.length > 0) {
        frame.gestures.forEach(gesture => {
          if (gesture.type === 'swipe') {
            this.handleSwipeGesture(gesture);
          }
        });
      }
    }
  
    handleSwipeGesture(gesture) {
      // Determinar la dirección del deslizamiento
      const swipeDirection = gesture.direction[0] > 0 ? 'right' : 'left';
  
      // Realizar acción basada en la dirección
      if (swipeDirection === 'right') {
        this.clickGuestAccessIDButton();
      } else {
        this.clickGuestAccessButton();
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
      this.controller.enableGesture(Leap.Gesture.TYPE_SWIPE, true);
  
      this.controller.connect();
      this.startTimeout();
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