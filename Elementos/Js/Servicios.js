// Funcionalidad para la página de servicios
document.addEventListener('DOMContentLoaded', function() {
    // Agregar animaciones de entrada para los servicios
    const serviciosItems = document.querySelectorAll('.servicio-item');
    const procesoItems = document.querySelectorAll('.proceso-item');
    const elementosAnimados = document.querySelectorAll('.animar-entrada-izquierda, .animar-entrada-derecha, .card-animacion');
    
    // Establecer estados iniciales para elementos animados
    elementosAnimados.forEach(elemento => {
        if (elemento.classList.contains('animar-entrada-izquierda')) {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateX(-50px)';
        } else if (elemento.classList.contains('animar-entrada-derecha')) {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateX(50px)';
        } else if (elemento.classList.contains('card-animacion')) {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(30px) scale(0.9)';
        }
    });
    
    // Observador para animaciones al hacer scroll
    const observador = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determinar el tipo de animación basado en las clases
                if (entry.target.classList.contains('animar-entrada-izquierda')) {
                    entry.target.classList.add('fade-in-left');
                } else if (entry.target.classList.contains('animar-entrada-derecha')) {
                    entry.target.classList.add('fade-in-right');
                } else if (entry.target.classList.contains('card-animacion')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                } else {
                    entry.target.classList.add('fade-in-up');
                }
                // Desconectar el elemento una vez animado
                observador.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar todos los elementos de servicios
    serviciosItems.forEach(item => {
        observador.observe(item);
    });
    
    // Observar todos los elementos del proceso
    procesoItems.forEach(item => {
        observador.observe(item);
    });
    
    // Observar elementos con animaciones específicas
    elementosAnimados.forEach(item => {
        observador.observe(item);
    });
    
    // Funcionalidad para los botones de "Solicitar Servicio"
    const botonesSolicitar = document.querySelectorAll('.btn-solicitar-servicio');
    
    botonesSolicitar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el título del servicio
            const servicioItem = this.closest('.servicio-item');
            const tituloServicio = servicioItem.querySelector('h2').textContent;
            
            // Redirigir a la página de contacto con el servicio seleccionado
            const parametros = `?servicio=${encodeURIComponent(tituloServicio)}`;
            window.location.href = 'Contacto.html' + parametros;
        });
    });
    
    // Animación de números en las estadísticas (si existen)
    const animarNumeros = () => {
        const numeros = document.querySelectorAll('.numero-estadistica');
        
        numeros.forEach(numero => {
            const valor = parseInt(numero.textContent);
            const incremento = valor / 50;
            let contador = 0;
            
            const timer = setInterval(() => {
                contador += incremento;
                if (contador >= valor) {
                    numero.textContent = valor + (numero.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    numero.textContent = Math.floor(contador);
                }
            }, 30);
        });
    };
    
    // Observador para estadísticas
    const observadorEstadisticas = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarNumeros();
                observadorEstadisticas.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Si existe sección de estadísticas, observarla
    const seccionEstadisticas = document.querySelector('.seccion-estadisticas');
    if (seccionEstadisticas) {
        observadorEstadisticas.observe(seccionEstadisticas);
    }
    
    // Efecto parallax suave eliminado para evitar conflictos con animaciones hover
    
    // Funcionalidad para abrir el formulario de postulación
    window.abrirFormularioPostulacion = function() {
        // Verificar si estamos en la página de postulación
        if (window.location.pathname.includes('Postulacion.html')) {
            // Si estamos en la página de postulación, usar el modal
            if (typeof abrirFormularioExterno === 'function') {
                abrirFormularioExterno();
            } else {
                // Fallback si la función no está disponible
                window.open('https://servidorhrz.github.io/Formulario-EcoSmart/', '_blank');
            }
        } else {
            // Si estamos en otra página, redirigir a la página de postulación
            window.location.href = 'Postulacion.html';
        }
    };
    
    // Animación de entrada inicial para elementos visibles
    setTimeout(() => {
        const elementosVisibles = document.querySelectorAll('.titulo-animado, .animar-entrada');
        elementosVisibles.forEach((elemento, index) => {
            setTimeout(() => {
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
});
