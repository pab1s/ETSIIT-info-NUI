const fs = require('fs');
const sqlite3 = require('sqlite3');

// Función para leer archivo HTML y actualizarlo en la base de datos para un usuario específico
function updateHTMLInDatabase(filePath, dbPath, userId) {
    fs.readFile(filePath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }
        
        const db = new sqlite3.Database('usuarios.db', (err) => {
            if (err) {
                console.error('Error al abrir la base de datos:', err);
                return;
            }
        });

        const sql = `UPDATE usuarios SET expediente_html = ? WHERE id = ?`;
        db.run(sql, [htmlContent, userId], (err) => {
            if (err) {
                console.error('Error al actualizar datos:', err);
                return;
            }
            console.log('HTML actualizado con éxito en la base de datos para el usuario ' + userId);
        });

        db.close((err) => {
            if (err) {
                console.error('Error al cerrar la base de datos:', err);
            }
        });
    });
}

module.exports = {
    updateHTMLInDatabase
};



