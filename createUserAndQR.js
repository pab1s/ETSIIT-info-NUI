const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('usuarios.db');

// Función para crear un nuevo usuario
const createUser = (username, nombre, apellidos, correo) => {
  const uuid = uuidv4();

  db.run(`INSERT INTO usuarios (uuid, username, nombre, apellidos, correo) VALUES (?, ?, ?, ?, ?)`, 
    [uuid, username, nombre, apellidos, correo], function(err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Usuario creado con UUID: ${uuid}`);

        // Crear el código QR y guardarlo como archivo
        QRCode.toFile(`qr-codes/${username}-QR.png`, uuid, {
          color: {
            dark: '#000',
            light: '#FFF'
          }
        }, function(err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log('Código QR generado y guardado.');
          }
        });
      }
    });
};

// Ejemplo de uso
createUser('pablolivares', 'Pablo', 'Olivares', 'pabloolivares@example.com');

// No olvides cerrar la base de datos cuando hayas terminado
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Cierre de la conexión a la base de datos.');
});
