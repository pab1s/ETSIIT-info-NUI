const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const path = require('path');
const { eliminarCitasPasadas, agregarNuevasCitas } = require('../public/js/citasManager');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Crear conexión a la base de datos SQLite
const db = new sqlite3.Database('./usuarios.db'); // Asegúrate de que el archivo de la base de datos exista en la raíz del proyecto

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
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta para servir la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'main.html'));
});

app.get('/comedores', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'comedores.html')); // Asegúrate de proporcionar la ruta correcta al archivo comedores.html
});

app.get('/tramites', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'tramites.html')); // Asegúrate de proporcionar la ruta correcta al archivo comedores.html
});

app.get('/docencia', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'docencia.html')); // Asegúrate de proporcionar la ruta correcta al archivo comedores.html
});





app.get('/api/comedores', (req, res) => {
    fs.readFile('../public/sources/menu.json', 'utf8', (err, data) => {
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

// Ruta para obtener información de docencia
app.get('/api/docencia/', (req, res) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const username = decoded.username;

        // Consulta para obtener la información de docencia
        const query = `
            SELECT a.asignatura, a.dia_de_la_semana, a.hora_inicio, a.hora_fin, a.profesor, a.tipo_de_grupo, a.grupo
            FROM asignaturas a
            JOIN matriculas m ON a.indice = m.indice
            WHERE m.username = ?`;

        db.all(query, [username], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (rows.length > 0) {
                res.json({ docencia: rows });
            } else {
                res.status(404).json({ error: 'Información de docencia no encontrada' });
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'No autenticado' });
    }
});


// Ruta para la página privada que requiere autenticación
app.get('/pagina-privada', (req, res) => {
    if (req.session.loggedin) {
        res.render('pagina-privada', { username: req.session.username });
    } else {
        res.send('Por favor inicie sesión para ver esta página!');
    }
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

db.serialize(() => {
    eliminarCitasPasadas(db);
    agregarNuevasCitas(db);

    app.listen(3000, () => {
        console.log('Servidor en funcionamiento en http://localhost:3000');
    });
});



app.get('/citas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'citas.html')); // Asegúrate de proporcionar la ruta correcta al archivo comedores.html
});

// Obtener las citas disponibles 
app.get('/citas/disponibles/:fecha', (req, res) => {
    const fecha = req.params.fecha;

    // Cambia la consulta para seleccionar también el campo 'ocupado'
    db.all('SELECT id, hora_inicio, hora_fin, ocupado FROM citas WHERE fecha = ?', [fecha], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Las filas incluirán ahora un campo 'ocupado' que indica si la cita está ocupada o no
        res.json(rows);
    });
});


//Reservar una cita

app.post('/citas/reservar', (req, res) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const username = decoded.username;

        const { fecha, hora_inicio} = req.body;
        console.log(`Intentando reservar cita en fecha: ${fecha}, hora inicio: ${hora_inicio}, para usuario ID: ${username}`); // Imprime los detalles de la cita

        db.run('UPDATE citas SET ocupado = 1, usuario_id = ? WHERE fecha = ? AND hora_inicio = ? AND ocupado = 0', [username, fecha, hora_inicio], function(err) {
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
    } catch (error) {
        res.status(401).json({ error: 'No autenticado' });
    }


});


//Cancelar una cita

app.post('/citas/cancelar', (req, res) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const username = decoded.username;

        const { cita_id} = req.body; // cita_id es el ID único de la cita

        db.run('UPDATE citas SET ocupado = 0, usuario_id = NULL WHERE id = ? AND usuario_id = ?', [cita_id, username], function(err) {
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
        } catch (error) {
            res.status(401).json({ error: 'No autenticado' });
        }

});



app.get('/api/expediente', (req, res) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const username = decoded.username;
   
    db.get('SELECT expediente FROM usuarios WHERE username = ?', [username], (err, row) => {
        if (err) {
            res.status(500).send('Error en la base de datos');
        } else if (row) {
            res.send(row.expediente);
        } else {
            res.status(404).send('Expediente no encontrado');
        }
    });
    } catch (error) {
        res.status(401).json({ error: 'No autenticado' });
    }
});


