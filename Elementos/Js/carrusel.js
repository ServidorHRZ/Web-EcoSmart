// ===== CARRUSEL PRINCIPAL - ECO SMART =====
class CarruselEcoSmart {
    constructor() {
        this.slideActual = 0;
        this.slides = [];
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        this.datosCarrusel = null;
        
        this.inicializar();
    }

    // Inicializar el carrusel
    async inicializar() {
        try {
            await this.cargarDatos();
            this.generarHTML();
            this.configurarEventos();
            this.iniciarAutoPlay();
        } catch (error) {
            console.error('Error al inicializar el carrusel:', error);
        }
    }

    // Cargar datos desde JSON
    async cargarDatos() {
        try {
            const response = await fetch('../Elementos/Js/carrusel-datos.json');
            const datos = await response.json();
            this.datosCarrusel = datos.carrusel;
            this.totalSlides = this.datosCarrusel.slides.length;
            return datos;
        } catch (error) {
            console.error('Error al cargar datos del carrusel:', error);
            throw error;
        }
    }

    // Generar HTML dinámicamente
    generarHTML() {
        const contenedor = document.querySelector('.carrusel-slides');
        const indicadoresContenedor = document.querySelector('.carrusel-indicadores');
        
        if (!contenedor || !indicadoresContenedor) {
            console.error('Contenedores del carrusel no encontrados');
            return;
        }

        // Limpiar contenedores
        contenedor.innerHTML = '';
        indicadoresContenedor.innerHTML = '';

        // Generar slides
        this.datosCarrusel.slides.forEach((slide, index) => {
            const slideElement = this.crearSlide(slide, index);
            contenedor.appendChild(slideElement);

            // Crear indicador
            const indicador = this.crearIndicador(index);
            indicadoresContenedor.appendChild(indicador);
        });

        // Actualizar referencias DOM
        this.slides = document.querySelectorAll('.slide');
        this.indicadores = document.querySelectorAll('.indicador');
        
        // Mostrar primer slide
        this.mostrarSlide(0);
    }

    // Crear elemento slide
    crearSlide(slide, index) {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'activo' : ''}`;

        if (slide.tipo === 'video') {
            slideDiv.innerHTML = `
                <video class="slide-video" autoplay muted loop>
                    <source src="${slide.src}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            `;
        } else if (slide.tipo === 'imagen') {
            slideDiv.innerHTML = `
                <img src="${slide.src}" alt="${slide.alt}" class="slide-imagen">
            `;
        }

        return slideDiv;
    }

    // Crear indicador
    crearIndicador(index) {
        const indicador = document.createElement('button');
        indicador.className = `indicador ${index === 0 ? 'activo' : ''}`;
        indicador.dataset.slide = index;
        return indicador;
    }

    // Mostrar slide específico
    mostrarSlide(indice) {
        // Validar índice
        if (indice >= this.totalSlides) indice = 0;
        if (indice < 0) indice = this.totalSlides - 1;

        // Remover clase activo
        this.slides.forEach(slide => slide.classList.remove('activo'));
        this.indicadores.forEach(indicador => indicador.classList.remove('activo'));

        // Actualizar slide actual
        this.slideActual = indice;

        // Activar elementos correspondientes
        if (this.slides[this.slideActual]) {
            this.slides[this.slideActual].classList.add('activo');
        }
        if (this.indicadores[this.slideActual]) {
            this.indicadores[this.slideActual].classList.add('activo');
        }
    }

    // Ir al siguiente slide
    siguienteSlide() {
        this.mostrarSlide(this.slideActual + 1);
    }

    // Ir al slide anterior
    anteriorSlide() {
        this.mostrarSlide(this.slideActual - 1);
    }

    // Configurar todos los eventos
    configurarEventos() {
        // Botones de navegación
        const btnPrev = document.getElementById('carruselPrev');
        const btnNext = document.getElementById('carruselNext');

        if (btnNext) {
            btnNext.addEventListener('click', () => this.siguienteSlide());
        }
        
        if (btnPrev) {
            btnPrev.addEventListener('click', () => this.anteriorSlide());
        }

        // Indicadores
        this.indicadores.forEach((indicador, indice) => {
            indicador.addEventListener('click', () => {
                this.mostrarSlide(indice);
            });
        });

        // Control del auto-play con mouse
        const carruselContenedor = document.querySelector('.carrusel-contenedor');
        if (carruselContenedor) {
            carruselContenedor.addEventListener('mouseenter', () => {
                this.pausarAutoPlay();
            });

            carruselContenedor.addEventListener('mouseleave', () => {
                this.iniciarAutoPlay();
            });
        }

        // Control con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.anteriorSlide();
            } else if (e.key === 'ArrowRight') {
                this.siguienteSlide();
            }
        });

        // Soporte táctil para móviles
        this.configurarEventosTactiles();
    }

    // Configurar eventos táctiles
    configurarEventosTactiles() {
        let startX = 0;
        let endX = 0;

        const carruselContenedor = document.querySelector('.carrusel-contenedor');
        if (!carruselContenedor) return;

        carruselContenedor.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carruselContenedor.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.manejarSwipe(startX, endX);
        });
    }

    // Manejar gestos de deslizamiento
    manejarSwipe(startX, endX) {
        const diffX = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                this.siguienteSlide(); // Swipe izquierda - siguiente
            } else {
                this.anteriorSlide(); // Swipe derecha - anterior
            }
        }
    }

    // Iniciar auto-play
    iniciarAutoPlay() {
        if (this.datosCarrusel && this.datosCarrusel.autoPlay) {
            this.pausarAutoPlay(); // Limpiar intervalo anterior
            this.autoPlayInterval = setInterval(() => {
                this.siguienteSlide();
            }, this.datosCarrusel.intervalo);
        }
    }

    // Pausar auto-play
    pausarAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Destruir carrusel (limpiar eventos y intervalos)
    destruir() {
        this.pausarAutoPlay();
        // Aquí se podrían remover más event listeners si fuera necesario
    }
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que exista el contenedor del carrusel
    const carruselContenedor = document.querySelector('.carrusel-principal');
    if (carruselContenedor) {
        new CarruselEcoSmart();
    }
});

// Exportar la clase para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarruselEcoSmart;
} 