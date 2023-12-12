// Suponiendo que tienes un endpoint que devuelve las citas del usuario como '/api/mis-citas'
// y otro para cancelar una cita como '/api/cancelar-cita'

let indiceCitaActual = 0;
let citas = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarCitasUsuario();
    document.addEventListener('keydown', manejarTeclasFlecha);
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

    citas.forEach((cita, indice) => {
        const citaDiv = document.createElement('div');
        citaDiv.className = 'cita-item';
        citaDiv.innerHTML = `
            <p><strong>Fecha:</strong> ${cita.fecha}</p>
            <p><strong>Hora:</strong> ${cita.hora_inicio} - ${cita.hora_fin}</p>
            <button class="button-cancelar" onclick="cancelarCita(${cita.id})">Cancelar Cita</button>
        `;

        citaDiv.addEventListener('click', () => seleccionarCita(indice));

        citasContenedor.appendChild(citaDiv);
    });
       // Asegúrate de que la primera cita esté seleccionada inicialmente
    actualizarSeleccionCita(); // Esto seleccionará la primera cita después de cargarlas
}

function seleccionarCita(indice) {
    indiceCitaActual = indice;
    actualizarSeleccionCita();
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

function manejarTeclasFlecha(evento) {
    const numCitas = document.getElementsByClassName('cita-item').length;
    evento.preventDefault();
    if (evento.key === 'ArrowDown') {
        if(indiceCitaActual+1 < numCitas)
            indiceCitaActual = indiceCitaActual + 1;
    } else if (evento.key === 'ArrowUp') {
        if(indiceCitaActual-1 >= 0)
            indiceCitaActual = indiceCitaActual - 1;
    }
    seleccionarCita(indiceCitaActual);
}

function actualizarSeleccionCita() {
    document.querySelectorAll('.cita-item').forEach((elemento, indice) => {
        if (indice === indiceCitaActual) {
            elemento.classList.add('cita-seleccionada');
            elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            elemento.classList.remove('cita-seleccionada');
        }
    });
}
