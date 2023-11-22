class LeapMotionController {
    constructor() {
      this.controller = new Leap.Controller();
      this.pointer = document.getElementById('pointer');
      this.menuItems = document.querySelectorAll('.menu-item');
      this.selectedMenuItemIndex = 0; // Índice del menú seleccionado
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
        const ciertaDistanciaXiz = 13;
        const ciertaDistanciaXder = 20;
        const ciertaDistanciaY = 10;
    
        if (this.lastPosition) {
          if (position[0] < this.lastPosition[0] - ciertaDistanciaXiz) {
            // El usuario ha movido la mano hacia la izquierda
            this.clickVueltaMenuButton();
          } else if (position[0] > this.lastPosition[0] + ciertaDistanciaXder) {
            // El usuario ha movido la mano hacia la derecha
            this.clickMenuButton();
          } else if (position[1] < this.lastPosition[1] - ciertaDistanciaY) {
            // El usuario ha movido la mano hacia abajo
            this.navigateMenuItems();
          }
        }
    
        // Actualiza la última posición de la mano
        this.lastPosition = position;
      }
    }    
    
    navigateMenuItems() {
      // Desmarca el ítem de menú actualmente seleccionado
      this.menuItems[this.selectedMenuItemIndex].classList.remove('selected');
      // Incrementa el índice y envuélvelo si es necesario
      this.selectedMenuItemIndex = (this.selectedMenuItemIndex + 1) % this.menuItems.length;
      // Marca el nuevo ítem de menú seleccionado
      this.menuItems[this.selectedMenuItemIndex].classList.add('selected');
    }

    clickMenuButton() {
      // Obtener el botón del menú seleccionado
      const selectedButton = this.menuItems[this.selectedMenuItemIndex].querySelector('button');
      if (selectedButton) {
        this.startTimeout();
        selectedButton.click();
      }
    }

    clickVueltaMenuButton() {
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

      this.startTimeout();

      // Marcar el primer elemento del menú como seleccionado
      if (this.menuItems.length > 0) {
        this.menuItems[0].classList.add('selected');
 }
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