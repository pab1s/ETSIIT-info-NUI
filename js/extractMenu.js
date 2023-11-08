const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const fs = require('fs');

async function obtenerContenidoHTML(url) {
  const browser = await puppeteer.launch({ headless: 'new' }); // Usar la nueva implementación de headless
  const page = await browser.newPage();

  // Navegar a la URL deseada
  await page.goto(url);

  // Obtener el contenido HTML de la página en una variable
  const contenidoHTML = await page.content();

  // Cerrar el navegador Puppeteer
  await browser.close();

  return contenidoHTML;
}

function extractMenu(htmlString) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Obtener el nombre de la facultad
  const facultyNameElement = document.querySelector('h1');
  const facultyName = facultyNameElement ? facultyNameElement.textContent.trim() : 'Unknown Faculty';

  // Obtener todas las filas de la tabla con la clase 'inline'
  const tableRows = Array.from(document.querySelectorAll('.inline tr'));

  // Estructura para almacenar la información del menú
  let menuData = {
    faculty: facultyName,
    dates: {}
  };

  let currentDate = ''; // Variable para mantener la fecha actual
  let currentMenuType = ''; // Variable para mantener el tipo de menú actual

  tableRows.forEach(row => {
    // Verificar si la fila contiene una fecha
    const dateCell = row.querySelector('th.leftalign');
    if (dateCell && dateCell.textContent) {
      currentDate = dateCell.textContent.trim();
      if (!menuData.dates[currentDate]) {
        menuData.dates[currentDate] = {};
      }
      return; // Continuar con la siguiente iteración
    }

    // Verificar si la fila contiene un tipo de menú
    const menuTypeCell = row.querySelector('td[colspan="2"]');
    if (menuTypeCell && menuTypeCell.textContent.startsWith('Menú')) {
      currentMenuType = menuTypeCell.textContent.trim();
      if (!menuData.dates[currentDate][currentMenuType]) {
        menuData.dates[currentDate][currentMenuType] = [];
      }
      return; // Continuar con la siguiente iteración
    }

    // Obtener las celdas de la fila actual
    const cells = Array.from(row.querySelectorAll('td'));

    // Comprobamos si es una fila con información de menú
    if (cells.length === 3) {
      const menuItem = {
        item: cells[0].textContent.trim(),
        description: cells[1].textContent.trim(),
        allergens: cells[2].textContent.trim()
      };
      menuData.dates[currentDate][currentMenuType].push(menuItem);
    }
  });

  return menuData;
}

(async () => {
  // URL de la página web que deseas obtener
  const url = 'https://scu.ugr.es/';

  // Obtener el contenido HTML de la página web
  const htmlString = await obtenerContenidoHTML(url);

  // Extraer el menú del contenido HTML
  const menu = extractMenu(htmlString);

  // Guardar el menú en un archivo JSON o realizar otras acciones según tus necesidades
  fs.writeFileSync('menu.json', JSON.stringify(menu, null, 2));
  console.log('Menú extraído y guardado en menu.json');
})();
