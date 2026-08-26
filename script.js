// Force browser to start at the top of the page on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
};

// Scroll Reveal Animations (Upgraded for Zero Lag on Mobile)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// --- Toptal-Style Stacked Carousel Logic ---
const cards = document.querySelectorAll('.stacked-card');
let classArray = ['card-front', 'card-middle']; //'card-back', 'card-hidden'
let carouselInterval;

function rotateCards() {
    const last = classArray.pop();
    classArray.unshift(last);
    cards.forEach((card, index) => {
        card.className = 'stacked-card ' + classArray[index];
    });
}

function startStackedCarousel() {
    if (cards.length > 0) {
        carouselInterval = setInterval(rotateCards, 3500);
    }
}
function stopStackedCarousel() { clearInterval(carouselInterval); }

const carouselContainer = document.getElementById('feedbackCarousel');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopStackedCarousel);
    carouselContainer.addEventListener('mouseleave', startStackedCarousel);
    carouselContainer.addEventListener('touchstart', stopStackedCarousel);
    carouselContainer.addEventListener('touchend', startStackedCarousel);
    startStackedCarousel();
}

// --- Colorful Promo 3D Carousel Logic ---
const promoCards = document.querySelectorAll('.promo-card');
let promoClassArray = ['promo-front', 'promo-middle', 'promo-back'];
let promoInterval;

function rotatePromoCards() {
    const last = promoClassArray.pop();
    promoClassArray.unshift(last);
    promoCards.forEach((card, index) => {
        card.className = 'promo-card ' + promoClassArray[index];
    });
}

function startPromoCarousel() {
    if (promoCards.length > 0) {
        promoInterval = setInterval(rotatePromoCards, 4500); // Increased to 4.5 seconds for tracker animation
    }
}

function stopPromoCarousel() { 
    clearInterval(promoInterval); 
}

const promoCarouselContainer = document.getElementById('promoCarousel');
if (promoCarouselContainer) {
    // Pauses the swipe if they hover/touch to read the bullets
    promoCarouselContainer.addEventListener('mouseenter', stopPromoCarousel);
    promoCarouselContainer.addEventListener('mouseleave', startPromoCarousel);
    promoCarouselContainer.addEventListener('touchstart', stopPromoCarousel);
    promoCarouselContainer.addEventListener('touchend', startPromoCarousel);
    startPromoCarousel();
}

// --- Hide Floating CTA when Form is Visible ---
const ctaBtn = document.getElementById('floatingCta');
const contactSection = document.getElementById('contact');

if (ctaBtn && contactSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ctaBtn.classList.add('hidden-cta');
            } else {
                ctaBtn.classList.remove('hidden-cta');
            }
        });
    }, { threshold: 0.15 }); 
    observer.observe(contactSection);
}

// Modal System (Pop-ups)
function openModal(modalId) { document.getElementById(modalId).style.display = 'block'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}
function slideGallery(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const scrollAmount = slider.clientWidth; 
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// --- Form Submission & Razorpay Integration (UPGRADED TO PREVENT TIMEOUTS) ---
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    var submitBtn = document.getElementById('submitBtn');
    var formData = new FormData(this);
    var inquiryType = document.getElementById('inquiryTypeHidden').value;
    var name = formData.get('name');
    var email = formData.get('email');
    
    var webAppUrl = "https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec"; 

    // 1. App Orders (Native Popup with Pre-Logging)
    if (inquiryType === 'Order Your App') {
        var productName = document.getElementById('selectedProduct').value;
        var productPrice = document.getElementById('selectedProductPrice').value;

        if (!productName || !productPrice) {
            alert("Please select an application to order.");
            return;
        }

        var ticketId = "CF-" + Math.floor(100000 + Math.random() * 900000);

        formData.set('inquiryType', inquiryType);
        formData.set('message', productName);
        formData.set('paymentStatus', 'Pending');
        formData.set('paymentAmount', productPrice);
        formData.set('ticketId', ticketId);

        submitBtn.innerHTML = "Opening Secure Checkout...";
        submitBtn.style.opacity = "0.7";

        // Fire-and-forget: Log order immediately without waiting for Apps Script
        fetch(webAppUrl, { method: 'POST', body: formData }).catch(e => console.log(e));

        var options = {
            "key": "rzp_live_TSvZvBK9HMg5eU",
            "amount": parseFloat(productPrice) * 100,
            "currency": "INR",
            "name": "Cellflow",
            "description": "Order: " + productName,
            "image": "https://cellflow24.github.io/logo.png",
            "notes": { "ticketId": ticketId }, 
            
            // 1. FORCES A CLEAN REDIRECT INSTEAD OF JAVASCRIPT HANDLER
            "callback_url": "https://cellflow24.github.io/?razorpay_payment_id=success",
            // 2. CRITICAL FOR GITHUB PAGES (Prevents 405 Error)
            "callback_method": "get",
            
            "prefill": { "name": name, "email": email },
            "theme": { "color": "#0056b3" },
            "modal": {
                "ondismiss": function() {
                    var btn = document.getElementById('submitBtn');
                    if (btn) {
                        btn.innerHTML = "Place an Order";
                        btn.style.opacity = "1";
                    }
                }
            }
        };
        
        var rzp1 = new Razorpay(options);
        rzp1.open();

    } else {
        // 2. Normal Support / Complaints / Custom Dev
        submitBtn.innerHTML = "Sending...";
        submitBtn.style.opacity = "0.7";
        
        var originalMessage = formData.get('message');
        formData.set('inquiryType', inquiryType);
        formData.set('message', originalMessage);
        formData.set('paymentStatus', 'Pending');
        formData.set('paymentAmount', '0');

        // OPTIMISTIC UI: Handle Apps Script lag on mobile
        let isSuccessTriggered = false;
        
        function triggerSuccess() {
            if (isSuccessTriggered) return;
            isSuccessTriggered = true;
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('successState').style.display = 'block';
            setTimeout(() => {
                document.getElementById('successBlob').classList.add('active');
                document.getElementById('successContent').classList.add('active');
            }, 50);
            document.getElementById('leadForm').reset();
            document.getElementById('customDropdownSelected').textContent = "How can we help you?";
            document.getElementById('customDropdownSelected').classList.remove('has-value');
            submitBtn.innerHTML = "Send Request";
            submitBtn.style.opacity = "1";
        }

        fetch(webAppUrl, { method: 'POST', body: formData })
        .then(() => triggerSuccess())
        .catch(() => triggerSuccess()); // Even on timeout error, the data reaches Google Sheets

        // Failsafe: Trigger success after 2 seconds no matter what to prevent a frozen button
        setTimeout(triggerSuccess, 2000);
    }
});

function sendToGoogleSheets(formData, submitBtn, webAppUrl) {
    fetch(webAppUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('successState').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('successBlob').classList.add('active');
            document.getElementById('successContent').classList.add('active');
        }, 50);

        document.getElementById('leadForm').reset();
        document.getElementById('customDropdownSelected').textContent = "How can we help you?";
        document.getElementById('customDropdownSelected').classList.remove('has-value');
        
        submitBtn.innerHTML = "Send Request";
        submitBtn.style.opacity = "1";
    })
    .catch(error => {
        submitBtn.innerHTML = "Error! Try Again";
        submitBtn.style.backgroundColor = "red";
    });
}

function resetForm() {
    document.getElementById('successBlob').classList.remove('active');
    document.getElementById('successContent').classList.remove('active');
    
    setTimeout(() => {
        document.getElementById('successState').style.display = 'none';
        document.getElementById('formContainer').style.display = 'block';
    }, 400); 
}

// --- Custom Dropdown, Background Loading & Direct Purchase Logic ---
const customDropdownSelected = document.getElementById('customDropdownSelected');
const customDropdownOptions = document.getElementById('customDropdownOptions');
const inquiryTypeHidden = document.getElementById('inquiryTypeHidden');
const customOptions = document.querySelectorAll('.custom-option');

const messageBox = document.getElementById('messageBox');
const productContainer = document.getElementById('productContainer');
const submitBtn = document.getElementById('submitBtn');
const productList = document.getElementById('productList');
const selectedProductInput = document.getElementById('selectedProduct');

// 1. HARDCODED PRODUCT CATALOG (Zero Lag, Instant Load)

// Add this line to destroy the old memory from our first attempt!
localStorage.removeItem('cellflowProducts'); 

// ⚠️ Change prize here
const availableProducts = [
    { name: "Mess Khata", originalPrice: 199, discountedPrice: 1 }, 
    { name: "Bill Flow", originalPrice: 8999, discountedPrice: 5999 },
    { name: "Mok Test APK", originalPrice: 2999, discountedPrice: 1499 }
];

// Instantly inject prices into the homepage buttons
function updateProductUI() {
    availableProducts.forEach(item => {
        let badge = document.getElementById('badge-' + item.name);
        if(badge) {
            badge.textContent = '₹' + item.discountedPrice;
        }
    });
}
updateProductUI();

// 2. Render Products Logic (Instant render, no loading dots needed)
function renderProductCards(autoSelectName = null) {
    productList.innerHTML = '';
    availableProducts.forEach(item => {
        let div = document.createElement('div');
        div.className = 'checkout-item'; 
        div.innerHTML = `
            <span class="prod-name">${item.name}</span>
            <div class="prod-pricing">
                <span class="price-strike">₹${item.originalPrice}</span>
                <span class="price-final">₹${item.discountedPrice}</span>
            </div>
        `;
        
        div.onclick = function() {
            document.querySelectorAll('.checkout-item').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            selectedProductInput.value = item.name; 
            document.getElementById('selectedProductPrice').value = item.discountedPrice;
        };
        
        productList.appendChild(div);

        // Auto-select if directed from a homepage button
        if (autoSelectName && item.name.toLowerCase() === autoSelectName.toLowerCase()) {
            div.click();
        }
    });
}

// 3. Direct Purchase Button Function (Triggered from HTML)
window.directPurchase = function(appName, event) {
    event.stopPropagation(); // Prevents the card modal from opening
    
    // Smooth scroll to the contact section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // Force the dropdown to "Order Your App"
    customDropdownSelected.textContent = "Order Your App";
    customDropdownSelected.classList.add('has-value');
    inquiryTypeHidden.value = "Order Your App";
    
    // Switch the UI to the App Checkout view
    messageBox.style.display = 'none';
    messageBox.removeAttribute('required');
    productContainer.style.display = 'block';
    submitBtn.innerHTML = 'Place an Order';
    
    // Render the cards and auto-select the one they clicked!
    renderProductCards(appName);
    
    // Highlight the Name box to prompt them to finish
    setTimeout(() => {
        document.querySelector('input[name="name"]').focus();
    }, 600);
};

// 4. Manual Dropdown Interaction
customDropdownSelected.addEventListener('click', function(event) {
    event.stopPropagation();
    customDropdownOptions.classList.toggle('open');
});

document.addEventListener('click', function(event) {
    if (!customDropdownSelected.contains(event.target) && !customDropdownOptions.contains(event.target)) {
        customDropdownOptions.classList.remove('open');
    }
});

customOptions.forEach(option => {
    option.addEventListener('click', function() {
        const selectedValue = this.getAttribute('data-value');
        customDropdownSelected.textContent = this.textContent;
        customDropdownSelected.classList.add('has-value');
        inquiryTypeHidden.value = selectedValue;
        customDropdownOptions.classList.remove('open');

        if (selectedValue === 'Order Your App') {
            messageBox.style.display = 'none';
            messageBox.removeAttribute('required');
            productContainer.style.display = 'block';
            submitBtn.innerHTML = 'Place an Order';
            renderProductCards();
        } else {
            messageBox.style.display = 'block';
            messageBox.setAttribute('required', 'true');
            productContainer.style.display = 'none';
            submitBtn.innerHTML = 'Send Request';
            selectedProductInput.value = ''; 
            document.querySelectorAll('.checkout-item').forEach(el => el.classList.remove('selected'));
        }
    });
});

// 5. Custom Build Request Function
window.requestCustomBuild = function(event) {
    event.stopPropagation();
    
    // Scroll to the contact section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // Force the dropdown to "Need a Custom Website/App"
    customDropdownSelected.textContent = "Need a Custom Website/App";
    customDropdownSelected.classList.add('has-value');
    inquiryTypeHidden.value = "Need a Custom Website/App";
    
    // Switch UI to normal inquiry mode (hide products, show text box)
    messageBox.style.display = 'block';
    messageBox.setAttribute('required', 'true');
    productContainer.style.display = 'none';
    submitBtn.innerHTML = 'Send Request';
    
    // Clear any previously selected product to be safe
    selectedProductInput.value = ''; 
    document.querySelectorAll('.checkout-item').forEach(el => el.classList.remove('selected'));
    
    // Prompt them to start typing
    setTimeout(() => {
        document.querySelector('input[name="name"]').focus();
    }, 600);
};

function nextStorySlide() {
    if(storySlides.length === 0) return;
    let next = (currentStorySlide + 1) % storySlides.length;
    showStorySlide(next);
}

function startStoryCarousel() {
    storyIntervalTimer = setInterval(nextStorySlide, 4500); // Swipes every 4.5 seconds
}

// Allow users to click the dots manually
window.goToSlide = function(index) {
    clearInterval(storyIntervalTimer);
    showStorySlide(index);
    startStoryCarousel();
};

if (storySlides.length > 0) {
    startStoryCarousel();
}

// --- CATCH MOBILE UPI REDIRECTS FOR SUCCESS ANIMATION ---
window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if Razorpay sent the user back with a payment ID in the link
    if (urlParams.has('razorpay_payment_id')) {
        
        // 1. Scroll down to the contact section instantly so they see it
        const contactSection = document.getElementById('contact');
        if(contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }

        // 2. Hide the form and show the success block
        const formContainer = document.getElementById('formContainer');
        const successState = document.getElementById('successState');
        
        if(formContainer && successState) {
            formContainer.style.display = 'none';
            successState.style.display = 'block';
            
            // 3. Trigger the smooth blob animation
            setTimeout(() => {
                document.getElementById('successBlob').classList.add('active');
                document.getElementById('successContent').classList.add('active');
            }, 50);
        }

        // 4. Clean up the URL! (Removes the tracking code so if they refresh, the form comes back normally)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
