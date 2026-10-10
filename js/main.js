/**
 * Limpô Rio Preto - Main JavaScript
 * Motion, Subtle Parallax, Scroll Reveal, Comparador e Microinterações Premium
 */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const config = window.LimpConfig || {
        whatsappNumber: "5517981607915",
        defaultMessage: "Olá! Vim pelo site da Limpô Rio Preto e gostaria de solicitar um orçamento para higienização de estofados."
    };

    // 1. Configurar links do WhatsApp dinamicamente
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.defaultMessage)}`;
    
    document.querySelectorAll('.whatsapp-link').forEach(el => {
        el.setAttribute('href', whatsappUrl);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
    });

    // 2. Menu Mobile Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (menuBtn && mobileMenu) {
        const setMenu = (open) => {
            mobileMenu.classList.toggle('hidden', !open);
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        };

        menuBtn.addEventListener('click', () => {
            setMenu(mobileMenu.classList.contains('hidden'));
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
    }

    // 3. Header: mantém o azul-marinho integrado ao Hero e apenas aprofunda a sombra no scroll
    const header = document.getElementById('site-header');
    let headerScrolled = false;
    const updateHeader = () => {
        const scrolled = window.scrollY > 20;
        if (scrolled === headerScrolled) return;
        headerScrolled = scrolled;
        header.classList.toggle('shadow-2xl', scrolled);
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // 4. Parallax discreto no Hero (respeita prefers-reduced-motion; mais suave no mobile)
    const heroImg = document.querySelector('.hero-parallax-img');
    if (heroImg && !prefersReducedMotion) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const factor = isMobile ? 0.12 : 0.3;
        const cap = isMobile ? 48 : 110;
        let ticking = false;
        let lastShift = -1;
        const updateParallax = () => {
            const shift = Math.min(window.scrollY * factor, cap);
            if (Math.abs(shift - lastShift) > 0.5) {
                heroImg.style.transform = `translate3d(0, ${shift}px, 0) scale(1.3)`;
                lastShift = shift;
            }
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
        updateParallax();
    }

    // 5. Scroll Reveal com IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 6. Antes e Depois Slider Interativo (mouse, toque e teclado)
    const baContainer = document.getElementById('ba-container');
    const baAfterWrap = document.getElementById('ba-after-wrap');
    const baHandle = document.getElementById('ba-handle');

    if (baContainer && baAfterWrap && baHandle) {
        let isDragging = false;

        const setPercentage = (percentage) => {
            percentage = Math.max(0, Math.min(100, percentage));
            baContainer.style.setProperty('--ba-pos', percentage + '%');
            baHandle.style.left = percentage + '%';
            baHandle.setAttribute('aria-valuenow', Math.round(percentage));
        };

        const setFromClientX = (clientX) => {
            const rect = baContainer.getBoundingClientRect();
            setPercentage(((clientX - rect.left) / rect.width) * 100);
        };

        const startDrag = (e) => {
            isDragging = true;
            try { baHandle.setPointerCapture(e.pointerId); } catch (err) {}
            setFromClientX(e.clientX);
            baHandle.focus({ preventScroll: true });
        };

        // Arrastar a partir da alça (mouse e toque unificados)
        baHandle.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            startDrag(e);
        });
        baHandle.addEventListener('pointermove', (e) => {
            if (isDragging) setFromClientX(e.clientX);
        });
        const stopDrag = () => { isDragging = false; };
        baHandle.addEventListener('pointerup', stopDrag);
        baHandle.addEventListener('pointercancel', stopDrag);

        // Clique/toque direto em outro ponto do comparador
        baContainer.addEventListener('pointerdown', (e) => {
            if (e.target === baHandle) return;
            setFromClientX(e.clientX);
        });

        // Acessibilidade por teclado
        baHandle.addEventListener('keydown', (e) => {
            const current = parseFloat(baHandle.getAttribute('aria-valuenow')) || 50;
            const step = e.shiftKey ? 10 : 2;
            let next = null;
            if (e.key === 'ArrowLeft') next = current - step;
            else if (e.key === 'ArrowRight') next = current + step;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = 100;
            if (next === null) return;
            e.preventDefault();
            setPercentage(next);
        });
    }

    // 7. Galeria + Lightbox (acessível por mouse, toque e teclado)
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    let lastFocused = null;

    document.querySelectorAll('.gallery-item').forEach(item => {
        const title = item.getAttribute('data-title') || 'Trabalho Limpô Rio Preto';
        const imgSrc = item.getAttribute('data-img') || item.querySelector('img')?.src;

        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Ampliar imagem: ${title}`);

        const openLightbox = () => {
            if (!(lightboxImg && lightboxCaption && lightboxModal && imgSrc)) return;
            lastFocused = item;
            lightboxCaption.textContent = title;
            lightboxImg.innerHTML = `<img src="${imgSrc}" alt="${title}" class="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl mx-auto">`;
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (lightboxClose) lightboxClose.focus({ preventScroll: true });
        };

        item.addEventListener('click', openLightbox);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox();
            }
        });
    });

    const closeLightbox = () => {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus({ preventScroll: true });
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.setAttribute('aria-hidden', 'true');
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});
