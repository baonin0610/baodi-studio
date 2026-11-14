/* ==========================================================================
   Showcase Hub & Client Forum JS
   Curator State and Forum Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Prevent browser native scroll-anchoring jumps by clearing the hash
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    initCustomCursor();
    initShowcaseFilters();
    initTemplateLinkCopier();
    initScrollReveal();
    initLivePreviewModal();
    initUserGuideModal();
    initUniversal3DTilt();
    initClickRipple();
    initMobileBottomNav();
    initMobileSwipeToast();
    initMobileTouchSwiper();
    initMobileNavDrawer();
    initFacebookFeedInteractions();
    initFacebookPhotoSpotlightAndLightbox();
    initDelegationGalleryCarousel();
    initFacebookPostsCarousel();
    initCardSpotlights();
    initThemePalette();
    initScrollProgressBar();
    initNeuralCanvas();
    initRoleRotator();
    initAnimatedCounters();
    initMagneticButtons();
    try {
        localStorage.removeItem('baodi-view-mode');
        document.documentElement.removeAttribute('data-view-mode');
    } catch (e) {}
});

/**
 * 1. Simple Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    let mouse = { x: 0, y: 0 };
    let cursorCoords = { x: 0, y: 0 };
    const lerpFactor = 0.12;

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

    // Scaling on hover over interactive items
    const interactives = document.querySelectorAll('a, button, select, input, textarea');
    interactives.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
            cursor.style.border = '1px solid var(--accent-color)';
        });
        item.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = '#FFF';
            cursor.style.border = 'none';
        });
    });
}

/**
 * 2. Showcase Grid Filtering Logic
 */
function initShowcaseFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.showcase-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active state to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else if (card.classList.contains(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });
}

/**
 * 4. Template Link Copier
 * Copies the absolute URL of the selected template to the clipboard.
 */
function initTemplateLinkCopier() {
    const copyBtns = document.querySelectorAll('.card-copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const relativePath = btn.getAttribute('data-link');
            if (!relativePath) return;

            // Calculate absolute URL relative to the current browser page location
            const absoluteUrl = new URL(relativePath, window.location.href).href;

            const originalHTML = btn.innerHTML;
            btn.disabled = true;

            try {
                // Copy to clipboard
                await navigator.clipboard.writeText(absoluteUrl);
                btn.innerHTML = '<span>Copied!</span>';
                
                // Add positive flash outline style
                btn.style.borderColor = 'var(--accent-color)';
                btn.style.color = 'var(--accent-color)';
            } catch (err) {
                console.error('Failed to copy link: ', err);
                btn.innerHTML = '<span>Error</span>';
            }

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 1800);
        });
    });
}

/**
 * 6. Scroll Reveal Observer & Dynamic Staggered Classes
 * Programmatically tracks elements and cascades them up smoothly with 3D elevation and blur clearing.
 */
function initScrollReveal() {
    // Stagger child elements in major structural grids and groups
    const staggerContainers = document.querySelectorAll(
        '.founder-credentials-grid, .fb-uni-tabs, .showcase-grid, .delegation-filmstrip-track, .founder-hero-actions'
    );
    staggerContainers.forEach(container => {
        Array.from(container.children).forEach((child, index) => {
            child.classList.add('reveal-on-scroll');
            child.style.setProperty('--stagger-index', index);
        });
    });

    // General structural elements that glide into view
    const generalTargets = document.querySelectorAll(
        '.section-header, .delegation-stage, .delegation-filmstrip-wrapper, .fb-carousel-container, .templates-hub-banner, .showcase-card, .founder-visual-card, .gallery-meta-panel, .fb-profile-banner, .site-footer'
    );
    generalTargets.forEach(el => {
        if (!el.classList.contains('reveal-on-scroll')) {
            el.classList.add('reveal-on-scroll');
        }
    });

    const allRevealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
        allRevealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target); // Stop tracking once revealed
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    allRevealElements.forEach(el => observer.observe(el));
}

/**
 * 7. Live Template Preview Modal & Viewport Switcher
 * Opens an iframe modal for instant template preview and device viewport simulation.
 */
function initLivePreviewModal() {
    const launchBtns = document.querySelectorAll('.card-action-btn');
    const modal = document.getElementById('preview-modal');
    const iframe = document.getElementById('preview-iframe');
    const iframeWrapper = document.getElementById('preview-iframe-wrapper');
    const previewTitle = document.getElementById('preview-title');
    const externalLink = document.getElementById('preview-external-link');
    const closeBtn = document.getElementById('close-preview-modal');
    const viewportBtns = document.querySelectorAll('.viewport-btn');

    if (!modal || !iframe || !closeBtn) return;

    const loader = document.getElementById('iframe-loader');

    launchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('launch-nav-btn')) return;

            e.preventDefault();
            
            const url = btn.getAttribute('href');
            const cardBody = btn.closest('.card-body');
            const titleText = cardBody ? cardBody.querySelector('.card-title').textContent : 'Template Preview';

            // Show loader overlay and hide iframe during loading
            if (loader) loader.classList.add('show');
            iframe.style.opacity = '0';
            
            iframe.src = url;
            previewTitle.textContent = titleText;
            externalLink.href = url;

            // Reset viewport to desktop
            viewportBtns.forEach(b => b.classList.remove('active'));
            const desktopBtn = Array.from(viewportBtns).find(b => b.getAttribute('data-viewport') === 'desktop');
            if (desktopBtn) desktopBtn.classList.add('active');
            
            if (iframeWrapper) {
                iframeWrapper.className = 'preview-iframe-wrapper desktop';
            }

            modal.classList.add('show');

            // Trigger Security Notification Toast inside Preview Modal
            const modalSecToast = document.getElementById('modal-security-toast');
            if (modalSecToast) {
                setTimeout(() => {
                    modalSecToast.classList.add('show');
                }, 400);

                // Auto dismiss toast after 9 seconds
                setTimeout(() => {
                    modalSecToast.classList.remove('show');
                }, 9400);
            }
        });
    });

    const closeSecToastBtn = document.getElementById('close-modal-security-toast');
    const modalSecToast = document.getElementById('modal-security-toast');
    if (closeSecToastBtn && modalSecToast) {
        closeSecToastBtn.addEventListener('click', () => {
            modalSecToast.classList.remove('show');
        });
    }

    // Hide loading spinner and fade in iframe when loaded
    iframe.addEventListener('load', () => {
        if (loader) loader.classList.remove('show');
        iframe.style.opacity = '1';
    });

    // Close preview modal
    function closePreview() {
        modal.classList.remove('show');
        if (loader) loader.classList.remove('show');
        iframe.style.opacity = '0';
        iframe.src = '';
        if (modalSecToast) modalSecToast.classList.remove('show');
    }

    closeBtn.addEventListener('click', closePreview);

    // Close modal if pressing Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closePreview();
        }
    });

    // Viewport controls switcher
    viewportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewportBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const viewport = btn.getAttribute('data-viewport');
            if (iframeWrapper) {
                iframeWrapper.className = `preview-iframe-wrapper ${viewport}`;
            }
        });
    });
}

/**
 * 8. User Guide Modal Controller
 * Handles toggling, tab switching, and backdrop closure of the user guide modal.
 */
function initUserGuideModal() {
    const openBtn = document.getElementById('open-guide-btn');
    const modal = document.getElementById('guide-modal');
    const closeBtn = document.getElementById('close-guide-btn');
    const tabBtns = document.querySelectorAll('.guide-tab-btn');
    const tabContents = document.querySelectorAll('.guide-tab-content');

    if (!modal || !openBtn || !closeBtn) return;

    // Open Modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close Modal
    function closeGuide() {
        modal.classList.remove('show');
    }

    closeBtn.addEventListener('click', closeGuide);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeGuide();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeGuide();
        }
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTabId);

            if (!targetContent) return;

            // Update button states
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content states
            tabContents.forEach(c => c.classList.remove('active'));
            targetContent.classList.add('active');
        });
    });
}

/**
 * 9. Universal 3D Card Tilt with Real-Time Light Glare
 * Provides tactile physics-based 3D rotation, dynamic spotlight positioning, and smooth spring resets
 * across major cards (founder card, credentials, showcase, facebook dispatches, and gallery stage).
 */
function initUniversal3DTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const tiltTargets = document.querySelectorAll(
        '.founder-portrait-card, .cred-item, .showcase-card, .fb-card, .delegation-stage, .filmstrip-thumb'
    );

    tiltTargets.forEach(card => {
        let isHovered = false;
        let rect = null;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            rect = card.getBoundingClientRect();
            card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease';
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            if (!rect) rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle, premium tilt angle
            const maxTilt = card.classList.contains('cred-item') ? 4.5 : 6.5;
            const tiltX = ((centerY - y) / centerY) * maxTilt;
            const tiltY = ((x - centerX) / centerX) * maxTilt;

            card.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            rect = null;
            card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    const card = document.getElementById('hero-tilt-card');
    const glare = card ? card.querySelector('.hero-card-glare') : null;
    const signature = card ? card.querySelector('.hero-card-signature') : null;
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        if (glare) {
            glare.style.opacity = '1';
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        if (glare) glare.style.opacity = '0';
    });

    // Dark-mode toggle easter egg on signature click (Toggles theme locally!)
    if (signature) {
        signature.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.toggle('dark-mode');
        });
    }

    // Automatic Card Shuffling Logic (Swap layers every 3.2 seconds)
    const collageCards = card.querySelectorAll('.collage-card');
    let positions = ['pos-left', 'pos-center', 'pos-right'];
    let shuffleInterval = null;

    function startShuffle() {
        if (shuffleInterval) return;
        shuffleInterval = setInterval(() => {
            positions.push(positions.shift());
            collageCards.forEach((c, idx) => {
                c.classList.remove('pos-left', 'pos-center', 'pos-right');
                c.classList.add(positions[idx]);
            });
        }, 3200);
    }

    function stopShuffle() {
        if (shuffleInterval) {
            clearInterval(shuffleInterval);
            shuffleInterval = null;
        }
    }

    // Start shuffling initially
    startShuffle();

    // Pause on user interaction to allow 3D tilt inspections
    card.addEventListener('mouseenter', stopShuffle);
    card.addEventListener('mouseleave', startShuffle);
    card.addEventListener('touchstart', stopShuffle, { passive: true });
    card.addEventListener('touchend', startShuffle, { passive: true });
}

/**
 * 10. Comprehensive Navbar & Mobile Bottom Nav ScrollSpy
 * Accurately tracks viewport position and highlights active nav link across desktop & mobile.
 */
function initMobileBottomNav() {
    const desktopNavLinks = document.querySelectorAll('.site-header .nav-links .nav-link[href^="#"]');
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    const mobileNavItems = bottomNav ? bottomNav.querySelectorAll('.mobile-nav-item[href^="#"], .mobile-nav-item[data-target]') : [];
    const drawerLinks = document.querySelectorAll('.mobile-nav-drawer .drawer-link[href^="#"]');
    const logoLink = document.querySelector('.site-header .logo');

    const sections = [
        { id: 'about-developer', altId: 'hero-section', el: document.getElementById('hero-section') || document.getElementById('about-developer') },
        { id: 'delegation-gallery', altId: 'delegation-gallery', el: document.getElementById('delegation-gallery') },
        { id: 'facebook-feed', altId: 'facebook-feed', el: document.getElementById('facebook-feed') }
    ].filter(s => s.el);

    if (sections.length === 0) return;

    // Smooth scroll navigation click handler
    function scrollToSection(targetId) {
        let targetEl = document.getElementById(targetId);
        if (targetId === 'about-developer' || targetId === 'hero-section') {
            targetEl = document.getElementById('hero-section') || document.getElementById('about-developer');
        }
        if (!targetEl) return;

        const headerOffset = 75;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        });

        // Close mobile drawer if open
        const drawer = document.getElementById('mobile-nav-drawer');
        const overlay = document.getElementById('mobile-drawer-overlay');
        if (drawer?.classList.contains('active')) {
            drawer.classList.remove('active');
            overlay?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Attach click to desktop internal links & CTA button
    const allHeaderNavLinks = document.querySelectorAll('.site-header .nav-links .nav-link[href^="#"], .site-header .launch-nav-btn[href^="#"]');
    allHeaderNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.replace('#', ''));
            }
        });
    });

    // Attach click to mobile bottom nav links
    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('data-target') || (item.getAttribute('href') || '').replace('#', '');
            if (targetId && !targetId.includes('.html')) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        });
    });

    // Attach click to mobile drawer links
    drawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.replace('#', ''));
            }
        });
    });

    // Also attach to header logo to return to top smoothly
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ScrollSpy: Calculate which section currently commands the viewport
    function updateScrollSpy() {
        const headerOffset = 90;
        let activeId = 'about-developer';

        // Check if user has scrolled near the bottom of the page
        const isNearBottom = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 80);

        if (isNearBottom) {
            activeId = sections[sections.length - 1].id;
        } else {
            // Check from bottom-most section upward to find the section entering the viewport
            const triggerOffset = headerOffset + 80;
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const rect = section.el.getBoundingClientRect();
                if (rect.top <= triggerOffset) {
                    activeId = section.id;
                    break;
                }
            }
        }

        // 1. Update Desktop Header Links
        desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = href.replace('#', '');
            const isMatch = (target === activeId) ||
                            (activeId === 'about-developer' && (target === 'hero-section' || target === 'about-developer'));
            link.classList.toggle('active', isMatch);
        });

        // 2. Update Mobile Bottom Nav Links
        mobileNavItems.forEach(item => {
            const target = item.getAttribute('data-target') || (item.getAttribute('href') || '').replace('#', '');
            const isMatch = (target === activeId) ||
                            (activeId === 'about-developer' && (target === 'hero-section' || target === 'about-developer'));
            item.classList.toggle('active', isMatch);
        });

        // 3. Update Mobile Drawer Links
        drawerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = href.replace('#', '');
            const isMatch = (target === activeId) ||
                            (activeId === 'about-developer' && (target === 'hero-section' || target === 'about-developer'));
            link.classList.toggle('active', isMatch);
        });

        // 4. Update Floating Scroll Down Indicator visibility
        if (floatingScrollBtn) {
            const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
            const shouldHide = currentScrollY > 100;
            floatingScrollBtn.classList.toggle('is-hidden', shouldHide);
        }
    }

    // Throttled scroll listener using requestAnimationFrame for 60fps performance
    let isScrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                updateScrollSpy();
                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }, { passive: true });

    // Run on initial page load
    updateScrollSpy();
}

/**
 * 11. Mobile Swipe Guide Toast
 * Displays a floating help toast when the showcase gallery enters screen space,
 * and immediately hides it as soon as the user swipe-scrolls the grid container.
 */
function initMobileSwipeToast() {
    const showcaseGrid = document.querySelector('.showcase-grid');
    const swipeToast = document.getElementById('swipe-guide-toast');
    if (!showcaseGrid || !swipeToast) return;

    const showcaseSection = document.getElementById('showcase');
    
    // Check if the toast has already been dismissed this session
    const isDismissed = sessionStorage.getItem('swipe-toast-dismissed') === 'true';

    if (showcaseSection && !isDismissed) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger only on mobile screens
                if (entry.isIntersecting && window.innerWidth <= 768) {
                    // Slight delay for elegant slide in
                    setTimeout(() => {
                        if (sessionStorage.getItem('swipe-toast-dismissed') !== 'true') {
                            swipeToast.classList.add('show');
                        }
                    }, 800);
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        swipeToast.classList.remove('show');
                    }, 5800);
                    
                    // Stop observing once triggered once
                    observer.unobserve(showcaseSection);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        observer.observe(showcaseSection);
    }

    // Dismiss toast instantly upon user swiping/scrolling the grid
    showcaseGrid.addEventListener('scroll', () => {
        if (swipeToast.classList.contains('show')) {
            swipeToast.classList.remove('show');
        }
        sessionStorage.setItem('swipe-toast-dismissed', 'true');
    }, { passive: true });
}

/**
 * 12. Fluid Touch Gesture Swiper for Mobile Showcase
 * Captures swipe velocity/direction on mobile touch screens to provide friction-free swipes.
 */
function initMobileTouchSwiper() {
    const grid = document.querySelector('.showcase-grid');
    if (!grid) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let startTime;
    let touchStartX;
    let touchStartY;
    let isScrollingMode = null; // 'horizontal' or 'vertical'

    grid.addEventListener('touchstart', (e) => {
        if (window.innerWidth > 768) return; // Only process on mobile viewports
        
        isDown = true;
        // Temporarily clear browser snap styling to allow raw, buttery drag motion
        grid.style.scrollSnapType = 'none';
        
        startX = e.touches[0].pageX - grid.offsetLeft;
        touchStartX = e.touches[0].pageX;
        touchStartY = e.touches[0].pageY;
        scrollLeft = grid.scrollLeft;
        startTime = Date.now();
        isScrollingMode = null;
    }, { passive: true });

    grid.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        
        const currentX = e.touches[0].pageX;
        const currentY = e.touches[0].pageY;
        const diffX = Math.abs(currentX - touchStartX);
        const diffY = Math.abs(currentY - touchStartY);

        // Detect direction on first move: if vertical scrolling, release lock and let browser scroll the page
        if (isScrollingMode === null) {
            if (diffY > diffX && diffY > 6) {
                isScrollingMode = 'vertical';
                isDown = false;
                grid.style.scrollSnapType = 'x mandatory';
                return;
            } else if (diffX > diffY && diffX > 6) {
                isScrollingMode = 'horizontal';
            }
        }

        if (isScrollingMode === 'horizontal') {
            // CRITICAL MOBILE UX FIX: Prevent the parent page from shifting/scrolling vertically during card swipes
            if (e.cancelable) {
                e.preventDefault();
            }
            
            // Apply slight multiplier for super responsive dragging
            const x = currentX - grid.offsetLeft;
            const walk = (x - startX) * 1.15;
            grid.scrollLeft = scrollLeft - walk;
        }
    }, { passive: false });

    grid.addEventListener('touchend', (e) => {
        if (!isDown) return;
        isDown = false;

        // Restore mandatory scroll-snap to snap nicely into place
        grid.style.scrollSnapType = 'x mandatory';

        if (isScrollingMode !== 'horizontal') return;

        const endX = e.changedTouches[0].pageX - grid.offsetLeft;
        const dist = endX - startX;
        const timeElapsed = Date.now() - startTime;

        const cards = grid.querySelectorAll('.showcase-card');
        if (!cards.length) return;

        const cardWidth = cards[0].offsetWidth;
        const gap = 19.2; // 1.2rem gap is ~19.2px
        const step = cardWidth + gap;

        // Current scroll center index calculation
        const currentIndex = Math.round(grid.scrollLeft / step);

        // Swipe metrics
        const isFlick = timeElapsed < 250 && Math.abs(dist) > 20;
        const isSignificantDrag = Math.abs(dist) > (cardWidth * 0.15); // Swiped more than 15% of card width

        let targetIndex = currentIndex;
        if (isFlick || isSignificantDrag) {
            if (dist < 0) {
                // Swiped left (dragged right-to-left) -> Next card
                targetIndex = Math.min(currentIndex + 1, cards.length - 1);
            } else {
                // Swiped right (dragged left-to-right) -> Previous card
                targetIndex = Math.max(currentIndex - 1, 0);
            }
        }

        const targetScrollLeft = targetIndex * step;
        grid.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
    });

    // Carousel navigation buttons logic
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    if (prevBtn && nextBtn) {
        const getScrollMetrics = () => {
            const cards = grid.querySelectorAll('.showcase-card');
            if (!cards.length) return { step: 0, length: 0 };
            const cardWidth = cards[0].offsetWidth;
            const gap = 19.2; // 1.2rem
            return { step: cardWidth + gap, length: cards.length };
        };

        const updateNavButtons = () => {
            const { step, length } = getScrollMetrics();
            if (!step || length <= 1) {
                prevBtn.style.opacity = '0';
                return;
            }

            const currentIndex = Math.round(grid.scrollLeft / step);

            // Left arrow: Always visible, just faded out/disabled at card 0
            if (currentIndex === 0) {
                prevBtn.style.opacity = '0.15';
                prevBtn.style.pointerEvents = 'none';
            } else {
                prevBtn.style.opacity = '0.85';
                prevBtn.style.pointerEvents = 'auto';
            }

            // Right arrow: Always visible, just faded out/disabled at last card
            if (currentIndex === length - 1) {
                nextBtn.style.opacity = '0.15';
                nextBtn.style.pointerEvents = 'none';
            } else {
                nextBtn.style.opacity = '0.85';
                nextBtn.style.pointerEvents = 'auto';
            }
        };

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { step } = getScrollMetrics();
            if (!step) return;
            
            const currentIndex = Math.round(grid.scrollLeft / step);
            const targetIndex = Math.max(currentIndex - 1, 0);
            grid.scrollTo({
                left: targetIndex * step,
                behavior: 'smooth'
            });
            
            // Set guide toast as read
            sessionStorage.setItem('swipe-toast-dismissed', 'true');
            const swipeToast = document.getElementById('swipe-guide-toast');
            if (swipeToast) swipeToast.classList.remove('show');
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { step, length } = getScrollMetrics();
            if (!step) return;

            const currentIndex = Math.round(grid.scrollLeft / step);
            const targetIndex = Math.min(currentIndex + 1, length - 1);
            grid.scrollTo({
                left: targetIndex * step,
                behavior: 'smooth'
            });

            // Set guide toast as read
            sessionStorage.setItem('swipe-toast-dismissed', 'true');
            const swipeToast = document.getElementById('swipe-guide-toast');
            if (swipeToast) swipeToast.classList.remove('show');
        });

        // Listen to scroll events to update button opacities dynamically
        grid.addEventListener('scroll', updateNavButtons, { passive: true });
        
        // Slight delay on start to allow DOM measurements to complete
        setTimeout(updateNavButtons, 200);
    }
}

// Instant Launch Prefetch Engine (Pre-caches client website on mouse hover / touch start)
function initInstantLaunchPrefetch() {
    const prefetchedUrls = new Set();

    function prefetchUrl(url) {
        if (!url || prefetchedUrls.has(url)) return;
        prefetchedUrls.add(url);

        const linkPrefetch = document.createElement('link');
        linkPrefetch.rel = 'prefetch';
        linkPrefetch.href = url;
        document.head.appendChild(linkPrefetch);

        const linkPrerender = document.createElement('link');
        linkPrerender.rel = 'prerender';
        linkPrerender.href = url;
        document.head.appendChild(linkPrerender);
    }

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a[target="_blank"], .showcase-card');
        if (target) {
            const link = target.tagName === 'A' ? target : target.querySelector('a[target="_blank"]');
            if (link && link.href) {
                prefetchUrl(link.href);
            }
        }
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
        const target = e.target.closest('a[target="_blank"], .showcase-card');
        if (target) {
            const link = target.tagName === 'A' ? target : target.querySelector('a[target="_blank"]');
            if (link && link.href) {
                prefetchUrl(link.href);
            }
        }
    }, { passive: true });
}

// Ensure instant launch prefetch initializes
document.addEventListener('DOMContentLoaded', () => {
    initInstantLaunchPrefetch();
});


/**
 * 13. Mobile Navigation Drawer Toggle & Interactions
 */
function initMobileNavDrawer() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const closeBtn = document.getElementById('close-drawer-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const drawerGuideBtn = document.getElementById('drawer-guide-btn');
    const mobileGuideBtn = document.getElementById('mobile-guide-btn');
    const mainGuideBtn = document.getElementById('open-guide-btn');

    if (!toggleBtn || !drawer || !overlay) return;

    function openDrawer() {
        toggleBtn.classList.add('active');
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        toggleBtn.classList.remove('active');
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
        if (drawer.classList.contains('active')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Close when clicking any nav link in drawer
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            closeDrawer();
        }
    });

    // Mobile guide buttons trigger the same guide modal
    if (drawerGuideBtn && mainGuideBtn) {
        drawerGuideBtn.addEventListener('click', () => {
            closeDrawer();
            mainGuideBtn.click();
        });
    }

    if (mobileGuideBtn && mainGuideBtn) {
        mobileGuideBtn.addEventListener('click', () => {
            mainGuideBtn.click();
        });
    }
}

/**
 * 14. Facebook Feed Card Interactions (Likes & Reactions)
 */
function initFacebookFeedInteractions() {
    const likeButtons = document.querySelectorAll('.fb-action-btn.like-btn');
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.fb-card');
            if (!card) return;
            
            const countEl = card.querySelector('.reaction-count');
            const labelEl = btn.querySelector('.btn-label');
            const isLiked = btn.classList.toggle('liked');
            const baseLikes = parseInt(countEl?.getAttribute('data-base-likes') || '100', 10);
            
            if (countEl && labelEl) {
                if (isLiked) {
                    countEl.textContent = (baseLikes + 1).toString();
                    labelEl.textContent = 'Liked';
                } else {
                    countEl.textContent = baseLikes.toString();
                    labelEl.textContent = 'Like';
                }
            }
        });
    });
}

/**
 * 15. Facebook Photo Spotlight & High-Resolution Lightbox Modal
 */
function initFacebookPhotoSpotlightAndLightbox() {
    const modal = document.getElementById('image-lightbox-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('lightbox-close-btn');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxFbLink = document.getElementById('lightbox-fb-link');
    const backdrop = modal.querySelector('.lightbox-backdrop');

    function openLightbox(imgSrc, title, desc, fbUrl) {
        if (!lightboxImg) return;
        lightboxImg.src = imgSrc;
        lightboxImg.alt = title || 'High-Resolution Delegation Photo';
        if (lightboxTitle) lightboxTitle.textContent = title || 'Official Delegation Dispatch';
        if (lightboxDesc) lightboxDesc.textContent = desc || '';
        
        if (lightboxFbLink) {
            if (fbUrl && fbUrl !== '#') {
                lightboxFbLink.href = fbUrl;
                lightboxFbLink.style.display = 'inline-flex';
            } else {
                lightboxFbLink.style.display = 'none';
            }
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // Expose globally so hero background slider can open lightbox
    window.openImageLightbox = openLightbox;

    function closeLightbox() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) {
            lightboxImg.src = '';
        }
    }

    // 1. Spotlight thumbnails click
    const spotlightThumbs = document.querySelectorAll('.spotlight-thumb');
    spotlightThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const imgSrc = thumb.getAttribute('data-img');
            const title = thumb.getAttribute('data-title');
            const desc = thumb.getAttribute('data-desc');
            const targetId = thumb.getAttribute('data-post-target');
            const targetCard = targetId ? document.querySelector(`.fb-card[data-post-id="${targetId}"]`) : null;
            const fbUrl = targetCard?.querySelector('.fb-origin-link')?.getAttribute('href') || '#';
            
            if (imgSrc) {
                openLightbox(imgSrc, title, desc, fbUrl);
            }
            if (targetId && typeof window.jumpToFacebookCard === 'function') {
                window.jumpToFacebookCard(targetId);
            }
        });
    });

    // 2. Facebook Post card media column click
    const cardMediaCols = document.querySelectorAll('.fb-card-media-col');
    cardMediaCols.forEach(mediaCol => {
        mediaCol.addEventListener('click', () => {
            const card = mediaCol.closest('.fb-card');
            if (!card) return;
            const img = mediaCol.querySelector('img');
            const tagText = mediaCol.querySelector('.fb-media-tag span')?.textContent?.trim() || '';
            const postTitle = card.querySelector('.fb-post-text strong')?.textContent?.trim() || 'Official Delegation Dispatch';
            const fbUrl = card.querySelector('.fb-origin-link')?.getAttribute('href') || '#';
            
            if (img) {
                openLightbox(img.src, postTitle, tagText, fbUrl);
            }
        });
    });

    // 3. Close controls
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    // 4. Keyboard ESC to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * 16. Dedicated University Delegation Visual Gallery Carousel
 * (Auto-transitions, Interactive Thumbnails, Progress Bars, Lightbox & Touch Swiping)
 */
function initDelegationGalleryCarousel() {
    const container = document.getElementById('delegation-carousel-container');
    if (!container) return;

    const slides = Array.from(container.querySelectorAll('.delegation-slide'));
    const thumbs = Array.from(container.querySelectorAll('.delegation-thumb'));
    const counterEl = document.getElementById('delegation-counter');
    const prevBtn = document.getElementById('delegation-prev-btn');
    const nextBtn = document.getElementById('delegation-next-btn');

    // Separate Info Panel Elements (outside and below image)
    const tagEl = document.getElementById('delegation-info-tag');
    const headingEl = document.getElementById('delegation-info-heading');
    const descEl = document.getElementById('delegation-info-desc');
    const fbLinkEl = document.getElementById('delegation-fb-link');
    const zoomBtn = document.getElementById('delegation-zoom-btn');

    if (slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;
    const slideDuration = 4800; // 4.8 seconds per slide

    function updateSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;

        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        thumbs.forEach((thumb, idx) => {
            const bar = thumb.querySelector('.thumb-bar');
            if (idx === currentIndex) {
                thumb.classList.add('active');
                if (bar) {
                    bar.style.transition = 'none';
                    bar.style.width = '0%';
                    void bar.offsetWidth; // Force reflow
                    bar.style.transition = `width ${slideDuration}ms linear`;
                    bar.style.width = '100%';
                }
            } else {
                thumb.classList.remove('active');
                if (bar) {
                    bar.style.transition = 'none';
                    bar.style.width = '0%';
                }
            }
        });

        if (counterEl) {
            counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
        }

        // Dynamically update the separate info panel below the image
        const activeSlide = slides[currentIndex];
        if (activeSlide) {
            const title = activeSlide.getAttribute('data-title') || '';
            const tag = activeSlide.getAttribute('data-tag') || '';
            const desc = activeSlide.getAttribute('data-desc') || '';
            const fbUrl = activeSlide.getAttribute('data-fb-url') || '#';

            if (tagEl) tagEl.textContent = tag;
            if (headingEl) headingEl.textContent = title;
            if (descEl) descEl.textContent = desc;
            if (fbLinkEl) {
                if (fbUrl && fbUrl !== '#') {
                    fbLinkEl.href = fbUrl;
                    fbLinkEl.style.display = 'inline-flex';
                } else {
                    fbLinkEl.style.display = 'none';
                }
            }
        }
    }

    function nextSlide() {
        updateSlide(currentIndex + 1);
    }

    function prevSlide() {
        updateSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        const currentThumb = thumbs[currentIndex];
        const bar = currentThumb?.querySelector('.thumb-bar');
        if (bar) {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            void bar.offsetWidth;
            bar.style.transition = `width ${slideDuration}ms linear`;
            bar.style.width = '100%';
        }
        autoPlayTimer = setInterval(nextSlide, slideDuration);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
        const currentThumb = thumbs[currentIndex];
        const bar = currentThumb?.querySelector('.thumb-bar');
        if (bar) {
            const computedWidth = window.getComputedStyle(bar).width;
            bar.style.transition = 'none';
            bar.style.width = computedWidth;
        }
    }

    // Attach Next / Prev Buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
            startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
            startAutoPlay();
        });
    }

    // Attach Click on Thumbnails
    thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSlide(idx);
            startAutoPlay();
        });
    });

    // Pause on hover over carousel container
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // Zoom Button in Info Panel triggers Fullscreen Lightbox
    if (zoomBtn) {
        zoomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const activeSlide = slides[currentIndex];
            if (!activeSlide) return;
            const img = activeSlide.querySelector('img');
            const title = activeSlide.getAttribute('data-title');
            const desc = activeSlide.getAttribute('data-desc');
            const fbUrl = activeSlide.getAttribute('data-fb-url');
            if (window.openImageLightbox && img) {
                window.openImageLightbox(img.src, title, desc, fbUrl);
            }
        });
    }

    // Clicking directly on the clean photo also opens Fullscreen Lightbox
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        const title = slide.getAttribute('data-title');
        const desc = slide.getAttribute('data-desc');
        const fbUrl = slide.getAttribute('data-fb-url');

        if (img) {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.openImageLightbox) {
                    window.openImageLightbox(img.src, title, desc, fbUrl);
                }
            });
        }
    });

    // Touch Swipe Support for Mobile & Tablets
    let touchStartX = 0;
    let touchEndX = 0;
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].screenX;
        }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 45) {
                if (diff < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoPlay();
            }
        }
    }, { passive: true });

    // Initialize first slide (only auto-play when user is viewing gallery)
    updateSlide(0);
    if ('IntersectionObserver' in window) {
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        }, { threshold: 0.2 });
        galleryObserver.observe(container);
    } else {
        startAutoPlay();
    }
}

/**
 * 17. Facebook Feed Posts Carousel with University Tabs
 */
function initFacebookPostsCarousel() {
    const container = document.getElementById('fb-carousel-container');
    if (!container) return;

    const tabs = container.querySelectorAll('.fb-uni-tab');
    const cards = container.querySelectorAll('.fb-cards-viewport .fb-card');
    const prevBtn = document.getElementById('fb-prev-btn');
    const nextBtn = document.getElementById('fb-next-btn');
    const counterCurrent = document.getElementById('fb-counter-current');
    const dots = container.querySelectorAll('.fb-dot');
    const viewport = document.getElementById('fb-cards-viewport');
    const tabsContainer = document.getElementById('fb-uni-tabs');

    if (!cards.length) return;

    let currentIndex = 0;
    let isTransitioning = false;

    function goToCard(index, direction) {
        if (isTransitioning) return;
        const total = cards.length;
        const normalizedIndex = ((index % total) + total) % total;

        if (normalizedIndex === currentIndex && cards[currentIndex]?.classList.contains('active')) return;

        isTransitioning = true;
        const actualDirection = direction || (normalizedIndex > currentIndex ? 'next' : 'prev');

        // Current active card
        const currentCard = cards[currentIndex];
        if (currentCard) {
            currentCard.classList.remove('active', 'slide-prev');
        }

        // New active card
        const newCard = cards[normalizedIndex];
        if (newCard) {
            newCard.classList.remove('slide-prev');
            if (actualDirection === 'prev') {
                newCard.classList.add('slide-prev');
            }
            newCard.classList.add('active');
        }

        // Update university tabs state
        tabs.forEach((tab, i) => {
            const isActive = i === normalizedIndex;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Smooth horizontal scrolling within tab list ONLY (never scrolls parent window)
        if (tabsContainer && tabsContainer.scrollWidth > tabsContainer.clientWidth) {
            const activeTab = tabs[normalizedIndex];
            if (activeTab) {
                const targetLeft = activeTab.offsetLeft - (tabsContainer.clientWidth / 2) + (activeTab.offsetWidth / 2);
                tabsContainer.scrollTo({ left: targetLeft, behavior: 'smooth' });
            }
        }

        // Update slide counter
        if (counterCurrent) {
            counterCurrent.textContent = String(normalizedIndex + 1).padStart(2, '0');
        }

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === normalizedIndex);
        });

        currentIndex = normalizedIndex;

        setTimeout(() => {
            isTransitioning = false;
        }, 380);
    }

    // Prev / Next Arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToCard(currentIndex - 1, 'prev');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToCard(currentIndex + 1, 'next');
        });
    }

    // Tabs Click
    tabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIdx = parseInt(tab.getAttribute('data-index') || '0', 10);
            goToCard(targetIdx, targetIdx >= currentIndex ? 'next' : 'prev');
        });
    });

    // Indicator Dots Click
    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIdx = parseInt(dot.getAttribute('data-index') || '0', 10);
            goToCard(targetIdx, targetIdx >= currentIndex ? 'next' : 'prev');
        });
    });

    // Touch Swipe Navigation for Mobile/Tablet Screens
    let touchStartX = 0;
    let touchStartY = 0;
    if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const diffX = e.changedTouches[0].clientX - touchStartX;
                const diffY = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX < 0) {
                        goToCard(currentIndex + 1, 'next');
                    } else {
                        goToCard(currentIndex - 1, 'prev');
                    }
                }
            }
        }, { passive: true });
    }

    // Keyboard Arrow Keys
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToCard(currentIndex - 1, 'prev');
        } else if (e.key === 'ArrowRight') {
            goToCard(currentIndex + 1, 'next');
        }
    });

    // Global jump function for links/spotlight buttons (DO NOT scroll window)
    window.jumpToFacebookCard = function(target) {
        let targetIndex = -1;
        if (typeof target === 'number') {
            targetIndex = target;
        } else if (typeof target === 'string') {
            const cleaned = target.replace('#', '');
            cards.forEach((card, idx) => {
                if (card.getAttribute('data-post-id') === cleaned || card.id === cleaned) {
                    targetIndex = idx;
                }
            });
        }
        if (targetIndex >= 0 && targetIndex < cards.length) {
            goToCard(targetIndex, targetIndex >= currentIndex ? 'next' : 'prev');
        }
    };
}

/**
 * 15. Modern Luxury Mouse-Tracking Spotlight Glow
 * Radiates a soft golden spotlight on card surfaces following cursor movement.
 */
function initCardSpotlights() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.has-spotlight');
    cards.forEach(card => {
        let isMoving = false;
        card.addEventListener('mousemove', (e) => {
            if (!isMoving) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    isMoving = false;
                });
                isMoving = true;
            }
        });
    });
}

/**
 * 16. Studio Color Palette Switcher
 * Manages four luxury themes: Obsidian Gold, Warm Sand, Slate Navy, Emerald Atelier.
 * Supports desktop dropdown, mobile header quick-cycler, and drawer theme buttons.
 */
function initThemePalette() {
    const THEMES = ['obsidian', 'warm-editorial', 'cyber-slate', 'atelier-emerald'];
    const themeButtons = document.querySelectorAll('[data-theme-val]');
    const triggerBtn = document.getElementById('palette-trigger-btn');
    const dropdown = document.getElementById('palette-dropdown');
    const mobileBtn = document.getElementById('mobile-palette-btn');

    function applyTheme(theme) {
        if (!THEMES.includes(theme)) {
            theme = 'obsidian';
        }
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('baodi-theme', theme);
        } catch (e) {
            console.warn('Could not persist theme to localStorage', e);
        }

        // Update active class on all buttons across header & mobile drawer
        themeButtons.forEach(btn => {
            const val = btn.getAttribute('data-theme-val');
            btn.classList.toggle('active', val === theme);
        });

        // Update accessibility
        if (triggerBtn) {
            triggerBtn.setAttribute('aria-label', `Studio Theme: ${theme}`);
        }
    }

    // Initialize from storage or default
    let savedTheme = 'obsidian';
    try {
        savedTheme = localStorage.getItem('baodi-theme') || 'obsidian';
    } catch (e) {
        savedTheme = 'obsidian';
    }
    applyTheme(savedTheme);

    // Attach click listeners to all theme option buttons (desktop + drawer)
    themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const val = btn.getAttribute('data-theme-val');
            applyTheme(val);
            if (dropdown) {
                dropdown.classList.remove('show');
                if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Desktop Dropdown Toggle
    if (triggerBtn && dropdown) {
        triggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('show');
            triggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#theme-palette-wrapper')) {
                dropdown.classList.remove('show');
                triggerBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                triggerBtn.setAttribute('aria-expanded', 'false');
                triggerBtn.focus();
            }
        });
    }

    // Mobile Header Quick Toggle (cycles through the 4 themes sequentially)
    if (mobileBtn) {
        mobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = document.documentElement.getAttribute('data-theme') || 'obsidian';
            const currentIndex = THEMES.indexOf(current);
            const nextIndex = (currentIndex + 1) % THEMES.length;
            applyTheme(THEMES[nextIndex]);

            // Gentle tactile vibration feedback on supporting devices
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
    }
}

/**
 * 17. Global Top Scroll Progress Bar
 * Fills a luminous hairline bar at the viewport top corresponding to page scroll position.
 */
function initScrollProgressBar() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const total = document.documentElement.scrollHeight - window.innerHeight;
                if (total > 0) {
                    const progress = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
                    bar.style.width = `${progress}%`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * 18. Interactive AI Neural Constellation Canvas
 * Ambient star-like neural particles that drift and connect organically, responding dynamically
 * to mouse cursor movement, synaptic lines, and theme accent colors.
 */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let animationFrameId = null;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initParticles();
    }

    function initParticles() {
        const count = width < 768 ? 36 : 72;
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 1.6 + 1.2,
                baseAlpha: Math.random() * 0.45 + 0.35
            });
        }
    }

    function getAccentRgb() {
        const theme = document.documentElement.getAttribute('data-theme') || 'obsidian';
        switch (theme) {
            case 'warm-editorial':
                return { r: 140, g: 124, b: 109 };
            case 'cyber-slate':
                return { r: 56, g: 189, b: 248 };
            case 'atelier-emerald':
                return { r: 16, g: 185, b: 129 };
            case 'obsidian':
            default:
                return { r: 212, g: 175, b: 55 };
        }
    }

    function animate() {
        if (document.hidden) {
            animationFrameId = requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, width, height);
        const rgb = getAccentRgb();
        const maxDist = width < 768 ? 100 : 135;
        const mouseDist = 160;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Soft friction decay to maintain organic ambient drift
            if (Math.abs(p.vx) > 0.5) p.vx *= 0.96;
            if (Math.abs(p.vy) > 0.5) p.vy *= 0.96;

            // Bounce off boundaries
            if (p.x < 0 || p.x > width) p.vx = -p.vx;
            if (p.y < 0 || p.y > height) p.vy = -p.vy;

            // Interactive mouse connection and soft repulsion
            if (mouse.active) {
                const dxM = p.x - mouse.x;
                const dyM = p.y - mouse.y;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);
                if (distM < mouseDist) {
                    const factor = 1 - distM / mouseDist;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${factor * 0.4})`;
                    ctx.lineWidth = 1.1;
                    ctx.stroke();

                    // Soft deflection away from mouse
                    p.x += (dxM / distM) * factor * 0.75;
                    p.y += (dyM / distM) * factor * 0.75;
                }
            }

            // Draw particle node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.baseAlpha})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.65)`;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Connect neighboring particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.28;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Kinetic pointerdown burst: Clicking pushes nearby particles outwards
    window.addEventListener('pointerdown', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        particles.forEach(p => {
            const dx = p.x - clickX;
            const dy = p.y - clickY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 260 && dist > 0) {
                const force = (1 - dist / 260) * 5;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
        });
    }, { passive: true });

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    resize();
    animate();
}

/**
 * 19. Kinetic Role Rotator
 * Smooth vertical slide transition cycling through Duy's professional titles.
 */
function initRoleRotator() {
    const container = document.getElementById('role-rotator');
    if (!container) return;
    const items = container.querySelectorAll('.role-rotator-item');
    if (items.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
        const prev = items[currentIndex];
        prev.classList.remove('active');
        prev.classList.add('exit');

        currentIndex = (currentIndex + 1) % items.length;
        const next = items[currentIndex];
        next.classList.remove('exit');
        next.classList.add('active');

        setTimeout(() => {
            prev.classList.remove('exit');
        }, 600);
    }, 2800);
}

/**
 * 20. Animated Stat Number Counters
 * Dynamically counts numbers up when scrolled into view.
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter-num');
    if (!counters.length) return;

    function countUp(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        const duration = 1500;
        const start = target > 2000 ? target - 10 : 0;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
                el.classList.add('counter-finished');
            }
        }
        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(c => observer.observe(c));
    } else {
        counters.forEach(c => countUp(c));
    }
}

/**
 * 21. Magnetic Button Physics Pull
 * Subtly attracts CTA buttons and pills towards the cursor on hover with spring recovery.
 */
function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const magneticTargets = document.querySelectorAll(
        '.primary-btn, .secondary-btn, .social-icon-btn, .palette-trigger-btn, .guide-nav-btn'
    );

    magneticTargets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
            btn.style.transition = 'transform 0.1s ease-out';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });
}

/**
 * 22. Interactive Click Energy Shockwave
 * Emits an expanding glowing cybernetic shockwave at pointer click coordinates.
 */
function initClickRipple() {
    document.addEventListener('pointerdown', (e) => {
        const wave = document.createElement('div');
        wave.className = 'click-energy-wave';
        wave.style.left = `${e.clientX}px`;
        wave.style.top = `${e.clientY}px`;
        document.body.appendChild(wave);

        wave.addEventListener('animationend', () => {
            wave.remove();
        });
    }, { passive: true });
}


