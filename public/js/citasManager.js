// citasManager.js

function eliminarCitasPasadas(db) {
    return new Promise((resolve, reject) => {
        const ahora = new Date();
        const fechaActual = ahora.toISOString().split('T')[0];
        const horaActual = ahora.toTimeString().split(':')[0] + ':' + ahora.toTimeString().split(':')[1];

        const sql = `DELETE FROM citas WHERE fecha < ? OR (fecha = ? AND hora_fin <= ?)`;
        db.run(sql, [fechaActual, fechaActual, horaActual], (err) => {
            if (err) {
                console.error('Error al eliminar citas pasadas:', err.message);
                reject(err);
            } else {
                console.log('Citas pasadas eliminadas correctamente');
                resolve();
            }
        });
    });
}




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


function agregarNuevasCitas(db) {
    let promesas = [];
    for (let i = 0; i < 5; i++) {
        // Ajustar la fecha al próximo día laborable
        const dia = new Date();
        dia.setDate(dia.getDate() + i + (dia.getDay() === 0 ? 1 : dia.getDay() === 6 ? 2 : 0));

        const fecha = dia.toISOString().split('T')[0];

        promesas.push(
            verificarCitasDisponibles(db, fecha).then(noHayCitas => {
                if (noHayCitas) {
                    let promesasCitas = [];
                    for (let hora = 9; hora < 13; hora++) {
                        for (let minutos = 0; minutos < 60; minutos += 15) {
                            // Crear la fecha de inicio de la cita
                            let inicioCita = new Date(dia.setHours(hora, minutos, 0, 0));
                            
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






module.exports = { eliminarCitasPasadas, agregarNuevasCitas };
