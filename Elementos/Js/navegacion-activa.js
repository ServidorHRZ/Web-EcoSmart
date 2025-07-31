// Funcionalidad para marcar la navegación activa
document.addEventListener('DOMContentLoaded', function() {
    // Obtener la URL actual
    const paginaActual = window.location.pathname;
    const nombrePagina = paginaActual.split('/').pop();
    
    // Seleccionar todos los enlaces del menú
    const enlacesDesktop = document.querySelectorAll('.menu-horizontal a');
    const enlacesMovil = document.querySelectorAll('.menu-lista a');
    
    // Función para marcar enlace como activo
    function marcarEnlaceActivo(enlaces, condicion) {
        enlaces.forEach(enlace => {
            // Limpiar clase activo de todos los enlaces
            enlace.classList.remove('activo');
            
            const href = enlace.getAttribute('href');
            
            // Verificar si el enlace corresponde a la página actual
            if (condicion(href, nombrePagina)) {
                enlace.classList.add('activo');
            }
        });
    }
    
    // Función para determinar si un enlace está activo
    function esEnlaceActivo(href, nombrePagina) {
        // Si estamos en Home.html o index.html
        if (nombrePagina === 'Home.html' || nombrePagina === 'index.html' || nombrePagina === '') {
            return href === '#inicio' || href === '../index.html' || href === 'index.html';
        }
        
        // Si estamos en Servicios.html
        if (nombrePagina === 'Servicios.html') {
            return href === 'Servicios.html' || href === '#servicios';
        }
        
        // Si estamos en Contacto.html
        if (nombrePagina === 'Contacto.html') {
            return href === 'Contacto.html' || href === '#contacto';
        }
        
        // Si estamos en Nosotros.html
        if (nombrePagina === 'Nosotros.html') {
            return href === 'Nosotros.html' || href === '#nosotros';
        }
        
        // Si estamos en Productos.html
        if (nombrePagina === 'Productos.html') {
            return href === 'Productos.html' || href === '#productos';
        }
        
        // Si estamos en Impacto.html
        if (nombrePagina === 'Impacto.html') {
            return href === 'Impacto.html' || href === '#impacto';
        }
        
        // Si estamos en Postulacion.html
        if (nombrePagina === 'Postulacion.html') {
            return href === 'Postulacion.html' || href === '#postulacion';
        }
        
        return false;
    }
    
    // Aplicar la lógica a ambos menús
    marcarEnlaceActivo(enlacesDesktop, esEnlaceActivo);
    marcarEnlaceActivo(enlacesMovil, esEnlaceActivo);
    
    // También manejar el scroll en Home.html para las secciones internas
    if (nombrePagina === 'Home.html') {
        // Función para detectar qué sección está visible
        function detectarSeccionVisible() {
            const secciones = document.querySelectorAll('section[id]');
            let seccionActiva = null;
            
            secciones.forEach(seccion => {
                const rect = seccion.getBoundingClientRect();
                const alturaVentana = window.innerHeight;
                
                // Si la sección está visible en la pantalla (más del 50%)
                if (rect.top <= alturaVentana * 0.5 && rect.bottom >= alturaVentana * 0.5) {
                    seccionActiva = seccion.id;
                }
            });
            
            if (seccionActiva) {
                // Marcar el enlace correspondiente como activo
                const enlaceActivo = `#${seccionActiva}`;
                
                enlacesDesktop.forEach(enlace => {
                    enlace.classList.remove('activo');
                    if (enlace.getAttribute('href') === enlaceActivo) {
                        enlace.classList.add('activo');
                    }
                });
                
                enlacesMovil.forEach(enlace => {
                    enlace.classList.remove('activo');
                    if (enlace.getAttribute('href') === enlaceActivo) {
                        enlace.classList.add('activo');
                    }
                });
            }
        }
        
        // Detectar sección visible al hacer scroll
        window.addEventListener('scroll', detectarSeccionVisible);
        
        // Detectar sección inicial
        setTimeout(detectarSeccionVisible, 100);
    }
});