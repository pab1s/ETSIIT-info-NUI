document.addEventListener('DOMContentLoaded', function() {
  const facultiesContainer = document.getElementById('faculties');
  const datesMenuContainer = document.getElementById('dates-menu');
  const menuTableContainer = document.getElementById('menu-table');

  // Función para cargar el archivo JSON
  function loadJson() {
    fetch('sources/menu.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonData => {
        createFacultyButtons(jsonData);
      })
      .catch(error => {
        console.log('Error al cargar el archivo JSON:', error);
      });
  }

  // Función para crear botones para cada facultad
  function createFacultyButtons(jsonData) {
    Object.keys(jsonData).forEach(faculty => {
      let button = document.createElement('button');
      button.textContent = faculty;
      button.onclick = function() { showDates(jsonData, faculty); };
      facultiesContainer.appendChild(button);
    });
  }

  // Función para mostrar las fechas cuando se hace clic en una facultad
  function showDates(jsonData, faculty) {
    // Limpiar contenedores
    datesMenuContainer.innerHTML = '';
    menuTableContainer.innerHTML = '';

    const dates = Object.keys(jsonData[faculty]['dates']);
    dates.forEach(date => {
      let dateButton = document.createElement('button');
      dateButton.textContent = date;
      dateButton.onclick = function() { showMenu(jsonData, faculty, date); };
      datesMenuContainer.appendChild(dateButton);
    });
  }

  // Función para mostrar el menú cuando se selecciona una fecha
  function showMenu(jsonData, faculty, date) {
    menuTableContainer.innerHTML = '';
    const menus = jsonData[faculty]['dates'][date];
    Object.keys(menus).forEach(menu => {
      let table = document.createElement('table');
      table.className = 'table-menu';
      let thead = table.createTHead();
      let tbody = table.createTBody();

      let row = thead.insertRow();
      let header = document.createElement('th');
      header.colSpan = 2;
      header.textContent = menu;
      row.appendChild(header);

      menus[menu].forEach(item => {
        let row = tbody.insertRow();
        let cellItem = row.insertCell();
        cellItem.textContent = item['item'];
        let cellDescription = row.insertCell();
        cellDescription.textContent = `${item['description']} ${item['allergens']}`;
      });

      menuTableContainer.appendChild(table);
    });
  }

  // Iniciar la carga del JSON
  loadJson();
});
