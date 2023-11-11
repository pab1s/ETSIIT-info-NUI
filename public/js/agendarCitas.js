// Obtener referencias a los elementos del DOM
const btnBuscarCitas = document.getElementById('buscar-citas');
const citasDisponiblesContenedor = document.getElementById('citas-disponibles');
const inputFechaCita = document.getElementById('fecha-cita');

// Evento para buscar citas disponibles
btnBuscarCitas.addEventListener('click', function() {
    const fechaSeleccionada = inputFechaCita.value;
    if (!fechaSeleccionada) {
        alert('Por favor, selecciona una fecha.');
        return;
    }

    // Hacer la solicitud al endpoint para obtener las citas disponibles
    fetch(`/citas/disponibles/${fechaSeleccionada}`)
        .then(response => response.json())
        .then(citas => {
            citasDisponiblesContenedor.innerHTML = ''; // Limpiar contenedor
            citas.forEach(cita => {
                const citaDiv = document.createElement('div');
                citaDiv.className = 'cita-disponible';
                citaDiv.textContent = `Hora: ${cita.hora_inicio} - ${cita.hora_fin}`;
                citaDiv.dataset.id = cita.id;
                citaDiv.addEventListener('click', () => reservarCita(cita.id, fechaSeleccionada, cita.hora_inicio));
                citasDisponiblesContenedor.appendChild(citaDiv);
            });
        });
});


// Función para reservar una cita
// Asumiendo que tienes una variable global o una forma de obtener el ID del usuario actual
// En un escenario real, esto lo proporcionaría el sistema de autenticación de tu aplicación
const usuarioId = 1; // Reemplaza esto con la lógica para obtener el usuario real

// Esta función se llamará cuando un usuario haga clic en una cita disponible
function reservarCita(citaId, fecha, horaInicio) {
    fetch('/citas/reservar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Aquí agregarías cualquier encabezado adicional como tokens de autenticación si es necesario
        },
        body: JSON.stringify({
            fecha: fecha,
            hora_inicio: horaInicio,
            usuario_id: usuarioId // Envías el ID del usuario que reserva la cita
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            console.error('Error al reservar cita:', data.error);
            alert('No se pudo reservar la cita: ' + data.error);
        } else {
            alert(data.message);
            // Aquí actualizas la interfaz de usuario para reflejar la cita reservada
            // Por ejemplo, puedes cambiar el texto del botón de la cita a "Reservado"
            const citaDiv = document.querySelector(`[data-id="${citaId}"]`);
            if (citaDiv) {
                citaDiv.textContent = 'Cita reservada';
                citaDiv.classList.add('reservado');
                citaDiv.removeEventListener('click', reservarCita); // Remueve el evento de clic para evitar reservas múltiples
            }
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
}

// Suponiendo que ya tienes una función que carga las citas disponibles y les asigna eventos de clic
function cargarCitasDisponibles(fecha) {
    // ...código para cargar citas disponibles...

    // Suponiendo que citas es un arreglo de citas disponibles que recibiste del servidor
    citas.forEach(cita => {
        const citaDiv = document.createElement('div');
        citaDiv.className = 'cita-disponible';
        citaDiv.textContent = `Hora: ${cita.hora_inicio} - ${cita.hora_fin}`;
        citaDiv.dataset.id = cita.id; // Suponiendo que el servidor envía el ID de la cita
        citaDiv.addEventListener('click', () => reservarCita(cita.id, fecha, cita.hora_inicio));
        // Agregar el div de cita al contenedor de citas disponibles
    });
}
