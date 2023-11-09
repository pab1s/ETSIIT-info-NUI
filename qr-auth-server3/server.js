const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Establecer carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar conexión a la base de datos
const dbPath = path.join(__dirname, 'qr', 'mydb.sqlite3');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos mydb.sqlite3.');
});

// Ruta para servir la página de lectura de QR
app.get('/lector', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lector.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

// Ruta para manejar la autenticación con QR
app.post('/authenticate-qr', (req, res) => {
  const qrCode = req.body.qrCode;
  db.get('SELECT * FROM users WHERE qrCode = ?', [qrCode], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error en la base de datos' });
    } else {
      if (row) {
        res.json({ success: true, message: 'Usuario autenticado', user: row.name });
      } else {
        res.json({ success: false, message: 'Código QR no válido' });
      }
    }
  });
});

app.post('/verify-qr', async (req, res) => {
  const { uuid } = req.body; // Obtiene el UUID del cuerpo de la solicitud
  // Aquí iría la lógica para verificar el UUID contra la base de datos

  // Supongamos que tenemos una función que verifica el UUID y devuelve el nombre de usuario
  try {
      const userName = await verifyUserUUID(uuid);
      if (userName) {
          res.json({ isUserValid: true, userName });
      } else {
          res.json({ isUserValid: false });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
  }
});


// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Cerrar la base de datos al cerrar el servidor
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada y servidor detenido.');
    process.exit(0);
  });
});
