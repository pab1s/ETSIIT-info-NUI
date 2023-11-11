const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Función para leer archivo PDF y actualizarlo en la base de datos para un usuario específico
function updatePDFInDatabase(filePath, userId) {
    fs.readFile(filePath, (err, pdfBuffer) => {
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

        const sql = `UPDATE usuarios SET expediente_pdf = ? WHERE id = ?`;
        db.run(sql, [pdfBuffer, userId], (err) => {
            if (err) {
                console.error('Error al actualizar datos:', err);
                return;
            }
            console.log('PDF actualizado con éxito en la base de datos para el usuario ' + userId);
        });

        db.close((err) => {
            if (err) {
                console.error('Error al cerrar la base de datos:', err);
            }
        });
    });
}

module.exports = {
    updatePDFInDatabase
};
