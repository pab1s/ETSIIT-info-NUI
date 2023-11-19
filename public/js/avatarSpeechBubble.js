document.addEventListener('DOMContentLoaded', (event) => {
    const avatar = document.getElementById('avatar');
    const bocadillo = document.getElementById('bocadillo');

    avatar.addEventListener('click', () => {
        // Alternar la visibilidad del bocadillo de texto
        if (bocadillo.style.display === 'block') {
            bocadillo.style.display = 'none';
        } else {
            bocadillo.style.display = 'block';
        }
    });
});
