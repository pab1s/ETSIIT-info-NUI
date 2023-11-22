/*
Abandono este tipo de implementacion, los css estan mal hecho es imposible adivinar donde esta el error sin 
revisar todo el codigo. Funciona el puntero pero nunca cosigue llegar hasta abajo, se tendria que agachar hasta 
el bajo de la pantalla 4K para presionar un boton a media altura.
*/

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
      console.log('Registra algo');
      if (frame.hands.length > 0) {
        const hand = frame.hands[0];
        const position = hand.palmPosition;
        const ciertaDistanciaX = 15;
    
        // Suponiendo que 'lastPosition' es una propiedad de la clase que guarda la última posición conocida de la mano
        if (this.lastPosition && position[0] < this.lastPosition[0] - ciertaDistanciaX) {
          console.log('Registra el gesto');
          // El usuario ha movido la mano hacia la izquierda
          this.clickGuestAccessButton();
        }
    
        // Actualiza la última posición de la mano
        this.lastPosition = position;
      }
    }
    
    clickGuestAccessButton() {
      const guestAccessButton = document.getElementById('guest-access');
      if (guestAccessButton) {
        guestAccessButton.click();
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