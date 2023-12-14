/**
 * @file handleCam.js - Script para la página de autenticación de la aplicación web de la ETSIIT.
 * @author Luis Crespo Orti
 * @version 1.0
 */

let html5QrCodeScanner; // Variable global para controlar el escáner de QR

/**
 * Event listener que se ejecuta al hacer clic en el botón "authenticate".
 */
document.getElementById('authenticate').addEventListener('click', function() {
    var webcamContainer = document.getElementById('webcam-container');

    if (webcamContainer.classList.contains('active')) {
        // Oculta el contenedor de la webcam
        webcamContainer.classList.remove('active');
        setTimeout(() => { 
            if (html5QrCodeScanner) {
                html5QrCodeScanner.clear();
            }
            webcamContainer.style.border = 'none'; // Elimina el borde cuando se oculta
            webcamContainer.style.display = 'none'; 
        }, 500); // Espera a que termine la transición
    } else {
        // Muestra el contenedor de la webcam
        webcamContainer.style.display = 'block';
        webcamContainer.style.border = '2px solid #007bff'; // Restablece el borde

        setTimeout(() => { 
            webcamContainer.classList.add('active');
            startQRScanner(); // Inicia el escáner QR
        }, 0); // Inicia la transición
    }
});

/**
 * Inicia el escáner de QR y muestra el contenedor de la webcam.
 */
function startQRScanner() {
    html5QrCodeScanner = new Html5QrcodeScanner(
        "webcam-container", { fps: 10, qrbox: 250 }
    );
    html5QrCodeScanner.render(onScanSuccess, onScanError);
}


/**
 * Callback que se ejecuta al tener éxito en la decodificación de un código QR.
 * @param {string} decodedText - Texto decodificado del código QR.
 */
function onScanSuccess(decodedText) {
    console.log(`Código QR decodificado: ${decodedText}`);
    fetch('/api/login?qr=' + encodeURIComponent(decodedText))
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta del servidor no fue exitosa');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Autenticación exitosa') {
                // Redirigir a main.html
                window.location.href = '/main';
            } else {
                // Manejar los casos de error
                alert(data.error || 'Se ha producido un error desconocido');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Se ha producido un error al procesar el código QR');
        });

    // Opcionalmente detener el escaneo aquí, si lo deseas
    html5QrCodeScanner.clear();
}

/**
 * Callback que se ejecuta al producirse un error durante el escaneo de QR.
 * @param {string} error - Mensaje de error.
 */
function onScanError(error) {
     console.error(`Error al escanear: ${error}`);
}

