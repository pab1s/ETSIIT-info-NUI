document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/comedores')
        .then(response => response.json())
        .then(data => crearBotonesComedores(data));
});

function crearBotonesComedores(data) {
    const comedoresContainer = document.getElementById('comedores-container');

    for (const [nombreComedor, info] of Object.entries(data)) {
        let comedorButton = document.createElement('button');
        comedorButton.innerText = nombreComedor;
        comedorButton.classList.add('comedor-button');

        comedorButton.onmouseover = () => mostrarDias(info.dates, comedorButton);

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

        if (esPasado) {
            diaButton.classList.add('dia-pasado'); // Añadir una clase para días pasados
        }

        diaButton.onclick = () => {
            menuContainer.style.display = 'none';
            mostrarMenus(dates[dia], esPasado);
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




function obtenerMesEnNumero(mesTexto) {
    const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    return meses.indexOf(mesTexto) + 1;
}
