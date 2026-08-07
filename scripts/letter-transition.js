// Letter Transition Overlay Module
// Shows a full-screen overlay that requires a click to proceed to the letter

(function() {
    'use strict';

    console.log('[LetterTransition] Module loaded');

    // Store the target href for navigation
    let pendingHref = null;

    /**
     * Initialize letter transitions for all letter links on the page
     * @param {Object} options - Configuration options
     * @param {string} options.defaultText - Default text prefix (default: "Click to open ")
     * @param {number} options.fadeDuration - Fade in duration in ms (default: 300)
     */
    function initLetterTransitions(options = {}) {
        console.log('[LetterTransition] >>> initLetterTransitions called <<<', options);
        const config = {
            defaultText: options.defaultText || 'Click to open ',
            fadeDuration: options.fadeDuration || 300,
        };

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        console.log('[LetterTransition] prefersReducedMotion:', prefersReducedMotion);
        if (prefersReducedMotion) {
            console.log('[LetterTransition] Skipping - reduced motion enabled');
            return;
        }

        // Select all letter links in the letter group page
        const letterLinks = document.querySelectorAll('.letter-group-page ul li a, .letter-group-page .letter-19-title');
        console.log('[LetterTransition] Found letter links:', letterLinks.length);
        if (letterLinks.length === 0) {
            console.log('[LetterTransition] No letter links found, aborting');
            return;
        }

        // Log each link for debugging
        letterLinks.forEach((link, i) => {
            const img = link.querySelector('img');
            console.log(`[LetterTransition] Link ${i}:`, link.href, img?.alt || link.textContent?.trim());
        });

        // Create and inject overlay styles
        injectOverlayStyles(config.fadeDuration);

        // Create overlay element
        const overlay = createOverlay(config);
        document.body.appendChild(overlay);
        console.log('[LetterTransition] Overlay added to body');

        // Attach click handlers to each letter link
        letterLinks.forEach((link, index) => {
            link.addEventListener('click', (event) => {
                console.log('[LetterTransition] Letter link clicked:', link.href);
                handleLetterClick(event, link, overlay, config);
            });
        });
        console.log('[LetterTransition] Letter click handlers attached');

        // Click on overlay to proceed
        overlay.addEventListener('click', () => {
            console.log('[LetterTransition] Overlay clicked, navigating to:', pendingHref);
            if (pendingHref) {
                window.location.href = pendingHref;
                pendingHref = null;
            }
            hideOverlay(overlay, config.fadeDuration);
        });

        // Listen for reduced motion changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                overlay.style.display = 'none';
            } else {
                overlay.style.display = '';
            }
        });
    }

    /**
     * Create the overlay element with clickable text
     */
    function createOverlay(config) {
        const overlay = document.createElement('div');
        overlay.className = 'letter-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity ${config.fadeDuration}ms ease;
            cursor: pointer;
        `;

        const text = document.createElement('div');
        text.className = 'letter-transition-overlay-text';
        text.style.cssText = `
            font-family: 'JMHTypewriter', monospace;
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            color: #fff;
            text-align: center;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
            padding: 2rem;
            max-width: 90%;
        `;
        text.textContent = config.defaultText;

        overlay.appendChild(text);
        overlay._textElement = text;

        return overlay;
    }

    /**
     * Inject CSS styles for the overlay
     */
    function injectOverlayStyles(fadeDuration) {
        const style = document.createElement('style');
        style.textContent = `
            .letter-transition-overlay.visible {
                opacity: 1;
                pointer-events: auto;
            }
            .letter-transition-overlay-text {
                animation: letterTransitionTextReveal ${fadeDuration}ms ease forwards;
            }
            @keyframes letterTransitionTextReveal {
                0% {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @media (prefers-reduced-motion: reduce) {
                .letter-transition-overlay {
                    display: none !important;
                }
                .letter-transition-overlay-text {
                    animation: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Handle click on a letter link - show overlay
     */
    function handleLetterClick(event, link, overlay, config) {
        console.log('[LetterTransition] handleLetterClick called');

        event.preventDefault();

        const href = link.getAttribute('href');
        if (!href) return;

        // Store href for overlay click
        pendingHref = href;

        // Try to extract letter number/name from the link for personalized text
        const img = link.querySelector('img');
        const altText = img ? img.getAttribute('alt') : '';
        const letterName = altText || link.textContent.trim() || 'this letter';

        // Show personalized text
        overlay._textElement.textContent = `${config.defaultText}${letterName}`;

        // Show overlay
        overlay.style.display = 'flex';
        // Force reflow to ensure transition works
        overlay.offsetHeight;
        overlay.classList.add('visible');
        console.log('[LetterTransition] Overlay shown, waiting for click');
    }

    /**
     * Hide overlay after click
     */
    function hideOverlay(overlay, fadeDuration) {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, fadeDuration);
    }

    // Export for use in pages
    window.initLetterTransitions = initLetterTransitions;

    // Auto-initialize if on a letter group page (backup in case inline script doesn't call it)
    if (document.querySelector('.letter-group-page')) {
        console.log('[LetterTransition] Auto-detected letter group page, will init on DOM ready');
        const runInit = () => {
            console.log('[LetterTransition] Auto-init running');
            initLetterTransitions({
                defaultText: 'Click to open ',
                fadeDuration: 300
            });
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runInit);
        } else {
            runInit();
        }
    }

})();