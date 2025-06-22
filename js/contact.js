(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // Check if user is locked out
        if (window._sec && window._sec.isLockedOut()) {
            return;
        }

        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        let lastSubmissionTime = 0;
        const RATE_LIMIT_DELAY = 10000;

        document.getElementById('formTimestamp').value = Date.now();

        let mouseMovements = 0;
        let keystrokes = 0;
        let focusEvents = 0;

        document.addEventListener('mousemove', () => mouseMovements++);
        document.addEventListener('keydown', () => keystrokes++);
        contactForm.addEventListener('focusin', () => focusEvents++);

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Use new validator
            if (!window.InputValidator.validateForm(contactForm)) {
                showErrorMessage('Please correct the errors in the form.');
                return;
            }

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            const currentTime = Date.now();
            if (currentTime - lastSubmissionTime < RATE_LIMIT_DELAY) {
                showErrorMessage('Please wait before submitting another message.');
                return;
            }

            if (!performBotDetection(data)) {
                if (window._sec) {
                    window._sec.handleSuspiciousActivity('Bot behavior detected');
                }
                showErrorMessage('Submission failed. Please try again.');
                return;
            }

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (response.ok) {
                    lastSubmissionTime = currentTime;
                    showSuccessMessage();
                    contactForm.reset();
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

        function performBotDetection(data) {
            if ((data.website && data.website.trim() !== '') || 
                (data.url && data.url.trim() !== '')) {
                return false;
            }

            if (mouseMovements < 5 && keystrokes < 10 && focusEvents < 2) {
                return false;
            }

            const formStartTime = parseInt(data._timestamp);
            const fillTime = Date.now() - formStartTime;
            if (fillTime < 5000) {
                return false;
            }

            return true;
        }

        function showSuccessMessage() {
            const existingMessages = document.querySelectorAll('.success-message, .error-message-box');
            existingMessages.forEach(msg => msg.remove());
            
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
            
            const formContainer = document.querySelector('.contact-form-container');
            formContainer.insertBefore(successDiv, contactForm);
            
            setTimeout(() => {
                successDiv.style.transition = 'opacity 0.5s ease';
                successDiv.style.opacity = '0';
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.remove();
                    }
                }, 500);
            }, 8000);
            
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        function showErrorMessage(message) {
            const existingMessages = document.querySelectorAll('.success-message, .error-message-box');
            existingMessages.forEach(msg => msg.remove());
            
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
            
            const formContainer = document.querySelector('.contact-form-container');
            formContainer.insertBefore(errorDiv, contactForm);
            
            setTimeout(() => {
                errorDiv.style.transition = 'opacity 0.5s ease';
                errorDiv.style.opacity = '0';
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.remove();
                    }
                }, 500);
            }, 8000);
            
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const animateOnScroll = () => {
            const cards = document.querySelectorAll('.contact-card, .availability-card, .faq-item');
            
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

        animateOnScroll();
    });
})();
