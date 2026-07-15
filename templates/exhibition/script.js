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

    // Multipage Exhibition details data store
    const cardDetailsData = {
        '1': [ // Profile Card
            {
                title: "BUI LINH CHI // BIOGRAPHY",
                desc: "I am Bui Linh Chi, a Growth Marketer and Content Creator with over 4 years of experience working in digital media. I focus on revenue-oriented content planning, brand campaign development, and optimization of outreach channels to bring sustainable growth to businesses.",
                specs: [
                    { label: "ROLE", value: "GROWTH MARKETER" },
                    { label: "EXPERTISE", value: "SEO & LEAD GENERATION" },
                    { label: "LOCATION", value: "DA NANG, VIETNAM" }
                ],
                img: "../creator/assets/portrait.jpg",
                actionText: "ESTABLISH EMAIL CONNECTION",
                actionLink: "mailto:linhchi.growth@gmail.com"
            },
            {
                title: "BUI LINH CHI // EDUCATION",
                desc: "Graduated with honors from National Economics University (NEU) in Marketing. Specialized in digital campaign strategy, consumer behavior analytics, and marketing communications research.",
                specs: [
                    { label: "UNIVERSITY", value: "NATIONAL ECONOMICS UNIVERSITY" },
                    { label: "GPA", value: "3.6 / 4.0 (GRADUATED WITH HONORS)" },
                    { label: "TIMELINE", value: "2020 - 2024" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "ESTABLISH EMAIL CONNECTION",
                actionLink: "mailto:linhchi.growth@gmail.com"
            },
            {
                title: "BUI LINH CHI // CORE VALUES",
                desc: "Focusing on ROI-centric writing strategies, performance funnel audit paths, and organic search rank optimization. Committed to transparency, metrics validation, and continuous growth audits.",
                specs: [
                    { label: "MARKETING KPI", value: "+150% LEADS INCREASE" },
                    { label: "TEAM LEADERSHIP", value: "DIRECTED 5+ WRITER SQUADS" },
                    { label: "BUDGET AUDITING", value: "OPTIMIZED CPL REDUCTION" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "ESTABLISH EMAIL CONNECTION",
                actionLink: "mailto:linhchi.growth@gmail.com"
            }
        ],
        '2': [ // Experience Card
            {
                title: "CAREER TIMELINE // PRESENT",
                desc: "Currently leading organic growth funnels and search engine optimization campaigns at ABC Corporation. Spearheaded the inbound traffic scaling blueprints that boosted monthly lead volume by over 140%.",
                specs: [
                    { label: "COMPANY", value: "ABC CORPORATION" },
                    { label: "POSITION", value: "SEO & LEAD GENERATION MANAGER" },
                    { label: "TIMELINE", value: "2024 - PRESENT" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "ESTABLISH PHONE INQUIRY",
                actionLink: "tel:098xxxxx43"
            },
            {
                title: "CAREER TIMELINE // PAST AGENCY",
                desc: "Formulated content calendars, led visual campaign identity designs, directed copywriting streams, and analyzed conversion analytics dashboards at DEF Digital Agency.",
                specs: [
                    { label: "AGENCY", value: "DEF DIGITAL AGENCY" },
                    { label: "POSITION", value: "CONTENT MARKETING SPECIALIST" },
                    { label: "TIMELINE", value: "2022 - 2024" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "ESTABLISH PHONE INQUIRY",
                actionLink: "tel:098xxxxx43"
            },
            {
                title: "CAREER TIMELINE // FOUNDATIONS",
                desc: "Executed search query optimizations, wrote ad scripts, established social media outreach, and audited landing page lead forms as a Freelance Marketing Consultant.",
                specs: [
                    { label: "SECTOR", value: "FREELANCE MARKETING AUDITING" },
                    { label: "CLIENTS", value: "10+ BOUTIQUE BRANDS" },
                    { label: "TIMELINE", value: "2020 - 2022" }
                ],
                img: "../creator/assets/cover.jpg",
                actionText: "ESTABLISH PHONE INQUIRY",
                actionLink: "tel:098xxxxx43"
            }
        ],
        '3': [ // Aether Editorial
            {
                title: "AETHER EDITORIAL // OVERVIEW",
                desc: "Comprehensive visual branding, layout strategy, and content campaign executions designed for luxury fashion lookbooks.",
                specs: [
                    { label: "BRAND", value: "AETHER EDITORIAL" },
                    { label: "CATEGORY", value: "FASHION BRANDING" },
                    { label: "METRIC", value: "+150% ORGANIC REVENUE" }
                ],
                img: "../creator/assets/cover.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "AETHER EDITORIAL // STRATEGY",
                desc: "Audited existing search query patterns and shifted content streams toward high-value semantic terms, creating a premium lookbook design system.",
                specs: [
                    { label: "SEO PHASES", value: "SEMANTIC KEYWORD GAP ANALYSIS" },
                    { label: "CREATIVE LEAD", value: "BUI LINH CHI" },
                    { label: "TIMELINE", value: "3 MONTH PLAN" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "AETHER EDITORIAL // OUTPUT & CONVERSIONS",
                desc: "Delivered 15+ editorial lookbook articles, 3 premium ad scripts, and landing page layouts that boosted checkout conversion rates by 35%.",
                specs: [
                    { label: "VISUALS DELIVERED", value: "15+ HAUTE COUTURE PANELS" },
                    { label: "CONVERSIONS", value: "+35% CART CONVERSION STAGGER" },
                    { label: "STATUS", value: "COMPLETED & LIVE" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            }
        ],
        '4': [ // Lumina Lookbook
            {
                title: "LUMINA LOOKBOOK // OVERVIEW",
                desc: "Minimal editorial catalog aesthetics built for natural botanical skincare lines, blending sand-beige tones and soft typography grids.",
                specs: [
                    { label: "PROJECT BRAND", value: "LUMINA SKINCARE" },
                    { label: "CATEGORY", value: "BEAUTY BRANDING & IDENTITY" },
                    { label: "TIMELINE LOGS", value: "4 MONTH EXECUTION" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "LUMINA LOOKBOOK // ACQUISITION",
                desc: "Designed landing pages centered around botanical ingredients education, converting high-intent organic visitors into subscribers.",
                specs: [
                    { label: "ACQUISITION FUNNEL", value: "PRODUCT EDUCATION HUBS" },
                    { label: "LEADS DELIVERED", value: "+95% VISITOR-TO-LEAD CR" },
                    { label: "SEO TRAFFIC", value: "+80% ORGANIC MONTHLY" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "LUMINA LOOKBOOK // RESULTS",
                desc: "Established Lumina as a premium clean beauty alternative, dropping overall customer acquisition cost (CAC) by 28%.",
                specs: [
                    { label: "CAC METRIC", value: "-28% CUSTOMER CAC REDUCTION" },
                    { label: "RETENTION INDEX", value: "+18% RETENTION STAGGER" },
                    { label: "STATUS", value: "DELIVERED SECURE" }
                ],
                img: "../creator/assets/cover.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            }
        ],
        '5': [ // Vortex Identity
            {
                title: "VORTEX IDENTITY // OVERVIEW",
                desc: "Technical athletic wear branding and conversion copy. High-contrast overlays, raw aesthetics, and bold typography rules.",
                specs: [
                    { label: "CLIENT", value: "VORTEX GEAR" },
                    { label: "CATEGORY", value: "SPORTS MARKETING & COPY" },
                    { label: "METRICS DELIVERED", value: "+45% LEAD QUALITY STAGGER" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "VORTEX IDENTITY // EXECUTION",
                desc: "Restructured organic landing pages to target athletic compression search intents, cutting cost-per-lead by 25%.",
                specs: [
                    { label: "CAMPAIGN METRICS", value: "-25% CPL LEAD COST REDUCTION" },
                    { label: "OUTREACH PATHS", value: "ORGANIC COMPRESSION QUERY FUNNELS" },
                    { label: "COMPLETED DATE", value: "DECEMBER 2025" }
                ],
                img: "../creator/assets/cover.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "VORTEX IDENTITY // AUDITS",
                desc: "Deployed continuous A/B checkouts testing, leading to a highly optimized purchase flow with zero checkout bottlenecks.",
                specs: [
                    { label: "A/B TEST LOGS", value: "14 INTEGRATION CYCLES" },
                    { label: "CHECKOUT LEAKS", value: "REDUCED CART DROP BY 40%" },
                    { label: "RATING", value: "5.0 STAR AGENCY SCORE" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            }
        ],
        '6': [ // Nexus Portal
            {
                title: "NEXUS PORTAL // OVERVIEW",
                desc: "Brutalist editorial web framework designed for architectural visualization studios. Overlapping cards and 3D cylindrical scroll grids.",
                specs: [
                    { label: "STUDIO", value: "NEXUS ARCHITECTS" },
                    { label: "CATEGORY", value: "DIGITAL PORTAL ARCHITECTURE" },
                    { label: "CREATIVE LEAD", value: "BUI LINH CHI" }
                ],
                img: "../creator/assets/portrait.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "NEXUS PORTAL // DEVELOPMENT",
                desc: "Formulated content streams focusing on architectural visualization trends and brutalist user experiences.",
                specs: [
                    { label: "PORTAL SPEED", value: "98/100 LIGHTHOUSE INDEX" },
                    { label: "VISUAL ASSETS", value: "3D STAGE RENDERING PLOTS" },
                    { label: "COMPLETED", value: "OCTOBER 2025" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "NEXUS PORTAL // VISIBILITY",
                desc: "Ranked first page for 12 core high-volume architectural visualization queries, yielding 40,000+ targeted monthly visits.",
                specs: [
                    { label: "TRAFFIC METRIC", value: "40K+ TARGETED MONTHLY TRAFFIC" },
                    { label: "CONVERSIONS", value: "120+ HIGH-VALUE REQUESTS" },
                    { label: "STATUS", value: "COMPLETED AND SCALED" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            }
        ],
        '7': [ // Halo Exhibit
            {
                title: "HALO EXHIBIT // OVERVIEW",
                desc: "Experimental layout structure utilizing particle graphics, frosted glass HUD overlays, and smooth parallax coordinate shifts.",
                specs: [
                    { label: "CONCEPT", value: "HALO EXHIBIT ROOM" },
                    { label: "CATEGORY", value: "EXHIBIT ARTISTRY & HUD" },
                    { label: "GLOW SHIFT", value: "AMBIENT ORB REFLECTIONS" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "HALO EXHIBIT // DESIGN",
                desc: "Established a tactile UI framework that responds dynamically to mouse coordinate updates and scroll shifts.",
                specs: [
                    { label: "INTERACTIVES", value: "MOUSE COORDINATE MAPPED HUD" },
                    { label: "RESPONSIVE INDEX", value: "FLUID LIQUID GRID FALLBACKS" },
                    { label: "STATUS", value: "DEPLOYED SYSTEM" }
                ],
                img: "../creator/assets/portrait.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "HALO EXHIBIT // IMPACT",
                desc: "Voted high-value creative UI inspiration layout, garnering design awards and community organic shares.",
                specs: [
                    { label: "RECOGNITION", value: "3 DESIGN SIGHT REVIEWS" },
                    { label: "REACH LOGS", value: "10K+ PORTFOLIO SHARES" },
                    { label: "TIMELINE", value: "MARCH 2026" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            }
        ],
        '8': [ // Eclipse Brand
            {
                title: "ECLIPSE BRAND // OVERVIEW",
                desc: "Organic search acquisition and brand positioning funnel executed for luxury horology and watchmaking clients.",
                specs: [
                    { label: "CLIENT", value: "ECLIPSE HOROLOGY" },
                    { label: "CATEGORY", value: "ORGANIC SEO FUNNEL MARKETING" },
                    { label: "AUDIT TIMELINE", value: "6 MONTH FUNNEL SCALE" }
                ],
                img: "../creator/assets/experience.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "ECLIPSE BRAND // KEYWORDS",
                desc: "Audited structural site search indexing errors, mapped long-tail queries, and optimized internal link equity flow.",
                specs: [
                    { label: "SITE HEALTH", value: "FIXED 40+ CRAWLER BLOCKS" },
                    { label: "LINK EQUITY", value: "OPTIMIZED HOROLOGICAL INTERNAL LINKS" },
                    { label: "STATUS", value: "FULLY AUDITED" }
                ],
                img: "../creator/assets/cover.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            },
            {
                title: "ECLIPSE BRAND // CONVERSIONS",
                desc: "Drove 140% organic traffic increase, doubling overall appointment booking conversions for horological consultants.",
                specs: [
                    { label: "TRAFFIC GAIN", value: "+140% ORGANIC ACQUISITION TRAFFIC" },
                    { label: "CONVERSIONS", value: "2.1X BOOKING APPOINTMENTS" },
                    { label: "STATUS", value: "LIVE & CONVERTING" }
                ],
                img: "../creator/assets/about.jpg",
                actionText: "RUN VIRTUAL PREVIEW",
                actionLink: "../creator/index.html"
            }
        ]
    };

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

    // Sub-slides Page Tracking inside Detail Overlay
    let currentCardIndex = '1';
    let currentSubPageIndex = 0;

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
            const idx = card.getAttribute('data-index');
            currentCardIndex = idx;
            currentSubPageIndex = 0; // Reset page
            
            // Populate and render overlay subpage contents
            renderOverlaySubPage(true);

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

    // ==========================================================================
    // Render dynamic overlay content for currentCardIndex and currentSubPageIndex
    // ==========================================================================
    function renderOverlaySubPage(withScramble = true) {
        const pages = cardDetailsData[currentCardIndex];
        if (!pages || !pages[currentSubPageIndex]) return;
        
        const pageData = pages[currentSubPageIndex];
        
        const overlayTitle = document.getElementById('overlay-title');
        const overlayDesc = document.getElementById('overlay-desc');
        const overlaySpecsList = document.getElementById('overlay-specs-list');
        const overlayImg = document.getElementById('overlay-img');
        const overlayProjNum = document.getElementById('overlay-project-num');
        const overlayProjYear = document.getElementById('overlay-project-year');
        const overlayPageIndicator = document.getElementById('overlay-page-indicator');
        const actionBtn = document.getElementById('overlay-action-btn');
        
        const prevBtn = document.getElementById('overlay-page-prev-btn');
        const nextBtn = document.getElementById('overlay-page-next-btn');
        
        // Disable controls during animation transitions
        if (prevBtn) prevBtn.disabled = (currentSubPageIndex === 0);
        if (nextBtn) nextBtn.disabled = (currentSubPageIndex === pages.length - 1);
        
        // Update indicator text
        if (overlayPageIndicator) {
            overlayPageIndicator.textContent = `PAGE 0${currentSubPageIndex + 1} / 0${pages.length}`;
        }
        
        // Set fixed properties
        if (overlayProjNum) overlayProjNum.textContent = String(currentCardIndex).padStart(2, '0');
        
        // Set dynamic properties
        if (overlayProjYear) overlayProjYear.textContent = (currentCardIndex === '1' || currentCardIndex === '2') ? 'ACTIVE' : '2026';
        if (overlayImg) overlayImg.src = pageData.img;
        if (actionBtn) {
            actionBtn.textContent = pageData.actionText;
            actionBtn.href = pageData.actionLink;
        }

        // Apply slide-fade-out transitions
        const container = document.getElementById('overlay-slides-container');
        if (container) {
            container.classList.add('slide-fade-out');
            setTimeout(() => {
                if (overlayTitle) overlayTitle.textContent = pageData.title;
                if (overlayDesc) overlayDesc.textContent = pageData.desc;
                
                // Clear and render specs
                if (overlaySpecsList) {
                    overlaySpecsList.innerHTML = '';
                    pageData.specs.forEach(spec => {
                        const item = document.createElement('div');
                        item.className = 'spec-item';
                        item.innerHTML = `
                            <span class="spec-lbl">${spec.label}</span>
                            <span class="spec-val">${spec.value}</span>
                        `;
                        overlaySpecsList.appendChild(item);
                    });
                }
                
                if (withScramble) {
                    scrambleText(overlayTitle, pageData.title, 550);
                }
                
                container.classList.remove('slide-fade-out');
            }, 250);
        }
    }

    // Sub-slides Page Navigation Event Listeners
    const subPrevBtn = document.getElementById('overlay-page-prev-btn');
    const subNextBtn = document.getElementById('overlay-page-next-btn');
    
    if (subPrevBtn) {
        subPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentSubPageIndex > 0) {
                currentSubPageIndex--;
                renderOverlaySubPage(true);
            }
        });
    }
    
    if (subNextBtn) {
        subNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pages = cardDetailsData[currentCardIndex];
            if (pages && currentSubPageIndex < pages.length - 1) {
                currentSubPageIndex++;
                renderOverlaySubPage(true);
            }
        });
    }
});
