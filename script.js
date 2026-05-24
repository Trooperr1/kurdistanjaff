/* ============================================
   JAFFSTUDIO — Premium Cinematic Experience
   Morphing torus knot sculpture in a dark
   gallery of connected constellation nodes
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // SECTION 1: CORE UI — No library deps
    // ========================================

    // --- PRELOADER ---
    var preloader = document.getElementById('preloader');
    var preloaderRing = document.querySelector('.preloader-ring');
    var preloaderRingCircle = preloaderRing ? preloaderRing.querySelector('circle') : null;
    var preloaderProgress = document.querySelector('.preloader-progress');

    document.body.style.overflow = 'hidden';

    function runPreloader() {
        var duration = 2200;
        var start = performance.now();
        var circumference = 565.48;

        function update(now) {
            var elapsed = now - start;
            var t = Math.min(elapsed / duration, 1);
            // Cubic ease-out
            var eased = 1 - Math.pow(1 - t, 3);
            var percent = Math.floor(eased * 100);

            if (preloaderRingCircle) {
                preloaderRingCircle.style.strokeDashoffset = circumference * (1 - eased);
            }
            if (preloaderProgress) {
                preloaderProgress.style.width = percent + '%';
            }

            if (t < 1) {
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
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu on any link click
    document.querySelectorAll('.mobile-link, .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (menuBtn) menuBtn.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links with 80px offset
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

    // --- CUSTOM CURSOR (pointer: fine only) ---
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
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Add hover class on interactive elements
        document.querySelectorAll('a, button, .glass-card, .showcase-item, .btn, input, textarea, select').forEach(function (el) {
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
        }, 5500);
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
            }, 1200);
        });
    }

    // --- SCROLL OBSERVER ---
    function initScrollObserver() {
        // Animate elements with data-animation attribute
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
        }, { threshold: 0.12 });
        animated.forEach(function (el) { observer.observe(el); });

        // Stat counter animation
        var statNumbers = document.querySelectorAll('.stat-number[data-count]');
        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.dataset.count, 10);
                    var startTime = performance.now();
                    var counterDuration = 2500;

                    function tick(now) {
                        var progress = Math.min((now - startTime) / counterDuration, 1);
                        // Cubic ease-out
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

    // --- MAGNETIC EFFECTS (pointer: fine only) ---
    function initMagneticEffects() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        // Magnetic buttons — translate by offset * 0.12
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

        // 3D tilt on cards and showcase items — perspective(1000px) rotateX/Y by offset * 6deg max
        document.querySelectorAll('.glass-card, .showcase-item').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
                var y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
                card.style.transform = 'perspective(1000px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = '';
                setTimeout(function () { card.style.transition = ''; }, 600);
            });
        });
    }

    // ========================================
    // SECTION 2: GSAP ANIMATIONS
    // ========================================

    function startAnimations() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            startGSAPAnimations();
        } else {
            startFallbackAnimations();
        }

        initScrollObserver();
        initMagneticEffects();
    }

    function startGSAPAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // --- HERO TIMELINE ---
        var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.to('.hero-badge', { opacity: 1, y: 0, duration: 1 }, 0);
        tl.to('.hero-eyebrow', { opacity: 1, duration: 1.2 }, 0.2);
        tl.from('.hero-eyebrow-line', { scaleX: 0, duration: 0.8 }, 0.3);
        tl.to('.hero-word', { y: 0, duration: 1.6, stagger: 0.12 }, 0.5);
        tl.to('.hero-subtitle', { opacity: 1, duration: 1 }, 1.2);
        tl.from('.hero-sub-word', { y: 15, opacity: 0, duration: 0.8, stagger: 0.1 }, 1.2);
        tl.to('.hero-cta', { opacity: 1, y: 0, duration: 1 }, 1.5);
        tl.from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 1.5);
        tl.to('.hero-scroll-indicator', { opacity: 1, duration: 1 }, 1.8);
        tl.to('.hero-bottom-bar', { opacity: 1, duration: 1 }, 1.8);

        // --- HERO PARALLAX ---
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            },
            y: 300,
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

        // --- HORIZONTAL SCROLL SHOWCASE (THE KILLER FEATURE) ---
        var showcase = document.querySelector('.showcase');
        var track = document.querySelector('.showcase-track');
        if (showcase && track) {
            var items = track.querySelectorAll('.showcase-item');
            var totalScroll = track.scrollWidth - window.innerWidth;

            gsap.to(track, {
                x: function () { return -totalScroll; },
                ease: 'none',
                scrollTrigger: {
                    trigger: showcase,
                    start: 'top top',
                    end: function () { return '+=' + totalScroll; },
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });
        }

        // --- SECTION PARALLAX on glass cards ---
        document.querySelectorAll('.glass-card').forEach(function (card) {
            gsap.from(card, {
                y: 40,
                opacity: 0.5,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 1
                }
            });
        });
    }

    function startFallbackAnimations() {
        // Make hero elements visible without GSAP
        document.querySelectorAll('.hero-word').forEach(function (w) {
            w.style.transform = 'translateY(0)';
        });
        document.querySelectorAll('.hero-eyebrow, .hero-subtitle, .hero-cta, .hero-badge, .hero-bottom-bar').forEach(function (el) {
            el.style.opacity = '1';
        });
    }

    // ========================================
    // SECTION 3: THREE.JS SCENE
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

        // --- Morphing Torus Knot — THE SCULPTURE ---
        var knotGeo = new THREE.TorusKnotGeometry(1.3, 0.4, 200, 32, 2, 3);
        var knotMat = new THREE.MeshBasicMaterial({
            color: 0xc8a750,
            wireframe: true,
            transparent: true,
            opacity: 0.07
        });
        var knot = new THREE.Mesh(knotGeo, knotMat);
        scene.add(knot);
        var origPositions = knotGeo.attributes.position.array.slice();
        var vertCount = origPositions.length;

        // --- Outer ring ---
        var ringGeo = new THREE.TorusGeometry(3.5, 0.005, 8, 128);
        var ringMat = new THREE.MeshBasicMaterial({
            color: 0xc8a750,
            wireframe: true,
            transparent: true,
            opacity: 0.03
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI * 0.5;
        scene.add(ring);

        // --- Particle constellation — 100 nodes with connections ---
        var nodeCount = 100;
        var nodes = [], nodeVels = [];
        for (var i = 0; i < nodeCount; i++) {
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            var r = 4 + Math.random() * 5;
            nodes.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi)
            });
            nodeVels.push({
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * 0.002,
                z: (Math.random() - 0.5) * 0.001
            });
        }

        var nodeArr = new Float32Array(nodeCount * 3);
        var nGeo = new THREE.BufferGeometry();
        nGeo.setAttribute('position', new THREE.BufferAttribute(nodeArr, 3));
        var nMat = new THREE.PointsMaterial({
            color: 0xc8a750,
            size: 0.025,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        scene.add(new THREE.Points(nGeo, nMat));

        // --- Connection lines ---
        var maxConn = 400;
        var lArr = new Float32Array(maxConn * 6);
        var lCol = new Float32Array(maxConn * 6);
        var lGeo = new THREE.BufferGeometry();
        lGeo.setAttribute('position', new THREE.BufferAttribute(lArr, 3));
        lGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
        var lMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        scene.add(new THREE.LineSegments(lGeo, lMat));

        // --- Dust ---
        var dustCount = 600;
        var dArr = new Float32Array(dustCount * 3);
        for (var i = 0; i < dustCount; i++) {
            dArr[i * 3] = (Math.random() - 0.5) * 30;
            dArr[i * 3 + 1] = (Math.random() - 0.5) * 30;
            dArr[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        var dGeo = new THREE.BufferGeometry();
        dGeo.setAttribute('position', new THREE.BufferAttribute(dArr, 3));
        scene.add(new THREE.Points(dGeo, new THREE.PointsMaterial({
            color: 0xc8a750,
            size: 0.005,
            transparent: true,
            opacity: 0.12,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })));

        // --- Mouse + scroll tracking ---
        var m = { x: 0, y: 0 }, tm = { x: 0, y: 0 }, mw = { x: 0, y: 0 };
        document.addEventListener('mousemove', function (e) {
            tm.x = (e.clientX / window.innerWidth - 0.5) * 2;
            tm.y = (e.clientY / window.innerHeight - 0.5) * 2;
            mw.x = tm.x * 6;
            mw.y = -tm.y * 5;
        });

        var sp = 0;
        window.addEventListener('scroll', function () {
            sp = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
        });

        // --- Animation loop ---
        var time = 0;
        var gR = 200 / 255, gG = 167 / 255, gB = 80 / 255;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.003;
            m.x += (tm.x - m.x) * 0.015;
            m.y += (tm.y - m.y) * 0.015;

            // Morph torus knot vertices
            var pos = knot.geometry.attributes.position.array;
            for (var i = 0; i < vertCount; i += 3) {
                var d = Math.sqrt(origPositions[i] * origPositions[i] + origPositions[i + 1] * origPositions[i + 1] + origPositions[i + 2] * origPositions[i + 2]);
                var morph = Math.sin(time * 1.2 + d * 2.5) * 0.12 + Math.sin(time * 0.6) * 0.04;
                pos[i] = origPositions[i] * (1 + morph);
                pos[i + 1] = origPositions[i + 1] * (1 + morph);
                pos[i + 2] = origPositions[i + 2] * (1 + morph);
            }
            knot.geometry.attributes.position.needsUpdate = true;

            knot.rotation.y = time * 0.08 + m.x * 0.15;
            knot.rotation.x = Math.sin(time * 0.2) * 0.08 + m.y * 0.08;
            ring.rotation.z = time * 0.05;

            // Update constellation nodes
            for (var i = 0; i < nodeCount; i++) {
                var p = nodes[i], v = nodeVels[i];
                p.x += v.x;
                p.y += v.y;
                p.z += v.z;

                // Mouse repulsion
                var dx = p.x - mw.x, dy = p.y - mw.y;
                var dm = Math.sqrt(dx * dx + dy * dy + p.z * p.z);
                if (dm < 3 && dm > 0.1) {
                    var f = (1 - dm / 3) * 0.01;
                    p.x += dx / dm * f;
                    p.y += dy / dm * f;
                }

                // Wrap boundaries
                if (p.x > 10) p.x = -10;
                if (p.x < -10) p.x = 10;
                if (p.y > 8) p.y = -8;
                if (p.y < -8) p.y = 8;
                if (p.z > 6) p.z = -6;
                if (p.z < -6) p.z = 6;

                nodeArr[i * 3] = p.x;
                nodeArr[i * 3 + 1] = p.y;
                nodeArr[i * 3 + 2] = p.z;
            }
            nGeo.attributes.position.needsUpdate = true;

            // Draw connection lines
            var li = 0, connDist = 3;
            for (var i = 0; i < nodeCount && li < maxConn; i++) {
                for (var j = i + 1; j < nodeCount && li < maxConn; j++) {
                    var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dz = nodes[i].z - nodes[j].z;
                    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < connDist) {
                        var a = 1 - dist / connDist, idx = li * 6;
                        lArr[idx] = nodes[i].x;
                        lArr[idx + 1] = nodes[i].y;
                        lArr[idx + 2] = nodes[i].z;
                        lArr[idx + 3] = nodes[j].x;
                        lArr[idx + 4] = nodes[j].y;
                        lArr[idx + 5] = nodes[j].z;
                        lCol[idx] = gR * a;
                        lCol[idx + 1] = gG * a;
                        lCol[idx + 2] = gB * a;
                        lCol[idx + 3] = gR * a;
                        lCol[idx + 4] = gG * a;
                        lCol[idx + 5] = gB * a;
                        li++;
                    }
                }
            }
            // Zero out unused segments
            for (var i = li * 6; i < maxConn * 6; i++) {
                lArr[i] = 0;
                lCol[i] = 0;
            }
            lGeo.attributes.position.needsUpdate = true;
            lGeo.attributes.color.needsUpdate = true;
            lGeo.setDrawRange(0, li * 2);

            // Camera: mouse reactivity + scroll zoom
            camera.position.x = m.x * 0.4;
            camera.position.y = -m.y * 0.25;
            camera.position.z = 6 - sp * 2;
            camera.lookAt(0, 0, 0);

            // Scroll fade
            knotMat.opacity = Math.max(0.02, 0.07 - sp * 0.03);
            nMat.opacity = Math.max(0.1, 0.6 - sp * 0.25);

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
        console.warn('3D disabled:', e.message);
        var c = document.getElementById('three-canvas');
        if (c) c.style.display = 'none';
    }

})();
