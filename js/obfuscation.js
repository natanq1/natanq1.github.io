// Basic obfuscation utilities
(function() {
    'use strict';
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });
    
    // Detect DevTools
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    function detectDevTools() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
                console.log('%cThis is a browser feature intended for developers. Do not enter any code here.', 'color: red; font-size: 16px;');
                // Redirect away from page
                window.location.href = 'https://www.google.com';
            }
        } else {
            devtools.open = false;
        }
    }
    
    // Check every 500ms
    setInterval(detectDevTools, 500);
    
    // Console warning
    console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy and paste something here, it is a scam and will give them access to your account.', 'color: red; font-size: 16px;');
    
    // Obfuscate sensitive strings
    window.obfuscate = {
        decode: function(str) {
            return atob(str);
        },
        encode: function(str) {
            return btoa(str);
        }
    };
    
})();
