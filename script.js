// ========================================
// MA1N.HTML - JAVASCRIPT INTERAKSI
// ========================================

// ========================================
// CAROUSEL IMAGE SLIDER
// ========================================
let currentSlide = 0;
const totalSlides = 4;
let autoSlideInterval;

function initCarousel() {
  updateCarouselIndicators();
  startAutoSlide();
  
  // Add event listeners to carousel
  const carouselContainer = document.getElementById('carouselSlides');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
  }
}

function updateCarouselIndicators() {
  const container = document.getElementById('carouselIndicators');
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.className = `carousel-indicator ${i === currentSlide ? 'active' : ''}`;
    indicator.onclick = () => goToSlide(i);
    container.appendChild(indicator);
  }
}

function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  updateCarouselIndicators();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
  resetAutoSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
  resetAutoSlide();
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
  resetAutoSlide();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Ganti slide setiap 5 detik
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

// 0. LOAD DATA GURU DARI GTK.JS

function loadStafData() {
  if (typeof DATA_GTK === 'undefined') {
    console.warn('⚠️ DATA_GTK not loaded');
    return;
  }
  
  const stafSlider = document.getElementById('stafSlider');
  if (!stafSlider) return;
  
  // Kosongkan slider terlebih dahulu
  stafSlider.innerHTML = '';
  
  // Iterasi semua data GTK dan tampilkan hanya nama & foto
  Object.keys(DATA_GTK).forEach((key) => {
    const guru = DATA_GTK[key];
    const card = document.createElement('div');
    card.className = 'staf-card';
    card.onclick = function() { openStafModal(guru); };
    
    // Ambil nama dari data
    const namaParts = guru.nama.split(',');
    const namaDisplay = namaParts[0]; // Ambil nama depan
    
    card.innerHTML = `
      <img src="${guru.foto || 'aset/default-teacher.jpg'}" alt="${guru.nama}" onerror="this.src='aset/default-teacher.jpg'">
      <p class="jabatan">${guru.jabatan || 'Staff'}</p>
      <p style="font-size:12px;margin-top:5px;color:#0b3c5d;font-weight:600;">${namaDisplay}</p>
    `;
    
    stafSlider.appendChild(card);
  });
  
  console.log('✅ Staf data loaded from gtk.js');
}

// 1. FUNGSI MODAL STAF (Updated)
function openStafModal(guru) {
  document.getElementById("modalFoto").src = guru.foto || 'aset/default-teacher.jpg';
  document.getElementById("modalNama").innerText = guru.nama;
  document.getElementById("modalJabatan").innerText = guru.jabatan;
  document.getElementById("modalNip").innerText = guru.nip || '-';
  document.getElementById("modalNuptk").innerText = guru.nuptk || '-';
  document.getElementById("modalEmail").innerText = guru.email || '-';
  document.getElementById("modalKontak").innerText = guru.no_hp || '-';
  document.getElementById("stafModal").style.display = "flex";
}

// Backward compatibility
function openStaf(el) {
  if (el && el.dataset) {
    const guru = {
      nama: el.dataset.nama,
      jabatan: el.dataset.jabatan,
      nip: el.dataset.nip,
      nuptk: el.dataset.nuptk,
      email: el.dataset.email,
      no_hp: el.dataset.kontak,
      foto: el.dataset.foto
    };
    openStafModal(guru);
  }
}

function closeStaf() {
  document.getElementById("stafModal").style.display = "none";
}

// Close modal saat klik di luar modal
window.addEventListener('click', function(event) {
  const modal = document.getElementById('stafModal');
  if (modal && event.target === modal) {
    modal.style.display = "none";
  }
});

// 2. MOBILE MENU TOGGLE
const burger = document.getElementById('burgerMenu');
const nav = document.getElementById('navMenu');

if (burger && nav) {
  burger.addEventListener('click', function() {
    nav.classList.toggle('active');
  });

  // Close menu saat link diklik
  document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
    });
  });
}

// 3. SMOOTH SCROLL UNTUK NAVIGASI
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// 4. HERO SECTION SLIDE INDICATOR
const heroSection = document.querySelector('.hero-section');
const indicators = document.querySelector('.hero-slide-indicators');

if (indicators) {
  // Buat 3 indikator dot
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = i === 0 ? 'hero-indicator active' : 'hero-indicator';
    dot.addEventListener('click', () => {
      document.querySelectorAll('.hero-indicator').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
    indicators.appendChild(dot);
  }
}

// 5. INTERSECTION OBSERVER UNTUK ANIMASI ON SCROLL
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.8s ease-out forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe semua card elements
document.querySelectorAll('.about-card, .feature-card, .stat-card, .vision-item').forEach(el => {
  el.style.opacity = '0';
  el.dataset.animation = 'fadeInUp 0.8s ease-out forwards';
  observer.observe(el);
});

// 6. COUNTER ANIMASI UNTUK STATISTIK
function animateCounter(element, finalValue) {
  if (isNaN(finalValue)) return;
  
  let current = 0;
  const increment = finalValue / 30;
  const duration = 2000;
  const step = duration / 30;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= finalValue) {
      element.textContent = finalValue + (finalValue > 100 ? '' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, step);
}

// Trigger counter saat section terlihat
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const observerStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(el => {
          const value = parseInt(el.textContent);
          animateCounter(el, value);
        });
        observerStats.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  observerStats.observe(statsSection);
}

// 7. ACTIVE NAV LINK INDICATOR
function updateActiveNav() {
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('#navMenu a');
  
  const scrollPosition = window.scrollY + 100;
  
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (index < navLinks.length) {
        navLinks[index].classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
document.addEventListener('DOMContentLoaded', updateActiveNav);

// 8. LOAD EVENT UNTUK INISIALISASI
document.addEventListener('DOMContentLoaded', function() {
  // Initialize carousel
  initCarousel();
  
  // Load staf data dari gtk.js
  loadStafData();
  
  console.log('✅ Script initialized - ma1n.html loaded');
});
