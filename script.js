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

                    if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                        
                        // Calculate progress (0 at top of section, 1 at bottom)
                        const scrollProgress = Math.max(0, (scrollY - sectionTop + (windowHeight / 2)) / sectionHeight);
                        
                        // A. Central Logo Zooms In and Fades Out as you scroll down
                        if (coreLogo) {
                            // Starts at scale 1, zooms up to 3.5
                            const scale = 1 + (scrollProgress * 2.5); 
                            // Starts at opacity 1, fades to 0 faster
                            const opacity = 1 - (scrollProgress * 1.8); 
                            
                            coreLogo.style.transform = `scale(${scale})`;
                            coreLogo.style.opacity = Math.max(0, opacity);
                        }

                        // B. Outer Apps and Decor Float
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
