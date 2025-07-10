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

    // Journey order for navigation - updated to match HTML data-year attributes
    const journeyOrder = ['2016', '2016-scouts', '2021', '2023', '2024', '2025'];
    let currentIndex = 0;

    // Journey data for modal content
    const journeyData = {
        '2016': {
            title: 'Started Swimming',
            year: '2016',
            description: `
                <p>Joined my first competitive swim team (GHAC) at age 12 as a way to train to become a Lifeguard and Swim Instructor. As a young boy I was fascinated with lifesaving and the techniques involved as I progressed through all the swimming levels offered by the City of Burlington aquatics.</p>
                <p>Over the years, I mastered all four competitive strokes - freestyle, backstroke, breaststroke, and butterfly. I also became proficient in various water skills such as diving, flip turns, treading water and rescues.</p>
                <p>My experience competing at regional levels and with my high school gave me insights into performance psychology, goal setting, and the mental aspects of swimming that I now share with my students to help them overcome challenges and build confidence in the water.</p>
            `,
            highlights: ['GHAC', 'Swim Meets', 'Stroke Development', 'Performance Psychology'],
            caption: 'Training at the pool where it all began'
        },
        '2016-scouts': {
            title: 'Scouts Canada',
            year: '2016',
            description: `
                <p>I joined Scouts Canada as a Cub at age 10 with the 13th Burlington Group, quickly embracing its core values of community, honesty, resourcefulness, and compassion. The motto "Do Your Best" became a personal philosophy that still guides me today.</p>
                <p>Over the years, Scouting shaped my leadership and teamwork skills through outdoor adventures and service projects. At 13, I became our group's Chief Scout, leading camps and initiatives while earning the <a href="https://en.wikipedia.org/wiki/Chief_Scout%27s_Award_(Scouts_Canada)" target="_blank" rel="noopener noreferrer" style="color: #667eea; text-decoration: underline;">Chief Scout's Award</a>—the highest youth recognition at the Scout level.</p>
                <p>In Ventures, I stepped into a more strategic leadership role as Vice President and later President, organizing weekly meetings, planning events, and helping the group run smoothly. I also began mentoring younger Scouts—leading camps and passing down the same outdoor and leadership skills that had shaped my own journey. Supporting the next generation became one of the most rewarding parts of my time in Scouting.</p>
                <p>One of the highlights of my Scouting journey came in the summer of 2023, when I represented Canada at the World Scout Jamboree in South Korea. Joining thousands of youth from around the globe, I experienced an incredible exchange of cultures, ideas, and adventure. It was a once-in-a-lifetime opportunity that deepened my connection to the global Scouting community and reminded me how powerful shared values and teamwork can be.</p>
            `,
            highlights: ['Chief Scout Award', 'World Scout Jamboree', 'Leadership Roles', '2x Certificate of Commendation', 'Youth Mentoring'],
            images: [
                {
                    src: 'images/scouts/donate.jpeg',
                    caption: 'Fundraising for Cubs during Apple Day'
                },
                {
                    src: 'images/scouts/award.png',
                    caption: 'My formal awards and recognitions from Scouts Canada'
                },
                {
                    src: 'images/scouts/group.jpg',
                    caption: 'Leading outdoor adventures and camping expeditions with fellow Ventures'
                },
                {
                    src: 'images/scouts/cook.jpg',
                    caption: 'Cooking by campfire with my Venture Scout group'
                },
                {
                    src: 'images/scouts/korea.jpg',
                    caption: 'At the airport before heading to the World Scout Jamboree in South Korea'
                }
            ]
        },
        '2021': {
            title: 'Job Experience',
            year: '2021',
            description: `
                <p>Starting my first part-time jobs was a crucial step in developing my professional skills and work ethic. These early workplace experiences taught me the importance of reliability, clear communication, and excellent customer service.</p>
                <p>Working with customers from all walks of life helped me develop patience and the ability to explain things clearly and patiently - skills that directly translate to my teaching approach. I learned to read people's needs and adapt my communication style accordingly.</p>
                <p>These experiences also taught me time management and how to balance multiple responsibilities, which now helps me maintain consistent lesson quality while managing a busy schedule of both swimming and tutoring sessions.</p>
            `,
            highlights: ['Customer Service', 'Communication', 'Time Management', 'Professional Skills'],
            caption: 'Learning valuable workplace skills'
        },
        '2022': {
            title: 'Job Experience',
            year: '2021',
            description: `
                <p>In 2021, I earned my National Lifeguard certification from the Lifesaving Society and began working at Goldfish Swim School in Burlington. Drawing on my Scouts Canada experience, I helped toddlers and shy beginners feel comfortable and confident in the water. I also coached the Goldfish Swim Team, applying my competitive swimming background to strengthen technique, endurance, and speed in a performance-focused setting. Beyond instruction, I contributed to curriculum development by evaluating both swimmers and fellow instructors to help improve overall program quality.</p>
                <p>At the same time, I joined the City of Burlington as an Instructor Guard, having earned additional certifications in Lifesaving, Emergency First Aid with CPR-B, and Swim Instruction. Here, my focus shifted more toward water safety and drowning prevention, with a special emphasis on adult learners and the Junior Lifeguard Club. Teaching adults with limited swim experience and goals sharpened my communication skills and taught me to adapt my approach to varied learning styles.</p>
                <p>With the Junior Lifeguard Club, I mentored aspiring teens by running drills in swimming, first aid, rescues, and underwater skills. I also shared my personal experience as a working lifeguard, giving them practical insights into real-world responsibilities and the mindset required to handle high-pressure situations.</p>
                <p>Balancing roles at both Goldfish and the City of Burlington gave me wide-ranging experience in teaching across ages, skill levels, and goals—solidifying my strengths in instruction, mentorship, and aquatic leadership.</p>
            `,
            highlights: ['National Lifeguard', 'Goldfish Swim School', 'City of Burlington', 'Standard First Aid'],
            caption: 'Teaching and lifeguarding across Burlington'
        },
        '2023': {
            title: 'Starting University at Western',
            year: '2023',
            description: `
                <p>In September 2023, I began my Engineering journey at the University of Western Ontario in London. Like many students stepping into a rigorous program, I felt unsure wondering if this was the right fit and whether I could rise to the challenge. First year was a mix of adjustment and discovery. From moving away from home and living independently for the first time, to navigating labs, tutorials, quizzes, and exams, every part of the experience was new. But through the uncertainty, I leaned on my resilience, curiosity, and work ethic. The very qualities I had developed through years of leadership and teaching. I embraced opportunities to connect with others, joined campus clubs, and pushed through the steep learning curve that comes with a demanding academic environment.</p>
                <p>By the end of the year, I successfully completed my foundational courses and chose to specialize in Mechanical and AI Systems Engineering, excited by the intersection of physical systems and intelligent design.</p>
                <p>Inspired by the guidance and support I received from my own Residence Don in first year, I applied for the position myself and was selected to serve during my second year. Leading a floor of first-year engineering students was both a challenge and a privilege. As a Don, I became a mentor offering academic support, helping students adapt to the demands of university life, and fostering a community where new students could feel connected. It was a way for me to pay forward the mentorship I had received, while growing as a leader and communicator in a whole new environment.</p>
            `,
            highlights: ['Engineering Program', 'Mechanical & AI Systems', 'Independent Living', 'Campus Leadership'],
            caption: 'Beginning my engineering journey at Western University'
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

    // Slideshow variables
    let currentSlideIndex = 0;
    let slideshowImages = [];
    let autoAdvanceTimer = null;
    let isUserInteracting = false;

    // Function to update modal content
    function updateModalContent(year) {
        const data = journeyData[year];
        if (data) {
            modalTitle.textContent = data.title;
            modalYear.textContent = data.year;
            modalDescription.innerHTML = data.description;
            
            // Handle image slideshow for Scouts Canada
            const modalImage = document.querySelector('.modal-image');
            if (data.images && data.images.length > 0) {
                // Set up slideshow
                slideshowImages = data.images;
                currentSlideIndex = 0;
                setupSlideshow(modalImage);
                updateSlideshow();
            } else {
                // Single image or placeholder
                setupSingleImage(modalImage, data.caption || 'Photo will be added soon');
            }
            
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

    // Setup slideshow HTML structure
    function setupSlideshow(container) {
        container.innerHTML = `
            <div class="slideshow-container">
                <div class="slideshow-wrapper">
                    <div class="slide-image-container">
                        <img id="slideImage" src="" alt="Scout activity" style="display: none;">
                        <div id="slidePlaceholder" class="image-placeholder">
                            <span>Loading...</span>
                        </div>
                    </div>
                    <button class="slide-btn prev-slide" id="prevSlide">‹</button>
                    <button class="slide-btn next-slide" id="nextSlide">›</button>
                </div>
                <div class="slide-indicators">
                    ${slideshowImages.map((_, index) => 
                        `<button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>`
                    ).join('')}
                </div>
                <div class="slide-caption">
                    <span id="slideCaption">Photo will be added soon</span>
                </div>
                <div class="slide-counter">
                    <span id="slideCounter">1 / ${slideshowImages.length}</span>
                </div>
            </div>
        `;

        // Start auto-advance
        startAutoAdvance();

        // Add event listeners for slideshow controls
        const prevSlideBtn = document.getElementById('prevSlide');
        const nextSlideBtn = document.getElementById('nextSlide');

        prevSlideBtn.addEventListener('click', () => {
            pauseAutoAdvance();
            currentSlideIndex = (currentSlideIndex - 1 + slideshowImages.length) % slideshowImages.length;
            updateSlideshow();
            resumeAutoAdvanceAfterDelay();
        });

        nextSlideBtn.addEventListener('click', () => {
            pauseAutoAdvance();
            currentSlideIndex = (currentSlideIndex + 1) % slideshowImages.length;
            updateSlideshow();
            resumeAutoAdvanceAfterDelay();
        });

        // Pause auto-advance on hover
        const slideshowWrapper = document.querySelector('.slideshow-wrapper');
        slideshowWrapper.addEventListener('mouseenter', () => {
            pauseAutoAdvance();
            isUserInteracting = true;
        });

        slideshowWrapper.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            resumeAutoAdvanceAfterDelay();
        });

        // Add event listeners for indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                pauseAutoAdvance();
                currentSlideIndex = index;
                updateSlideshow();
                resumeAutoAdvanceAfterDelay();
            });

            // Pause on indicator hover
            indicator.addEventListener('mouseenter', () => {
                pauseAutoAdvance();
                isUserInteracting = true;
            });

            indicator.addEventListener('mouseleave', () => {
                isUserInteracting = false;
                resumeAutoAdvanceAfterDelay();
            });
        });
    }

    // Start auto-advance timer
    function startAutoAdvance() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
        }
        
        autoAdvanceTimer = setInterval(() => {
            // Only advance if modal is open, slideshow exists, and user isn't interacting
            if (modal.classList.contains('show') && 
                slideshowImages.length > 1 && 
                !isUserInteracting) {
                currentSlideIndex = (currentSlideIndex + 1) % slideshowImages.length;
                updateSlideshow();
            }
        }, 5000);
    }

    // Pause auto-advance
    function pauseAutoAdvance() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    }

    // Resume auto-advance after a delay
    function resumeAutoAdvanceAfterDelay() {
        // Clear any existing timeout
        if (window.resumeTimeout) {
            clearTimeout(window.resumeTimeout);
        }
        
        // Resume after 3 seconds of no interaction
        window.resumeTimeout = setTimeout(() => {
            if (!isUserInteracting) {
                startAutoAdvance();
            }
        }, 1500);
    }

    // Update slideshow display
    function updateSlideshow() {
        const slideImage = document.getElementById('slideImage');
        const slidePlaceholder = document.getElementById('slidePlaceholder');
        const slideCaption = document.getElementById('slideCaption');
        const slideCounter = document.getElementById('slideCounter');
        const currentImage = slideshowImages[currentSlideIndex];

        // Update image
        if (slideImage && slidePlaceholder && currentImage) {
            slidePlaceholder.innerHTML = `<span>Loading...</span>`;
            slideCaption.textContent = currentImage.caption;
            slideCounter.textContent = `${currentSlideIndex + 1} / ${slideshowImages.length}`;

            // Try to load the actual image
            const img = new Image();
            img.onload = () => {
                slideImage.src = img.src;
                slideImage.style.display = 'block';
                slidePlaceholder.style.display = 'none';
            };
            img.onerror = () => {
                slideImage.style.display = 'none';
                slidePlaceholder.style.display = 'flex';
                slidePlaceholder.innerHTML = `<span>Image not found</span>`;
            };
            img.src = currentImage.src;
        }

        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlideIndex);
        });
    }

    // Setup single image (for non-slideshow modals)
    function setupSingleImage(container, caption) {
        container.innerHTML = `
            <div class="image-placeholder">
                <span>Image Coming Soon</span>
            </div>
            <div class="image-caption">
                <span>${caption}</span>
            </div>
        `;
    }

    // Function to update navigation
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
        
        // Clean up slideshow timers
        pauseAutoAdvance();
        isUserInteracting = false;
        if (window.resumeTimeout) {
            clearTimeout(window.resumeTimeout);
        }
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
