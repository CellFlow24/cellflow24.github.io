
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('nav-container');
    const navToggle = document.getElementById('nav-toggle');

    // Toggle the menu on button click
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents document click from firing instantly
        navContainer.classList.toggle('open');
    });

    // Close the menu if clicking anywhere outside of it
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && navContainer.classList.contains('open')) {
            navContainer.classList.remove('open');
        }
    });
});
