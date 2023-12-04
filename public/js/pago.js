function checkAndPay() {
    fetch('/api/checkSaldo')
        .then(response => response.json())
        .then(data => {
            if (data.saldo >= 3.5) {
                if (confirm('¿Confirmas el pago del menú?')) {
                    realizarPago();
                }
            } else {
                alert('Saldo insuficiente');
            }
        })
        .catch(error => console.error('Error:', error));
}

function realizarPago() {
    fetch('/api/realizarPago', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                alert('Pago realizado con éxito');
            } else {
                alert('Error al realizar el pago');
            }
        })
        .catch(error => console.error('Error:', error));
}
