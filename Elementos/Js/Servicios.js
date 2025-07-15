// Funcionalidad para la página de servicios
document.addEventListener('DOMContentLoaded', function() {
    // Agregar animaciones de entrada para las tarjetas
    const tarjetas = document.querySelectorAll('.servicio-card');
    
    // Observador para animaciones al hacer scroll
    const observador = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observar todas las tarjetas
    tarjetas.forEach(tarjeta => {
        observador.observe(tarjeta);
    });
    
    // Funcionalidad para los botones de "Solicitar Servicio"
    const botonesSolicitar = document.querySelectorAll('.btn-solicitar-servicio');
    
    botonesSolicitar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el título del servicio
            const tarjeta = this.closest('.servicio-card');
            const tituloServicio = tarjeta.querySelector('h2').textContent;
            
            // Redirigir a la página de contacto con el servicio seleccionado
            const parametros = `?servicio=${encodeURIComponent(tituloServicio)}`;
            window.location.href = 'Contacto.html' + parametros;
        });
    });
    
    // Funcionalidad para abrir el formulario de postulación
    window.abrirFormularioPostulacion = function() {
        // Abrir en una nueva pestaña
        window.open('https://servidorhrz.github.io/Formulario-EcoSmart/', '_blank');
    };
});
