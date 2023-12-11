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
                    pixelx: profesor.pixelx,
                    pixely: profesor.pixely
                }));
                inicializarInterfaz();
            })
            .catch(error => console.error('Error al cargar los profesores:', error));
    }

    function inicializarInterfaz() {
        contenedorBotones = document.getElementById('contenedor-botones');
        infoDespacho = document.getElementById('info-despacho');
        botones = [];
        botonActivo = 0;

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

        seleccionarBoton(Math.floor(profesores.length / 2)); // Seleccionar el botón del medio
    }

    function seleccionarBoton(index) {
        mostrarDespacho(index);
        botonActivo = index;
        reordenarBotones();
    }

    function mostrarDespacho(index) {
        // Actualizar texto del despacho
        let textoDespacho = document.getElementById('texto-despacho');
        textoDespacho.textContent = profesores[index].despacho;

        // Cargar la imagen del mapa
        let numMapa = profesores[index].piso;
        let mapaImagen = document.getElementById('mapa-imagen');
        mapaImagen.src = `../assets/mapa-etsiit-${numMapa}.jpeg`;

        // Posicionar el marcador

        document.documentElement.style.setProperty('--pixelx', profesores[index].pixelx + 'px');
        document.documentElement.style.setProperty('--pixely', profesores[index].pixely + 'px');
        document.documentElement.style.setProperty('--map-width', mapaImagen.width + 'px');
        document.documentElement.style.setProperty('--map-height', mapaImagen.height + 'px');

            // Console.log para verificar las propiedades CSS
    console.log('--pixelx:', document.documentElement.style.getPropertyValue('--pixelx'));
    console.log('--pixely:', document.documentElement.style.getPropertyValue('--pixely'));
    console.log('--map-width:', document.documentElement.style.getPropertyValue('--map-width'));
    console.log('--map-height:', document.documentElement.style.getPropertyValue('--map-height'));
         let marcador = document.getElementById('marcador-posicion');
        let marcadorHeight = marcador.offsetHeight; // Altura del marcador
        marcador.style.left = profesores[index].pixelx + 'px';
        marcador.style.top = (profesores[index].pixely - marcadorHeight / 2) + 'px'; // Ajuste para centrar la parte inferior del marcador
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
});
