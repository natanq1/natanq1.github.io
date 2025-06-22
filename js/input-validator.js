(function() {
    'use strict';
    
    const InputValidator = {
        // Validation rules
        rules: {
            email: {
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                maxLength: 254,
                blacklist: /@(temp|fake|test|spam|bot|guerrilla|10minute|mailinator)\./i
            },
            name: {
                pattern: /^[a-zA-Z\s\-'\.]{2,100}$/,
                maxLength: 100,
                minLength: 2,
                blacklist: /(admin|root|test|spam|bot|script)/i
            },
            phone: {
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                maxLength: 20
            },
            message: {
                maxLength: 2000,
                minLength: 10,
                blacklist: /(viagra|cialis|casino|lottery|winner|congratulations|prince|inheritance|urgent|confidential)/i
            }
        },

        // XSS patterns
        xssPatterns: [
            /<script[^>]*>.*?<\/script>/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
            /<object[^>]*>.*?<\/object>/gi,
            /<embed[^>]*>.*?<\/embed>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /onload\s*=/gi,
            /onerror\s*=/gi,
            /onclick\s*=/gi,
            /onmouseover\s*=/gi,
            /onfocus\s*=/gi,
            /onblur\s*=/gi,
            /<img[^>]*src\s*=\s*["']javascript:/gi,
            /document\s*\.\s*cookie/gi,
            /document\s*\.\s*write/gi,
            /eval\s*\(/gi,
            /setTimeout\s*\(/gi,
            /setInterval\s*\(/gi
        ],

        // SQL injection patterns
        sqlPatterns: [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
            /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
            /'\s*(OR|AND)\s*'[^']*'\s*=\s*'/gi,
            /;\s*(DROP|DELETE|INSERT|UPDATE)/gi,
            /\/\*.*?\*\//gi,
            /--[^\n\r]*/gi,
            /'\s*;\s*(DROP|DELETE)/gi
        ],

        // Initialize validator
        init() {
            this.setupRealTimeValidation();
            this.setupPasteProtection();
        },

        // Setup real-time validation
        setupRealTimeValidation() {
            const inputs = document.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    this.validateField(e.target);
                });

                input.addEventListener('blur', (e) => {
                    this.validateField(e.target, true);
                });
            });
        },

        // Setup paste protection
        setupPasteProtection() {
            document.addEventListener('paste', (e) => {
                const target = e.target;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    setTimeout(() => {
                        this.validateField(target, true);
                    }, 10);
                }
            });
        },

        // Validate individual field
        validateField(field, showErrors = false) {
            const value = field.value;
            const fieldName = field.name || field.id;
            const errors = [];

            // Check for XSS
            if (this.containsXSS(value)) {
                errors.push('Invalid characters detected');
                field.value = this.sanitizeInput(value);
            }

            // Check for SQL injection
            if (this.containsSQL(value)) {
                errors.push('Invalid input detected');
                field.value = this.sanitizeInput(value);
            }

            // Field-specific validation
            const rule = this.rules[fieldName];
            if (rule) {
                // Length validation
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push(`Maximum ${rule.maxLength} characters allowed`);
                }

                if (rule.minLength && value.length < rule.minLength && value.length > 0) {
                    errors.push(`Minimum ${rule.minLength} characters required`);
                }

                // Pattern validation
                if (rule.pattern && value && !rule.pattern.test(value)) {
                    errors.push('Invalid format');
                }

                // Blacklist validation
                if (rule.blacklist && rule.blacklist.test(value)) {
                    errors.push('Invalid content detected');
                }
            }

            // Show/hide errors
            if (showErrors && errors.length > 0) {
                this.showFieldError(field, errors[0]);
            } else if (errors.length === 0) {
                this.clearFieldError(field);
            }

            return errors.length === 0;
        },

        // Check for XSS patterns
        containsXSS(input) {
            return this.xssPatterns.some(pattern => pattern.test(input));
        },

        // Check for SQL injection patterns
        containsSQL(input) {
            return this.sqlPatterns.some(pattern => pattern.test(input));
        },

        // Sanitize input
        sanitizeInput(input) {
            return input
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/vbscript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .replace(/data:text\/html/gi, '')
                .trim();
        },

        // Show field error
        showFieldError(field, message) {
            this.clearFieldError(field);
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'validation-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #dc3545;
                font-size: 0.85rem;
                margin-top: 0.3rem;
                display: block;
            `;
            
            field.style.borderColor = '#dc3545';
            field.parentNode.appendChild(errorDiv);
        },

        // Clear field error
        clearFieldError(field) {
            const existingError = field.parentNode.querySelector('.validation-error');
            if (existingError) {
                existingError.remove();
            }
            field.style.borderColor = '';
        },

        // Validate entire form
        validateForm(form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input, true)) {
                    isValid = false;
                }
            });

            return isValid;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            InputValidator.init();
        });
    } else {
        InputValidator.init();
    }

    // Expose validator globally
    window.InputValidator = InputValidator;

})();
