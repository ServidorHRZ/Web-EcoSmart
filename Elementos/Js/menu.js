// Funcionalidad del menú lateral desplegable y menú desktop

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuLateral = document.getElementById('menuLateral');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.menu-lista a');
    const menuLinksDesktop = document.querySelectorAll('.menu-horizontal a');
    const btnPostulate = document.querySelector('.btn-postulate');
    const btnPostulateDesktop = document.querySelector('.btn-postulate-desktop');

    // Función para abrir el menú
    function abrirMenu() {
        menuToggle.classList.add('activo');
        menuLateral.classList.add('abierto');
        menuOverlay.classList.add('activo');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    // Función para cerrar el menú
    function cerrarMenu() {
        menuToggle.classList.remove('activo');
        menuLateral.classList.remove('abierto');
        menuOverlay.classList.remove('activo');
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
    }

    // Función para limpiar selección activa temporal (solo para navegación interna)
    function limpiarSeleccionActiva() {
        // Solo remover clases activas si estamos en Home.html (navegación interna)
        if (window.location.pathname.includes('Home.html')) {
            menuLinks.forEach(link => link.classList.remove('activo'));
            menuLinksDesktop.forEach(link => link.classList.remove('activo'));
        }
    }

    // Event listener para el botón hamburguesa
    menuToggle.addEventListener('click', function() {
        if (menuLateral.classList.contains('abierto')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    // Event listener para el overlay (cerrar al hacer clic fuera)
    menuOverlay.addEventListener('click', cerrarMenu);

    // Event listeners para los enlaces del menú
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const destino = this.getAttribute('href');
            
            // Si el enlace apunta a un archivo externo, permitir navegación normal
            if (destino && !destino.startsWith('#')) {
                // No prevenir el comportamiento por defecto para enlaces externos
                cerrarMenu();
                return; // Salir de la función para permitir navegación normal
            }
            
            // Para enlaces internos (que empiezan con #), prevenir comportamiento por defecto
            e.preventDefault();
            
            // Limpiar selección activa
            limpiarSeleccionActiva();
            
            // Cerrar el menú
            cerrarMenu();
            
            // Navegar a la sección
            if (destino && destino.startsWith('#')) {
                const seccion = document.querySelector(destino);
                if (seccion) {
                    seccion.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Event listeners para el menú desktop
    menuLinksDesktop.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const destino = this.getAttribute('href');
            
            // Si el enlace apunta a un archivo externo, permitir navegación normal
            if (destino && !destino.startsWith('#')) {
                // No prevenir el comportamiento por defecto para enlaces externos
                return; // Salir de la función para permitir navegación normal
            }
            
            // Para enlaces internos (que empiezan con #), prevenir comportamiento por defecto
            e.preventDefault();
            
            // Limpiar selección activa
            limpiarSeleccionActiva();
            
            // Navegar a la sección
            if (destino && destino.startsWith('#')) {
                const seccion = document.querySelector(destino);
                if (seccion) {
                    seccion.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Event listener para el botón Postúlate móvil
    if (btnPostulate) {
        btnPostulate.addEventListener('click', function() {
            cerrarMenu();
        });
    }

    // Event listener para el botón Postúlate desktop
    // Nota: La funcionalidad del modal se maneja en Home.html con onclick

    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuLateral.classList.contains('abierto')) {
            cerrarMenu();
        }
    });

    // Prevenir scroll horizontal cuando el menú está abierto
    document.addEventListener('touchmove', function(e) {
        if (menuLateral.classList.contains('abierto')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Animación suave para los elementos del menú al cargar
    setTimeout(function() {
        const elementosMenu = document.querySelectorAll('.menu-lista li');
        elementosMenu.forEach(function(elemento, index) {
            elemento.style.transform = 'translateX(-50px)';
            elemento.style.opacity = '0';
            elemento.style.transition = 'all 0.3s ease';
            
            // Resetear estilos después de un breve delay
            setTimeout(function() {
                elemento.style.transform = 'translateX(0)';
                elemento.style.opacity = '1';
            }, 100 + (index * 50));
        });
    }, 100);

    // Limpiar selección activa al cargar la página
    limpiarSeleccionActiva();
});

// ===== FUNCIONALIDAD DEL CARRUSEL =====
document.addEventListener('DOMContentLoaded', function() {
    // Variables del carrusel
    let slideActual = 0;
    const slides = document.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.indicador');
    const btnPrev = document.getElementById('carruselPrev');
    const btnNext = document.getElementById('carruselNext');
    const totalSlides = slides.length;

    // Solo inicializar el carrusel si hay slides
    if (totalSlides > 0) {
        // Función para mostrar slide específico
        function mostrarSlide(indice) {
            // Remover clase activo de todos los slides
            slides.forEach(slide => slide.classList.remove('activo'));
            
            // Remover clase activo de indicadores si existen
            if (indicadores.length > 0) {
                indicadores.forEach(indicador => indicador.classList.remove('activo'));
            }

            // Validar índice
            if (indice >= totalSlides) indice = 0;
            if (indice < 0) indice = totalSlides - 1;

            // Actualizar slide actual
            slideActual = indice;

            // Activar slide actual
            slides[slideActual].classList.add('activo');
            
            // Activar indicador si existe
            if (indicadores.length > 0) {
                indicadores[slideActual].classList.add('activo');
            }
        }

        // Función para ir al siguiente slide
        function siguienteSlide() {
            mostrarSlide(slideActual + 1);
        }

        // Función para ir al slide anterior
        function anteriorSlide() {
            mostrarSlide(slideActual - 1);
        }

        // Event listeners para botones de navegación si existen
        if (btnNext) {
            btnNext.addEventListener('click', siguienteSlide);
        }
        
        if (btnPrev) {
            btnPrev.addEventListener('click', anteriorSlide);
        }

        // Event listeners para indicadores si existen
        if (indicadores.length > 0) {
            indicadores.forEach((indicador, indice) => {
                indicador.addEventListener('click', () => {
                    mostrarSlide(indice);
                });
            });
        }

        // Auto-play del carrusel
        let intervalCarrusel = setInterval(siguienteSlide, 5000);

        // Pausar auto-play al pasar el mouse por encima
        const carruselContenedor = document.querySelector('.carrusel-contenedor');
        if (carruselContenedor) {
            carruselContenedor.addEventListener('mouseenter', () => {
                clearInterval(intervalCarrusel);
            });

            carruselContenedor.addEventListener('mouseleave', () => {
                intervalCarrusel = setInterval(siguienteSlide, 5000);
            });

            // Touch/swipe support para móviles
            let startX = 0;
            let endX = 0;

            carruselContenedor.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            carruselContenedor.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
            });

            function handleSwipe() {
                const diffX = startX - endX;
                const minSwipeDistance = 50;

                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0) {
                        siguienteSlide();
                    } else {
                        anteriorSlide();
                    }
                }
            }
        }

        // Control con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                anteriorSlide();
            } else if (e.key === 'ArrowRight') {
                siguienteSlide();
            }
        });
    }
});

// Función adicional para manejo de rutas (opcional)
function navegarA(seccion) {
    switch(seccion) {
        case '#inicio':
            console.log('Navegando a Inicio');
            break;
        case '#servicios':
            console.log('Navegando a Servicios');
            break;
        case '#proyectos':
            console.log('Navegando a Proyectos');
            break;
        case '#nosotros':
            console.log('Navegando a Nosotros');
            break;
        case '#contacto':
            console.log('Navegando a Contacto');
            break;
        default:
            console.log('Sección no encontrada');
    }
} 