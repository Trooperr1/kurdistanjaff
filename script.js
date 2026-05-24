/* ============================================
   JAFFSTUDIO — Ultra Minimalist Luxury
   A single morphing torus knot sculpture
   in a dark gallery of connected stars
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // 1. CORE UI — No dependencies on anything
    // ========================================

    // --- PRELOADER ---
    var preloader = document.getElementById('preloader');
    var preloaderCounter = document.getElementById('preloader-counter');
    var preloaderRing = document.querySelector('.preloader-ring');
    var preloaderRingCircle = preloaderRing ? preloaderRing.querySelector('circle') : null;

    document.body.style.overflow = 'hidden';

    function runPreloader() {
        var duration = 2000;
        var start = performance.now();
        var circumference = preloaderRingCircle ? parseFloat(preloaderRingCircle.getAttribute('stroke-dasharray')) || 565.48 : 565.48;

        function update(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var count = Math.floor(eased * 100);

            if (preloaderCounter) preloaderCounter.textContent = count;
            if (preloaderRingCircle) {
                preloaderRingCircle.style.strokeDashoffset = circumference * (1 - eased);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setTimeout(function () {
                    if (preloader) preloader.classList.add('loaded');
                    document.body.style.overflow = '';
                    startAnimations();
                }, 400);
            }
        }

        requestAnimationFrame(update);
    }

    window.addEventListener('load', function () {
        setTimeout(runPreloader, 300);
    });

    // --- NAVIGATION ---
    var nav = document.getElementById('nav');
    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', function () {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    document.querySelectorAll('.mobile-link, .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (menuBtn) menuBtn.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- CUSTOM CURSOR ---
    var cursor = document.getElementById('cursor');
    var cursorFollower = document.getElementById('cursor-follower');
    var mouseX = 0, mouseY = 0;
    var followerX = 0, followerY = 0;

    if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.09;
            followerY += (mouseY - followerY) * 0.09;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .glass-card, .work-card, .btn, input, textarea, select').forEach(function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
        });
    }

    // --- TESTIMONIALS ---
    var testimonials = document.querySelectorAll('.testimonial');
    var testimonialDots = document.querySelectorAll('.testimonial-dot');
    var currentTestimonial = 0;
    var autoSlideInterval;

    function showTestimonial(index) {
        testimonials.forEach(function (t) { t.classList.remove('active'); });
        testimonialDots.forEach(function (d) { d.classList.remove('active'); });
        if (testimonials[index]) testimonials[index].classList.add('active');
        if (testimonialDots[index]) testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }

    testimonialDots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showTestimonial(i);
            clearInterval(autoSlideInterval);
            startAutoSlide();
        });
    });

    function startAutoSlide() {
        if (testimonials.length === 0) return;
        autoSlideInterval = setInterval(function () {
            showTestimonial((currentTestimonial + 1) % testimonials.length);
        }, 5000);
    }

    if (testimonials.length > 0) startAutoSlide();

    // --- CONTACT FORM ---
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"], .btn-primary');
            var btnText = btn ? (btn.querySelector('.btn-text') || btn) : null;
            if (!btnText) return;
            var original = btnText.textContent;

            btnText.textContent = 'Sending...';
            if (btn) btn.style.pointerEvents = 'none';

            setTimeout(function () {
                btnText.textContent = 'Sent!';
                setTimeout(function () {
                    btnText.textContent = original;
                    if (btn) btn.style.pointerEvents = '';
                    form.reset();
                }, 2500);
            }, 1000);
        });
    }

    // --- SCROLL OBSERVER ---
    function initScrollObserver() {
        var animated = document.querySelectorAll('[data-animation]');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(function () {
                        entry.target.classList.add('animate');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animated.forEach(function (el) { observer.observe(el); });

        // Stat counter animation
        var statNumbers = document.querySelectorAll('.stat-number[data-count]');
        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.dataset.count, 10);
                    var startTime = performance.now();
                    function tick(now) {
                        var progress = Math.min((now - startTime) / 2000, 1);
                        var eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                    counterObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(function (el) { counterObs.observe(el); });
    }

    // --- MAGNETIC EFFECTS ---
    function initMagneticEffects() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        // Magnetic buttons
        document.querySelectorAll('.btn').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.12) + 'px, ' + (y * 0.12) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                btn.style.transform = '';
                setTimeout(function () { btn.style.transition = ''; }, 600);
            });
        });

        // 3D tilt on cards
        document.querySelectorAll('.glass-card, .work-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                var y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
                card.style.transform = 'perspective(800px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = '';
                setTimeout(function () { card.style.transition = ''; }, 700);
            });
        });
    }

    // ========================================
    // 2. GSAP ANIMATIONS (if available)
    // ========================================

    function startAnimations() {
        if (typeof gsap !== 'undefined') {
            startGSAPAnimations();
        } else {
            startFallbackAnimations();
        }

        initScrollObserver();
        initMagneticEffects();
    }

    function startGSAPAnimations() {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Hero entrance timeline
        var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.to('.hero-eyebrow', { opacity: 1, duration: 1.2 }, 0)
          .to('.reveal-word', { y: 0, duration: 1.6, stagger: 0.15 }, 0.3)
          .to('.hero-subtitle', { opacity: 1, duration: 1.2 }, 0.9)
          .to('.hero-cta', { opacity: 1, duration: 1.2 }, 1.3);

        // Hero parallax on scroll
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to('.hero-content', {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
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
        }
    }

    function startFallbackAnimations() {
        // Make hero elements visible without GSAP
        document.querySelectorAll('.reveal-word').forEach(function (w) {
            w.style.transform = 'translateY(0)';
        });
        document.querySelectorAll('.hero-eyebrow, .hero-subtitle, .hero-cta').forEach(function (el) {
            el.style.opacity = '1';
        });
    }

    // ========================================
    // 3. THREE.JS SCENE — Wrapped in try-catch
    //    A morphing torus knot sculpture
    //    with connected particle constellation
    // ========================================

    try {
        if (typeof THREE === 'undefined') throw new Error('Three.js not loaded');

        var canvas = document.getElementById('three-canvas');
        if (!canvas) throw new Error('Canvas not found');

        // --- Renderer ---
        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // --- Scene ---
        var scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.04);

        // --- Camera ---
        var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 6);

        // --- Central geometry: morphing torus knot ---
        var torusGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32, 2, 3);
        var torusMat = new THREE.MeshBasicMaterial({
            color: 0xc9a84c,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        var torusKnot = new THREE.Mesh(torusGeo, torusMat);
        scene.add(torusKnot);

        // Store original vertex positions for morphing
        var originalPositions = torusGeo.attributes.position.array.slice();
        var vertexCount = originalPositions.length;

        // --- Particle constellation ---
        var constellationCount = 120;
        var constellationRadius = 8;
        var particles = [];
        var particlePositions = new Float32Array(constellationCount * 3);

        for (var i = 0; i < constellationCount; i++) {
            // Random positions on a sphere
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            var r = constellationRadius * Math.cbrt(Math.random());
            var px = r * Math.sin(phi) * Math.cos(theta);
            var py = r * Math.sin(phi) * Math.sin(theta);
            var pz = r * Math.cos(phi);

            particles.push({
                x: px, y: py, z: pz,
                vx: (Math.random() - 0.5) * 0.004,
                vy: (Math.random() - 0.5) * 0.004,
                vz: (Math.random() - 0.5) * 0.004
            });

            particlePositions[i * 3] = px;
            particlePositions[i * 3 + 1] = py;
            particlePositions[i * 3 + 2] = pz;
        }

        var particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        var particleMat = new THREE.PointsMaterial({
            color: 0xc9a84c,
            size: 0.03,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        var particlePoints = new THREE.Points(particleGeo, particleMat);
        scene.add(particlePoints);

        // Connection lines between nearby particles
        var maxConnections = 600;
        var linePositions = new Float32Array(maxConnections * 6);
        var lineColors = new Float32Array(maxConnections * 6);
        var lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
        var lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        var connectionLines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(connectionLines);

        // Gold color components for line vertex colors
        var goldR = 201 / 255;
        var goldG = 168 / 255;
        var goldB = 76 / 255;

        // --- Ambient dust ---
        var dustCount = 800;
        var dustPositions = new Float32Array(dustCount * 3);
        for (var i = 0; i < dustCount; i++) {
            dustPositions[i * 3] = (Math.random() - 0.5) * 30;
            dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        var dustGeo = new THREE.BufferGeometry();
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        var dustMat = new THREE.PointsMaterial({
            color: 0xc9a84c,
            size: 0.006,
            transparent: true,
            opacity: 0.15,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        var dust = new THREE.Points(dustGeo, dustMat);
        scene.add(dust);

        // --- Mouse tracking ---
        var mouse3d = { x: 0, y: 0 };
        var targetMouse3d = { x: 0, y: 0 };
        var mouseWorld = { x: 0, y: 0 };

        document.addEventListener('mousemove', function (e) {
            targetMouse3d.x = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouse3d.y = (e.clientY / window.innerHeight - 0.5) * 2;
            mouseWorld.x = targetMouse3d.x * 6;
            mouseWorld.y = -targetMouse3d.y * 4;
        });

        // --- Scroll tracking ---
        var scrollProgress = 0;
        window.addEventListener('scroll', function () {
            var maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
            scrollProgress = window.scrollY / maxScroll;
        });

        // --- Connection distance threshold ---
        var connectionDist = 3.0;

        // --- Animation loop ---
        var time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.005;

            // Smooth mouse interpolation
            mouse3d.x += (targetMouse3d.x - mouse3d.x) * 0.03;
            mouse3d.y += (targetMouse3d.y - mouse3d.y) * 0.03;

            // --- Morph the torus knot ---
            var positions = torusKnot.geometry.attributes.position.array;
            for (var i = 0; i < vertexCount; i += 3) {
                var ox = originalPositions[i];
                var oy = originalPositions[i + 1];
                var oz = originalPositions[i + 2];
                var dist = Math.sqrt(ox * ox + oy * oy + oz * oz);

                var displacement = Math.sin(time * 1.2 + dist * 2.5) * 0.12
                                 + Math.cos(time * 0.7 + dist * 1.8) * 0.06
                                 + Math.sin(time * 2.0 + dist * 0.5) * 0.03;

                var scale = 1 + displacement;
                positions[i] = ox * scale;
                positions[i + 1] = oy * scale;
                positions[i + 2] = oz * scale;
            }
            torusKnot.geometry.attributes.position.needsUpdate = true;

            // Slow rotation
            torusKnot.rotation.y += 0.0013; // ~0.08 rad/s at 60fps
            torusKnot.rotation.x += 0.0005; // ~0.03 rad/s at 60fps

            // --- Update constellation particles ---
            for (var i = 0; i < constellationCount; i++) {
                var p = particles[i];

                // Drift
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;

                // Mouse repulsion (soft force)
                var dx = p.x - mouseWorld.x;
                var dy = p.y - mouseWorld.y;
                var dz = p.z;
                var dm = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dm < 4 && dm > 0.1) {
                    var force = (1 - dm / 4) * 0.01;
                    p.x += (dx / dm) * force;
                    p.y += (dy / dm) * force;
                }

                // Wrap around sphere boundary
                var pr = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
                if (pr > constellationRadius) {
                    p.x *= -0.8;
                    p.y *= -0.8;
                    p.z *= -0.8;
                }

                particlePositions[i * 3] = p.x;
                particlePositions[i * 3 + 1] = p.y;
                particlePositions[i * 3 + 2] = p.z;
            }
            particleGeo.attributes.position.needsUpdate = true;

            // --- Draw connection lines ---
            var lineIndex = 0;
            for (var i = 0; i < constellationCount && lineIndex < maxConnections; i++) {
                for (var j = i + 1; j < constellationCount && lineIndex < maxConnections; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dz = particles[i].z - particles[j].z;
                    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < connectionDist) {
                        var alpha = 1 - dist / connectionDist;
                        var idx = lineIndex * 6;

                        linePositions[idx] = particles[i].x;
                        linePositions[idx + 1] = particles[i].y;
                        linePositions[idx + 2] = particles[i].z;
                        linePositions[idx + 3] = particles[j].x;
                        linePositions[idx + 4] = particles[j].y;
                        linePositions[idx + 5] = particles[j].z;

                        lineColors[idx] = goldR * alpha;
                        lineColors[idx + 1] = goldG * alpha;
                        lineColors[idx + 2] = goldB * alpha;
                        lineColors[idx + 3] = goldR * alpha;
                        lineColors[idx + 4] = goldG * alpha;
                        lineColors[idx + 5] = goldB * alpha;

                        lineIndex++;
                    }
                }
            }

            // Zero out unused line segments
            for (var i = lineIndex * 6; i < maxConnections * 6; i++) {
                linePositions[i] = 0;
                lineColors[i] = 0;
            }
            lineGeo.attributes.position.needsUpdate = true;
            lineGeo.attributes.color.needsUpdate = true;
            lineGeo.setDrawRange(0, lineIndex * 2);

            // --- Ambient dust rotation ---
            dust.rotation.y = time * 0.015;
            dust.rotation.x = time * 0.005;

            // --- Camera: mouse reactivity + scroll zoom ---
            camera.position.x = mouse3d.x * 0.4;
            camera.position.y = -mouse3d.y * 0.4;
            camera.position.z = 6 - scrollProgress * 2; // 6 -> 4 on scroll
            camera.lookAt(0, 0, 0);

            // --- Scroll reactivity: fade central geometry ---
            torusMat.opacity = Math.max(0.03, 0.08 - scrollProgress * 0.04);

            renderer.render(scene, camera);
        }

        animate();

        // --- Resize handler ---
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    } catch (e) {
        console.warn('Three.js 3D scene disabled:', e.message);
        var fallbackCanvas = document.getElementById('three-canvas');
        if (fallbackCanvas) fallbackCanvas.style.display = 'none';
    }

})();
