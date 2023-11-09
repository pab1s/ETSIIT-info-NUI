const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Asegúrate de tener instalado uuid con `npm install uuid`

// Crear o conectarse a la base de datos
const db = new sqlite3.Database('mydb.sqlite3', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Función para crear la tabla si no existe y luego insertar el usuario
const initializeDBAndCreateUser = () => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    qrCode TEXT
  )`, [], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Tabla "users" está lista o creada.');
      
      // Generar UUID y QR Code
      const userName = 'Profesor'; // Aquí defines el nombre del usuario
      const uniqueIdForQR = uuidv4();

      // Insertar el usuario en la base de datos
      const sql = `INSERT INTO users (name, qrCode) VALUES (?, ?)`;
      db.run(sql, [userName, uniqueIdForQR], function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Usuario creado con ID: ${this.lastID} y UUID: ${uniqueIdForQR}`);

          // Crear el código QR y guardarlo como archivo
          QRCode.toFile(`user-${this.lastID}-QR.png`, uniqueIdForQR, {
            color: {
              dark: '#000',  // Códigos QR son normalmente negros
              light: '#FFF', // Fondo transparente
            }
          }, function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log('Código QR generado y guardado como archivo.');
            }
          });
        }
      });
    }
  });
};

initializeDBAndCreateUser();

// Cerrar la base de datos
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Cierre de la conexión a la base de datos.');
});
