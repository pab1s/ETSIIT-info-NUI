/**
 * @file agendarCitas.js - Script para la página de agendar citas de la aplicación web de la ETSIT ULL.
 * @author Alvaro Carrillo
 * @version 1.0
 */

// Función para formatear una fecha en formato legible
let indiceFechaActual = 0;

/**
 * Formatea una fecha dada en un formato legible en español.
 *
 * @function
 * @param {string} fecha - Cadena que representa la fecha en formato ISO o similar.
 * @returns {string} - Fecha formateada en formato legible.
 */
function formatearFecha(fecha) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);

    const partes = fechaFormateada.split(' ');
    partes[0] = partes[0].toUpperCase();
    return partes.join(' ');
}

/**
 * Carga las citas disponibles para una fecha específica y actualiza la interfaz de usuario.
 *
 * @function
 * @param {string} fecha - Cadena que representa la fecha en formato ISO o similar.
 */
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
            actualizarSeleccionHora();
        })
        .catch(error => {
            console.error('Error al obtener citas disponibles:', error);
        });
}

/**
 * Reserva una cita para la fecha y hora especificadas.
 *
 * @function
 * @param {number} citaId - Identificador de la cita.
 * @param {string} fecha - Cadena que representa la fecha en formato ISO o similar.
 * @param {string} horaInicio - Cadena que representa la hora de inicio en formato 'HH:mm'.
 */
function reservarCita(citaId, fecha, horaInicio) {
    fetch('/citas/reservar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fecha: fecha,
            hora_inicio: horaInicio
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                const errorButton = document.getElementById('error-button');
                console.error('Error al reservar cita:', data.error);

                if (errorButton) {
                    errorButton.click();
                }
            } else {
                const continueButton = document.getElementById('continue-button');
                const citaDiv = document.querySelector(`[data-id="${citaId}"]`);

                if (citaDiv) {
                    citaDiv.textContent = 'Cita reservada';
                    citaDiv.classList.add('reservado');
                    citaDiv.removeEventListener('click', reservarCita); // Remueve el evento de clic para evitar reservas múltiples
                }

                if (continueButton) {
                    continueButton.click();
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

/**
 * Actualiza la interfaz de usuario para reflejar la fecha seleccionada y carga las citas disponibles.
 *
 * @function
 */
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

/**
 * Carga las fechas disponibles al cargar la página y establece los eventos de clic en las fechas.
 *
 * @function
 */
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
                fechaDiv.addEventListener('click', function () {
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

/**
 * Evento que se ejecuta cuando el DOM se ha cargado completamente.
 *
 * Carga las fechas disponibles al iniciar la página y maneja eventos de teclado para cambiar la fecha seleccionada.
 *
 * @event DOMContentLoaded
 * @callback
 */
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

// Prueba para facilitar el leap
let indiceHoraActual = 0;

function actualizarSeleccionHora() {
    const todasLasHoras = document.querySelectorAll('#citas-disponibles .cita-disponible');
    todasLasHoras.forEach((hora, indice) => {
        hora.classList.remove('hora-seleccionada');
        if (indice === indiceHoraActual) {
            hora.classList.add('hora-seleccionada');
            hora.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
        event.preventDefault(); // Previene el desplazamiento por defecto de la página
        const todasLasHoras = document.querySelectorAll('#citas-disponibles .cita-disponible');
        if (todasLasHoras.length > 0) {
            indiceHoraActual = (indiceHoraActual + 1) % todasLasHoras.length;
            actualizarSeleccionHora();
        }
    }
});

function seleccionarHoraConEnter() {
    const horaSeleccionada = document.querySelector('#citas-disponibles .cita-disponible.hora-seleccionada');
    if (horaSeleccionada) {
        horaSeleccionada.click();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        seleccionarHoraConEnter();
    }
});
