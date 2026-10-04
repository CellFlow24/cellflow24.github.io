// Force browser to start at the top of the page on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
};

// =========================================================
// 1. MOMENTO-STYLE HERO LOGO SCROLL-TO-ZOOM
// =========================================================
const heroLogoWrapper = document.getElementById('hero-logo-wrapper');
if (heroLogoWrapper) {
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        // Only calculate if near the top to save performance
        if (scrollY < 800) {
            let scaleValue = 1 + (scrollY * 0.003);
            let opacityValue = 1 - (scrollY * 0.002);
            
            if (opacityValue < 0) opacityValue = 0;

            heroLogoWrapper.style.transform = `scale(${scaleValue})`;
            heroLogoWrapper.style.opacity = opacityValue;
        }
    });
}

// =========================================================
// 2. SCROLL REVEAL ANIMATIONS
// =========================================================
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

// =========================================================
// 3. TOPTAL-STYLE STACKED CAROUSEL
// =========================================================
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

// =========================================================
// 4. E-COMMERCE PROMO 3D CAROUSEL
// =========================================================
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

// =========================================================
// 5. MESS KHATA: SYNCED SCREENS (HORIZONTAL SWIPE SUPPORT)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const textCards = document.querySelectorAll('.mk-feature-card');
    const cssScreens = document.querySelectorAll('.css-replica-screen');

    if (textCards.length > 0 && cssScreens.length > 0) {
        const scrollyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1. Outline the active card in blue
                    textCards.forEach(card => card.classList.remove('active-card'));
                    entry.target.classList.add('active-card');

                    // 2. Find the target screen ID
                    const targetScreenId = entry.target.getAttribute('data-screen');

                    // 3. Fade in the correct CSS screen inside the phone
                    cssScreens.forEach(screen => {
                        if (screen.id === targetScreenId) {
                            screen.classList.add('active');
                        } else {
                            screen.classList.remove('active');
                        }
                    });
                }
            });
        }, { 
            root: null, 
            threshold: 0.6 // 60% of the card must be visible to trigger (perfect for mobile swiping)
        });

        textCards.forEach(card => scrollyObserver.observe(card));
    }
});

// =========================================================
// 6. UTILITIES (Modals, CTA)
// =========================================================
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

// =========================================================
// 7. FORM SUBMISSION & RAZORPAY INTEGRATION
// =========================================================
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    var submitBtn = document.getElementById('submitBtn');
    var formData = new FormData(this);
    var inquiryType = document.getElementById('inquiryTypeHidden').value;
    var name = formData.get('name');
    var email = formData.get('email');
    
    var webAppUrl = "https://script.google.com/macros/s/AKfycbzWinkvpaQNr25tKjePWeubGhEAV-ApWWJ_ELZcv7UJRr9xSxB4DRDehRnv6S4PZMIXKg/exec"; 

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

        sessionStorage.setItem("cellflowPaymentSuccess", "true");

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
                "payment_capture": 1,
                "handler": function (response) {
                    sessionStorage.removeItem("cellflowPaymentSuccess");
                    
                    document.getElementById('formContainer').style.display = 'none';
                    document.getElementById('successState').style.display = 'block';
                    
                    setTimeout(() => {
                        document.getElementById('successBlob').classList.add('active');
                        document.getElementById('successContent').classList.add('active');
                    }, 50);
                    
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

// =========================================================
// 8. DROPDOWN & DYNAMIC PRODUCT SELECTION
// =========================================================
const customDropdownSelected = document.getElementById('customDropdownSelected');
const customDropdownOptions = document.getElementById('customDropdownOptions');
const inquiryTypeHidden = document.getElementById('inquiryTypeHidden');
const customOptions = document.querySelectorAll('.custom-option');
const messageBox = document.getElementById('messageBox');
const productContainer = document.getElementById('productContainer');
const submitBtn = document.getElementById('submitBtn');
const productList = document.getElementById('productList');
const selectedProductInput = document.getElementById('selectedProduct');

localStorage.removeItem('cellflowProducts'); 

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

// =========================================================
// 9. INSTANT SUCCESS ANIMATION RECOVERY
// =========================================================
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
