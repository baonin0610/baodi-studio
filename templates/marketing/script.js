/* ==========================================================================
   Growth Marketer Portfolio JS Script
   Khanh Tran — Broadsheet News Tickers & ROI Calculations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initROICalculator();
    initContactForm();
});

/**
 * 1. Elastic custom cursor
 */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const cursorText = cursor.querySelector('.cursor-text');
    let mouse = { x: 0, y: 0 };
    let cursorCoords = { x: 0, y: 0 };
    const lerpFactor = 0.15;

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

    const links = document.querySelectorAll('a, button, input, textarea, select, .case-item, range');
    links.forEach(l => {
        l.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            const desc = l.classList.contains('case-item') ? 'READ COLUMN' : 'SELECT';
            cursorText.textContent = desc;
        });
        l.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorText.textContent = '';
        });
    });
}

/**
 * 2. Interactive ROI & Conversion Lift Calculator
 */
function initROICalculator() {
    const trafficSlider = document.getElementById('traffic-slider');
    const conversionSlider = document.getElementById('conversion-slider');
    const aovSlider = document.getElementById('aov-slider');

    const trafficVal = document.getElementById('traffic-val');
    const conversionVal = document.getElementById('conversion-val');
    const aovVal = document.getElementById('aov-val');

    const currentRevenueEl = document.getElementById('current-revenue');
    const projectedRevenueEl = document.getElementById('project-revenue');
    const revenueLiftEl = document.getElementById('revenue-lift');

    if (!trafficSlider || !conversionSlider || !aovSlider) return;

    let prevCurrentRevenue = 13500;
    let prevProjectedRevenue = 22815;
    let prevLift = 9315;

    // Smooth count-up counter animation
    function animateValue(element, start, end, duration, formatPrefix = '$', isPositiveSign = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            const formatted = formatPrefix + (isPositiveSign && value >= 0 ? '+' : '') + value.toLocaleString();
            element.textContent = formatted;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function calculateROI() {
        const traffic = parseInt(trafficSlider.value);
        const conversion = parseFloat(conversionSlider.value);
        const aov = parseInt(aovSlider.value);

        // Update slider values
        trafficVal.textContent = traffic.toLocaleString();
        conversionVal.textContent = `${conversion.toFixed(1)}%`;
        aovVal.textContent = `$${aov}`;

        // Calculations
        const currentRevenue = Math.round(traffic * (conversion / 100) * aov);
        
        // Assume 30% increase boost across both channels
        const optTraffic = traffic * 1.3;
        const optConversion = conversion * 1.3;
        const projectedRevenue = Math.round(optTraffic * (optConversion / 100) * aov);
        
        const netLift = projectedRevenue - currentRevenue;

        // Animate count-up numbers
        animateValue(currentRevenueEl, prevCurrentRevenue, currentRevenue, 400);
        animateValue(projectedRevenueEl, prevProjectedRevenue, projectedRevenue, 400);
        animateValue(revenueLiftEl, prevLift, netLift, 400, '+');

        prevCurrentRevenue = currentRevenue;
        prevProjectedRevenue = projectedRevenue;
        prevLift = netLift;
    }

    // Attach slider listeners
    trafficSlider.addEventListener('input', calculateROI);
    conversionSlider.addEventListener('input', calculateROI);
    aovSlider.addEventListener('input', calculateROI);

    // Initial load
    calculateROI();
}

/**
 * 3. Contact Form Dispatch feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-ad-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Transmitting...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.textContent = 'Transmitted [Ink Dry]';
            submitBtn.style.backgroundColor = 'var(--accent-green)';
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
