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
    // 2. PARALLAX ECOSYSTEM LOGIC
    // =========================================
    const coreLogo = document.getElementById('cf-core-logo');
    const floaters = document.querySelectorAll('.cf-float-item');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // A. Central Logo scales and rotates slightly based on scroll
                if (coreLogo) {
                    const scale = 1 + (scrollY * 0.0003); // Subtle zoom effect
                    const rotate = scrollY * 0.05; // Gentle spin effect
                    coreLogo.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
                }

                // B. Floating apps move at different parallax speeds
                floaters.forEach(item => {
                    const speed = parseFloat(item.getAttribute('data-speed'));
                    const yPos = scrollY * speed;
                    item.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Optimization for buttery smooth mobile scrolling
});
