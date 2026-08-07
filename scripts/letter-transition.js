// Letter Transition - Click to proceed overlay
// Shows a full-screen overlay with "Click to open Letter X" text that user clicks to navigate

(function() {
    'use strict';

    let pendingHref = null;

    function initLetterTransitions() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const letterLinks = document.querySelectorAll('.letter-group-page ul li a, .letter-group-page .letter-19-title');
        if (letterLinks.length === 0) return;

        injectStyles();
        const overlay = createOverlay();
        document.body.appendChild(overlay);

        letterLinks.forEach(link => {
            link.addEventListener('click', (e) => handleLetterClick(e, link, overlay));
        });

        overlay.addEventListener('click', () => {
            if (pendingHref) {
                window.location.href = pendingHref;
                pendingHref = null;
            }
            hideOverlay(overlay);
        });
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'letter-transition-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.95);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; opacity: 0; pointer-events: none;
            transition: opacity 300ms ease; cursor: pointer;
        `;

        const text = document.createElement('div');
        text.className = 'letter-transition-overlay-text';
        text.style.cssText = `
            font-family: 'JMHTypewriter', monospace;
            font-size: clamp(1.5rem, 4vw, 2.5rem); color: #fff;
            text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.6);
            padding: 2rem; max-width: 90%;
        `;
        overlay.appendChild(text);
        overlay._textElement = text;
        return overlay;
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .letter-transition-overlay.visible { opacity: 1; pointer-events: auto; }
            .letter-transition-overlay-text { animation: letterReveal 300ms ease forwards; }
            @keyframes letterReveal { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
            @media (prefers-reduced-motion: reduce) {
                .letter-transition-overlay { display:none!important; }
                .letter-transition-overlay-text { animation:none; }
            }
        `;
        document.head.appendChild(style);
    }

    function handleLetterClick(e, link, overlay) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (!href) return;
        pendingHref = href;

        const img = link.querySelector('img');
        const letterName = img?.getAttribute('alt') || link.textContent.trim() || 'this letter';
        overlay._textElement.textContent = `Click to open ${letterName}`;

        overlay.style.display = 'flex';
        overlay.offsetHeight;
        overlay.classList.add('visible');
    }

    function hideOverlay(overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.style.display = 'none', 300);
    }

    window.initLetterTransitions = initLetterTransitions;

    // Auto-init on letter group pages
    if (document.querySelector('.letter-group-page')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLetterTransitions);
        } else {
            initLetterTransitions();
        }
    }
})();