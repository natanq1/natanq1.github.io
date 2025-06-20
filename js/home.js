document.addEventListener('DOMContentLoaded', function() {
    // Add dynamic parallax effect to hero
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const rate = scrollTop * -0.3;
        heroBackground.style.transform = `translateY(${rate}px)`;
        
        // Hide scroll indicator when scrolling starts
        if (scrollTop > 50) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }
    });

    // Scroll indicator click functionality
    scrollIndicator.addEventListener('click', () => {
        const servicesSection = document.querySelector('.services-section');
        servicesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Add subtle mouse movement effect to hero
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * 2;
        const rotateY = (centerX - x) / centerX * 2;
        
        heroBackground.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
        heroBackground.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });

    // Add intersection observer for hero text animations
    const heroTextElements = document.querySelectorAll('.hero h1, .hero-subtitle, .cta-buttons');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    heroTextElements.forEach(element => {
        textObserver.observe(element);
    });

    // Animate cards on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.service-card, .testimonial-card, .credential');
        
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

    // Add smooth scroll behavior for anchor links
    const smoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Initialize animations
    animateOnScroll();
    smoothScroll();
});
