// Force browser to start at the top of the page on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
};

// Scroll Reveal Animations
function revealElements() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', revealElements);
revealElements();

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

// --- Mini 3D Stacked Carousel for "Trusted By" ---
const miniCards = document.querySelectorAll('.mini-card');
let miniClassArray = ['mini-front', 'mini-middle', 'mini-hidden']; //mini-back can be add
let miniInterval;

function rotateMiniCards() {
    const last = miniClassArray.pop();
    miniClassArray.unshift(last);
    miniCards.forEach((card, index) => {
        card.className = 'mini-card ' + miniClassArray[index];
    });
}

function startMiniCarousel() {
    if (miniCards.length > 0) {
        miniInterval = setInterval(rotateMiniCards, 3000); // Swipes every 3 seconds
    }
}

function stopMiniCarousel() { 
    clearInterval(miniInterval); 
}

const miniContainer = document.getElementById('trustedCarousel');
if (miniContainer) {
    // Pauses the swipe if they touch or hover over the badges
    miniContainer.addEventListener('mouseenter', stopMiniCarousel);
    miniContainer.addEventListener('mouseleave', startMiniCarousel);
    miniContainer.addEventListener('touchstart', stopMiniCarousel);
    miniContainer.addEventListener('touchend', startMiniCarousel);
    startMiniCarousel();
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

// --- Form Submission & Razorpay Integration (HYBRID MODAL + WEBHOOK) ---
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    var submitBtn = document.getElementById('submitBtn');
    var formData = new FormData(this);
    var inquiryType = document.getElementById('inquiryTypeHidden').value;
    var name = formData.get('name');
    var email = formData.get('email');
    
    // IMPORTANT: Make sure your actual Apps Script URL is here
    var webAppUrl = "https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec"; 

    // 1. App Orders (Native Popup with Pre-Logging)
    if (inquiryType === 'Order Your App') {
        var productName = document.getElementById('selectedProduct').value;
        var productPrice = document.getElementById('selectedProductPrice').value;

        if (!productName || !productPrice) {
            alert("Please select an application to order.");
            return;
        }

        // Generate Ticket ID in frontend so we can tie it to the Razorpay Payment
        var ticketId = "CF-" + Math.floor(100000 + Math.random() * 900000);

        formData.set('inquiryType', inquiryType);
        formData.set('message', productName);
        formData.set('paymentStatus', 'Pending');
        formData.set('paymentAmount', productPrice);
        formData.set('ticketId', ticketId);

        submitBtn.innerHTML = "Opening Secure Checkout...";
        submitBtn.style.opacity = "0.7";

        // Fire-and-forget: Log "Pending" order to Sheets immediately
        fetch(webAppUrl, { method: 'POST', body: formData }).catch(e => console.log(e));

        var options = {
            "key": "rzp_live_TSvZvBK9HMg5eU",
            "amount": parseFloat(productPrice) * 100,
            "currency": "INR",
            "name": "Cellflow",
            "description": "Order: " + productName,
            "image": "https://cellflow24.github.io/logo.png",
            "notes": { "ticketId": ticketId }, // Crucial: This tells the Webhook which order was paid!
            "handler": function (response) {
                // The user stayed in the browser! Show the awesome animation.
                document.getElementById('formContainer').style.display = 'none';
                document.getElementById('successState').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('successBlob').classList.add('active');
                    document.getElementById('successContent').classList.add('active');
                }, 50);
                document.getElementById('leadForm').reset();
                document.getElementById('customDropdownSelected').textContent = "How can we help you?";
                document.getElementById('customDropdownSelected').classList.remove('has-value');

                submitBtn.innerHTML = "Place an Order";
                submitBtn.style.opacity = "1";
            },
            "prefill": { "name": name, "email": email },
            "theme": { "color": "#0056b3" },
            "modal": {
                "ondismiss": function() {
                    submitBtn.innerHTML = "Place an Order";
                    submitBtn.style.opacity = "1";
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

        fetch(webAppUrl, { method: 'POST', body: formData })
        .then(response => response.text())
        .then(text => {
            var data = JSON.parse(text);
            if(data.status === "success") {
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
        })
        .catch(error => {
            submitBtn.innerHTML = "Error! Try Again";
            submitBtn.style.backgroundColor = "red";
        });
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

// 1. Background Loading Engine
let availableProducts = [];
let isProductsLoading = true;
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec"; // <-- PASTE YOUR ACTUAL APPS SCRIPT URL HERE

// Fetch silently as soon as the page loads
fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(data => {
        availableProducts = data;
        isProductsLoading = false;
        
        // INSTANT UI UPGRADE: Inject live prices into the homepage buttons!
        data.forEach(item => {
            let badge = document.getElementById('badge-' + item.name);
            if(badge) {
                badge.textContent = '₹' + item.discountedPrice;
            }
        });

        // If the user already opened the product container, render it instantly
        if (productContainer.style.display === 'block') {
            renderProductCards();
        }
    });

// 2. Render Products Logic
function renderProductCards(autoSelectName = null) {
    if (isProductsLoading) {
        productList.innerHTML = `
            <div class="loader-container">
                <span class="loader-text">Loading Details</span>
                <div class="jumping-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
            </div>`;
        return;
    }
    
    productList.innerHTML = '';
    availableProducts.forEach(item => {
        let div = document.createElement('div');
        div.className = 'checkout-item'; // Updated class name to prevent conflicts
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

        // Instantly trigger a click on this item if directed from the purchase button
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

// 6. Marketing Story Carousel Engine
let currentStorySlide = 0;
const storySlides = document.querySelectorAll('.story-slide');
const storyIndicators = document.querySelectorAll('.indicator');
let storyIntervalTimer;

function showStorySlide(index) {
    if(storySlides.length === 0) return;
    storySlides.forEach(s => s.classList.remove('active'));
    storyIndicators.forEach(i => i.classList.remove('active'));
    
    storySlides[index].classList.add('active');
    storyIndicators[index].classList.add('active');
    currentStorySlide = index;
}

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
