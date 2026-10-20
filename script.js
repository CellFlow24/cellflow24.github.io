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
                        
                        const scrollProgress = (scrollY + windowHeight - sectionTop) / (windowHeight + sectionHeight);
                        
                        // A. Central Logo Zooms In and Fades Out
                        if (coreLogo) {
                            // Scale from 1 up to 3.5
                            const scale = 1 + (scrollProgress * 2.5); 
                            // Fade from 1 down to 0 (multiplied by 1.5 so it fades out completely before the very bottom)
                            const opacity = 1 - (scrollProgress * 1.5); 
                            
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
