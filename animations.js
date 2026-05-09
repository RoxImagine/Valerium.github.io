/* ========================================================
   VALERIUM — Premium Animation Engine
   GSAP + ScrollTrigger + Lenis Smooth Scroll
   ======================================================== */

// ─── Register GSAP Plugin ──────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── Lenis Smooth Scroll ───────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
});

// Connect Lenis to GSAP ScrollTrigger (single ticker — no duplicate RAF)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ─── Page Load Transition ──────────────────────────────
function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-bar"></div>';
    document.body.appendChild(loader);

    gsap.timeline()
        .to('.loader-bar', {
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.inOut',
        })
        .to('.page-loader', {
            yPercent: -100,
            duration: 0.8,
            ease: 'power4.inOut',
            delay: 0.1,
        })
        .set('.page-loader', { display: 'none' })
        .add(() => {
            // Refresh ScrollTrigger after loader is gone
            ScrollTrigger.refresh();
        });
}

// ─── Navigation Animations ─────────────────────────────
function initNavAnimations() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    // Animate nav links on load
    gsap.from('.nav-links li', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 1.0,
    });

    // Brand shimmer
    gsap.from('.nav-brand', {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.8,
    });
}

// ─── Hero Section Animations (index.html) ──────────────
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const tl = gsap.timeline({ delay: 1.2 });

    // Hero background Ken Burns
    gsap.to('.hero-bg img', {
        scale: 1.15,
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
    });

    // Parallax on hero background
    gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
        },
    });

    // Hero text reveal
    tl.from('.hero-text h1', {
        y: 80,
        opacity: 0,
        duration: 1.0,
        ease: 'power4.out',
    })
    .from('.hero-motto', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
    }, '-=0.4')
    .from('.hero-text .btn', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
    }, '-=0.3')
    .from('.hero-crest', {
        scale: 0.6,
        opacity: 0,
        rotation: -10,
        duration: 1.0,
        ease: 'elastic.out(1, 0.6)',
    }, '-=0.8')
    .from('.hero-scroll', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
    }, '-=0.3');
}

// ─── Page Hero Animations (sub-pages) ──────────────────
function initPageHeroAnimations() {
    const pageHero = document.querySelector('.page-hero');
    if (!pageHero) return;

    // Ken Burns on page hero background
    gsap.to('.page-hero .hero-bg img', {
        scale: 1.12,
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
    });

    // Parallax
    gsap.to('.page-hero .hero-bg', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
            trigger: '.page-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.0,
        },
    });

    const tl = gsap.timeline({ delay: 1.0 });

    tl.from('.page-hero-content .section-label', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
    })
    .from('.page-hero-content h1', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out',
    }, '-=0.3')
    .from('.page-hero-content p', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
    }, '-=0.3');
}

// ─── Scroll-Triggered Reveal Animations ────────────────
function initScrollRevealAnimations() {

    // Helper: creates a scroll-triggered "from" animation with safe defaults
    function scrollFrom(targets, fromVars, triggerEl) {
        const trigger = triggerEl || targets;
        gsap.fromTo(targets,
            // FROM state
            Object.assign({ opacity: 0 }, fromVars),
            // TO state
            Object.assign({ opacity: 1, duration: 0.8, ease: 'power3.out' }, fromVars, {
                // Override "from" transform values back to 0
                y: 0, x: 0, scale: 1, rotateX: 0, rotateY: 0,
                scrollTrigger: {
                    trigger: trigger,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
            })
        );
    }

    // Section labels — slide in
    gsap.utils.toArray('.section-label').forEach(label => {
        // Skip labels inside page-hero (those animate via timeline)
        if (label.closest('.page-hero-content')) return;

        gsap.fromTo(label,
            { x: -40, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: label, start: 'top 88%', toggleActions: 'play none none none' },
            }
        );
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: 'power4.out',
                scrollTrigger: { trigger: title, start: 'top 88%', toggleActions: 'play none none none' },
            }
        );
    });

    // Section subtitles
    gsap.utils.toArray('.section-subtitle').forEach(sub => {
        gsap.fromTo(sub,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: sub, start: 'top 88%', toggleActions: 'play none none none' },
            }
        );
    });

    // Pillar cards — stagger
    gsap.utils.toArray('.pillars-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.pillar-card');
        gsap.fromTo(cards,
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' },
            }
        );
    });


    // Department cards — stagger with rotation
    gsap.utils.toArray('.dept-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.dept-card');
        gsap.fromTo(cards,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' },
            }
        );
    });

    // Content sections
    gsap.utils.toArray('.content-section').forEach(section => {
        gsap.fromTo(section,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 88%', toggleActions: 'play none none none' },
            }
        );
    });

    // Laws table rows
    gsap.utils.toArray('.laws-table tbody tr').forEach((row, i) => {
        gsap.fromTo(row,
            { x: -40, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power3.out',
                scrollTrigger: { trigger: row, start: 'top 92%', toggleActions: 'play none none none' },
            }
        );
    });

    // CTA banners
    gsap.utils.toArray('.cta-banner').forEach(cta => {
        gsap.fromTo(cta,
            { y: 60, opacity: 0, scale: 0.95 },
            {
                y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: cta, start: 'top 88%', toggleActions: 'play none none none' },
            }
        );
    });
}

// ─── Stats Counter Animation ───────────────────────────
function initCounterAnimations() {
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    // Animate the stats bar entrance
    gsap.fromTo('.stats-bar',
        { y: 40, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.stats-bar', start: 'top 88%', toggleActions: 'play none none none' },
        }
    );

    // Stagger stat items
    gsap.fromTo('.stat-item',
        { y: 30, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: '.stats-bar', start: 'top 85%', toggleActions: 'play none none none' },
        }
    );

    // Animate the counters for all numerical stats
    document.querySelectorAll('.stat-value').forEach(el => {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(\+?)$/);
        
        if (match) {
            const targetVal = parseInt(match[1], 10);
            const suffix = match[2];
            
            // For years, start from a closer number (e.g., 2000 for 2025)
            // For smaller numbers, start from 0
            const startVal = targetVal > 2000 ? targetVal - 25 : 0;
            
            const counter = { val: startVal };
            
            ScrollTrigger.create({
                trigger: '.stats-bar',
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    gsap.to(counter, {
                        val: targetVal,
                        duration: 1.5,
                        ease: 'power2.out',
                        onUpdate: () => {
                            el.textContent = Math.floor(counter.val) + suffix;
                        },
                    });
                },
            });
        }
    });
}

// ─── Magnetic Button Effect ────────────────────────────
function initMagneticButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.4,
                ease: 'power2.out',
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)',
            });
        });
    });
}

// ─── Card Tilt Effect ──────────────────────────────────
function initCardTilt() {
    document.querySelectorAll('.pillar-card, .dept-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
                rotateY: x * 8,
                rotateX: -y * 8,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 800,
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: 'power3.out',
            });
        });
    });
}

// ─── Footer Animations ─────────────────────────────────
function initFooterAnimations() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    gsap.fromTo('.footer-brand',
        { y: 40, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.footer', start: 'top 92%', toggleActions: 'play none none none' },
        }
    );

    gsap.fromTo('.footer-col',
        { y: 30, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.footer', start: 'top 90%', toggleActions: 'play none none none' },
        }
    );

    gsap.fromTo('.footer-bottom',
        { opacity: 0 },
        {
            opacity: 1, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', toggleActions: 'play none none none' },
        }
    );
}

// ─── Floating Particles Background ─────────────────────
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w, h;
    const particles = [];
    const particleCount = 40;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.3 + 0.05,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(196, 160, 82, ${p.alpha})`;
            ctx.fill();
        });

        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(196, 160, 82, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ─── Gold Glow Cursor Trail ────────────────────────────
function initCursorGlow() {
    // Only on desktop (no touch devices)
    if ('ontouchstart' in window) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
        gsap.set(glow, {
            x: mouseX - 200,
            y: mouseY - 200 + window.scrollY,
        });
    });
}

// ─── Text Scramble Effect on Section Labels ────────────
function initTextScramble() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    document.querySelectorAll('.section-label').forEach(label => {
        // Skip labels inside page-hero (animated via timeline)
        if (label.closest('.page-hero-content')) return;

        const original = label.textContent;
        let hasPlayed = false;

        ScrollTrigger.create({
            trigger: label,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                if (hasPlayed) return;
                hasPlayed = true;
                let iteration = 0;
                const interval = setInterval(() => {
                    label.textContent = original
                        .split('')
                        .map((char, idx) => {
                            if (idx < iteration) return original[idx];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    iteration += 1 / 2;
                    if (iteration >= original.length) {
                        label.textContent = original;
                        clearInterval(interval);
                    }
                }, 30);
            },
        });
    });
}

// ─── Hamburger menu toggle (shared) ────────────────────
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}

// ─── Scroll-based Nav toggle ───────────────────────────
function initNavScroll() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ─── Smooth Scroll Anchor Links ────────────────────────
function initSmoothScrollLinks() {
    document.querySelectorAll('.hero-scroll').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                lenis.scrollTo(targetId, { offset: -72 }); // offset for fixed nav
            }
        });
    });
}

// ─── Initialize Everything ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initNavScroll();
    initNavAnimations();
    initHeroAnimations();
    initPageHeroAnimations();
    initScrollRevealAnimations();
    initCounterAnimations();
    initMagneticButtons();
    initCardTilt();
    initFooterAnimations();
    initParticles();
    initCursorGlow();
    initTextScramble();
    initSmoothScrollLinks();

    // Safety: refresh ScrollTrigger after everything is set up
    // and after images have had a moment to load (affects layout)
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
