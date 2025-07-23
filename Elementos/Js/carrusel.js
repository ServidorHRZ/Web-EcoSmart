// ===== CARRUSEL ÉPICO ECO SMART =====
class CarruselEpicoEcoSmart {
    constructor() {
        this.slideActual = 0;
        this.slides = [];
        this.indicadores = [];
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        this.videoInterval = null;
        this.isPlaying = true;
        this.videoDuration = 60000; // 60 segundos para el video
        this.imageDuration = 300000; // 5 minutos (300 segundos) para cada imagen
        this.isMobile = this.detectarMovil();
        this.videoControlledByEvent = false; // Para evitar conflictos entre evento ended y timeout
        
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
                
                // Evento cuando el video termina
                video.addEventListener('ended', () => {
                    console.log('Video terminado, pasando al siguiente slide');
                    this.videoControlledByEvent = true;
                    this.siguienteSlide();
                    // Resetear el flag después de un breve delay
                    setTimeout(() => {
                        this.videoControlledByEvent = false;
                    }, 100);
                });
                
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
                    console.log('Metadata del video cargada');
                });
            }
        }
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
                    if (this.isMobile) {
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
                            if (this.isMobile) {
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

    // Configurar todos los eventos
    configurarEventos() {
        // Botones de navegación
        const btnPrev = document.getElementById('prevBtn');
        const btnNext = document.getElementById('nextBtn');

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.siguienteSlide();
            });
        }
        
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                this.anteriorSlide();
            });
        }

        // Indicadores
        this.indicadores.forEach((indicador, indice) => {
            indicador.addEventListener('click', () => {
                this.mostrarSlide(indice);
            });
        });

        // Control del auto-play con mouse (solo en desktop)
        if (!this.isMobile) {
            const carruselContenedor = document.querySelector('.carrusel-contenedor');
            if (carruselContenedor) {
                carruselContenedor.addEventListener('mouseenter', () => {
                    this.pausarAutoPlay();
                });

                carruselContenedor.addEventListener('mouseleave', () => {
                    this.iniciarAutoPlay();
                });
            }
        }

        // Control con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.anteriorSlide();
            } else if (e.key === 'ArrowRight') {
                this.siguienteSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Soporte táctil para móviles
        this.configurarEventosTactiles();

        // Pausar cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pausarAutoPlay();
            } else {
                this.iniciarAutoPlay();
            }
        });

        // Habilitar reproducción de video en móviles después de interacción del usuario
        if (this.isMobile) {
            this.configurarInteraccionMovil();
        }
    }

    // Configurar interacción para móviles
    configurarInteraccionMovil() {
        let interaccionRealizada = false;
        
        const habilitarVideo = () => {
            if (!interaccionRealizada) {
                interaccionRealizada = true;
                console.log('Interacción del usuario detectada, habilitando videos');
                
                // Intentar reproducir el video actual si es un video
                const slideActivo = this.slides[this.slideActual];
                if (slideActivo && slideActivo.dataset.tipo === 'video') {
                    this.manejarVideo();
                }
            }
        };

        // Escuchar varios tipos de interacción
        document.addEventListener('touchstart', habilitarVideo, { once: true });
        document.addEventListener('click', habilitarVideo, { once: true });
        document.addEventListener('keydown', habilitarVideo, { once: true });
    }

    // Configurar eventos táctiles
    configurarEventosTactiles() {
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;

        const carruselContenedor = document.querySelector('.carrusel-contenedor');
        if (!carruselContenedor) return;

        carruselContenedor.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        carruselContenedor.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.manejarSwipe(startX, endX, startY, endY);
        }, { passive: true });
    }

    // Manejar gestos de deslizamiento
    manejarSwipe(startX, endX, startY, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        const minSwipeDistance = 50;

        // Solo procesar si el movimiento horizontal es mayor que el vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                this.siguienteSlide(); // Swipe izquierda - siguiente
            } else {
                this.anteriorSlide(); // Swipe derecha - anterior
            }
        }
    }

    // Obtener duración del slide actual
    obtenerDuracionSlide() {
        const slideActivo = this.slides[this.slideActual];
        if (slideActivo) {
            const esVideo = slideActivo.dataset.tipo === 'video';
            
            if (esVideo) {
                // Para videos, no usar timeout si está controlado por evento
                if (this.videoControlledByEvent) {
                    return null; // No establecer timeout, el evento 'ended' se encarga
                }
                return this.videoDuration; // 60 segundos
            } else {
                return this.imageDuration; // 5 minutos para imágenes
            }
        }
        return this.imageDuration; // Por defecto
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
                console.log(`Iniciando autoplay con duración: ${duracion}ms`);
                this.autoPlayInterval = setTimeout(() => {
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
function inicializarCarruselEpico() {
    const carruselContenedor = document.querySelector('.carrusel-principal');
    if (carruselContenedor) {
        return new CarruselEpicoEcoSmart();
    } else {
        console.error('Contenedor del carrusel no encontrado');
        return null;
    }
}

// Variable global para acceder al carrusel
let carruselEpico = null;

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    carruselEpico = inicializarCarruselEpico();
});

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
    module.exports = CarruselEpicoEcoSmart;
}