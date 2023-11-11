// Script para cargar y mostrar el expediente en formato PDF

document.getElementById('consulta-expediente').addEventListener('click', function() {
    const userId = "pablolivares"; // Asegúrate de obtener el ID del usuario de alguna manera
    fetch(`/expediente/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Expediente no encontrado');
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank'); // Abre el PDF en una nueva pestaña
        })
        .catch(error => {
            console.error('Error al recuperar el expediente:', error);
        });
});
