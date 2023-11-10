const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const {updateHTMLInDatabase } = require('./public/js/cargar_html_bs'); 

// Crear conexión a la base de datos SQLite
const db = new sqlite3.Database('usuarios.db'); // Asegúrate de que el archivo de la base de datos exista en la raíz del proyecto

const app = express();

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

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
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


//Ruta para cargar el expediente

app.get('/expediente/:userId', (req, res) => {
    const userId = req.params.userId;

    db.get('SELECT expediente_html FROM usuarios WHERE id = ?', [userId], (err, row) => {
        if (err) {
            res.status(500).send('Error en la base de datos');
        } else if (row) {
            res.send(row.expediente_html);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
});


app.get('/logged', (req, res) => {
    const qrCode = req.query.code; // Obtiene el código QR de los parámetros de consulta
    const htmlContent = `
        <html>
            <head>
                <title>Autenticación</title>
            </head>
            <body>
                <p>Estás autenticado, ${qrCode}</p>
            </body>
        </html>`;

    res.send(htmlContent); // Envía el contenido HTML generado
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

app.get('/api/qrcode', (req, res) => {
  const qrCode = req.query;

  // En verdad, devolvería el identificador de la tabla de SQL.
  res.send("Código recibido");
  /*
  db.get('SELECT * FROM users WHERE qrCode = ?', [qrCode], (err, row) => {
    if (err) {
      res.status(500).send("Error en la base de datos");
    } else if (row) {
      res.send("Autenticación válida");
    } else {
      res.send("Código QR no válido");
    }
  });
  */
});



// Ruta para la página privada que requiere autenticación
app.get('/pagina-privada', (req, res) => {
    if (req.session.loggedin) {
        res.render('pagina-privada', { username: req.session.username });
    } else {
        res.send('Por favor inicie sesión para ver esta página!');
    }
});

// Ruta para procesar el POST de inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err);
            res.send('Error en la base de datos');
            return;
        }

        if (row) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/pagina-privada');
        } else {
            res.send('Credenciales incorrectas');
        }
    });
});

// Ruta para actualizar el HTML de un usuario específico
app.get('/actualizar-html', (req, res) => {
    // Aquí debes definir la ruta del archivo HTML y el ID del usuario
    const userId = 1; // Cambia esto por el ID del usuario real

    updateHTMLInDatabase('./public/ExpedienteProvisional/Oficina Virtual de la Universidad de Granada.html', db, 1);
    res.send('Actualización de HTML iniciada para el usuario ' + userId);
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
