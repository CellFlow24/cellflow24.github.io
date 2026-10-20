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
    // 2. ADVANCED PARALLAX ECOSYSTEM LOGIC
    // =========================================
    const ecosystemSection = document.querySelector('.cf-ecosystem');
    const coreLogo = document.getElementById('cf-core-logo');
    const floaters = document.querySelectorAll('.cf-float-item');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (ecosystemSection) {
                    const scrollY = window.scrollY;
                    const sectionTop = ecosystemSection.offsetTop;
                    const sectionHeight = ecosystemSection.offsetHeight;
                    const windowHeight = window.innerHeight;

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
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    
    // =========================================
    // 3. MOBILE SHOWCASE REVEAL & TILT LOGIC
    // =========================================
    const revealBlocks = document.querySelectorAll('.reveal-block');
    const stickyBtn = document.getElementById('sticky-action-btn');
    const mobileShowcase = document.querySelector('.cf-mobile-showcase');
    const phones = document.querySelectorAll('.cf-giant-phone');

    const blockObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.15 });

    revealBlocks.forEach(block => blockObserver.observe(block));

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // Sticky Button Logic
                if (mobileShowcase && stickyBtn) {
                    const showcaseTop = mobileShowcase.offsetTop;
                    if (scrollY + windowHeight > showcaseTop + 200) {
                        stickyBtn.classList.add('visible');
                    } else {
                        stickyBtn.classList.remove('visible');
                    }
                }

                // Phone Left-to-Right Tilt Animation
                phones.forEach(phone => {
                    const rect = phone.getBoundingClientRect();
                    // Only animate if the phone is vertically visible on the screen
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const scrollProgress = (windowHeight - rect.top) / windowHeight;
                        
                        // Calculates a gentle swaying motion based on scroll depth
                        const tiltZ = Math.sin(scrollProgress * Math.PI) * 3; // Rotates slightly like a steering wheel
                        const tiltY = Math.cos(scrollProgress * Math.PI) * 12; // Tilts slightly left/right in 3D space
                        
                        phone.style.transform = `perspective(1000px) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg)`;
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});
