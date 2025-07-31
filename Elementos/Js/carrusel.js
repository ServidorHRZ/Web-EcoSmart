// ===== CARRUSEL SIMPLE Y ESTABLE =====
class CarruselSimple {
    constructor() {
        this.slideActual = 0;
        this.slides = [];
        this.indicadores = [];
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        this.isPlaying = true;
        this.slideDuration = 9000; // 9 segundos EXACTOS para todos los slides
        this.isChanging = false; // Prevenir cambios múltiples
        this.initialized = false; // Flag de inicialización

        console.log('🎬 Creando carrusel simple...');
        this.inicializar();
    }

    // Detectar si es dispositivo móvil
    detectarMovil() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth <= 768;
    }

    // Inicializar el carrusel
    inicializar() {
        this.slides = document.querySelectorAll('.slide');
        this.indicadores = document.querySelectorAll('.indicador');
        this.totalSlides = this.slides.length;

        if (this.totalSlides === 0) {
            console.error('No se encontraron slides en el carrusel');
            return;
        }

        this.configurarEventos();
        this.iniciarAutoPlay();
        this.configurarVideo();
    }

    // Configurar el video para que no haga loop automático
    configurarVideo() {
        const videoSlide = document.querySelector('.slide[data-tipo="video"]');
        if (videoSlide) {
            const video = videoSlide.querySelector('.slide-video');
            if (video) {
                video.removeAttribute('loop');
                video.muted = true; // Asegurar que esté silenciado
                video.preload = 'auto'; // Precargar el video
                video.playsInline = true; // Importante para iOS
                video.setAttribute('playsinline', ''); // Atributo adicional para iOS

                // REMOVEMOS el evento 'ended' para que no interfiera con el timing uniforme
                // El video se controlará solo por el timeout de 9 segundos

                // Evento cuando el video está listo para reproducir
                video.addEventListener('canplaythrough', () => {
                    console.log('Video listo para reproducir');
                });

                // Evento cuando el video puede empezar a reproducir
                video.addEventListener('canplay', () => {
                    console.log('Video puede empezar a reproducir');
                });

                // Evento de error
                video.addEventListener('error', (e) => {
                    console.error('Error en el video:', e);
                });

                // Evento cuando se carga la metadata del video
                video.addEventListener('loadedmetadata', () => {
                    console.log('Metadata del video cargada, duración:', video.duration);
                });
            }
        }
    }

    // Mostrar slide específico
    mostrarSlide(indice) {
        // Evitar cambios múltiples simultáneos
        if (this.isChanging) {
            console.log('🚫 Cambio bloqueado - ya hay uno en progreso');
            return;
        }

        this.isChanging = true;

        // Validar índice
        if (indice >= this.totalSlides) indice = 0;
        if (indice < 0) indice = this.totalSlides - 1;

        console.log(`🔄 Cambiando a slide ${indice + 1}/${this.totalSlides}`);

        // Remover clase activo
        this.slides.forEach(slide => slide.classList.remove('activo'));
        this.indicadores.forEach(indicador => indicador.classList.remove('activo'));

        // Actualizar slide actual
        this.slideActual = indice;

        // Activar elementos correspondientes
        if (this.slides[this.slideActual]) {
            this.slides[this.slideActual].classList.add('activo');

            // Animar el contenido del slide
            const contenido = this.slides[this.slideActual].querySelector('.slide-contenido');
            if (contenido) {
                contenido.style.animation = 'none';
                setTimeout(() => {
                    contenido.style.animation = 'slideInUp 1s ease-out';
                }, 10);
            }
        }

        if (this.indicadores[this.slideActual]) {
            this.indicadores[this.slideActual].classList.add('activo');
        }

        // Manejar video si es el slide actual
        this.manejarVideo();

        // Reiniciar auto-play con el tiempo correcto
        this.reiniciarAutoPlay();

        // Liberar el flag después de un breve delay
        setTimeout(() => {
            this.isChanging = false;
        }, 500);
    }

    // Manejar la reproducción de videos
    async manejarVideo() {
        // Pausar todos los videos primero
        const todosLosVideos = document.querySelectorAll('.slide-video');
        todosLosVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        // Reproducir el video del slide actual si es un video
        const slideActivo = this.slides[this.slideActual];
        if (slideActivo && slideActivo.dataset.tipo === 'video') {
            const video = slideActivo.querySelector('.slide-video');
            if (video) {
                try {
                    // Asegurar configuración para móviles
                    video.muted = true;
                    video.playsInline = true;
                    video.setAttribute('playsinline', '');

                    console.log('Intentando reproducir video...');

                    // Para móviles, intentar cargar el video primero
                    if (this.detectarMovil()) {
                        await new Promise((resolve) => {
                            if (video.readyState >= 3) { // HAVE_FUTURE_DATA
                                resolve();
                            } else {
                                video.addEventListener('canplay', resolve, { once: true });
                                video.load(); // Forzar carga en móviles
                            }
                        });
                    }

                    const playPromise = video.play();

                    if (playPromise !== undefined) {
                        await playPromise;
                        console.log('Video reproduciéndose correctamente');
                    }
                } catch (error) {
                    console.warn('Error al reproducir video:', error);

                    // Intentar reproducir de nuevo después de un breve delay
                    setTimeout(async () => {
                        try {
                            console.log('Reintentando reproducir video...');
                            await video.play();
                            console.log('Video reproduciéndose en segundo intento');
                        } catch (secondError) {
                            console.error('Error en segundo intento de reproducir video:', secondError);

                            // Si es móvil y falla, mostrar un mensaje o poster
                            if (this.detectarMovil()) {
                                console.log('Mostrando poster del video en móvil');
                                video.load(); // Cargar el poster
                            }
                        }
                    }, 500);
                }
            }
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

    // Configurar eventos MÍNIMOS (solo lo esencial)
    configurarEventos() {
        console.log('🎯 Configurando eventos mínimos del carrusel');

        // SOLO botones de navegación (sin otros eventos que interfieran)
        const btnPrev = document.getElementById('prevBtn');
        const btnNext = document.getElementById('nextBtn');

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                console.log('👆 Click en botón siguiente');
                this.siguienteSlide();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                console.log('👆 Click en botón anterior');
                this.anteriorSlide();
            });
        }

        // SOLO indicadores (sin otros eventos)
        this.indicadores.forEach((indicador, indice) => {
            indicador.addEventListener('click', () => {
                console.log(`👆 Click en indicador ${indice + 1}`);
                this.mostrarSlide(indice);
            });
        });

        // ELIMINAMOS TODOS LOS OTROS EVENTOS QUE CAUSAN PROBLEMAS:
        // - NO mouse hover (causa pausas/reanudaciones)
        // - NO teclado (causa cambios inesperados)
        // - NO táctil (causa swipes accidentales)
        // - NO visibilitychange (causa pausas/reanudaciones)
        // - NO interacción móvil (simplificamos)

        console.log('✅ Eventos mínimos configurados - Solo autoplay + botones + indicadores');
    }

    // FUNCIONES ELIMINADAS PARA EVITAR CONFLICTOS:
    // - configurarInteraccionMovil() 
    // - configurarEventosTactiles()
    // - manejarSwipe()
    // Estas funciones causaban cambios inesperados en el carrusel

    // Obtener duración del slide actual
    obtenerDuracionSlide() {
        // Ahora TODOS los slides (video e imágenes) duran exactamente 9 segundos
        return this.slideDuration;
    }

    // Reiniciar auto-play con la duración correcta
    reiniciarAutoPlay() {
        if (this.isPlaying) {
            this.pausarAutoPlay();
            this.iniciarAutoPlay();
        }
    }

    // Iniciar auto-play
    iniciarAutoPlay() {
        this.pausarAutoPlay(); // Limpiar intervalo anterior

        if (this.isPlaying) {
            const duracion = this.obtenerDuracionSlide();

            // Solo establecer timeout si hay duración (no es null)
            if (duracion !== null) {
                console.log(`🎬 Iniciando autoplay - Slide ${this.slideActual + 1}/${this.totalSlides} - Duración: ${duracion}ms`);
                this.autoPlayInterval = setTimeout(() => {
                    console.log(`⏰ Timeout completado - Cambiando de slide ${this.slideActual + 1} al siguiente`);
                    this.siguienteSlide();
                }, duracion);
            } else {
                console.log('Autoplay controlado por evento de video');
            }
        }
    }

    // Pausar auto-play
    pausarAutoPlay() {
        if (this.autoPlayInterval) {
            clearTimeout(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Toggle auto-play
    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.iniciarAutoPlay();
        } else {
            this.pausarAutoPlay();
        }
    }

    // Ir a un slide específico
    irASlide(indice) {
        this.mostrarSlide(indice);
    }

    // Destruir carrusel (limpiar eventos y intervalos)
    destruir() {
        this.pausarAutoPlay();

        // Pausar todos los videos
        this.slides.forEach(slide => {
            const video = slide.querySelector('.slide-video');
            if (video) {
                video.pause();
            }
        });
    }

    // Método para obtener información del estado actual
    obtenerEstado() {
        return {
            slideActual: this.slideActual,
            totalSlides: this.totalSlides,
            isPlaying: this.isPlaying,
            tipoSlideActual: this.slides[this.slideActual]?.dataset.tipo || 'desconocido'
        };
    }
}

// Función para inicializar el carrusel
function inicializarCarruselSimple() {
    const carruselContenedor = document.querySelector('.carrusel-principal');
    if (carruselContenedor) {
        return new CarruselSimple();
    } else {
        console.error('Contenedor del carrusel no encontrado');
        return null;
    }
}

// Variable global para acceder al carrusel
let carruselEpico = null;

// Función de inicialización completamente aislada
function inicializarCarruselSeguro() {
    console.log('🚀 Inicializando carrusel de forma segura...');

    // Verificar que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarCarruselSeguro);
        return;
    }

    // Verificar que el contenedor exista
    const contenedor = document.querySelector('.carrusel-principal');
    if (!contenedor) {
        console.log('⏳ Contenedor no encontrado, reintentando en 100ms...');
        setTimeout(inicializarCarruselSeguro, 100);
        return;
    }

    // Verificar que no haya ya un carrusel inicializado
    if (carruselEpico) {
        console.log('⚠️ Carrusel ya inicializado, destruyendo el anterior...');
        carruselEpico.destruir();
    }

    // Inicializar el nuevo carrusel
    console.log('🎬 Creando nueva instancia del carrusel...');
    carruselEpico = inicializarCarruselSimple();

    if (carruselEpico) {
        console.log('✅ Carrusel inicializado correctamente');

        // Verificar que esté funcionando después de 1 segundo
        setTimeout(() => {
            const estado = carruselEpico.obtenerEstado();
            console.log('📊 Estado del carrusel:', estado);
        }, 1000);
    } else {
        console.error('❌ Error al inicializar carrusel');
    }
}

// Inicializar de forma segura
inicializarCarruselSeguro();

// Función para controlar el carrusel desde el exterior
window.CarruselControl = {
    siguiente: () => carruselEpico?.siguienteSlide(),
    anterior: () => carruselEpico?.anteriorSlide(),
    irA: (indice) => carruselEpico?.irASlide(indice),
    pausar: () => carruselEpico?.pausarAutoPlay(),
    reanudar: () => carruselEpico?.iniciarAutoPlay(),
    toggle: () => carruselEpico?.toggleAutoPlay(),
    estado: () => carruselEpico?.obtenerEstado()
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarruselSimple;
}