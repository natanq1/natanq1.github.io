(function() {
    'use strict';
    
    // Basic Security Core Module
    const SecurityCore = {
        // Basic security configuration
        config: {
            maxFormSubmissions: 10,
            timeWindow: 3600000 // 1 hour
        },

        // Storage keys
        storage: {
            submissions: 'sec_submissions'
        },

        // Initialize basic security
        init() {
            this.setupFormProtection();
            this.setupCSRFProtection();
        },

        // Basic form protection with rate limiting
        setupFormProtection() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!this.checkRateLimit()) {
                        e.preventDefault();
                        this.showRateLimitMessage();
                        return false;
                    }
                });
            });
        },

        // Rate limiting for form submissions
        checkRateLimit() {
            const now = Date.now();
            let submissions = JSON.parse(localStorage.getItem(this.storage.submissions) || '[]');
            
            // Remove old submissions outside time window
            submissions = submissions.filter(time => now - time < this.config.timeWindow);
            
            if (submissions.length >= this.config.maxFormSubmissions) {
                return false;
            }
            
            submissions.push(now);
            localStorage.setItem(this.storage.submissions, JSON.stringify(submissions));
            return true;
        },

        // Show rate limit message
        showRateLimitMessage() {
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 9999;
                font-family: sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            message.textContent = 'Too many submissions. Please wait before trying again.';
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 5000);
        },

        // Basic CSRF Protection
        setupCSRFProtection() {
            const token = this.generateCSRFToken();
            const tokenInput = document.getElementById('csrfToken');
            if (tokenInput) {
                tokenInput.value = token;
            }
        },

        // Generate CSRF token
        generateCSRFToken() {
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }
    };

    // Initialize basic security when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            SecurityCore.init();
        });
    } else {
        SecurityCore.init();
    }

})();