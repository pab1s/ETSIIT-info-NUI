const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' }); // Usar la nueva implementación de headless
  const page = await browser.newPage();

  // Navegar a la URL deseada
  await page.goto('https://scu.ugr.es/');

  // Obtener el contenido HTML de la página
  const contenidoHTML = await page.content();

  // Guardar el contenido HTML en un archivo llamado "web.html"
  const fs = require('fs');
  fs.writeFileSync('web.html', contenidoHTML);

  // Cerrar el navegador Puppeteer
  await browser.close();
})();
