/* ==========================================================================
   Editorial Portfolio JS Script
   Linh Nguyen — Art Director & Editorial Photographer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initCustomCursor();
    initScrollReveal();
    initParallax();
    initMagneticEffect();
    initFormInteractivity();
});

/**
 * 1. Hero Animation Trigger
 * Activates typography reveal on load
 */
function initHeroAnimation() {
    const heroSec = document.querySelector('.hero-section');
    if (heroSec) {
        // Trigger active class immediately after load
        setTimeout(() => {
            heroSec.classList.add('active');
            const heroImg = heroSec.querySelector('.reveal-mask');
            if (heroImg) {
                heroImg.classList.add('revealed');
            }
        }, 100);
    }
}

/**
 * 2. Smooth Lerp Custom Cursor
 * Custom cursor with elastic tracking and text change on hover
 */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorText = cursor.querySelector('.cursor-text');
    
    let mouse = { x: 0, y: 0 }; // Current mouse coordinates
    let cursorCoords = { x: 0, y: 0 }; // Interpolated coordinates
    const lerpFactor = 0.15; // Tuning for trailing drag (lower is slower/smoother)
    
    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Custom animation tick
    function updateCursor() {
        // Calculate interpolation
        cursorCoords.x += (mouse.x - cursorCoords.x) * lerpFactor;
        cursorCoords.y += (mouse.y - cursorCoords.y) * lerpFactor;
        
        // Position custom cursor
        cursor.style.left = `${cursorCoords.x}px`;
        cursor.style.top = `${cursorCoords.y}px`;
        
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Hover interactions for project images
    const viewTargets = document.querySelectorAll('.cursor-view');
    viewTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            const customText = target.getAttribute('data-cursor') || 'VIEW';
            cursorText.textContent = customText;
        });

        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorText.textContent = '';
        });
    });

    // Hover interactions for general links
    const links = document.querySelectorAll('a, button, select, input, textarea');
    links.forEach(link => {
        if (!link.classList.contains('cursor-view')) {
            link.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
                cursor.style.backgroundColor = 'rgba(26, 26, 26, 0.15)';
                cursor.style.border = '1px solid var(--text-color)';
            });
            link.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'var(--text-color)';
                cursor.style.border = 'none';
            });
        }
    });
}

/**
 * 3. Shutter-like Scroll Reveal
 * Uses IntersectionObserver to reveal elements when scrolled into view
 */
function initScrollReveal() {
    const revealOptions = {
        threshold: 0, // Trigger immediately when any part of the layout box enters the viewport (essential for clip-path bounds compatibility)
        rootMargin: '0px 0px -80px 0px' // Triggers reveal when element is 80px inside the viewport
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once animation triggered
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealTargets = document.querySelectorAll('.reveal-mask:not(.hero-image-wrapper)');
    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });
}

/**
 * 4. Lightweight Parallax Effect on Images
 * Smoothly shifts images in the Y axis during scroll using requestAnimationFrame
 */
function initParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    function checkParallax() {
        parallaxImages.forEach(img => {
            const container = img.parentElement;
            const containerRect = container.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Check if element is in viewport
            if (containerRect.top < viewHeight && containerRect.bottom > 0) {
                // Calculate scroll ratio (0 when entering bottom, 1 when leaving top)
                const totalScrollRange = viewHeight + containerRect.height;
                const currentScrollPosition = viewHeight - containerRect.top;
                const scrollRatio = currentScrollPosition / totalScrollRange;
                
                // Maps vertical translate from -30px to 30px
                const translateY = (scrollRatio - 0.5) * 60;
                img.style.transform = `scale(1.15) translateY(${translateY}px)`;
            }
        });
    }

    // Bind event scroll with RAF optimization
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
    
    // Initial run
    checkParallax();
}

/**
 * 5. Magnetic Pull Effect on Interactive Controls
 * Makes buttons and contact details attract towards the cursor on close hover
 */
function initMagneticEffect() {
    const magneticTargets = document.querySelectorAll('.magnetic-target');
    
    magneticTargets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Get center coordinates of the target element
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate distance between cursor and center
            const moveX = (e.clientX - centerX) * 0.35; // 35% magnetic pull strength
            const moveY = (e.clientY - centerY) * 0.35;
            
            // Translate the element slightly
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            // Restore origin state
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

/**
 * 6. Contact Form Interactivity
 * Custom interactions for form submissions and input elements
 */
function initFormInteractivity() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Show loading state
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            // Successful state feedback
            submitBtn.querySelector('span').textContent = 'Message Sent';
            submitBtn.style.backgroundColor = '#4F8A10'; // Soft olive-green for success
            
            // Reset form fields
            form.reset();
            
            // Revert state back after delay
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.pointerEvents = '';
            }, 3000);
        }, 1500);
    });
}
