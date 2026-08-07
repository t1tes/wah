// Letter Transition Overlay Module
// Provides a full-screen transition effect when clicking letter links

(function() {
    'use strict';

    // Guard to prevent multiple simultaneous transitions
    let isTransitioning = false;

    /**
     * Initialize letter transitions for all letter links on the page
     * @param {Object} options - Configuration options
     * @param {string} options.defaultText - Default text to show (default: "Opening Letter...")
     * @param {number} options.holdDuration - How long to hold the overlay in ms (default: 1800)
     * @param {number} options.fadeDuration - Fade in/out duration in ms (default: 300)
     */
    function initLetterTransitions(options = {}) {
        const config = {
            defaultText: options.defaultText || 'Opening Letter...',
            holdDuration: options.holdDuration || 1800,
            fadeDuration: options.fadeDuration || 300,
        };

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return; // Skip transition entirely for reduced motion users
        }

        // Select all letter links in the letter group page
        const letterLinks = document.querySelectorAll('.letter-group-page ul li a, .letter-group-page .letter-19-title');
        if (letterLinks.length === 0) {
            return;
        }

        // Create and inject overlay styles
        injectOverlayStyles(config.fadeDuration);

        // Create overlay element
        const overlay = createOverlay(config.defaultText, config.fadeDuration);
        document.body.appendChild(overlay);

        // Attach click handlers to each letter link
        letterLinks.forEach((link, index) => {
            link.addEventListener('click', (event) => {
                handleLetterClick(event, link, overlay, config);
            });
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
     * Create the overlay element with text
     */
    function createOverlay(defaultText, fadeDuration) {
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
            transition: opacity ${fadeDuration}ms ease;
        `;

        const text = document.createElement('div');
        text.className = 'letter-transition-overlay-text';
        text.style.cssText = `
            font-family: 'JMHTypewriter', monospace;
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            color: #fff;
            text-align: center;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
            padding: 1rem;
        `;
        text.textContent = defaultText;

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
            }
            .letter-transition-overlay.fade-out {
                opacity: 0;
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
     * Handle click on a letter link
     */
    function handleLetterClick(event, link, overlay, config) {
        // Prevent multiple simultaneous transitions
        if (isTransitioning) {
            event.preventDefault();
            return;
        }
        isTransitioning = true;

        event.preventDefault();

        const href = link.getAttribute('href');
        if (!href) {
            isTransitioning = false;
            return;
        }

        // Try to extract letter number/name from the link for personalized text
        const img = link.querySelector('img');
        const altText = img ? img.getAttribute('alt') : '';
        const letterName = altText || link.textContent.trim() || config.defaultText.replace('...', '').trim();

        // Show personalized text
        overlay._textElement.textContent = `Opening ${letterName}...`;

        // Show overlay
        overlay.style.display = 'flex';
        // Force reflow to ensure transition works
        overlay.offsetHeight;
        overlay.classList.add('visible');

        // Hold then fade out and navigate
        setTimeout(() => {
            overlay.classList.remove('visible');
            overlay.classList.add('fade-out');

            setTimeout(() => {
                // Navigate to the letter page
                window.location.href = href;
            }, config.fadeDuration);
        }, config.holdDuration);
    }

    // Export for use in pages
    window.initLetterTransitions = initLetterTransitions;

})();