// ===== ENHANCED PARTICLE SYSTEM =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = this.getRandomColor();
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    getRandomColor() {
        const colors = [
            { r: 157, g: 78, b: 221 },   // Purple
            { r: 0, g: 212, b: 255 },    // Cyan
            { r: 255, g: 214, b: 10 }    // Gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        const pulseFactor = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const currentOpacity = this.opacity * pulseFactor;
        const currentSize = this.size * pulseFactor;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize * 3);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity * 1.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Connection lines between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.15;
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawConnections();
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== ENHANCED PARALLAX EFFECTS =====
const parallaxSun = document.querySelector('.parallax-sun');
const ambientLights = document.querySelectorAll('.ambient-light');

window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Parallax sun
    parallaxSun.style.transform = `translate(${x * 40 - 20}px, ${y * 40 - 20}px)`;
    
    // Ambient lights parallax
    ambientLights.forEach((light, index) => {
        const speed = (index + 1) * 10;
        light.style.transform = `translate(${x * speed - speed/2}px, ${y * speed - speed/2}px)`;
    });
});

// 3D tilt effect for cards
document.querySelectorAll('.phase-card, .protocol-module').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `translateY(-15px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll('.phase-card, .protocol-module, .hologram-panel');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ===== HYPOTHESIS FORM SUBMISSION =====
const hypothesisForm = document.getElementById('hypothesisForm');
const formStatus = document.getElementById('formStatus');

if (hypothesisForm) {
    hypothesisForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(hypothesisForm);
        const data = {
            belief: formData.get('belief'),
            reasoning: formData.get('reasoning'),
            name: formData.get('name'),
            email: formData.get('email'),
            timestamp: new Date().toISOString()
        };
        
        // Show loading state
        const submitButton = hypothesisForm.querySelector('.submit-button');
        const originalText = submitButton.querySelector('.button-text').textContent;
        submitButton.querySelector('.button-text').textContent = '⬡ TRANSMITTING... ⬡';
        submitButton.disabled = true;
        
        // Simulate submission (replace with actual API call)
        setTimeout(() => {
            // Store in localStorage for demonstration
            const submissions = JSON.parse(localStorage.getItem('hypothesisSubmissions') || '[]');
            submissions.push(data);
            localStorage.setItem('hypothesisSubmissions', JSON.stringify(submissions));
            
            // Show success message
            formStatus.textContent = '✓ HYPOTHESIS TRANSMITTED SUCCESSFULLY';
            formStatus.className = 'form-status success show';
            
            // Reset button
            submitButton.querySelector('.button-text').textContent = originalText;
            submitButton.disabled = false;
            
            // Reset form
            hypothesisForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formStatus.classList.remove('show');
            }, 5000);
            
            console.log('Hypothesis submitted:', data);
        }, 1500);
    });
}

// ===== DONATION BUTTON INTERACTIONS =====
const energyButtons = document.querySelectorAll('.energy-button');

energyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const amount = button.getAttribute('data-amount');
        
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 214, 10, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        ripple.style.pointerEvents = 'none';
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        if (amount === 'custom') {
            alert('Custom donation amount feature coming soon!');
        } else {
            alert(`Thank you for supporting the mission with ${amount} energy units!`);
        }
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PHASE CARD HOVER SOUND (Visual feedback) =====
const phaseCards = document.querySelectorAll('.phase-card');

phaseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});

// ===== PROTOCOL MODULE INTERACTIONS =====
const protocolModules = document.querySelectorAll('.protocol-module');

protocolModules.forEach(module => {
    module.addEventListener('click', () => {
        module.style.animation = 'none';
        setTimeout(() => {
            module.style.animation = '';
        }, 10);
    });
});

// ===== SMOOTH SCROLLING =====
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

// ===== TITLE GLITCH EFFECT TRIGGER =====
const title = document.querySelector('.glitch');
let glitchInterval;

function triggerGlitch() {
    title.style.animation = 'none';
    setTimeout(() => {
        title.style.animation = '';
    }, 10);
}

// Random glitch every 8-15 seconds
function randomGlitch() {
    const delay = Math.random() * 7000 + 8000;
    setTimeout(() => {
        triggerGlitch();
        randomGlitch();
    }, delay);
}

randomGlitch();

// ===== ENERGY CORE PULSE ON HOVER =====
const energyCore = document.querySelector('.core-center');
const coreContainer = document.querySelector('.core-container');

if (coreContainer) {
    coreContainer.addEventListener('mouseenter', () => {
        energyCore.style.animationDuration = '1.5s';
    });

    coreContainer.addEventListener('mouseleave', () => {
        energyCore.style.animationDuration = '3s';
    });
}

// ===== EXPANSION MAP INTERACTION =====
const satelliteNodes = document.querySelectorAll('.node');

satelliteNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
        node.style.transform = 'translate(-50%, -50%) scale(1.5)';
        node.style.boxShadow = '0 0 30px rgba(0, 212, 255, 1)';
    });

    node.addEventListener('mouseleave', () => {
        node.style.transform = 'translate(-50%, -50%) scale(1)';
        node.style.boxSadow = '0 0 20px rgba(0, 212, 255, 0.8)';
    });
});

// ===== CONSOLE EASTER EGG =====
console.log('%c🌟 HELLO SUNSHINE MISSION CONTROL 🌟', 'color: #ffd60a; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(255, 214, 10, 0.8);');
console.log('%cMISSION STATUS: ACTIVE', 'color: #00d4ff; font-size: 14px;');
console.log('%cOBJECTIVE: Reconnect humanity across generations', 'color: #9d4edd; font-size: 12px;');
console.log('%c⬡ Proving connection transcends age ⬡', 'color: #e0e0ff; font-size: 10px;');

// ===== PERFORMANCE OPTIMIZATION =====
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        canvas.style.display = 'none';
    } else {
        canvas.style.display = 'block';
    }
});
