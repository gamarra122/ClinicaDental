// Variables globales
let currentTestimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const totalTestimonials = testimonials.length;

// Chat en vivo
let chatOpen = false;
let chatMessages = [];

// Mostrar chat después de 10 segundos
setTimeout(() => {
    showChatNotification();
}, 10000);

function showChatNotification() {
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget && !chatOpen) {
        chatWidget.style.display = 'block';
        chatWidget.style.animation = 'slideInUp 0.5s ease';
    }
}

function toggleChat() {
    const chatBody = document.getElementById('chatBody');
    const chatToggle = document.getElementById('chatToggle');
    
    if (chatOpen) {
        chatBody.style.display = 'none';
        chatToggle.style.transform = 'rotate(0deg)';
    } else {
        chatBody.style.display = 'flex';
        chatToggle.style.transform = 'rotate(180deg)';
    }
    chatOpen = !chatOpen;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'sent');
        input.value = '';
        
        // Simular respuesta automática
        setTimeout(() => {
            const responses = [
                "Gracias por tu mensaje. Te responderemos en breve.",
                "Entiendo tu consulta. Un especialista te contactará pronto.",
                "Excelente pregunta. Te ayudo a agendar una cita.",
                "Estamos aquí para ayudarte. ¿Te gustaría que te llamemos?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'received');
        }, 1000);
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
        <span class="message-time">${time}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enviar mensaje con Enter
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Menu toggle para móvil
document.getElementById('menuToggle').addEventListener('click', function() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
    
    // Animación del menú hamburguesa
    this.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace (móvil)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
        document.getElementById('menuToggle').classList.remove('active');
    });
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cambio de header al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Función para cambiar testimonios
function currentTestimonial(n) {
    showTestimonial(currentTestimonialIndex = n - 1);
}

function showTestimonial(n) {
    const slider = document.getElementById('testimonialsSlider');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (n >= totalTestimonials) currentTestimonialIndex = 0;
    if (n < 0) currentTestimonialIndex = totalTestimonials - 1;
    
    slider.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentTestimonialIndex].classList.add('active');
}

// Auto-slide para testimonios
function autoSlideTestimonials() {
    currentTestimonialIndex++;
    if (currentTestimonialIndex >= totalTestimonials) {
        currentTestimonialIndex = 0;
    }
    showTestimonial(currentTestimonialIndex);
}

// Iniciar auto-slide cada 5 segundos
setInterval(autoSlideTestimonials, 5000);

// Validación del formulario mejorada
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        servicio: document.getElementById('servicio').value,
        fecha: document.getElementById('fecha').value,
        mensaje: document.getElementById('mensaje').value.trim()
    };
    
    let isValid = true;
    
    // Validar nombre
    if (!formData.nombre || formData.nombre.length < 2) {
        showError('nombre', 'Por favor, ingresa tu nombre completo');
        isValid = false;
    } else {
        hideError('nombre');
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        showError('email', 'Por favor, ingresa un correo electrónico válido');
        isValid = false;
    } else {
        hideError('email');
    }
    
    // Validar teléfono
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    if (!formData.telefono || !phoneRegex.test(formData.telefono)) {
        showError('telefono', 'Por favor, ingresa un número de teléfono válido');
        isValid = false;
    } else {
        hideError('telefono');
    }
    
    // Validar servicio
    if (!formData.servicio) {
        showError('servicio', 'Por favor, selecciona un servicio');
        isValid = false;
    } else {
        hideError('servicio');
    }
    
    // Validar fecha (opcional pero si se ingresa debe ser futura)
    if (formData.fecha) {
        const selectedDate = new Date(formData.fecha);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError('fecha', 'Por favor, selecciona una fecha futura');
            isValid = false;
        } else {
            hideError('fecha');
        }
    }
    
    // Validar mensaje
    if (!formData.mensaje || formData.mensaje.length < 10) {
        showError('mensaje', 'Por favor, ingresa un mensaje de al menos 10 caracteres');
        isValid = false;
    } else {
        hideError('mensaje');
    }
    
    if (isValid) {
        // Simulación de envío exitoso
        showSuccessMessage();
        this.reset();
        
        // Limpiar fecha mínima
        document.getElementById('fecha').min = '';
    }
});

// Funciones auxiliares para validación
function showError(fieldName, message) {
    const formGroup = document.getElementById(fieldName).parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError(fieldName) {
    const formGroup = document.getElementById(fieldName).parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    errorMessage.style.display = 'none';
}

function showSuccessMessage() {
    // Crear mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        ">
            <div style="color: #27ae60; font-size: 3rem; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: #2c5aa0; margin-bottom: 1rem;">¡Mensaje Enviado!</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">
                Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #2c5aa0;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
            ">Cerrar</button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        " onclick="this.parentElement.remove()"></div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

// Validación en tiempo real
document.getElementById('nombre').addEventListener('input', function() {
    if (this.value.trim().length >= 2) {
        hideError('nombre');
    }
});

document.getElementById('email').addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.value.trim())) {
        hideError('email');
    }
});

document.getElementById('telefono').addEventListener('input', function() {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    if (phoneRegex.test(this.value.trim())) {
        hideError('telefono');
    }
});

document.getElementById('mensaje').addEventListener('input', function() {
    if (this.value.trim().length >= 10) {
        hideError('mensaje');
    }
});

// Animaciones al scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .about-content, .testimonial');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar primer testimonio
    showTestimonial(0);
    
    // Animación inicial
    setTimeout(() => {
        animateOnScroll();
    }, 500);

    // Configurar fecha mínima para el formulario
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.min = today;
    }
});

// Efecto parallax sutil para el hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Destacar enlace activo en la navegación
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});