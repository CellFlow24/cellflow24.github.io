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
let classArray = ['card-front', 'card-middle']; 
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
        promoInterval = setInterval(rotatePromoCards, 4500); 
    }
}

function stopPromoCarousel() { 
    clearInterval(promoInterval); 
}

const promoCarouselContainer = document.getElementById('promoCarousel');
if (promoCarouselContainer) {
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

        submitBtn.innerHTML = "Securely Logging Order...";
        submitBtn.style.opacity = "0.7";

        // --- THE TEMPORARY TOKEN ---
        sessionStorage.setItem("cellflowPaymentSuccess", "true");

        // FIX: WAIT FOR GOOGLE SHEETS BEFORE OPENING RAZORPAY!
        fetch(webAppUrl, { method: 'POST', body: formData })
        .then(() => {
            submitBtn.innerHTML = "Opening Secure Checkout...";
            
            var options = {
                "key": "rzp_live_TSvZvBK9HMg5eU",
                "amount": parseFloat(productPrice) * 100,
                "currency": "INR",
                "name": "Cellflow",
                "description": "Order: " + productName,
                "image": "https://cellflow24.github.io/logo.png",
                "notes": { "ticketId": ticketId }, 
                
                // 1. FIX FOR "AUTHORIZED" PAYMENTS: Force Auto-Capture!
                "payment_capture": 1,
                
                // 2. FIX FOR 405 ERROR: Use the handler instead of callback_url
                "handler": function (response) {
                    // Destroy token so it doesn't replay later
                    sessionStorage.removeItem("cellflowPaymentSuccess");
                    
                    // Instantly show the success animation
                    document.getElementById('formContainer').style.display = 'none';
                    document.getElementById('successState').style.display = 'block';
                    
                    setTimeout(() => {
                        document.getElementById('successBlob').classList.add('active');
                        document.getElementById('successContent').classList.add('active');
                    }, 50);
                    
                    // Reset the form
                    document.getElementById('leadForm').reset();
                    document.getElementById('customDropdownSelected').textContent = "How can we help you?";
                    document.getElementById('customDropdownSelected').classList.remove('has-value');

                    var btn = document.getElementById('submitBtn');
                    if (btn) {
                        btn.innerHTML = "Place an Order";
                        btn.style.opacity = "1";
                    }
                },
                
                "prefill": { "name": name, "email": email },
                "theme": { "color": "#0056b3" },
                "modal": {
                    "ondismiss": function() {
                        // IF THEY CANCEL: Delete the token
                        sessionStorage.removeItem("cellflowPaymentSuccess");
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
        })
        .catch(error => {
            alert("Connection error. Please try again.");
            submitBtn.innerHTML = "Place an Order";
            submitBtn.style.opacity = "1";
            sessionStorage.removeItem("cellflowPaymentSuccess");
        });

    } else {
        // 2. Normal Support / Complaints / Custom Dev
        submitBtn.innerHTML = "Sending...";
        submitBtn.style.opacity = "0.7";
        
        var originalMessage = formData.get('message');
        formData.set('inquiryType', inquiryType);
        formData.set('message', originalMessage);
        formData.set('paymentStatus', 'Pending');
        formData.set('paymentAmount', '0');

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
        .catch(() => triggerSuccess()); 

        setTimeout(triggerSuccess, 2000);
    }
});

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
localStorage.removeItem('cellflowProducts'); 

// ⚠️ Change prices here
const availableProducts = [
    { name: "Mess Khata", originalPrice: 199, discountedPrice: 99 }, 
    { name: "Bill Flow", originalPrice: 8999, discountedPrice: 5999 },
    { name: "Mok Test APK", originalPrice: 2999, discountedPrice: 1499 }
];

function updateProductUI() {
    availableProducts.forEach(item => {
        let badge = document.getElementById('badge-' + item.name);
        if(badge) {
            badge.textContent = '₹' + item.discountedPrice;
        }
    });
}
updateProductUI();

// 2. Render Products Logic
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

        if (autoSelectName && item.name.toLowerCase() === autoSelectName.toLowerCase()) {
            div.click();
        }
    });
}

// 3. Direct Purchase Button Function
window.directPurchase = function(appName, event) {
    event.stopPropagation();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    customDropdownSelected.textContent = "Order Your App";
    customDropdownSelected.classList.add('has-value');
    inquiryTypeHidden.value = "Order Your App";
    
    messageBox.style.display = 'none';
    messageBox.removeAttribute('required');
    productContainer.style.display = 'block';
    submitBtn.innerHTML = 'Place an Order';
    
    renderProductCards(appName);
    
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
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    customDropdownSelected.textContent = "Need a Custom Website/App";
    customDropdownSelected.classList.add('has-value');
    inquiryTypeHidden.value = "Need a Custom Website/App";
    
    messageBox.style.display = 'block';
    messageBox.setAttribute('required', 'true');
    productContainer.style.display = 'none';
    submitBtn.innerHTML = 'Send Request';
    
    selectedProductInput.value = ''; 
    document.querySelectorAll('.checkout-item').forEach(el => el.classList.remove('selected'));
    
    setTimeout(() => {
        document.querySelector('input[name="name"]').focus();
    }, 600);
};

// --- TEMPORARY TOKEN CHECKER (Instant Success Animation) ---
window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (sessionStorage.getItem("cellflowPaymentSuccess") === "true" || urlParams.has('payment') || urlParams.has('razorpay_payment_id')) {
        sessionStorage.removeItem("cellflowPaymentSuccess");

        const contactSection = document.getElementById('contact');
        if(contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });

        const formContainer = document.getElementById('formContainer');
        const successState = document.getElementById('successState');
        
        if(formContainer && successState) {
            formContainer.style.display = 'none';
            successState.style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('successBlob').classList.add('active');
                document.getElementById('successContent').classList.add('active');
            }, 50);
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
