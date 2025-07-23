// JavaScript para la página de Postulación

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initScrollAnimations();
    setupModalEvents();
    suavizarScroll();
    efectosHoverAvanzados();
    mostrarProgresoScroll();
    lazyLoadImagenes();
    optimizarMovil();
    validarNavegador();
    mejorarAccesibilidad();
    optimizarRendimiento();
    manejarErrores();
    
    console.log('✅ Funcionalidades de Postulación cargadas');
});

// ===== ANIMACIONES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Agregar delay escalonado para elementos múltiples
                if (entry.target.classList.contains('politica-seccion')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
                
                // Agregar delay para elementos con clase delay
                if (entry.target.classList.contains('delay-1')) {
                    entry.target.style.transitionDelay = '0.1s';
                } else if (entry.target.classList.contains('delay-2')) {
                    entry.target.style.transitionDelay = '0.2s';
                } else if (entry.target.classList.contains('delay-3')) {
                    entry.target.style.transitionDelay = '0.3s';
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos con animación
    const animatedElements = document.querySelectorAll(
        '.animar-entrada, .animar-entrada-izquierda, .animar-entrada-derecha, ' +
        '.animar-escala, .animar-rotacion, .animar-desvanecimiento, ' +
        '.contador-animado, .card-animacion, .titulo-animado, ' +
        '.politica-seccion, .formulario-container'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== FUNCIONES ADICIONALES SIMILARES A HOME.JS =====

// Función para suavizar el scroll hacia las secciones
function suavizarScroll() {
    const enlaces = document.querySelectorAll('a[href^="#"]');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            
            const objetivo = document.querySelector(this.getAttribute('href'));
            if (objetivo) {
                objetivo.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función para añadir efectos de hover avanzados a las tarjetas
function efectosHoverAvanzados() {
    const tarjetas = document.querySelectorAll('.formulario-container, .politica-container, .politica-seccion');
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(255, 215, 0, 0.2)';
        });
        
        tarjeta.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Función para mostrar progreso de scroll
function mostrarProgresoScroll() {
    const barraProgreso = document.createElement('div');
    barraProgreso.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #FFD700, #FFA500);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(barraProgreso);
    
    window.addEventListener('scroll', () => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollActual = window.pageYOffset;
        const porcentaje = (scrollActual / scrollTotal) * 100;
        barraProgreso.style.width = porcentaje + '%';
    });
}

// Función para lazy loading de imágenes
function lazyLoadImagenes() {
    const imagenes = document.querySelectorAll('img[src]');
    
    const configuracionObservador = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };
    
    const observadorImagenes = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const img = entrada.target;
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
                observadorImagenes.unobserve(img);
            }
        });
    }, configuracionObservador);
    
    imagenes.forEach(img => {
        img.style.opacity = '0';
        observadorImagenes.observe(img);
    });
}

// Función para mejorar el rendimiento en móviles
function optimizarMovil() {
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Reducir efectos complejos en móviles
        document.body.classList.add('es-movil');
        
        // Desactivar hover en móviles
        const estilosMovil = document.createElement('style');
        estilosMovil.textContent = `
            @media (max-width: 768px) {
                .formulario-container:hover,
                .politica-container:hover,
                .politica-seccion:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }
            }
        `;
        document.head.appendChild(estilosMovil);
    }
}

// Función para abrir el formulario externo
function abrirFormularioExterno() {
    const modal = document.getElementById('modalConfirmacion');
    modal.style.display = 'block';
    
    // Agregar clase para animación
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modalConfirmacion');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Función para confirmar la redirección
function confirmarRedireccion() {
    // URL del formulario externo
    const urlFormulario = 'https://servidorhrz.github.io/Formulario-EcoSmart/';
    
    // Abrir en nueva ventana/pestaña
    window.open(urlFormulario, '_blank', 'noopener,noreferrer');
    
    // Cerrar el modal
    cerrarModal();
    
    // Mostrar mensaje de confirmación
    mostrarMensajeConfirmacion();
}

// Función para mostrar mensaje de confirmación
function mostrarMensajeConfirmacion() {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-exito';
    notificacion.innerHTML = `
        <div class="notificacion-content">
            <i class="fas fa-check-circle"></i>
            <span>Formulario abierto en nueva ventana</span>
        </div>
    `;
    
    // Agregar estilos inline para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #7CB342, #558B2F);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    
    // Agregar al body
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Configurar eventos del modal
function setupModalEvents() {
    const modal = document.getElementById('modalConfirmacion');
    
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            cerrarModal();
        }
    });
}

// Inicializar animaciones de scroll (función original actualizada)
function initScrollAnimationsOriginal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Agregar delay escalonado para elementos múltiples
                if (entry.target.classList.contains('politica-seccion')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos con animación
    const animatedElements = document.querySelectorAll('.animar-entrada, .politica-seccion');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para validar y mejorar la experiencia del usuario
function validarNavegador() {
    // Verificar si el navegador soporta las características necesarias
    if (!window.IntersectionObserver) {
        // Fallback para navegadores antiguos
        console.warn('IntersectionObserver no soportado, usando fallback');
        const elements = document.querySelectorAll('.animar-entrada');
        elements.forEach(el => el.classList.add('visible'));
    }
    
    // Verificar si el navegador puede abrir ventanas emergentes
    if (!window.open) {
        console.warn('window.open no soportado');
        // Modificar la función de redirección para usar location.href
        window.confirmarRedireccion = function() {
            window.location.href = 'https://servidorhrz.github.io/Formulario-EcoSmart/';
        };
    }
}

// Función para mejorar la accesibilidad
function mejorarAccesibilidad() {
    // Agregar atributos ARIA a elementos interactivos
    const btnPostularse = document.querySelector('.btn-postularse');
    if (btnPostularse) {
        btnPostularse.setAttribute('aria-label', 'Abrir formulario de postulación en nueva ventana');
    }
    
    const modal = document.getElementById('modalConfirmacion');
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
    }
    
    // Agregar navegación por teclado mejorada
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab' && modal.style.display === 'block') {
            // Mantener el foco dentro del modal
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Función para optimizar el rendimiento
function optimizarRendimiento() {
    // Lazy loading para imágenes si las hay
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Debounce para eventos de scroll si es necesario
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            // Lógica de scroll optimizada aquí si es necesaria
        }, 16); // ~60fps
    });
}

// Función para manejar errores
function manejarErrores() {
    window.addEventListener('error', function(event) {
        console.error('Error en la página de postulación:', event.error);
        
        // Mostrar mensaje de error amigable al usuario si es crítico
        if (event.error && event.error.message.includes('formulario')) {
            mostrarMensajeError('Hubo un problema al cargar el formulario. Por favor, intenta nuevamente.');
        }
    });
}

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
    const errorNotification = document.createElement('div');
    errorNotification.className = 'notificacion-error';
    errorNotification.innerHTML = `
        <div class="notificacion-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #f44336, #d32f2f);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(errorNotification);
    
    setTimeout(() => {
        errorNotification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        errorNotification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (errorNotification.parentNode) {
                errorNotification.parentNode.removeChild(errorNotification);
            }
        }, 300);
    }, 5000);
}

// Inicializar todas las funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    validarNavegador();
    mejorarAccesibilidad();
    optimizarRendimiento();
    manejarErrores();
});

// Función global para ser llamada desde Servicios.js
function abrirFormularioPostulacion() {
    abrirFormularioExterno();
}

// Función global para debugging
window.debugPostulacion = function() {
    console.log('🔧 Debug Postulación activado');
    console.log('Elementos animados:', document.querySelectorAll('.visible').length);
    console.log('Scroll actual:', window.pageYOffset);
    console.log('Es móvil:', document.body.classList.contains('es-movil'));
    console.log('Modal visible:', document.getElementById('modalConfirmacion').style.display === 'block');
};

// Exportar funciones para uso en otros archivos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        abrirFormularioExterno,
        cerrarModal,
        confirmarRedireccion,
        abrirFormularioPostulacion
    };
}