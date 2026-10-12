/* ==========================================================================
   Showcase Hub & Client Forum JS
   Curator State and Forum Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    initCustomCursor();
    initShowcaseFilters();
    initForumEngine();
    initTemplateLinkCopier();
    initZaloToast();
    initScrollReveal();
    initLivePreviewModal();
    initUserGuideModal();
    initHeroCardTilt();
    initMobileBottomNav();
    initMobileSwipeToast();
    initMobileTouchSwiper();
    initHomepageFeaturedStories();
    initMobileNavDrawer();
    initFacebookFeedInteractions();
    initFacebookPhotoSpotlightAndLightbox();
    initDelegationGalleryCarousel();
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
 * 3. Client Forum System
 * Manages loading preloaded comments, reading from localStorage, and writing new ones.
 */
function initForumEngine() {
    const form = document.getElementById('forum-form');
    const commentList = document.getElementById('comment-list');
    const countBadge = document.getElementById('comment-count');
    
    // Default preloaded comments data structure
    const defaultComments = [
        {
            name: "Trung Nguyen",
            tag: "Client Reviewer",
            date: "Today, 10:20 AM",
            ref: "Linh Nguyen — Editorial Photographer (Template 1)",
            message: "Photography template #1 is absolutely stunning and elegant! The Alabaster tone combined with natural imagery looks extremely premium, capturing real artistry rather than industrial feel. The aperture reveal and View hover work beautifully."
        },
        {
            name: "Maria Anders",
            tag: "Creative Director",
            date: "Yesterday, 4:15 PM",
            ref: "Alex Nguyen — Creative Developer (Template 2)",
            message: "Excited for the Creative Developer theme! The combination of dark backgrounds with neon lines and dynamic particle fields is exactly what we need to show our technical and creative side. Please add a dark-light theme toggle for it if possible."
        },
        {
            name: "Khanh Do",
            tag: "Interior Designer",
            date: "Yesterday, 11:05 AM",
            ref: "Linh Nguyen — Editorial Photographer (Template 1)",
            message: "Can we customize template #1 into an interior design showcase? I feel its asymmetrical grid layout and 3:4 image crops fit space design perfectly."
        }
    ];

    // Load comments from localStorage or load default ones
    let loadedComments = JSON.parse(localStorage.getItem('baodi_comments'));
    if (!loadedComments) {
        loadedComments = defaultComments;
        localStorage.setItem('baodi_comments', JSON.stringify(loadedComments));
    }

    // Render list of comments
    function renderComments() {
        commentList.innerHTML = '';
        loadedComments.forEach(comment => {
            const card = createCommentCard(comment);
            commentList.appendChild(card);
        });
        countBadge.textContent = loadedComments.length;
    }

    // Generate Initials Avatar
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    // Create Comment HTML element
    function createCommentCard(comment) {
        const card = document.createElement('div');
        card.classList.add('comment-card');
        
        const initials = getInitials(comment.name);
        
        card.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">${initials}</div>
                    <div>
                        <h4 class="author-name">${comment.name}</h4>
                        <span class="author-tag">${comment.tag || 'Client Feedback'}</span>
                    </div>
                </div>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-body">
                <span class="comment-ref">Discussing: ${comment.ref}</span>
                <p>${comment.message}</p>
            </div>
        `;
        return card;
    }

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('client-name');
        const emailInput = document.getElementById('client-email');
        const selectTemplate = document.getElementById('template-select');
        const messageInput = document.getElementById('client-message');

        const selectedOptionText = selectTemplate.options[selectTemplate.selectedIndex].text;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = `Today, ${timeString}`;

        const newComment = {
            name: nameInput.value,
            tag: "Client Contributor",
            date: dateString,
            ref: selectedOptionText,
            message: messageInput.value
        };

        // Prepend comment to data
        loadedComments.unshift(newComment);
        localStorage.setItem('baodi_comments', JSON.stringify(loadedComments));

        // Create and animate new card insertion
        const newCard = createCommentCard(newComment);
        commentList.insertBefore(newCard, commentList.firstChild);
        
        // Update count badge
        countBadge.textContent = loadedComments.length;

        // Reset form inputs
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';

        // Add subtle indicator on cursor for success feedback
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            cursor.style.backgroundColor = 'var(--accent-color)';
            cursor.style.transform = 'translate(-50%, -50%) scale(3)';
            setTimeout(() => {
                cursor.style.backgroundColor = 'var(--text-color)';
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 1000);
        }
    });

    // Render initially
    renderComments();
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
 * 5. Zalo Notice Toast Controller
 * Displays the personalization notice toast after a slight delay, and handles closure.
 */
function initZaloToast() {
    const toast = document.getElementById('zalo-notice-toast');
    const overlay = document.getElementById('zalo-toast-overlay');
    const closeBtn = document.getElementById('close-zalo-toast');
    if (!toast) return;

    // Show toast and overlay after 2 seconds
    setTimeout(() => {
        toast.classList.add('show');
        if (overlay) overlay.classList.add('show');
    }, 2000);

    function closeToast() {
        toast.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeToast);
    }
    if (overlay) {
        overlay.addEventListener('click', closeToast);
    }
}

/**
 * 6. Scroll Reveal Observer & Dynamic Classes setup
 * Programmatically tracks elements and fades them up beautifully when scrolled into view.
 */
function initScrollReveal() {
    const targets = document.querySelectorAll('.showcase-card, .section-header, .about-section, .forum-section');
    
    // Add scroll reveal classes dynamically
    targets.forEach(el => {
        el.classList.add('reveal-on-scroll');
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target); // Stop tracking once revealed
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    targets.forEach(el => observer.observe(el));
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
 * 9. Interactive 3D Card Tilt with Glare Sweep
 * Follows cursor position to rotate card in 3D space and sweep reflective radial highlights.
 */
function initHeroCardTilt() {
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
        
        // Tilt angles (max 10 degrees)
        const rotateX = ((centerY - y) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Set transform matrix
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${-rotateY * 1.2}px ${rotateX * 1.2}px 30px rgba(0,0,0,0.06)`;

        // Highlight glare position
        if (glare) {
            glare.style.opacity = '1';
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        // Maintain shadow depending on dark-mode class
        if (card.classList.contains('dark-mode')) {
            card.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5)';
        } else {
            card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
        }
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
 * 10. Mobile Bottom Navigation & Scroll Spy Indicator
 * Handles smooth clicks and dynamically highlights the active navigation tab as screen scrolls.
 */
function initMobileBottomNav() {
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (!bottomNav) return;

    const navItems = bottomNav.querySelectorAll('.mobile-nav-item');
    const sections = {
        'hero-section': document.getElementById('hero-section'),
        'showcase': document.getElementById('showcase'),
        'forum': document.getElementById('forum'),
        'about-developer': document.getElementById('about-developer')
    };

    // Smooth scroll offset adjustments
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                const headerOffset = 60;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active tab class immediately
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Scroll Spy active indicator listener
    window.addEventListener('scroll', () => {
        // Skip scroll spy on large viewports where bottom-nav is hidden
        if (window.innerWidth > 768) return;

        let currentSectionId = 'hero-section';
        const scrollPosition = window.scrollY + 200; // Offset for trigger bounds

        for (const [id, element] of Object.entries(sections)) {
            if (element) {
                const top = element.offsetTop;
                const height = element.offsetHeight;

                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentSectionId = id;
                }
            }
        }

        // Highlight matching tab element
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === currentSectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
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
 * 12. Load Featured Stories from posts.json dynamically onto Homepage
 */
function initHomepageFeaturedStories() {
    const container = document.getElementById('homepage-featured-stories');
    if (!container) return;

    fetch('posts.json?t=' + Date.now())
        .then(res => res.json())
        .then(posts => {
            if (!Array.isArray(posts) || posts.length === 0) return;

            // Pick up to 2-3 most recent posts
            const recent = posts.slice(0, 3);
            
            // Build cards
            const cardsHTML = recent.map(post => {
                const cleanExcerpt = post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : '');
                return `
                    <article class="story-card">
                        <div class="story-meta">
                            <span class="story-category">${post.categoryLabel || post.category || 'Story'}</span>
                            <span class="story-date">${post.date || 'Recent'}</span>
                        </div>
                        <h3 class="story-title">
                            <a href="journal.html">${post.title}</a>
                        </h3>
                        <p class="story-excerpt">
                            ${cleanExcerpt}
                        </p>
                        <div class="story-footer">
                            <span class="story-readtime">${post.readTime || '3'} min read</span>
                            <a href="journal.html" class="story-link">
                                <span>Read Full Article</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                        </div>
                    </article>
                `;
            }).join('');

            container.innerHTML = cardsHTML;
        })
        .catch(err => {
            // Keep pre-rendered fallback cards intact if offline
            console.log('Homepage using static fallback articles:', err);
        });
}

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

    // Lightbox triggers for each slide (button click & image click)
    slides.forEach(slide => {
        const lbBtn = slide.querySelector('.slide-lightbox-btn');
        const img = slide.querySelector('img');
        const title = slide.getAttribute('data-title');
        const desc = slide.getAttribute('data-desc');
        const fbUrl = slide.getAttribute('data-fb-url');

        function triggerLightbox(e) {
            e.stopPropagation();
            if (window.openImageLightbox && img) {
                window.openImageLightbox(img.src, title, desc, fbUrl);
            }
        }

        if (lbBtn) lbBtn.addEventListener('click', triggerLightbox);
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', triggerLightbox);
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

    // Initialize first slide and start auto-play
    updateSlide(0);
    startAutoPlay();
}




