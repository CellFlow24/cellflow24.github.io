document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // PAGE TRANSITION ENGINE
    // =========================================
    
    // 1. Fade the page in when it initially loads
    document.body.classList.add('cf-page-fade-in');

    setTimeout(() => {
        document.body.classList.remove('cf-page-fade-in');
    }, 500);

    // BUG FIX: The "White Screen" Back Button Fix (BFCache)
    // If the browser restores the page from history, remove the fade-out class!
    window.addEventListener('pageshow', (event) => {
        if (event.persisted || document.body.classList.contains('cf-page-fade-out')) {
            document.body.classList.remove('cf-page-fade-out');
            document.body.classList.add('cf-page-fade-in');
            
            setTimeout(() => {
                document.body.classList.remove('cf-page-fade-in');
            }, 500);
        }
    });

    // 2. Listen for clicks on our special transition links
    document.querySelectorAll('.cf-page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            
            let currentPath = window.location.pathname.split('/').pop();
            if (!currentPath) currentPath = 'index.html'; 
            
            const targetPath = targetUrl.split('#')[0]; 

            // If navigating to a DIFFERENT page -> Fade out first
            if (targetPath && targetPath !== currentPath) {
                e.preventDefault(); 
                
                document.body.classList.remove('cf-page-fade-in');
                document.body.classList.add('cf-page-fade-out');
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400); 
            } else {
                // If already on the page -> Just close menu
                document.getElementById('nav-container').classList.remove('open');
                
                // PRO FIX: If they clicked a link to the exact same page (like the logo)
                // without a specific #section, smoothly scroll them to the very top!
                if (!targetUrl.includes('#')) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
    
    // =========================================
    // 1. NAVIGATION LOGIC
    // =========================================
    const navContainer = document.getElementById('nav-container');
    const navToggle = document.getElementById('nav-toggle');

    navToggle.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        navContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && navContainer.classList.contains('open')) {
            navContainer.classList.remove('open');
        }
    });

    // =========================================
    // SETUP VARIABLES FOR SCROLLING & CAROUSELS
    // =========================================
    // Ecosystem Elements
    const ecosystemSection = document.querySelector('.cf-ecosystem');
    const coreLogo = document.getElementById('cf-core-logo');
    const floaters = document.querySelectorAll('.cf-float-item');
    
    // Mobile Showcase Elements
    const revealBlocks = document.querySelectorAll('.reveal-block');
    const revealCluster = document.querySelector('.reveal-cluster');
    const mobileShowcase = document.querySelector('.cf-mobile-showcase');
    const phones = document.querySelectorAll('.cf-giant-phone');
    
    // Water Drop Menu Elements
    const waterMenuContainer = document.getElementById('cf-water-menu');
    const waterBtn = document.getElementById('cf-water-btn');
    const waterIcon = document.getElementById('cf-water-icon');

    // =========================================
    // 2. MOBILE SHOWCASE REVEAL & CAROUSEL OBSERVER
    // =========================================
    
    // This observer triggers the fade-in AND starts the automatic text/UI slider
    const blockObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const block = entry.target;
            
            if (entry.isIntersecting) {
                // Fade in the block
                block.classList.add('in-view');
                
                // Start the UI/Text carousel if it's not already running
                if (!block.dataset.isRunning) {
                    startAppCarousel(block);
                }
            } else {
                // Pause the carousel to save performance when out of view
                stopAppCarousel(block);
            }
        });
    }, { threshold: 0.15 });

    revealBlocks.forEach(block => blockObserver.observe(block));
    if (revealCluster) blockObserver.observe(revealCluster);

    // Carousel Engine Functions
    function startAppCarousel(block) {
        const uiSlides = block.querySelectorAll('.cf-css-ui.cf-slide');
        const textSlides = block.querySelectorAll('.cf-text-slide');
        
        // If there's only 1 slide, do nothing
        if (uiSlides.length <= 1) return; 
        
        block.dataset.isRunning = "true";
        let currentIndex = Array.from(uiSlides).findIndex(slide => slide.classList.contains('active'));
        if (currentIndex === -1) currentIndex = 0;

        const intervalId = setInterval(() => {
            // Remove active class from current elements
            uiSlides[currentIndex].classList.remove('active');
            textSlides[currentIndex].classList.remove('active');

            // Move to next index (loop back to 0 if at end)
            currentIndex = (currentIndex + 1) % uiSlides.length;

            // Add active class to new elements
            uiSlides[currentIndex].classList.add('active');
            textSlides[currentIndex].classList.add('active');
            
        }, 3500); // Cycles every 3.5 seconds

        // Save interval ID to clear it later
        block.dataset.intervalId = intervalId; 
    }

    function stopAppCarousel(block) {
        if (block.dataset.intervalId) {
            clearInterval(block.dataset.intervalId);
            block.dataset.isRunning = "";
        }
    }

    // =========================================
    // 3. UNIFIED SCROLL ENGINE (PARALLAX & TILT)
    // =========================================
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // -----------------------------------------
                // A. ADVANCED PARALLAX ECOSYSTEM LOGIC
                // -----------------------------------------
                if (ecosystemSection) {
                    const sectionTop = ecosystemSection.offsetTop;
                    const sectionHeight = ecosystemSection.offsetHeight;

                    if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                        
                        const sectionCenter = sectionTop + (sectionHeight / 2);
                        const viewportCenter = scrollY + (windowHeight / 2);
                        const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
                        const normalizedDistance = Math.min(1, distanceFromCenter / (windowHeight * 0.6));
                        
                        // Central Logo Math (Peak at center, Fade/Zoom on edges)
                        if (coreLogo) {
                            const scale = 1 + (normalizedDistance * 1.5); 
                            const opacity = 1 - (normalizedDistance * 1.5); 
                            coreLogo.style.transform = `scale(${scale})`;
                            coreLogo.style.opacity = Math.max(0, opacity);
                        }

                        // Outer Apps and Decor Float
                        const pixelOffset = (scrollY + windowHeight - sectionTop) - (windowHeight / 2);
                        floaters.forEach(item => {
                            const speed = parseFloat(item.getAttribute('data-speed'));
                            const yPos = pixelOffset * speed;
                            item.style.transform = `translateY(${yPos}px)`;
                        });
                    }
                }

                // -----------------------------------------
                // B. MOBILE SHOWCASE TILT & WATER MENU LOGIC
                // -----------------------------------------
                
                // Sticky Button Logic (Water Menu)
                if (mobileShowcase && waterMenuContainer) {
                    const showcaseTop = mobileShowcase.offsetTop;
                    
                    if (scrollY + windowHeight > showcaseTop + 200) {
                        // 1. Enter the section: Morph to Pill if not already triggered
                        if (!waterMenuContainer.dataset.triggered) {
                            waterMenuContainer.dataset.triggered = "true";
                            waterMenuContainer.classList.add('state-pill');
                            
                            // 2. Wait just 1.2 seconds, then morph into bubble and slide right
                            setTimeout(() => {
                                if (waterMenuContainer.classList.contains('state-pill')) {
                                    waterMenuContainer.classList.remove('state-pill');
                                    waterMenuContainer.classList.add('state-bubble');
                                }
                            }, 1200); // ⚡ QUICKER TIMEOUT
                        }
                    } else {
                        // Reset completely if user scrolls back above the showcase
                        if (!waterMenuContainer.classList.contains('menu-open')) {
                            waterMenuContainer.classList.remove('state-pill', 'state-bubble');
                            waterMenuContainer.dataset.triggered = ""; 
                        }
                    }
                }

                // Phone Left-to-Right Tilt Animation (The Sweeping Arc)
                phones.forEach(phone => {
                    const rect = phone.getBoundingClientRect();
                    
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                        
                        const tiltZ = (scrollProgress - 0.5) * 20; 
                        const tiltY = (scrollProgress - 0.5) * -15; 
                        const moveX = Math.sin(scrollProgress * Math.PI) * 15; 

                        phone.style.transform = `perspective(1200px) translateX(${moveX}px) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg)`;
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // =========================================
    // 4. WATER DROP MENU CLICK TOGGLE
    // =========================================
    if (waterBtn && waterMenuContainer) {
        waterBtn.addEventListener('click', () => {
            // Only allow opening if it has morphed into a bubble
            if (waterMenuContainer.classList.contains('state-bubble')) {
                const isOpen = waterMenuContainer.classList.toggle('menu-open');
                // Change icon to an X when open
                if (waterIcon) {
                    waterIcon.innerText = isOpen ? '✖' : '👋';
                }
            }
        });
    }

    // =========================================
    // 5. FINALE TEXT ROTATOR ENGINE
    // =========================================
    const rotatorWords = document.querySelectorAll('.cf-rotator-word');
    
    if (rotatorWords.length > 0) {
        let currentWordIndex = 0;
        
        setInterval(() => {
            // Send current word up and fade out
            rotatorWords[currentWordIndex].classList.remove('active');
            rotatorWords[currentWordIndex].classList.add('exit');
            
            // Calculate next word
            currentWordIndex = (currentWordIndex + 1) % rotatorWords.length;
            
            // Bring next word up from the bottom
            rotatorWords[currentWordIndex].classList.remove('exit');
            rotatorWords[currentWordIndex].classList.add('active');
            
        }, 3000); // Changes every 3 seconds
    }
});
