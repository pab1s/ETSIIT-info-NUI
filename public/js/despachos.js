document.addEventListener('DOMContentLoaded', function() {
    let profesores = [];
    let contenedorBotones, infoDespacho, botones, botonActivo;

    function cargarProfesores() {
        fetch('/api/despachos')
            .then(response => response.json())
            .then(data => {
                profesores = data.map(profesor => ({
                    nombre: profesor.nombre,
                    departamento: profesor.departamento,
                    despacho: profesor.despacho,
                    piso: profesor.piso,
                    porcX: profesor.porcX, // Nuevo
                    porcY: profesor.porcY  // Nuevo
                }));

                todosLosProfesores = profesores;
                inicializarInterfaz();
            })
            .catch(error => console.error('Error al cargar los profesores:', error));
    }

    function inicializarInterfaz() {
        contenedorBotones = document.getElementById('contenedor-botones');
        infoDespacho = document.getElementById('info-despacho');
        botones = [];
        botonActivo = 0;

        mostrarTodos = false;

        if (!mostrarTodos) {
            profesores = profesores.filter(profesor =>
                profesor.piso && profesor.porcX != null && profesor.porcY != null
            );
        }

        profesores.forEach((profesor, index) => {
            const boton = document.createElement('button');
            boton.classList.add('profesor-button');
            boton.innerHTML = profesor.nombre;
            if (profesor.departamento) {
                boton.innerHTML += `<br><span class='departamento'>${profesor.departamento}</span>`;
            }
            boton.onclick = () => seleccionarBoton(index);
            contenedorBotones.appendChild(boton);
            botones.push(boton);
        });

        seleccionarBoton(profesores.findIndex(profesor => profesor.nombre === 'Marcelino Jose Cabrera Cuevas')); // Seleccionar el botón del medio
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

        textoDespacho.textContent = profesores[index].despacho;

        // Verificar si el profesor tiene información de localización
        if (profesores[index].piso && profesores[index].porcX != null && profesores[index].porcY != null) {
            mapaImagen.src = `../assets/mapa-etsiit-${profesores[index].piso}.jpeg`;

            mapaImagen.onload = function() {
                let marcadorHeight = marcador.offsetHeight;
                let imagenRect = mapaImagen.getBoundingClientRect();

                marcador.style.left = (imagenRect.width * profesores[index].porcX / 100) + 'px';
                marcador.style.top = (imagenRect.height * profesores[index].porcY / 100 - marcadorHeight / 2) + 'px';
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
        const alturaTotalBotones = botones[0].offsetHeight * profesores.length;
        const alturaContenedor = contenedorBotones.offsetHeight;
        const posicionCentro = alturaTotalBotones / 2 - alturaContenedor / 2;
        const alturaBotonSeleccionado = botones[botonActivo].offsetTop;
        contenedorBotones.scrollTop = alturaBotonSeleccionado - alturaContenedor / 2 + botones[0].offsetHeight / 2;
    }

    cargarProfesores();

    document.addEventListener('keydown', function(event) {
        event.preventDefault();
        if (event.key === 'ArrowUp') {
            botonActivo = (botonActivo - 1 + profesores.length) % profesores.length;
        } else if (event.key === 'ArrowDown') {
            botonActivo = (botonActivo + 1) % profesores.length;
        }
        seleccionarBoton(botonActivo);
    });

    window.addEventListener('resize', function() {
    if (profesores.length > 0) {
        mostrarDespacho(botonActivo);
    }
});

});
