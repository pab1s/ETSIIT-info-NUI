document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/comedores')
        .then(response => response.json())
        .then(data => {
            crearBotonesComedores(data);
            // Después de crear botones, selecciona el primero
            const primerBoton = document.querySelector('.comedor-button');
            if (primerBoton) {
                seleccionarBoton(primerBoton);
            }
        });
});

let estadoSeleccion = {
    comedor: null,
    fecha: null
};


function crearBotonesComedores(data) {
    const comedoresContainer = document.getElementById('comedores-container');

    if (comedoresContainer.children.length > 0) {
        seleccionarBoton(comedoresContainer.children[0]);
    }

    let botonIndice = 0;

    for (const [nombreComedor, info] of Object.entries(data)) {
        let comedorButton = document.createElement('button');
        comedorButton.innerText = nombreComedor;
        comedorButton.classList.add('comedor-button');
        comedorButton.dataset.info = JSON.stringify(info);

        comedorButton.onclick = () => {
            seleccionarBoton(comedorButton);
        }

        comedorButton.dataset.index = botonIndice++;
        comedoresContainer.appendChild(comedorButton);
    }
}

function mostrarDias(dates, comedorButton) {
    let menuContainer = document.getElementById('menu-container');
    if (!menuContainer) {
        menuContainer = document.createElement('div');
        menuContainer.id = 'menu-container';
        document.body.appendChild(menuContainer);
        console.log("Menu container creado y añadido al DOM.");
    }

    menuContainer.style.display = 'block';
    menuContainer.innerHTML = '';

    let proximoDiaDisponible = buscarProximoDiaDisponible(dates);
    if (proximoDiaDisponible) {
        estadoSeleccion.fecha = proximoDiaDisponible;
        mostrarMenus(dates[proximoDiaDisponible], false);
    } else {
        console.log("No hay días disponibles próximamente.");
    }

    let rect = comedorButton.getBoundingClientRect();
    menuContainer.style.top = `${rect.bottom}px`;
}

function seleccionarBoton(boton) {
    document.querySelectorAll('.comedor-button').forEach(b => b.classList.remove('boton-seleccionado'));
    boton.classList.add('boton-seleccionado');
    boton.focus(); // Opcional: Enfocar el botón seleccionado

    // Llama a la función que maneja el cambio de selección
    estadoSeleccion.comedor = boton.innerText;
    // Suponiendo que `info` esté disponible globalmente o de alguna manera
    const infoComedor = JSON.parse(boton.dataset.info);
    mostrarDias(infoComedor.dates, boton);
}


function buscarProximoDiaDisponible(dates) {
    for (const dia of Object.keys(dates)) {
        if (!verificarDiaPasado(dia)) {
            return dia;
        }
    }
    return null;
}

function mostrarMenus(menus, esPasado) {
    let menusDetailContainer = document.getElementById('menus-detail-container');
    let payButton = document.getElementById('pay-button');
    menusDetailContainer.innerHTML = ''; // Limpiar el contenedor de detalles del menú
    menusDetailContainer.appendChild(crearTituloEstadoSeleccion());


    for (const [nombreMenu, platos] of Object.entries(menus)) {
        let tituloMenu = document.createElement('h3');
        tituloMenu.textContent = nombreMenu;
        menusDetailContainer.appendChild(tituloMenu);

        let tabla = document.createElement('table');
        tabla.innerHTML = `<tr><th>Item</th><th>Descripción</th><th>Alérgenos</th></tr>`;

        platos.forEach(plato => {
            let fila = tabla.insertRow();
            fila.insertCell().textContent = plato.item;
            fila.insertCell().textContent = plato.description;
            fila.insertCell().textContent = plato.allergens;
        });

        menusDetailContainer.appendChild(tabla);
    }

    if (esPasado) {
        let mensaje = document.createElement('p');
        let mensajeTexto = "Está consultando el menú de un día pasado";
        
        // Crear un elemento <strong> y establecer el texto en negrita
        let textoEnNegrita = document.createElement('strong');
        textoEnNegrita.textContent = mensajeTexto;

        // Agregar el elemento <strong> como hijo del párrafo
        mensaje.appendChild(textoEnNegrita);

        // Agregar el párrafo al contenedor
        menusDetailContainer.appendChild(mensaje);
    }else {
        payButton.style.display = 'block';
    }


}

function verificarDiaPasado(fechaTexto) {
    let partesFecha = fechaTexto.match(/\b\d{1,2}\b|\b\d{4}\b/g);

    if (partesFecha.length !== 2) {
        console.error("Formato de fecha no reconocido:", fechaTexto);
        return false;
    }

    let dia = partesFecha[0];
    let ano = partesFecha[1];
    let mesTexto = fechaTexto.match(/ENERO|FEBRERO|MARZO|ABRIL|MAYO|JUNIO|JULIO|AGOSTO|SEPTIEMBRE|OCTUBRE|NOVIEMBRE|DICIEMBRE/i)[0];
    let mes = obtenerMesEnNumero(mesTexto.toUpperCase());

    // Establecemos la fecha a las 15:30
    let fecha = new Date(ano, mes - 1, dia, 15, 30);

    console.log("Fecha analizada:", fecha);

    return fecha < new Date();
}

function crearTituloEstadoSeleccion() {
    let titulo = document.createElement('h1');
    titulo.innerHTML = `Menú del ${estadoSeleccion.fecha} en ${estadoSeleccion.comedor}:`;

    titulo.classList.add('titulo-estado-seleccion');
    
    return titulo;
}



function obtenerMesEnNumero(mesTexto) {
    const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    return meses.indexOf(mesTexto) + 1;
}

document.addEventListener('keydown', function(event) {
    if (estadoSeleccion.comedor === null) return; // Si no hay selección, no hacer nada

    let indiceActual = parseInt(document.querySelector('.comedor-button.boton-seleccionado')?.dataset.index);
    if (isNaN(indiceActual)) indiceActual = -1; // Si no hay botón seleccionado, establecer a -1

    event.preventDefault();
    
    if (event.key === 'ArrowRight') {
        indiceActual++;
    } else if (event.key === 'ArrowLeft') {
        indiceActual--;
    } else {
        return; // Si la tecla no es flecha izquierda o derecha, no hacer nada
    }

    const botones = document.querySelectorAll('.comedor-button');
    if (indiceActual >= botones.length) indiceActual = 0;
    if (indiceActual < 0) indiceActual = botones.length - 1;

    seleccionarBoton(botones[indiceActual]);
});

