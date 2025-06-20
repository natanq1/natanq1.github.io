document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    let lastSubmissionTime = 0;
    const RATE_LIMIT_DELAY = 10000; // 10 seconds between submissions

    // Set form timestamp for rate limiting
    document.getElementById('formTimestamp').value = Date.now();

    // Security: Input sanitization patterns
    const securityPatterns = {
        xss: /<script|javascript:|data:text\/html|vbscript:|onload=|onerror=/i,
        sql: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)|(['";])/i,
        suspicious: /(eval\(|setTimeout\(|setInterval\(|Function\(|innerHTML|outerHTML)/i
    };

    // Enhanced bot detection
    let mouseMovements = 0;
    let keystrokes = 0;
    let focusEvents = 0;

    // Track human-like interactions
    document.addEventListener('mousemove', () => mouseMovements++);
    document.addEventListener('keydown', () => keystrokes++);
    contactForm.addEventListener('focusin', () => focusEvents++);

    // Form submission handling with enhanced security
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Rate limiting check
        const currentTime = Date.now();
        if (currentTime - lastSubmissionTime < RATE_LIMIT_DELAY) {
            showErrorMessage('Please wait before submitting another message.');
            return;
        }

        // Enhanced bot detection
        if (!performBotDetection(data)) {
            console.log('Bot detected');
            showErrorMessage('Submission failed. Please try again.');
            return;
        }

        // Security validation
        if (!performSecurityValidation(data)) {
            showErrorMessage('Invalid input detected. Please check your message and try again.');
            return;
        }

        // Form validation
        if (!validateForm(data)) {
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Submit to Formspree via AJAX
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                lastSubmissionTime = currentTime;
                showSuccessMessage();
                contactForm.reset();
                // Reset security counters
                mouseMovements = 0;
                keystrokes = 0;
                focusEvents = 0;
            } else {
                response.json().then(data => {
                    if (data.errors) {
                        showErrorMessage('There was a problem with your submission. Please check your form and try again.');
                    } else {
                        showErrorMessage('Oops! There was a problem submitting your form. Please try again.');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('There was a problem sending your message. Please try again or contact me directly.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    // Enhanced bot detection
    function performBotDetection(data) {
        // Check honeypot fields
        if ((data.website && data.website.trim() !== '') || 
            (data.url && data.url.trim() !== '')) {
            return false;
        }

        // Check for human-like interaction
        if (mouseMovements < 5 && keystrokes < 10 && focusEvents < 2) {
            return false;
        }

        // Check form fill time (too fast = bot)
        const formStartTime = parseInt(data._timestamp);
        const fillTime = Date.now() - formStartTime;
        if (fillTime < 5000) { // Less than 5 seconds
            return false;
        }

        return true;
    }

    // Security validation function
    function performSecurityValidation(data) {
        const fieldsToCheck = ['name', 'email', 'subject', 'message'];
        
        for (const field of fieldsToCheck) {
            const value = data[field] || '';
            
            // Check for XSS attempts
            if (securityPatterns.xss.test(value)) {
                console.warn('XSS attempt detected in field:', field);
                return false;
            }
            
            // Check for SQL injection attempts
            if (securityPatterns.sql.test(value)) {
                console.warn('SQL injection attempt detected in field:', field);
                return false;
            }
            
            // Check for suspicious content
            if (securityPatterns.suspicious.test(value)) {
                console.warn('Suspicious content detected in field:', field);
                return false;
            }
        }
        
        return true;
    }

    // Enhanced input sanitization
    function sanitizeInput(input) {
        return input
            .replace(/[<>]/g, '') // Remove angle brackets
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/data:text\/html/gi, '') // Remove data:text/html
            .trim();
    }

    // Form validation with enhanced security
    function validateForm(data) {
        let isValid = true;
        const requiredFields = ['name', 'email', 'service', 'subject', 'message'];
        
        requiredFields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            const formGroup = input.closest('.form-group');
            let value = data[field] || '';
            
            // Sanitize input
            value = sanitizeInput(value);
            input.value = value;
            
            if (!value || value.trim() === '') {
                showError(formGroup, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                isValid = false;
            } else {
                clearError(formGroup);
            }
        });
        
        // Enhanced email validation
        if (data.email && !isValidEmail(data.email)) {
            const emailGroup = document.querySelector('[name="email"]').closest('.form-group');
            showError(emailGroup, 'Please enter a valid email address');
            isValid = false;
        }

        // Message length validation
        if (data.message && data.message.length > 2000) {
            const messageGroup = document.querySelector('[name="message"]').closest('.form-group');
            showError(messageGroup, 'Message is too long (maximum 2000 characters)');
            isValid = false;
        }
        
        return isValid;
    }

    // Enhanced email validation
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const suspiciousPatterns = /@(temp|fake|test|spam|bot)\./i;
        
        return emailRegex.test(email) && !suspiciousPatterns.test(email);
    }

    // Real-time input validation and sanitization
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Prevent common XSS patterns in real-time
            let value = this.value;
            if (securityPatterns.xss.test(value)) {
                this.value = value.replace(securityPatterns.xss, '');
                showError(this.closest('.form-group'), 'Invalid characters removed');
            }
        });

        input.addEventListener('paste', function(e) {
            // Check pasted content for security issues
            setTimeout(() => {
                let value = this.value;
                if (securityPatterns.xss.test(value) || securityPatterns.suspicious.test(value)) {
                    this.value = sanitizeInput(value);
                    showError(this.closest('.form-group'), 'Potentially unsafe content was sanitized');
                }
            }, 10);
        });
    });

    // Form validation
    function validateForm(data) {
        let isValid = true;
        
        // Check required fields
        const requiredFields = ['name', 'email', 'service', 'subject', 'message'];
        
        requiredFields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            const formGroup = input.closest('.form-group');
            
            if (!data[field] || data[field].trim() === '') {
                showError(formGroup, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                isValid = false;
            } else {
                clearError(formGroup);
            }
        });
        
        // Email validation
        if (data.email && !isValidEmail(data.email)) {
            const emailGroup = document.querySelector('[name="email"]').closest('.form-group');
            showError(emailGroup, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(formGroup, message) {
        clearError(formGroup);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.3rem';
        
        formGroup.appendChild(errorDiv);
        
        const input = formGroup.querySelector('input, select, textarea');
        input.style.borderColor = '#dc3545';
    }
    
    function clearError(formGroup) {
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const input = formGroup.querySelector('input, select, textarea');
        input.style.borderColor = '#e9ecef';
    }
    
    function showSuccessMessage() {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message-box');
        existingMessages.forEach(msg => msg.remove());
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
                color: #155724;
                padding: 1.5rem;
                border-radius: 15px;
                margin-bottom: 2rem;
                border: 2px solid #c3e6cb;
                box-shadow: 0 5px 15px rgba(21, 87, 36, 0.1);
                animation: slideInDown 0.5s ease;
            ">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2rem;">✅</span>
                    <div>
                        <strong style="font-size: 1.1rem;">Message sent successfully!</strong><br>
                        <span style="font-size: 0.95rem;">Thank you for reaching out! I'll get back to you within 24 hours.</span>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before form
        const formContainer = document.querySelector('.contact-form-container');
        formContainer.insertBefore(successDiv, contactForm);
        
        // Remove success message after 8 seconds
        setTimeout(() => {
            successDiv.style.transition = 'opacity 0.5s ease';
            successDiv.style.opacity = '0';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 500);
        }, 8000);
        
        // Scroll to top of form
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showErrorMessage(message) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message-box');
        existingMessages.forEach(msg => msg.remove());
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-box';
        errorDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #f8d7da, #f5c6cb);
                color: #721c24;
                padding: 1.5rem;
                border-radius: 15px;
                margin-bottom: 2rem;
                border: 2px solid #f5c6cb;
                box-shadow: 0 5px 15px rgba(114, 28, 36, 0.1);
                animation: slideInDown 0.5s ease;
            ">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2rem;">⚠️</span>
                    <div>
                        <strong style="font-size: 1.1rem;">Something went wrong</strong><br>
                        <span style="font-size: 0.95rem;">${message}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before form
        const formContainer = document.querySelector('.contact-form-container');
        formContainer.insertBefore(errorDiv, contactForm);
        
        // Remove error message after 8 seconds
        setTimeout(() => {
            errorDiv.style.transition = 'opacity 0.5s ease';
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 500);
        }, 8000);
        
        // Scroll to top of form
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Add animations for form interactions
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Animate cards on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.contact-card, .availability-card, .response-card, .faq-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    };

    // Initialize animations
    animateOnScroll();
});
