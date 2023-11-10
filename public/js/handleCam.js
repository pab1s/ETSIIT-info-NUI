let html5QrCodeScanner; // Variable global para controlar el escáner de QR

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

function startQRScanner() {
    html5QrCodeScanner = new Html5QrcodeScanner(
        "webcam-container", { fps: 10, qrbox: 250 }
    );
    html5QrCodeScanner.render(onScanSuccess, onScanError);
}

function onScanSuccess(decodedText) {
    console.log(`Código QR decodificado: ${decodedText}`);
    fetch('/api/qrcode?qr=' + encodeURIComponent(decodedText))
        .then(response => window.location.href = '/logged?code=' + encodeURIComponent(decodedText))
        .catch(err => console.error('Error:', err));

    // Opcionalmente detener el escaneo aquí, si lo deseas
    html5QrCodeScanner.clear();
}

function onScanError(error) {
    // console.error(`Error al escanear: ${error}`);
}
