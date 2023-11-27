// Suponiendo que tienes un endpoint que devuelve las citas del usuario como '/api/mis-citas'
// y otro para cancelar una cita como '/api/cancelar-cita'

document.addEventListener('DOMContentLoaded', () => {
    cargarCitasUsuario();
});

function cargarCitasUsuario() {
    fetch('/api/mis-citas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Aquí agregarías cualquier encabezado adicional como tokens de autenticación si es necesario
        }
    })
    .then(response => response.json())
    .then(citas => {
        mostrarCitasEnPantalla(citas);
    })
    .catch(error => {
        console.error('Error al cargar citas:', error);
    });
}

function mostrarCitasEnPantalla(citas) {
    const citasContenedor = document.getElementById('lista-citas');
    citasContenedor.innerHTML = ''; // Limpiar contenedor existente

    // Verificar si el array está vacío o contiene un mensaje
    if (!citas.length || citas.message) {
        // Mostrar mensaje si no hay citas
        citasContenedor.innerHTML = '<p>No tienes citas programadas.</p>';
        return;
    }

    citas.forEach(cita => {
        const citaDiv = document.createElement('div');
        citaDiv.className = 'cita-item';
        citaDiv.innerHTML = `
            <p><strong>Fecha:</strong> ${cita.fecha}</p>
            <p><strong>Hora:</strong> ${cita.hora_inicio} - ${cita.hora_fin}</p>
            <button class="button-cancelar" onclick="cancelarCita(${cita.id})">Cancelar Cita</button>
        `;

        citasContenedor.appendChild(citaDiv);
    });
}


function cancelarCita(citaId) {
    fetch(`/api/cancelar-cita`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Aquí agregarías cualquier encabezado adicional como tokens de autenticación si es necesario
        },
        body: JSON.stringify({ cita_id: citaId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error al cancelar cita: ' + data.error);
        } else {
            alert('Cita cancelada con éxito');
            cargarCitasUsuario(); // Recargar citas
        }
    })
    .catch(error => {
        console.error('Error al cancelar cita:', error);
    });
}
