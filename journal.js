/* ==========================================================================
   BaoDi Studio Journal Engine (journal.js)
   Dynamic JSON Fetching, LocalStorage Sync, and Browser GitHub API Autocommit
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initJournalReader();
    initPostCreator();
    loadAndSyncPosts();
});

// Global state for posts
let allPosts = [];

/**
 * Unicode-safe Base64 Helpers for Vietnamese Tones
 */
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
    }));
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * 1. Custom Cursor Sync
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

    function bindHoverEvents() {
        const interactives = document.querySelectorAll('a, button, select, input, textarea, .journal-card');
        interactives.forEach(item => {
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
    window.bindCursorHover = bindHoverEvents;
}

/**
 * 2. Dynamic Fetching & LocalStorage Merging
 */
function loadAndSyncPosts() {
    // 1. Fetch from posts.json (committed static list)
    fetch('posts.json?t=' + Date.now())
        .then(res => res.json())
        .then(staticPosts => {
            // 2. Load uncommitted posts saved in user's browser (LocalStorage)
            const localPosts = JSON.parse(localStorage.getItem('baodi_local_posts') || '[]');
            
            // Clean up LocalStorage duplicates if they have already been merged into posts.json on server
            const serverIds = new Set(staticPosts.map(p => p.id));
            const filteredLocal = localPosts.filter(p => !serverIds.has(p.id));
            localStorage.setItem('baodi_local_posts', JSON.stringify(filteredLocal));

            // Merge unpushed local posts to show them instantly to the writer
            allPosts = [...filteredLocal, ...staticPosts];
            renderPostsList(allPosts);
        })
        .catch(err => {
            console.error('Không thể tải bài viết từ server, dùng dữ liệu dự phòng:', err);
            // Fallback to local posts if offline or fetch fails
            allPosts = JSON.parse(localStorage.getItem('baodi_local_posts') || '[]');
            renderPostsList(allPosts);
        });
}

/**
 * 3. Render Grid Cards dynamically
 */
function renderPostsList(posts) {
    const grid = document.getElementById('journal-grid');
    if (!grid) return;

    // Clear old cards, keep only empty state
    const emptyState = grid.querySelector('.journal-empty-state');
    const cards = grid.querySelectorAll('.journal-card');
    cards.forEach(c => c.remove());

    if (posts.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        document.getElementById('total-posts-count').textContent = '0';
        document.getElementById('visible-posts-count').textContent = '0';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = `journal-card filter-item ${post.category}`;
        card.setAttribute('data-category', post.category);

        // Check if image is provided and valid, bind onerror fallback
        const imageHTML = post.image ? `<img src="${post.image}" class="journal-card-image" alt="${post.title} Cover" onerror="this.style.display='none'" loading="lazy">` : '';

        card.innerHTML = `
            ${imageHTML}
            <div class="journal-card-body">
                <div class="journal-card-meta">
                    <span class="journal-card-category">${post.categoryLabel}</span>
                    <span>${post.date}</span>
                </div>
                <h3 class="journal-card-title">${post.title}</h3>
                <div class="journal-card-content">
                    ${post.content}
                </div>
                <div class="journal-card-footer">
                    <span>${post.readTime} phút đọc</span>
                    <span>Bao Duy's Journal</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.getElementById('total-posts-count').textContent = posts.length;
    document.getElementById('visible-posts-count').textContent = posts.length;

    // Bind cursor interactions on new elements
    if (window.bindCursorHover) window.bindCursorHover();
    
    // Reset filters
    initJournalFilters();
}

/**
 * 4. Dynamic Filtering
 */
function initJournalFilters() {
    const filterBtns = document.querySelectorAll('.journal-filter-btn');
    const cards = document.querySelectorAll('.journal-card');
    const visibleCountSpan = document.getElementById('visible-posts-count');

    filterBtns.forEach(btn => {
        // Clear previous listeners by replacing button to prevent multiple alerts
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            document.querySelectorAll('.journal-filter-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');

            const filterValue = newBtn.getAttribute('data-filter');
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
 * 5. Reading Slide-in Drawer Logic
 */
let openArticle;

function initJournalReader() {
    const reader = document.getElementById('journal-reader');
    const backdrop = document.getElementById('journal-backdrop');
    const closeBtn = document.getElementById('close-journal-reader');
    const contentWrapper = document.getElementById('journal-reader-content-wrapper');
    const progressBar = document.getElementById('journal-reader-progress');

    const readerTitle = document.getElementById('reader-title');
    const readerCategory = document.getElementById('reader-category');
    const readerDate = document.getElementById('reader-date');
    const readerBody = document.getElementById('reader-body');

    if (!reader || !closeBtn || !contentWrapper) return;

    openArticle = function(cardElement) {
        const title = cardElement.querySelector('.journal-card-title').textContent;
        const category = cardElement.querySelector('.journal-card-category').textContent;
        const date = cardElement.querySelector('.journal-card-meta span:last-child').textContent;
        const template = cardElement.querySelector('.journal-article-template');
        const contentHTML = template ? template.innerHTML : '<p>No content.</p>';

        readerTitle.textContent = title;
        readerCategory.textContent = category;
        readerDate.textContent = date;
        readerBody.innerHTML = contentHTML;

        contentWrapper.scrollTop = 0;
        if (progressBar) progressBar.style.width = '0%';

        reader.classList.add('show');
        if (backdrop) backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    function closeReader() {
        reader.classList.remove('show');
        if (backdrop) backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeReader);
    if (backdrop) backdrop.addEventListener('click', closeReader);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reader.classList.contains('show')) {
            closeReader();
        }
    });

    contentWrapper.addEventListener('scroll', () => {
        const scrollHeight = contentWrapper.scrollHeight - contentWrapper.clientHeight;
        if (scrollHeight > 0) {
            const percentage = (contentWrapper.scrollTop / scrollHeight) * 100;
            if (progressBar) progressBar.style.width = `${percentage}%`;
        }
    }, { passive: true });
}

/**
 * 6. Post Creator Dashboard (GitHub API Autocommit & Offline Fallback)
 */
function initPostCreator() {
    const trigger = document.getElementById('open-creator-panel');
    const panel = document.getElementById('creator-dashboard');
    const closeBtn = document.getElementById('close-creator-panel');
    const backdrop = document.getElementById('journal-backdrop');
    
    const form = document.getElementById('creator-form');
    const generateBtn = document.getElementById('creator-generate-btn');
    const publishBtn = document.getElementById('creator-publish-btn');
    const copyBtn = document.getElementById('creator-copy-btn');
    const codeOutput = document.getElementById('creator-output-code');
    const statusDiv = document.getElementById('publish-status');

    // GitHub inputs
    const tokenInput = document.getElementById('post-github-token');
    const ownerInput = document.getElementById('post-github-owner');
    const repoInput = document.getElementById('post-github-repo');

    // Password Modal elements
    const pwdModal = document.getElementById('password-modal');
    const pwdInput = document.getElementById('admin-password');
    const pwdError = document.getElementById('password-error');
    const pwdSubmit = document.getElementById('submit-password-btn');
    const pwdCancel = document.getElementById('cancel-password-btn');

    if (!panel || !trigger) return;

    // Helper: SHA-256 hashing using Web Crypto API
    async function getSHA256Hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const TARGET_HASH = "23f3f276f9844a958dcc12befe076b9d8bf6a9099e9fbd7a823e30e69832a543"; // hash for 'baoduy2026'

    async function verifyPassword() {
        const val = pwdInput.value;
        const hashed = await getSHA256Hash(val);
        if (hashed === TARGET_HASH) {
            sessionStorage.setItem('baodi_admin_authenticated', 'true');
            if (pwdModal) pwdModal.classList.remove('show');
            pwdInput.value = '';
            if (pwdError) pwdError.style.display = 'none';
            openPanel();
        } else {
            if (pwdError) pwdError.style.display = 'block';
            pwdInput.classList.add('password-shake');
            setTimeout(() => {
                pwdInput.classList.remove('password-shake');
            }, 400);
        }
    }

    if (pwdSubmit) {
        pwdSubmit.addEventListener('click', verifyPassword);
    }
    if (pwdInput) {
        pwdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyPassword();
            }
        });
    }
    if (pwdCancel) {
        pwdCancel.addEventListener('click', () => {
            if (pwdModal) pwdModal.classList.remove('show');
            if (backdrop) backdrop.classList.remove('show');
            if (pwdError) pwdError.style.display = 'none';
            pwdInput.value = '';
        });
    }

    // Pre-fill fields from LocalStorage
    if (tokenInput) tokenInput.value = localStorage.getItem('baodi_gh_token') || '';
    if (ownerInput) ownerInput.value = localStorage.getItem('baodi_gh_owner') || 'baonin0610';
    if (repoInput) repoInput.value = localStorage.getItem('baodi_gh_repo') || 'baodi-studio';

    function openPanel() {
        panel.classList.add('show');
        if (backdrop) backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        panel.classList.remove('show');
        const reader = document.getElementById('journal-reader');
        if (backdrop && (!reader || !reader.classList.contains('show'))) {
            backdrop.classList.remove('show');
        }
        document.body.style.overflow = '';
        if (statusDiv) statusDiv.style.display = 'none';
    }

    trigger.addEventListener('click', () => {
        if (sessionStorage.getItem('baodi_admin_authenticated') === 'true') {
            openPanel();
        } else {
            if (pwdModal) {
                pwdModal.classList.add('show');
                if (backdrop) backdrop.classList.add('show');
                if (pwdInput) {
                    pwdInput.value = '';
                    pwdInput.focus();
                }
            }
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (panel.classList.contains('show')) {
                closePanel();
            }
            if (pwdModal && pwdModal.classList.contains('show')) {
                pwdModal.classList.remove('show');
                if (backdrop) backdrop.classList.remove('show');
                pwdInput.value = '';
                if (pwdError) pwdError.style.display = 'none';
            }
        }
    });

    // Helper: format content to HTML paragraphs
    function parseHTMLContent(content) {
        if (content.includes('<p>') || content.includes('<div>')) {
            return content;
        }
        return content
            .split('\n\n')
            .map(paragraph => paragraph.trim() ? `<p>${paragraph.trim()}</p>` : '')
            .join('\n');
    }

    // HTML Generator
    if (form && generateBtn && codeOutput) {
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const title = document.getElementById('post-title').value.trim();
            const categorySelect = document.getElementById('post-category');
            const category = categorySelect.value;
            const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;
            const date = document.getElementById('post-date').value.trim();
            const image = document.getElementById('post-image').value.trim();
            const readTime = document.getElementById('post-read-time').value.trim() || '3';
            const excerpt = document.getElementById('post-excerpt').value.trim();
            const content = document.getElementById('post-content').value.trim();

            if (!title || !content) {
                alert('Vui lòng điền đầy đủ: Tiêu đề và Nội dung bài viết.');
                return;
            }

            const parsedContentHTML = parseHTMLContent(content);
            const finalExcerpt = excerpt ? excerpt : (content.replace(/<[^>]*>/g, '').substring(0, 150) + '...');
            
            // If image is blank, do not include the img block in the generated HTML
            const imageHTML = image ? `\n                        <img src="${image}" class="journal-card-image" alt="${title} Cover" onerror="this.style.display='none'" loading="lazy">` : '';

            const cardHTML = `                    <!-- Journal Entry: ${title} -->
                    <div class="journal-card filter-item ${category}" data-category="${category}">
                        ${imageHTML}
                        <div class="journal-card-body">
                            <div class="journal-card-meta">
                                <span class="journal-card-category">${categoryLabel}</span>
                                <span>${date}</span>
                            </div>
                            <h3 class="journal-card-title">${title}</h3>
                            <div class="journal-card-content">
                                ${parsedContentHTML}
                            </div>
                            <div class="journal-card-footer">
                                <span>${readTime} phút đọc</span>
                                <span>Bao Duy's Journal</span>
                            </div>
                        </div>
                    </div>`;

            codeOutput.textContent = cardHTML;
        });
    }

    // Direct Browser GitHub API Publisher
    if (publishBtn) {
        publishBtn.addEventListener('click', () => {
            const title = document.getElementById('post-title').value.trim();
            const categorySelect = document.getElementById('post-category');
            const category = categorySelect.value;
            const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;
            const date = document.getElementById('post-date').value.trim();
            const image = document.getElementById('post-image').value.trim();
            const readTime = document.getElementById('post-read-time').value.trim() || '3';
            const excerpt = document.getElementById('post-excerpt').value.trim();
            const content = document.getElementById('post-content').value.trim();

            if (!title || !content || !date) {
                alert('Vui lòng nhập đầy đủ các thông tin cốt lõi (Tiêu đề, Ngày, Nội dung).');
                return;
            }

            const token = tokenInput.value.trim();
            const owner = ownerInput.value.trim();
            const repo = repoInput.value.trim();

            if (!token) {
                alert('Vui lòng cung cấp GitHub Access Token (PAT) để đăng bài trực tiếp lên Web.');
                tokenInput.focus();
                return;
            }

            // Save settings locally
            localStorage.setItem('baodi_gh_token', token);
            localStorage.setItem('baodi_gh_owner', owner);
            localStorage.setItem('baodi_gh_repo', repo);

            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.color = '#34d399';
                statusDiv.textContent = '⏳ Đang đọc cơ sở dữ liệu posts.json từ GitHub...';
            }

            // 1. Fetch current posts.json from Repo to get current contents and SHA code
            fetch(`https://api.github.com/repos/${owner}/${repo}/contents/posts.json`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            })
            .then(res => {
                if (res.status === 401) throw new Error('Token không hợp lệ (Unauthorized). Hãy kiểm tra lại PAT.');
                if (res.status === 404) throw new Error('Không tìm thấy tệp posts.json hoặc sai đường dẫn Repo.');
                if (!res.ok) throw new Error('Không thể kết nối API của GitHub.');
                return res.json();
            })
            .then(data => {
                const sha = data.sha;
                const decodedText = b64DecodeUnicode(data.content.replace(/\s/g, ''));
                
                let currentPosts = [];
                try {
                    currentPosts = JSON.parse(decodedText);
                } catch(e) {
                    currentPosts = [];
                }

                // Compile post object
                const finalExcerpt = excerpt ? excerpt : (content.replace(/<[^>]*>/g, '').substring(0, 150) + '...');
                const newPost = {
                    id: "post-" + Date.now(),
                    title: title,
                    category: category,
                    categoryLabel: categoryLabel,
                    date: date,
                    image: image,
                    readTime: readTime,
                    excerpt: finalExcerpt,
                    content: parseHTMLContent(content)
                };

                // Add to local preview list instantly so owner sees it
                let localPosts = JSON.parse(localStorage.getItem('baodi_local_posts') || '[]');
                localPosts.unshift(newPost);
                localStorage.setItem('baodi_local_posts', JSON.stringify(localPosts));

                // 2. Prepend to database list
                currentPosts.unshift(newPost);

                // 3. Write back to GitHub
                const updatedJSON = JSON.stringify(currentPosts, null, 4);
                const encodedContent = b64EncodeUnicode(updatedJSON);

                if (statusDiv) statusDiv.textContent = '⏳ Đang ghi bài viết mới lên kho lưu trữ...';

                return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/posts.json`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `feat: publish new journal entry "${title}" via Creator Panel`,
                        content: encodedContent,
                        sha: sha
                    })
                });
            })
            .then(res => {
                if (!res.ok) throw new Error('Không thể commit đè tệp posts.json mới lên repository.');
                return res.json();
            })
            .then(data => {
                if (statusDiv) {
                    statusDiv.textContent = '✅ Đăng thành công! Đang đồng bộ...';
                }
                
                // Clear input form
                document.getElementById('post-title').value = '';
                document.getElementById('post-excerpt').value = '';
                document.getElementById('post-content').value = '';
                
                alert('⚡ ĐĂNG BÀI THÀNH CÔNG!\nBài viết đã được đẩy lên GitHub. GitHub Pages đang tự động dựng trang (khoảng 1 phút). Bài viết sẽ xuất hiện trên màn hình của bạn ngay bây giờ!');
                
                closePanel();
                loadAndSyncPosts(); // Refresh dynamic list
            })
            .catch(err => {
                console.error(err);
                if (statusDiv) {
                    statusDiv.style.color = '#ef4444';
                    statusDiv.textContent = `❌ Lỗi: ${err.message}`;
                }
            });
        });
    }

    // Clipboard copy
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
                    console.error('Lỗi copy: ', err);
                    alert('Bạn vui lòng bôi đen mã bên cạnh và tự sao chép.');
                });
        });
    }
}
