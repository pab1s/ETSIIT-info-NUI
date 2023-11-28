document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/informacion-usuario', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('No se pudo obtener la información del usuario');
        }
    })
    .then(data => {
        document.getElementById('info').textContent = data.nombre + ' ' + data.apellidos;
        // Establece la imagen de perfil del usuario
        if (data.foto) {
            const fotoUrl = 'data:image/jpeg;base64,' + data.foto;
            document.getElementById('foto-usuario').src = fotoUrl;
        } else {
            const fotoPredeterminadaUrl = '../assets/FotoPredeterminada.png';
            document.getElementById('foto-usuario').src = fotoPredeterminadaUrl;
        }
        
        const qrUrl = '../../server/qr-codes/' + encodeURIComponent(data.username) + '-QR.png';
        console.log('Ruta del QR: ', qrUrl); // Imprime la ruta en la consola
        document.getElementById('qr-usuario').src = qrUrl; 
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


    // Botón para activar la cámara
    document.getElementById('boton-activar-camara').addEventListener('click', function() {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
            document.getElementById('contenedor-camara').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al acceder a la cámara:', error);
        });
    });

    // Capturar la imagen
    document.getElementById('boton-capturar').addEventListener('click', function() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 640, 480);

        // Mostrar vista previa de la foto capturada
        const img = document.getElementById('foto-capturada');
        canvas.toBlob(function(blob) {
            img.src = URL.createObjectURL(blob);
            img.style.display = 'block';
        });

        document.getElementById('boton-guardar').style.display = 'block';
        document.getElementById('boton-repetir').style.display = 'block';
    });

    // Guardar la imagen
    document.getElementById('boton-guardar').addEventListener('click', function() {
        const canvas = document.getElementById('canvas');
        canvas.toBlob(function(blob) {
            const formData = new FormData();
            formData.append('foto', blob, 'imagen.png');

            enviarFotoAlServidor(formData);
        });
    });

    // Botón para repetir la captura de la foto
    document.getElementById('boton-repetir').addEventListener('click', function() {
        document.getElementById('foto-capturada').style.display = 'none';
        document.getElementById('boton-guardar').style.display = 'none';
        document.getElementById('boton-repetir').style.display = 'none';
    });


function enviarFotoAlServidor(formData) {
    fetch('/api/guardar-foto', {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al guardar la foto');
        }
    })
    .then(data => {
        // Opcional: ocultar el contenedor de la cámara después de guardar la foto
        document.getElementById('contenedor-camara').style.display = 'none';
        const mensajeActualizacion = document.getElementById('mensaje-actualizacion');
        mensajeActualizacion.style.display = 'block'; // Mostrar el mensaje
        
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


