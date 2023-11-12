// user-auth.js
window.addEventListener('DOMContentLoaded', (event) => {
    verificarSesion();
});

function verificarSesion() {
    fetch('/api/userinfo')
        .then(response => {
            if (!response.ok) {
                throw new Error('No autenticado');
            }
            return response.json();
        })
        .then(data => {
            actualizarUIUsuarioLogueado(data.nombre, data.apellidos);
        })
        .catch(error => {
            actualizarUIUsuarioNoLogueado();
        });
}

function actualizarUIUsuarioLogueado(nombre, apellidos) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <p>Hola, <strong>${nombre} ${apellidos}</strong></p>
        <button onclick="logout()">Cerrar Sesión</button>
    `;
}
function actualizarUIUsuarioNoLogueado() {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <p>No estás logueado.</p>
        <button onclick="window.location.href='/'">Iniciar sesión</button>
    `;
}


function logout() {
    fetch('/api/logout')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cerrar sesión');
            }
            return response.json();
        })
        .then(data => {
            actualizarUIUsuarioNoLogueado();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cerrar sesión');
        });
}

