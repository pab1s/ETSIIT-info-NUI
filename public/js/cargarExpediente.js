
document.getElementById('consulta-expediente').addEventListener('click', function() {
    const userId = 1; // Aquí deberiamos obtener el ID del usuario de alguna manera
    fetch(`/expediente/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Expediente no encontrado');
            }
            return response.text();
        })
        .then(htmlExpediente => {
            document.body.innerHTML = htmlExpediente; // O muestra el HTML de alguna otra manera
        })
        .catch(error => {
            console.error('Error al recuperar el expediente:', error);
        });
});
