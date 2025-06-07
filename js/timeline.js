document.addEventListener('DOMContentLoaded', function() {
    const journeyCards = document.querySelectorAll('.journey-card');
    const expandBtns = document.querySelectorAll('.expand-btn');

    // Intersection Observer for scroll animations (cards already have CSS animations)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all journey cards
    journeyCards.forEach(card => {
        observer.observe(card);
    });

    // Expand/collapse functionality
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.journey-card');
            const expandedContent = card.querySelector('.expanded-content');
            
            if (expandedContent.classList.contains('expanded')) {
                // Collapse
                expandedContent.classList.remove('expanded');
                this.textContent = 'Learn More';
                this.classList.remove('expanded');
            } else {
                // Collapse all other cards first
                expandBtns.forEach(otherBtn => {
                    if (otherBtn !== this) {
                        const otherCard = otherBtn.closest('.journey-card');
                        const otherExpandedContent = otherCard.querySelector('.expanded-content');
                        
                        if (otherExpandedContent && otherExpandedContent.classList.contains('expanded')) {
                            otherExpandedContent.classList.remove('expanded');
                            otherBtn.textContent = 'Learn More';
                            otherBtn.classList.remove('expanded');
                        }
                    }
                });
                
                // Expand current card
                expandedContent.classList.add('expanded');
                this.textContent = 'Show Less';
                this.classList.add('expanded');
            }
        });
    });
});
