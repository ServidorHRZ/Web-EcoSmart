// ===== FUNCIONALIDADES ADICIONALES PARA HOME =====

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
    const tarjetas = document.querySelectorAll('.servicio-card, .estadistica-item, .practica-item, .certificacion-item');
    
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
        const scrollActual = window.scrollY || window.pageYOffset;
        const porcentaje = (scrollActual / scrollTotal) * 100;
        barraProgreso.style.width = porcentaje + '%';
    });
}

// Función para lazy loading de imágenes (EXCLUYE las del carrusel)
function lazyLoadImagenes() {
    // Excluir imágenes del carrusel para evitar conflictos
    const imagenes = document.querySelectorAll('img[src]:not(.slide-imagen):not(.slide-video)');
    
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
                .servicio-card:hover,
                .estadistica-item:hover,
                .practica-item:hover,
                .certificacion-item:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }
            }
        `;
        document.head.appendChild(estilosMovil);
    }
}

// Inicializar todas las funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que el carrusel se inicialice primero
    setTimeout(() => {
        // Inicializar funcionalidades
        suavizarScroll();
        efectosHoverAvanzados();
        mostrarProgresoScroll();
        lazyLoadImagenes();
        optimizarMovil();
        
        console.log('✅ Funcionalidades adicionales de Home cargadas');
    }, 100); // Delay de 100ms para evitar conflictos con el carrusel
});

// Función global para debugging
window.debugHome = function() {
    console.log('🔧 Debug Home activado');
    console.log('Elementos animados:', document.querySelectorAll('.visible').length);
    console.log('Scroll actual:', window.scrollY || window.pageYOffset);
    console.log('Es móvil:', document.body.classList.contains('es-movil'));
};
