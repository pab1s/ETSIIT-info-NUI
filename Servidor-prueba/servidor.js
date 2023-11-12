const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database('usuarios.db'); // Reemplaza 'usuarios.db' con la ruta a tu base de datos
const app = express();

app.use(session({
    secret: 'tu_clave_secreta', // Cambia esto por una clave secreta segura
    resave: false,
    saveUninitialized: true
}));

// Configura el servidor
app.set('view engine', 'ejs'); // Utilizaremos EJS como motor de plantillas
app.set('views', path.join(__dirname, 'Usuarios', 'views'));
app.use(express.urlencoded({ extended: true }));

// Ruta para iniciar sesión
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/pagina-privada', (req, res) => {
    // Aquí debes verificar si el usuario está autenticado antes de renderizar la página
    if (req.session.loggedin) {
      res.render('pagina-privada', { username: req.session.username });
    } else {
      res.send('Por favor inicie sesión para ver esta página!');
    }
  });

  // Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    // Destruir la sesión del usuario
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.send('Error al cerrar la sesión');
        } else {
            // Redireccionar al login después de cerrar la sesión
            res.redirect('/login');
        }
    });
});

  

// Ruta para procesar el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica las credenciales del usuario en la base de datos
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

// Resto del código (página-privada, logout, etc.) permanece sin cambios

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en funcionamiento en el puerto 3000');
});
