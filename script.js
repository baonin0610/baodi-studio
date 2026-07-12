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
    const closeBtn = document.getElementById('close-zalo-toast');
    if (!toast) return;

    // Show toast after 2 seconds
    setTimeout(() => {
        toast.classList.add('show');
    }, 2000);

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }
}
