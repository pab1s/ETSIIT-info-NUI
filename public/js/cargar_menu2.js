document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/comedores')
        .then(response => response.json())
        .then(data => mostrarMenusDelDia(data));
});

let estadoSeleccion = {
    comedor: null,
    fecha: new Date().toISOString().split('T')[0]  // Asumimos que el formato es YYYY-MM-DD
};

function mostrarMenusDelDia(data) {
    const menusDetailContainer = document.getElementById('menus-detail-container');
    const payButton = document.getElementById('pay-button');

    // Suponiendo que data contiene un objeto con fechas como claves y menús como valores
    const menuDelDia = data[estadoSeleccion.fecha];

    if (menuDelDia) {
        mostrarMenus(menuDelDia, false);
        payButton.style.display = 'block';
    } else {
        menusDetailContainer.innerHTML = '<p>No hay menús disponibles para hoy.</p>';
        payButton.style.display = 'none';
    }
}

function mostrarMenus(menus, esPasado) {
    let menusDetailContainer = document.getElementById('menus-detail-container');
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
}
