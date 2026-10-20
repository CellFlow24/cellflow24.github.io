document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. NAVIGATION LOGIC
    // =========================================
    const navContainer = document.getElementById('nav-container');
    const navToggle = document.getElementById('nav-toggle');

    navToggle.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents default button behavior
        e.stopPropagation(); // Stops the document click listener from instantly closing it
        navContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && navContainer.classList.contains('open')) {
            navContainer.classList.remove('open');
        }
    });

    // =========================================
    // SETUP VARIABLES FOR SCROLLING
    // =========================================
    // Ecosystem Elements
    const ecosystemSection = document.querySelector('.cf-ecosystem');
    const coreLogo = document.getElementById('cf-core-logo');
    const floaters = document.querySelectorAll('.cf-float-item');
    
    // Mobile Showcase Elements
    const revealBlocks = document.querySelectorAll('.reveal-block');
    const stickyBtn = document.getElementById('sticky-action-btn');
    const mobileShowcase = document.querySelector('.cf-mobile-showcase');
    const phones = document.querySelectorAll('.cf-giant-phone');

    // Intersection Observer to fade in blocks as you scroll
    const blockObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.15 });

    revealBlocks.forEach(block => blockObserver.observe(block));

    // =========================================
    // UNIFIED SCROLL ENGINE (PERFORMANCE OPTIMIZED)
    // =========================================
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // -----------------------------------------
                // 2. ADVANCED PARALLAX ECOSYSTEM LOGIC
                // -----------------------------------------
                if (ecosystemSection) {
                    const sectionTop = ecosystemSection.offsetTop;
                    const sectionHeight = ecosystemSection.offsetHeight;

                    // Only calculate if the section is currently in the viewport
                    if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                        
                        // Calculate exact centers
                        const sectionCenter = sectionTop + (sectionHeight / 2);
                        const viewportCenter = scrollY + (windowHeight / 2);
                        
                        // How far is the section center from the screen center? (0 = dead center)
                        const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
                        
                        // Normalize it so 0 is center, and 1 is at the edges of the screen
                        const normalizedDistance = Math.min(1, distanceFromCenter / (windowHeight * 0.6));
                        
                        // A. Central Logo Math (Peak at center, Fade/Zoom on edges)
                        if (coreLogo) {
                            // Scale: 1 at center, zooms up to 2.5 at edges
                            const scale = 1 + (normalizedDistance * 1.5); 
                            
                            // Opacity: 1 at center, fades to 0 as it leaves
                            const opacity = 1 - (normalizedDistance * 1.5); 
                            
                            coreLogo.style.transform = `scale(${scale})`;
                            coreLogo.style.opacity = Math.max(0, opacity);
                        }

                        // B. Outer Apps and Decor Float (Standard Parallax)
                        const pixelOffset = (scrollY + windowHeight - sectionTop) - (windowHeight / 2);
                        
                        floaters.forEach(item => {
                            const speed = parseFloat(item.getAttribute('data-speed'));
                            const yPos = pixelOffset * speed;
                            item.style.transform = `translateY(${yPos}px)`;
                        });
                    }
                }

                // -----------------------------------------
                // 3. MOBILE SHOWCASE REVEAL & TILT LOGIC
                // -----------------------------------------
                
                // Sticky Button Logic
                if (mobileShowcase && stickyBtn) {
                    const showcaseTop = mobileShowcase.offsetTop;
                    if (scrollY + windowHeight > showcaseTop + 200) {
                        stickyBtn.classList.add('visible');
                    } else {
                        stickyBtn.classList.remove('visible');
                    }
                }

                // Phone Left-to-Right Tilt Animation (The Sweeping Arc)
                phones.forEach(phone => {
                    const rect = phone.getBoundingClientRect();
                    
                    // Animate while the phone is anywhere within the viewport
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        // Calculates progress from 0 (just entering bottom) to 1 (leaving top)
                        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                        
                        // Sweeps from -10 degrees to +10 degrees as you scroll
                        const tiltZ = (scrollProgress - 0.5) * 20; 
                        
                        // Adds 3D depth (turns slightly left to right)
                        const tiltY = (scrollProgress - 0.5) * -15; 
                        
                        // Adds a slight horizontal curve to match your red arrow
                        const moveX = Math.sin(scrollProgress * Math.PI) * 15; 

                        // Apply the combined sweeping animation
                        phone.style.transform = `perspective(1200px) translateX(${moveX}px) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg)`;
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});
