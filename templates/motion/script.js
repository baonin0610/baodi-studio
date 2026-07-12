/* ==========================================================================
   Motion Designer Portfolio JS Script
   Vy Ngo — Spring Mass Physics Easing & Timeline Scrubber Cursors
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initCustomCursor();
    initScrollReveal();
    initParallax();
    initTimelineScrubber();
    initSpringPhysics();
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

    const links = document.querySelectorAll('a, button, input, textarea, select');
    links.forEach(l => {
        l.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorText.textContent = 'SELECT';
        });
        l.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorText.textContent = '';
        });
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

    const revealTargets = document.querySelectorAll('.reveal-mask:not(.hero-col-photo)');
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
                img.style.transform = `scale(1.1) translateY(${translateY}px)`;
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
 * 5. Interactive Timeline Frame Scrubber Cursor
 */
function initTimelineScrubber() {
    const cursor = document.getElementById('custom-cursor');
    const cursorText = cursor.querySelector('.cursor-text');
    const cards = document.querySelectorAll('.cursor-scrub');
    if (!cursor || !cursorText || cards.length === 0) return;

    cards.forEach(card => {
        const img = card.querySelector('img');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min((mouseX / rect.width) * 100, 100));

            // Set cursor state
            cursor.classList.add('hovered');
            cursor.style.borderColor = 'var(--accent-acid)';
            cursorText.textContent = `SCRUB // ${Math.round(percentage)}%`;

            // Adjust image opacity or grayscale based on percentage to simulate scrubbing video frames!
            if (img) {
                // Modulate contrast and sepia filter values
                img.style.filter = `grayscale(100%) contrast(${1 + (percentage / 200)}) brightness(${0.7 + (percentage / 300)})`;
                // Stretch scale slightly
                img.style.transform = `scale(${1 + (percentage / 1000)})`;
            }
        });

        card.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursor.style.borderColor = 'var(--text-color)';
            cursorText.textContent = '';
            if (img) {
                img.style.filter = '';
                img.style.transform = '';
            }
        });
    });
}

/**
 * 6. Spring-Mass-Damper Elastic Easing Sandbox Engine
 */
function initSpringPhysics() {
    const canvas = document.getElementById('spring-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Controls
    const tensionSlider = document.getElementById('spring-tension');
    const dampingSlider = document.getElementById('spring-damping');
    const gravitySlider = document.getElementById('spring-gravity');

    const tensionVal = document.getElementById('tension-val');
    const dampingVal = document.getElementById('damping-val');
    const gravityVal = document.getElementById('gravity-val');

    // Canvas size
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 350);

    window.addEventListener('resize', () => {
        width = (canvas.width = canvas.parentElement.clientWidth);
        anchor.x = width / 2;
        anchor.y = height / 2;
    });

    // Spring particles parameters
    const anchor = { x: width / 2, y: height / 2 };
    let ball = { x: width / 2, y: height / 2, vx: 0, vy: 0, radius: 14 };

    let isDragging = false;
    let mouse = { x: 0, y: 0 };

    // Physics parameters
    let stiffness = parseFloat(tensionSlider.value); // k
    let damping = parseFloat(dampingSlider.value);   // d (friction)
    let gravity = parseFloat(gravitySlider.value);   // g

    tensionSlider.addEventListener('input', (e) => {
        stiffness = parseFloat(e.target.value);
        tensionVal.textContent = stiffness.toFixed(2);
    });
    dampingSlider.addEventListener('input', (e) => {
        damping = parseFloat(e.target.value);
        dampingVal.textContent = damping.toFixed(2);
    });
    gravitySlider.addEventListener('input', (e) => {
        gravity = parseFloat(e.target.value);
        gravityVal.textContent = gravity.toFixed(1);
    });

    // Mouse Listeners
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        // Check if cursor clicked the ball
        const dist = Math.hypot(mouse.x - ball.x, mouse.y - ball.y);
        if (dist < ball.radius + 15) {
            isDragging = true;
            ball.vx = 0;
            ball.vy = 0;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        ball.x = e.clientX - rect.left;
        ball.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch Listeners
    canvas.addEventListener('touchstart', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;

        const dist = Math.hypot(mouse.x - ball.x, mouse.y - ball.y);
        if (dist < ball.radius + 20) {
            isDragging = true;
            ball.vx = 0;
            ball.vy = 0;
        }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        ball.x = e.touches[0].clientX - rect.left;
        ball.y = e.touches[0].clientY - rect.top;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Helper: Draws elastic helical coil spring lines
    function drawSpring(x1, y1, x2, y2, coils = 16) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.hypot(dx, dy);
        
        const angle = Math.atan2(dy, dx);
        
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(angle);

        // Draw spring coils zig-zags
        const step = distance / coils;
        const width = 12; // width of helical coils

        for (let i = 1; i < coils; i++) {
            const x = i * step;
            const y = (i % 2 === 0 ? 1 : -1) * width;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(distance, 0);
        ctx.stroke();
        ctx.restore();
    }

    // Engine loop
    function updatePhysics() {
        if (!isDragging) {
            // Apply Hooke's Law: F = -k * x
            const fx = -stiffness * (ball.x - anchor.x);
            const fy = -stiffness * (ball.y - anchor.y) + gravity * 1.5; // Adding gravity force

            ball.vx = (ball.vx + fx) * damping;
            ball.vy = (ball.vy + fy) * damping;

            ball.x += ball.vx;
            ball.y += ball.vy;
        }

        // Draw Background coordinates grid
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(212, 255, 0, 0.03)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < width; x += 25) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 25) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // 1. Draw spring coil line
        drawSpring(anchor.x, anchor.y, ball.x, ball.y);

        // 2. Draw anchor cross
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(anchor.x - 8, anchor.y); ctx.lineTo(anchor.x + 8, anchor.y);
        ctx.moveTo(anchor.x, anchor.y - 8); ctx.lineTo(anchor.x, anchor.y + 8);
        ctx.stroke();

        // 3. Draw heavy glowing neon green ball node
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#D4FF00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#D4FF00';
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        requestAnimationFrame(updatePhysics);
    }

    updatePhysics();
}

/**
 * 7. Contact Form Booking Dispatcher feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;

        submitBtn.querySelector('span').textContent = 'Transmitting signal...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'Signal transmitted [Status 200]';
            submitBtn.style.backgroundColor = 'var(--accent-acid)';
            submitBtn.style.color = '#000';

            form.reset();

            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.style.pointerEvents = '';
            }, 3000);
        }, 1500);
    });
}
