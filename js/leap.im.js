const Leap = require('leapjs');

class LeapMotionController {
    constructor() {
      this.controller = new Leap.Controller();
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
  
  const leapMotionController = new LeapMotionController();
  leapMotionController.start();
  