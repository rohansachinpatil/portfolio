document.addEventListener("DOMContentLoaded", () => {

    // ─── 1. PRELOADER ───────────────────────────────────────────────────────────
    const preloader = document.getElementById('preloader');
    const preloaderCounter = document.getElementById('preloader-counter');
    let count = 0;
    const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 15) + 5;
        if (count >= 100) {
            count = 100;
            clearInterval(countInterval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Trigger hero animations after preloader
                document.querySelectorAll('.hero .reveal-text, .hero .reveal-element')
                    .forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 150));
            }, 400);
        }
        if (preloaderCounter) preloaderCounter.textContent = count + '%';
    }, 60);


    // ─── 2. CUSTOM CURSOR ───────────────────────────────────────────────────────
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    if (!isTouchDevice && cursor && cursorDot) {
        let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Lagging dot for trail effect
        function animateDot() {
            dotX += (mouseX - dotX) * 0.15;
            dotY += (mouseY - dotY) * 0.15;
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            requestAnimationFrame(animateDot);
        }
        animateDot();

        const hoverElements = document.querySelectorAll('a, button, .project-item, input, .skill-card, .exp-item, .social-link');
        hoverElements.forEach(elem => {
            elem.addEventListener('mouseenter', () => cursor.classList.add('hover-effect'));
            elem.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }


    // ─── 3. SCROLL REVEAL ───────────────────────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

    document.querySelectorAll('.reveal-text, .reveal-element').forEach(el => observer.observe(el));


    // ─── 4. HORIZONTAL SCROLL (PROJECTS) ────────────────────────────────────────
    const projectGallery = document.querySelector('.project-gallery');
    if (projectGallery) {
        projectGallery.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                projectGallery.scrollLeft += e.deltaY * 1.5;
            }
        }, { passive: false });

        // Drag to scroll
        let isDown = false, startX, scrollLeft;
        projectGallery.addEventListener('mousedown', e => {
            isDown = true;
            projectGallery.classList.add('dragging');
            startX = e.pageX - projectGallery.offsetLeft;
            scrollLeft = projectGallery.scrollLeft;
        });
        projectGallery.addEventListener('mouseleave', () => { isDown = false; projectGallery.classList.remove('dragging'); });
        projectGallery.addEventListener('mouseup', () => { isDown = false; projectGallery.classList.remove('dragging'); });
        projectGallery.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - projectGallery.offsetLeft;
            const walk = (x - startX) * 2;
            projectGallery.scrollLeft = scrollLeft - walk;
        });
    }


    // ─── 5. ACTIVE NAV LINK ON SCROLL ───────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const updateActiveNav = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });


    // ─── 6. MAGNETIC BUTTONS ────────────────────────────────────────────────────
    document.querySelectorAll('.social-link, .send-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });


    // ─── 7. SKILL CARD TILT ─────────────────────────────────────────────────────
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
            card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ─── 8. EXPERIENCE ITEM EXPAND ──────────────────────────────────────────────
    document.querySelectorAll('.exp-item').forEach(item => {
        item.addEventListener('click', () => {
            const detail = item.querySelector('.exp-detail');
            if (detail) {
                const isOpen = detail.style.maxHeight && detail.style.maxHeight !== '0px';
                detail.style.maxHeight = isOpen ? '0px' : detail.scrollHeight + 'px';
                detail.style.opacity = isOpen ? '0' : '1';
                item.classList.toggle('open', !isOpen);
            }
        });
    });


    // ─── 9. CONTACT FORM ────────────────────────────────────────────────────────
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const name = document.querySelector('input[placeholder="NAME"]').value;
            const email = document.querySelector('input[placeholder="MAIL"]').value;
            const message = document.querySelector('input[placeholder="MESSAGE"]').value;
            if (!name || !email || !message) {
                shakeForm();
                return;
            }
            sendBtn.textContent = '✓';
            sendBtn.style.background = '#0b0b0b';
            sendBtn.style.color = '#CCFF00';
            setTimeout(() => { sendBtn.textContent = '➔'; sendBtn.style.background = ''; sendBtn.style.color = ''; }, 3000);
        });
    }

    function shakeForm() {
        const form = document.querySelector('.contact-form');
        form.style.animation = 'shake 0.4s ease';
        setTimeout(() => form.style.animation = '', 400);
    }


    // ─── 10. SECTION PROGRESS BAR ───────────────────────────────────────────────
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (window.scrollY / total * 100) + '%';
        }, { passive: true });
    }


    // ─── 11. HERO TEXT SCRAMBLE ─────────────────────────────────────────────────
    const scrambleEl = document.querySelector('.scramble-text');
    if (scrambleEl) {
        const words = ["Rohan", "Designer", "Builder", "Founder"];
        let wordIndex = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        function scramble(target, newWord, done) {
            let iterations = 0;
            const maxIter = newWord.length * 3;
            const interval = setInterval(() => {
                target.textContent = newWord.split('').map((char, i) => {
                    if (i < Math.floor(iterations / 3)) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                iterations++;
                if (iterations >= maxIter) { clearInterval(interval); target.textContent = newWord; if (done) done(); }
            }, 40);
        }

        setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            scramble(scrambleEl, words[wordIndex]);
        }, 3000);
    }


    // ─── 12. SMOOTH ANCHOR SCROLL ───────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

});