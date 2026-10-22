document.addEventListener('DOMContentLoaded', () => {
    
    // 1. READ URL PARAMETERS
    const urlParams = new URLSearchParams(window.location.search);
    const requestType = urlParams.get('type') || 'service'; // default to service
    const appName = urlParams.get('app');

    // 2. GET UI ELEMENTS
    const reqTitle = document.getElementById('req-title');
    const reqSubtitle = document.getElementById('req-subtitle');
    const orderSummary = document.getElementById('order-summary');
    const appNameDisplay = document.getElementById('app-name-display');
    const appPriceDisplay = document.getElementById('app-price-display');
    const messageBox = document.getElementById('req-message-box');
    const btnText = document.getElementById('btn-text');
    const messageInput = document.getElementById('req-message');

    // 3. THE SHAPE-SHIFTING LOGIC
    if (requestType === 'order' && appName) {
        // --- APP PURCHASE MODE ---
        reqTitle.innerText = "Secure Your App";
        reqSubtitle.innerText = "Fill in your details. We will process your order and deliver your credentials.";
        
        // Show the elegant order card
        orderSummary.style.display = 'block';
        
        // Hide the big text area, we don't need it for a direct purchase
        messageBox.style.display = 'none';
        messageInput.removeAttribute('required');

        btnText.innerText = "Proceed to Secure Payment";

        // Logic to assign the correct price based on the URL parameter
        let price = '₹0';
        if (appName === 'Bill Flow') price = '₹5,999';
        else if (appName === 'Mess Khata') price = '₹99';
        else if (appName === 'Moktest Simulator') price = '₹1,499';
        
        appNameDisplay.innerText = appName;
        appPriceDisplay.innerText = price;

    } else if (requestType === 'custom') {
        // --- CUSTOM BUILD MODE ---
        reqTitle.innerText = "Request Custom Build";
        reqSubtitle.innerText = "Tell us about your vision. We will review it and send a tailored quotation.";
        
        orderSummary.style.display = 'none';
        messageBox.style.display = 'flex';
        messageInput.setAttribute('required', 'true');
        
        btnText.innerText = "Send Custom Request";

    } else {
        // --- SERVICE / SUPPORT MODE ---
        reqTitle.innerText = "CellFlow Services";
        reqSubtitle.innerText = "Need technical support or modifications to an existing app? Let us know.";
        
        orderSummary.style.display = 'none';
        messageBox.style.display = 'flex';
        messageInput.setAttribute('required', 'true');
        
        btnText.innerText = "Submit Service Ticket";
    }

    // Phase 1 Mock Submit (Will be replaced with Razorpay/G-Sheets in Phase 2)
    document.getElementById('req-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('req-submit-btn');
        submitBtn.innerHTML = "Processing... ⏳";
        submitBtn.style.opacity = "0.7";

        setTimeout(() => {
            alert("Phase 1 Complete! In Phase 2, this button will fire the data to Google Sheets and open Razorpay.");
            submitBtn.innerHTML = btnText.innerText + ' <svg class="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            submitBtn.style.opacity = "1";
        }, 1500);
    });
});
