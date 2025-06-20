document.addEventListener('DOMContentLoaded', function() {
    const journeyCards = document.querySelectorAll('.journey-card');
    const expandBtns = document.querySelectorAll('.expand-btn');
    const modal = document.getElementById('journeyModal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modalTitle');
    const modalYear = document.getElementById('modalYear');
    const modalDescription = document.getElementById('modalDescription');
    const modalHighlights = document.getElementById('modalHighlights');
    const imageCaption = document.getElementById('imageCaption');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const nextBtnText = document.getElementById('nextBtnText');

    // Journey order for navigation
    const journeyOrder = ['2017', '2018', '2022', '2023', '2024', '2025'];
    let currentIndex = 0;

    // Journey data for modal content
    const journeyData = {
        '2017': {
            title: 'Started Swimming',
            year: '2017',
            description: `
                <p>Joined my first competitive swim team at age 12 and quickly fell in love with the sport. This was where I discovered not just my passion for swimming, but also my natural ability to break down complex techniques into understandable steps.</p>
                <p>Over the years, I mastered all four competitive strokes - freestyle, backstroke, breaststroke, and butterfly - while developing the discipline and attention to detail that I now bring to every lesson I teach. The technical precision required in competitive swimming taught me the importance of proper form and consistent practice.</p>
                <p>My experience competing at regional levels gave me insights into performance psychology, goal setting, and the mental aspects of swimming that I now share with my students to help them overcome challenges and build confidence in the water.</p>
            `,
            highlights: ['All 4 Strokes', 'Regional Competitions', 'Technical Foundation', 'Performance Psychology'],
            caption: 'Training at the pool where it all began'
        },
        '2018': {
            title: 'Scouts Canada',
            year: '2018',
            description: `
                <p>My involvement with Scouts Canada was instrumental in developing my leadership abilities and teaching me how to work effectively with diverse groups of people. Through various outdoor adventures and community service projects, I learned to guide and support others while building my own confidence and resilience.</p>
                <p>The program emphasized character development, outdoor skills, and community involvement - values that I carry into my teaching today. I learned to adapt my communication style to work with people of different ages and backgrounds, a skill that proves invaluable when teaching students with varying learning styles.</p>
                <p>The leadership roles I took on in Scouts taught me responsibility, planning, and the importance of creating a supportive environment where everyone can succeed and grow.</p>
            `,
            highlights: ['Leadership Skills', 'Teamwork', 'Community Service', 'Character Development'],
            caption: 'Building character through outdoor adventures'
        },
        '2022': {
            title: 'Job Experience',
            year: '2022',
            description: `
                <p>Starting my first part-time jobs was a crucial step in developing my professional skills and work ethic. These early workplace experiences taught me the importance of reliability, clear communication, and excellent customer service.</p>
                <p>Working with customers from all walks of life helped me develop patience and the ability to explain things clearly and patiently - skills that directly translate to my teaching approach. I learned to read people's needs and adapt my communication style accordingly.</p>
                <p>These experiences also taught me time management and how to balance multiple responsibilities, which now helps me maintain consistent lesson quality while managing a busy schedule of both swimming and tutoring sessions.</p>
            `,
            highlights: ['Customer Service', 'Communication', 'Time Management', 'Professional Skills'],
            caption: 'Learning valuable workplace skills'
        },
        '2023': {
            title: 'Starting University at Western',
            year: '2023',
            description: `
                <p>Beginning my studies at Western University marked a significant milestone in my academic journey. Focusing on mathematics and sciences, I deepened my analytical thinking and problem-solving abilities while maintaining my passion for teaching and helping others.</p>
                <p>The rigorous academic environment at Western challenged me to think critically and approach problems systematically - skills that greatly enhance my tutoring capabilities. I learned to break down complex mathematical and scientific concepts into digestible parts, making them accessible to students at various levels.</p>
                <p>University life also taught me independence, self-discipline, and how to manage competing priorities - experiences that help me relate to my tutoring students who are navigating their own academic challenges.</p>
            `,
            highlights: ['Mathematics Focus', 'Science Studies', 'Academic Excellence', 'Critical Thinking'],
            caption: 'Exploring the beautiful Western University campus'
        },
        '2024': {
            title: 'UC Berkeley Exchange',
            year: '2024',
            description: `
                <p>My exchange program at UC Berkeley was a transformative experience that exposed me to world-class education and innovative teaching methodologies. Being at one of the world's top universities allowed me to observe different instructional approaches and learn from diverse perspectives.</p>
                <p>The international environment at Berkeley taught me to work with people from various cultural backgrounds and adapt my communication style to be more inclusive and effective. This experience significantly enriched my ability to connect with students from different backgrounds.</p>
                <p>The academic rigor and collaborative learning environment at Berkeley reinforced the importance of personalized instruction and helped me develop new strategies for making complex subjects more accessible and engaging for students.</p>
            `,
            highlights: ['International Experience', 'Teaching Methods', 'Cultural Diversity', 'Global Perspective'],
            caption: 'Studying at UC Berkeley\'s iconic campus'
        },
        '2025': {
            title: 'Residence Don at Western',
            year: '2025',
            description: `
                <p>My current role as a Residence Don at Western University has been incredibly rewarding and has significantly strengthened my mentoring and leadership abilities. In this position, I provide support to first-year students during their critical transition to university life.</p>
                <p>Working with students who are adjusting to independence, academic challenges, and social changes has given me deep insights into the learning process and the importance of creating supportive environments. I've learned to recognize when students need different types of support and how to adapt my approach accordingly.</p>
                <p>This role has enhanced my ability to build rapport quickly, provide both academic and personal guidance, and create programs that help students succeed. These skills directly benefit my private tutoring and swimming instruction, as I can better understand and address each student's unique needs and challenges.</p>
            `,
            highlights: ['Student Mentoring', 'Program Leadership', 'Support Systems', 'Personal Development'],
            caption: 'Mentoring students in residence at Western'
        }
    };

    // Function to update modal content
    function updateModalContent(year) {
        const data = journeyData[year];
        if (data) {
            modalTitle.textContent = data.title;
            modalYear.textContent = data.year;
            modalDescription.innerHTML = data.description;
            imageCaption.textContent = data.caption;
            
            // Clear and populate highlights
            modalHighlights.innerHTML = '';
            data.highlights.forEach(highlight => {
                const span = document.createElement('span');
                span.className = 'highlight';
                span.textContent = highlight;
                modalHighlights.appendChild(span);
            });
        }
    }

    // Function to update navigation buttons
    function updateNavigation() {
        // Update previous button
        if (currentIndex === 0) {
            prevBtn.disabled = true;
            prevBtn.style.opacity = '0.5';
        } else {
            prevBtn.disabled = false;
            prevBtn.style.opacity = '1';
        }

        // Update next button
        if (currentIndex === journeyOrder.length - 1) {
            // Last item - change to "Get Started"
            nextBtnText.textContent = 'Get Started';
            nextBtn.classList.add('get-started');
        } else {
            nextBtnText.textContent = 'Next';
            nextBtn.classList.remove('get-started');
        }
    }

    // Intersection Observer for scroll animations
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

    // Modal functionality
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.journey-card');
            const year = card.getAttribute('data-year');
            currentIndex = journeyOrder.indexOf(year);
            
            updateModalContent(year);
            updateNavigation();
            
            // Show modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Navigation button functionality
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            const year = journeyOrder[currentIndex];
            updateModalContent(year);
            updateNavigation();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < journeyOrder.length - 1) {
            currentIndex++;
            const year = journeyOrder[currentIndex];
            updateModalContent(year);
            updateNavigation();
        } else {
            // Last item - redirect to booking
            window.location.href = 'booking.html';
        }
    });

    // Close modal functionality
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show')) {
            if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
});
