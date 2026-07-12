/* ==========================================================================
   Architect Portfolio JS Script
   Nam Anh — Horizontal Scroll Conversion & Canvas Blueprint Draw
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initCrosshairCursor();
    initScrollReveal();
    initHorizontalScroll();
    initBlueprintCanvas();
    initContactForm();
});

/**
 * 1. Hero Entrance
 */
function initHeroAnimation() {
    const heroSec = document.querySelector('.hero-panel');
    if (heroSec) {
        setTimeout(() => {
            heroSec.classList.add('active');
            const heroImg = heroSec.querySelector('.reveal-mask');
            if (heroImg) heroImg.classList.add('revealed');
        }, 100);
    }
}

/**
 * 2. Custom crosshair measurement cursor
 */
function initCrosshairCursor() {
    const cursor = document.getElementById('custom-cursor');
    const coords = document.getElementById('cursor-coords');
    if (!cursor || !coords) return;

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Print viewport coordinates mimicking CAD blueprint specs
        coords.textContent = `X: ${e.clientX} / Y: ${e.clientY}`;
    });

    const links = document.querySelectorAll('a, button, input, textarea, select, range, .project-strip-item');
    links.forEach(l => {
        l.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            coords.style.borderColor = 'var(--accent-safety)';
            coords.style.color = 'var(--accent-safety)';
        });
        l.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            coords.style.borderColor = 'var(--border-color)';
            coords.style.color = 'var(--accent-rust)';
        });
    });
}

/**
 * 3. Intersection Observer Scroll Reveal (for horizontal items)
 */
function initScrollReveal() {
    const revealOptions = {
        threshold: 0.1,
        root: document.getElementById('scroll-container') // Observer root is the horizontal container!
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealTargets = document.querySelectorAll('.reveal-mask:not(.hero-portrait)');
    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });
}

/**
 * 4. Horizontal Scroll Wheel Converter
 */
function initHorizontalScroll() {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    container.addEventListener('wheel', (e) => {
        // Only convert vertical scroll to horizontal scroll on desktop widths
        if (window.innerWidth > 1024) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        }
    }, { passive: false });
}

/**
 * 5. Blueprint CAD Canvas Scaler
 */
function initBlueprintCanvas() {
    const canvas = document.getElementById('blueprint-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Control Sliders
    const widthSlider = document.getElementById('room-width');
    const lengthSlider = document.getElementById('room-length');
    const wallSlider = document.getElementById('room-wall');

    const widthVal = document.getElementById('width-val');
    const lengthVal = document.getElementById('length-val');
    const wallVal = document.getElementById('wall-val');

    function drawBlueprint() {
        const roomW = parseFloat(widthSlider.value); // In meters (e.g. 8.0)
        const roomL = parseFloat(lengthSlider.value); // In meters (e.g. 10.0)
        const wallT = parseInt(wallSlider.value);    // In cm (e.g. 20)

        // Update labels
        widthVal.textContent = `${roomW.toFixed(1)} m`;
        lengthVal.textContent = `${roomL.toFixed(1)} m`;
        wallVal.textContent = `${wallT} cm`;

        // Canvas setups
        const width = (canvas.width = canvas.parentElement.clientWidth);
        const height = (canvas.height = 320);

        ctx.clearRect(0, 0, width, height);

        // Drawing parameters
        const scale = 14; // pixels per meter
        const drawW = roomW * scale;
        const drawL = roomL * scale;
        const drawWall = (wallT / 100) * scale; // Wall thickness converted to pixels

        // Center offsets
        const startX = (width - drawL) / 2;
        const startY = (height - drawW) / 2;

        // 1. Draw outer walls
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, startY, drawL, drawW);

        // 2. Draw inner walls
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX + drawWall, startY + drawWall, drawL - (drawWall * 2), drawW - (drawWall * 2));

        // 3. Draw door gap & swing on bottom wall
        const doorWidth = 2.5 * scale; // 2.5 meters door
        const doorX = startX + (drawL - doorWidth) / 2;
        
        // Clear door gap in outer/inner walls
        ctx.fillStyle = '#061211'; // Same as blueprint background grid base
        ctx.fillRect(doorX, startY + drawW - drawWall - 2, doorWidth, drawWall + 4);

        // Draw door swing arc
        ctx.strokeStyle = '#DCA134'; // Yellow safety indicator color
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Swing arc
        ctx.arc(doorX, startY + drawW - drawWall, doorWidth, Math.PI, 1.5 * Math.PI, false);
        ctx.stroke();

        // Draw door leaf line
        ctx.beginPath();
        ctx.moveTo(doorX, startY + drawW - drawWall);
        ctx.lineTo(doorX, startY + drawW - drawWall - doorWidth);
        ctx.stroke();

        // 4. Draw dimension lines (measuring indicators)
        ctx.strokeStyle = '#E57373'; // Thin red pencil line
        ctx.fillStyle = '#E57373';
        ctx.font = '10px Courier New';
        ctx.lineWidth = 1;

        // Length Dimension (Top measurement)
        const dimY = startY - 20;
        ctx.beginPath();
        ctx.moveTo(startX, dimY);
        ctx.lineTo(startX + drawL, dimY);
        // ticks at endpoints
        ctx.moveTo(startX, dimY - 4); ctx.lineTo(startX, dimY + 4);
        ctx.moveTo(startX + drawL, dimY - 4); ctx.lineTo(startX + drawL, dimY + 4);
        ctx.stroke();
        // text label
        ctx.fillText(`${roomL.toFixed(2)}m`, startX + (drawL / 2) - 18, dimY - 6);

        // Width Dimension (Left measurement)
        const dimX = startX - 20;
        ctx.beginPath();
        ctx.moveTo(dimX, startY);
        ctx.lineTo(dimX, startY + drawW);
        // ticks
        ctx.moveTo(dimX - 4, startY); ctx.lineTo(dimX + 4, startY);
        ctx.moveTo(dimX - 4, startY + drawW); ctx.lineTo(dimX + 4, startY + drawW);
        ctx.stroke();
        // text label
        ctx.save();
        ctx.translate(dimX - 6, startY + (drawW / 2) + 12);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${roomW.toFixed(2)}m`, 0, 0);
        ctx.restore();

        // Label interior text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '11px Courier New';
        ctx.fillText('LIVING SPACE', startX + 15, startY + 25);
        ctx.fillText(`THICKNESS: ${wallT}cm`, startX + 15, startY + 40);
    }

    // Attach listeners
    widthSlider.addEventListener('input', drawBlueprint);
    lengthSlider.addEventListener('input', drawBlueprint);
    wallSlider.addEventListener('input', drawBlueprint);

    // Initial compile
    drawBlueprint();

    // Export button listener
    const exportBtn = document.getElementById('export-blueprint-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataUrl = canvas.toDataURL("image/png");
            
            const link = document.createElement('a');
            link.download = `blueprint_${widthSlider.value}x${lengthSlider.value}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // UI feedback
            const originalText = exportBtn.textContent;
            exportBtn.textContent = 'Blueprint Exported!';
            exportBtn.style.backgroundColor = 'var(--accent-safety)';
            exportBtn.style.color = '#FFF';

            setTimeout(() => {
                exportBtn.textContent = originalText;
                exportBtn.style.backgroundColor = '';
                exportBtn.style.color = '';
            }, 2500);
        });
    }
}

/**
 * 6. Contact Form Dispatcher feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.draft-submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Compiling specs...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.textContent = 'Specs compiled [Blueprint Safe]';
            submitBtn.style.backgroundColor = 'var(--accent-rust)';
            submitBtn.style.color = '#FFF';

            form.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.style.pointerEvents = '';
            }, 3000);
        }, 1500);
    });
}
