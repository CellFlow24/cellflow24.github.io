document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FILTER PILL LOGIC
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterSlider = document.querySelector('.filter-slider');
    const premiumApps = document.querySelectorAll('.premium-app');
    const freeApps = document.querySelectorAll('.free-app');

    filterBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Remove active state from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            // Move the blue background slider
            // If it's the second button (index 1), move it 100% to the right
            filterSlider.style.transform = `translateX(${index * 100}%)`;

            // Filter the apps with fade animations
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

    function hideApps(appNodeList) {
        appNodeList.forEach(app => {
            app.style.opacity = '0';
            setTimeout(() => { app.style.display = 'none'; }, 300); // Wait for fade out
        });
    }

    function showApps(appNodeList) {
        appNodeList.forEach(app => {
            app.style.display = 'flex'; // Reset display based on CSS rules
            // Tiny timeout required for browser to register 'display' change before fading in
            setTimeout(() => { app.style.opacity = '1'; }, 50); 
        });
    }


    // 2. PWA INSTALL LOGIC (The Magic Install Button)
    let deferredPrompt;
    const installButtons = document.querySelectorAll('.pwa-install-btn');

    // This native browser event fires if the app is installable!
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        
        // Update UI to notify the user they can add to home screen
        installButtons.forEach(btn => {
            btn.classList.add('ready');
            btn.innerText = "Install Now";
            
            btn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    // Show the prompt
                    deferredPrompt.prompt();
                    // Wait for the user to respond to the prompt
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response to the install prompt: ${outcome}`);
                    // We've used the prompt, and can't use it again, throw it away
                    deferredPrompt = null;
                    // Reset buttons
                    installButtons.forEach(b => b.classList.remove('ready'));
                }
            });
        });
    });

    // Optional fallback: If not in a PWA environment, alert the user on click
    installButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('ready')) {
                alert("To install this app, please open the 'Try Demo' link first. Once inside the app, your browser will allow you to install it directly to your home screen!");
            }
        });
    });

});
