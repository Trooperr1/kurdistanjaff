/* ============================================
   JAFFSTUDIO — Ultra Luxury 3D Experience
   Bulletproof: Three.js wrapped in try-catch
   so UI always works even if 3D fails
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // PRELOADER (runs first, no dependencies)
    // ========================================

    var preloader = document.getElementById('preloader');
    var preloaderCounter = document.getElementById('preloader-counter');
    var preloaderLineFill = document.getElementById('preloader-line-fill');
    var preloaderRingProgress = document.querySelector('.preloader-ring-progress');

    document.body.style.overflow = 'hidden';

    function runPreloader() {
        var duration = 2500;
        var start = performance.now();

        function update(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 4);
            var count = Math.floor(eased * 100);

            if (preloaderCounter) preloaderCounter.textContent = count;
            if (preloaderLineFill) preloaderLineFill.style.width = (eased * 100) + '%';
            if (preloaderRingProgress) preloaderRingProgress.style.strokeDashoffset = 565.48 * (1 - eased);

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

    // ========================================
    // NAVIGATION (no dependencies)
    // ========================================

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

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // TESTIMONIAL SLIDER (no dependencies)
    // ========================================

    var testimonials = document.querySelectorAll('.testimonial');
    var testimonialBtns = document.querySelectorAll('.testimonial-btn');
    var currentTestimonial = 0;
    var autoSlideInterval;

    function showTestimonial(index) {
        testimonials.forEach(function (t) { t.classList.remove('active'); });
        testimonialBtns.forEach(function (b) { b.classList.remove('active'); });
        if (testimonials[index]) testimonials[index].classList.add('active');
        if (testimonialBtns[index]) testimonialBtns[index].classList.add('active');
        currentTestimonial = index;
    }

    testimonialBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            showTestimonial(parseInt(btn.dataset.index, 10));
            clearInterval(autoSlideInterval);
            startAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(function () {
            showTestimonial((currentTestimonial + 1) % testimonials.length);
        }, 5000);
    }

    if (testimonials.length > 0) startAutoSlide();

    // ========================================
    // CONTACT FORM (no dependencies)
    // ========================================

    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('.btn-primary');
            var btnText = btn ? btn.querySelector('.btn-text') : null;
            if (!btnText) return;
            var original = btnText.textContent;

            btnText.textContent = 'Sending...';
            btn.style.pointerEvents = 'none';

            setTimeout(function () {
                btnText.textContent = 'Sent Successfully!';
                setTimeout(function () {
                    btnText.textContent = original;
                    btn.style.pointerEvents = '';
                    form.reset();
                }, 2500);
            }, 1500);
        });
    }

    // ========================================
    // CUSTOM CURSOR (no dependencies)
    // ========================================

    var cursor = document.getElementById('cursor');
    var cursorFollower = document.getElementById('cursor-follower');
    var cursorAura = document.getElementById('cursor-aura');
    var mouseX = 0, mouseY = 0;
    var followerX = 0, followerY = 0;
    var auraX = 0, auraY = 0;

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

            if (cursorAura) {
                auraX += (mouseX - auraX) * 0.03;
                auraY += (mouseY - auraY) * 0.03;
                cursorAura.style.left = auraX + 'px';
                cursorAura.style.top = auraY + 'px';
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .service-card, .work-item, .form-input, .magnetic, .pricing-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
        });
    }

    // ========================================
    // ANIMATIONS (uses GSAP if available,
    // falls back to CSS-only)
    // ========================================

    function startAnimations() {
        var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

        if (hasGSAP) {
            gsap.registerPlugin(ScrollTrigger);
            startGSAPAnimations();
        } else {
            startFallbackAnimations();
        }

        initScrollObserver();
        initMagneticEffects();
    }

    function startGSAPAnimations() {
        // Hero timeline
        var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.to('.hero-eyebrow', { opacity: 1, duration: 1.2 }, 0)
          .from('.hero-eyebrow-diamond', { scale: 0, rotation: 180, duration: 1, stagger: 0.15 }, 0.2)
          .to('.hero-title-word', { y: 0, duration: 1.6, stagger: 0.15 }, 0.4)
          .to('.hero-subtitle', { opacity: 1, duration: 1.2 }, 1.0)
          .from('.hero-sub-word', { y: 20, opacity: 0, duration: 1, stagger: 0.12 }, 1.0)
          .from('.hero-sub-sep', { scaleX: 0, duration: 0.8, stagger: 0.1 }, 1.1)
          .to('.hero-cta', { opacity: 1, duration: 1.2 }, 1.4)
          .from('.hero-cta a', { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 1.4)
          .to('.hero-scroll-indicator', { opacity: 1, duration: 1.2 }, 1.8)
          .to('.hero-side-text', { opacity: 0.4, duration: 1.2, stagger: 0.1 }, 1.7);

        // Hero parallax on scroll
        gsap.to('.hero-content', {
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
            y: 250, opacity: 0
        });

        gsap.to('.hero-scroll-indicator', {
            scrollTrigger: { trigger: '.hero', start: '10% top', end: '30% top', scrub: 1 },
            opacity: 0
        });

        // Stat counters
        document.querySelectorAll('.stat-number[data-count]').forEach(function (el) {
            var target = parseInt(el.dataset.count, 10);
            ScrollTrigger.create({
                trigger: el,
                start: 'top 80%',
                once: true,
                onEnter: function () {
                    gsap.to({ val: 0 }, {
                        val: target, duration: 2.5, ease: 'power4.out',
                        onUpdate: function () { el.textContent = Math.floor(this.targets()[0].val); }
                    });
                }
            });
        });
    }

    function startFallbackAnimations() {
        // If GSAP failed to load, make hero visible with CSS transitions
        document.querySelectorAll('.hero-title-word').forEach(function (w) { w.style.transform = 'translateY(0)'; });
        document.querySelectorAll('.hero-eyebrow, .hero-subtitle, .hero-cta, .hero-scroll-indicator').forEach(function (el) { el.style.opacity = '1'; });
        document.querySelectorAll('.hero-side-text').forEach(function (el) { el.style.opacity = '0.4'; });

        // Simple counter animation without GSAP
        var statNumbers = document.querySelectorAll('.stat-number[data-count]');
        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.dataset.count, 10);
                    var start = performance.now();
                    function tick(now) {
                        var progress = Math.min((now - start) / 2000, 1);
                        el.textContent = Math.floor(progress * target);
                        if (progress < 1) requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                    counterObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(function (el) { counterObs.observe(el); });
    }

    // Scroll-triggered fade-in observer (works without GSAP)
    function initScrollObserver() {
        var animated = document.querySelectorAll('[data-animation]');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(function () { entry.target.classList.add('animate'); }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        animated.forEach(function (el) { observer.observe(el); });
    }

    // Magnetic + 3D tilt effects
    function initMagneticEffects() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        document.querySelectorAll('.magnetic').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(function () { btn.style.transition = ''; }, 600);
            });
        });

        document.querySelectorAll('.service-card, .pricing-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                var y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
                card.style.transform = 'perspective(800px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg) translateZ(8px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
                card.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease';
                setTimeout(function () { card.style.transition = 'border-color 0.5s ease'; }, 700);
            });
        });

        document.querySelectorAll('.work-item-inner.magnetic').forEach(function (item) {
            item.addEventListener('mousemove', function (e) {
                var rect = item.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
                var y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
                item.style.transform = 'perspective(600px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg)';
            });
            item.addEventListener('mouseleave', function () {
                item.style.transform = '';
                item.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease';
                setTimeout(function () { item.style.transition = 'border-color 0.4s ease'; }, 700);
            });
        });
    }

    // ========================================
    // THREE.JS — WRAPPED IN TRY-CATCH
    // If CDN fails, everything else still works
    // ========================================

    try {
        if (typeof THREE === 'undefined') throw new Error('Three.js not loaded');

        var canvas = document.getElementById('three-canvas');
        if (!canvas) throw new Error('Canvas not found');

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        var scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x030303, 0.045);

        var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, 0, 8);

        // Central morphing icosahedron
        var centralGroup = new THREE.Group();
        scene.add(centralGroup);

        var icoGeo = new THREE.IcosahedronGeometry(1.6, 2);
        var icoMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, transparent: true, opacity: 0.12 });
        var centralMesh = new THREE.Mesh(icoGeo, icoMat);
        centralGroup.add(centralMesh);

        var coreGeo = new THREE.IcosahedronGeometry(0.6, 1);
        var coreMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.04 });
        var coreMesh = new THREE.Mesh(coreGeo, coreMat);
        centralGroup.add(coreMesh);

        var originalPositions = icoGeo.attributes.position.array.slice();
        var vertexCount = originalPositions.length;

        // Orbital rings
        function makeRing(radius, tube, segs, op, spd) {
            var g = new THREE.TorusGeometry(radius, tube, 3, segs);
            var m = new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, transparent: true, opacity: op });
            var mesh = new THREE.Mesh(g, m);
            mesh.userData.speed = spd;
            return mesh;
        }

        var ring1 = makeRing(2.8, 0.008, 128, 0.06, 0.15); ring1.rotation.set(Math.PI * 0.5, 0, Math.PI * 0.15); centralGroup.add(ring1);
        var ring2 = makeRing(3.2, 0.006, 96, 0.04, -0.1); ring2.rotation.set(Math.PI * 0.3, 0, Math.PI * 0.4); centralGroup.add(ring2);
        var ring3 = makeRing(3.8, 0.005, 80, 0.03, 0.08); ring3.rotation.set(Math.PI * 0.7, 0, -Math.PI * 0.2); centralGroup.add(ring3);

        // Connected particle network
        var netCount = 180;
        var netPos = [], netVel = [];
        var connDist = 2.5;
        for (var i = 0; i < netCount; i++) {
            netPos.push({ x: (Math.random() - 0.5) * 18, y: (Math.random() - 0.5) * 14, z: (Math.random() - 0.5) * 12 });
            netVel.push({ x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003, z: (Math.random() - 0.5) * 0.002 });
        }

        var nodeArr = new Float32Array(netCount * 3);
        var nodeGeo = new THREE.BufferGeometry();
        nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodeArr, 3));
        var nodeMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.04, transparent: true, opacity: 0.7, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
        scene.add(new THREE.Points(nodeGeo, nodeMat));

        var maxConn = 500;
        var lineArr = new Float32Array(maxConn * 6);
        var lineColArr = new Float32Array(maxConn * 6);
        var lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(lineArr, 3));
        lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColArr, 3));
        var lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
        var connLines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(connLines);

        // Dust
        var dustCount = 1500;
        var dustArr = new Float32Array(dustCount * 3);
        for (var i = 0; i < dustCount; i++) {
            dustArr[i * 3] = (Math.random() - 0.5) * 40;
            dustArr[i * 3 + 1] = (Math.random() - 0.5) * 40;
            dustArr[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
        var dustGeo = new THREE.BufferGeometry();
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustArr, 3));
        var dustMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.008, transparent: true, opacity: 0.25, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
        var dust = new THREE.Points(dustGeo, dustMat);
        scene.add(dust);

        // Mouse
        var m3d = { x: 0, y: 0 }, tm3d = { x: 0, y: 0 }, mWorld = { x: 0, y: 0 };
        document.addEventListener('mousemove', function (e) {
            tm3d.x = (e.clientX / window.innerWidth - 0.5) * 2;
            tm3d.y = (e.clientY / window.innerHeight - 0.5) * 2;
            mWorld.x = tm3d.x * 8;
            mWorld.y = -tm3d.y * 6;
        });

        var scrollProg = 0;
        window.addEventListener('scroll', function () {
            scrollProg = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
        });

        var time = 0;
        var gR = 201 / 255, gG = 168 / 255, gB = 76 / 255;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.004;
            m3d.x += (tm3d.x - m3d.x) * 0.02;
            m3d.y += (tm3d.y - m3d.y) * 0.02;

            // Morph
            var pos = centralMesh.geometry.attributes.position.array;
            for (var i = 0; i < vertexCount; i += 3) {
                var d = Math.sqrt(originalPositions[i] * originalPositions[i] + originalPositions[i + 1] * originalPositions[i + 1] + originalPositions[i + 2] * originalPositions[i + 2]);
                var morph = Math.sin(time * 1.5 + d * 2) * 0.15 + Math.sin(time * 0.8) * 0.05;
                pos[i] = originalPositions[i] * (1 + morph);
                pos[i + 1] = originalPositions[i + 1] * (1 + morph);
                pos[i + 2] = originalPositions[i + 2] * (1 + morph);
            }
            centralMesh.geometry.attributes.position.needsUpdate = true;

            centralGroup.rotation.y = time * 0.12 + m3d.x * 0.2;
            centralGroup.rotation.x = Math.sin(time * 0.3) * 0.1 + m3d.y * 0.1;
            ring1.rotation.z += 0.0015; ring2.rotation.z -= 0.001; ring3.rotation.z += 0.0008;

            var cs = 1 + Math.sin(time * 2) * 0.15;
            coreMesh.scale.set(cs, cs, cs);

            // Network particles
            for (var i = 0; i < netCount; i++) {
                var p = netPos[i], v = netVel[i];
                p.x += v.x; p.y += v.y; p.z += v.z;
                var dx = p.x - mWorld.x, dy = p.y - mWorld.y, dz = p.z;
                var dm = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dm < 3 && dm > 0.1) { var f = (1 - dm / 3) * 0.015; p.x += dx / dm * f; p.y += dy / dm * f; }
                if (p.x > 9) p.x = -9; if (p.x < -9) p.x = 9;
                if (p.y > 7) p.y = -7; if (p.y < -7) p.y = 7;
                if (p.z > 6) p.z = -6; if (p.z < -6) p.z = 6;
                nodeArr[i * 3] = p.x; nodeArr[i * 3 + 1] = p.y; nodeArr[i * 3 + 2] = p.z;
            }
            nodeGeo.attributes.position.needsUpdate = true;

            // Connections
            var li = 0;
            for (var i = 0; i < netCount && li < maxConn; i++) {
                for (var j = i + 1; j < netCount && li < maxConn; j++) {
                    var dx = netPos[i].x - netPos[j].x, dy = netPos[i].y - netPos[j].y, dz = netPos[i].z - netPos[j].z;
                    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < connDist) {
                        var a = 1 - dist / connDist, idx = li * 6;
                        lineArr[idx] = netPos[i].x; lineArr[idx + 1] = netPos[i].y; lineArr[idx + 2] = netPos[i].z;
                        lineArr[idx + 3] = netPos[j].x; lineArr[idx + 4] = netPos[j].y; lineArr[idx + 5] = netPos[j].z;
                        lineColArr[idx] = gR * a; lineColArr[idx + 1] = gG * a; lineColArr[idx + 2] = gB * a;
                        lineColArr[idx + 3] = gR * a; lineColArr[idx + 4] = gG * a; lineColArr[idx + 5] = gB * a;
                        li++;
                    }
                }
            }
            for (var i = li * 6; i < maxConn * 6; i++) { lineArr[i] = 0; lineColArr[i] = 0; }
            lineGeo.attributes.position.needsUpdate = true;
            lineGeo.attributes.color.needsUpdate = true;
            lineGeo.setDrawRange(0, li * 2);

            dust.rotation.y = time * 0.02;

            camera.position.x = m3d.x * 0.5;
            camera.position.y = -m3d.y * 0.3;
            camera.position.z = 8 - scrollProg * 3;
            camera.lookAt(0, 0, 0);

            centralMesh.material.opacity = Math.max(0.02, 0.12 - scrollProg * 0.06);
            nodeMat.opacity = Math.max(0.1, 0.7 - scrollProg * 0.3);
            lineMat.opacity = Math.max(0.05, 0.35 - scrollProg * 0.15);

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    } catch (e) {
        console.warn('Three.js 3D scene disabled:', e.message);
        var c = document.getElementById('three-canvas');
        if (c) c.style.display = 'none';
    }

})();
