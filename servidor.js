const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const {updatePDFInDatabase } = require('./public/js/cargar_pdf_bd'); 

// Crear conexión a la base de datos SQLite
const db = new sqlite3.Database('usuarios.db'); // Asegúrate de que el archivo de la base de datos exista en la raíz del proyecto

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(cookieParser());

// Configuración de la sesión
app.use(session({
    secret: 'tu_clave_secreta', // Cambia esto por una clave secreta segura
    resave: false,
    saveUninitialized: true
}));

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Usuarios', 'views'));

// Middleware para analizar cuerpos de solicitud entrantes con urlencoded payloads
app.use(express.urlencoded({ extended: true }));

//Middleware para solicitudes JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

app.get('/comedores', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'comedores.html')); // Asegúrate de proporcionar la ruta correcta al archivo comedores.html
});

app.get('/tramites', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'tramites.html')); // Asegúrate de proporcionar la ruta correcta al archivo comedores.html
});


// Ruta para cargar el expediente en formato PDF
app.get('/expediente/:userId', (req, res) => {
    const userId = req.params.userId;

    db.get('SELECT expediente_pdf FROM usuarios WHERE username = ?', [userId], (err, row) => {
        if (err) {
            res.status(500).send('Error en la base de datos');
        } else if (row && row.expediente_pdf) {
            // Configura los encabezados de respuesta para indicar que se trata de un PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.send(row.expediente_pdf);
        } else {
            res.status(404).send('Usuario no encontrado o expediente no disponible');
        }
    });
});



app.get('/api/comedores', (req, res) => {
    fs.readFile('public/sources/menu.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.get('/api/login', (req, res) => {
  const qrCode = req.query.qr;

  db.get('SELECT username FROM usuarios WHERE uuid = ?', [qrCode], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Error en la base de datos" });
    } else if (row) {
      const token = jwt.sign({ username: row.username }, SECRET_KEY, { expiresIn: '1h' });
      res.cookie('authToken', token, { httpOnly: true, sameSite: 'strict' });
      res.json({ message: 'Autenticación exitosa' });
    } else {
      res.status(404).json({ error: "Código QR no válido" });
    }
  });
});

// Ruta para verificar si el usuario está logueado
app.get('/api/userinfo', (req, res) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const username = decoded.username;

        // Modificar la consulta para obtener el nombre y apellidos del usuario
        db.get('SELECT nombre, apellidos FROM usuarios WHERE username = ?', [username], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (row) {
                res.json({ username: username, nombre: row.nombre, apellidos: row.apellidos });
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'No autenticado' });
    }
});

// Ruta para cerrar sesión
app.get('/api/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: 'Sesión cerrada' });
});


// Ruta para la página privada que requiere autenticación
app.get('/pagina-privada', (req, res) => {
    if (req.session.loggedin) {
        res.render('pagina-privada', { username: req.session.username });
    } else {
        res.send('Por favor inicie sesión para ver esta página!');
    }
});

// Ruta para actualizar el PDF de un usuario específico
app.get('/actualizar-pdf', (req, res) => {
    // Aquí debes definir la ruta del archivo HTML y el ID del usuario
    const userId = "pablolivares"; // Cambia esto por el ID del usuario real

    updatePDFInDatabase('/home/acarriq/Documentos/77555779_296.pdf',  userId);
    res.send('Actualización de PDF iniciada para el usuario ' + userId);
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.send('Error al cerrar la sesión');
        } else {
            res.redirect('/login');
        }
    });
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en funcionamiento en http://localhost:3000');
});



app.get('/citas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'citas.html')); // Asegúrate de proporcionar la ruta correcta al archivo comedores.html
});

// Obtener las citas disponibles 
app.get('/citas/disponibles/:fecha', (req, res) => {
    const fecha = req.params.fecha;

    db.all('SELECT * FROM citas WHERE fecha = ? AND ocupado = 0', [fecha], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

//Reservar una cita

app.post('/citas/reservar', (req, res) => {
    const { fecha, hora_inicio, usuario_id } = req.body;
    console.log(`Intentando reservar cita en fecha: ${fecha}, hora inicio: ${hora_inicio}, para usuario ID: ${usuario_id}`); // Imprime los detalles de la cita

    db.run('UPDATE citas SET ocupado = 1, usuario_id = ? WHERE fecha = ? AND hora_inicio = ? AND ocupado = 0', [usuario_id, fecha, hora_inicio], function(err) {
        if (err) {
            console.error('Error al intentar reservar cita:', err.message); // Imprime el error si lo hay
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            console.log('No se reservó ninguna cita, es posible que ya estuviera ocupada o que los datos no coincidan.'); // Mensaje si no se cambió ninguna fila
            res.status(409).json({ error: 'Cita no disponible o ya reservada' });
            return;
        }
        console.log('Cita reservada con éxito.'); // Confirma que la reserva fue exitosa
        res.json({ message: 'Cita reservada con éxito' });
    });
});


//Cancelar una cita

app.post('/citas/cancelar', (req, res) => {
    const { cita_id, usuario_id } = req.body; // cita_id es el ID único de la cita

    db.run('UPDATE citas SET ocupado = 0, usuario_id = NULL WHERE id = ? AND usuario_id = ?', [cita_id, usuario_id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Cita no encontrada o no corresponde al usuario' });
            return;
        }
        res.json({ message: 'Cita cancelada con éxito' });
    });
});

