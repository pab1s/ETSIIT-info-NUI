let html5QrCode; // Variable global para el lector de QR

/**
 * Evento que se ejecuta cuando el contenido de la página ha sido cargado.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Leer el archivo QR
    fetch("../qr-codes/ximosanz-QR.png")
        .then(response => response.blob())
        .then(blob => {
            html5QrCode = new Html5Qrcode("reader");
            html5QrCode.scanFile(blob, true) // true para tratar el archivo como imagen
                .then(decodedText => {
                    // Procesar el texto decodificado del QR
                    console.log(`Código QR decodificado: ${decodedText}`);
                    performLogin(decodedText);
                })
                .catch(err => {
                    // Manejar errores de lectura
                    console.error('Error al leer el código QR:', err);
                });
        })
        .catch(err => {
            console.error('Error al cargar el archivo QR:', err);
        });
});

/**
 * Realiza la autenticación con el texto decodificado del QR.
 * @param {string} decodedText - Texto decodificado del código QR.
 */
function performLogin(decodedText) {
    fetch('/api/login?qr=' + encodeURIComponent(decodedText))
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta del servidor no fue exitosa');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Autenticación exitosa') {
                window.location.href = '/main';
            } else {
                alert(data.error || 'Se ha producido un error desconocido');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Se ha producido un error al procesar el código QR');
        });
}

