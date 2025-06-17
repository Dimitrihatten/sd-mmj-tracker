// Form Validation Library for SD MMJ Tracker
(function() {
    'use strict';

    // Validation Rules
    const ValidationRules = {
        required: {
            test: (value) => value.trim().length > 0,
            message: 'This field is required.'
        },

        email: {
            test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address.'
        },

        phone: {
            test: (value) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value),
            message: 'Please enter a valid phone number (e.g., (555) 123-4567).'
        },

        cardNumber: {
            test: (value) => /^[0-9]{8}$/.test(value),
            message: 'Medical card number must be exactly 8 digits.'
        },

        zipCode: {
            test: (value) => /^[0-9]{5}(-[0-9]{4})?$/.test(value),
            message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789).'
        },

        dateOfBirth: {
            test: (value) => {
                const date = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - date.getFullYear();
                const monthDiff = today.getMonth() - date.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                    age--;
                }

                return date <= today && age >= 18;
            },
            message: 'You must be at least 18 years old and the date cannot be in the future.'
        },

        name: {
            test: (value) => /^[a-zA-Z\s'-]{2,50}$/.test(value),
            message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes.'
        },

        companyName: {
            test: (value) => value.trim().length >= 2 && value.trim().length <= 100,
            message: 'Company name must be between 2 and 100 characters.'
        },

        message: {
            test: (value) => value.trim().length >= 10 && value.trim().length <= 1000,
            message: 'Message must be between 10 and 1000 characters.'
        }
    };

    // HIPAA Compliance Validation
    const HIPAAValidation = {
        // Check for potentially sensitive information
        checkSensitiveData: (value) => {
            const sensitivePatterns = [
                /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
                /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card pattern
                /\b[A-Z]{2}\d{6,}\b/, // Medical record number pattern
            ];

            return !sensitivePatterns.some(pattern => pattern.test(value));
        },

        // Validate medical card format
        validateMedicalCard: (value) => {
            // SD medical card format: 8 digits
            return /^SD\d{6}$|^\d{8}$/.test(value);
        }
    };

    // Enhanced Validator Class
    class FormValidator {
        constructor(form) {
            this.form = form;
            this.errors = {};
            this.isValid = true;
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.addAriaAttributes();
        }

        setupEventListeners() {
            const inputs = this.form.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
                input.addEventListener('blur', (e) => this.validateField(e.target));
                input.addEventListener('input', (e) => this.clearFieldError(e.target));
                input.addEventListener('keydown', (e) => this.handleKeyDown(e));
            });

            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        addAriaAttributes() {
            const inputs = this.form.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
                input.setAttribute('aria-invalid', 'false');

                const errorId = `${input.id || input.name}-error`;
                const helpId = `${input.id || input.name}-help`;

                let describedBy = [];
                if (document.getElementById(helpId)) {
                    describedBy.push(helpId);
                }
                if (document.getElementById(errorId)) {
                    describedBy.push(errorId);
                }

                if (describedBy.length > 0) {
                    input.setAttribute('aria-describedby', describedBy.join(' '));
                }
            });
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name || field.id;
            const rules = this.getFieldRules(field);

            this.errors[fieldName] = [];

            // Check each rule
            rules.forEach(rule => {
                if (!rule.test(value)) {
                    this.errors[fieldName].push(rule.message);
                }
            });

            // HIPAA compliance checks
            if (value && !HIPAAValidation.checkSensitiveData(value)) {
                this.errors[fieldName].push('Please do not enter sensitive information like SSN or credit card numbers.');
            }

            // Medical card specific validation
            if (fieldName === 'cardNumber' && value && !HIPAAValidation.validateMedicalCard(value)) {
                this.errors[fieldName] = ['Please enter a valid South Dakota medical card number.'];
            }

            this.updateFieldUI(field);
            return this.errors[fieldName].length === 0;
        }

        getFieldRules(field) {
            const rules = [];
            const fieldType = field.type;
            const fieldName = field.name || field.id;

            // Required validation
            if (field.required) {
                rules.push(ValidationRules.required);
            }

            // Type-specific validation
            if (fieldType === 'email') {
                rules.push(ValidationRules.email);
            } else if (fieldType === 'tel') {
                rules.push(ValidationRules.phone);
            } else if (fieldType === 'date' && (fieldName === 'dateOfBirth' || fieldName === 'birthDate')) {
                rules.push(ValidationRules.dateOfBirth);
            }

            // Name-specific validation
            if (fieldName === 'cardNumber') {
                rules.push(ValidationRules.cardNumber);
            } else if (fieldName === 'zipCode') {
                rules.push(ValidationRules.zipCode);
            } else if (fieldName === 'lastName' || fieldName === 'contactName') {
                rules.push(ValidationRules.name);
            } else if (fieldName === 'companyName') {
                rules.push(ValidationRules.companyName);
            } else if (fieldName === 'message') {
                rules.push(ValidationRules.message);
            }

            return rules;
        }

        updateFieldUI(field) {
            const fieldName = field.name || field.id;
            const errors = this.errors[fieldName];
            const errorElement = document.getElementById(`${fieldName}-error`) || 
                               document.getElementById(`${field.id}-error`);

            if (errors.length > 0) {
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');

                if (errorElement) {
                    errorElement.textContent = errors[0];
                    errorElement.classList.add('show');
                }
            } else {
                field.classList.remove('error');
                field.setAttribute('aria-invalid', 'false');

                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                }
            }
        }

        clearFieldError(field) {
            const fieldName = field.name || field.id;
            const errorElement = document.getElementById(`${fieldName}-error`) || 
                               document.getElementById(`${field.id}-error`);

            if (field.value.trim() && errorElement) {
                field.classList.remove('error');
                field.setAttribute('aria-invalid', 'false');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        }

        handleKeyDown(e) {
            // Auto-format certain fields
            const field = e.target;
            const fieldName = field.name || field.id;

            if (fieldName === 'phone') {
                this.formatPhoneNumber(e);
            } else if (fieldName === 'cardNumber') {
                this.formatCardNumber(e);
            }
        }

        formatPhoneNumber(e) {
            const field = e.target;
            const value = field.value.replace(/\D/g, '');

            if (e.key === 'Backspace' || e.key === 'Delete') return;

            if (value.length >= 6) {
                field.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 3) {
                field.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
        }

        formatCardNumber(e) {
            const field = e.target;
            const value = field.value.replace(/\D/g, '');

            if (e.key === 'Backspace' || e.key === 'Delete') return;

            if (value.length > 8) {
                field.value = value.slice(0, 8);
            }
        }

        handleSubmit(e) {
            e.preventDefault();

            const inputs = this.form.querySelectorAll('input, select, textarea');
            this.isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    this.isValid = false;
                }
            });

            if (this.isValid) {
                this.onValidSubmit();
            } else {
                this.onInvalidSubmit();
            }
        }

        onValidSubmit() {
            // Emit custom event for valid form submission
            const event = new CustomEvent('formValidated', {
                detail: { 
                    isValid: true, 
                    formData: new FormData(this.form),
                    form: this.form
                }
            });
            this.form.dispatchEvent(event);
        }

        onInvalidSubmit() {
            // Focus first error field
            const firstErrorField = this.form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
            }

            // Emit custom event for invalid form submission
            const event = new CustomEvent('formValidated', {
                detail: { 
                    isValid: false, 
                    errors: this.errors,
                    form: this.form
                }
            });
            this.form.dispatchEvent(event);
        }

        // Public method to validate entire form
        validate() {
            const inputs = this.form.querySelectorAll('input, select, textarea');
            this.isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    this.isValid = false;
                }
            });

            return this.isValid;
        }

        // Public method to reset form validation
        reset() {
            this.errors = {};
            this.isValid = true;

            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('error');
                input.setAttribute('aria-invalid', 'false');

                const errorElement = document.getElementById(`${input.name || input.id}-error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                }
            });
        }
    }

    // Auto-initialize validators for all forms
    function initializeValidators() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.dataset.validatorInitialized) {
                new FormValidator(form);
                form.dataset.validatorInitialized = 'true';
            }
        });
    }

    // Export for global use
    window.FormValidator = FormValidator;
    window.ValidationRules = ValidationRules;
    window.HIPAAValidation = HIPAAValidation;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeValidators);
    } else {
        initializeValidators();
    }

})();