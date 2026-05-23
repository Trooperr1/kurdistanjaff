/* ============================================
   JAFFSTUDIO — Ultra Premium 3D Experience
   Three.js + GSAP + Premium Interactions
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // THREE.JS 3D BACKGROUND
    // ========================================

    const canvas = document.getElementById('three-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.08);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // -- Gold Wireframe Torus --
    const torusGeo = new THREE.TorusGeometry(1.8, 0.02, 64, 200);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI * 0.35;
    scene.add(torus);

    // -- Second Torus Ring --
    const torus2Geo = new THREE.TorusGeometry(2.2, 0.015, 48, 160);
    const torus2Mat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.04
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.x = Math.PI * 0.6;
    torus2.rotation.y = Math.PI * 0.3;
    scene.add(torus2);

    // -- Icosahedron --
    const icoGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.06
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(3, 1, -2);
    scene.add(ico);

    // -- Octahedron --
    const octGeo = new THREE.OctahedronGeometry(0.5, 0);
    const octMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.07
    });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(-3.5, -1.5, -1);
    scene.add(oct);

    // -- Floating Particles --
    const particleCount = 1500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        sizes[i] = Math.random() * 2 + 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
        color: 0xc9a84c,
        size: 0.015,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -- Floating Lines (Constellation) --
    const lineGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const lineGeo = new THREE.BufferGeometry();
        const start = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 8
        );
        const end = new THREE.Vector3(
            start.x + (Math.random() - 0.5) * 3,
            start.y + (Math.random() - 0.5) * 3,
            start.z + (Math.random() - 0.5) * 2
        );
        lineGeo.setFromPoints([start, end]);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xc9a84c,
            transparent: true,
            opacity: 0.03 + Math.random() * 0.04,
            blending: THREE.AdditiveBlending
        });
        lineGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    scene.add(lineGroup);

    // -- Sphere Grid --
    const sphereGeo = new THREE.SphereGeometry(3, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.02
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(0, 0, -3);
    scene.add(sphere);

    // Mouse tracking for 3D
    let mouse3D = { x: 0, y: 0 };
    let targetMouse3D = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => {
        targetMouse3D.x = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouse3D.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation Loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;

        mouse3D.x += (targetMouse3D.x - mouse3D.x) * 0.03;
        mouse3D.y += (targetMouse3D.y - mouse3D.y) * 0.03;

        // Rotate shapes
        torus.rotation.y = time * 0.3 + mouse3D.x * 0.15;
        torus.rotation.z = Math.sin(time * 0.5) * 0.1;

        torus2.rotation.y = -time * 0.2 + mouse3D.x * 0.1;
        torus2.rotation.z = Math.cos(time * 0.3) * 0.15;

        ico.rotation.x = time * 0.4;
        ico.rotation.y = time * 0.3;
        ico.position.y = 1 + Math.sin(time * 0.8) * 0.5;

        oct.rotation.x = -time * 0.5;
        oct.rotation.z = time * 0.3;
        oct.position.y = -1.5 + Math.cos(time * 0.6) * 0.4;

        sphere.rotation.y = time * 0.1;
        sphere.rotation.x = time * 0.05;

        particles.rotation.y = time * 0.05;
        particles.rotation.x = mouse3D.y * 0.05;

        lineGroup.rotation.y = time * 0.08;
        lineGroup.rotation.x = mouse3D.y * 0.03;

        // Camera subtle movement
        camera.position.x = mouse3D.x * 0.3;
        camera.position.y = -mouse3D.y * 0.2;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ========================================
    // PRELOADER
    // ========================================

    const preloader = document.getElementById('preloader');
    const preloaderCounter = document.getElementById('preloader-counter');
    const preloaderLineFill = document.getElementById('preloader-line-fill');
    const preloaderRingProgress = document.querySelector('.preloader-ring-progress');

    document.body.style.overflow = 'hidden';

    function runPreloader() {
        const duration = 2200;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const count = Math.floor(eased * 100);

            preloaderCounter.textContent = count;
            preloaderLineFill.style.width = (eased * 100) + '%';
            preloaderRingProgress.style.strokeDashoffset = 565.48 * (1 - eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.style.overflow = '';
                    startHeroAnimations();
                }, 400);
            }
        }

        requestAnimationFrame(update);
    }

    window.addEventListener('load', () => {
        setTimeout(runPreloader, 300);
    });

    // ========================================
    // GSAP HERO ANIMATIONS
    // ========================================

    function startHeroAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.to('.hero-eyebrow', { opacity: 1, duration: 1 }, 0)
          .from('.hero-eyebrow-diamond', { scale: 0, rotation: 180, duration: 0.8, stagger: 0.1 }, 0.2)
          .to('.hero-title-word', {
              y: 0,
              duration: 1.4,
              stagger: 0.12,
              ease: 'expo.out'
          }, 0.3)
          .to('.hero-subtitle', { opacity: 1, duration: 1 }, 0.9)
          .from('.hero-sub-word', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.9)
          .from('.hero-sub-sep', { scaleX: 0, duration: 0.6, stagger: 0.1 }, 1.0)
          .to('.hero-cta', { opacity: 1, duration: 1 }, 1.2)
          .from('.hero-cta a', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, 1.2)
          .to('.hero-scroll-indicator', { opacity: 1, duration: 1 }, 1.6)
          .to('.hero-side-text', { opacity: 0.4, duration: 1, stagger: 0.1 }, 1.5);

        // Hero parallax on scroll
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 200,
            opacity: 0
        });

        gsap.to('.hero-scroll-indicator', {
            scrollTrigger: {
                trigger: '.hero',
                start: '10% top',
                end: '30% top',
                scrub: 1
            },
            opacity: 0
        });

        // 3D objects react to scroll
        gsap.to(torus.rotation, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2
            },
            x: Math.PI * 2,
            y: Math.PI * 3
        });

        gsap.to(torus.material, {
            scrollTrigger: {
                trigger: '.services',
                start: 'top center',
                end: 'bottom center',
                scrub: 1
            },
            opacity: 0.12
        });

        gsap.to(particles.material, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'bottom top',
                end: '+=500',
                scrub: 1
            },
            opacity: 0.2
        });

        initScrollAnimations();
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animation]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animatedElements.forEach(el => observer.observe(el));

        // Stat counter animation
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count, 10);
                    gsap.to(entry.target, {
                        textContent: target,
                        duration: 2,
                        ease: 'power4.out',
                        snap: { textContent: 1 },
                        onUpdate: function() {
                            entry.target.textContent = Math.floor(parseFloat(entry.target.textContent));
                        }
                    });
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObs.observe(el));

        // Service cards staggered parallax
        document.querySelectorAll('.service-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1
                },
                y: 60 + i * 20,
                opacity: 0.5
            });
        });

        // Work items parallax
        document.querySelectorAll('.work-item').forEach((item) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    end: 'top 60%',
                    scrub: 1
                },
                y: 50,
                opacity: 0.6
            });
        });

        // Process steps
        document.querySelectorAll('.process-step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%'
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'expo.out'
            });
        });

        // Big marquee speed change on scroll
        gsap.to('.big-marquee-track', {
            scrollTrigger: {
                trigger: '.big-marquee',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            x: '-=100'
        });
    }

    // ========================================
    // CUSTOM CURSOR
    // ========================================

    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    const cursorAura = document.getElementById('cursor-aura');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let auraX = 0, auraY = 0;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            auraX += (mouseX - auraX) * 0.04;
            auraY += (mouseY - auraY) * 0.04;
            cursorAura.style.left = auraX + 'px';
            cursorAura.style.top = auraY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverEls = document.querySelectorAll('a, button, .service-card, .work-item, .form-input, .magnetic');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ========================================
    // MAGNETIC BUTTONS
    // ========================================

    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { btn.style.transition = ''; }, 500);
            });
        });

        // 3D tilt on service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
                card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease';
                setTimeout(() => { card.style.transition = 'border-color 0.5s ease'; }, 600);
            });
        });

        // Work item parallax tilt
        document.querySelectorAll('.work-item-inner.magnetic').forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
                item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease';
                setTimeout(() => { item.style.transition = 'border-color 0.4s ease'; }, 600);
            });
        });
    }

    // ========================================
    // NAVIGATION
    // ========================================

    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
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

    // Smooth scroll
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

    // ========================================
    // TESTIMONIAL SLIDER
    // ========================================

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
            clearInterval(autoSlideInterval);
            autoSlide();
        });
    });

    function autoSlide() {
        autoSlideInterval = setInterval(() => {
            showTestimonial((currentTestimonial + 1) % testimonials.length);
        }, 5000);
    }

    autoSlide();

    // ========================================
    // CONTACT FORM
    // ========================================

    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('.btn-primary');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        btnText.textContent = 'Sending...';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btnText.textContent = 'Sent Successfully!';
            btn.querySelector('.btn-bg').style.background = '#1a6b3c';

            setTimeout(() => {
                btnText.textContent = originalText;
                btn.querySelector('.btn-bg').style.background = '';
                btn.style.pointerEvents = '';
                form.reset();
            }, 2500);
        }, 1500);
    });

})();
