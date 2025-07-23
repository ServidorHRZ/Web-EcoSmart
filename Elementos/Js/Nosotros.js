// ===== NOSOTROS.JS - FUNCIONALIDADES INTERACTIVAS =====

// Variables globales
let contadoresAnimados = false;
let observerAnimaciones;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nosotros.js cargado correctamente');
    
    // Inicializar todas las funcionalidades
    inicializarAnimacionesScroll();
    inicializarContadores();
    inicializarEfectosHover();
    inicializarVideoLazyLoad();
    inicializarParallax();
    inicializarTimeline();
    
    // Agregar clase de carga completa
    setTimeout(() => {
        document.body.classList.add('cargado');
    }, 100);
});

// ===== ANIMACIONES DE SCROLL =====
function inicializarAnimacionesScroll() {
    // Configuración del Intersection Observer
    const opciones = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
    };
    
    observerAnimaciones = new IntersectionObserver(manejarAnimaciones, opciones);
    
    // Observar todos los elementos animables
    const elementosAnimables = document.querySelectorAll(`
        .animar-entrada,
        .animar-entrada-izquierda,
        .animar-entrada-derecha,
        .contador-animado,
        .card-animacion,
        .titulo-animado,
        .efecto-onda
    `);
    
    elementosAnimables.forEach(elemento => {
        observerAnimaciones.observe(elemento);
    });
}

function manejarAnimaciones(entradas) {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            const elemento = entrada.target;
            
            // Agregar clase visible con delay si existe
            setTimeout(() => {
                elemento.classList.add('visible');
                
                // Activar contadores si es necesario
                if (elemento.classList.contains('contador-animado') && !contadoresAnimados) {
                    activarContadores();
                    contadoresAnimados = true;
                }
                
                // Activar timeline si es necesario
                if (elemento.classList.contains('timeline-item')) {
                    activarTimelineItem(elemento);
                }
            }, obtenerDelay(elemento));
            
            // Dejar de observar el elemento una vez animado
            observerAnimaciones.unobserve(elemento);
        }
    });
}

function obtenerDelay(elemento) {
    const clases = elemento.classList;
    if (clases.contains('delay-1')) return 100;
    if (clases.contains('delay-2')) return 200;
    if (clases.contains('delay-3')) return 300;
    if (clases.contains('delay-4')) return 400;
    if (clases.contains('delay-5')) return 500;
    if (clases.contains('delay-6')) return 600;
    return 0;
}

// ===== CONTADORES ANIMADOS =====
function inicializarContadores() {
    // Los contadores se activarán cuando sean visibles
    console.log('Contadores inicializados');
}

function activarContadores() {
    const contadores = document.querySelectorAll('.numero-estadistica');
    
    contadores.forEach(contador => {
        const valorFinal = parseInt(contador.textContent.replace(/[^0-9]/g, ''));
        const sufijo = contador.textContent.replace(/[0-9]/g, '');
        
        animarContador(contador, 0, valorFinal, 2000, sufijo);
    });
}

function animarContador(elemento, inicio, fin, duracion, sufijo = '') {
    const incremento = fin / (duracion / 16);
    let valorActual = inicio;
    
    const timer = setInterval(() => {
        valorActual += incremento;
        
        if (valorActual >= fin) {
            elemento.textContent = fin + sufijo;
            clearInterval(timer);
        } else {
            elemento.textContent = Math.floor(valorActual) + sufijo;
        }
    }, 16);
}

// ===== EFECTOS HOVER AVANZADOS =====
function inicializarEfectosHover() {
    // Efecto de seguimiento del mouse en las cards
    const cards = document.querySelectorAll('.card-mision, .card-vision, .valor-item, .miembro-equipo');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Efecto de brillo en botones
    const botones = document.querySelectorAll('.btn-cta-principal, .btn-cta-secundario');
    
    botones.forEach(boton => {
        boton.addEventListener('mouseenter', () => {
            crearEfectoBrillo(boton);
        });
    });
}

function crearEfectoBrillo(elemento) {
    const brillo = document.createElement('div');
    brillo.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.6s ease;
        pointer-events: none;
        z-index: 1;
    `;
    
    elemento.style.position = 'relative';
    elemento.style.overflow = 'hidden';
    elemento.appendChild(brillo);
    
    setTimeout(() => {
        brillo.style.left = '100%';
    }, 10);
    
    setTimeout(() => {
        if (brillo.parentNode) {
            brillo.parentNode.removeChild(brillo);
        }
    }, 600);
}

// ===== VIDEO LAZY LOAD =====
function inicializarVideoLazyLoad() {
    const videos = document.querySelectorAll('iframe[data-src]');
    
    const observerVideo = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const iframe = entrada.target;
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
                observerVideo.unobserve(iframe);
            }
        });
    });
    
    videos.forEach(video => {
        observerVideo.observe(video);
    });
}

// ===== EFECTO PARALLAX =====
function inicializarParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-video, .seccion-historia::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== TIMELINE INTERACTIVA =====
function inicializarTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });
}

function activarTimelineItem(elemento) {
    elemento.classList.add('timeline-activo');
    
    // Agregar efecto de pulso al icono de la timeline
    const icono = elemento.querySelector('.timeline-icon');
    if (icono) {
        // Crear animación de pulso personalizada
        icono.style.animation = 'pulsoTimeline 1.2s ease-out';
        
        // Agregar clase temporal para efectos adicionales
        icono.classList.add('timeline-icon-activo');
        
        // Remover la clase después de la animación
        setTimeout(() => {
            icono.classList.remove('timeline-icon-activo');
            icono.style.animation = '';
        }, 1200);
    }
}

// ===== NAVEGACIÓN SUAVE =====
function inicializarNavegacionSuave() {
    const enlaces = document.querySelectorAll('a[href^="#"]');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            
            const destino = document.querySelector(enlace.getAttribute('href'));
            if (destino) {
                destino.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== EFECTOS DE PARTÍCULAS =====
function crearParticulas() {
    const contenedor = document.querySelector('.hero-nosotros');
    if (!contenedor) return;
    
    for (let i = 0; i < 50; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula';
        particula.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #FFD700;
            border-radius: 50%;
            opacity: 0.7;
            animation: flotar ${Math.random() * 3 + 2}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 1;
        `;
        
        contenedor.appendChild(particula);
    }
}

// ===== GESTOS TÁCTILES =====
function inicializarGestosTactiles() {
    let startX, startY, endX, endY;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        manejarGesto();
    });
    
    function manejarGesto() {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Detectar swipe horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe derecha
                console.log('Swipe derecha detectado');
            } else {
                // Swipe izquierda
                console.log('Swipe izquierda detectado');
            }
        }
    }
}

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
function optimizarRendimiento() {
    // Throttle para eventos de scroll
    let ticking = false;
    
    function actualizarScroll() {
        // Actualizar elementos que dependen del scroll
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(actualizarScroll);
            ticking = true;
        }
    });
    
    // Preload de imágenes críticas
    const imagenesImportantes = [
        '/Elementos/imagenes/empresa-historia.jpg',
        '/Elementos/imagenes/equipo-1.jpg',
        '/Elementos/imagenes/equipo-2.jpg'
    ];
    
    imagenesImportantes.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===== MANEJO DE ERRORES =====
function manejarErrores() {
    window.addEventListener('error', (e) => {
        console.error('Error en Nosotros.js:', e.error);
    });
    
    // Fallback para navegadores que no soportan Intersection Observer
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver no soportado, usando fallback');
        
        // Activar todas las animaciones inmediatamente
        const elementosAnimables = document.querySelectorAll('.animar-entrada, .animar-entrada-izquierda, .animar-entrada-derecha');
        elementosAnimables.forEach(elemento => {
            elemento.classList.add('visible');
        });
        
        // Activar contadores
        setTimeout(activarContadores, 1000);
    }
}

// ===== FUNCIONES UTILITARIAS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ANIMACIONES CSS DINÁMICAS =====
function agregarAnimacionesCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flotar {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.7;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 1;
            }
        }
        
        @keyframes pulso {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
            }
            70% {
                transform: scale(1.1);
                box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
            }
        }
        
        @keyframes pulsoTimeline {
            0% {
                transform: translateY(-50%) scale(1);
                box-shadow: 
                    0 0 0 4px #000000,
                    0 8px 20px rgba(255, 215, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.2);
            }
            30% {
                transform: translateY(-50%) scale(1.15);
                box-shadow: 
                    0 0 0 4px #000000,
                    0 0 0 8px rgba(255, 215, 0, 0.4),
                    0 12px 30px rgba(255, 215, 0, 0.5),
                    inset 0 2px 4px rgba(255, 255, 255, 0.3);
            }
            60% {
                transform: translateY(-50%) scale(1.05) rotate(5deg);
                box-shadow: 
                    0 0 0 4px #000000,
                    0 0 0 12px rgba(255, 215, 0, 0.2),
                    0 15px 35px rgba(255, 215, 0, 0.4),
                    inset 0 2px 4px rgba(255, 255, 255, 0.2);
            }
            100% {
                transform: translateY(-50%) scale(1);
                box-shadow: 
                    0 0 0 4px #000000,
                    0 8px 20px rgba(255, 215, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.2);
            }
        }
        
        .timeline-icon-activo {
            background: linear-gradient(135deg, #FFED4E 0%, #FFD700 50%, #FFA500 100%) !important;
        }
        
        .timeline-activo::before {
            animation: pulso 1s ease-out;
        }
        
        .cargado .hero-contenido {
            animation: aparecerHero 1.5s ease-out;
        }
        
        @keyframes aparecerHero {
            0% {
                opacity: 0;
                transform: translateY(50px) scale(0.9);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Animación de entrada para iconos de timeline */
        .timeline-icon {
            animation: entradaIconoTimeline 0.8s ease-out;
        }
        
        @keyframes entradaIconoTimeline {
            0% {
                opacity: 0;
                transform: translateY(-50%) scale(0) rotate(-180deg);
            }
            60% {
                opacity: 1;
                transform: translateY(-50%) scale(1.1) rotate(10deg);
            }
            100% {
                opacity: 1;
                transform: translateY(-50%) scale(1) rotate(0deg);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== INICIALIZACIÓN FINAL =====
// Ejecutar funciones adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    manejarErrores();
    optimizarRendimiento();
    agregarAnimacionesCSS();
    inicializarGestosTactiles();
    inicializarNavegacionSuave();
    
    // Crear partículas después de un delay
    setTimeout(crearParticulas, 2000);
});

// ===== EXPORTAR FUNCIONES PARA USO EXTERNO =====
window.NosotrosJS = {
    activarContadores,
    crearEfectoBrillo,
    inicializarAnimacionesScroll
};

// ===== LOG DE INICIALIZACIÓN =====
console.log('🚀 Nosotros.js - Todas las funcionalidades cargadas correctamente');
console.log('📊 Funciones disponibles:', Object.keys(window.NosotrosJS));