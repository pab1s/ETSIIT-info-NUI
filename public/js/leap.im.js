// const Leap = require('leapjs');

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
        console.log('Timestamp:', frame.timestamp);
      
        if (frame.hands) {
          frame.hands.forEach((hand, index) => {
            console.log(`Mano ${index + 1}:`);
            console.log(`  ID: ${hand.id}`);
            console.log(`  Tipo de mano: ${hand.type}`);
            console.log(`  Posición: (${hand.palmPosition[0]}, ${hand.palmPosition[1]}, ${hand.palmPosition[2]})`);
            console.log(`  Dirección: (${hand.direction[0]}, ${hand.direction[1]}, ${hand.direction[2]})`);
          });
        }
      
        if (frame.fingers) {
          frame.fingers.forEach((finger, index) => {
            console.log(`Dedo ${index + 1}:`);
            console.log(`  ID: ${finger.id}`);
            console.log(`  Tipo de dedo: ${finger.type}`);
            console.log(`  Posición: (${finger.tipPosition[0]}, ${finger.tipPosition[1]}, ${finger.tipPosition[2]})`);
          });
        }
      
        if (frame.tools) {
          frame.tools.forEach((tool, index) => {
            console.log(`Herramienta ${index + 1}:`);
            console.log(`  ID: ${tool.id}`);
            console.log(`  Posición: (${tool.tipPosition[0]}, ${tool.tipPosition[1]}, ${tool.tipPosition[2]})`);
          });
        }
      
        if (frame.gestures) {
          frame.gestures.forEach((gesture, index) => {
            console.log(`Gesto ${index + 1}:`);
            console.log(`  Tipo: ${gesture.type}`);
            console.log(`  Estado: ${gesture.state}`);
          });
        }

        if (frame.hands.length > 0) {
            const hand = frame.hands[0]; // Usa la primera mano detectada
            const handX = hand.palmPosition[0];
            const handY = hand.palmPosition[1];

            // Mapeo de las coordenadas de Leap a las coordenadas de la pantalla (ajusta según sea necesario)
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const screenX = (handX + 150) * screenWidth / 300; // Centramos el eje X: 0 está en el medio de la pantalla
            const screenY = screenHeight - (handY + 150) * screenHeight / 300; // Centramos el eje Y y lo invertimos para que coincida con el sistema de coordenadas de la pantalla

            // Setear la posición del puntero
            this.pointer.style.left = `${screenX}px`;
            this.pointer.style.top = `${screenY}px`;

            this.handleVerticalScroll(hand);
        }
    }

    handleVerticalScroll(hand) {
        // Obtén la velocidad en el eje Y de la mano
        const verticalSpeed = hand.palmVelocity[1];
    
        // Definir una sensibilidad para determinar qué tan rápido debe moverse la mano para que se registre como scroll
        const sensitivity = 200;
    
        if (Math.abs(verticalSpeed) > sensitivity) {
          // Convertir la velocidad de la mano en un valor de scroll
          // Usar un divisor para disminuir la velocidad de scroll
          const scrollAmount = verticalSpeed / 2;
          
          // Ejecutar el scroll
          window.scrollBy(0, -scrollAmount);
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