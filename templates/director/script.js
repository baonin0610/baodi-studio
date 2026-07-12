/* ==========================================================================
   Creative Director Portfolio JS Script
   Khanh Linh — Autopilot Slide Transitions & Synthesized Projector Clicks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLensCursor();
    initProjectorPlayback();
    initInquiryBox();
    initContactForm();
});

/**
 * 1. Lens aperture trailing cursor
 */
function initLensCursor() {
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

    const targets = document.querySelectorAll('button, input, textarea, a, .timeline-track');
    targets.forEach(t => {
        t.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorText.textContent = t.classList.contains('control-btn') ? 'ACTION' : 'SELECT';
        });
        t.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorText.textContent = '';
        });
    });
}

/**
 * 2. Autopilot Cinematic Projector & Playback Timeline
 */
function initProjectorPlayback() {
    const slides = document.querySelectorAll('.projector-slide');
    const hudTitle = document.getElementById('hud-slide-title');
    const hudConcept = document.getElementById('hud-slide-concept');
    const hudNote = document.getElementById('hud-slide-note');
    
    const playhead = document.getElementById('timeline-playhead');
    const timelineTrack = document.getElementById('timeline-track');
    
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnPrev = document.getElementById('btn-prev-slide');
    const btnNext = document.getElementById('btn-next-slide');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('playback-status-text');

    if (slides.length === 0) return;

    let currentSlideIdx = 0;
    let isPlaying = true;
    let frameCount = 1;
    
    // Slide transition timers
    const slideDuration = 5000; // 5 seconds per slide
    let lastTransitionTime = performance.now();
    let elapsedInSlide = 0;
    let animationFrameId = null;

    // Web Audio Synthesizer variables
    let audioCtx = null;
    let motorOsc = null;
    let motorGain = null;

    // Director Notes presets (matching concepts)
    const directorNotes = [
        "Focus on raw textures and extreme shadows. Kodak 500T. Shift lens scale offset 2.5.",
        "Composition follows golden ratio lines. Soft focus background contrasts structural concrete.",
        "Frame layout balances structural steel pipes and spatial dark soundscape zones."
    ];

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Synthesize physical projector motor hum drone
    function startProjectorMotorHum() {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Low frequency rumble hum
            motorOsc = ctx.createOscillator();
            motorOsc.type = 'sawtooth';
            motorOsc.frequency.setValueAtTime(45, now);

            // Filter out harsh high-frequencies to create a warm rumble
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(120, now);

            // Subtle volume gain
            motorGain = ctx.createGain();
            motorGain.gain.setValueAtTime(0.015, now);

            // Modulate motor speed/pitch dynamically to mimic rotation flutter
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 8.0;
            lfoGain.gain.value = 2.0;

            lfo.connect(lfoGain);
            lfoGain.connect(motorOsc.frequency);

            motorOsc.connect(filter);
            filter.connect(motorGain);
            motorGain.connect(ctx.destination);

            lfo.start();
            motorOsc.start();
        } catch (err) {
            console.warn('Web Audio synthesis failed: ', err);
        }
    }

    function stopProjectorMotorHum() {
        if (motorOsc && motorGain) {
            const ctx = getAudioContext();
            motorGain.gain.setValueAtTime(motorGain.gain.value, ctx.currentTime);
            motorGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            
            const oscToStop = motorOsc;
            setTimeout(() => {
                try { oscToStop.stop(); } catch(e){}
            }, 350);
            
            motorOsc = null;
            motorGain = null;
        }
    }

    // Synthesize the loud projector mechanical slide change "CLACK"
    function playProjectorClack() {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // 1. High frequency switch snap
            const snapOsc = ctx.createOscillator();
            const snapGain = ctx.createGain();
            snapOsc.type = 'triangle';
            snapOsc.frequency.setValueAtTime(450, now);
            snapOsc.frequency.exponentialRampToValueAtTime(10, now + 0.08);

            snapGain.gain.setValueAtTime(0.38, now);
            snapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

            snapOsc.connect(snapGain);
            snapGain.connect(ctx.destination);

            snapOsc.start();
            snapOsc.stop(now + 0.1);

            // 2. Heavy spring metallic thud
            const thudBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
            const thudData = thudBuffer.getChannelData(0);
            for (let i = 0; i < thudBuffer.length; i++) {
                thudData[i] = Math.random() * 2 - 1;
            }
            const thudSource = ctx.createBufferSource();
            thudSource.buffer = thudBuffer;

            const thudFilter = ctx.createBiquadFilter();
            thudFilter.type = 'bandpass';
            thudFilter.frequency.value = 180;
            thudFilter.Q.value = 3.5;

            const thudGain = ctx.createGain();
            thudGain.gain.setValueAtTime(0.18, now);
            thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

            thudSource.connect(thudFilter);
            thudFilter.connect(thudGain);
            thudGain.connect(ctx.destination);

            thudSource.start();
            thudSource.stop(now + 0.16);
        } catch (err) {
            console.warn(err);
        }
    }

    // Switch Projector Slides
    function setSlide(index) {
        if (index === currentSlideIdx) return;
        
        // Clack sound
        playProjectorClack();

        // Update active classes
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');

        // Fetch meta details from node attributes
        const activeNode = slides[index];
        const title = activeNode.getAttribute('data-title');
        const concept = activeNode.getAttribute('data-concept');

        // Slide out (fade and blur)
        hudTitle.classList.add('slide-out');
        hudConcept.style.opacity = '0';
        hudConcept.style.transform = 'translateY(10px)';
        hudConcept.style.filter = 'blur(5px)';

        setTimeout(() => {
            // Update details
            hudTitle.textContent = title;
            hudConcept.textContent = concept;
            hudNote.textContent = directorNotes[index];

            // Slide back in
            hudTitle.classList.remove('slide-out');
            hudConcept.style.opacity = '1';
            hudConcept.style.transform = 'translateY(0)';
            hudConcept.style.filter = 'blur(0)';
            hudConcept.style.transition = 'opacity 0.8s ease, transform 0.8s ease, filter 0.8s ease';
        }, 300);

        currentSlideIdx = index;
        lastTransitionTime = performance.now();
        elapsedInSlide = 0;
    }

    // Autoplay Loop Tick
    function tick(timestamp) {
        frameCount++;

        if (isPlaying) {
            elapsedInSlide = timestamp - lastTransitionTime;
            
            if (elapsedInSlide >= slideDuration) {
                // Next Slide
                const nextIdx = (currentSlideIdx + 1) % slides.length;
                setSlide(nextIdx);
            }

            // Sync playhead progress line
            const percentage = Math.max(0, Math.min((elapsedInSlide / slideDuration) * 100, 100));
            playhead.style.left = `${percentage}%`;

            // Sync HUD frames
            statusText.textContent = `PLAYING // FRAME ${String(frameCount).padStart(4, '0')}`;
        }

        animationFrameId = requestAnimationFrame(tick);
    }

    // Playback control events
    btnPlay.addEventListener('click', () => {
        if (!isPlaying) {
            getAudioContext();
            startProjectorMotorHum();

            isPlaying = true;
            btnPlay.classList.add('active');
            btnPause.classList.remove('active');
            statusDot.classList.add('blinking');
            
            // Sync time tracker
            lastTransitionTime = performance.now() - elapsedInSlide;
        }
    });

    btnPause.addEventListener('click', () => {
        if (isPlaying) {
            stopProjectorMotorHum();

            isPlaying = false;
            btnPause.classList.add('active');
            btnPlay.classList.remove('active');
            statusDot.classList.remove('blinking');
            statusText.textContent = 'PAUSED';
        }
    });

    // Timeline Scrubbing click
    timelineTrack.addEventListener('click', (e) => {
        const rect = timelineTrack.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min((mouseX / rect.width) * 100, 100));

        // Sync visual playhead
        playhead.style.left = `${percentage}%`;

        // Calculate targeted slide frame
        const totalDuration = slideDuration * slides.length;
        const absoluteTime = (percentage / 100) * totalDuration;
        
        const targetSlideIdx = Math.floor(absoluteTime / slideDuration) % slides.length;
        const targetElapsed = absoluteTime % slideDuration;

        // Apply slide change
        if (targetSlideIdx !== currentSlideIdx) {
            setSlide(targetSlideIdx);
        }

        elapsedInSlide = targetElapsed;
        lastTransitionTime = performance.now() - targetElapsed;
    });

    // Left & Right arrow navigation buttons click listeners
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            getAudioContext();
            const prevIdx = (currentSlideIdx - 1 + slides.length) % slides.length;
            setSlide(prevIdx);
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            getAudioContext();
            const nextIdx = (currentSlideIdx + 1) % slides.length;
            setSlide(nextIdx);
        });
    }

    // Initialize state
    btnPlay.classList.add('active');
    btnPause.classList.remove('active');
    
    // Start tick
    animationFrameId = requestAnimationFrame(tick);
}

/**
 * 3. Inquiry Panel Slide drawer toggles
 */
function initInquiryBox() {
    const triggerBtn = document.getElementById('open-inquiry-btn-trigger');
    const closeBtn = document.getElementById('close-inquiry-btn');
    const box = document.getElementById('inquiry-box');

    if (!triggerBtn || !closeBtn || !box) return;

    triggerBtn.addEventListener('click', () => {
        box.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        box.classList.remove('active');
    });
}

/**
 * 4. Contact Form Dispatcher feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-inquiry-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Transmitting proposal...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.textContent = 'Transmitted [Projection Safe]';
            submitBtn.style.backgroundColor = 'var(--accent-gold)';
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
