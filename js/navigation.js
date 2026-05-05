export function initNavigation() {
    const body = document.body;
    const header = document.querySelector('#main-header');
    const nav = document.querySelector('#site-nav');
    const menuButton = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelectorAll('#site-nav a');

    if (nav) nav.setAttribute('aria-hidden', 'true');

    const setHeaderState = () => {
        if (window.scrollY > 32) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    const toggleMenu = (forceOpen) => {
        if (!nav || !menuButton) return;

        const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !nav.classList.contains('open');
        nav.classList.toggle('open', shouldOpen);
        nav.setAttribute('aria-hidden', String(!shouldOpen));
        menuButton.setAttribute('aria-expanded', String(shouldOpen));
        menuButton.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Open navigation menu');
        header.classList.toggle('menu-open', shouldOpen);
        body.classList.toggle('menu-open', shouldOpen);
    };

    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    if (menuButton && nav) {
        menuButton.addEventListener('click', () => toggleMenu());

        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 768 && nav.classList.contains('open') &&
                event.target instanceof Node && !nav.contains(event.target) && !menuButton.contains(event.target)) {
                toggleMenu(false);
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) toggleMenu(false);
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) toggleMenu(false);
        });
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();
            const headerOffset = header ? header.offsetHeight + 12 : 80;
            const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetTop,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });
        });
    });
}
