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
});
