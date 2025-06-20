document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formGroups = document.querySelectorAll('.form-group');

    // Form submission handling with AJAX
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Check honeypot field first (bot detection)
        if (data.website && data.website.trim() !== '') {
            console.log('Bot detected - honeypot field filled');
            showErrorMessage('Submission failed. Please try again.');
            return;
        }
        
        // Basic validation
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-primary');
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
                showSuccessMessage();
                contactForm.reset();
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
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
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
