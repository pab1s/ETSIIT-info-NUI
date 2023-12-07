const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../usuarios.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos SQLite.');
});

async function extraerLugarDespacho(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const lugar = $('.tutorias .table-div .row:not(.active-line) .lugar').first().text().trim();
        return lugar;
    } catch (error) {
        console.error('Error al extraer el lugar del despacho:', error.message);
        return null;
    }
}

function actualizarDespachoEnBD(nombre, despacho) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE profesores SET despacho = ? WHERE LOWER(TRIM(nombre)) = ?`;

        db.run(sql, [despacho, nombre], function(err) {
            if (err) {
                console.error('Error al actualizar la base de datos:', err.message);
                reject(err);
            } else {
                console.log(`Fila actualizada. Profesor: ${nombre}, Despacho: ${despacho}`);
                resolve();
            }
        });
    });
}

async function extraerDatos() {
    const html = fs.readFileSync('departamento.html', 'utf8');
    const $ = cheerio.load(html);

    for (let row of $('.info-academica .profesorado.table-div .row').get()) {
        if (!$(row).hasClass('active-line')) {
            const nombreProfesor = $(row).find('.nombre').text().trim();
            const urlProfesor = $(row).find('.nombre a').attr('href');

            if (urlProfesor) {
                const lugarDespacho = await extraerLugarDespacho(urlProfesor);
                if (lugarDespacho) {
                    await actualizarDespachoEnBD(normalizarTexto(nombreProfesor), lugarDespacho);
                }
            }
        }
    }

    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('Conexión a la base de datos cerrada.');
        }
    });
}

function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

extraerDatos();
