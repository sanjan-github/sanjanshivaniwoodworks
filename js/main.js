import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initContactForm } from './contact-form.js';
import { initGallery } from './gallery.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initContactForm();
    initGallery();
});
