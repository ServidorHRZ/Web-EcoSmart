// Funcionalidad para la página de productos
document.addEventListener('DOMContentLoaded', function() {
    // Agregar animaciones de entrada para los productos
    const productosItems = document.querySelectorAll('.producto-item');
    const beneficiosItems = document.querySelectorAll('.beneficio-item');
    const elementosAnimados = document.querySelectorAll('.animar-entrada-izquierda, .animar-entrada-derecha, .card-animacion');
    
    // Establecer estados iniciales para elementos animados
    elementosAnimados.forEach(elemento => {
        if (elemento.classList.contains('animar-entrada-izquierda')) {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateX(-50px)';
        } else if (elemento.classList.contains('animar-entrada-derecha')) {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateX(50px)';
        } else if (elemento.classList.contains('card-animacion')) {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(30px) scale(0.9)';
        }
    });
    
    // Observador para animaciones al hacer scroll
    const observador = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determinar el tipo de animación basado en las clases
                if (entry.target.classList.contains('animar-entrada-izquierda')) {
                    entry.target.classList.add('fade-in-left');
                } else if (entry.target.classList.contains('animar-entrada-derecha')) {
                    entry.target.classList.add('fade-in-right');
                } else if (entry.target.classList.contains('card-animacion')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                } else {
                    entry.target.classList.add('fade-in-up');
                }
                // Desconectar el elemento una vez animado
                observador.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar todos los elementos de productos
    productosItems.forEach(item => {
        observador.observe(item);
    });
    
    // Observar todos los elementos de beneficios
    beneficiosItems.forEach(item => {
        observador.observe(item);
    });
    
    // Observar elementos con animaciones específicas
    elementosAnimados.forEach(item => {
        observador.observe(item);
    });
    
    // Funcionalidad para abrir el formulario de postulación
    window.abrirFormularioPostulacion = function() {
        // Abrir en una nueva pestaña
        window.open('https://servidorhrz.github.io/Formulario-EcoSmart/', '_blank');
    };
    
    // Animación de entrada inicial para elementos visibles
    setTimeout(() => {
        const elementosVisibles = document.querySelectorAll('.titulo-animado, .animar-entrada');
        elementosVisibles.forEach((elemento, index) => {
            setTimeout(() => {
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
    
    // Efecto de hover mejorado para productos
    productosItems.forEach(producto => {
        const imagen = producto.querySelector('.producto-imagen img');
        const icono = producto.querySelector('.producto-icono');
        
        producto.addEventListener('mouseenter', function() {
            if (imagen) {
                imagen.style.transform = 'scale(1.05) translateY(-5px)';
            }
            if (icono) {
                icono.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });
        
        producto.addEventListener('mouseleave', function() {
            if (imagen) {
                imagen.style.transform = 'scale(1) translateY(0)';
            }
            if (icono) {
                icono.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Efecto de hover para beneficios
    beneficiosItems.forEach(beneficio => {
        const icono = beneficio.querySelector('.beneficio-icono');
        
        beneficio.addEventListener('mouseenter', function() {
            if (icono) {
                icono.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });
        
        beneficio.addEventListener('mouseleave', function() {
            if (icono) {
                icono.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
});

// Función para consultar por WhatsApp
function consultarWhatsApp(producto) {
    // Número de WhatsApp de la empresa (cambiar por el número real)
    const numeroWhatsApp = '573001234567'; // Cambiar por el número real
    
    // Mensaje personalizado según el producto
    let mensaje = `Hola! Me interesa obtener más información sobre: ${producto}.\n\n`;
    mensaje += 'Me gustaría conocer:\n';
    mensaje += '• Precio y disponibilidad\n';
    mensaje += '• Especificaciones técnicas\n';
    mensaje += '• Tiempo de instalación\n';
    mensaje += '• Garantía y soporte\n\n';
    mensaje += 'Gracias!';
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear la URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(urlWhatsApp, '_blank');
    
    // Opcional: Tracking de eventos (Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_contact', {
            'event_category': 'productos',
            'event_label': producto,
            'value': 1
        });
    }
}

// Función para mostrar detalles del producto (modal futuro)
function mostrarDetallesProducto(producto) {
    // Esta función se puede expandir para mostrar un modal con más detalles
    console.log('Mostrando detalles de:', producto);
    
    // Por ahora, redirigir a WhatsApp
    consultarWhatsApp(producto);
}

// Función para filtrar productos (funcionalidad futura)
function filtrarProductos(categoria) {
    const productos = document.querySelectorAll('.producto-item');
    const categorias = document.querySelectorAll('.categoria-productos');
    
    if (categoria === 'todos') {
        categorias.forEach(cat => {
            cat.style.display = 'block';
        });
    } else {
        categorias.forEach(cat => {
            const titulo = cat.querySelector('.titulo-categoria').textContent.toLowerCase();
            if (titulo.includes(categoria.toLowerCase())) {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }
}

// Función para búsqueda de productos (funcionalidad futura)
function buscarProductos(termino) {
    const productos = document.querySelectorAll('.producto-item');
    const terminoLower = termino.toLowerCase();
    
    productos.forEach(producto => {
        const titulo = producto.querySelector('h3').textContent.toLowerCase();
        const descripcion = producto.querySelector('.producto-descripcion').textContent.toLowerCase();
        
        if (titulo.includes(terminoLower) || descripcion.includes(terminoLower)) {
            producto.style.display = 'block';
            producto.parentElement.style.display = 'grid';
        } else {
            producto.style.display = 'none';
        }
    });
    
    // Ocultar categorías vacías
    const categorias = document.querySelectorAll('.categoria-productos');
    categorias.forEach(categoria => {
        const productosVisibles = categoria.querySelectorAll('.producto-item[style*="block"]');
        if (productosVisibles.length === 0) {
            categoria.style.display = 'none';
        } else {
            categoria.style.display = 'block';
        }
    });
}

// Función para comparar productos (funcionalidad futura)
let productosComparar = [];

function agregarAComparacion(productoId) {
    if (productosComparar.length < 3 && !productosComparar.includes(productoId)) {
        productosComparar.push(productoId);
        actualizarContadorComparacion();
    }
}

function removerDeComparacion(productoId) {
    const index = productosComparar.indexOf(productoId);
    if (index > -1) {
        productosComparar.splice(index, 1);
        actualizarContadorComparacion();
    }
}

function actualizarContadorComparacion() {
    const contador = document.querySelector('.contador-comparacion');
    if (contador) {
        contador.textContent = productosComparar.length;
        contador.style.display = productosComparar.length > 0 ? 'block' : 'none';
    }
}

// Función para mostrar comparación
function mostrarComparacion() {
    if (productosComparar.length > 1) {
        // Implementar modal de comparación
        console.log('Comparando productos:', productosComparar);
    } else {
        alert('Selecciona al menos 2 productos para comparar');
    }
}

// Función para compartir producto
function compartirProducto(producto, url) {
    if (navigator.share) {
        navigator.share({
            title: `${producto} - Eco Smart Construcciones`,
            text: `Mira este increíble producto: ${producto}`,
            url: url || window.location.href
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const textoCompartir = `Mira este increíble producto: ${producto} - ${url || window.location.href}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textoCompartir).then(() => {
                alert('Enlace copiado al portapapeles');
            });
        } else {
            // Fallback más básico
            const textArea = document.createElement('textarea');
            textArea.value = textoCompartir;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Enlace copiado al portapapeles');
        }
    }
}

// Función para calcular precio estimado (funcionalidad futura)
function calcularPrecioEstimado(producto, cantidad = 1, instalacion = false) {
    // Precios base (estos deberían venir de una API o base de datos)
    const precios = {
        'Puertas Inteligentes Reutilizables': 850000,
        'Puertas Inteligentes Premium': 1200000,
        'Chapas Digitales Avanzadas': 320000,
        'Herrajes Eco-Inteligentes': 180000,
        'Sensores de Movimiento IoT': 95000,
        'Panel de Control Central': 750000
    };
    
    let precioBase = precios[producto] || 0;
    let precioTotal = precioBase * cantidad;
    
    if (instalacion) {
        precioTotal += precioBase * 0.15; // 15% adicional por instalación
    }
    
    return {
        precioBase: precioBase,
        cantidad: cantidad,
        instalacion: instalacion,
        precioTotal: precioTotal
    };
}

// Función para solicitar cotización personalizada
function solicitarCotizacion(producto) {
    const numeroWhatsApp = '573001234567'; // Cambiar por el número real
    
    let mensaje = `Hola! Me gustaría solicitar una cotización personalizada para: ${producto}.\n\n`;
    mensaje += 'Por favor, necesito información sobre:\n';
    mensaje += '• Cotización detallada\n';
    mensaje += '• Opciones de financiamiento\n';
    mensaje += '• Tiempo de entrega\n';
    mensaje += '• Instalación incluida\n';
    mensaje += '• Garantía y mantenimiento\n\n';
    mensaje += 'Muchas gracias!';
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
}