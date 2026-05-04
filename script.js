document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('#main-header');
    const nav = document.querySelector('#site-nav');
    const menuButton = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelectorAll('#site-nav a');
    const sections = document.querySelectorAll('main section[id]');
    const animatedItems = document.querySelectorAll('.fade-up');
    const contactForm = document.querySelector('#contactForm');
    const formStatus = document.querySelector('#formStatus');
    const currentYear = document.querySelector('#currentYear');
    const galleryModal = document.querySelector('#galleryModal');
    const galleryCategory = document.querySelector('#galleryModalCategory');
    const galleryTitle = document.querySelector('#galleryModalTitle');
    const galleryDescription = document.querySelector('#galleryModalDescription');
    const galleryCounter = document.querySelector('#galleryModalCounter');
    const galleryImage = document.querySelector('#galleryModalImage');
    const galleryImageFrame = document.querySelector('#galleryImageFrame');
    const galleryCards = [...document.querySelectorAll('.gallery-card')];
    const galleryNavButtons = [...document.querySelectorAll('[data-gallery-nav]')];
    const galleryZoomButtons = [...document.querySelectorAll('[data-gallery-zoom]')];
    const galleryZoomResetButton = document.querySelector('[data-gallery-zoom="reset"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionEnabled = !reducedMotion && 'IntersectionObserver' in window;
    const WHATSAPP_NUMBER = '919848519310';
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;
    const ZOOM_STEP = 0.25;
    let lastFocusedTrigger = null;

    const galleryState = {
        items: [],
        index: 0,
        scale: 1,
        translateX: 0,
        translateY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0
    };

    if (nav) {
        nav.setAttribute('aria-hidden', 'true');
    }

    if (motionEnabled) {
        body.classList.add('js-motion');
    }

    const syncBodyLock = () => {
        const navOpen = Boolean(nav && nav.classList.contains('open'));
        const galleryOpen = Boolean(galleryModal && galleryModal.classList.contains('is-open'));
        body.classList.toggle('menu-open', navOpen || galleryOpen);
    };

    const setHeaderState = () => {
        if (window.scrollY > 32) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    const toggleMenu = (forceOpen) => {
        if (!nav || !menuButton) {
            return;
        }

        const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !nav.classList.contains('open');
        nav.classList.toggle('open', shouldOpen);
        nav.setAttribute('aria-hidden', String(!shouldOpen));
        menuButton.setAttribute('aria-expanded', String(shouldOpen));
        menuButton.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Open navigation menu');
        header.classList.toggle('menu-open', shouldOpen);
        syncBodyLock();
    };

    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    if (menuButton && nav) {
        menuButton.addEventListener('click', () => toggleMenu());

        document.addEventListener('click', (event) => {
            if (
                window.innerWidth <= 768 &&
                nav.classList.contains('open') &&
                event.target instanceof Node &&
                !nav.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                toggleMenu(false);
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleMenu(false);
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                toggleMenu(false);
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            event.preventDefault();
            const headerOffset = header ? header.offsetHeight + 12 : 80;
            const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetTop,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });
        });
    });

    if (motionEnabled) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

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
                if (!entry.isIntersecting) {
                    return;
                }

                const activeId = `#${entry.target.id}`;
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === activeId);
                });
            });
        }, {
            threshold: 0.55
        });

        sections.forEach((section) => navObserver.observe(section));
    }

    const showFormStatus = (message, type) => {
        if (!formStatus) {
            return;
        }

        formStatus.textContent = message;
        formStatus.className = type;
    };

    const validatePhoneField = (field) => {
        if (!field || field.name !== 'phone') {
            return true;
        }

        const trimmedValue = field.value.trim();
        if (!trimmedValue) {
            field.setCustomValidity('');
            return false;
        }

        const digits = trimmedValue.replace(/\D/g, '');
        const isPhoneValid = digits.length >= 10 && digits.length <= 15;
        field.setCustomValidity(isPhoneValid ? '' : 'Please enter a valid contact number with at least 10 digits.');
        return isPhoneValid;
    };

    const markValidity = (field) => {
        if (!field) {
            return true;
        }

        validatePhoneField(field);
        const isFieldValid = field.checkValidity();
        field.classList.toggle('invalid', !isFieldValid);
        return isFieldValid;
    };

    if (contactForm) {
        const fields = [...contactForm.querySelectorAll('input, select, textarea')];
        fields.forEach((field) => {
            const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
            field.addEventListener(eventName, () => markValidity(field));
            field.addEventListener('blur', () => markValidity(field));
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const valid = fields.every((field) => markValidity(field));

            if (!valid) {
                showFormStatus('Please complete the highlighted fields so we can prepare your WhatsApp message.', 'error');
                const firstInvalid = contactForm.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            const formData = new FormData(contactForm);
            const name = String(formData.get('name') || '').trim();
            const phone = String(formData.get('phone') || '').trim();
            const service = String(formData.get('service') || '').trim();
            const timeline = String(formData.get('timeline') || '').trim();
            const message = String(formData.get('message') || '').trim();
            const whatsappMessage = [
                'Hello, I am contacting you from your website.',
                '',
                `Name: ${name}`,
                `Contact Number: ${phone}`,
                `Service Needed: ${service}`,
                `When Needed: ${timeline}`,
                '',
                'Project Details:',
                message
            ].join('\n');
            const whatsappUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(whatsappMessage)}`;

            const whatsappTab = window.open('', '_blank');
            if (!whatsappTab) {
                showFormStatus('Please allow pop-ups so WhatsApp can open in a new tab.', 'error');
                return;
            }

            whatsappTab.opener = null;
            whatsappTab.location.href = whatsappUrl;
            showFormStatus('Opening WhatsApp in a new tab with your message details filled in.', 'success');

            contactForm.reset();
            fields.forEach((field) => {
                field.classList.remove('invalid');
                if (field.name === 'phone') {
                    field.setCustomValidity('');
                }
            });
        });
    }

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const updateZoomButtonLabel = () => {
        if (!galleryZoomResetButton) {
            return;
        }

        galleryZoomResetButton.textContent = `${Math.round(galleryState.scale * 100)}%`;
    };

    const resetPan = () => {
        galleryState.translateX = 0;
        galleryState.translateY = 0;
    };

    const clampPan = () => {
        if (!galleryImage) {
            return;
        }

        const maxX = Math.max(0, (galleryImage.clientWidth * (galleryState.scale - 1)) / 2);
        const maxY = Math.max(0, (galleryImage.clientHeight * (galleryState.scale - 1)) / 2);
        galleryState.translateX = clamp(galleryState.translateX, -maxX, maxX);
        galleryState.translateY = clamp(galleryState.translateY, -maxY, maxY);
    };

    const applyImageTransform = () => {
        if (!galleryImage || !galleryImageFrame) {
            return;
        }

        clampPan();
        galleryImage.style.transform = `translate(${galleryState.translateX}px, ${galleryState.translateY}px) scale(${galleryState.scale})`;
        galleryImageFrame.classList.toggle('is-draggable', galleryState.scale > 1.01);
        updateZoomButtonLabel();
    };

    const setZoom = (nextScale) => {
        galleryState.scale = clamp(nextScale, MIN_ZOOM, MAX_ZOOM);
        if (galleryState.scale === MIN_ZOOM) {
            resetPan();
        }
        applyImageTransform();
    };

    const resetZoom = () => {
        galleryState.scale = MIN_ZOOM;
        resetPan();
        applyImageTransform();
    };

    const getGalleryItemsForCard = (card) => {
        const group = card.closest('.portfolio-group');
        return group ? [...group.querySelectorAll('.gallery-card')] : galleryCards;
    };

    const renderGalleryItem = () => {
        if (!galleryImage || !galleryCategory || !galleryTitle || !galleryDescription || !galleryCounter) {
            return;
        }

        const currentItem = galleryState.items[galleryState.index];
        if (!currentItem) {
            return;
        }

        const previewImage = currentItem.querySelector('img');
        galleryImage.src = currentItem.dataset.gallerySrc || previewImage?.getAttribute('src') || '';
        galleryImage.alt = previewImage?.getAttribute('alt') || currentItem.dataset.galleryTitle || '';
        galleryCategory.textContent = currentItem.dataset.galleryCategory || '';
        galleryTitle.textContent = currentItem.dataset.galleryTitle || '';
        galleryDescription.textContent = currentItem.dataset.galleryDescription || '';
        galleryCounter.textContent = `${galleryState.index + 1} of ${galleryState.items.length}`;
        resetZoom();
    };

    const openGallery = (trigger) => {
        if (!galleryModal || !trigger) {
            return;
        }

        lastFocusedTrigger = trigger;
        galleryState.items = getGalleryItemsForCard(trigger);
        galleryState.index = Math.max(0, galleryState.items.indexOf(trigger));
        renderGalleryItem();
        galleryModal.classList.add('is-open');
        galleryModal.setAttribute('aria-hidden', 'false');
        syncBodyLock();

        const closeButton = galleryModal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();
        }
    };

    const closeGallery = () => {
        if (!galleryModal || !galleryImage) {
            return;
        }

        galleryModal.classList.remove('is-open');
        galleryModal.setAttribute('aria-hidden', 'true');
        galleryState.items = [];
        galleryState.index = 0;
        resetZoom();
        galleryImage.removeAttribute('src');
        galleryImage.alt = '';
        syncBodyLock();

        if (lastFocusedTrigger) {
            lastFocusedTrigger.focus();
        }
    };

    const goToGalleryItem = (direction) => {
        if (!galleryState.items.length) {
            return;
        }

        const total = galleryState.items.length;
        galleryState.index = (galleryState.index + direction + total) % total;
        renderGalleryItem();
    };

    galleryCards.forEach((card) => {
        card.addEventListener('click', () => openGallery(card));
    });

    galleryNavButtons.forEach((button) => {
        button.addEventListener('click', () => {
            goToGalleryItem(button.dataset.galleryNav === 'next' ? 1 : -1);
        });
    });

    galleryZoomButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const action = button.dataset.galleryZoom;
            if (action === 'in') {
                setZoom(galleryState.scale + ZOOM_STEP);
            }

            if (action === 'out') {
                setZoom(galleryState.scale - ZOOM_STEP);
            }

            if (action === 'reset') {
                resetZoom();
            }
        });
    });

    if (galleryImage) {
        galleryImage.addEventListener('load', () => {
            applyImageTransform();
        });
    }

    if (galleryImageFrame) {
        galleryImageFrame.addEventListener('wheel', (event) => {
            if (!galleryModal || !galleryModal.classList.contains('is-open')) {
                return;
            }

            event.preventDefault();
            setZoom(galleryState.scale + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
        }, { passive: false });

        galleryImageFrame.addEventListener('pointerdown', (event) => {
            if (galleryState.scale <= MIN_ZOOM) {
                return;
            }

            galleryState.isDragging = true;
            galleryState.startX = event.clientX;
            galleryState.startY = event.clientY;
            galleryState.originX = galleryState.translateX;
            galleryState.originY = galleryState.translateY;
            galleryImageFrame.classList.add('is-dragging');
            galleryImageFrame.setPointerCapture(event.pointerId);
        });

        galleryImageFrame.addEventListener('pointermove', (event) => {
            if (!galleryState.isDragging) {
                return;
            }

            galleryState.translateX = galleryState.originX + (event.clientX - galleryState.startX);
            galleryState.translateY = galleryState.originY + (event.clientY - galleryState.startY);
            applyImageTransform();
        });

        const stopDragging = (event) => {
            if (!galleryState.isDragging) {
                return;
            }

            galleryState.isDragging = false;
            galleryImageFrame.classList.remove('is-dragging');
            if (galleryImageFrame.hasPointerCapture(event.pointerId)) {
                galleryImageFrame.releasePointerCapture(event.pointerId);
            }
        };

        galleryImageFrame.addEventListener('pointerup', stopDragging);
        galleryImageFrame.addEventListener('pointercancel', stopDragging);
    }

    if (galleryModal) {
        galleryModal.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.hasAttribute('data-close-gallery')) {
                closeGallery();
            }
        });
    }

    window.addEventListener('resize', () => {
        if (galleryModal && galleryModal.classList.contains('is-open')) {
            applyImageTransform();
        }
    });

    document.addEventListener('keydown', (event) => {
        const isGalleryOpen = Boolean(galleryModal && galleryModal.classList.contains('is-open'));

        if (event.key === 'Escape') {
            if (isGalleryOpen) {
                closeGallery();
            }

            if (nav && nav.classList.contains('open')) {
                toggleMenu(false);
            }
            return;
        }

        if (!isGalleryOpen) {
            return;
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToGalleryItem(1);
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToGalleryItem(-1);
        }

        if (event.key === '+' || (event.key === '=' && event.shiftKey)) {
            event.preventDefault();
            setZoom(galleryState.scale + ZOOM_STEP);
        }

        if (event.key === '-') {
            event.preventDefault();
            setZoom(galleryState.scale - ZOOM_STEP);
        }

        if (event.key === '0') {
            event.preventDefault();
            resetZoom();
        }
    });

    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }
});
