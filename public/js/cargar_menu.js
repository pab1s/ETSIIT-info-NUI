document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/comedores')
        .then(response => response.json())
        .then(data => {
            crearBotonesComedores(data);
            // Después de crear botones, selecciona el primero
            const primerBoton = document.querySelector('.comedor-button');
            if (primerBoton) {
                seleccionarBoton(primerBoton, true);
            }
        });
});

let estadoSeleccion = {
    comedor: null,
    fecha: null
};

function crearBotonesComedores(data) {
    const comedoresContainer = document.getElementById('comedores-container');

    for (const [nombreComedor, info] of Object.entries(data)) {
        let comedorButton = document.createElement('button');
        comedorButton.innerText = nombreComedor;
        comedorButton.classList.add('comedor-button');
        comedorButton.dataset.info = JSON.stringify(info);

        comedorButton.onclick = () => {
            seleccionarBoton(comedorButton, true);
        }

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

    Object.keys(dates).forEach(dia => {
        let esPasado = verificarDiaPasado(dia);
        let diaButton = document.createElement('button');
        diaButton.innerText = dia;
        diaButton.classList.add('dia-button');
        diaButton.dataset.dia = dia; 
        diaButton.dataset.info = JSON.stringify(dates[dia]);

        if (esPasado) {
            diaButton.classList.add('dia-pasado'); // Añadir una clase para días pasados
        }

        diaButton.onclick = () => {
            menuContainer.style.display = 'none';
            seleccionarBoton(diaButton, false);
        }

        menuContainer.appendChild(diaButton);
    });

    let rect = comedorButton.getBoundingClientRect();
    menuContainer.style.top = `${rect.bottom}px`;
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

function seleccionarBoton(boton, esComedor) {
    // Eliminar la clase 'boton-seleccionado' de todos los botones relevantes
    if (esComedor) {
        document.querySelectorAll('.comedor-button').forEach(b => b.classList.remove('boton-seleccionado'));
        estadoSeleccion.comedor = boton.innerText; // Actualizar el comedor seleccionado
        const infoComedor = JSON.parse(boton.dataset.info); // Obtener información del comedor
        mostrarDias(infoComedor.dates, boton); // Mostrar los días para el comedor seleccionado
        // Seleccionar el primer día no pasado
        const primerDiaNoPasado = encontrarPrimerDiaNoPasado(infoComedor.dates);
        setTimeout(() => {
            const botonDia = document.querySelector(`.dia-button[data-dia="${primerDiaNoPasado}"]`);
            if (botonDia) {
                seleccionarBoton(botonDia, false); // Falso porque es un botón de día
            }
        }, 0);

    } else {
        document.querySelectorAll('.dia-button').forEach(b => b.classList.remove('boton-seleccionado'));
        estadoSeleccion.fecha = boton.innerText; // Actualizar la fecha seleccionada
        const infoDia = JSON.parse(boton.dataset.info);
        mostrarMenus(infoDia, boton);
    }

    boton.classList.add('boton-seleccionado'); // Resaltar el botón seleccionado
    boton.focus(); // Enfocar el botón seleccionado
}
function mostrarDiasComedorSeleccionado() {
    const comedorSeleccionado = document.querySelector('.comedor-button.boton-seleccionado');
    console.log(comedorSeleccionado.dataset.info);
    if (comedorSeleccionado) {
        const infoComedor = JSON.parse(comedorSeleccionado.dataset.info);
        mostrarDias(infoComedor.dates, comedorSeleccionado); // Mostrar los días para el comedor seleccionado
    }
}

function encontrarPrimerDiaNoPasado(dates) {
    for (const dia of Object.keys(dates)) {
        if (!verificarDiaPasado(dia)) {
            return dia; // Retorna el primer día no pasado
        }
    }
    return Object.keys(dates)[0]; // Retorna el primer día si todos son pasados
}


let enfoqueEnComedores = true; // Para saber si el enfoque está en los comedores o en los días

document.addEventListener('keydown', function(event) {
    const botonesComedores = document.querySelectorAll('.comedor-button');
    const botonesDias = document.querySelectorAll('.dia-button');
    let indiceActual, botones;

    if (enfoqueEnComedores) {
        botones = botonesComedores;
    } else {
        botones = botonesDias;
    }

    indiceActual = Array.from(botones).findIndex(boton => boton.classList.contains('boton-seleccionado'));

    event.preventDefault();

    switch (event.key) {
        case 'ArrowRight':
            indiceActual = (indiceActual + 1) % botones.length;
            break;
        case 'ArrowLeft':
            indiceActual = (indiceActual - 1 + botones.length) % botones.length;
            break;
        case 'ArrowDown':
            if (enfoqueEnComedores) {
                mostrarDiasComedorSeleccionado(); // Implementar esta función
                enfoqueEnComedores = false;
                const primerBoton = document.querySelector('.dia-button');
                if (primerBoton) {
                    seleccionarBoton(primerBoton);
                }
                return;
            }
            break;
        case 'ArrowUp':
            if (!enfoqueEnComedores) {
                const menuContainer = document.getElementById('menu-container');
                if (menuContainer) {
                    menuContainer.style.display = 'none'; // Ocultar el menú de días
                }
                enfoqueEnComedores = true;
                return;
            }
            break;
        default:
            return;
    }

    seleccionarBoton(botones[indiceActual], enfoqueEnComedores);
});

