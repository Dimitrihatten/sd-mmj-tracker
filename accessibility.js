// Accessibility Enhancement Library for SD MMJ Tracker
(function() {
    'use strict';

    // Accessibility Manager
    class AccessibilityManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupScreenReaderSupport();
            this.setupColorContrastDetection();
            this.setupMotionPreferences();
            this.setupLiveRegions();
        }

        setupKeyboardNavigation() {
            // Skip links enhancement
            this.enhanceSkipLinks();

            // Roving tabindex for complex widgets
            this.setupRovingTabindex();

            // Escape key handling
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.handleEscapeKey(e);
                }
            });

            // Arrow key navigation for menus
            this.setupArrowKeyNavigation();
        }

        enhanceSkipLinks() {
            const skipLinks = document.querySelectorAll('.skip-link');

            skipLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);

                    if (target) {
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                        target.scrollIntoView({ behavior: 'smooth' });

                        // Remove tabindex after blur
                        target.addEventListener('blur', () => {
                            target.removeAttribute('tabindex');
                        }, { once: true });
                    }
                });
            });
        }

        setupRovingTabindex() {
            const navMenus = document.querySelectorAll('.nav-menu');

            navMenus.forEach(menu => {
                const links = menu.querySelectorAll('.nav-link');
                if (links.length === 0) return;

                // Set initial state
                links[0].setAttribute('tabindex', '0');
                for (let i = 1; i < links.length; i++) {
                    links[i].setAttribute('tabindex', '-1');
                }

                // Handle arrow key navigation
                links.forEach((link, index) => {
                    link.addEventListener('keydown', (e) => {
                        let nextIndex;

                        switch (e.key) {
                            case 'ArrowRight':
                            case 'ArrowDown':
                                e.preventDefault();
                                nextIndex = (index + 1) % links.length;
                                break;
                            case 'ArrowLeft':
                            case 'ArrowUp':
                                e.preventDefault();
                                nextIndex = (index - 1 + links.length) % links.length;
                                break;
                            case 'Home':
                                e.preventDefault();
                                nextIndex = 0;
                                break;
                            case 'End':
                                e.preventDefault();
                                nextIndex = links.length - 1;
                                break;
                            default:
                                return;
                        }

                        // Update tabindex and focus
                        links[index].setAttribute('tabindex', '-1');
                        links[nextIndex].setAttribute('tabindex', '0');
                        links[nextIndex].focus();
                    });
                });
            });
        }

        setupArrowKeyNavigation() {
            const buttonGroups = document.querySelectorAll('[role="group"]');

            buttonGroups.forEach(group => {
                const buttons = group.querySelectorAll('button, [role="button"]');
                if (buttons.length <= 1) return;

                buttons.forEach((button, index) => {
                    button.addEventListener('keydown', (e) => {
                        let nextIndex;

                        switch (e.key) {
                            case 'ArrowRight':
                                e.preventDefault();
                                nextIndex = (index + 1) % buttons.length;
                                break;
                            case 'ArrowLeft':
                                e.preventDefault();
                                nextIndex = (index - 1 + buttons.length) % buttons.length;
                                break;
                            default:
                                return;
                        }

                        buttons[nextIndex].focus();
                    });
                });
            });
        }

        handleEscapeKey(e) {
            // Close modals, dropdowns, etc.
            const openModals = document.querySelectorAll('.modal.active, .dropdown.active');
            if (openModals.length > 0) {
                openModals.forEach(modal => {
                    modal.classList.remove('active');
                });
                e.preventDefault();
            }

            // Close mobile navigation
            const mobileNav = document.querySelector('.nav-menu.active');
            if (mobileNav) {
                mobileNav.classList.remove('active');
                const toggle = document.querySelector('.nav-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
                e.preventDefault();
            }
        }

        setupFocusManagement() {
            // Focus trap for modals
            this.setupFocusTrap();

            // Focus indicators
            this.enhanceFocusIndicators();

            // Focus restoration
            this.setupFocusRestoration();
        }

        setupFocusTrap() {
            const modals = document.querySelectorAll('.modal, .dialog');

            modals.forEach(modal => {
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        this.trapFocus(e, modal);
                    }
                });
            });
        }

        trapFocus(e, container) {
            const focusableElements = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }

        enhanceFocusIndicators() {
            // Add high-contrast focus indicators
            const style = document.createElement('style');
            style.textContent = `
                .keyboard-navigation *:focus {
                    outline: 3px solid #0066cc !important;
                    outline-offset: 2px !important;
                    box-shadow: 0 0 0 1px #ffffff !important;
                }

                @media (prefers-contrast: high) {
                    .keyboard-navigation *:focus {
                        outline: 4px solid #000000 !important;
                        outline-offset: 2px !important;
                        box-shadow: 0 0 0 2px #ffffff !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setupFocusRestoration() {
            let lastFocusedElement = null;

            // Store focus before opening modals
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-modal-trigger]')) {
                    lastFocusedElement = e.target;
                }
            });

            // Restore focus when modals close
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target;
                        if (target.classList.contains('modal') && !target.classList.contains('active')) {
                            if (lastFocusedElement) {
                                lastFocusedElement.focus();
                                lastFocusedElement = null;
                            }
                        }
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        }

        setupScreenReaderSupport() {
            // Live regions for dynamic content
            this.createLiveRegions();

            // ARIA labels enhancement
            this.enhanceAriaLabels();

            // Screen reader only text
            this.addScreenReaderText();
        }

        createLiveRegions() {
            // Create polite live region
            const politeRegion = document.createElement('div');
            politeRegion.setAttribute('aria-live', 'polite');
            politeRegion.setAttribute('aria-atomic', 'true');
            politeRegion.className = 'sr-only';
            politeRegion.id = 'polite-announcements';
            document.body.appendChild(politeRegion);

            // Create assertive live region
            const assertiveRegion = document.createElement('div');
            assertiveRegion.setAttribute('aria-live', 'assertive');
            assertiveRegion.setAttribute('aria-atomic', 'true');
            assertiveRegion.className = 'sr-only';
            assertiveRegion.id = 'assertive-announcements';
            document.body.appendChild(assertiveRegion);
        }

        enhanceAriaLabels() {
            // Add aria-labels to buttons without text content
            const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');

            buttons.forEach(button => {
                const text = button.textContent.trim();
                if (!text) {
                    // Try to determine purpose from context
                    if (button.classList.contains('nav-toggle')) {
                        button.setAttribute('aria-label', 'Toggle navigation menu');
                    } else if (button.classList.contains('search-btn')) {
                        button.setAttribute('aria-label', 'Search');
                    } else if (button.classList.contains('close')) {
                        button.setAttribute('aria-label', 'Close');
                    }
                }
            });

            // Enhance form labels
            const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
            inputs.forEach(input => {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (!label && input.placeholder) {
                    input.setAttribute('aria-label', input.placeholder);
                }
            });
        }

        addScreenReaderText() {
            // Add context for screen readers
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
                if (heading && !heading.id) {
                    heading.id = `card-heading-${index}`;
                    card.setAttribute('aria-labelledby', heading.id);
                }
            });

            // Add status information
            const statusElements = document.querySelectorAll('.status');
            statusElements.forEach(status => {
                if (!status.getAttribute('aria-label')) {
                    const statusText = status.textContent.trim();
                    status.setAttribute('aria-label', `Status: ${statusText}`);
                }
            });
        }

        setupColorContrastDetection() {
            // Detect user's contrast preference
            const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

            if (prefersHighContrast) {
                document.body.classList.add('high-contrast');
            }

            // Listen for changes
            window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
                if (e.matches) {
                    document.body.classList.add('high-contrast');
                } else {
                    document.body.classList.remove('high-contrast');
                }
            });
        }

        setupMotionPreferences() {
            // Respect reduced motion preferences
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion) {
                document.body.classList.add('reduced-motion');
            }

            // Listen for changes
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                if (e.matches) {
                    document.body.classList.add('reduced-motion');
                } else {
                    document.body.classList.remove('reduced-motion');
                }
            });
        }

        setupLiveRegions() {
            // Form validation announcements
            document.addEventListener('formValidated', (e) => {
                const politeRegion = document.getElementById('polite-announcements');
                if (politeRegion) {
                    if (e.detail.isValid) {
                        politeRegion.textContent = 'Form submitted successfully.';
                    } else {
                        const errorCount = Object.keys(e.detail.errors).length;
                        politeRegion.textContent = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review and correct.`;
                    }
                }
            });

            // Navigation announcements
            document.addEventListener('sectionChanged', (e) => {
                const politeRegion = document.getElementById('polite-announcements');
                if (politeRegion) {
                    politeRegion.textContent = `Navigated to ${e.detail.sectionName} section.`;
                }
            });
        }

        // Public methods
        announce(message, priority = 'polite') {
            const regionId = priority === 'assertive' ? 'assertive-announcements' : 'polite-announcements';
            const region = document.getElementById(regionId);

            if (region) {
                region.textContent = message;
            }
        }

        focusElement(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('tabindex', '-1');
                element.focus();
                element.addEventListener('blur', () => {
                    element.removeAttribute('tabindex');
                }, { once: true });
            }
        }
    }

    // Initialize accessibility manager
    const accessibilityManager = new AccessibilityManager();

    // Export for global use
    window.AccessibilityManager = AccessibilityManager;
    window.a11y = accessibilityManager;

})();