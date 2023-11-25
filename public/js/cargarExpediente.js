window.addEventListener('load', function() {
    // Directamente solicita el expediente del usuario logueado
    fetch('/api/expediente')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el expediente');
            }
            return response.text();
        })
        .then(expedienteHtml => {
            document.getElementById('expediente-container').innerHTML = expedienteHtml;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('expediente-container').innerText = 'No se pudo cargar el expediente.';
        });
});
