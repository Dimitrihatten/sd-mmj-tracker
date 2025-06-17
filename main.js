// Main JavaScript for SD MMJ Tracker
(function() {
    'use strict';

    // DOM Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const forms = document.querySelectorAll('form');

    // Initialize the application
    function init() {
        setupNavigation();
        setupFormHandling();
        setupAccessibility();
        setupSmoothScrolling();
        setupSearchFunctionality();
        announcePageLoad();
    }

    // Navigation Setup
    function setupNavigation() {
        // Mobile navigation toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', toggleMobileNav);
            navToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMobileNav();
                }
            });
        }

        // Navigation link handlers
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    handleNavClick(e);
                }
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Handle escape key to close mobile nav
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileNav();
            }
        });
    }

    function toggleMobileNav() {
        const isOpen = navMenu.classList.contains('active');

        if (isOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    function openMobileNav() {
        navMenu.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation menu');

        // Focus first nav link
        const firstNavLink = navMenu.querySelector('.nav-link');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 100);
        }

        // Animate hamburger
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        hamburgers[1].style.opacity = '0';
        hamburgers[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }

    function closeMobileNav() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');

        // Reset hamburger animation
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        hamburgers[0].style.transform = '';
        hamburgers[1].style.opacity = '';
        hamburgers[2].style.transform = '';
    }

    function handleNavClick(e) {
        e.preventDefault();

        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            targetSection.classList.add('active');

            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            });

            e.target.classList.add('active');
            e.target.setAttribute('aria-current', 'page');

            // Close mobile nav if open
            closeMobileNav();

            // Focus the section title for screen readers
            const sectionTitle = targetSection.querySelector('h1, h2');
            if (sectionTitle) {
                sectionTitle.setAttribute('tabindex', '-1');
                sectionTitle.focus();
                sectionTitle.addEventListener('blur', function() {
                    sectionTitle.removeAttribute('tabindex');
                }, { once: true });
            }

            // Announce section change
            announceRouteChange(targetId);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Update URL without page reload
            history.pushState(null, '', `#${targetId}`);
        }
    }

    // Form Handling
    function setupFormHandling() {
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);

            // Add real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formId = form.id;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Show loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        // Validate form
        if (!validateForm(form)) {
            // Remove loading state if validation fails
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
            return;
        }

        // Handle different forms
        if (formId === 'verificationForm') {
            handleVerificationForm(form);
        } else if (formId === 'detailedVerificationForm') {
            handleDetailedVerificationForm(form);
        } else if (formId === 'businessForm') {
            handleBusinessForm(form);
        } else {
            handleGenericForm(form);
        }
    }

    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const errorElement = document.getElementById(field.name + '-error') || 
                           document.getElementById(field.id + '-error');

        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Specific field validations
        if (isValid && value) {
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;

                case 'tel':
                    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                    if (!phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number.';
                    }
                    break;

                case 'date':
                    const date = new Date(value);
                    const today = new Date();
                    if (field.name === 'dateOfBirth' || field.name === 'birthDate') {
                        if (date > today) {
                            isValid = false;
                            errorMessage = 'Date of birth cannot be in the future.';
                        }

                        const age = today.getFullYear() - date.getFullYear();
                        if (age < 18) {
                            isValid = false;
                            errorMessage = 'You must be at least 18 years old.';
                        }
                    }
                    break;
            }

            // Card number validation
            if (field.name === 'cardNumber' || field.id === 'cardNumber') {
                if (!/^[0-9]{8}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Card number must be exactly 8 digits.';
                }
            }

            // ZIP code validation
            if (field.name === 'zipCode' || field.id === 'zipCode') {
                if (!/^[0-9]{5}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'ZIP code must be exactly 5 digits.';
                }
            }
        }

        // Update UI
        if (errorElement) {
            if (isValid) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                field.classList.remove('error');
                field.setAttribute('aria-invalid', 'false');
            } else {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
            }
        }

        return isValid;
    }

    function clearFieldError(e) {
        const field = e.target;
        const errorElement = document.getElementById(field.name + '-error') || 
                           document.getElementById(field.id + '-error');

        if (errorElement && field.value.trim()) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        }
    }

    // Form Handlers
    function handleVerificationForm(form) {
        const formData = new FormData(form);
        const cardNumber = formData.get('cardNumber');
        const dateOfBirth = formData.get('dateOfBirth');

        // Simulate API call
        simulateAPICall(2000).then(response => {
            if (response.success) {
                showSuccess('Medical card verified successfully!');
                updateVerificationStatus(true);
            } else {
                showError('Verification failed. Please check your information and try again.');
            }
        }).catch(() => {
            showError('Service temporarily unavailable. Please try again later.');
        }).finally(() => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    function handleDetailedVerificationForm(form) {
        const formData = new FormData(form);

        simulateAPICall(3000).then(response => {
            if (response.success) {
                showSuccess('Patient verification completed successfully!');
            } else {
                showError('Patient not found in registry. Please verify information.');
            }
        }).catch(() => {
            showError('Verification service unavailable. Please try again later.');
        }).finally(() => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    function handleBusinessForm(form) {
        const formData = new FormData(form);

        simulateAPICall(2500).then(response => {
            if (response.success) {
                showSuccess('Partnership inquiry submitted successfully! We will contact you within 2 business days.');
                form.reset();
            } else {
                showError('Failed to submit inquiry. Please try again.');
            }
        }).catch(() => {
            showError('Service temporarily unavailable. Please try again later.');
        }).finally(() => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    function handleGenericForm(form) {
        simulateAPICall(2000).then(response => {
            if (response.success) {
                showSuccess('Form submitted successfully!');
                form.reset();
            } else {
                showError('Failed to submit form. Please try again.');
            }
        }).finally(() => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // Utility Functions
    function simulateAPICall(delay = 2000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            }, delay);
        });
    }

    function showSuccess(message) {
        showNotification(message, 'success');
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon" aria-hidden="true">${icon}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        notification.querySelector('.notification-message').style.cssText = `
            flex: 1;
            font-weight: 500;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        const autoRemoveTimer = setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemoveTimer);
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    function updateVerificationStatus(isVerified) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');

        if (statusIndicator && statusText) {
            if (isVerified) {
                statusIndicator.classList.add('connected');
                statusText.innerHTML = `
                    <strong>Medical Card Verified ✓</strong>
                    <p>Patient status confirmed</p>
                    <small><strong>Verified:</strong> ${new Date().toLocaleString()}</small>
                `;
            }
        }
    }

    // Search Functionality
    function setupSearchFunctionality() {
        const searchInput = document.getElementById('dispensarySearch');
        const dispensaryCards = document.querySelectorAll('.dispensary-card');

        if (searchInput && dispensaryCards.length > 0) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();

                dispensaryCards.forEach(card => {
                    const name = card.querySelector('h3').textContent.toLowerCase();
                    const info = card.querySelector('.dispensary-info').textContent.toLowerCase();

                    if (name.includes(searchTerm) || info.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = searchTerm ? 'none' : 'block';
                    }
                });
            });
        }
    }

    // Accessibility Features
    function setupAccessibility() {
        // Add focus indicators
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Enhance form accessibility
        const formInputs = document.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                const label = document.querySelector(`label[for="${this.id}"]`);
                if (label) {
                    label.classList.add('focused');
                }
            });

            input.addEventListener('blur', function() {
                const label = document.querySelector(`label[for="${this.id}"]`);
                if (label) {
                    label.classList.remove('focused');
                }
            });
        });
    }

    function setupSmoothScrolling() {
        // Handle browser back/forward
        window.addEventListener('popstate', function() {
            const hash = window.location.hash;
            if (hash) {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    sections.forEach(section => section.classList.remove('active'));
                    targetSection.classList.add('active');

                    // Update nav
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                        if (link.getAttribute('href') === hash) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        }
                    });
                }
            }
        });

        // Set initial state based on URL
        const hash = window.location.hash || '#home';
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            sections.forEach(section => section.classList.remove('active'));
            targetSection.classList.add('active');

            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    }

    // Screen Reader Announcements
    function announcePageLoad() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.id = 'page-announcements';
        document.body.appendChild(announcement);

        setTimeout(() => {
            announcement.textContent = 'SD MMJ Tracker page loaded. Navigate using the main menu or tab through content.';
        }, 1000);
    }

    function announceRouteChange(sectionId) {
        const announcement = document.getElementById('page-announcements');
        if (announcement) {
            const sectionNames = {
                'home': 'Home dashboard',
                'verification': 'Patient verification system',
                'dispensaries': 'Licensed dispensaries directory',
                'compliance': 'Compliance and regulations information',
                'business': 'Business partnerships',
                'legal': 'Legal information and policies'
            };

            announcement.textContent = `Navigated to ${sectionNames[sectionId] || sectionId} section.`;
        }
    }

    // Add CSS for keyboard navigation
    const keyboardStyles = document.createElement('style');
    keyboardStyles.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #1e40af !important;
            outline-offset: 2px !important;
        }

        .focused {
            color: #1e40af !important;
            font-weight: 600 !important;
        }
    `;
    document.head.appendChild(keyboardStyles);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
