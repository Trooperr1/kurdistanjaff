/* ============================================
   JAFFSTUDIO — Ultra Luxury 3D Experience
   Connected Particle Network + Morphing Geometry
   + Interactive Mouse + GSAP Cinematic Animations
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // THREE.JS — CONNECTED PARTICLE NETWORK
    // + MORPHING CENTRAL GEOMETRY
    // + ORBITAL RINGS + VOLUMETRIC GLOW
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.045);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 8);

    // ---- CENTRAL MORPHING GEOMETRY ----
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // Icosahedron (base shape)
    const icoDetail = 2;
    const icoGeo = new THREE.IcosahedronGeometry(1.6, icoDetail);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const centralMesh = new THREE.Mesh(icoGeo, icoMat);
    centralGroup.add(centralMesh);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(0.6, 1);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        transparent: true,
        opacity: 0.04
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    centralGroup.add(coreMesh);

    // Store original vertices for morphing
    const originalPositions = icoGeo.attributes.position.array.slice();
    const vertexCount = originalPositions.length;

    // ---- ORBITAL RINGS ----
    function createOrbitalRing(radius, tubeRadius, segments, opacity, speed) {
        const geo = new THREE.TorusGeometry(radius, tubeRadius, 3, segments);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xc9a84c,
            wireframe: true,
            transparent: true,
            opacity: opacity
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData.speed = speed;
        return mesh;
    }

    const ring1 = createOrbitalRing(2.8, 0.008, 128, 0.06, 0.15);
    ring1.rotation.x = Math.PI * 0.5;
    ring1.rotation.y = Math.PI * 0.15;
    centralGroup.add(ring1);

    const ring2 = createOrbitalRing(3.2, 0.006, 96, 0.04, -0.1);
    ring2.rotation.x = Math.PI * 0.3;
    ring2.rotation.z = Math.PI * 0.4;
    centralGroup.add(ring2);

    const ring3 = createOrbitalRing(3.8, 0.005, 80, 0.03, 0.08);
    ring3.rotation.x = Math.PI * 0.7;
    ring3.rotation.z = -Math.PI * 0.2;
    centralGroup.add(ring3);

    // ---- CONNECTED PARTICLE NETWORK ----
    const networkParticleCount = 200;
    const networkPositions = [];
    const networkVelocities = [];
    const connectionDistance = 2.5;

    for (let i = 0; i < networkParticleCount; i++) {
        networkPositions.push({
            x: (Math.random() - 0.5) * 18,
            y: (Math.random() - 0.5) * 14,
            z: (Math.random() - 0.5) * 12
        });
        networkVelocities.push({
            x: (Math.random() - 0.5) * 0.003,
            y: (Math.random() - 0.5) * 0.003,
            z: (Math.random() - 0.5) * 0.002
        });
    }

    // Network node particles
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositionArray = new Float32Array(networkParticleCount * 3);
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositionArray, 3));

    const nodeMat = new THREE.PointsMaterial({
        color: 0xc9a84c,
        size: 0.04,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // Connection lines (dynamic)
    const maxConnections = 600;
    const linePositionArray = new Float32Array(maxConnections * 6);
    const lineColorArray = new Float32Array(maxConnections * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositionArray, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColorArray, 3));

    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(connectionLines);

    // ---- AMBIENT DUST PARTICLES (deep background) ----
    const dustCount = 2000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositionArray = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
        dustPositionArray[i * 3] = (Math.random() - 0.5) * 40;
        dustPositionArray[i * 3 + 1] = (Math.random() - 0.5) * 40;
        dustPositionArray[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositionArray, 3));

    const dustMat = new THREE.PointsMaterial({
        color: 0xc9a84c,
        size: 0.008,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // ---- GLOW SPRITES (volumetric light points) ----
    const glowGroup = new THREE.Group();
    scene.add(glowGroup);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const glowCtx = glowCanvas.getContext('2d');
    const gradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(201, 168, 76, 0.3)');
    gradient.addColorStop(0.3, 'rgba(201, 168, 76, 0.1)');
    gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 64, 64);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    for (let i = 0; i < 8; i++) {
        const spriteMat = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            opacity: 0.15 + Math.random() * 0.1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        const angle = (i / 8) * Math.PI * 2;
        const r = 3 + Math.random() * 3;
        sprite.position.set(
            Math.cos(angle) * r,
            (Math.random() - 0.5) * 4,
            Math.sin(angle) * r - 2
        );
        sprite.scale.set(2 + Math.random() * 2, 2 + Math.random() * 2, 1);
        sprite.userData.baseY = sprite.position.y;
        sprite.userData.speed = 0.3 + Math.random() * 0.5;
        sprite.userData.offset = Math.random() * Math.PI * 2;
        glowGroup.add(sprite);
    }

    // ---- MOUSE TRACKING ----
    let mouse3D = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let mouseWorld = new THREE.Vector3(0, 0, 0);

    document.addEventListener('mousemove', (e) => {
        targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseWorld.x = targetMouse.x * 8;
        mouseWorld.y = -targetMouse.y * 6;
    });

    // ---- SCROLL TRACKING ----
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    });

    // ---- ANIMATION LOOP ----
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.004;

        mouse3D.x += (targetMouse.x - mouse3D.x) * 0.02;
        mouse3D.y += (targetMouse.y - mouse3D.y) * 0.02;

        // --- Morph central geometry ---
        const positions = centralMesh.geometry.attributes.position.array;
        for (let i = 0; i < vertexCount; i += 3) {
            const ox = originalPositions[i];
            const oy = originalPositions[i + 1];
            const oz = originalPositions[i + 2];
            const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
            const morphAmount = Math.sin(time * 1.5 + dist * 2) * 0.15;
            const breathe = Math.sin(time * 0.8) * 0.05;
            positions[i] = ox * (1 + morphAmount + breathe);
            positions[i + 1] = oy * (1 + morphAmount + breathe);
            positions[i + 2] = oz * (1 + morphAmount + breathe);
        }
        centralMesh.geometry.attributes.position.needsUpdate = true;

        // Central group rotation
        centralGroup.rotation.y = time * 0.12 + mouse3D.x * 0.2;
        centralGroup.rotation.x = Math.sin(time * 0.3) * 0.1 + mouse3D.y * 0.1;

        // Orbital ring rotations
        ring1.rotation.z += ring1.userData.speed * 0.01;
        ring2.rotation.z += ring2.userData.speed * 0.01;
        ring3.rotation.z += ring3.userData.speed * 0.01;

        // Inner core pulse
        const coreScale = 1 + Math.sin(time * 2) * 0.15;
        coreMesh.scale.set(coreScale, coreScale, coreScale);
        coreMesh.material.opacity = 0.03 + Math.sin(time * 2) * 0.02;

        // --- Update network particles ---
        const mouseInfluenceRadius = 3;
        const mouseRepelStrength = 0.015;

        for (let i = 0; i < networkParticleCount; i++) {
            const p = networkPositions[i];
            const v = networkVelocities[i];

            // Move particles
            p.x += v.x;
            p.y += v.y;
            p.z += v.z;

            // Mouse repulsion
            const dx = p.x - mouseWorld.x;
            const dy = p.y - mouseWorld.y;
            const dz = p.z;
            const distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distToMouse < mouseInfluenceRadius && distToMouse > 0.1) {
                const force = (1 - distToMouse / mouseInfluenceRadius) * mouseRepelStrength;
                p.x += (dx / distToMouse) * force;
                p.y += (dy / distToMouse) * force;
                p.z += (dz / distToMouse) * force * 0.3;
            }

            // Boundary wrapping
            if (p.x > 9) p.x = -9;
            if (p.x < -9) p.x = 9;
            if (p.y > 7) p.y = -7;
            if (p.y < -7) p.y = 7;
            if (p.z > 6) p.z = -6;
            if (p.z < -6) p.z = 6;

            nodePositionArray[i * 3] = p.x;
            nodePositionArray[i * 3 + 1] = p.y;
            nodePositionArray[i * 3 + 2] = p.z;
        }
        nodeGeo.attributes.position.needsUpdate = true;

        // --- Update connection lines ---
        let lineIndex = 0;
        const goldR = 201 / 255, goldG = 168 / 255, goldB = 76 / 255;

        for (let i = 0; i < networkParticleCount && lineIndex < maxConnections; i++) {
            for (let j = i + 1; j < networkParticleCount && lineIndex < maxConnections; j++) {
                const pi = networkPositions[i];
                const pj = networkPositions[j];
                const dx = pi.x - pj.x;
                const dy = pi.y - pj.y;
                const dz = pi.z - pj.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDistance) {
                    const alpha = 1 - dist / connectionDistance;
                    const idx = lineIndex * 6;

                    linePositionArray[idx] = pi.x;
                    linePositionArray[idx + 1] = pi.y;
                    linePositionArray[idx + 2] = pi.z;
                    linePositionArray[idx + 3] = pj.x;
                    linePositionArray[idx + 4] = pj.y;
                    linePositionArray[idx + 5] = pj.z;

                    lineColorArray[idx] = goldR * alpha;
                    lineColorArray[idx + 1] = goldG * alpha;
                    lineColorArray[idx + 2] = goldB * alpha;
                    lineColorArray[idx + 3] = goldR * alpha;
                    lineColorArray[idx + 4] = goldG * alpha;
                    lineColorArray[idx + 5] = goldB * alpha;

                    lineIndex++;
                }
            }
        }

        // Zero out unused connections
        for (let i = lineIndex * 6; i < maxConnections * 6; i++) {
            linePositionArray[i] = 0;
            lineColorArray[i] = 0;
        }

        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
        lineGeo.setDrawRange(0, lineIndex * 2);

        // --- Ambient dust rotation ---
        dustParticles.rotation.y = time * 0.02;
        dustParticles.rotation.x = time * 0.01;

        // --- Glow sprites float ---
        glowGroup.children.forEach(sprite => {
            sprite.position.y = sprite.userData.baseY + Math.sin(time * sprite.userData.speed + sprite.userData.offset) * 0.8;
        });

        // --- Camera movement ---
        camera.position.x = mouse3D.x * 0.5;
        camera.position.y = -mouse3D.y * 0.3;
        camera.position.z = 8 - scrollProgress * 3;
        camera.lookAt(0, 0, 0);

        // --- Scroll-based opacity changes ---
        centralMesh.material.opacity = 0.12 - scrollProgress * 0.06;
        nodeMat.opacity = 0.7 - scrollProgress * 0.3;
        lineMat.opacity = 0.35 - scrollProgress * 0.15;

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
        const duration = 2500;
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

        tl.to('.hero-eyebrow', { opacity: 1, duration: 1.2 }, 0)
          .from('.hero-eyebrow-diamond', { scale: 0, rotation: 180, duration: 1, stagger: 0.15 }, 0.2)
          .to('.hero-title-word', { y: 0, duration: 1.6, stagger: 0.15, ease: 'expo.out' }, 0.4)
          .to('.hero-subtitle', { opacity: 1, duration: 1.2 }, 1.0)
          .from('.hero-sub-word', { y: 20, opacity: 0, duration: 1, stagger: 0.12 }, 1.0)
          .from('.hero-sub-sep', { scaleX: 0, duration: 0.8, stagger: 0.1 }, 1.1)
          .to('.hero-cta', { opacity: 1, duration: 1.2 }, 1.4)
          .from('.hero-cta a', { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 1.4)
          .to('.hero-scroll-indicator', { opacity: 1, duration: 1.2 }, 1.8)
          .to('.hero-side-text', { opacity: 0.4, duration: 1.2, stagger: 0.1 }, 1.7);

        // Hero parallax
        gsap.to('.hero-content', {
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
            y: 250, opacity: 0
        });

        gsap.to('.hero-scroll-indicator', {
            scrollTrigger: { trigger: '.hero', start: '10% top', end: '30% top', scrub: 1 },
            opacity: 0
        });

        initScrollAnimations();
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================

    function initScrollAnimations() {
        // Fade-up observer
        const animated = document.querySelectorAll('[data-animation]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(() => entry.target.classList.add('animate'), delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        animated.forEach(el => observer.observe(el));

        // Stat counters
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count, 10);
                    gsap.to({ val: 0 }, {
                        val: target, duration: 2.5, ease: 'power4.out',
                        onUpdate: function () {
                            entry.target.textContent = Math.floor(this.targets()[0].val);
                        }
                    });
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => counterObs.observe(el));

        // Service cards parallax
        document.querySelectorAll('.service-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 55%', scrub: 1 },
                y: 80 + i * 15, opacity: 0.3
            });
        });

        // Work items parallax
        document.querySelectorAll('.work-item').forEach(item => {
            gsap.from(item, {
                scrollTrigger: { trigger: item, start: 'top 92%', end: 'top 65%', scrub: 1 },
                y: 60, opacity: 0.4
            });
        });

        // Process steps stagger
        document.querySelectorAll('.process-step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: { trigger: step, start: 'top 85%' },
                y: 50, opacity: 0, duration: 1, delay: i * 0.12, ease: 'expo.out'
            });
        });

        // Pricing cards stagger
        document.querySelectorAll('.pricing-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 85%' },
                y: 60, opacity: 0, duration: 1, delay: i * 0.15, ease: 'expo.out'
            });
        });

        // Big marquee speed
        gsap.to('.big-marquee-track', {
            scrollTrigger: { trigger: '.big-marquee', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            x: '-=120'
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
            followerX += (mouseX - followerX) * 0.09;
            followerY += (mouseY - followerY) * 0.09;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            auraX += (mouseX - auraX) * 0.03;
            auraY += (mouseY - auraY) * 0.03;
            cursorAura.style.left = auraX + 'px';
            cursorAura.style.top = auraY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .service-card, .work-item, .form-input, .magnetic, .pricing-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ========================================
    // MAGNETIC BUTTONS + 3D TILT
    // ========================================

    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { btn.style.transition = ''; }, 600);
            });
        });

        document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
                card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease';
                setTimeout(() => { card.style.transition = 'border-color 0.5s ease'; }, 700);
            });
        });

        document.querySelectorAll('.work-item-inner.magnetic').forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
                item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease';
                setTimeout(() => { item.style.transition = 'border-color 0.4s ease'; }, 700);
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
        nav.classList.toggle('scrolled', window.scrollY > 50);
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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
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
    // PRICING TOGGLE
    // ========================================

    const pricingToggle = document.getElementById('pricing-toggle');
    if (pricingToggle) {
        pricingToggle.addEventListener('change', () => {
            const isYearly = pricingToggle.checked;
            document.querySelectorAll('.pricing-card').forEach(card => {
                const monthly = card.querySelector('.price-monthly');
                const yearly = card.querySelector('.price-yearly');
                if (monthly && yearly) {
                    monthly.style.display = isYearly ? 'none' : '';
                    yearly.style.display = isYearly ? '' : 'none';
                }
            });
        });
    }

    // ========================================
    // CONTACT FORM
    // ========================================

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('.btn-primary');
        const btnText = btn.querySelector('.btn-text');
        const original = btnText.textContent;

        btnText.textContent = 'Sending...';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btnText.textContent = 'Sent Successfully!';
            setTimeout(() => {
                btnText.textContent = original;
                btn.style.pointerEvents = '';
                form.reset();
            }, 2500);
        }, 1500);
    });

})();
