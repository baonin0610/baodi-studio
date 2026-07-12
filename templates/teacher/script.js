/* ==========================================================================
   Teacher Portfolio JS Script
   Huong Le — Binder Tabs Switching & Blackboard Quiz
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initDraggableNotes();
    initBlackboardQuiz();
    initBinderTabs();
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

    const links = document.querySelectorAll('a, button, input, textarea, select, .sticky-note, .quiz-option, .tab-trigger');
    links.forEach(l => {
        l.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            const desc = l.classList.contains('tab-trigger') ? 'FLIP PAGE' : 
                         l.classList.contains('sticky-note') ? 'DRAG' : 'SELECT';
            cursorText.textContent = desc;
        });
        l.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorText.textContent = '';
        });
    });
}

/**
 * 2. Binder Tabs Page Flipping System
 */
function initBinderTabs() {
    const triggers = document.querySelectorAll('.tab-trigger');
    const panels = document.querySelectorAll('.tab-panel');
    const leftPanels = document.querySelectorAll('.left-panel');
    const leaf = document.getElementById('flipping-leaf');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetTab = trigger.getAttribute('data-tab');

            // Trigger the 3D page turn animation of the leaf sheet (starts right, rotates to left -180deg)
            if (leaf) {
                leaf.classList.remove('flip-animation');
                void leaf.offsetWidth; // Trigger reflow to restart CSS keyframe animation
                leaf.classList.add('flip-animation');
            }

            // Swap contents halfway through the 700ms flip animation (at 350ms, vertical at spine)
            setTimeout(() => {
                // Set active tab trigger
                triggers.forEach(t => t.classList.remove('active'));
                trigger.classList.add('active');

                // Transition right-page panels
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.getAttribute('id') === `panel-${targetTab}`) {
                        panel.classList.add('active');
                    }
                });

                // Transition left-page panels
                leftPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.getAttribute('id') === `left-panel-${targetTab}`) {
                        panel.classList.add('active');
                    }
                });
            }, 350);

            // Clean up class after animation completes (at 700ms)
            setTimeout(() => {
                if (leaf) {
                    leaf.classList.remove('flip-animation');
                }
            }, 700);
        });
    });
}

/**
 * 3. Drag and Drop Sticky Notes Logic
 */
function initDraggableNotes() {
    const desk = document.querySelector('.sticky-notes-desk');
    const notes = document.querySelectorAll('.sticky-note');
    if (!desk || notes.length === 0) return;

    let activeNote = null;
    let offset = { x: 0, y: 0 };
    let highestZIndex = 10;

    notes.forEach(note => {
        note.addEventListener('mousedown', dragStart);
        note.addEventListener('touchstart', dragStart, { passive: true });
    });

    function dragStart(e) {
        if (window.innerWidth <= 768) return;

        activeNote = this;
        highestZIndex++;
        activeNote.style.zIndex = highestZIndex;

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        const rect = activeNote.getBoundingClientRect();
        offset.x = clientX - rect.left;
        offset.y = clientY - rect.top;

        window.addEventListener('mousemove', dragMove);
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);
    }

    function dragMove(e) {
        if (!activeNote) return;
        if (e.cancelable) e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const deskRect = desk.getBoundingClientRect();
        
        let left = clientX - deskRect.left - offset.x;
        let top = clientY - deskRect.top - offset.y;

        const maxLeft = deskRect.width - activeNote.offsetWidth;
        const maxTop = deskRect.height - activeNote.offsetHeight;

        left = Math.max(0, Math.min(left, maxLeft));
        top = Math.max(0, Math.min(top, maxTop));

        activeNote.style.left = `${left}px`;
        activeNote.style.top = `${top}px`;
    }

    function dragEnd() {
        activeNote = null;
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('touchmove', dragMove);
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchend', dragEnd);
    }
}

/**
 * 4. Blackboard Interactive Literature Quiz
 */
function initBlackboardQuiz() {
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');
    if (options.length === 0 || !feedback) return;

    let audioCtx = null;

    function playChalkSound(isCorrect) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;

            if (isCorrect) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(900, now);
                osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
                osc.frequency.setValueAtTime(1100, now + 0.12);
                osc.frequency.exponentialRampToValueAtTime(1500, now + 0.25);

                gain.gain.setValueAtTime(0.01, now);
                gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(now + 0.35);
            } else {
                const bufferSize = audioCtx.sampleRate * 0.2;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 2200;
                filter.Q.value = 4.0;

                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);

                noise.start();
                noise.stop(now + 0.2);
            }
        } catch (err) {
            console.warn('Web Audio synthesis failed: ', err);
        }
    }

    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            const isCorrect = option.getAttribute('data-correct') === 'true';

            playChalkSound(isCorrect);

            if (isCorrect) {
                feedback.innerHTML = '<span style="color: #81C784; font-weight: 700;">CORRECT!</span> Personification attributes human dancing characteristics to the leaves.';
            } else {
                feedback.innerHTML = '<span style="color: #E57373; font-weight: 700;">INCORRECT.</span> Try again! Metaphors make direct comparisons; personifications attribute life behaviors.';
            }
        });
    });
}

/**
 * 5. Contact Form Dispatch feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Transmitting...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.textContent = 'Transmitted [Grade A+]';
            submitBtn.style.backgroundColor = 'var(--pencil-red)';
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
