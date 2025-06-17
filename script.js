// SDMMJTracker - Enhanced JavaScript with Security Features
'use strict';

// CSRF Token Management
const CSRFManager = {
    token: null,

    init() {
        this.token = this.getCSRFToken();
        this.refreshToken();
        // Refresh token every 30 minutes
        setInterval(() => this.refreshToken(), 30 * 60 * 1000);
    },

    getCSRFToken() {
        const tokenElement = document.querySelector('input[name="csrf_token"]');
        return tokenElement ? tokenElement.value : null;
    },

    async refreshToken() {
        try {
            const response = await fetch('/api/csrf-token', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.token;
                this.updateTokenInForms();
            }
        } catch (error) {
            console.error('Failed to refresh CSRF token:', error);
        }
    },

    updateTokenInForms() {
        const tokenInputs = document.querySelectorAll('input[name="csrf_token"]');
        tokenInputs.forEach(input => {
            input.value = this.token;
        });
    }
};

// Form Validation and Security
const FormValidator = {
    patterns: {
        cardNumber: /^[A-Z0-9]{8,12}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    },

    sanitize(input) {
        // Basic XSS prevention
        return input.replace(/[<>&"']/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#x27;'
            };
            return escapeMap[match];
        });
    },

    validateCardNumber(cardNumber) {
        const sanitized = this.sanitize(cardNumber.trim().toUpperCase());
        return {
            isValid: this.patterns.cardNumber.test(sanitized),
            value: sanitized,
            message: 'Medical card number must be 8-12 alphanumeric characters'
        };
    },

    validateDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        return {
            isValid: date <= minAge && date >= new Date('1900-01-01'),
            value: dateString,
            message: 'You must be at least 18 years old'
        };
    },

    validateForm(form) {
        const errors = [];
        const formData = new FormData(form);

        // Validate card number
        const cardNumber = formData.get('card_number');
        if (cardNumber) {
            const cardValidation = this.validateCardNumber(cardNumber);
            if (!cardValidation.isValid) {
                errors.push({ field: 'card_number', message: cardValidation.message });
            }
        }

        // Validate date of birth
        const dob = formData.get('date_of_birth');
        if (dob) {
            const dobValidation = this.validateDate(dob);
            if (!dobValidation.isValid) {
                errors.push({ field: 'date_of_birth', message: dobValidation.message });
            }
        }

        return errors;
    },

    showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = field.parentElement.querySelector('.error-message');

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', field.id + '-error');
        }
    },

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });

        const invalidFields = document.querySelectorAll('[aria-invalid="true"]');
        invalidFields.forEach(field => {
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
    }
};

// Rate Limiting for API Calls
const RateLimiter = {
    requests: new Map(),

    canMakeRequest(endpoint, limit = 5, window = 60000) {
        const now = Date.now();
        const key = endpoint;

        if (!this.requests.has(key)) {
            this.requests.set(key, []);
        }

        const requestTimes = this.requests.get(key);
        // Remove old requests outside the time window
        const recentRequests = requestTimes.filter(time => now - time < window);

        if (recentRequests.length >= limit) {
            return false;
        }

        recentRequests.push(now);
        this.requests.set(key, recentRequests);
        return true;
    }
};

// Secure API Client
const APIClient = {
    async makeRequest(endpoint, options = {}) {
        // Check rate limiting
        if (!RateLimiter.canMakeRequest(endpoint)) {
            throw new Error('Too many requests. Please try again later.');
        }

        const defaultOptions = {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': CSRFManager.token
            }
        };

        const mergedOptions = { ...defaultOptions, ...options };

        if (mergedOptions.headers['Content-Type'] === 'application/json' && mergedOptions.body) {
            try {
                JSON.parse(mergedOptions.body);
            } catch {
                throw new Error('Invalid JSON in request body');
            }
        }

        try {
            const response = await fetch(endpoint, mergedOptions);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
};

// Mobile Navigation Handler
const NavigationHandler = {
    init() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => this.toggleMobileMenu(navToggle, navMenu));

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu(navToggle, navMenu);
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu(navToggle, navMenu);
                }
            });
        }
    },

    toggleMobileMenu(toggle, menu) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');

        // Manage focus for accessibility
        if (!isExpanded) {
            const firstLink = menu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    },

    closeMobileMenu(toggle, menu) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
    }
};

// Form Submission Handler
const FormHandler = {
    init() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    },

    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');

        // Clear previous errors
        FormValidator.clearErrors();

        // Validate form
        const errors = FormValidator.validateForm(form);
        if (errors.length > 0) {
            errors.forEach(error => {
                FormValidator.showError(error.field, error.message);
            });
            return;
        }

        // Disable submit button and show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            form.classList.add('loading');
        }

        try {
            const formData = new FormData(form);
            const jsonData = {};

            // Convert FormData to JSON, sanitizing inputs
            for (let [key, value] = formData.entries()) {
                jsonData[key] = FormValidator.sanitize(value);
            }

            const response = await APIClient.makeRequest(form.action, {
                method: form.method,
                body: JSON.stringify(jsonData)
            });

            this.handleSuccess(form, response);

        } catch (error) {
            this.handleError(form, error.message);
        } finally {
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.dataset.originalText || 'Submit';
                form.classList.remove('loading');
            }
        }
    },

    handleSuccess(form, response) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.setAttribute('role', 'alert');
        successMessage.setAttribute('aria-live', 'polite');
        successMessage.textContent = 'Form submitted successfully!';

        form.insertBefore(successMessage, form.firstChild);

        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    },

    handleError(form, message) {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message-general';
        errorMessage.setAttribute('role', 'alert');
        errorMessage.setAttribute('aria-live', 'polite');
        errorMessage.textContent = message || 'An error occurred. Please try again.';

        form.insertBefore(errorMessage, form.firstChild);

        // Remove error message after 10 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 10000);
    }
};

// Accessibility Enhancements
const AccessibilityEnhancer = {
    init() {
        this.enhanceKeyboardNavigation();
        this.addAriaLabels();
        this.manageTabIndex();
    },

    enhanceKeyboardNavigation() {
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');

        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }

            // Add keyboard event handlers
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                        element.click();
                    }
                }
            });
        });
    },

    addAriaLabels() {
        // Add missing aria-labels where needed
        const elementsNeedingLabels = document.querySelectorAll('[role="button"]:not([aria-label])');

        elementsNeedingLabels.forEach(element => {
            const textContent = element.textContent.trim();
            if (textContent) {
                element.setAttribute('aria-label', textContent);
            }
        });
    },

    manageTabIndex() {
        // Ensure proper tab order
        const cards = document.querySelectorAll('.action-card');
        cards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });
    }
};

// Performance Monitoring
const PerformanceMonitor = {
    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

                if (loadTime > 3000) {
                    console.warn('Page load time exceeded 3 seconds:', loadTime + 'ms');
                }
            }
        });

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }
    }
};

// Security Headers Check
const SecurityChecker = {
    init() {
        // Check for security headers (client-side verification)
        fetch(location.href, { method: 'HEAD' })
            .then(response => {
                const securityHeaders = [
                    'x-content-type-options',
                    'x-frame-options',
                    'content-security-policy',
                    'strict-transport-security'
                ];

                const missingHeaders = securityHeaders.filter(header => 
                    !response.headers.has(header)
                );

                if (missingHeaders.length > 0) {
                    console.warn('Missing security headers:', missingHeaders);
                }
            })
            .catch(error => {
                console.error('Failed to check security headers:', error);
            });
    }
};

// Main Application Initialization
class SDMMJTrackerApp {
    constructor() {
        this.components = [
            CSRFManager,
            NavigationHandler,
            FormHandler,
            AccessibilityEnhancer,
            PerformanceMonitor,
            SecurityChecker
        ];
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            this.components.forEach(component => {
                if (component.init && typeof component.init === 'function') {
                    component.init();
                }
            });

            console.log('SDMMJTracker application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }
}

// Initialize the application
const app = new SDMMJTrackerApp();
app.init();

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CSRFManager,
        FormValidator,
        RateLimiter,
        APIClient,
        NavigationHandler,
        FormHandler,
        AccessibilityEnhancer,
        PerformanceMonitor,
        SecurityChecker,
        SDMMJTrackerApp
    };
}