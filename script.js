// =========================================================
// 1. MOMENTO-STYLE HERO LOGO SCROLL-TO-ZOOM & MOVE
// =========================================================
const heroLogoWrapper = document.getElementById('hero-logo-wrapper');
if (heroLogoWrapper) {
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        // Only calculate if near the top to save performance
        if (scrollY < 800) {
            let opacityValue = 1 - (scrollY * 0.002); // Fades it out
            if (opacityValue < 0) opacityValue = 0;

            if (window.innerWidth > 850) {
                // DESKTOP: Zoom in and move right
                let scaleValue = 1 + (scrollY * 0.005); 
                let moveX = scrollY * 0.8; 
                heroLogoWrapper.style.transform = `translateX(${moveX}px) scale(${scaleValue})`;
            } else {
                // MOBILE: Scale down and move down
                let scaleValue = 1 - (scrollY * 0.0015); 
                if (scaleValue < 0.5) scaleValue = 0.5; // Stops it from getting too tiny
                let moveY = scrollY * 0.4; // Moves down smoothly
                heroLogoWrapper.style.transform = `translateY(${moveY}px) scale(${scaleValue})`;
            }
            
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
// 5. SMART 3D CAROUSEL, TAP CONTROL & TILT (MULTIPLE PHONES)
// =========================================================
function setupShowcasePhone(carouselId, bezelId) {
    const carouselContainer = document.getElementById(carouselId);
    const phoneBezel = document.getElementById(bezelId);
    if (!carouselContainer || !phoneBezel) return;

    const cards = carouselContainer.querySelectorAll('.mk-feature-card');
    let classArray = ['mk-front', 'mk-middle', 'mk-back', 'mk-hidden'];

    // --- Smooth Phone Tilt Animation ---
    phoneBezel.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease";
    phoneBezel.style.willChange = "transform"; 
    
    let isTicking = false;
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const rect = phoneBezel.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
                    const intensity = window.innerWidth > 850 ? 8 : 6; 
                    const tiltX = Math.cos(scrollProgress * Math.PI) * intensity; 
                    const tiltY = Math.sin(scrollProgress * Math.PI) * -intensity;
                    
                    phoneBezel.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
                }
                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });

    // --- Core Rotation Logic ---
    function rotateCards() {
        if (cards.length === 0) return;
        
        const last = classArray.pop();
        classArray.unshift(last);
        
        cards.forEach((c, index) => {
            c.className = 'mk-feature-card ' + classArray[index];
            
            // Swap the screen inside THIS specific phone only
            if (classArray[index] === 'mk-front') {
                const targetScreenId = c.getAttribute('data-screen');
                const targetScreen = document.getElementById(targetScreenId);
                
                if (targetScreen) {
                    const parentContainer = targetScreen.parentElement;
                    parentContainer.querySelectorAll('.css-replica-screen').forEach(screen => {
                        screen.classList.remove('active');
                    });
                    targetScreen.classList.add('active');
                }
            }
        });
    }

    // --- 1. Tap to Rotate ---
    cards.forEach(card => {
        card.addEventListener('click', rotateCards);
    });

    // --- 2. Smart Mobile Swipe (Ignores Vertical Scrolling) ---
    let touchStartX = 0;
    let touchStartY = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, {passive: true});

    carouselContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);

        // Only rotate if the user swiped horizontally, NOT if they were scrolling down
        if (deltaX > 40 && deltaX > deltaY) {
            rotateCards();
        }
    }, {passive: true});
}

// --- 1. Fallback just in case the Mess Khata phone doesn't have an ID in the HTML ---
if (!document.getElementById('mk-phone-bezel')) {
    const mkBezel = document.querySelector('.mk-phone-bezel');
    if (mkBezel) mkBezel.id = 'mk-phone-bezel';
}

// --- 2. Initialize all three showcase sections independently ---
setupShowcasePhone('mkTextCarousel', 'mk-phone-bezel'); // Mess Khata
setupShowcasePhone('mtTextCarousel', 'mt-phone-bezel'); // Moktest
setupShowcasePhone('bfTextCarousel', 'bf-phone-bezel'); // BillFlow

// =========================================================
// 6. UTILITIES (Modals, CTA)
// =========================================================
const floatingMenuContainer = document.getElementById('floatingMenuContainer');

if (floatingMenuContainer) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            floatingMenuContainer.classList.add('visible');
        } else {
            floatingMenuContainer.classList.remove('visible');
            document.getElementById('floatingOptions').classList.remove('open');
            floatingMenuContainer.classList.remove('menu-open');
            document.getElementById('dropIcon').innerText = '👋';
        }
    });
}

function toggleFloatingMenu() {
    const options = document.getElementById('floatingOptions');
    const icon = document.getElementById('dropIcon');
    
    options.classList.toggle('open');
    floatingMenuContainer.classList.toggle('menu-open');
    
    if (options.classList.contains('open')) {
        icon.innerText = '✖';
    } else {
        icon.innerText = '👋';
    }
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

// =========================================================
// 5. SMART 3D CAROUSEL, TAP CONTROL & TILT (MULTIPLE PHONES)
// =========================================================
function setupShowcasePhone(carouselId, bezelId) {
    const carouselContainer = document.getElementById(carouselId);
    const phoneBezel = document.getElementById(bezelId);
    if (!carouselContainer || !phoneBezel) return;

    const cards = carouselContainer.querySelectorAll('.mk-feature-card');
    let classArray = ['mk-front', 'mk-middle', 'mk-back', 'mk-hidden'];

    // --- Smooth Phone Tilt Animation ---
    phoneBezel.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease";
    phoneBezel.style.willChange = "transform"; 
    
    let isTicking = false;
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const rect = phoneBezel.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
                    const intensity = window.innerWidth > 850 ? 8 : 6; 
                    const tiltX = Math.cos(scrollProgress * Math.PI) * intensity; 
                    const tiltY = Math.sin(scrollProgress * Math.PI) * -intensity;
                    
                    phoneBezel.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
                }
                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });

    // --- Tap to Rotate ---
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (cards.length === 0) return;
            
            const last = classArray.pop();
            classArray.unshift(last);
            
            cards.forEach((c, index) => {
                c.className = 'mk-feature-card ' + classArray[index];
                
                // Swap the screen inside THIS specific phone only
                if (classArray[index] === 'mk-front') {
                    const targetScreenId = c.getAttribute('data-screen');
                    const targetScreen = document.getElementById(targetScreenId);
                    
                    if (targetScreen) {
                        const parentContainer = targetScreen.parentElement;
                        parentContainer.querySelectorAll('.css-replica-screen').forEach(screen => {
                            screen.classList.remove('active');
                        });
                        targetScreen.classList.add('active');
                    }
                }
            });
        });
    });
}

// =========================================================
// PUJOPATH SEASONAL CALENDAR ENGINE
// =========================================================
function checkPujoPathSeason() {
    const today = new Date();
    const year = today.getFullYear();
    
    // Exact dates for Mahalaya to Lakshmi Puja (YYYY-MM-DD format)
    const pujoDates = {
        2026: { start: '2026-10-09', end: '2026-10-25' },
        2027: { start: '2027-09-29', end: '2027-10-15' },
        2028: { start: '2028-09-18', end: '2028-10-04' },
        2029: { start: '2029-10-07', end: '2029-10-23' },
        2030: { start: '2030-09-27', end: '2030-10-12' }
    };

    const currentSeason = pujoDates[year];
    
    if (currentSeason) {
        // Set the time to midnight for accurate day comparison
        const startDate = new Date(currentSeason.start + 'T00:00:00');
        const endDate = new Date(currentSeason.end + 'T23:59:59'); 

        // If today falls within the active festival window, unhide the elements
        if (today >= startDate && today <= endDate) {
            const banner = document.getElementById('pujopath-banner');
            const floatBtn = document.getElementById('pujopath-float');
            
            if (banner) banner.style.display = 'block';
            if (floatBtn) floatBtn.style.display = 'flex'; // Uses flex to match your other float options
        }
    }
}

// Run the check as soon as the page loads
document.addEventListener('DOMContentLoaded', checkPujoPathSeason);

// =========================================================
// 8. BACK BUTTON INTERCEPTOR (BULLETPROOF LEAVE INTENT)
// =========================================================
let isTrapArmed = false;
let letUserLeave = false;

// Arm the history trap on the FIRST tap or click anywhere on the site
['click', 'touchstart'].forEach(eventType => {
    document.body.addEventListener(eventType, () => {
        if (!isTrapArmed) {
            history.pushState({ cellflowApp: true }, '');
            isTrapArmed = true;
        }
    }, { once: true, passive: true });
});

// Trigger the modal when the browser back button/swipe is detected
window.addEventListener('popstate', (event) => {
    // If they clicked "Yes, leave", allow the back action to happen normally
    if (letUserLeave) return;
    
    // Instantly re-arm the trap so they can't double-swipe out
    history.pushState({ cellflowApp: true }, '');
    
    // Show the modal
    document.getElementById('leaveModal').classList.add('active');
});

function handleStay() {
    // Hide the modal. The trap is already re-armed from the popstate event above!
    document.getElementById('leaveModal').classList.remove('active');
}

function handleLeave() {
    // Open the gate so the next "back" action actually works
    letUserLeave = true;
    
    // Swap the content to the sad emoji
    document.getElementById('leaveModalContent').style.display = 'none';
    document.getElementById('leaveModalSad').classList.remove('hidden');
    
    // Wait 1.2 seconds for the animation to play, then trigger the real exit
    setTimeout(() => {
        history.back(); 
    }, 1200);
}
