/* ==========================================================================
   Slide Deck Marketing Portfolio Script - 'Creator' Template
   Bui Linh Chi Style Concept
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Slide Navigation Elements
    const container = document.getElementById('slides-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('slide-prev-btn');
    const nextBtn = document.getElementById('slide-next-btn');
    const dotsContainer = document.getElementById('slide-progress-dots');
    
    if (!container || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Hide floating back button if loaded inside an iframe (like the Studio Hub modal)
    if (window.self !== window.top) {
        const backBtn = document.getElementById('back-hub-btn');
        if (backBtn) {
            backBtn.style.display = 'none';
        }
    }

    // Dynamic Dot Generation
    function initDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = ''; // Clear
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `progress-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    let isTransitioning = false;
    
    // Main Go To Slide Function
    function goToSlide(index) {
        if (isTransitioning) return;
        
        // Enforce boundary limits
        if (index < 0 || index >= totalSlides) return;
        
        const isInitial = !slides[currentSlide].classList.contains('active');
        const isNext = index > currentSlide;
        const prevIndex = currentSlide;
        currentSlide = index;
        
        // If mobile width, do not trigger slide transitions (mobile has static vertical flow)
        if (window.innerWidth <= 768) {
            slides.forEach((slide, idx) => {
                slide.classList.remove('active', 'exit-next', 'exit-prev', 'enter-next', 'enter-prev');
                if (idx === currentSlide) {
                    slide.classList.add('active');
                }
            });
            updateControls();
            return;
        }
        
        // Initial page load setup
        if (isInitial) {
            slides[currentSlide].classList.add('active');
            updateControls();
            return;
        }
        
        // Desktop Screen Splitting Shutter Transitions
        isTransitioning = true;
        
        const activeSlide = slides[prevIndex];
        const targetSlide = slides[currentSlide];
        
        const enterClass = isNext ? 'enter-next' : 'enter-prev';
        const exitClass = isNext ? 'exit-next' : 'exit-prev';
        
        // Setup entrance start positions
        targetSlide.classList.add(enterClass);
        
        // Force reflow
        targetSlide.offsetWidth;
        
        // Animate columns to center (active) and old columns out (exit)
        targetSlide.classList.add('active');
        targetSlide.classList.remove(enterClass);
        
        activeSlide.classList.add(exitClass);
        activeSlide.classList.remove('active');
        
        // Update Dots and Arrow states immediately
        updateControls();
        
        // Reset classes after transition completes
        setTimeout(() => {
            activeSlide.classList.remove(exitClass);
            isTransitioning = false;
        }, 900); // Matches transition duration of 0.9s
    }

    function updateControls() {
        // Update Dots
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update Arrow Button States (Opacity/Disabled look)
        if (prevBtn) {
            if (currentSlide === 0) {
                prevBtn.style.opacity = '0.3';
                prevBtn.style.pointerEvents = 'none';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'auto';
            }
        }
        
        if (nextBtn) {
            if (currentSlide === totalSlides - 1) {
                nextBtn.style.opacity = '0.3';
                nextBtn.style.pointerEvents = 'none';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.pointerEvents = 'auto';
            }
        }
    }
    
    // Click Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Keyboard Arrow Keys Support
    window.addEventListener('keydown', (e) => {
        // Only run horizontal slide shortcuts if viewport is desktop width
        if (window.innerWidth > 768) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                goToSlide(currentSlide + 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToSlide(currentSlide - 1);
            }
        }
    });

    // Touch Swipe Event Listeners (For tablet horizontal swipes)
    let touchStartX = 0;
    let touchEndX = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    window.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (window.innerWidth > 768) {
            const threshold = 50; // swipe minimum distance
            if (touchStartX - touchEndX > threshold) {
                // Swipe Left -> Next Slide
                goToSlide(currentSlide + 1);
            } else if (touchEndX - touchStartX > threshold) {
                // Swipe Right -> Prev Slide
                goToSlide(currentSlide - 1);
            }
        }
    }
    
    // Resize Listener to handle mobile layouts fluidly
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            slides.forEach((slide) => {
                slide.classList.remove('active', 'exit-next', 'exit-prev', 'enter-next', 'enter-prev');
            });
        } else {
            slides.forEach((slide, idx) => {
                slide.classList.remove('active', 'exit-next', 'exit-prev', 'enter-next', 'enter-prev');
                if (idx === currentSlide) {
                    slide.classList.add('active');
                }
            });
            updateControls();
        }
    });
    
    // Init
    initDots();
    goToSlide(0); // Lock initial state
});
