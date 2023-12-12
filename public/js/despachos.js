let profesoresTodos = [];
let profesoresMis = [];
let profesoresActuales = [];
let contenedorBotones, infoDespacho, botones, botonActivo;
let indiceFiltroActivo = 0;
const botonTodos = document.getElementById('todos-profesores');
const botonMis = document.getElementById('mis-profesores');

document.addEventListener('DOMContentLoaded', function() {
    // Carga inicial de ambos conjuntos de datos.
    Promise.all([
        cargarProfesores('/api/despachos').then(data => profesoresTodos = data),
        cargarProfesores('/api/mis-profesores', true).then(data => profesoresMis = data).catch(error => {
            console.error('Error al cargar profesoresMis:', error);
        })
    ])
    .then(() => {
        // Verifica si se cargaron datos en ambos conjuntos antes de seleccionar un filtro
        if (profesoresTodos.length > 0 || profesoresMis.length > 0) {
            seleccionarFiltro();
            console.log("Hola");
        } else {
            // Maneja el caso en el que no hay datos disponibles
            console.log('No se pudieron cargar los datos de los profesores.');
            // Puedes actualizar la interfaz de usuario aquí para reflejar que no hay datos
        }
    })
})


botonTodos.addEventListener('click', function() {
    indiceFiltroActivo = 0;
    seleccionarFiltro();
});

botonMis.addEventListener('click', function() {
    indiceFiltroActivo = 1;
    seleccionarFiltro();
});

window.addEventListener('resize', function() {
    if (profesoresActuales.length > 0) {
        mostrarDespacho(botonActivo);
    }
});

document.addEventListener('keydown', function(event) {
    const botonesFiltro = document.querySelectorAll('.filtro-button');
    indiceFiltroActivo = Array.from(botonesFiltro).findIndex(boton => boton.classList.contains('filtro-seleccionado'));

    event.preventDefault();
    switch (event.key) {
        case 'ArrowLeft':
            // Mover hacia el botón "MIS PROFESORES"
            indiceFiltroActivo = (indiceFiltroActivo +1)%2;
            seleccionarFiltro();
            break;
        case 'ArrowRight':
            // Mover hacia el botón "TODOS LOS PROFESORES"
            indiceFiltroActivo = (indiceFiltroActivo + 1)%2;
            seleccionarFiltro();
            break;
        // Resto de tu manejo de teclas
        case 'ArrowUp':
            botonActivo = (botonActivo - 1 + profesoresActuales.length) % profesoresActuales.length;
            seleccionarBoton(botonActivo);
            break;
        case 'ArrowDown':
            botonActivo = (botonActivo + 1) % profesoresActuales.length;
            seleccionarBoton(botonActivo);
            break;
    }
});

function cargarProfesores(ruta, esPost = false) {
    const opcionesFetch = {
        method: esPost ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };

    return fetch(ruta, opcionesFetch)
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue ok.');
            }
            return response.json();
        })
        .then(data => {
            return data.map(profesor => ({
                nombre: profesor.nombre,
                departamento: profesor.departamento,
                despacho: profesor.despacho,
                piso: profesor.piso,
                porcX: profesor.porcX,
                porcY: profesor.porcY
            }));
        });
}

function actualizarInterfaz() {
    contenedorBotones = document.getElementById('contenedor-botones');
    infoDespacho = document.getElementById('info-despacho');
    limpiarContenedorBotones();
    if (profesoresActuales.length > 0) {
        infoDespacho.style.display = 'block';
        inicializarInterfaz();
    } else {
        infoDespacho.style.display = 'none';
    }
}


// Llama esta función antes de inicializar la interfaz para limpiar el contenedor
function limpiarContenedorBotones() {
    // Comprueba si contenedorBotones ya está definido
    if (contenedorBotones) {
        contenedorBotones.innerHTML = ''; // Limpia el contenedor de botones
    }
    botones = []; // Resetea el array de botones
}

function limpiarInterfaz() {
    // Asegúrate de que los elementos existen antes de intentar limpiarlos
    if (contenedorBotones) {
        contenedorBotones.innerHTML = '';
    }
    if (infoDespacho) {
        infoDespacho.innerHTML = '';
    }
}

function inicializarInterfaz() {

    contenedorBotones = document.getElementById('contenedor-botones');
    infoDespacho = document.getElementById('info-despacho');
    botones = [];
    botonActivo = 0;

    mostrarTodos = true;

    if (!mostrarTodos) {
        profesoresActuales = profesoresActuales.filter(profesor =>
            profesor.piso && profesor.porcX != null && profesor.porcY != null
        );
    }

    profesoresActuales.forEach((profesor, index) => {
        const boton = document.createElement('button');
        boton.classList.add('profesor-button');
        boton.innerHTML = profesor.nombre + (profesor.departamento ? `<br><span class='departamento'>${profesor.departamento}</span>` : '');
        boton.onclick = () => seleccionarBoton(index);
        contenedorBotones.appendChild(boton);
        botones.push(boton);
    });

    // Si quieres seleccionar un profesor por defecto, aquí puedes hacerlo
    seleccionarBoton(0); // Por ejemplo, selecciona el primer profesor
}

function seleccionarBoton(index) {
    mostrarDespacho(index);
    botonActivo = index;
    reordenarBotones();
}

function mostrarDespacho(index) {
    let textoDespacho = document.getElementById('texto-despacho');
    let mapaImagen = document.getElementById('mapa-imagen');
    let marcador = document.getElementById('marcador-posicion');

    console.log(profesoresActuales[index].despacho);

    textoDespacho.textContent = (profesoresActuales[index].despacho) ? profesoresActuales[index].despacho : "No definido";

    // Verificar si el profesor tiene información de localización
    if (profesoresActuales[index].piso && profesoresActuales[index].porcX != null && profesoresActuales[index].porcY != null) {
        mapaImagen.src = `../assets/mapa-etsiit-${profesoresActuales[index].piso}.jpeg`;

        mapaImagen.onload = function() {
            let marcadorHeight = marcador.offsetHeight;
            let imagenRect = mapaImagen.getBoundingClientRect();

            marcador.style.left = (imagenRect.width * profesoresActuales[index].porcX / 100) + 'px';
            marcador.style.top = (imagenRect.height * profesoresActuales[index].porcY / 100 - marcadorHeight / 2) + 'px';
            marcador.style.display = 'block'; // Ocultar el marcador
        };
    } else {
        mapaImagen.onload = function() {
        marcador.style.display = 'none'; // Ocultar el marcador
    };
    mapaImagen.src = '../assets/location.png'; // Asegúrate de que esta sea la ruta correcta a tu imagen
    }
}


function reordenarBotones() {
    botones.forEach(boton => boton.classList.remove('profesor-seleccionado'));
    botones[botonActivo].classList.add('profesor-seleccionado');

    // Ajustar el scrollTop para centrar el botón seleccionado
    const alturaTotalBotones = botones[0].offsetHeight * profesoresActuales.length;
    const alturaContenedor = contenedorBotones.offsetHeight;
    const posicionCentro = alturaTotalBotones / 2 - alturaContenedor / 2;
    const alturaBotonSeleccionado = botones[botonActivo].offsetTop;
    contenedorBotones.scrollTop = alturaBotonSeleccionado - alturaContenedor / 2 + botones[0].offsetHeight / 2;
}



function seleccionarFiltro() {
    const botonesFiltro = document.querySelectorAll('.filtro-button');
    botonesFiltro.forEach(boton => boton.classList.remove('filtro-seleccionado'));
    botonesFiltro[indiceFiltroActivo].classList.add('filtro-seleccionado');
    botonesFiltro[indiceFiltroActivo].focus();

    // Aquí intercambia los conjuntos de profesores dependiendo del índice
    profesoresActuales = (indiceFiltroActivo == 0) ? profesoresTodos : profesoresMis;

    actualizarInterfaz();
}

