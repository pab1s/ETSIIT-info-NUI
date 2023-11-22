class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.menuItems = document.querySelectorAll('.menu-item');
    this.selectedMenuItemIndex = 0; // Índice del menú seleccionado
    this.isInTimeout = false;
    this.lastPosition = null;
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
    if (!this.isInTimeout && frame.hands.length > 0) {
      const hand = frame.hands[0];
      const position = hand.palmPosition;
      this.processHandMovement(position, hand);
    }
  }

  processHandMovement(position, hand) {
    const ciertaDistanciaXiz = 20;
    const ciertaDistanciaXder = 20;

    if (this.lastPosition) {
      if (position[0] < this.lastPosition[0] - ciertaDistanciaXiz) {
        this.clickVueltaMenuButton();
      } else if (position[0] > this.lastPosition[0] + ciertaDistanciaXder) {
        this.clickMenuButton();
      } else if (this.areFingersPointingDown(hand)) {
        this.navigateMenuItems();
      }
    }
    this.lastPosition = position;
  }    
  
  areFingersPointingDown(hand) {
    const umbralDedos = 0.7;
    // Comienza desde 1 para excluir el pulgar (índice 0)
    for (let i = 1; i < hand.fingers.length; i++) {
      if (hand.fingers[i].direction[1] >= -umbralDedos) {
        return false;
      }
    }
    return true;
  }
  
  navigateMenuItems() {
    // Desmarca el ítem de menú actualmente seleccionado
    this.menuItems[this.selectedMenuItemIndex].classList.remove('selected');
    // Incrementa el índice y envuélvelo si es necesario
    this.selectedMenuItemIndex = (this.selectedMenuItemIndex + 1) % this.menuItems.length;
    // Marca el nuevo ítem de menú seleccionado
    this.menuItems[this.selectedMenuItemIndex].classList.add('selected');
    this.startTimeout();
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
    }, 1000); // Pequeña espera para que no se acumulen gestos
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

/*
Aqui funciona mas o menos con movimientos arriba y abajo

class LeapMotionController {
    constructor() {
      this.controller = new Leap.Controller();
      this.menuItems = document.querySelectorAll('.menu-item');
      this.selectedMenuItemIndex = 0; // Índice del menú seleccionado
      this.isInTimeout = false;
      this.lastPosition = null;
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
      if (!this.isInTimeout && frame.hands.length > 0) {
        const hand = frame.hands[0];
        const position = hand.palmPosition;
        this.processHandMovement(position);
      }
    }
  
    processHandMovement(position) {
      const ciertaDistanciaXiz = 10;
      const ciertaDistanciaXder = 20;
      const ciertaDistanciaY = 10;
  
      if (this.lastPosition) {
        if (position[0] < this.lastPosition[0] - ciertaDistanciaXiz) {
          this.clickVueltaMenuButton();
        } else if (position[0] > this.lastPosition[0] + ciertaDistanciaXder) {
          this.clickMenuButton();
        } else if (position[1] < this.lastPosition[1] - ciertaDistanciaY) {
          this.navigateMenuItems();
        } else if (position[1] > this.lastPosition[1] + ciertaDistanciaY) {
          this.startTimeout();
        }
      }
      this.lastPosition = position;
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
      }, 1000); // Pequeña espera para que no se acumulen gestos
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

*/