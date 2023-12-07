class LeapMotionController {
  constructor() {
    this.controller = new Leap.Controller();
    this.selectedButton = 'guest'; // Comienza con el botón 'guest' seleccionado
    this.toggleButtonColor(); // Actualizar el color al inicio
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

      if (!this.isInCooldown && hand.fingers.filter(finger => !finger.extended && finger.type !== 0).length === 4) {
        this.toggleSelectedButton();
        this.startCooldown(); // Iniciar el cooldown después de ejecutar la acción
      }

      // Detectar la primera parte del gesto "tap in" (movimiento hacia adelante)
      if (!this.forwardGestureDetected && hand.palmVelocity[2] < -800) {
        this.forwardGestureDetected = true;
      }

      // Detectar la segunda parte del gesto "tap in" (movimiento hacia atrás)
      if (this.forwardGestureDetected && hand.palmVelocity[2] > 800) {
        this.clickSelectedButton();
        this.forwardGestureDetected = false; // Resetear para el próximo gesto
      }
    }
  }

  startCooldown() {
    this.isInCooldown = true;
    setTimeout(() => {
      this.isInCooldown = false;
    }, 400); // Cooldown de 1 segundo, ajustable según necesidad
  }

  startTapCooldown() {
    this.tapCooldown = true;
    setTimeout(() => {
      this.tapCooldown = false;
    }, 150); // Cooldown de 500 ms
  }

  toggleSelectedButton() {
    this.selectedButton = this.selectedButton === 'guest' ? 'id' : 'guest';
    this.toggleButtonColor();
  }

  toggleButtonColor() {
    const guestButton = document.getElementById('guest-access');
    const idButton = document.getElementById('authenticate');
  
    if (guestButton && idButton) {
      // Quitar la clase 'selected' de ambos botones
      guestButton.classList.remove('selected');
      idButton.classList.remove('selected');
  
      // Añadir la clase 'selected' al botón activo
      if (this.selectedButton === 'guest') {
        guestButton.classList.add('selected');
      } else if (this.selectedButton === 'id') {
        idButton.classList.add('selected');
      }
    }
  }
  

  clickSelectedButton() {
    if (this.selectedButton === 'guest') {
      this.clickGuestAccessButton();
    } else if (this.selectedButton === 'id') {
      this.clickGuestAccessIDButton();
    }
  }

  clickGuestAccessButton() {
    const guestAccessButton = document.getElementById('guest-access');
    if (guestAccessButton) {
      guestAccessButton.click();
    }
  }
  
  clickGuestAccessIDButton() {
    const idAccessButton = document.getElementById('authenticate');
    if (idAccessButton) {
      idAccessButton.click();
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
