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

  // Inicialmente, un objeto para almacenar la información del menú indexado por facultad
  let menusByFaculty = {};

  function exploreAndProcess(node, menuData) {

    if (node.tagName === 'TR' && node.querySelector('th.leftalign')) {
      const currentDate = node.textContent.trim();
      menuData.dates[currentDate] = menuData.dates[currentDate] || {};
      menuData.currentDate = currentDate;
    } else if (node.tagName === 'TD' && node.getAttribute('colspan') === "2") {
      const currentMenuType = node.textContent.trim();
      if(currentMenuType.includes("Menú")){
        menuData.dates[menuData.currentDate][currentMenuType] = [];
        menuData.currentMenuType = currentMenuType;
      }
    } else if (node.tagName === 'TR' && menuData.currentMenuType) {
      const cells = Array.from(node.querySelectorAll('td'));
      if (cells.length === 3) {
        const menuItem = {
          item: cells[0].textContent.trim(),
          description: cells[1].textContent.trim(),
          allergens: cells[2].textContent.trim()
        };
        menuData.dates[menuData.currentDate][menuData.currentMenuType].push(menuItem);
      }
    }

    // Recorre los nodos hijos recursivamente
    Array.from(node.children).forEach(child => {
      exploreAndProcess(child, menuData);
    });
  }

  const facultyHeaders = Array.from(document.querySelectorAll('h1'));

  facultyHeaders.forEach(header => {
    if (header.textContent.includes('Menú semanal | ')) {
      const facultyName = header.textContent.split('Menú semanal | ')[1].trim();

      // Inicializa la entrada para la facultad si aún no existe
      if (!menusByFaculty[facultyName]) {
        menusByFaculty[facultyName] = {
          dates: {},
          currentDate: '',
          currentMenuType: ''
        };
      }

      let contentNode = header.nextElementSibling;
      while (contentNode && contentNode.tagName !== 'H1') {
        exploreAndProcess(contentNode, menusByFaculty[facultyName]);
        contentNode = contentNode.nextElementSibling;
      }
    }
  });

  // Eliminar las propiedades currentDate y currentMenuType antes de retornar los datos
  for (const faculty in menusByFaculty) {
    delete menusByFaculty[faculty].currentDate;
    delete menusByFaculty[faculty].currentMenuType;
  }

  return menusByFaculty;
}



(async () => {
  // URL de la página web que deseas obtener
  const url = 'https://scu.ugr.es/';

  // Obtener el contenido HTML de la página web
  const htmlString = await obtenerContenidoHTML(url);

  // Extraer el menú del contenido HTML

  const menus = extractMenu(htmlString);

  // Guardar el menú en un archivo JSON o realizar otras acciones según tus necesidades
  fs.writeFileSync('menu.json', JSON.stringify(menus, null, 2));
  console.log('Menú extraído y guardado en menu.json');
})();
