/* ============================================
   JAFFSTUDIO — Premium Interactions
   ============================================ */

(function () {
    'use strict';

    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preloader-counter');
    let count = 0;

    function animateCounter() {
        const target = 100;
        const duration = 1800;
        const start = performance.now();

        preloader.classList.add('animating');

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            count = Math.floor(eased * target);
            counter.textContent = count;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.style.overflow = '';
                }, 300);
            }
        }

        requestAnimationFrame(update);
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
        setTimeout(animateCounter, 200);
    });

    // ---- Custom Cursor ----
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverElements = document.querySelectorAll('a, button, .service-card, .work-item, .form-input');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ---- Navigation ----
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    });

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link, .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Particles ----
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (1 + Math.random() * 2) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }

    // ---- Scroll Animations ----
    const animatedElements = document.querySelectorAll('[data-animation]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // ---- Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count, 10);
                animateNumber(entry.target, 0, target, 2000);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.floor(eased * (end - start) + start);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ---- Testimonial Slider ----
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    let currentTestimonial = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        testimonialBtns.forEach(b => b.classList.remove('active'));
        testimonials[index].classList.add('active');
        testimonialBtns[index].classList.add('active');
        currentTestimonial = index;
    }

    testimonialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showTestimonial(parseInt(btn.dataset.index, 10));
            resetAutoSlide();
        });
    });

    function autoSlide() {
        autoSlideInterval = setInterval(() => {
            const next = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(next);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlide();
    }

    autoSlide();

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Contact Form ----
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = form.querySelector('.btn-primary');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        btnText.textContent = 'Sending...';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btnText.textContent = 'Message Sent!';
            btn.style.background = '#1a6b3c';

            setTimeout(() => {
                btnText.textContent = originalText;
                btn.style.background = '';
                btn.style.pointerEvents = '';
                form.reset();
            }, 2500);
        }, 1500);
    });

    // ---- Magnetic effect on service cards ----
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                card.style.transform = `perspective(1000px) rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ---- Parallax subtle effect ----
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroContent = document.querySelector('.hero-content');
                if (heroContent && scrollY < window.innerHeight) {
                    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

})();
