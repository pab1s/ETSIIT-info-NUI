/**
 * @file generateSchedule.js - Script para la página de generar horario de la aplicación web de la ETSIT ULL.
 * @author Luis Crespo Orti
 * @version 1.0
 */

/**
 * Event listener que se ejecuta cuando se ha cargado el DOM.
 *
 * Realiza dos peticiones a las API '/api/userinfo' y '/api/docencia' para obtener
 * información del usuario y datos de docencia respectivamente. Luego, actualiza
 * el contenido del título y construye un calendario de sesiones de docencia.
 *
 * @event DOMContentLoaded
 * @callback
 */
document.addEventListener('DOMContentLoaded', function () {

    // Petición a la API para obtener información del usuario
    fetch('/api/userinfo')
        .then(response => response.json())
        .then(data => {
            const titulo = document.querySelector('#welcome-message h1');
            titulo.textContent = `Tu horario`;
        })
        .catch(error => console.error('Error:', error));
    
    // Petición a la API para obtener datos de docencia
    fetch('/api/docencia')
        .then(response => response.json())
        .then(data => {
            const calendario = document.getElementById('calendario');
            añadirEncabezados(calendario); // Añadir encabezados de días y horas

            data.docencia.forEach((sesion, index) => {
                const divSesion = document.createElement('div');
                divSesion.classList.add('sesion');
                divSesion.innerHTML = `<strong>${sesion.asignatura}</strong>
        Grupo ${sesion.grupo} de ${sesion.tipo_de_grupo} 
        <em>${sesion.profesor}</em>`;

                const diaIndice = obtenerIndiceDia(sesion.dia_de_la_semana) + 1; // +1 porque la primera columna son las horas
                const horaIndice = obtenerIndiceHora(sesion.hora_inicio) + 2;
                const duracion = calcularDuracion(sesion.hora_inicio, sesion.hora_fin);

                // console.log(sesion.asignatura + " - " + sesion.dia_de_la_semana + " - " + sesion.hora_inicio + " - " + sesion.hora_fin);

                divSesion.style.gridColumnStart = diaIndice;
                divSesion.style.gridRowStart = horaIndice;
                divSesion.style.gridRowEnd = `span ${duracion}`;

                calendario.appendChild(divSesion);
            });
        })
        .catch(error => console.error('Error:', error));
});

/**
 * Obtiene el índice de un día de la semana.
 *
 * @function
 * @param {string} dia - Día de la semana.
 * @returns {number} - Índice del día (1 para Lunes, 2 para Martes, ...).
 */
function obtenerIndiceDia(dia) {
    console.log(dia);
    const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    return dias.indexOf(dia) + 1; // +1 porque los índices de grid comienzan en 1
}

/**
 * Obtiene el índice de una hora del día.
 *
 * @function
 * @param {string} hora - Hora en formato 'HH:mm'.
 * @returns {number} - Índice de la hora en el calendario.
 */
function obtenerIndiceHora(hora) {
    const [horas, minutos,] = hora.split(':').map(Number);
    return (horas - 8) * 2 + (minutos >= 30 ? 1 : 0); // +1 porque la primera fila son los nombres de las horas
}

/**
 * Calcula la duración en unidades de tiempo entre dos horas.
 *
 * @function
 * @param {string} horaInicio - Hora de inicio en formato 'HH:mm'.
 * @param {string} horaFin - Hora de fin en formato 'HH:mm'.
 * @returns {number} - Duración en unidades de tiempo.
 */
function calcularDuracion(horaInicio, horaFin) {
    const inicio = obtenerIndiceHora(horaInicio);
    const fin = obtenerIndiceHora(horaFin);
    return fin - inicio; // +1 para incluir la hora de fin en la duración
}

/**
 * Añade encabezados de días y horas al calendario.
 *
 * @function
 * @param {HTMLElement} calendario - Elemento del DOM que representa el calendario.
 */
function añadirEncabezados(calendario) {
    // Añadir encabezados de los días
    const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    dias.forEach((dia, i) => {
        let header = document.createElement('div');
        header.textContent = dia;
        header.style.gridColumnStart = i + 1; // Colocar en la columna correcta
        header.style.gridRowStart = 1; // Primera fila para los días de la semana
        calendario.appendChild(header);
    });

    // Añadir encabezados de las horas
    for (let hora = 8; hora <= 22; hora++) {
        let timeSlot = document.createElement('div');
        timeSlot.textContent = `${hora.toString().padStart(2, '0')}:00`;
        timeSlot.style.gridColumnStart = 1; // Primera columna para las horas
        timeSlot.style.gridRowStart = (hora - 8) * 2 + 2; // Calcular la fila correcta
        calendario.appendChild(timeSlot);

        // Para medias horas
        if (hora < 22) {
            let halfTimeSlot = document.createElement('div');
            halfTimeSlot.textContent = `${hora.toString().padStart(2, '0')}:30`;
            halfTimeSlot.style.gridColumnStart = 1;
            halfTimeSlot.style.gridRowStart = (hora - 8) * 2 + 3;
            calendario.appendChild(halfTimeSlot);
        }
    }
}