let indiceFechaActual = 0;

function formatearFecha(fecha) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);

    // Dividir la fecha en partes y convertir el día de la semana a mayúsculas
    const partes = fechaFormateada.split(' ');
    partes[0] = partes[0].toUpperCase(); // Convierte el día de la semana a mayúsculas

    // Volver a juntar las partes y devolver la fecha formateada
    return partes.join(' ');
}

// Función para cargar las citas disponibles de una fecha seleccionada
function cargarCitasDisponibles(fecha) {
    fetch(`/citas/disponibles/${fecha}`)
        .then(response => response.json())
        .then(citas => {
            // Convertir la fecha a formato legible
            const fechaLegible = formatearFecha(fecha);
    
           // Selecciona el nuevo contenedor para el título
           const tituloCitasDisponiblesContenedor = document.getElementById('titulo-citas-disponibles');
           tituloCitasDisponiblesContenedor.classList.remove('oculto');
           tituloCitasDisponiblesContenedor.classList.add('visible1');
           tituloCitasDisponiblesContenedor.innerHTML = `<h2>Citas disponibles para el ${fechaLegible}</h2>`;

           // Selecciona el contenedor para las citas disponibles
           const citasDisponiblesContenedor = document.getElementById('citas-disponibles');
           citasDisponiblesContenedor.classList.remove('oculto');
           citasDisponiblesContenedor.classList.add('visible2');
           citasDisponiblesContenedor.innerHTML = ''; // Limpia el contenedor para nuevas citas
            citas.forEach(cita => {
                const citaDiv = document.createElement('div');
                citaDiv.className = cita.ocupado ? 'cita-disponible reservado' : 'cita-disponible';
                citaDiv.textContent = `${cita.hora_inicio} - ${cita.hora_fin}`;
                if (!cita.ocupado) {
                    citaDiv.dataset.id = cita.id;
                    citaDiv.addEventListener('click', () => reservarCita(cita.id, fecha, cita.hora_inicio));
                }
                citasDisponiblesContenedor.appendChild(citaDiv);
            });
        })
        .catch(error => {
            console.error('Error al obtener citas disponibles:', error);
        });
}

// Función para reservar una cita
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
            hora_inicio: horaInicio
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

    document.querySelectorAll('.cita-item').forEach((elemento, indice) => {
        if (indice === indiceFechaActual) {
            elemento.classList.add('cita-seleccionada');
            elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            elemento.classList.remove('cita-seleccionada');
        }
    });
}

function actualizarSeleccionFecha() {
    const fechas = document.querySelectorAll('.fecha');
    fechas.forEach((fecha, indice) => {
        fecha.classList.remove('cita-seleccionada');
        if (indice === indiceFechaActual) {
            fecha.classList.add('cita-seleccionada');
            fecha.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });

    cargarCitasDisponibles(document.querySelectorAll('.fecha')[indiceFechaActual].getAttribute('data-fecha'));
}

// Función para cargar las fechas disponibles al cargar la página
function cargarFechasDisponibles() {
    fetch('/api/fechas-citas-disponibles')
        .then(response => response.json())
        .then(data => {
            const contenedorFechas = document.getElementById('fechas-container');
            contenedorFechas.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas fechas

            data.fechas.forEach(fecha => {
                const fechaDiv = document.createElement('div');
                fechaDiv.className = 'fecha';
                fechaDiv.setAttribute('data-fecha', fecha);
                console.log(fechaDiv);
                fechaDiv.textContent = formatearFecha(fecha);
                fechaDiv.addEventListener('click', function() {
                     indiceFechaActual = Array.from(document.querySelectorAll('.fecha')).indexOf(fechaDiv);
                     actualizarSeleccionFecha();
                });
                contenedorFechas.appendChild(fechaDiv);
            });

            actualizarSeleccionFecha();

        })
        .catch(error => {
            console.error('Error al obtener fechas de citas:', error);
        });

}

// Llamamos a cargarFechasDisponibles al cargar la página y eliminamos el botón buscar citas ya que no es necesario
document.addEventListener('DOMContentLoaded', () => {
    cargarFechasDisponibles();

    document.addEventListener('keydown', (event) => {
        const totalFechas = document.querySelectorAll('.fecha').length;

        if (event.key === 'ArrowRight') {
            indiceFechaActual = (indiceFechaActual + 1) % totalFechas;
            console.log(indiceFechaActual)
            actualizarSeleccionFecha();
        } else if (event.key === 'ArrowLeft') {
            indiceFechaActual = (indiceFechaActual - 1 + totalFechas) % totalFechas;
            actualizarSeleccionFecha();
        }
    });
});
