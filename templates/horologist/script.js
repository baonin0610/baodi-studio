/* ==========================================================================
   Chronos Watchmaker Portfolio JS Script
   Minh Tri — Gear Rotations & Synthesized Clock Ticking Loops
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCogCursor();
    initWatchMechanism();
    initContactForm();
});

/**
 * 1. Cog Trailing Mouse Cursor
 */
function initCogCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    let mouse = { x: 0, y: 0 };
    let cursorCoords = { x: 0, y: 0 };
    let rotation = 0;
    const lerpFactor = 0.12;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function updateCursor() {
        cursorCoords.x += (mouse.x - cursorCoords.x) * lerpFactor;
        cursorCoords.y += (mouse.y - cursorCoords.y) * lerpFactor;
        
        // Spin the cog based on mouse movement speed
        const deltaX = mouse.x - cursorCoords.x;
        const deltaY = mouse.y - cursorCoords.y;
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        rotation += speed * 0.15;

        cursor.style.left = `${cursorCoords.x}px`;
        cursor.style.top = `${cursorCoords.y}px`;
        cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Hover scales
    const hoverables = document.querySelectorAll('button, input, textarea, a, .nav-dial-btn');
    hoverables.forEach(h => {
        h.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        h.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });
}

/**
 * 2. Watch Mechanism System (Gear Rotations, Clock Hands, & Synthesized Ticks)
 */
function initWatchMechanism() {
    const dialBtns = document.querySelectorAll('.nav-dial-btn');
    const panels = document.querySelectorAll('.info-panel');
    
    // Background Cogs SVG
    const gearLarge = document.getElementById('gear-large');
    const gearMedium = document.getElementById('gear-medium');
    const gearSmall = document.getElementById('gear-small');

    // Watch Hands
    const handHour = document.getElementById('hand-hour');
    const handMinute = document.getElementById('hand-minute');
    const handSecond = document.getElementById('hand-second');

    // Sound controls
    const soundToggle = document.getElementById('sound-toggle');
    const soundStatus = document.getElementById('sound-status');

    if (dialBtns.length === 0) return;

    let activeSection = 'bio';
    let currentLargeAngle = 0;
    let currentMediumAngle = 0;
    let currentSmallAngle = 0;

    // Web Audio Synthesizer variables
    let audioCtx = null;
    let isSoundOn = false;
    let tickInterval = null;
    let tickCount = 0;

    // Navigation sections coordinates mapping (Hours, Minutes rotation angles)
    const timeTargetAngles = {
        bio:       { hour: 0,   minute: 0 },   // XII (12:00)
        projects:  { hour: 90,  minute: 180 }, // III (3:30)
        mechanism: { hour: 180, minute: 0 },   // VI (6:00)
        contact:   { hour: 270, minute: 180 }  // IX (9:30)
    };

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Synthesize physical watch gear-ticking clacks
    function playTickSound(isHighTick) {
        if (!isSoundOn) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Pitch envelope oscillator
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            // Tick is high frequency sweep, Tock is lower frequency sweep
            const startFreq = isHighTick ? 950 : 680;
            
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.008);

            // Volume decay (very fast mechanical snap)
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.012);
        } catch (e) {
            console.warn(e);
        }
    }

    // Synthesize gear winding sound when clicking sections
    function playWindingClacks() {
        if (!isSoundOn) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Chain 3 small clicks in succession
            for (let i = 0; i < 3; i++) {
                const clickTime = now + (i * 0.08);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320 + (i * 120), clickTime);
                osc.frequency.exponentialRampToValueAtTime(10, clickTime + 0.02);

                gain.gain.setValueAtTime(0.08, clickTime);
                gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(clickTime);
                osc.stop(clickTime + 0.022);
            }
        } catch (e) {}
    }

    // Tick Interval Driver (Steady Ticking)
    function startTickingLoop() {
        if (tickInterval) clearInterval(tickInterval);
        
        let secAngle = 0;
        tickInterval = setInterval(() => {
            // Seconds hand rotates exactly 6 degrees per tick (60 ticks = 360 degrees)
            secAngle = (secAngle + 6) % 360;
            if (handSecond) {
                handSecond.style.transform = `rotate(${secAngle}deg)`;
            }

            tickCount++;
            // alternate tick/tock sound frequencies
            playTickSound(tickCount % 2 === 0);
        }, 1000);
    }

    // Winding crown/dial click trigger
    function selectSection(targetId) {
        if (targetId === activeSection) return;

        // Play winding clicks
        playWindingClacks();

        // 1. Swap text panels
        panels.forEach(p => p.classList.remove('active'));
        const activePanel = document.getElementById(`panel-${targetId}`);
        if (activePanel) activePanel.classList.add('active');

        // 2. Rotate interlocking background cogs
        // Large drives medium (reverse), which drives small (speed forward)
        currentLargeAngle += 90;
        currentMediumAngle -= 135;  // Reverse rotation (gear ratio 1.5)
        currentSmallAngle += 270;   // Speed rotation (gear ratio 3.0)

        if (gearLarge) gearLarge.style.transform = `rotate(${currentLargeAngle}deg)`;
        if (gearMedium) gearMedium.style.transform = `rotate(${currentMediumAngle}deg)`;
        if (gearSmall) gearSmall.style.transform = `rotate(${currentSmallAngle}deg)`;

        // 3. Align watch hands
        const targetTime = timeTargetAngles[targetId];
        if (targetTime) {
            if (handHour) handHour.style.transform = `rotate(${targetTime.hour}deg)`;
            if (handMinute) handMinute.style.transform = `rotate(${targetTime.minute}deg)`;
        }

        activeSection = targetId;
    }

    // Attach Dial buttons click handlers
    dialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Audio context trigger on first user click
            getAudioContext();

            dialBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');
            selectSection(target);
        });
    });

    // Sound toggle button listener
    soundToggle.addEventListener('click', () => {
        getAudioContext();
        isSoundOn = !isSoundOn;

        if (isSoundOn) {
            soundStatus.textContent = 'ON';
            soundToggle.style.borderColor = 'var(--metal-gold)';
            soundToggle.style.color = 'var(--metal-gold)';
        } else {
            soundStatus.textContent = 'OFF';
            soundToggle.style.borderColor = 'var(--metal-bronze)';
            soundToggle.style.color = 'var(--text-muted)';
        }
    });

    // Cabinet Expand/Retract Drawer logic
    const cabinetToggle = document.getElementById('cabinet-toggle');
    const closeCabinet = document.getElementById('close-cabinet');
    const container = document.querySelector('.watch-chassis-container');
    const cabinetStatus = document.getElementById('cabinet-status');

    function toggleCabinet() {
        getAudioContext();
        // Play winding clicks
        playWindingClacks();

        if (container) {
            container.classList.toggle('cabinet-expanded');
            const isExpanded = container.classList.contains('cabinet-expanded');
            
            if (cabinetStatus) {
                cabinetStatus.textContent = isExpanded ? 'EXPANDED' : 'RETRACTED';
            }
            if (cabinetToggle) {
                if (isExpanded) {
                    cabinetToggle.style.borderColor = 'var(--metal-gold)';
                    cabinetToggle.style.color = 'var(--metal-gold)';
                } else {
                    cabinetToggle.style.borderColor = 'var(--metal-bronze)';
                    cabinetToggle.style.color = 'var(--text-muted)';
                }
            }
        }
    }

    if (cabinetToggle) cabinetToggle.addEventListener('click', toggleCabinet);
    if (closeCabinet) closeCabinet.addEventListener('click', toggleCabinet);

    // Initialize clock hands position (at Bio: XII)
    if (handHour) handHour.style.transform = 'rotate(0deg)';
    if (handMinute) handMinute.style.transform = 'rotate(0deg)';

    // Start ticking driver
    startTickingLoop();
}

/**
 * 3. Contact Form Submission Dispatcher
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Transmitting specs...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.textContent = 'Specs Transmitted [Caliber Locked]';
            submitBtn.style.backgroundColor = 'var(--metal-steel)';
            submitBtn.style.color = '#000';

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
