/* ==========================================================================
   Sound Designer Portfolio JS Script
   Minh Nguyen — Console Dashboard Tape Mechanism
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initWebAudioSystem();
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

    const links = document.querySelectorAll('a, button, input, textarea, select, .cassette-tape, .toggle-pad-item, range');
    links.forEach(l => {
        l.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            const desc = l.classList.contains('cassette-tape') ? 'LOAD TAPE' : 
                         l.classList.contains('toggle-pad-item') ? 'TRIGGER' : 'SELECT';
            cursorText.textContent = desc;
        });
        l.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorText.textContent = '';
        });
    });
}

/**
 * 2. Web Audio API Synthesis Engine & Cassette Player Mechanism
 */
function initWebAudioSystem() {
    let audioCtx = null;
    let mainAnalyser = null;
    
    // Ambient Osc Nodes
    let currentAmbientOsc = null;
    let currentAmbientGain = null;
    let tapeHissNode = null;
    let tapeHissGain = null;
    
    // Playback active states
    let activeTrack = null; // 'ambient', 'sfx', 'branding'
    
    // UI elements
    const cassetteWindow = document.getElementById('cassette-window');
    const playingTitle = document.getElementById('playing-title');
    const btnPlay = document.getElementById('btn-play-hero');
    const btnStop = document.getElementById('btn-stop');

    // Synth Dials
    const cutoffSlider = document.getElementById('cutoff-slider');
    const qSlider = document.getElementById('q-slider');
    const pitchSlider = document.getElementById('pitch-slider');

    const cutoffVal = document.getElementById('cutoff-val');
    const qVal = document.getElementById('q-val');
    const pitchVal = document.getElementById('pitch-val');

    cutoffSlider.addEventListener('input', (e) => cutoffVal.textContent = `${e.target.value} Hz`);
    qSlider.addEventListener('input', (e) => qVal.textContent = e.target.value);
    pitchSlider.addEventListener('input', (e) => pitchVal.textContent = `${e.target.value} Hz`);

    // Audio Context lazy getter
    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            mainAnalyser = audioCtx.createAnalyser();
            mainAnalyser.fftSize = 254;
            mainAnalyser.connect(audioCtx.destination);
            initOscilloscope(mainAnalyser);
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Oscilloscope visualizer renderer loop
    function initOscilloscope(analyser) {
        const canvas = document.getElementById('scope-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        let width = (canvas.width = canvas.parentElement.clientWidth);
        let height = (canvas.height = 120);

        window.addEventListener('resize', () => {
            width = (canvas.width = canvas.parentElement.clientWidth);
        });

        function draw() {
            requestAnimationFrame(draw);
            
            analyser.getByteTimeDomainData(dataArray);
            
            ctx.fillStyle = '#061211'; // CRT Screen Glow
            ctx.fillRect(0, 0, width, height);

            // Grid lines
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
            ctx.lineWidth = 1;
            
            for(let x = 0; x < width; x += 30) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for(let y = 0; y < height; y += 30) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw wave
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = '#10B981'; // Classic Phosphor Green
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#10B981';
            ctx.beginPath();
            
            const sliceWidth = width / bufferLength;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                
                // Add subtle simulated flutter noise when no active playback is running
                if (!activeTrack) {
                    const noise = (Math.random() - 0.5) * 0.04;
                    v += noise;
                }

                const y = (v * height) / 2;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                x += sliceWidth;
            }
            
            ctx.lineTo(width, height / 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        draw();
    }

    // Play physical cassette load clack sound
    function playClackSound() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.08);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(mainAnalyser);

        osc.start();
        osc.stop(now + 0.1);
    }

    /* Generative Audio Nodes with Flutter & Tape Hiss Simulation */

    // Generate warm tape hiss
    function startTapeHiss(ctx) {
        const bufferSize = ctx.sampleRate * 2.0; // 2s hiss loop
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() - 0.5) * 0.015;
        }
        
        tapeHissNode = ctx.createBufferSource();
        tapeHissNode.buffer = buffer;
        tapeHissNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        tapeHissGain = ctx.createGain();
        tapeHissGain.gain.setValueAtTime(0.01, ctx.currentTime);
        tapeHissGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);

        tapeHissNode.connect(filter);
        filter.connect(tapeHissGain);
        tapeHissGain.connect(mainAnalyser);

        tapeHissNode.start();
    }

    function stopTapeHiss() {
        if (tapeHissGain && tapeHissNode) {
            const ctx = getAudioContext();
            tapeHissGain.gain.setValueAtTime(tapeHissGain.gain.value, ctx.currentTime);
            tapeHissGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            const nodeToStop = tapeHissNode;
            setTimeout(() => {
                nodeToStop.stop();
            }, 350);
            
            tapeHissNode = null;
            tapeHissGain = null;
        }
    }

    // Sound 1: Vintage triangle ambient loop with pitch wow-flutter modulation
    function startAmbientReel() {
        const ctx = getAudioContext();
        
        currentAmbientOsc = ctx.createOscillator();
        currentAmbientGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        currentAmbientOsc.type = 'triangle';
        const baseFreq = 110; // Low A note
        currentAmbientOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(cutoffSlider.value, ctx.currentTime);
        filter.Q.setValueAtTime(qSlider.value, ctx.currentTime);

        // Bind knobs
        cutoffSlider.addEventListener('input', (e) => {
            filter.frequency.setValueAtTime(parseFloat(e.target.value), ctx.currentTime);
        });
        qSlider.addEventListener('input', (e) => {
            filter.Q.setValueAtTime(parseFloat(e.target.value), ctx.currentTime);
        });

        // Slow fade envelope
        currentAmbientGain.gain.setValueAtTime(0.01, ctx.currentTime);
        currentAmbientGain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 1.2);

        // Simulating Tape Wow & Flutter via LFO pitch modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 6.0; // 6Hz flutter speed
        lfoGain.gain.value = 1.8;  // Pitch flutter depth
        
        lfo.connect(lfoGain);
        lfoGain.connect(currentAmbientOsc.frequency);

        currentAmbientOsc.connect(filter);
        filter.connect(currentAmbientGain);
        currentAmbientGain.connect(mainAnalyser);

        lfo.start();
        currentAmbientOsc.start();
        
        startTapeHiss(ctx);
    }

    function stopAmbientReel() {
        stopTapeHiss();
        if (currentAmbientGain && currentAmbientOsc) {
            const ctx = getAudioContext();
            currentAmbientGain.gain.setValueAtTime(currentAmbientGain.gain.value, ctx.currentTime);
            currentAmbientGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
            
            const oscToStop = currentAmbientOsc;
            setTimeout(() => {
                oscToStop.stop();
            }, 650);
            
            currentAmbientOsc = null;
            currentAmbientGain = null;
        }
    }

    // Sound 2: Retro warm bleep sequences
    let sfxInterval = null;
    function startSFXSequence() {
        const ctx = getAudioContext();
        startTapeHiss(ctx);

        function triggerBeep() {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            const baseFreq = Math.random() * 400 + 300;
            osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);

            osc.connect(gain);
            gain.connect(mainAnalyser);

            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        }

        triggerBeep();
        sfxInterval = setInterval(triggerBeep, 800);
    }

    function stopSFXSequence() {
        stopTapeHiss();
        if (sfxInterval) {
            clearInterval(sfxInterval);
            sfxInterval = null;
        }
    }

    // Sound 3: Warm arpeggiated brand identity logo chime
    let brandingInterval = null;
    function startSonicBranding() {
        const ctx = getAudioContext();
        startTapeHiss(ctx);

        function triggerChime() {
            const now = ctx.currentTime;
            const notes = [220.00, 277.18, 329.63, 440.00]; // A major chord
            
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.18);

                gain.gain.setValueAtTime(0.01, now);
                gain.gain.setValueAtTime(0.12, now + idx * 0.18);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.18 + 1.5);

                osc.connect(gain);
                gain.connect(mainAnalyser);

                osc.start(now + idx * 0.18);
                osc.stop(now + idx * 0.18 + 1.6);
            });
        }

        triggerChime();
        brandingInterval = setInterval(triggerChime, 3200);
    }

    function stopSonicBranding() {
        stopTapeHiss();
        if (brandingInterval) {
            clearInterval(brandingInterval);
            brandingInterval = null;
        }
    }

    // Playback tape triggers
    const cassettes = document.querySelectorAll('.cassette-tape');
    cassettes.forEach(sleeve => {
        const trackType = sleeve.getAttribute('data-track');
        const title = sleeve.getAttribute('data-title');

        sleeve.addEventListener('click', () => {
            const isPlaying = (activeTrack === trackType);

            stopAllTapePlaybacks();

            if (!isPlaying) {
                activeTrack = trackType;
                
                // Play load clack sound
                playClackSound();

                // Update Cassette Deck Casing UI states
                cassettes.forEach(s => s.classList.remove('active'));
                sleeve.classList.add('active');
                
                cassetteWindow.classList.add('playing');
                playingTitle.textContent = title;
                btnPlay.classList.add('active');

                // Trigger synth loops
                if (trackType === 'ambient') startAmbientReel();
                else if (trackType === 'sfx') startSFXSequence();
                else if (trackType === 'branding') startSonicBranding();
            }
        });
    });

    // Casing hardware control buttons
    btnPlay.addEventListener('click', () => {
        if (!activeTrack) {
            activeTrack = 'ambient';
            const defaultSleeve = document.querySelector('[data-track="ambient"]');
            if (defaultSleeve) defaultSleeve.classList.add('active');
            
            playClackSound();
            cassetteWindow.classList.add('playing');
            playingTitle.textContent = 'TAPE ECHOES';
            btnPlay.classList.add('active');
            
            startAmbientReel();
        }
    });

    btnStop.addEventListener('click', () => {
        stopAllTapePlaybacks();
    });

    function stopAllTapePlaybacks() {
        cassettes.forEach(s => s.classList.remove('active'));
        cassetteWindow.classList.remove('playing');
        playingTitle.textContent = 'SYSTEM STANDBY';
        btnPlay.classList.remove('active');

        if (activeTrack === 'ambient') stopAmbientReel();
        else if (activeTrack === 'sfx') stopSFXSequence();
        else if (activeTrack === 'branding') stopSonicBranding();

        activeTrack = null;
    }

    /* Drum Machine Synthesizers (Moog hardware bleeps) */
    function triggerDrumHit(padType) {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        if (padType === 'kick') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);

            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc.connect(gain);
            gain.connect(mainAnalyser);

            osc.start();
            osc.stop(now + 0.4);
        }
        else if (padType === 'snare') {
            const bufferSize = ctx.sampleRate * 0.18;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1100;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(mainAnalyser);

            noise.start();
            noise.stop(now + 0.2);
        }
        else if (padType === 'hihat') {
            const bufferSize = ctx.sampleRate * 0.05;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 8000;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

            source.connect(filter);
            filter.connect(gain);
            gain.connect(mainAnalyser);

            source.start();
            source.stop(now + 0.05);
        }
        else if (padType === 'beep') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            const currentPitch = parseFloat(pitchSlider.value);
            osc.frequency.setValueAtTime(currentPitch, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.connect(gain);
            gain.connect(mainAnalyser);

            osc.start();
            osc.stop(now + 0.35);
        }
    }

    // Drum Pad Mouse click listeners
    const toggles = document.querySelectorAll('.toggle-pad-item');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const padType = toggle.getAttribute('data-pad');
            toggle.classList.add('active');
            triggerDrumHit(padType);
            
            setTimeout(() => {
                toggle.classList.remove('active');
            }, 180);
        });
    });

    // Keyboard trigger listeners
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        const code = e.code;
        let padType = null;
        let padEl = null;

        if (code === 'KeyA') { padType = 'kick'; padEl = document.querySelector('[data-pad="kick"]'); }
        else if (code === 'KeyS') { padType = 'snare'; padEl = document.querySelector('[data-pad="snare"]'); }
        else if (code === 'KeyD') { padType = 'hihat'; padEl = document.querySelector('[data-pad="hihat"]'); }
        else if (code === 'KeyF') { padType = 'beep'; padEl = document.querySelector('[data-pad="beep"]'); }

        if (padType && padEl) {
            e.preventDefault();
            padEl.classList.add('active');
            triggerDrumHit(padType);

            setTimeout(() => {
                padEl.classList.remove('active');
            }, 180);
        }
    });

    // Web MIDI API integration
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }

    function onMIDISuccess(midiAccess) {
        const inputs = midiAccess.inputs.values();
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = onMIDIMessage;
        }

        midiAccess.onstatechange = (e) => {
            if (e.port.type === 'input' && e.port.state === 'connected') {
                e.port.onmidimessage = onMIDIMessage;
            }
        };
    }

    function onMIDIFailure() {
        console.warn('Could not access MIDI devices.');
    }

    function onMIDIMessage(message) {
        const command = message.data[0];
        const note = message.data[1];
        const velocity = message.data.length > 2 ? message.data[2] : 0;

        if (command === 144 && velocity > 0) {
            getAudioContext();
            
            if (note % 4 === 0) {
                triggerMidiDrumHit('kick');
            } else if (note % 4 === 1) {
                triggerMidiDrumHit('snare');
            } else if (note % 4 === 2) {
                triggerMidiDrumHit('hihat');
            } else if (note % 4 === 3) {
                triggerMidiDrumHit('beep', note);
            }
        }
    }

    function triggerMidiDrumHit(padType, noteNum = 60) {
        const padEl = document.querySelector(`[data-pad="${padType}"]`);
        if (padEl) {
            padEl.classList.add('active');
            setTimeout(() => padEl.classList.remove('active'), 180);
        }

        if (padType === 'beep') {
            const freq = 440 * Math.pow(2, (noteNum - 69) / 12);
            pitchSlider.value = Math.round(Math.max(100, Math.min(600, freq)));
            pitchVal.textContent = `${Math.round(pitchSlider.value)} Hz`;
        }

        triggerDrumHit(padType);
    }
}

/**
 * 3. Contact Form Dispatch feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.flat-submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Transmitting...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            submitBtn.textContent = 'Transmitted [200 OK]';
            submitBtn.style.backgroundColor = 'var(--accent-terracotta)';
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
