/* ==========================================================================
   BaoDi Studio Journal Engine (journal.js)
   Category Filtering, Reading Drawer, Scroll Progress & HTML Post Generator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initJournalFilters();
    initJournalReader();
    initPostCreator();
});

/**
 * 1. Custom Cursor Sync (Reusing styles from main hub)
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

    // Sync scaling on hover
    function bindHoverEvents() {
        const interactives = document.querySelectorAll('a, button, select, input, textarea, .journal-card');
        interactives.forEach(item => {
            // Avoid duplicate listeners
            if (item.classList.contains('cursor-bound')) return;
            item.classList.add('cursor-bound');

            item.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2.2)';
                cursor.style.backgroundColor = 'rgba(140, 124, 109, 0.18)';
                cursor.style.border = '1px solid var(--accent-color)';
            });
            item.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'var(--text-color)';
                cursor.style.border = 'none';
            });
        });
    }

    bindHoverEvents();
    // Re-bind when grid is dynamically updated
    window.bindCursorHover = bindHoverEvents;
}

/**
 * 2. Category Filtering Logic
 */
function initJournalFilters() {
    const filterBtns = document.querySelectorAll('.journal-filter-btn');
    const cards = document.querySelectorAll('.journal-card');
    const totalCountSpan = document.getElementById('total-posts-count');
    const visibleCountSpan = document.getElementById('visible-posts-count');

    if (totalCountSpan && cards.length) {
        totalCountSpan.textContent = cards.length;
        if (visibleCountSpan) visibleCountSpan.textContent = cards.length;
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            let visibleCount = 0;

            cards.forEach(card => {
                card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    visibleCount++;
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96) translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });

            if (visibleCountSpan) {
                visibleCountSpan.textContent = visibleCount;
            }
        });
    });
}

/**
 * 3. Reading Drawer Management (Slide-in Reader)
 */
let openArticle; // Expose globally so inline onclick works

function initJournalReader() {
    const reader = document.getElementById('journal-reader');
    const backdrop = document.getElementById('journal-backdrop');
    const closeBtn = document.getElementById('close-journal-reader');
    const contentWrapper = document.getElementById('journal-reader-content-wrapper');
    const progressBar = document.getElementById('journal-reader-progress');

    // Title / Meta nodes
    const readerTitle = document.getElementById('reader-title');
    const readerCategory = document.getElementById('reader-category');
    const readerDate = document.getElementById('reader-date');
    const readerBody = document.getElementById('reader-body');

    if (!reader || !closeBtn || !contentWrapper) return;

    openArticle = function(cardElement) {
        const title = cardElement.querySelector('.journal-card-title').textContent;
        const category = cardElement.querySelector('.journal-card-category').textContent;
        const date = cardElement.querySelector('.journal-card-meta span:last-child').textContent;
        
        // Load static HTML template stored in card
        const template = cardElement.querySelector('.journal-article-template');
        const contentHTML = template ? template.innerHTML : '<p>No content provided.</p>';

        // Set contents
        readerTitle.textContent = title;
        readerCategory.textContent = category;
        readerDate.textContent = date;
        readerBody.innerHTML = contentHTML;

        // Reset scroll position and progress bar
        contentWrapper.scrollTop = 0;
        if (progressBar) progressBar.style.width = '0%';

        // Display reader
        reader.classList.add('show');
        if (backdrop) backdrop.classList.add('show');
        document.body.style.overflow = 'hidden'; // Lock main scroll
    };

    function closeReader() {
        reader.classList.remove('show');
        if (backdrop) backdrop.classList.remove('show');
        document.body.style.overflow = ''; // Unlock main scroll
    }

    closeBtn.addEventListener('click', closeReader);
    if (backdrop) backdrop.addEventListener('click', closeReader);

    // Escape Key listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reader.classList.contains('show')) {
            closeReader();
        }
    });

    // Scroll depth indicator progress
    contentWrapper.addEventListener('scroll', () => {
        const scrollHeight = contentWrapper.scrollHeight - contentWrapper.clientHeight;
        if (scrollHeight > 0) {
            const percentage = (contentWrapper.scrollTop / scrollHeight) * 100;
            if (progressBar) progressBar.style.width = `${percentage}%`;
        }
    }, { passive: true });
}

/**
 * 4. Post Creator Tool (Hidden Admin Panel)
 */
function initPostCreator() {
    const trigger = document.getElementById('open-creator-panel');
    const panel = document.getElementById('creator-dashboard');
    const closeBtn = document.getElementById('close-creator-panel');
    const backdrop = document.getElementById('journal-backdrop');
    
    const form = document.getElementById('creator-form');
    const generateBtn = document.getElementById('creator-generate-btn');
    const copyBtn = document.getElementById('creator-copy-btn');
    const codeOutput = document.getElementById('creator-output-code');

    if (!panel || !trigger) return;

    function openPanel() {
        panel.classList.add('show');
        if (backdrop) backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        panel.classList.remove('show');
        // Only hide backdrop if reading drawer is also closed
        const reader = document.getElementById('journal-reader');
        if (backdrop && (!reader || !reader.classList.contains('show'))) {
            backdrop.classList.remove('show');
        }
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openPanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    // Escape closes panel too
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('show')) {
            closePanel();
        }
    });

    // HTML Generator logic
    if (form && generateBtn && codeOutput) {
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const title = document.getElementById('post-title').value.trim();
            const categorySelect = document.getElementById('post-category');
            const category = categorySelect.value;
            const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;
            const date = document.getElementById('post-date').value.trim();
            const image = document.getElementById('post-image').value.trim() || 'assets/blog_default.jpg';
            const readTime = document.getElementById('post-read-time').value.trim() || '3';
            const excerpt = document.getElementById('post-excerpt').value.trim();
            const content = document.getElementById('post-content').value.trim();

            if (!title || !excerpt || !content) {
                alert('Vui lòng điền đầy đủ các thông tin cốt lõi (Tiêu đề, Mô tả ngắn, Nội dung bài viết).');
                return;
            }

            // Parse text content into HTML paragraphs if raw text is supplied without HTML tags
            let parsedContentHTML = content;
            if (!content.includes('<p>') && !content.includes('<div>')) {
                parsedContentHTML = content
                    .split('\n\n')
                    .map(paragraph => paragraph.trim() ? `<p>${paragraph.trim()}</p>` : '')
                    .join('\n');
            }

            // Generate HTML structure
            const cardHTML = `                    <!-- Journal Entry: ${title} -->
                    <div class="journal-card filter-item ${category}" data-category="${category}" onclick="openArticle(this)">
                        <img src="${image}" class="journal-card-image" alt="${title} Cover" loading="lazy">
                        <div class="journal-card-body">
                            <div class="journal-card-meta">
                                <span class="journal-card-category">${categoryLabel}</span>
                                <span>${date}</span>
                            </div>
                            <h3 class="journal-card-title">${title}</h3>
                            <p class="journal-card-excerpt">${excerpt}</p>
                            <div class="journal-card-footer">
                                <span>${readTime} phút đọc</span>
                                <span class="journal-read-more">
                                    Đọc bài viết
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <!-- Article Content Template -->
                        <div class="journal-article-template" style="display: none;">
${parsedContentHTML}
                        </div>
                    </div>`;

            codeOutput.textContent = cardHTML;
        });
    }

    // Copy to clipboard
    if (copyBtn && codeOutput) {
        copyBtn.addEventListener('click', () => {
            const codeText = codeOutput.textContent;
            if (!codeText) return;

            navigator.clipboard.writeText(codeText)
                .then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'COPIED!';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Không thể sao chép: ', err);
                    alert('Lỗi sao chép, bạn vui lòng tự bôi đen và copy.');
                });
        });
    }
}
