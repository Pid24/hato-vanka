/* =============================================
   HATO-VANKA — index.js
   in every universe i still love u, Vanka 💜
   ============================================= */

/* ===== LOADING SCREEN ===== */
(function () {
  const screen   = document.getElementById('loadingScreen');
  const flowers  = ['🌸','🌺','🌼','🌷','🪷','🌻','💐','🌹','🏵️','💮'];
  const elements = [];
  const COUNT    = 55; // jumlah bunga di layar

  // Spawn flowers at random positions
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'loader-flower';
    el.textContent = flowers[Math.floor(Math.random() * flowers.length)];

    const x  = Math.random() * 100;   // % dari kiri
    const y  = Math.random() * 100;   // % dari atas
    const sz = 1.4 + Math.random() * 2.2; // ukuran font 1.4–3.6rem
    const delay = Math.random() * 1.4;    // stagger animasi

    el.style.cssText = `
      left: ${x}%;
      top:  ${y}%;
      font-size: ${sz}rem;
      animation-delay: ${delay}s;
      animation-duration: ${1.6 + Math.random() * 1}s;
    `;

    // Simpan arah ledakan untuk CSS variable
    const angleRad = Math.atan2(y - 50, x - 50);
    const dist     = 80 + Math.random() * 120;
    el.style.setProperty('--ex', `${Math.cos(angleRad) * dist}px`);
    el.style.setProperty('--ey', `${Math.sin(angleRad) * dist}px`);
    el.style.setProperty('--er', `${-180 + Math.random() * 360}deg`);

    screen.appendChild(el);
    elements.push(el);
  }

  // Trigger dismiss: explode all flowers, then fade overlay
  function dismissLoader() {
    elements.forEach(el => el.classList.add('explode'));

    // Fade out overlay setelah bunga mulai meledak
    setTimeout(() => screen.classList.add('hide'), 300);

    // Remove dari DOM sepenuhnya setelah selesai
    setTimeout(() => screen.remove(), 750);
  }

  // Tunggu halaman siap + minimal 1.8 detik biar efek keliatan
  let pageReady    = false;
  let minTimeDone  = false;

  window.addEventListener('load', () => {
    pageReady = true;
    if (minTimeDone) dismissLoader();
  });

  setTimeout(() => {
    minTimeDone = true;
    if (pageReady) dismissLoader();
  }, 1800);
})();

/* ===== DATA ===== */
const TOTAL_PHOTOS = 20;

const captions = [
  "together in our world 💙",
  "pinky promise 🌸",
  "my fav person 🐸",
  "always side by side 💜",
  "you + me = 🥹",
  "our lil adventure 🌊",
  "cutie patootie 💕",
  "never letting go 🌸",
  "sunshine & stars ✨",
  "froggy love 🐸💚",
  "in every universe 🌌",
  "just us two 💜",
  "my whole world 🌏",
  "bestest person ever 💕",
  "forever & always 🌸",
  "i love u, Vanka 💜",
  "the cutest duo 🫶",
  "wherever u are 🌙",
  "us against the world 🌍",
  "til the end of time 💜",
];

const stickers = [
  "🌸","💕","✨","🐸","💜","🌊","🦋","🍀",
  "⭐","🎀","💙","🌙","🫧","🌺","💫","🪷",
  "🫶","🌈","🎐","💌",
];

/* ===== POLAROID GALLERY ===== */
const grid = document.getElementById('polaroidGrid');
let currentIndex = 0;

for (let i = 1; i <= TOTAL_PHOTOS; i++) {
  const num  = String(i).padStart(2, '0');
  const wrap = document.createElement('div');
  wrap.className = 'polaroid-wrap';

  const card = document.createElement('div');
  card.className = 'polaroid';
  card.innerHTML = `
    <div class="tape"></div>
    <span class="polaroid-sticker">${stickers[i - 1]}</span>
    <img src="img/${num}.jpg" alt="foto ${num}" loading="lazy" />
    <div class="polaroid-caption">${captions[i - 1]}</div>
  `;
  card.addEventListener('click', () => openLightbox(i - 1));

  wrap.appendChild(card);
  grid.appendChild(wrap);
}

/* ===== LIGHTBOX ===== */
function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const num = String(currentIndex + 1).padStart(2, '0');
  document.getElementById('lightboxImg').src = `img/${num}.jpg`;
  document.getElementById('lightboxCaption').textContent = captions[currentIndex];

  const counter = document.getElementById('lightboxCounter');
  if (counter) counter.textContent = `${currentIndex + 1} / ${TOTAL_PHOTOS}`;
}

function closeLightbox(e) {
  const inner = document.getElementById('lightboxInner');
  if (!inner.contains(e.target)) closeLightboxBtn();
}

function closeLightboxBtn() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + TOTAL_PHOTOS) % TOTAL_PHOTOS;
  const img = document.getElementById('lightboxImg');
  img.style.opacity = 0;
  setTimeout(() => {
    updateLightbox();
    img.style.transition = 'opacity 0.2s';
    img.style.opacity = 1;
  }, 150);
}

/* ===== TOUCH SWIPE ===== */
let touchStartX = 0;
let touchStartY = 0;
const lb = document.getElementById('lightbox');

lb.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    navigate(dx < 0 ? 1 : -1);
  }
}, { passive: true });

/* ===== KEYBOARD NAVIGATION ===== */
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'Escape')     closeLightboxBtn();
});

/* ===== FLOATING PARTICLES ===== */
const particleEmojis = ['💕','🌸','✨','💜','🐸','💙','🌺','⭐','🫧','🍀'];
const particleContainer = document.getElementById('particles');

function createParticle() {
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  const dur = 8 + Math.random() * 10;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = (Math.random() * dur) + 's';
  particleContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 5) * 1000);
}

// Initial burst
for (let i = 0; i < 20; i++) {
  setTimeout(createParticle, Math.random() * 3000);
}

// Keep spawning — pause when tab is hidden to save battery
let particleInterval = setInterval(createParticle, 1500);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(particleInterval);
  } else {
    particleInterval = setInterval(createParticle, 1500);
  }
});

/* ===== MUSIC PLAYER ===== */
let isPlaying = false;
let player;
let ytReady = false;

// Load YouTube IFrame API dynamically
const ytScript = document.createElement('script');
ytScript.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(ytScript);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    events: {
      onReady: () => { ytReady = true; },
    },
  });
}

function toggleMusic() {
  const btn   = document.getElementById('musicBtn');
  const toast = document.getElementById('musicToast');

  if (!ytReady) {
    toast.textContent = '⏳ memuat musik...';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
    return;
  }

  if (!isPlaying) {
    player.playVideo();
    isPlaying = true;
    btn.textContent = '🎶';
    btn.classList.add('playing');
    toast.textContent = '▶ musik on 🎶';
  } else {
    player.pauseVideo();
    isPlaying = false;
    btn.textContent = '🎵';
    btn.classList.remove('playing');
    toast.textContent = '⏸ musik off';
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
