const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usuarios.db');

// Crear una tabla "usuarios" en la base de datos
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

    // Insertar algunos usuarios de prueba
    const stmt = db.prepare("INSERT INTO usuarios (username, password) VALUES (?, ?)");
    stmt.run("usuario1", "contrasena1");
    stmt.run("usuario2", "contrasena2");
    stmt.run("usuario3", "contrasena3");
    stmt.run("usuario4", "contrasena4");
    stmt.run("usuario5", "contrasena5");
    stmt.finalize();

    console.log("Base de datos y tabla 'usuarios' creadas y usuarios de prueba insertados.");
});

db.close();
