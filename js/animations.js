export function initAnimations() {
    const body = document.body;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionEnabled = !reducedMotion && 'IntersectionObserver' in window;
    
    const animatedItems = document.querySelectorAll('.fade-up');
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('#site-nav a');

    if (motionEnabled) {
        body.classList.add('js-motion');

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.01,
            rootMargin: '0px 0px -20px 0px'
        });

        animatedItems.forEach((item) => revealObserver.observe(item));
        
        window.requestAnimationFrame(() => {
            animatedItems.forEach((item) => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
                    item.classList.add('visible');
                }
            });
        });
    } else {
        animatedItems.forEach((item) => item.classList.add('visible'));
    }

    if ('IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const activeId = `#${entry.target.id}`;
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === activeId);
                });
            });
        }, { threshold: 0.55 });

        sections.forEach((section) => navObserver.observe(section));
    }
}
