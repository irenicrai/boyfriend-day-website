/* ==========================================================================
   HAPPY NATIONAL BOYFRIEND DAY - INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeartCanvas();
    initLoveTimer();
    initEnvelopeInteraction();
    initAudioSynthesizer();
    initQuizGame();
    initCustomizationSystem();
    initPolaroidLightbox();
    initToastActions();
});

/* ==========================================================================
   1. FLOATING HEART CANVAS & SPARKLE CURSOR
   ========================================================================== */
function initHeartCanvas() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const hearts = [];
    const maxHearts = 35;

    class Heart {
        constructor(x, y, isMouseCreated = false) {
            this.x = x || Math.random() * width;
            this.y = y || height + Math.random() * 20;
            this.size = isMouseCreated ? Math.random() * 12 + 10 : Math.random() * 14 + 8;
            this.speedY = isMouseCreated ? -(Math.random() * 2 + 1) : -(Math.random() * 1.2 + 0.5);
            this.speedX = Math.random() * 1.5 - 0.75;
            this.opacity = isMouseCreated ? 1 : Math.random() * 0.7 + 0.3;
            this.color = isMouseCreated ? '#ff4b72' : (Math.random() > 0.5 ? '#ff7eb3' : '#ffd166');
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = Math.random() * 0.04 - 0.02;
            this.fadeRate = isMouseCreated ? 0.015 : 0.002;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.8;
            this.rotation += this.rotSpeed;
            this.opacity -= this.fadeRate;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = Math.max(this.opacity, 0);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            
            // Draw Heart Shape
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(
                0, 0, 
                -this.size / 2, 0, 
                -this.size / 2, topCurveHeight
            );
            ctx.bezierCurveTo(
                -this.size / 2, (this.size + topCurveHeight) / 2, 
                0, this.size, 
                0, this.size
            );
            ctx.bezierCurveTo(
                0, this.size, 
                this.size / 2, (this.size + topCurveHeight) / 2, 
                this.size / 2, topCurveHeight
            );
            ctx.bezierCurveTo(
                this.size / 2, 0, 
                0, 0, 
                0, topCurveHeight
            );
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Spawn background hearts
    for (let i = 0; i < maxHearts; i++) {
        hearts.push(new Heart());
    }

    // Sparkle trail on mouse move
    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) {
            hearts.push(new Heart(e.clientX, e.clientY, true));
        }
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = hearts.length - 1; i >= 0; i--) {
            hearts[i].update();
            hearts[i].draw();
            if (hearts[i].opacity <= 0 || hearts[i].y < -20) {
                hearts.splice(i, 1);
                if (hearts.length < maxHearts) {
                    hearts.push(new Heart());
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. RELATIONSHIP LOVE TIMER
   ========================================================================== */
let relationshipStartDate = localStorage.getItem('loveStartDate') || '2024-01-01';

function initLoveTimer() {
    updateTimerDisplay();
    setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    const daysEl = document.getElementById('daysNum');
    if (!daysEl) return;

    const startDate = new Date(relationshipStartDate);
    const now = new Date();
    const diffMs = now - startDate;

    if (isNaN(diffMs) || diffMs < 0) {
        daysEl.textContent = '000';
        document.getElementById('hoursNum').textContent = '00';
        document.getElementById('minutesNum').textContent = '00';
        document.getElementById('secondsNum').textContent = '00';
        return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(3, '0');
    document.getElementById('hoursNum').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutesNum').textContent = String(minutes).padStart(2, '0');
    document.getElementById('secondsNum').textContent = String(seconds).padStart(2, '0');
}

/* ==========================================================================
   3. ROMANTIC "TUM HO TOH" AUDIO PLAYER (OFFICIAL SONG + SYNTH FALLBACK)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let ytPlayer = null;
let isYtReady = false;

// Load YouTube Iframe API asynchronously
(function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
})();

window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('ytPlayer', {
        height: '1',
        width: '1',
        videoId: 'rOUuGvJkBrQ', // Official "Tum Ho Toh" - Saiyaara (Vishal Mishra)
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': 'rOUuGvJkBrQ'
        },
        events: {
            'onReady': () => { isYtReady = true; }
        }
    });
};

function initAudioSynthesizer() {
    const musicBtn = document.getElementById('musicToggleBtn');
    const soundWave = document.getElementById('soundWave');
    const musicLabel = musicBtn.querySelector('.music-label');

    musicBtn.addEventListener('click', () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        isMusicPlaying = !isMusicPlaying;

        if (isMusicPlaying) {
            musicLabel.textContent = 'Tum Ho Toh 🎵: ON';
            soundWave.classList.remove('hidden');
            
            if (ytPlayer && isYtReady && typeof ytPlayer.playVideo === 'function') {
                ytPlayer.playVideo();
            } else {
                startTumHoTohMelody();
            }
        } else {
            musicLabel.textContent = 'Tum Ho Toh 🎵: OFF';
            soundWave.classList.add('hidden');
            
            if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
                ytPlayer.pauseVideo();
            }
            stopTumHoTohMelody();
        }
    });
}

// "Tum Ho Toh" Piano Melody Sequence
const tumHoTohMelody = [
    { freq: 329.63, delay: 0 },    // E4 - Tum
    { freq: 392.00, delay: 400 },  // G4 - ho
    { freq: 440.00, delay: 800 },  // A4 - toh
    { freq: 493.88, delay: 1200 }, // B4 - gungunata
    { freq: 440.00, delay: 1800 }, // A4 - hai
    { freq: 392.00, delay: 2200 }, // G4 - dil
    { freq: 329.63, delay: 2600 }, // E4

    { freq: 329.63, delay: 3400 }, // E4 - Tum
    { freq: 392.00, delay: 3800 }, // G4 - ho
    { freq: 440.00, delay: 4200 }, // A4 - toh
    { freq: 523.25, delay: 4600 }, // C5 - muskurati
    { freq: 493.88, delay: 5200 }, // B4 - hain
    { freq: 440.00, delay: 5600 }, // A4 - raatein
    { freq: 392.00, delay: 6000 }  // G4
];

const tumHoTohChords = [
    [261.63, 329.63, 392.00], // C Maj
    [220.00, 261.63, 329.63], // A Min
    [174.61, 220.00, 261.63], // F Maj
    [196.00, 246.94, 392.00]  // G Maj
];

function startTumHoTohMelody() {
    let noteLoop = 0;
    playTumHoTohCycle();

    musicInterval = setInterval(() => {
        playTumHoTohCycle();
    }, 6800);
}

function stopTumHoTohMelody() {
    if (musicInterval) clearInterval(musicInterval);
}

function playTumHoTohCycle() {
    if (!audioCtx || !isMusicPlaying) return;

    // Play Background Soft Chords
    tumHoTohChords.forEach((chord, idx) => {
        setTimeout(() => {
            if (!isMusicPlaying) return;
            chord.forEach(freq => playTone(freq, 2.2, 0.04, 'sine'));
        }, idx * 1600);
    });

    // Play Melody Notes
    tumHoTohMelody.forEach(item => {
        setTimeout(() => {
            if (!isMusicPlaying) return;
            playTone(item.freq, 0.9, 0.08, 'triangle');
        }, item.delay);
    });
}

function playTone(freq, duration, volume, type = 'sine') {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
}

function playChimeEffect() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;

            const now = audioCtx.currentTime;
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.9);
        }, idx * 100);
    });
}

/* ==========================================================================
   4. LOVE LETTER ENVELOPE INTERACTION
   ========================================================================== */
function initEnvelopeInteraction() {
    const envelope = document.getElementById('envelope');
    const closeLetterBtn = document.getElementById('closeLetterBtn');
    const editLetterBtn = document.getElementById('editLetterBtn');

    envelope.addEventListener('click', (e) => {
        if (e.target.closest('#closeLetterBtn') || e.target.closest('#editLetterBtn')) return;
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            playChimeEffect();
        }
    });

    closeLetterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        envelope.classList.remove('open');
    });

    // Custom Letter Storage
    const savedLetter = localStorage.getItem('customLoveLetterText');
    if (savedLetter) {
        document.getElementById('typewriterBody').innerHTML = savedLetter.replace(/\n/g, '<br>');
    }

    editLetterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const letterModal = document.getElementById('letterModal');
        const customText = document.getElementById('customLetterText');
        customText.value = localStorage.getItem('customLoveLetterText') || document.getElementById('typewriterBody').innerText;
        letterModal.classList.add('active');
    });

    document.getElementById('closeLetterModalBtn').addEventListener('click', () => {
        document.getElementById('letterModal').classList.remove('active');
    });

    document.getElementById('saveLetterBtn').addEventListener('click', () => {
        const text = document.getElementById('customLetterText').value;
        if (text.trim()) {
            localStorage.setItem('customLoveLetterText', text);
            document.getElementById('typewriterBody').innerHTML = text.replace(/\n/g, '<br>');
            showToast('💌 Letter Saved!', 'Your custom message has been updated!');
        }
        document.getElementById('letterModal').classList.remove('active');
    });
}

/* ==========================================================================
   5. POLAROID LIGHTBOX & PHOTO UPLOAD
   ========================================================================== */
function initPolaroidLightbox() {
    const cards = document.querySelectorAll('.polaroid-card');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.polaroid-img');
            const caption = card.querySelector('.polaroid-caption span');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption ? caption.textContent : 'Sweet Memory';
            lightboxModal.classList.add('active');
        });
    });

    closeLightboxBtn.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });

    // Handle Uploading Real Custom Photos
    const photoUploadInput = document.getElementById('photoUploadInput');
    photoUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const gallery = document.getElementById('polaroidGallery');
                const newPolaroid = document.createElement('div');
                newPolaroid.className = 'polaroid-card';
                newPolaroid.style.setProperty('--rotation', (Math.random() * 6 - 3).toFixed(1));
                newPolaroid.innerHTML = `
                    <div class="polaroid-img-wrapper">
                        <img src="${event.target.result}" alt="Custom Memory" class="polaroid-img">
                    </div>
                    <div class="polaroid-caption">
                        <span>Our Special Moment ❤️</span>
                        <small>Newly added memory</small>
                    </div>
                `;
                newPolaroid.addEventListener('click', () => {
                    lightboxImg.src = event.target.result;
                    lightboxCaption.textContent = 'Our Special Moment ❤️';
                    lightboxModal.classList.add('active');
                });
                gallery.appendChild(newPolaroid);
                showToast('📸 Photo Added!', 'Your custom photo is now in the gallery!');
            };
            reader.readAsDataURL(file);
        }
    });
}

/* ==========================================================================
   6. COUPON REDEMPTION & CONFETTI CANNON
   ========================================================================== */
function redeemCoupon(btn, couponName) {
    const card = btn.closest('.coupon-card');
    if (card.classList.contains('redeemed')) return;

    card.classList.add('redeemed');
    btn.textContent = 'REDEEMED ❤️';
    btn.disabled = true;

    triggerConfetti();
    playChimeEffect();
    showToast('🎟️ Coupon Claimed!', `You successfully redeemed: "${couponName}"!`);
}

function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4b72', '#ffd166', '#ffffff', '#ff7eb3', '#9b51e0'];

    for (let i = 0; i < 90; i++) {
        pieces.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.7) * 14,
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 10 - 5,
            opacity: 1
        });
    }

    let frame = 0;
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // gravity
            p.rotation += p.rotSpeed;
            p.opacity -= 0.015;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(p.opacity, 0);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        frame++;
        if (frame < 100) {
            requestAnimationFrame(animateConfetti);
        } else {
            canvas.remove();
        }
    }
    animateConfetti();
}

/* ==========================================================================
   7. LOVE QUIZ MINI-GAME
   ========================================================================== */
const quizData = [
    {
        question: "What is my absolute favorite thing about you?",
        options: [
            "Your beautiful smile and warm eyes 😊",
            "How amazingly kind and thoughtful you are 💕",
            "Your cute laugh and goofy sense of humor 😂",
            "Literally EVERYTHING about you! ❤️"
        ],
        correct: 3
    },
    {
        question: "What makes our relationship so special?",
        options: [
            "We are best friends and lovers at the same time ✨",
            "We can laugh about absolute nonsense together 🤪",
            "You always make me feel safe and cherished 🛡️",
            "All of the above, 1000%! 🥰"
        ],
        correct: 3
    },
    {
        question: "How much do I love you right now?",
        options: [
            "To infinity and beyond! 🚀",
            "More than all the stars in the sky ✨",
            "More than words could ever explain 💖",
            "Unlimited love forever & ever! ♾️"
        ],
        correct: 3
    }
];

let currentQuizIdx = 0;
let quizScore = 0;

function initQuizGame() {
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const quizBody = document.getElementById('quizBody');
    const quizStepText = document.getElementById('quizStepText');
    const progressBar = document.getElementById('quizProgressBar');

    if (currentQuizIdx >= quizData.length) {
        // Quiz Completed
        quizStepText.textContent = "QUIZ COMPLETED!";
        progressBar.style.width = "100%";
        quizBody.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-family: var(--font-heading); font-size: 2rem; color: var(--rose-gold); margin-bottom: 12px;">
                    100% PERFECT SCORE! 🎉
                </h3>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 24px;">
                    You passed with flying colors! You are officially the Most Loved Boyfriend in the Universe! 🏆❤️
                </p>
                <button class="btn btn-primary" onclick="resetQuiz()">Replay Quiz 🔄</button>
            </div>
        `;
        triggerConfetti();
        return;
    }

    const current = quizData[currentQuizIdx];
    quizStepText.textContent = `Question ${currentQuizIdx + 1} of ${quizData.length}`;
    progressBar.style.width = `${((currentQuizIdx + 1) / quizData.length) * 100}%`;

    let optionsHTML = current.options.map((opt, i) => `
        <button class="quiz-opt-btn" onclick="handleQuizAnswer(${i})">
            <span>${opt}</span>
            <i class="fa-regular fa-heart"></i>
        </button>
    `).join('');

    quizBody.innerHTML = `
        <h3 class="quiz-question-title">${current.question}</h3>
        <div class="quiz-options-list">${optionsHTML}</div>
    `;
}

function handleQuizAnswer(selectedIdx) {
    const btns = document.querySelectorAll('.quiz-opt-btn');
    btns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === quizData[currentQuizIdx].correct) {
            btn.classList.add('correct');
        } else if (idx === selectedIdx) {
            btn.classList.add('incorrect');
        }
    });

    playChimeEffect();

    setTimeout(() => {
        currentQuizIdx++;
        loadQuizQuestion();
    }, 1200);
}

function resetQuiz() {
    currentQuizIdx = 0;
    quizScore = 0;
    loadQuizQuestion();
}

/* ==========================================================================
   8. CUSTOMIZATION SYSTEM (NAMES & DATE)
   ========================================================================== */
function initCustomizationSystem() {
    const customizeBtn = document.getElementById('customizeNamesBtn');
    const editDateBtn = document.getElementById('editDateBtn');
    const modal = document.getElementById('customModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('customizeForm');

    // Load saved details
    const savedBoyfriend = localStorage.getItem('boyfriendName');
    const savedYourName = localStorage.getItem('yourName');
    const savedDate = localStorage.getItem('loveStartDate');

    if (savedBoyfriend) updateBoyfriendName(savedBoyfriend);
    if (savedYourName) updateYourName(savedYourName);
    if (savedDate) relationshipStartDate = savedDate;

    customizeBtn.addEventListener('click', () => modal.classList.add('active'));
    if (editDateBtn) editDateBtn.addEventListener('click', () => modal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bfName = document.getElementById('boyfriendInput').value.trim();
        const yName = document.getElementById('yourNameInput').value.trim();
        const startDate = document.getElementById('startDateInput').value;

        if (bfName) {
            localStorage.setItem('boyfriendName', bfName);
            updateBoyfriendName(bfName);
        }
        if (yName) {
            localStorage.setItem('yourName', yName);
            updateYourName(yName);
        }
        if (startDate) {
            localStorage.setItem('loveStartDate', startDate);
            relationshipStartDate = startDate;
            updateTimerDisplay();
        }

        modal.classList.remove('active');
        showToast('✨ Updated!', 'Names and romantic start date updated successfully!');
    });

    // Add Reason Button
    const addReasonBtn = document.getElementById('addReasonBtn');
    if (addReasonBtn) {
        addReasonBtn.addEventListener('click', () => {
            const reasonText = prompt("Type a special reason why you love him:");
            if (reasonText && reasonText.trim()) {
                const grid = document.getElementById('reasonsGrid');
                if (grid) {
                    const card = document.createElement('div');
                    card.className = 'reason-card glass-card';
                    card.innerHTML = `
                        <div class="reason-icon"><i class="fa-solid fa-heart"></i></div>
                        <h3>Special Reason</h3>
                        <p>${reasonText.trim()}</p>
                    `;
                    grid.appendChild(card);
                    showToast('❤️ Reason Added!', 'Your custom reason has been added to the list!');
                }
            }
        });
    }
}

function updateBoyfriendName(name) {
    document.getElementById('boyfriendNameDisplay').textContent = `${name} ❤️`;
    document.getElementById('letterBoyfriendName').textContent = name;
}

function updateYourName(name) {
    document.getElementById('letterYourName').textContent = `${name} 💕`;
}

/* ==========================================================================
   9. VIRTUAL HUG & MISS YOU TOAST POPUPS
   ========================================================================== */
function initToastActions() {
    const hugBtn = document.getElementById('hugBtn');
    const missYouBtn = document.getElementById('missYouBtn');

    hugBtn.addEventListener('click', () => {
        triggerConfetti();
        playChimeEffect();
        showToast('🤗 Instant Hug Sent!', 'Sending 10,000+ warm cozy hugs right now! Hold tight!');
    });

    const sweetFortunes = [
        "Did you know? You are my absolute favorite thought of the day! 💭",
        "Reminder: You are deeply loved, appreciated, and cherished beyond measure! 💖",
        "If I had a flower for every time I thought of you, I'd walk in my garden forever 🌸",
        "You make my heart smile in ways no one else ever could! ✨",
        "No matter how far apart we are, my heart is always right next to yours! 💓"
    ];

    missYouBtn.addEventListener('click', () => {
        const randomMsg = sweetFortunes[Math.floor(Math.random() * sweetFortunes.length)];
        triggerConfetti();
        playChimeEffect();
        showToast('💌 A Little Note For You', randomMsg);
    });
}

function showToast(title, message) {
    const toast = document.getElementById('toastPopup');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;

    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 4500);
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   10. INTRO SPLASH QUESTION HANDLER
   ========================================================================== */
function answerIntroQuestion(option) {
    const introSplash = document.getElementById('introSplash');
    if (!introSplash) return;

    // Trigger romantic chime and celebratory confetti
    triggerConfetti();
    playChimeEffect();

    // Show toast message based on option
    const msg = option === 'A' 
        ? "YAY!! You said YES! Welcome to your special National Boyfriend Day surprise! 💖" 
        : "OF COURSE YESSSS!! 🥰 You are officially the best boyfriend in the entire world!";

    showToast("🎉 BEST ANSWER EVER!", msg);

    // Smoothly hide splash gateway to reveal wishing page
    introSplash.classList.add('hide');
    setTimeout(() => {
        introSplash.style.display = 'none';
    }, 900);
}

