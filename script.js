document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const cursorGlow = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Glow effect with a slight delay for smoothness
        setTimeout(() => {
            cursorGlow.style.left = e.clientX - 16 + 'px';
            cursorGlow.style.top = e.clientY - 16 + 'px';
        }, 50);
    });

    // Add hover effects for buttons and links
    const hoverElements = document.querySelectorAll('a, button, .project-card, .glass-card, .form-group input, .form-group textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursorGlow.style.width = '60px';
            cursorGlow.style.height = '60px';
            cursorGlow.style.borderColor = 'var(--accent-purple)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
            cursorGlow.style.borderColor = 'var(--accent-cyan)';
        });
    });

    // --- Typing Effect ---
    const typingText = document.querySelector('.typing-text');
    const words = [
        'Mobile App & Web Development',
        'IoT Hardware Engineering',
        'Cybersecurity Analysis',
        'Network Infrastructure',
        'AI & Machine Learning',
        'Data Analysis & Visualization'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 100;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 200;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // --- Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a skills section, animate progress bars
                if (entry.target.classList.contains('skills-section')) {
                    animateSkills();
                }
                
                // observer.unobserve(entry.target); // Keep observing for re-animation if needed
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Skills Animation ---
    function animateSkills() {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    // --- Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- Show More Certifications ---
    const showMoreBtn = document.getElementById('show-more-certs');
    const certCards = document.querySelectorAll('#certs .cert-card');
    const initialCertsCount = 6;
    let isExpanded = false;

    // Initially hide certificates beyond the first 6
    function updateCertsVisibility() {
        certCards.forEach((card, index) => {
            if (index >= initialCertsCount) {
                if (isExpanded) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                }
            }
        });
    }

    if (showMoreBtn) {
        updateCertsVisibility();

        showMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            updateCertsVisibility();
            
            if (isExpanded) {
                showMoreBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
            } else {
                showMoreBtn.innerHTML = 'Show More Certifications <i class="fas fa-chevron-down"></i>';
                // Scroll back to certifications top when collapsing
                document.getElementById('certs').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- Project Modal ---
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const openInfoBtns = document.querySelectorAll('.open-info');

    openInfoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Populate Modal Content
            document.getElementById('modal-title').textContent = btn.getAttribute('data-title');
            document.getElementById('modal-image').src = btn.getAttribute('data-image');
            document.getElementById('modal-description').textContent = btn.getAttribute('data-desc');
            
            // Populate Tags
            const tagsContainer = document.getElementById('modal-tags');
            tagsContainer.innerHTML = '';
            const tags = btn.getAttribute('data-tags').split(',');
            tags.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag.trim();
                tagsContainer.appendChild(span);
            });

            // Populate Details
            const detailsContainer = document.getElementById('modal-details');
            detailsContainer.innerHTML = '';
            const details = btn.getAttribute('data-details').split(';');
            details.forEach(detail => {
                if(detail.trim()) {
                    const div = document.createElement('div');
                    div.className = 'detail-item';
                    div.innerHTML = `<i class="fas fa-check-circle"></i> <span>${detail.trim()}</span>`;
                    detailsContainer.appendChild(div);
                }
            });

            // Handle Verify Button
            const verifyBtn = document.getElementById('modal-verify-btn');
            if (btn.closest('#certs')) {
                verifyBtn.style.display = 'inline-flex';
            } else {
                verifyBtn.style.display = 'none';
            }

            // Show Modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- Back to Top ---
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // --- Smooth Navigation ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinksList = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinksList.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close mobile nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinksList.forEach(li => li.style.animation = '');
            }
        });
    });

    // --- Form Submission (Web3Forms) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    // Success state
                    submitBtn.innerHTML = 'Sent Successfully! <i class="fas fa-check"></i>';
                    submitBtn.style.background = 'linear-gradient(45deg, #00b09b, #96c93d)';
                    contactForm.reset();
                } else {
                    // Error state
                    console.log(response);
                    submitBtn.innerHTML = 'Error Sending! <i class="fas fa-exclamation-triangle"></i>';
                    submitBtn.style.background = 'linear-gradient(45deg, #ff416c, #ff4b2b)';
                }
            })
            .catch(error => {
                console.log(error);
                submitBtn.innerHTML = 'Network Error! <i class="fas fa-wifi"></i>';
            })
            .then(() => {
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // --- Parallax Effect on Mouse Move ---
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        const spheres = document.querySelectorAll('.gradient-sphere');
        spheres.forEach((sphere, index) => {
            const speed = (index + 1) * 2;
            sphere.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });
});

// Keyframes for mobile nav fade
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .nav-links.nav-active {
        display: flex;
        flex-direction: column;
        position: fixed;
        right: 0px;
        height: 100vh;
        top: 0;
        background: rgba(10, 11, 30, 0.98);
        backdrop-filter: blur(20px);
        width: 25%; /* Cater 25% of the horizontal screen as requested */
        min-width: 200px; /* Reduced min-width to accommodate 25% better on small screens */
        align-items: center;
        justify-content: center;
        z-index: 1000;
        box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        border-left: 1px solid var(--glass-border);
    }

    .burger { 
        display: none; 
        cursor: pointer; 
        z-index: 1100; /* Ensure burger is above the open navigation */
        position: fixed; /* Changed to fixed to keep it in place when scrolling while menu is open */
        right: 2rem;
        top: 1.8rem;
    }
    .burger div { width: 25px; height: 3px; background-color: var(--accent-cyan); margin: 5px; transition: all 0.3s ease; }

    @media screen and (max-width: 768px) {
        .burger { display: block; }
    }

    .toggle .line1 { transform: rotate(-45deg) translate(-5px, 6px); background-color: var(--accent-cyan); }
    .toggle .line2 { opacity: 0; }
    .toggle .line3 { transform: rotate(45deg) translate(-5px, -6px); background-color: var(--accent-cyan); }
`;
document.head.appendChild(style);
