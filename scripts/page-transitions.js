// Page Transitions using View Transitions API (MPA)
// Enable with: <meta name="view-transition" content="same-origin">

(function() {
    'use strict';

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
        return;
    }

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Add view-transition-name to key elements for consistent identity across pages
    function addViewTransitionNames() {
        // Common elements that exist across pages
        const elements = [
            { selector: 'video[autoplay]', name: 'bg-video' },
            { selector: '.menu-bg-video', name: 'menu-bg-video' },
            { selector: '.letter-group-bg-video', name: 'letter-group-bg-video' },
            { selector: '.home-page .content', name: 'home-title' },
            { selector: '.menu-page .intro-text', name: 'menu-intro' },
            { selector: '.menu-page .button-container', name: 'menu-buttons' },
            { selector: '.menu-page .button-wrapper:nth-child(1)', name: 'btn-1' },
            { selector: '.menu-page .button-wrapper:nth-child(2)', name: 'btn-2' },
            { selector: '.menu-page .button-wrapper:nth-child(3)', name: 'btn-3' },
            { selector: '.letter-group-page h1', name: 'letter-group-title' },
            { selector: '.letter-group-page ul', name: 'letter-list' },
            { selector: '.letter-page h1', name: 'letter-title' },
            { selector: '.letter-page p', name: 'letter-content' },
            { selector: '.confetti-container', name: 'confetti' },
        ];

        elements.forEach(({ selector, name }) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.viewTransitionName = name;
            }
        });

        // Letter list items
        document.querySelectorAll('.letter-group-page li').forEach((li, i) => {
            li.style.viewTransitionName = `letter-item-${i}`;
        });

        // Individual letter pages - give unique names to text elements
        const letterTitle = document.querySelector('.letter-page h1');
        if (letterTitle) {
            letterTitle.style.viewTransitionName = 'letter-title';
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addViewTransitionNames);
    } else {
        addViewTransitionNames();
    }
})();