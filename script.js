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
            ref: "Linh Nguyen — Editorial Photographer (Mẫu 1)",
            message: "Giao diện nhiếp ảnh mẫu 1 thực sự rất đẹp và tinh tế! Màu kem Alabaster kết hợp hình ảnh mộc mạc trông cực kỳ cao cấp, đúng chất nghệ thuật chứ không bị công nghiệp. Nhóm hiệu ứng mở khẩu độ máy ảnh và di chuột View hoạt động rất mượt."
        },
        {
            name: "Maria Anders",
            tag: "Creative Director",
            date: "Yesterday, 4:15 PM",
            ref: "Alex Nguyen — Creative Developer (Mẫu 2)",
            message: "Excited for the Creative Developer theme! The combination of dark backgrounds with neon lines and dynamic particle fields is exactly what we need to show our technical and creative side. Please add a dark-light theme toggle for it if possible."
        },
        {
            name: "Khanh Do",
            tag: "Interior Designer",
            date: "Yesterday, 11:05 AM",
            ref: "Linh Nguyen — Editorial Photographer (Mẫu 1)",
            message: "Liệu chúng ta có thể tùy biến mẫu số 1 này thành trang web thiết kế nội thất được không? Mình thấy bố cục bất đối xứng và cách sắp xếp hình ảnh tỷ lệ 3:4 của nó rất phù hợp cho thiết kế không gian."
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

    launchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check if it's the nav bar button or a card launch button
            if (btn.classList.contains('launch-nav-btn')) return; // Allow nav bar button to open normally

            // MOBILE OPTIMIZATION: If on mobile (screen <= 768px) or a touch screen, open directly in a new tab natively
            // instead of stacking an iframe modal simulator which ruins responsive viewport tests and drains memory!
            if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) {
                // Let the browser perform standard navigation using the target="_blank" attribute on the anchor
                return;
            }

            e.preventDefault();
            
            const url = btn.getAttribute('href');
            // Try to find the template title from the card body
            const cardBody = btn.closest('.card-body');
            const titleText = cardBody ? cardBody.querySelector('.card-title').textContent : 'Template Preview';

            // Configure modal details
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

            // Show modal
            modal.classList.add('show');
        });
    });

    // Close preview modal
    function closePreview() {
        modal.classList.remove('show');
        // VERY IMPORTANT: Clear the iframe source to stop background sounds (e.g. tape flutter, clock ticking) from playing!
        iframe.src = '';
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
