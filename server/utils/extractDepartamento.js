const fs = require('fs');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();

// Abrir la base de datos SQLite
let db = new sqlite3.Database('../usuarios.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos SQLite.');
});

async function extraerDatos() {
    const html = fs.readFileSync('departamento.html', 'utf8');
    const $ = cheerio.load(html);

    for (let row of $('.info-academica .profesorado.table-div .row').get()) {
        if (!$(row).hasClass('active-line')) {
            const nombreProfesor = normalizarTexto($(row).find('.nombre').text());
            const departamento = $(row).find('.departamento').text().trim();

            await actualizarDepartamentoEnBD(nombreProfesor, departamento);
        }
    }

    // Cerrar la conexión a la base de datos
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
        .normalize('NFD') // Descomponer en caracteres y diacríticos separados
        .replace(/[\u0300-\u036f]/g, '') // Eliminar los diacríticos
        .toLowerCase() // Convertir a minúsculas
        .trim() // Eliminar espacios al principio y al final
        .replace(/\s+/g, ' '); // Convertir múltiples espacios en uno solo
}

function actualizarDepartamentoEnBD(nombre, departamento) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE profesores SET departamento = ? WHERE LOWER(TRIM(nombre)) = ?`;

        db.run(sql, [departamento, nombre], function(err) {
            if (err) {
                console.error('Error al actualizar la base de datos:', err.message);
                reject(err);
            } else {
                if (this.changes > 0) {
                    console.log(`Fila actualizada. Profesor: ${nombre}, Departamento: ${departamento}`);
                } else {
                    console.log(`No se encontraron filas para actualizar. Profesor: ${nombre}`);
                }
                resolve();
            }
        });
    });
}

extraerDatos();

