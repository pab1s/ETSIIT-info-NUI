let html5QrCode; // Variable global para el lector de QR

// Esta función se llama cuando se hace clic en el botón de escanear QR.
function scanQRCodeLuis() {
    fetch("../qr-codes/luiscrespo-QR.png")
        .then(response => response.blob())
        .then(blob => {
            // Creamos un objeto File a partir del Blob
            const file = new File([blob], "qr.png", { type: "image/png" });
            
            html5QrCode = new Html5Qrcode("reader");
            html5QrCode.scanFile(file, true)
                .then(decodedText => {
                    console.log(`Código QR decodificado: ${decodedText}`);
                    performLogin(decodedText);
                })
                .catch(err => {
                    console.error('Error al leer el código QR:', err);
                });
        })
        .catch(err => {
            console.error('Error al cargar el archivo QR:', err);
        });
}

function scanQRCodePablo() {
    fetch("../qr-codes/pablolivares-QR.png")
        .then(response => response.blob())
        .then(blob => {
            // Creamos un objeto File a partir del Blob
            const file = new File([blob], "qr.png", { type: "image/png" });
            
            html5QrCode = new Html5Qrcode("reader");
            html5QrCode.scanFile(file, true)
                .then(decodedText => {
                    console.log(`Código QR decodificado: ${decodedText}`);
                    performLogin(decodedText);
                })
                .catch(err => {
                    console.error('Error al leer el código QR:', err);
                });
        })
        .catch(err => {
            console.error('Error al cargar el archivo QR:', err);
        });
}

function scanQRCodeXimo() {
    fetch("../qr-codes/ximosanz-QR.png")
        .then(response => response.blob())
        .then(blob => {
            // Creamos un objeto File a partir del Blob
            const file = new File([blob], "qr.png", { type: "image/png" });
            
            html5QrCode = new Html5Qrcode("reader");
            html5QrCode.scanFile(file, true)
                .then(decodedText => {
                    console.log(`Código QR decodificado: ${decodedText}`);
                    performLogin(decodedText);
                })
                .catch(err => {
                    console.error('Error al leer el código QR:', err);
                });
        })
        .catch(err => {
            console.error('Error al cargar el archivo QR:', err);
        });
}



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

