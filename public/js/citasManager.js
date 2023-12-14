/**
 * @file citasManager.js - Script para la gestión de citas de la aplicación web de la ETSIT ULL.
 * @author Alvaro Carrillo
 * @version 1.0
 */

/**
 * Elimina las citas pasadas de la base de datos.
 * @param {Object} db - Objeto de base de datos SQLite.
 * @returns {Promise<number>} - Promesa que resuelve con el número de filas afectadas.
 * @throws {Error} - Error si hay algún problema al eliminar citas pasadas.
 */
function eliminarCitasPasadas(db) {
    return new Promise((resolve, reject) => {
        const ahora = new Date();
        const fechaActual = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours();

        // Prepara la consulta SQL para eliminar las citas pasadas.
        // Si aún no son las 13:00, mantendrá las citas de hoy.
        let sql;
        let params;

        if (horaActual >= 13) {
            // Si la hora actual es igual o superior a las 13:00, elimina todas las citas de hoy y días anteriores.
            sql = `DELETE FROM citas WHERE fecha <= ?`;
            params = [fechaActual];
        } else {
            // Si aún no son las 13:00, solo elimina las citas de días anteriores.
            sql = `DELETE FROM citas WHERE fecha < ?`;
            params = [fechaActual];
        }

        db.run(sql, params, function (err) {
            if (err) {
                console.error('Error al eliminar citas pasadas:', err.message);
                reject(err);
            } else {
                console.log(`Citas pasadas eliminadas correctamente, total eliminadas: ${this.changes}`);
                resolve(this.changes); // Resuelve con el número de filas afectadas
            }
        });
    });
}

/**
 * Verifica la disponibilidad de citas en una fecha específica.
 * @param {Object} db - Objeto de base de datos SQLite.
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'.
 * @returns {Promise<boolean>} - Promesa que resuelve con true si no hay citas disponibles, false en caso contrario.
 * @throws {Error} - Error si hay algún problema al verificar citas disponibles.
 */
function verificarCitasDisponibles(db, fecha) {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS numCitas FROM citas WHERE fecha = ?', [fecha], (err, row) => {
            if (err) {
                console.error('Error al verificar citas disponibles:', err.message);
                reject(err);
            } else {
                resolve(row.numCitas === 0);
            }
        });
    });
}

/**
 * Agrega nuevas citas para los próximos días hábiles.
 * @param {Object} db - Objeto de base de datos SQLite.
 * @returns {Promise<void[]>} - Promesa que resuelve cuando todas las nuevas citas han sido agregadas.
 * @throws {Error} - Error si hay algún problema al agregar nuevas citas.
 */
function agregarNuevasCitas(db) {
    let promesas = [];
    const ahora = new Date();
    const fechaActual = ahora.toISOString().split('T')[0];
    const horaActual = ahora.toTimeString().split(':')[0];

    for (let i = 0; i < 6; ) { // Se incrementará solo si es un día hábil
        // Ajustar la fecha al próximo día laborable
        ahora.setDate(ahora.getDate() + 1);

        // Si es sábado (6) o domingo (0), continúa al siguiente día
        if (ahora.getDay() === 0 || ahora.getDay() === 6) continue;

        const fecha = ahora.toISOString().split('T')[0];

        // Si es el día actual y ya pasó la hora de fin de citas, continúa al siguiente día
        if (fecha === fechaActual && horaActual >= 13) continue;

        // Si llegamos aquí, es un día hábil y válido
        i++; // Incrementamos el contador de días hábiles

        promesas.push(
            verificarCitasDisponibles(db, fecha).then(noHayCitas => {
                if (noHayCitas) {
                    let promesasCitas = [];
                    for (let hora = 9; hora < 13; hora++) {
                        for (let minutos = 0; minutos < 60; minutos += 15) {
                           // Crear la fecha de inicio de la cita
                           let inicioCita = new Date(ahora.setHours(hora, minutos, 0, 0));
                            
                           // Añadir 15 minutos para obtener la fecha de fin de la cita
                           let finCita = new Date(inicioCita.getTime() + 15 * 60000);

                           // Formatear las horas para SQL
                           const horaInicio = inicioCita.toTimeString().substring(0, 5);
                           const horaFin = finCita.toTimeString().substring(0, 5);

                           let promesaCita = new Promise((resolve, reject) => {
                               db.run('INSERT INTO citas (fecha, hora_inicio, hora_fin, ocupado) VALUES (?, ?, ?, 0)', [fecha, horaInicio, horaFin], (err) => {
                                   if (err) {
                                       console.error('Error al agregar nuevas citas:', err.message);
                                       reject(err);
                                   } else {
                                       resolve();
                                   }
                               });
                           });
                           promesasCitas.push(promesaCita);
                        }
                    }
                    return Promise.all(promesasCitas).then(() => {
                        console.log(`Nuevas citas agregadas para el día ${fecha}`);
                    });
                }
            })
        );
    }
    return Promise.all(promesas);
}

/**
 * Inicializa el proceso de citas eliminando las pasadas y agregando nuevas citas.
 * @param {Object} db - Objeto de base de datos SQLite.
 * @returns {Promise<void>} - Promesa que resuelve cuando el proceso de inicialización está completo.
 * @throws {Error} - Error si hay algún problema durante la inicialización de citas.
 */
async function inicializarCitas(db) {
    try {
        await eliminarCitasPasadas(db);
        await agregarNuevasCitas(db);
        console.log('Proceso de inicialización de citas completado.');
    } catch (error) {
        console.error('Error durante la inicialización de citas:', error);
    }
}

module.exports = { inicializarCitas };

