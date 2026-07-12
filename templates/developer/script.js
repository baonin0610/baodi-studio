/* ==========================================================================
   Creative Developer Portfolio JS Script
   Alex Nguyen — Interactive Physics Canvas & Decrypt Text
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initCustomCursor();
    initScrollReveal();
    initParallax();
    initDecryptAnimation();
    initFluidPhysicsCanvas();
    initContactForm();
});

/**
 * 1. Hero Entrance
 */
function initHeroAnimation() {
    const heroSec = document.querySelector('.hero-section');
    if (heroSec) {
        setTimeout(() => {
            heroSec.classList.add('active');
            const heroImg = heroSec.querySelector('.reveal-mask');
            if (heroImg) heroImg.classList.add('revealed');
        }, 100);
    }
}

/**
 * 2. Elastic custom cursor
 */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const cursorText = cursor.querySelector('.cursor-text');
    let mouse = { x: 0, y: 0 };
    let cursorCoords = { x: 0, y: 0 };
    const lerpFactor = 0.15;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function updateCursor() {
        cursorCoords.x += (mouse.x - cursorCoords.x) * lerpFactor;
        cursorCoords.y += (mouse.y - cursorCoords.y) * lerpFactor;
        
        cursor.style.left = `${cursorCoords.x}px`;
        cursor.style.top = `${cursorCoords.y}px`;
        
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Hover scales
    const targets = document.querySelectorAll('.cursor-view');
    targets.forEach(t => {
        t.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorText.textContent = t.getAttribute('data-cursor') || 'VIEW';
        });
        t.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorText.textContent = '';
        });
    });

    const links = document.querySelectorAll('a, button, input, textarea, select');
    links.forEach(l => {
        if (!l.classList.contains('cursor-view')) {
            l.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.backgroundColor = 'rgba(217, 119, 6, 0.2)';
                cursor.style.border = '1px solid var(--accent-color)';
            });
            l.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'var(--text-color)';
                cursor.style.border = 'none';
            });
        }
    });
}

/**
 * 3. Intersection Observer Scroll Reveal
 */
function initScrollReveal() {
    const revealOptions = {
        threshold: 0,
        rootMargin: '0px 0px -60px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealTargets = document.querySelectorAll('.reveal-mask:not(.hero-portrait-wrapper)');
    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });
}

/**
 * 4. Image Parallax
 */
function initParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    function checkParallax() {
        parallaxImages.forEach(img => {
            const container = img.parentElement;
            const containerRect = container.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            if (containerRect.top < viewHeight && containerRect.bottom > 0) {
                const totalScrollRange = viewHeight + containerRect.height;
                const currentScrollPosition = viewHeight - containerRect.top;
                const scrollRatio = currentScrollPosition / totalScrollRange;
                
                const translateY = (scrollRatio - 0.5) * 50;
                img.style.transform = `scale(1.15) translateY(${translateY}px)`;
            }
        });
    }

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                checkParallax();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    checkParallax();
}

/**
 * 5. Matrix/Console Character Decrypt Animation
 */
function initDecryptAnimation() {
    const triggers = document.querySelectorAll('.decrypt-trigger');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#$*=+[]<>/?';

    function decryptText(element) {
        const originalText = element.getAttribute('data-text') || element.textContent;
        let iteration = 0;
        let interval = null;
        
        clearInterval(interval);
        
        interval = setInterval(() => {
            element.textContent = originalText.split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iteration >= originalText.length) {
                clearInterval(interval);
            }
            
            iteration += 1 / 2; // Decrypts 1 character every 2 intervals for smooth speed
        }, 30);
    }

    const decryptObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                decryptText(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    triggers.forEach(trigger => {
        decryptObserver.observe(trigger);
    });
}

/**
 * 6. Generative Physics 3D Particle Mesh Canvas
 */
function initFluidPhysicsCanvas() {
    const canvas = document.getElementById('fluid-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 200 };
    
    // 3D parameters
    const focalLength = 350;
    let angleY = 0.002;
    let angleX = 0.001;

    // Physics Tuning (Linked to inputs)
    let particleCount = parseInt(document.getElementById('particle-count').value);
    let speedMult = parseFloat(document.getElementById('particle-speed').value);
    let attractStrength = parseFloat(document.getElementById('particle-attract').value);
    let drawLines = document.getElementById('draw-lines').checked;

    // Monitor resize
    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        initParticles();
    });

    // Monitor mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle 3D Object
    class Particle {
        constructor() {
            // Random positions in 3D box
            this.x3d = (Math.random() - 0.5) * width;
            this.y3d = (Math.random() - 0.5) * height;
            this.z3d = (Math.random() - 0.5) * 500;

            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.vz = (Math.random() - 0.5) * 0.4;

            this.baseRadius = Math.random() * 1.8 + 0.8;
            this.x = 0;
            this.y = 0;
            this.radius = 0;
        }

        update() {
            // Constant drifting in 3D space
            this.x3d += this.vx * speedMult;
            this.y3d += this.vy * speedMult;
            this.z3d += this.vz * speedMult;

            // Keep within 3D boundaries
            const boundX = width / 2;
            const boundY = height / 2;
            if (Math.abs(this.x3d) > boundX) this.vx = -this.vx;
            if (Math.abs(this.y3d) > boundY) this.vy = -this.vy;
            if (Math.abs(this.z3d) > 250) this.vz = -this.vz;

            // Rotate in Y axis
            const cosY = Math.cos(angleY * speedMult);
            const sinY = Math.sin(angleY * speedMult);
            const rx = this.x3d * cosY - this.z3d * sinY;
            const rz = this.z3d * cosY + this.x3d * sinY;

            // Rotate in X axis
            const cosX = Math.cos(angleX * speedMult);
            const sinX = Math.sin(angleX * speedMult);
            const ry = this.y3d * cosX - rz * sinX;
            const finalZ = rz * cosX + this.y3d * sinX;

            // Project 3D onto 2D viewport
            const scale = focalLength / (focalLength + finalZ);
            this.x = (width / 2) + rx * scale;
            this.y = (height / 2) + ry * scale;
            this.radius = this.baseRadius * scale;

            // Mouse force field physics (repels/attracts projected coordinates)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.hypot(dx, dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Multiply pull based on attractStrength slider
                    const pullX = (dx / distance) * force * attractStrength * 2.5;
                    const pullY = (dy / distance) * force * attractStrength * 2.5;

                    this.x += pullX;
                    this.y += pullY;
                }
            }
        }

        draw() {
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.2, this.radius), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(236, 239, 244, ${Math.min(1.0, 0.2 + this.radius / 3)})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Animation Tick
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update & Draw nodes
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        if (drawLines) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 110) {
                        const opacity = ((110 - dist) / 110) * 0.09;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(217, 119, 6, ${opacity})`; // Subtle amber code node connectors
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Terminal Logger UI
    const terminalBody = document.getElementById('terminal-body');
    function writeLog(message, styleClass = '') {
        const line = document.createElement('p');
        line.classList.add('log-line');
        if (styleClass) line.classList.add(styleClass);
        line.textContent = `> ${message}`;
        
        terminalBody.appendChild(line);
        // Autoscroll terminal
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        // Cap terminal output lines to prevent DOM bloat
        if (terminalBody.childElementCount > 12) {
            terminalBody.removeChild(terminalBody.firstChild);
        }
    }

    // Connect Sliders & Control listeners
    const countSlider = document.getElementById('particle-count');
    const speedSlider = document.getElementById('particle-speed');
    const attractSlider = document.getElementById('particle-attract');
    const linesCheckbox = document.getElementById('draw-lines');

    countSlider.addEventListener('input', (e) => {
        particleCount = parseInt(e.target.value);
        document.getElementById('count-val').textContent = particleCount;
        initParticles();
        writeLog(`Re-compiling physics. Spawned ${particleCount} nodes.`, 'text-green');
    });

    speedSlider.addEventListener('input', (e) => {
        speedMult = parseFloat(e.target.value);
        document.getElementById('speed-val').textContent = speedMult.toFixed(1);
        writeLog(`Vector velocity adjusted to: ${speedMult.toFixed(1)}x multiplier.`);
    });

    attractSlider.addEventListener('input', (e) => {
        attractStrength = parseFloat(e.target.value);
        document.getElementById('attract-val').textContent = attractStrength.toFixed(2);
        writeLog(`Magnetic matrix attraction ratio set to: ${attractStrength.toFixed(2)}.`);
    });

    linesCheckbox.addEventListener('change', (e) => {
        drawLines = e.target.checked;
        const stateStr = drawLines ? 'ENABLED' : 'DISABLED';
        writeLog(`Acoustic node links state: ${stateStr}`, drawLines ? 'text-yellow' : '');
    });

    // Start Engine
    initParticles();
    animate();
}

/**
 * 7. Terminal Form Submission Feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;

        submitBtn.querySelector('span').textContent = 'Executing Compile...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'Compilation Success [Status 200]';
            submitBtn.style.backgroundColor = '#10B981';

            form.reset();

            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.pointerEvents = '';
            }, 3000);
        }, 1500);
    });
}
