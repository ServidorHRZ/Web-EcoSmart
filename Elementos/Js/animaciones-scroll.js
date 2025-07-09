// ===== ANIMACIONES DE SCROLL PROFESIONALES =====

// Configuración del observador de intersección
const configuracionObservador = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Activar cuando el elemento esté 50px antes de ser visible
    threshold: [0, 0.1, 0.2, 0.3]
};

// Crear el observador
const observadorAnimaciones = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting && entrada.target) {
            // Añadir clase visible con delay progresivo si existe
            const elemento = entrada.target;
            
            // Verificar que el elemento tenga classList
            if (elemento && elemento.classList) {
                try {
                    // Activar animación principal
                    elemento.classList.add('visible');
                    
                    // Efectos especiales para contadores
                    if (elemento.classList.contains('numero-estadistica')) {
                        animarContador(elemento);
                    }
                    
                    // Efecto de onda para cards
                    if (elemento.classList.contains('efecto-onda')) {
                        activarEfectoOnda(elemento);
                    }
                    
                    // Dejar de observar el elemento una vez animado
                    observadorAnimaciones.unobserve(elemento);
                } catch (error) {
                    console.warn('Error al animar elemento:', error);
                }
            }
        }
    });
}, configuracionObservador);

// Función para animar contadores numéricos
function animarContador(elemento) {
    const textoFinal = elemento.textContent;
    const soloNumeros = textoFinal.match(/\d+/);
    
    if (soloNumeros) {
        const numeroFinal = parseInt(soloNumeros[0]);
        const sufijo = textoFinal.replace(soloNumeros[0], '');
        let contador = 0;
        const incremento = numeroFinal / 60; // 60 frames para 1 segundo
        
        elemento.classList.add('numero-contar');
        
        const intervaloCotador = setInterval(() => {
            contador += incremento;
            if (contador >= numeroFinal) {
                contador = numeroFinal;
                clearInterval(intervaloCotador);
            }
            elemento.textContent = Math.floor(contador) + sufijo;
        }, 16); // ~60fps
    }
}

// Función para activar efecto de onda
function activarEfectoOnda(elemento) {
    setTimeout(() => {
        elemento.classList.add('visible');
    }, 200);
}

// Función para configurar animaciones en elementos específicos
function configurarAnimaciones() {
    // Solo añadir clases a elementos que no las tengan ya
    
    // Elementos de introducción empresarial (solo los que no tengan clase)
    const introduccionElementos = document.querySelectorAll('.introduccion-empresa h3:not([class*="animar"]), .introduccion-empresa p:not([class*="animar"])');
    introduccionElementos.forEach((elemento, index) => {
        if (elemento && elemento.classList) {
            elemento.classList.add('animar-entrada', `delay-${Math.min(index + 1, 3)}`);
        }
    });
}

// Función para observar todos los elementos animados
function iniciarObservacion() {
    const elementosAnimados = document.querySelectorAll(`
        .animar-entrada,
        .animar-entrada-izquierda,
        .animar-entrada-derecha,
        .animar-escala,
        .animar-rotacion,
        .animar-desvanecimiento,
        .contador-animado,
        .card-animacion,
        .titulo-animado
    `);
    
    elementosAnimados.forEach(elemento => {
        if (elemento && observadorAnimaciones) {
            try {
                observadorAnimaciones.observe(elemento);
            } catch (error) {
                console.warn('Error al observar elemento:', error);
            }
        }
    });
}

// Función para animaciones especiales del carrusel
function animarCarrusel() {
    const carrusel = document.querySelector('.carrusel-principal');
    if (carrusel) {
        // Animación sutil de entrada para el video
        const video = carrusel.querySelector('.slide-video');
        if (video) {
            video.style.opacity = '0';
            video.style.transform = 'scale(1.1)';
            video.style.transition = 'all 1.5s ease-out';
            
            setTimeout(() => {
                video.style.opacity = '1';
                video.style.transform = 'scale(1)';
            }, 500);
        }
    }
}

// Función para optimizar rendimiento en dispositivos móviles
function optimizarParaMovil() {
    const esMovil = window.innerWidth <= 768;
    
    if (esMovil) {
        // Reducir complejidad de animaciones en móviles
        const elementosComplejos = document.querySelectorAll('.efecto-onda');
        elementosComplejos.forEach(elemento => {
            elemento.classList.remove('efecto-onda');
        });
        
        // Acelerar animaciones en móviles
        document.documentElement.style.setProperty('--duracion-animacion', '0.4s');
    }
}

// Función para añadir efectos de parallax suave
function efectoParallax() {
    const elementos = document.querySelectorAll('.seccion-nosotros, .seccion-servicios');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        elementos.forEach(elemento => {
            const rect = elemento.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const rate = scrollTop * -0.1;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                elemento.style.transform = `translateY(${rate}px)`;
            }
        });
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar todas las animaciones
    configurarAnimaciones();
    
    // Iniciar observación de elementos
    iniciarObservacion();
    
    // Animar carrusel
    animarCarrusel();
    
    // Optimizar para móviles
    optimizarParaMovil();
    
    // Añadir efecto parallax sutil (opcional)
    if (window.innerWidth > 768) {
        efectoParallax();
    }
    
    console.log('🎨 Animaciones de scroll iniciadas correctamente');
});

// Reinicializar en cambio de tamaño de ventana
window.addEventListener('resize', () => {
    optimizarParaMovil();
});

// Función para activar manualmente una animación (útil para debugging)
window.activarAnimacion = function(selector) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.classList.add('visible');
        console.log(`Animación activada para: ${selector}`);
    }
};

// Función para resetear todas las animaciones (útil para desarrollo)
window.resetearAnimaciones = function() {
    const elementos = document.querySelectorAll('.visible');
    elementos.forEach(elemento => {
        elemento.classList.remove('visible');
    });
    
    setTimeout(() => {
        iniciarObservacion();
    }, 100);
    
    console.log('🔄 Animaciones reseteadas');
}; 