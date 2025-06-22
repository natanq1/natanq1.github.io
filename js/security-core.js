(function() {
    'use strict';
    
    // Advanced Security Core Module
    const SecurityCore = {
        // Security configuration
        config: {
            maxFailedAttempts: 5, // Increased from 3 to 5
            lockoutDuration: 300000, // 5 minutes
            sessionTimeout: 7200000, // Increased to 2 hours from 30 minutes
            maxFormSubmissions: 8, // Increased from 5 to 8
            timeWindow: 3600000, // 1 hour
            rapidClickThreshold: 20, // Increased from 10 to 20
            rapidClickWindow: 50 // Decreased from 100ms to 50ms for more tolerance
        },

        // Storage keys
        storage: {
            failedAttempts: 'sec_failed_attempts',
            lockoutTime: 'sec_lockout_time',
            sessionStart: 'sec_session_start',
            submissions: 'sec_submissions',
            fingerprint: 'sec_fingerprint'
        },

        // Initialize security
        init() {
            this.createFingerprint();
            this.setupIntegrityChecks();
            this.monitorDevTools();
            this.setupFormProtection();
            this.validateSession();
            this.setupCSRFProtection();
            this.monitorSuspiciousActivity();
        },

        // Create browser fingerprint
        createFingerprint() {
            const fingerprint = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                screen: `${screen.width}x${screen.height}`,
                colorDepth: screen.colorDepth,
                timestamp: Date.now()
            };
            
            const stored = localStorage.getItem(this.storage.fingerprint);
            if (stored) {
                const storedData = JSON.parse(stored);
                if (this.validateFingerprint(fingerprint, storedData)) {
                    return;
                }
                this.handleSuspiciousActivity('Fingerprint mismatch detected');
            }
            
            localStorage.setItem(this.storage.fingerprint, JSON.stringify(fingerprint));
        },

        // Validate browser fingerprint
        validateFingerprint(current, stored) {
            const threshold = 0.7; // 70% similarity required
            let matches = 0;
            const fields = ['userAgent', 'language', 'timezone', 'screen', 'colorDepth'];
            
            fields.forEach(field => {
                if (current[field] === stored[field]) matches++;
            });
            
            return (matches / fields.length) >= threshold;
        },

        // Setup integrity checks for critical elements
        setupIntegrityChecks() {
            const criticalElements = ['contactForm', 'submitBtn'];
            
            criticalElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const originalHTML = element.outerHTML;
                    
                    // Check for tampering every 5 seconds
                    setInterval(() => {
                        if (element.outerHTML !== originalHTML) {
                            this.handleSuspiciousActivity('DOM tampering detected');
                        }
                    }, 5000);
                }
            });
        },

        // Enhanced DevTools detection
        monitorDevTools() {
            let devtools = { open: false, orientation: null };
            const threshold = 200; // Increased from 160 to 200 for less false positives
            let detectionCount = 0;
            
            function detect() {
                const heightThreshold = window.outerHeight - window.innerHeight > threshold;
                const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                
                if (heightThreshold || widthThreshold) {
                    if (!devtools.open) {
                        detectionCount++;
                        // Only trigger after multiple detections
                        if (detectionCount >= 3) {
                            devtools.open = true;
                            SecurityCore.handleSuspiciousActivity('Developer tools detected');
                        }
                    }
                } else {
                    devtools.open = false;
                    detectionCount = 0; // Reset counter when dev tools are closed
                }
            }

            // Check less frequently
            setInterval(detect, 500); // Increased from 100ms to 500ms
            
            // Remove console detection as it's too aggressive
            // Users might accidentally open console
        },

        // Setup form protection with rate limiting
        setupFormProtection() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!this.checkRateLimit()) {
                        e.preventDefault();
                        this.handleSuspiciousActivity('Rate limit exceeded');
                        return false;
                    }
                    
                    if (!this.validateSession()) {
                        e.preventDefault();
                        this.handleSuspiciousActivity('Invalid session');
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

        // Session validation
        validateSession() {
            const sessionStart = localStorage.getItem(this.storage.sessionStart);
            const now = Date.now();
            
            if (!sessionStart) {
                localStorage.setItem(this.storage.sessionStart, now.toString());
                return true;
            }
            
            if (now - parseInt(sessionStart) > this.config.sessionTimeout) {
                this.clearSession();
                return false;
            }
            
            return true;
        },

        // Clear session data
        clearSession() {
            Object.values(this.storage).forEach(key => {
                localStorage.removeItem(key);
            });
        },

        // CSRF Protection
        setupCSRFProtection() {
            const token = this.generateCSRFToken();
            const tokenInput = document.getElementById('csrfToken');
            if (tokenInput) {
                tokenInput.value = token;
            }
        },

        // Generate CSRF token
        generateCSRFToken() {
            const array = new Uint8Array(32);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        },

        // Monitor for suspicious activity patterns
        monitorSuspiciousActivity() {
            let rapidClicks = 0;
            let lastClickTime = 0;
            
            document.addEventListener('click', (e) => {
                const now = Date.now();
                if (now - lastClickTime < this.config.rapidClickWindow) {
                    rapidClicks++;
                    if (rapidClicks > this.config.rapidClickThreshold) {
                        this.handleSuspiciousActivity('Rapid clicking detected - possible bot');
                    }
                } else {
                    rapidClicks = Math.max(0, rapidClicks - 1); // Decay counter gradually
                }
                lastClickTime = now;
            });

            // Only monitor paste events on form fields
            document.addEventListener('paste', (e) => {
                // Only check paste in form inputs
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    const pastedData = e.clipboardData.getData('text');
                    if (this.containsMaliciousContent(pastedData)) {
                        e.preventDefault();
                        this.handleSuspiciousActivity('Malicious content in paste detected');
                    }
                }
            });
        },

        // Check for malicious content
        containsMaliciousContent(content) {
            const maliciousPatterns = [
                /<script[^>]*>.*?<\/script>/gi,
                /javascript:/gi,
                /vbscript:/gi,
                /onload\s*=/gi,
                /onerror\s*=/gi,
                /eval\s*\(/gi,
                /document\.cookie/gi,
                /window\.location/gi
            ];
            
            return maliciousPatterns.some(pattern => pattern.test(content));
        },

        // Handle suspicious activity (with warnings before lockout)
        handleSuspiciousActivity(reason) {
            // Show visual alert to admin/developer
            this.showSecurityAlert(reason);
            
            console.warn(`🚨 Security Alert: ${reason}`);
            console.warn(`📊 Detection Details:`, {
                timestamp: new Date().toISOString(),
                reason: reason,
                userAgent: navigator.userAgent.substring(0, 50) + '...',
                currentURL: window.location.href,
                sessionDuration: this.getSessionDuration()
            });
            
            // Increment failed attempts
            let attempts = parseInt(localStorage.getItem(this.storage.failedAttempts) || '0');
            attempts++;
            localStorage.setItem(this.storage.failedAttempts, attempts.toString());
            
            console.warn(`⚠️ Failed attempts: ${attempts}/${this.config.maxFailedAttempts}`);
            
            // Show warning before lockout
            if (attempts === this.config.maxFailedAttempts - 1) {
                this.showWarningMessage();
            } else if (attempts >= this.config.maxFailedAttempts) {
                console.error(`🔒 LOCKOUT TRIGGERED - User will be locked out for ${this.config.lockoutDuration / 1000 / 60} minutes`);
                this.lockoutUser();
            }
            
            // Optional: Send alert to server
            this.sendSecurityAlert(reason);
        },

        // Show warning message before lockout
        showWarningMessage() {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'security-warning';
            warningDiv.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #f39c12;
                    color: white;
                    padding: 2rem;
                    border-radius: 15px;
                    z-index: 9999;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(243, 156, 18, 0.3);
                    animation: slideInDown 0.5s ease;
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="margin: 0 0 1rem 0;">Security Warning</h3>
                    <p style="margin: 0 0 1rem 0;">
                        Unusual activity detected. One more security event will result in temporary access restriction.
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: white;
                        color: #f39c12;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">I Understand</button>
                </div>
            `;

            // Remove existing warning
            const existing = document.getElementById('security-warning');
            if (existing) existing.remove();

            document.body.appendChild(warningDiv);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (warningDiv.parentNode) {
                    warningDiv.remove();
                }
            }, 10000);
        },

        // Show visual security alert (only visible to you as developer)
        showSecurityAlert(reason) {
            // Only show if in development mode (you can check this)
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('github.io')) {
                const alertDiv = document.createElement('div');
                alertDiv.id = 'security-alert';
                alertDiv.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #ff4757;
                        color: white;
                        padding: 15px 20px;
                        border-radius: 8px;
                        z-index: 9999;
                        max-width: 300px;
                        box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
                        font-family: monospace;
                        font-size: 12px;
                        line-height: 1.4;
                        animation: slideInRight 0.3s ease;
                    ">
                        <div style="font-weight: bold; margin-bottom: 5px;">🚨 Security Alert</div>
                        <div>${reason}</div>
                        <div style="font-size: 10px; opacity: 0.8; margin-top: 5px;">
                            ${new Date().toLocaleTimeString()}
                        </div>
                    </div>
                `;

                // Remove existing alert if present
                const existing = document.getElementById('security-alert');
                if (existing) existing.remove();

                document.body.appendChild(alertDiv);

                // Auto-remove after 5 seconds
                setTimeout(() => {
                    if
