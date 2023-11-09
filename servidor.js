const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const path = require('path');

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
    res.sendFile(path.join(__dirname, 'public', 'html', 'comedores.html'));
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
