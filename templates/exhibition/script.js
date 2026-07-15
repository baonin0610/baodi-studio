/* ==========================================================================
   3D Virtual Exhibition Portfolio Script - Template 11
   Bespoke Interactive Orbit Mechanics & Liquid HUD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Core Layout Elements
    const viewport = document.getElementById('viewport-3d');
    const stage = document.getElementById('stage-3d');
    const grid = document.getElementById('gallery-grid-3d');
    const cards = document.querySelectorAll('.exhibition-card-3d');
    
    // HUD Indicators
    const logCoordX = document.getElementById('log-coord-x');
    const logCoordY = document.getElementById('log-coord-y');
    const logFocusStage = document.getElementById('log-focus-stage');
    const logCamZoom = document.getElementById('log-cam-zoom');
    const compassNeedle = document.getElementById('compass-needle');
    const hudClock = document.getElementById('hud-clock');
    
    // Details Overlay Elements
    const overlay = document.getElementById('details-overlay');
    const closeOverlayBtn = document.getElementById('close-overlay-btn');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDesc = document.getElementById('overlay-desc');
    const overlayCategory = document.getElementById('overlay-category');
    const overlayImg = document.getElementById('overlay-img');
    const overlayProjNum = document.getElementById('overlay-project-num');
    const overlayProjYear = document.getElementById('overlay-project-year');
    
    // Mode Buttons
    const btnMode3d = document.getElementById('view-mode-3d');
    const btnModeFlat = document.getElementById('view-mode-flat');

    if (!stage || cards.length === 0) return;

    // 3D Camera & Orbit Coordinates
    let rotateX = 0;
    let rotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    
    let zoomZ = 0;
    let targetZoomZ = 0; // Starts centered
    const minZoomZ = -500;
    const maxZoomZ = 300;

    let isZoomedIn = false;
    let isFlatMode = false;

    // ==========================================================================
    // 3D Orbit Mouse Triggers
    // ==========================================================================
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768 || isFlatMode || isZoomedIn) return;

        // Normalize coordinates relative to window center (-0.5 to 0.5)
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;

        // Map to target angles
        targetRotateY = normX * 24; // Up to 24 degrees yaw
        targetRotateX = normY * -20; // Up to -20 degrees pitch

        // Update HUD readouts
        if (logCoordX) logCoordX.textContent = (normX * 100).toFixed(2);
        if (logCoordY) logCoordY.textContent = (normY * -100).toFixed(2);
    });

    // ==========================================================================
    // Scroll Wheel Zoom (Depth Translation)
    // ==========================================================================
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 768 || isFlatMode || isZoomedIn) return;

        // Shift camera target on scroll direction
        targetZoomZ += e.deltaY * -0.35;
        // Clamp depth boundaries
        targetZoomZ = Math.max(minZoomZ, Math.min(targetZoomZ, maxZoomZ));
    });

    // ==========================================================================
    // Card Hover Gloss Coordinate Mapping & Text Scrambler
    // ==========================================================================
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Map as custom CSS variables
            card.style.setProperty('--mouse-x', `${(mouseX / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(mouseY / rect.height) * 100}%`);
        });

        // Trigger holographic title scramble on entry
        let scrambleLock = false;
        card.addEventListener('mouseenter', () => {
            if (scrambleLock) return;
            scrambleLock = true;
            const nameEl = card.querySelector('.card-name');
            if (nameEl) {
                const originalText = card.getAttribute('data-title');
                scrambleText(nameEl, originalText, 450);
            }
            setTimeout(() => { scrambleLock = false; }, 600);
        });
    });

    // ==========================================================================
    // Physics LERP Loop
    // ==========================================================================
    function renderLoop() {
        if (window.innerWidth > 768 && !isFlatMode) {
            // Apply Linear Interpolation (LERP) for physics cushioning
            const lerpFactor = 0.08;
            
            rotateX += (targetRotateX - rotateX) * lerpFactor;
            rotateY += (targetRotateY - rotateY) * lerpFactor;
            zoomZ += (targetZoomZ - zoomZ) * lerpFactor;

            // Apply transforms to Stage
            stage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${zoomZ}px)`;

            // Rotate HUD compass needle based on Y-yaw rotation
            if (compassNeedle) {
                compassNeedle.style.transform = `rotate(${rotateY * 3.5}deg)`;
            }

            // Update HUD Zoom Readout
            if (logCamZoom) {
                const zoomFactor = ((zoomZ - minZoomZ) / (maxZoomZ - minZoomZ) * 1.5 + 0.5).toFixed(2);
                logCamZoom.textContent = `${zoomFactor}x`;
            }
        }
        
        requestAnimationFrame(renderLoop);
    }
    
    // Start Animation Loop
    requestAnimationFrame(renderLoop);

    // ==========================================================================
    // HUD clock ticker
    // ==========================================================================
    function updateClock() {
        if (!hudClock) return;
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
        
        hudClock.textContent = `${hrs}:${mins}:${secs}:${ms}`;
    }
    setInterval(updateClock, 30);

    // ==========================================================================
    // Card click transitions (Camera Zoom & Overlay Activation)
    // ==========================================================================
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            if (isZoomedIn) return;
            
            isZoomedIn = true;
            if (viewport) viewport.classList.add('zoomed');
            if (logFocusStage) logFocusStage.textContent = 'ZOOM_READOUT';

            // Retrieve meta parameters
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const img = card.getAttribute('data-img');
            const idx = card.getAttribute('data-index');
            const date = card.getAttribute('data-date');
            const category = card.getAttribute('data-desc');
            const cardCategory = card.querySelector('.card-category').textContent;

            // Get view elements
            const viewProj = document.getElementById('view-project-specs');
            const viewProfile = document.getElementById('view-profile-specs');
            const viewExp = document.getElementById('view-experience-specs');
            const actionBtn = document.getElementById('overlay-action-btn');

            if (idx === '1') {
                if (viewProj) viewProj.style.display = 'none';
                if (viewExp) viewExp.style.display = 'none';
                if (viewProfile) viewProfile.style.display = 'block';
                if (actionBtn) {
                    actionBtn.textContent = 'ESTABLISH EMAIL CONNECTION';
                    actionBtn.href = 'mailto:linhchi.growth@gmail.com';
                }
            } else if (idx === '2') {
                if (viewProj) viewProj.style.display = 'none';
                if (viewProfile) viewProfile.style.display = 'none';
                if (viewExp) viewExp.style.display = 'block';
                if (actionBtn) {
                    actionBtn.textContent = 'ESTABLISH PHONE CONNECTION';
                    actionBtn.href = 'tel:098xxxxx43';
                }
            } else {
                if (viewProfile) viewProfile.style.display = 'none';
                if (viewExp) viewExp.style.display = 'none';
                if (viewProj) viewProj.style.display = 'block';
                if (actionBtn) {
                    actionBtn.textContent = 'RUN VIRTUAL PREVIEW';
                    actionBtn.href = '#';
                }
            }

            // Populating Overlay details
            if (overlayTitle) overlayTitle.textContent = title;
            if (overlayDesc) overlayDesc.textContent = desc;
            if (overlayCategory) overlayCategory.textContent = cardCategory;
            if (overlayProjNum) overlayProjNum.textContent = String(idx).padStart(2, '0');
            if (overlayProjYear) overlayProjYear.textContent = date;
            if (overlayImg) overlayImg.src = img;

            // Trigger text scramble decoder
            scrambleText(overlayTitle, title, 600);

            // Camera Zoom In Animation
            if (window.innerWidth > 768 && !isFlatMode) {
                targetZoomZ = 350; // Deep zoom forward
                targetRotateX = 5; // Level stage
                targetRotateY = 0;
            }

            // Fade in overlay
            setTimeout(() => {
                if (overlay) overlay.classList.add('active');
            }, 550);
        });
    });

    // Close Overlay
    if (closeOverlayBtn) {
        closeOverlayBtn.addEventListener('click', () => {
            if (!isZoomedIn) return;
            
            if (overlay) overlay.classList.remove('active');

            // Zoom Camera back
            setTimeout(() => {
                targetZoomZ = 0; // Return to center
                isZoomedIn = false;
                if (viewport) viewport.classList.remove('zoomed');
                if (logFocusStage) logFocusStage.textContent = isFlatMode ? 'FLAT_GRID' : 'GRID_ROOM';
            }, 600);
        });
    }

    // ==========================================================================
    // View Modes Toggle
    // ==========================================================================
    if (btnModeFlat) {
        btnModeFlat.addEventListener('click', () => {
            if (isFlatMode || isZoomedIn) return;
            isFlatMode = true;
            
            btnModeFlat.classList.add('active');
            if (btnMode3d) btnMode3d.classList.remove('active');
            if (logFocusStage) logFocusStage.textContent = 'FLAT_GRID';

            // Flatten Stage transforms
            stage.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            stage.style.transform = 'none';
            
            // Remove 3D coordinates from stage
            setTimeout(() => {
                stage.style.transition = 'none';
            }, 800);
        });
    }

    if (btnMode3d) {
        btnMode3d.addEventListener('click', () => {
            if (!isFlatMode || isZoomedIn) return;
            isFlatMode = false;
            
            btnMode3d.classList.add('active');
            if (btnModeFlat) btnModeFlat.classList.remove('active');
            if (logFocusStage) logFocusStage.textContent = 'GRID_ROOM';

            // Return to 3D positioning
            stage.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            targetRotateX = 0;
            targetRotateY = 0;
            targetZoomZ = 0;

            setTimeout(() => {
                stage.style.transition = 'none';
            }, 800);
        });
    }

    // ==========================================================================
    // Resize resets
    // ==========================================================================
    window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;
        maxScrollX = (totalSlides - 1) * windowWidth;
        
        if (window.innerWidth <= 768) {
            stage.style.transform = 'none';
            if (overlay && !isZoomedIn) overlay.classList.remove('active');
        } else {
            if (!isFlatMode) {
                targetRotateX = 0;
                targetRotateY = 0;
                targetZoomZ = 0;
            }
        }
    });

    // ==========================================================================
    // Holographic Scramble Text Decoder
    // ==========================================================================
    function scrambleText(element, finalString, duration = 650) {
        if (!element) return;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';
        let iterations = 0;
        const intervalTime = 25;
        const steps = duration / intervalTime;
        
        const interval = setInterval(() => {
            element.innerText = finalString
                .split("")
                .map((char, index) => {
                    if (char === " ") return " ";
                    if (index < (iterations / steps) * finalString.length) {
                        return finalString[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
            
            if (iterations >= steps) {
                clearInterval(interval);
                element.innerText = finalString;
            }
            iterations++;
        }, intervalTime);
    }

    // ==========================================================================
    // Interactive HTML5 Canvas Particles Background
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 65;
        let mousePos = { x: -1000, y: -1000 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5 + 0.5;
                this.alpha = Math.random() * 0.4 + 0.15;
                this.baseAlpha = this.alpha;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around boundaries
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Mouse magnetic push
                const dx = this.x - mousePos.x;
                const dy = this.y - mousePos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const force = (130 - dist) / 130;
                    this.x += (dx / dist) * force * 1.6;
                    this.y += (dy / dist) * force * 1.6;
                    this.alpha = Math.min(0.85, this.baseAlpha + force * 0.55);
                } else {
                    this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(142, 148, 160, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================================================
    // 3D Sorter Category Filter Toggler
    // ==========================================================================
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isZoomedIn) return;

            // Toggle active state
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const filterVal = tag.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.querySelector('.card-category').textContent.toLowerCase();
                
                // Check if matched
                const isMatched = filterVal === 'all' || category.includes(filterVal);
                
                if (isMatched) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
            
            // Trigger coordinate stage update
            if (logFocusStage) {
                logFocusStage.textContent = filterVal === 'all' ? 'GRID_ROOM' : `FLTR:${filterVal.toUpperCase()}`;
            }
        });
    });
});
