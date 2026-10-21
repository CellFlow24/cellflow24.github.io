document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECTORS
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterSlider = document.querySelector('.filter-slider');
    const premiumApps = document.querySelectorAll('.premium-app');
    const freeApps = document.querySelectorAll('.free-app');
    const filterPillContainer = document.querySelector('.store-filter-pill');
    
    const storeTitle = document.querySelector('.store-title');
    const storeSubtitle = document.querySelector('.store-subtitle');

    // 2. CHECK URL PARAMETERS (The Magic Router)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam === 'premium') {
        // Lock to Premium Mode
        filterPillContainer.style.display = 'none'; // Hide the toggle options
        storeTitle.innerText = "Premium Studio";
        storeSubtitle.innerText = "High-performance tools tailored for your workflow.";
        
        freeApps.forEach(app => { app.style.display = 'none'; app.style.opacity = '0'; });
        premiumApps.forEach(app => { app.style.display = 'flex'; app.style.opacity = '1'; });
        
    } else if (filterParam === 'free') {
        // Lock to Free Mode
        filterPillContainer.style.display = 'none'; // Hide the toggle options
        storeTitle.innerText = "Free & Fun Zone";
        storeSubtitle.innerText = "Community apps, anonymous chats, and mini-games.";
        
        premiumApps.forEach(app => { app.style.display = 'none'; app.style.opacity = '0'; });
        freeApps.forEach(app => { app.style.display = 'flex'; app.style.opacity = '1'; });
        
    } else {
        // Normal Mode (Direct link to appstore.html without parameters)
        setupManualFilters();
    }

    // 3. MANUAL FILTER LOGIC (Only active if no URL parameter is set)
    function setupManualFilters() {
        filterBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Move the blue background slider
                filterSlider.style.transform = `translateX(${index * 100}%)`;

                const target = btn.getAttribute('data-target');

                if (target === 'premium') {
                    hideApps(freeApps);
                    setTimeout(() => showApps(premiumApps), 300);
                } else if (target === 'free') {
                    hideApps(premiumApps);
                    setTimeout(() => showApps(freeApps), 300);
                }
            });
        });
    }

    // Helper functions for smooth fading
    function hideApps(appNodeList) {
        appNodeList.forEach(app => {
            app.style.opacity = '0';
            setTimeout(() => { app.style.display = 'none'; }, 300); 
        });
    }

    function showApps(appNodeList) {
        appNodeList.forEach(app => {
            app.style.display = 'flex'; 
            setTimeout(() => { app.style.opacity = '1'; }, 50); 
        });
    }


    // =========================================
    // 4. PWA INSTALL LOGIC (The Magic Install Button)
    // =========================================
    let deferredPrompt;
    const installButtons = document.querySelectorAll('.pwa-install-btn');

    // This native browser event fires if the app is installable!
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        installButtons.forEach(btn => {
            btn.classList.add('ready');
            btn.innerText = "Install Now";
            
            btn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response: ${outcome}`);
                    deferredPrompt = null;
                    installButtons.forEach(b => b.classList.remove('ready'));
                }
            });
        });
    });

    // Fallback for non-PWA environments
    installButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('ready')) {
                alert("To install this app, please click 'Try Demo' first. Once inside the app, your browser will allow you to install it directly to your home screen!");
            }
        });
    });

});
