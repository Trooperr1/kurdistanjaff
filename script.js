(function() {
    // Nav scroll
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function() {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Mobile menu
    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    document.querySelectorAll('.mobile-link, .nav-link').forEach(function(l) {
        l.addEventListener('click', function() {
            if (menuBtn) menuBtn.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            var t = document.querySelector(this.getAttribute('href'));
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // Scroll animations
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });

    // Stat counters
    var statObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                var el = e.target, target = parseInt(el.dataset.count);
                var start = performance.now();
                function tick(now) {
                    var p = Math.min((now - start) / 2000, 1);
                    el.textContent = Math.floor(p * target);
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                statObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function(el) { statObs.observe(el); });

    // Testimonials
    var testimonials = document.querySelectorAll('.testimonial');
    var dots = document.querySelectorAll('.dot');
    var current = 0, interval;
    function show(i) {
        testimonials.forEach(function(t) { t.classList.remove('active'); });
        dots.forEach(function(d) { d.classList.remove('active'); });
        testimonials[i].classList.add('active');
        dots[i].classList.add('active');
        current = i;
    }
    dots.forEach(function(d, i) { d.addEventListener('click', function() { show(i); clearInterval(interval); auto(); }); });
    function auto() { interval = setInterval(function() { show((current+1) % testimonials.length); }, 5000); }
    if (testimonials.length) auto();

    // Contact form
    var form = document.getElementById('contact-form');
    if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(function() { btn.textContent = 'Sent!'; setTimeout(function() { btn.textContent = 'Send Message'; btn.disabled = false; form.reset(); }, 2000); }, 1000);
    });
})();
