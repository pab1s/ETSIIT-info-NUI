document.addEventListener('DOMContentLoaded', (event) => {
    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', checkAndPay);
    }
});

function checkAndPay() {
    fetch('/api/checkSaldo')
        .then(response => response.json())
        .then(data => {
            const messageContainer = document.getElementById('message-container');
            const payButton = document.getElementById('pay-button');
            if (data.saldo >= 3.5) {
                payButton.style.display='none';
                messageContainer.innerHTML = `
                    <p>¿Confirmas el pago del menú?</p>
                    <button onclick="realizarPago()">✅</button>
                    <button onclick="cancelarPago()">❌</button>
                `;
            } else {
                showMessage('Saldo insuficiente');
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
            const messageArea = document.getElementById('message-area');
            if (response.ok) {
                showMessage('Pago realizado con éxito');
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

    messageContainer.innerHTML = `<p>${message}</p>`;
    payButton.style.display = 'none'; // Ocultar botón de pago

    // Restablecer después de 5 segundos
    setTimeout(() => {
        messageContainer.innerHTML = ''; // Limpiar mensaje
        payButton.style.display = 'block'; // Mostrar botón de pago
    }, 5000);
}
