document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('nav-container');
    const navToggle = document.getElementById('nav-toggle');

    // Toggle menu
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); 
        navContainer.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && navContainer.classList.contains('open')) {
            navContainer.classList.remove('open');
        }
    });
});
