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
    const messageLabel = document.getElementById('req-message-label');
    const messageInput = document.getElementById('req-message');
    const amountBox = document.getElementById('req-amount-box');
    const amountInput = document.getElementById('req-amount');
    const btnText = document.getElementById('btn-text');

    // 3. THE SHAPE-SHIFTING LOGIC
    if (requestType === 'order' && appName) {
        // --- APP PURCHASE MODE ---
        reqTitle.innerText = "Secure Your App";
        reqSubtitle.innerText = "Fill in your details. We will process your order and deliver your credentials.";
        
        orderSummary.style.display = 'block';
        amountBox.style.display = 'none';
        messageBox.style.display = 'none';
        messageInput.removeAttribute('required');
        amountInput.removeAttribute('required');

        btnText.innerText = "Proceed to Secure Payment";

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
        amountBox.style.display = 'none';
        messageBox.style.display = 'flex';
        messageInput.setAttribute('required', 'true');
        amountInput.removeAttribute('required');
        messageLabel.innerText = "Project Details / Request";
        
        btnText.innerText = "Send Custom Request";

    } else if (requestType === 'donate') {
        // --- DONATE MODE ---
        reqTitle.innerText = "Support CellFlow ☕";
        reqSubtitle.innerText = `Love using ${appName || 'our free apps'}? Your support keeps the servers running and the apps free!`;
        
        orderSummary.style.display = 'none';
        
        // Show Custom Amount Box
        amountBox.style.display = 'flex';
        amountInput.setAttribute('required', 'true');
        
        // Show Message Box (Optional)
        messageBox.style.display = 'flex';
        messageInput.removeAttribute('required'); 
        messageLabel.innerText = "Leave a message (Optional)";
        
        btnText.innerText = "Proceed to Donate";

    } else {
        // --- SERVICE / SUPPORT MODE ---
        reqTitle.innerText = "CellFlow Services";
        reqSubtitle.innerText = "Need technical support or modifications to an existing app? Let us know.";
        
        orderSummary.style.display = 'none';
        amountBox.style.display = 'none';
        messageBox.style.display = 'flex';
        messageInput.setAttribute('required', 'true');
        amountInput.removeAttribute('required');
        messageLabel.innerText = "Issue / Request Details";
        
        btnText.innerText = "Submit Service Ticket";
    }

    // =========================================
    // 4. REAL SUBMIT ENGINE (G-Sheets & Razorpay)
    // =========================================
    document.getElementById('req-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('req-submit-btn');
        submitBtn.innerHTML = "Processing... ⏳";
        submitBtn.style.opacity = "0.7";

        // Gather Data
        const name = document.getElementById('req-name').value;
        const email = document.getElementById('req-email').value;
        let message = document.getElementById('req-message').value || "";
        let amount = 0;
        let finalType = requestType; 

        // Format based on request type
        if (requestType === 'order') {
            finalType = "Order Your App";
            message = appName; // Just send the app name
            let rawPrice = appPriceDisplay.innerText;
            amount = parseFloat(rawPrice.replace(/[^0-9.-]+/g,"")); // Strips commas and symbols
        } else if (requestType === 'donate') {
            finalType = "Donate";
            amount = parseFloat(amountInput.value);
            message = appName ? `Donation for ${appName}. Msg: ${message}` : `General Donation. Msg: ${message}`;
        } else if (requestType === 'custom') {
            finalType = "Need a Custom Website/App";
        } else {
            finalType = "Technical Support/Complaint";
        }

        // Generate Ticket & FormData
        const ticketId = "CF-" + Math.floor(100000 + Math.random() * 900000);
        var formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('inquiryType', finalType);
        formData.append('message', message);
        formData.append('paymentStatus', 'Pending');
        formData.append('paymentAmount', amount);
        formData.append('ticketId', ticketId);

        // Your existing Web App URL
        var webAppUrl = "https://script.google.com/macros/s/AKfycbzWinkvpaQNr25tKjePWeubGhEAV-ApWWJ_ELZcv7UJRr9xSxB4DRDehRnv6S4PZMIXKg/exec";

        // Handle Payment Flow
        if ((requestType === 'order' || requestType === 'donate') && amount > 0) {
            submitBtn.innerHTML = "Logging Order...";
            
            fetch(webAppUrl, { method: 'POST', body: formData })
            .then(() => {
                submitBtn.innerHTML = "Opening Secure Checkout...";
                
                var options = {
                    "key": "rzp_live_TSvZvBK9HMg5eU",
                    "amount": amount * 100, // paise
                    "currency": "INR",
                    "name": "CellFlow Studio",
                    "description": finalType === "Donate" ? "Support CellFlow" : "Order: " + appName,
                    "image": "https://cellflow24.github.io/logo.png",
                    "notes": { "ticketId": ticketId }, 
                    "payment_capture": 1,
                    "handler": function (response) {
                        showSuccessState("Payment Successful!", "Your receipt has been sent to " + email);
                    },
                    "prefill": { "name": name, "email": email },
                    "theme": { "color": "#0F172A" }, // CellFlow Navy
                    "modal": {
                        "ondismiss": function() {
                            submitBtn.innerHTML = btnText.innerText + ' <svg class="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                            submitBtn.style.opacity = "1";
                        }
                    }
                };
                
                var rzp1 = new Razorpay(options);
                rzp1.open();
            })
            .catch(error => {
                alert("Connection error. Please try again.");
                submitBtn.innerHTML = btnText.innerText + ' <svg class="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                submitBtn.style.opacity = "1";
            });

        } else {
            // Handle Free/Custom Flow
            submitBtn.innerHTML = "Sending...";
            fetch(webAppUrl, { method: 'POST', body: formData })
            .then(() => showSuccessState("Request Received", "Team CellFlow will be in touch shortly."))
            .catch(() => showSuccessState("Request Received", "Team CellFlow will be in touch shortly.")); 
        }
    });

    // Triggers the animation
    function showSuccessState(title, desc) {
        document.getElementById('req-form').style.display = 'none';
        document.getElementById('req-title').style.display = 'none';
        document.getElementById('req-subtitle').style.display = 'none';
        
        document.getElementById('success-title').innerText = title;
        document.getElementById('success-message').innerText = desc;
        
        const successState = document.getElementById('successState');
        successState.style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('successBlob').classList.add('active');
            document.getElementById('successContent').classList.add('active');
        }, 50);
    }
});
