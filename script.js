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

                    // Only run calculations if the section is actually visible on screen
                    if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                        
                        // Calculate how far the user has scrolled INTO the section
                        const scrollProgress = (scrollY + windowHeight - sectionTop) / (windowHeight + sectionHeight);
                        
                        // A. Central Logo Moves "Straight and Back" (Z-Axis Scaling)
                        // Starts at 0.7 scale and smoothly grows to 1.25 as you scroll down
                        if (coreLogo) {
                            const scale = 0.7 + (scrollProgress * 0.55); 
                            coreLogo.style.transform = `scale(${scale})`;
                        }

                        // B. Outer Apps Float at independent vertical speeds
                        // The offset ensures they cross the center gracefully
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
