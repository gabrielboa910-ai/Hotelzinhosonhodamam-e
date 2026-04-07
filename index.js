document.addEventListener('DOMContentLoaded', function() {
    initMenuMobile();
    initScrollAnimations();
    initTestimonials();
    initCurrentYear();
    initSmoothScroll();
    initHeaderScroll();
    initGallery();
});

function initMenuMobile() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
        
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => entry.target.classList.add('animated'), delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prev = document.querySelector('.slider-prev');
    const next = document.querySelector('.slider-next');
    if (!testimonials.length) return;
    
    let current = 0;
    let interval;
    
    function show(index) {
        index = (index + testimonials.length) % testimonials.length;
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        current = index;
    }
    
    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(interval); show(i); startAuto(); }));
    if (prev) prev.addEventListener('click', () => { clearInterval(interval); show(current - 1); startAuto(); });
    if (next) next.addEventListener('click', () => { clearInterval(interval); show(current + 1); startAuto(); });
    
    function startAuto() { interval = setInterval(() => show(current + 1), 7000); }
    show(0);
    startAuto();
}

function initCurrentYear() {
    const year = document.getElementById('currentYear');
    if (year) year.textContent = new Date().getFullYear();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!' || href.includes('http')) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
            }
        });
    });
}

// ===== GALERIA DE IMAGENS COM CARROSSEL =====
function initGallery() {
    const track = document.getElementById('galleryTrack');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('galleryDots');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Criar dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.gallery-dot');
    
    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(currentIndex);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto slide
    let autoInterval = setInterval(nextSlide, 5000);
    
    // Pausar auto slide quando passar o mouse
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => clearInterval(autoInterval));
        galleryContainer.addEventListener('mouseleave', () => {
            autoInterval = setInterval(nextSlide, 5000);
        });
    }
}

console.log('Hotelzinho Sonho da Mamãe - Linhares/ES - Site carregado com sucesso!');