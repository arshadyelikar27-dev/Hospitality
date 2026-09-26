import Lenis from 'lenis';

// ==========================================
// 1. LENIS SMOOTH SCROLL (PERFORMANCE OPTIMIZED)
// ==========================================
let lenis;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

try {
  lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: !isTouchDevice,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
} catch (e) {
  console.warn('Lenis fallback active:', e);
}

// ==========================================
// 2. THEME SWITCHER (LIGHT / DARK)
// ==========================================
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    htmlEl.classList.add('dark');
  } else {
    htmlEl.classList.remove('dark');
  }
  localStorage.setItem('aurelia_theme', theme);
}

const savedTheme = localStorage.getItem('aurelia_theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = htmlEl.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });
}

// ==========================================
// 3. NAVBAR SCROLL GLASS EFFECT (RAF THROTTLED)
// ==========================================
const navbar = document.getElementById('navbar');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (window.scrollY > 40) {
        navbar.classList.add('glass-header', 'shadow-sm');
      } else {
        navbar.classList.remove('glass-header', 'shadow-sm');
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ==========================================
// 4. MOBILE DRAWER (RESPONSIVE & ACCESSIBLE)
// ==========================================
const mobileToggle = document.getElementById('mobile-toggle');
const mobileClose = document.getElementById('mobile-close');
const mobileBackdrop = document.getElementById('mobile-backdrop');
const mobileDrawer = document.getElementById('mobile-drawer');
const mobileLinks = document.querySelectorAll('.mobile-link');

function setDrawer(open) {
  if (!mobileDrawer) return;
  if (open) {
    mobileDrawer.classList.remove('translate-x-full');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      mobileBackdrop.classList.add('opacity-100', 'pointer-events-auto');
    }
    document.body.style.overflow = 'hidden';
  } else {
    mobileDrawer.classList.add('translate-x-full');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileBackdrop) {
      mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
      mobileBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
    }
    document.body.style.overflow = '';
  }
}

if (mobileToggle) mobileToggle.addEventListener('click', () => setDrawer(true));
if (mobileClose) mobileClose.addEventListener('click', () => setDrawer(false));
if (mobileBackdrop) mobileBackdrop.addEventListener('click', () => setDrawer(false));
mobileLinks.forEach(link => link.addEventListener('click', () => setDrawer(false)));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setDrawer(false);
});

// ==========================================
// 5. SMOOTH ANCHOR SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });
});

// ==========================================
// 6. GALLERY LIGHTBOX
// ==========================================
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-src');
    const cap = item.getAttribute('data-caption');
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = cap;
    if (lightbox) lightbox.classList.add('active');
  });
});

function closeLightbox() {
  if (lightbox) lightbox.classList.remove('active');
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ==========================================
// 7. RESERVATION FORM
// ==========================================
const resForm = document.getElementById('res-form');
const resSuccess = document.getElementById('res-success');
const resSuccessText = document.getElementById('res-success-text');
const resDate = document.getElementById('res-date');

if (resDate) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  resDate.min = tomorrow.toISOString().split('T')[0];
  resDate.value = tomorrow.toISOString().split('T')[0];
}

if (resForm) {
  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name').value.trim();
    if (!name) return;

    const ref = Math.floor(1000 + Math.random() * 9000);
    resSuccessText.textContent = `Warm greetings, ${name}. Your booking enquiry (#AUR-${ref}) has been duly received. Our Guest Relations Concierge will connect with you shortly on priority.`;
    resForm.classList.add('hidden');
    resSuccess.classList.remove('hidden');
  });
}

console.log('✦ The Aurelia Reserve — Minimalist Architecture Active.');
