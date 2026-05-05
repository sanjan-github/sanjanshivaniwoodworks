import { galleryData } from './gallery-data.js';

export function initGallery() {
    // 1. Render the gallery items into the DOM
    // The items are categorized. We need to group them by category and render them into their respective sections.
    
    // First, let's clear out all sections in case there's old data, or rather, find the matching section and append
    const categoryMap = {
        'Doors': '#portfolio-doors',
        'Furniture': '#portfolio-furniture',
        'Cabinets': '#portfolio-cabinets',
        'Aluminium': '#portfolio-aluminium',
        'Elevation': '#portfolio-elevation'
    };

    // Find the sw-gallery-grid within each section and populate
    Object.entries(categoryMap).forEach(([category, selector]) => {
        const section = document.querySelector(selector);
        if (!section) return;
        
        let grid = section.querySelector('.sw-gallery-grid');
        if (!grid) return;

        const items = galleryData.filter(item => item.category === category);
        
        let html = '';
        items.forEach(item => {
            html += `
                <a href="${item.src}" class="gallery-card glightbox" data-gallery="${category.replace(/[^a-zA-Z0-9]/g, '')}" data-title="${item.title}" data-description="${item.description}">
                    <span class="gallery-card-image">
                        <img src="${item.src}" alt="${item.alt}" loading="lazy">
                    </span>
                    <span class="gallery-card-copy">
                        <span class="gallery-card-tag">${item.category}</span>
                        <strong>${item.title}</strong>
                    </span>
                </a>
            `;
        });
        
        grid.innerHTML = html;
    });

    // 2. Initialize GLightbox
    // Check if GLightbox is loaded
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            zoomable: true
        });
    } else {
        console.error('GLightbox is not loaded.');
    }
}
