class LeapMotionController {
    constructor() {
      this.controller = new Leap.Controller();
      this.pointer = document.getElementById('pointer');
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
    
        // Suponiendo que 'lastPosition' es una propiedad de la clase que guarda la última posición conocida de la mano
        if (this.lastPosition && position[0] < this.lastPosition[0] - ciertaDistanciaX) {
          // El usuario ha movido la mano hacia la izquierda
          this.clickMenuButton();
        }
    
        // Actualiza la última posición de la mano
        this.lastPosition = position;
      }
    }
    
    clickMenuButton() {
      const guestAccessButton = document.getElementById('vuelta-menu');
      if (guestAccessButton) {
        this.startTimeout();
        guestAccessButton.click();
      }
    } 
    
    startTimeout() {
      this.isInTimeout = true;
      setTimeout(() => {
        this.isInTimeout = false;
      }, 20000); // Pequeña espera para que no se acumulen gestos
    }
      
    start() {
      this.controller.on('init', this.onInit.bind(this));
      this.controller.on('exit', this.onExit.bind(this));
      this.controller.on('connect', this.onConnect.bind(this));
      this.controller.on('disconnect', this.onDisconnect.bind(this));
      this.controller.on('frame', this.onFrame.bind(this));
  
      this.controller.connect();

      this.initializePointerPosition(); // Inicializar la posición del puntero
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