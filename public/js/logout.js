document.getElementById('exit-button').addEventListener('click', function() {
    fetch('/api/logout', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('No estás autenticado');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cerrar sesión: ' + error.message);
        })
        .finally(() => {
            window.location.href = '/';
        });
});
