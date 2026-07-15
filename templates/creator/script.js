/* ==========================================================================
   Horizontal Scroll & Parallax Exhibition Script - 'Creator' Template
   Bui Linh Chi Style Concept
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Core Layout Elements
    const container = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');
    
    if (!container || slides.length === 0) return;
    
    const totalSlides = slides.length;
    let windowWidth = window.innerWidth;
    let maxScrollX = (totalSlides - 1) * windowWidth;
    
    // Smooth Scroll Coordinates
    let scrollX = 0;
    let targetScrollX = 0;
    let currentSlide = 0;
    
    // Inject Ambient Background Motion Glows into each slide dynamically
    slides.forEach((slide) => {
        const glow1 = document.createElement('div');
        glow1.className = 'ambient-glow glow-1';
        const glow2 = document.createElement('div');
        glow2.className = 'ambient-glow glow-2';
        slide.appendChild(glow1);
        slide.appendChild(glow2);
    });

    // Split Heading Typography Masking Reveal
    const titles = document.querySelectorAll('.slide-title');
    titles.forEach((title) => {
        const text = title.textContent;
        title.innerHTML = `<span class="title-line-mask"><span class="title-line-content">${text}</span></span>`;
    });
    
    // Hide floating back button if loaded inside an iframe (like the Studio Hub modal)
    if (window.self !== window.top) {
        const backBtn = document.getElementById('back-hub-btn');
        if (backBtn) {
            backBtn.style.display = 'none';
        }
    }

    // Direct Image Column Clicks to Advance to Next Page
    const imageSides = document.querySelectorAll('.image-side');
    imageSides.forEach((side) => {
        side.addEventListener('click', () => {
            let nextIdx = currentSlide + 1;
            if (nextIdx >= totalSlides) nextIdx = 0; // Loop back
            scrollToSlide(nextIdx);
            resetAutoplay();
        });
    });
    // Index / TOC Click Links
    const tocItems = document.querySelectorAll('.toc-list li');
    const tocMapping = [2, 3, 4, 5, 6, 8, 9, 10]; // Map Index positions to slide coordinates
    tocItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            if (tocMapping[idx] !== undefined) {
                scrollToSlide(tocMapping[idx]);
                resetAutoplay();
            }
        });
    });
    // Scroll to Specific Slide Index
    function scrollToSlide(index) {
        if (window.innerWidth <= 768) return;
        targetScrollX = index * windowWidth;
        // Clamp bounds
        targetScrollX = Math.max(0, Math.min(targetScrollX, maxScrollX));
    }

    // Keyboard Arrow Keys Support
    window.addEventListener('keydown', (e) => {
        if (window.innerWidth > 768) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                let nextIdx = currentSlide + 1;
                if (nextIdx >= totalSlides) nextIdx = 0;
                scrollToSlide(nextIdx);
                resetAutoplay();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                let prevIdx = currentSlide - 1;
                if (prevIdx < 0) prevIdx = totalSlides - 1;
                scrollToSlide(prevIdx);
                resetAutoplay();
            }
        }
    });

    // Mouse Wheel Scroll Hijack for Desktop Horizontal Exhibition
    let lastUserScrollTime = 0;
    
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 768) return; // Disable scroll hijack on mobile
        
        e.preventDefault(); // Lock default vertical scrolling
        lastUserScrollTime = Date.now();
        resetAutoplay();
        
        // Accumulate scroll input into target scroll destination
        targetScrollX += e.deltaY * 0.95;
        
        // Clamp boundaries
        targetScrollX = Math.max(0, Math.min(targetScrollX, maxScrollX));
    }, { passive: false });

    // Touch Swipe Event Listeners for Mobile/Tablet Swiping
    let touchStartX = 0;
    let touchStartXScroll = 0;
    
    window.addEventListener('touchstart', (e) => {
        if (window.innerWidth <= 768) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartXScroll = targetScrollX;
        resetAutoplay();
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (window.innerWidth <= 768) return;
        const touchCurrentX = e.changedTouches[0].screenX;
        const deltaX = touchStartX - touchCurrentX;
        
        targetScrollX = touchStartXScroll + deltaX * 1.5;
        targetScrollX = Math.max(0, Math.min(targetScrollX, maxScrollX));
    }, { passive: true });

    // LERP Animation Loop (Liquid-smooth rendering loop)
    function animate() {
        if (window.innerWidth > 768) {
            // Apply Linear Interpolation (LERP) for physics-based smoothing
            const lerpFactor = 0.08;
            scrollX += (targetScrollX - scrollX) * lerpFactor;
            
            // Translate the slides container horizontally
            container.style.transform = `translate3d(-${scrollX}px, 0, 0)`;
            
            // Calculate active slide based on scroll coordinates
            const activeIndex = Math.round(scrollX / windowWidth);
            if (activeIndex !== currentSlide && activeIndex >= 0 && activeIndex < totalSlides) {
                currentSlide = activeIndex;
            }
            
            // Calculate scroll velocity for liquid distortion scale
            const velocity = Math.abs(targetScrollX - scrollX);
            const warpScale = Math.min(velocity * 0.18, 65); // Cap warp scale at 65px
            const displacementMap = document.getElementById('displacement-map');
            if (displacementMap) {
                displacementMap.setAttribute('scale', warpScale);
            }
            
            // Update active states and calculate 3D cylindrical and parallax transforms
            slides.forEach((slide, idx) => {
                const slideOffset = idx * windowWidth;
                const relativeX = scrollX - slideOffset; // 0 when centered
                const screenRatio = relativeX / windowWidth; // -1 on left, 1 on right
                
                // Toggle active state for CSS triggers
                if (idx === currentSlide) {
                    if (!slide.classList.contains('active')) {
                        slide.classList.add('active');
                    }
                } else {
                    if (slide.classList.contains('active')) {
                        slide.classList.remove('active');
                    }
                }
                
                // 3D Cylindrical Scroll layout (rotate and recede on coordinates)
                const rotateY = screenRatio * -30; // 30 degrees max rotation
                const translateZ = Math.abs(screenRatio) * -400; // Recede back 400px
                const translateX = screenRatio * -60; // Pull edges closer to close gaps
                const opacity = 1 - Math.min(Math.abs(screenRatio) * 0.7, 0.7); // Fade back elements
                
                slide.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px) translateX(${translateX}px)`;
                slide.style.opacity = opacity;
                
                // Deep Parallax Shifts inside the 3D pane
                const parallaxBgText = slide.querySelector('.parallax-bg');
                if (parallaxBgText) {
                    // Slides slower than slide body
                    parallaxBgText.style.transform = `translate3d(${relativeX * 0.32}px, 0, 0)`;
                }
                
                const parallaxFgBadge = slide.querySelector('.parallax-fg');
                if (parallaxFgBadge) {
                    // Slides faster than slide body
                    parallaxFgBadge.style.transform = `translate3d(${relativeX * -0.15}px, 0, 0)`;
                }
            });
            
            // Update Top Progress Bar width percentage
            const progressBar = document.getElementById('deck-progress-bar');
            if (progressBar && maxScrollX > 0) {
                const percentage = (scrollX / maxScrollX) * 100;
                progressBar.style.width = `${percentage}%`;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start Animation Loop
    requestAnimationFrame(animate);

    // Autoplay Timer (Slow auto-advance drift)
    let autoplayTimer = null;
    
    function startAutoplay() {
        if (window.innerWidth <= 768) return;
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            // Only auto-advance if user hasn't scrolled manually in the last 4.5 seconds
            if (Date.now() - lastUserScrollTime > 4500) {
                let nextIdx = currentSlide + 1;
                if (nextIdx >= totalSlides) nextIdx = 0;
                scrollToSlide(nextIdx);
            }
        }, 8500); // Trigger auto-glide check every 8.5 seconds
    }
    
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }
    
    // Resize Listener to handle fluid viewports
    window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;
        maxScrollX = (totalSlides - 1) * windowWidth;
        
        if (windowWidth <= 768) {
            stopAutoplay();
            // Reset transforms for mobile vertical scroll
            container.style.transform = 'none';
            slides.forEach((slide) => {
                slide.classList.remove('active');
                slide.style.transform = 'none';
                slide.style.opacity = '1';
            });
        } else {
            // Relock positions
            targetScrollX = currentSlide * windowWidth;
            scrollX = targetScrollX;
            startAutoplay();
        }
    });
    
    // Init autoplay
    startAutoplay();
});
