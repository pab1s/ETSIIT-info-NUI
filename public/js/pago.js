document.addEventListener('DOMContentLoaded', (event) => {
    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', checkAndPay);
    }
});

function checkAndPay() {
    saldoRestante = 0;

    fetch('/api/checkSaldo')
        .then(response => response.json())
        .then(data => {

            const messageContainer = document.getElementById('message-container');
            const payButton = document.getElementById('pay-button');
            if (data.saldo >= 3.5) {
                payButton.style.display='none';
                messageContainer.style.display='block';
                messageContainer.innerHTML = `
                    <p>¿Confirmas el pago del menú (3.50€)?</p>
                    <button id="pay-button2" onclick="realizarPago()">✅</button>
                    <button onclick="cancelarPago()">❌</button>
                    <p>Saldo restante: ${data.saldo}€</p>
                `;

            } else {

                showMessage("Saldo insuficiente: " + data.saldo + "€");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Error al verificar el saldo');
        });
}


function realizarPago() {
    fetch('/api/realizarPago', { method: 'POST' })
        .then(response => {
            
            if (response.ok) {
                fetch('/api/correo')
                    .then(resCorreo => resCorreo.text())
                    .then(correo => {
                        showMessage("Ha adquirido usted el menú de <strong>" + estadoSeleccion.comedor + "</strong> para la fecha <strong>" + estadoSeleccion.fecha + "</strong>" +
                            "<br>Se enviará el ticket a su correo electrónico: <strong>" + correo+"</strong>");
                    });
            } else {
                showMessage('Error al realizar el pago');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message-area').innerHTML = `<p>Error al realizar el pago</p>`;
        });
}

function cancelarPago() {
    showMessage('Pago cancelado');
}

function showMessage(message) {
    const messageContainer = document.getElementById('message-container');
    const payButton = document.getElementById('pay-button');

    messageContainer.style.display='block';
    messageContainer.innerHTML = `<p>${message}</p>`;
    payButton.style.display = 'none'; // Ocultar botón de pago

    // Restablecer después de 5 segundos
    setTimeout(() => {
        messageContainer.innerHTML = ''; // Limpiar mensaje
        messageContainer.style.display='none';
        payButton.style.display = 'block'; // Mostrar botón de pago
    }, 5000);
}
