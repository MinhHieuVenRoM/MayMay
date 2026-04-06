/* ===== PETAL RAIN ===== */
(function () {
  const container = document.getElementById('petals');
  const symbols = ['☁️', '🌸', '💗', '☁️', '💕', '☁️', '✨'];
  const COUNT = 18;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (12 + Math.random() * 14) + 'px';
    const dur = 7 + Math.random() * 10;
    const delay = Math.random() * 12;
    el.style.animation = `fallDown ${dur}s ${delay}s linear infinite`;
    container.appendChild(el);
  }
})();

/* ===== SLIDESHOW ===== */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Slide ' + (i + 1));
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function updateSlide() {
  slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
  dotsContainer.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );
}

function changeSlide(dir) {
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  updateSlide();
}

function goToSlide(idx) {
  currentSlide = idx;
  updateSlide();
}

// Auto-advance every 5 seconds
let autoPlay = setInterval(() => changeSlide(1), 5000);

document.querySelector('.slideshow-wrapper').addEventListener('mouseenter', () => clearInterval(autoPlay));
document.querySelector('.slideshow-wrapper').addEventListener('mouseleave', () => {
  autoPlay = setInterval(() => changeSlide(1), 5000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') changeSlide(1);
  if (e.key === 'ArrowLeft')  changeSlide(-1);
  if (e.key === 'Escape')     closeLightbox();
});

/* ===== LIGHTBOX ===== */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    if (img.naturalWidth === 0) return; // broken image
    lightboxImg.src = img.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.milestone, .gallery-item, .wish-card, .slide');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(el);
});

// Slides start visible
document.querySelectorAll('.slide.active').forEach(s => {
  s.style.opacity = '1';
  s.style.transform = 'translateY(0)';
});
