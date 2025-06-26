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
            e.preventDefault();
            
            // Obtener el destino del enlace
            const destino = this.getAttribute('href');
            
            // Cerrar el menú
            cerrarMenu();
            
            // Simular navegación (puedes personalizar esto según tus necesidades)
            setTimeout(function() {
                console.log('Navegando a: ' + destino);
                // Aquí puedes agregar la lógica de navegación real
                // Por ejemplo: window.location.href = destino;
            }, 300);
        });
    });

    // Event listeners para el menú desktop
    menuLinksDesktop.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el destino del enlace
            const destino = this.getAttribute('href');
            
            // Simular navegación (puedes personalizar esto según tus necesidades)
            console.log('Navegando a: ' + destino);
            // Aquí puedes agregar la lógica de navegación real
            // Por ejemplo: window.location.href = destino;
        });
    });

    // Event listener para el botón Postúlate móvil
    if (btnPostulate) {
        btnPostulate.addEventListener('click', function() {
            cerrarMenu();
            
            // Simular acción del botón Postúlate
            setTimeout(function() {
                alert('¡Gracias por tu interés! Te redirigiremos al formulario de postulación.');
                // Aquí puedes agregar la lógica para el formulario de postulación
                // Por ejemplo: window.location.href = 'postulacion.html';
            }, 300);
        });
    }

    // Event listener para el botón Postúlate desktop
    if (btnPostulateDesktop) {
        btnPostulateDesktop.addEventListener('click', function() {
            // Simular acción del botón Postúlate
            alert('¡Gracias por tu interés! Te redirigiremos al formulario de postulación.');
            // Aquí puedes agregar la lógica para el formulario de postulación
            // Por ejemplo: window.location.href = 'postulacion.html';
        });
    }

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

    // Función para mostrar slide específico
    function mostrarSlide(indice) {
        // Remover clase activo de todos los slides e indicadores
        slides.forEach(slide => slide.classList.remove('activo'));
        indicadores.forEach(indicador => indicador.classList.remove('activo'));

        // Validar índice
        if (indice >= totalSlides) indice = 0;
        if (indice < 0) indice = totalSlides - 1;

        // Actualizar slide actual
        slideActual = indice;

        // Activar slide e indicador correspondiente
        slides[slideActual].classList.add('activo');
        indicadores[slideActual].classList.add('activo');
    }

    // Función para ir al siguiente slide
    function siguienteSlide() {
        mostrarSlide(slideActual + 1);
    }

    // Función para ir al slide anterior
    function anteriorSlide() {
        mostrarSlide(slideActual - 1);
    }

    // Event listeners para botones de navegación
    if (btnNext) {
        btnNext.addEventListener('click', siguienteSlide);
    }
    
    if (btnPrev) {
        btnPrev.addEventListener('click', anteriorSlide);
    }

    // Event listeners para indicadores
    indicadores.forEach((indicador, indice) => {
        indicador.addEventListener('click', () => {
            mostrarSlide(indice);
        });
    });

    // Auto-play del carrusel (opcional)
    let intervalCarrusel = setInterval(siguienteSlide, 5000); // Cambia cada 5 segundos

    // Pausar auto-play al pasar el mouse por encima
    const carruselContenedor = document.querySelector('.carrusel-contenedor');
    if (carruselContenedor) {
        carruselContenedor.addEventListener('mouseenter', () => {
            clearInterval(intervalCarrusel);
        });

        carruselContenedor.addEventListener('mouseleave', () => {
            intervalCarrusel = setInterval(siguienteSlide, 5000);
        });
    }

    // Control con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            anteriorSlide();
        } else if (e.key === 'ArrowRight') {
            siguienteSlide();
        }
    });

    // Touch/swipe support para móviles
    let startX = 0;
    let endX = 0;

    if (carruselContenedor) {
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
                    siguienteSlide(); // Swipe izquierda - siguiente
                } else {
                    anteriorSlide(); // Swipe derecha - anterior
                }
            }
        }
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