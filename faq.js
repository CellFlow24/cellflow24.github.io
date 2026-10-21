document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // THE 50 FAQ DATA REPOSITORY
    // =========================================
    const faqData = [
        {
            category: "General & Accounts",
            icon: "⚙️",
            questions: [
                { q: "What is CellFlow?", a: "CellFlow is a suite of high-performance web applications and Progressive Web Apps (PWAs) designed to simplify business management without heavy software." },
                { q: "Is CellFlow completely free?", a: "We offer free community apps (like Dipsum and PujoPath) for fun, alongside premium business tools (like Bill Flow) available for a one-time purchase." },
                { q: "How do I create an account?", a: "Once you purchase an app or request a custom build, our team will securely email you your dedicated User ID and Password." },
                { q: "Is my business data secure?", a: "Yes. We use Google Cloud Infrastructure. Your data is isolated, encrypted, and directly linked to secure cloud databases that only you or assigned admins can access." },
                { q: "Can I use the apps on my PC?", a: "Absolutely. All CellFlow apps are PWAs, meaning they work perfectly on Windows, Mac, iOS, and Android web browsers." },
                { q: "Do I need an internet connection?", a: "Yes. Because our apps sync data in real-time across all your devices, an active internet connection is required." },
                { q: "How do I reset my password?", a: "Business owners/admins can reset passwords from the Admin Dashboard. Standard users should contact their admin or reach out to CellFlow support." },
                { q: "Are there monthly subscription fees?", a: "No! Our standard apps like Mess Khata and Bill Flow are sold as a one-time purchase. Custom web builds may have annual hosting fees depending on scale." },
                { q: "How do I download the app to my phone?", a: "Open the app link provided in your email using Chrome or Safari, tap the browser menu, and select 'Add to Home Screen'." },
                { q: "How do I get software updates?", a: "Since our apps are cloud-based PWAs, updates are pushed automatically. You will always be on the latest version upon refreshing." }
            ]
        },
        {
            category: "Mess Khata (PG Management)",
            icon: "🏠",
            questions: [
                { q: "How do I add a new roommate?", a: "Only users with Admin access can add new members from the 'Manage Users' panel inside the app." },
                { q: "How does the split calculation work?", a: "When you log an expense, you select which members to split it with. The app automatically divides the cost and updates everyone's personal balance sheet in real-time." },
                { q: "Can I edit an expense after saving?", a: "Yes, you can edit or delete an expense from the 'Expense Review' tab. Changes will instantly recalculate balances." },
                { q: "How do I clear my dues?", a: "Select 'Pay Details', enter the amount you paid to the manager or roommate, and submit. It will reflect as 'Cleared' once approved." },
                { q: "Who can delete members?", a: "Only the designated PG Owner or Admin can delete members from the workspace." },
                { q: "Does the live chat save history?", a: "Yes, the chat history is saved securely so roommates can refer back to discussions about groceries, bills, or cleaning." },
                { q: "How do I assign chores?", a: "Use the 'Cooking & Cleaning' tab to create a schedule and assign specific days/tasks to roommates." },
                { q: "Can I export the monthly data?", a: "Yes! Admins can export the full month's ledger as a PDF or CSV file for their records." },
                { q: "What happens if someone leaves the PG?", a: "The admin can deactivate their account. Their past expense data remains intact for accounting, but they lose app access." },
                { q: "Can I use Mess Khata for a family budget?", a: "Yes! While designed for PGs, many users use it to perfectly track and split household or trip expenses." }
            ]
        },
        {
            category: "Bill Flow (Invoicing)",
            icon: "💸",
            questions: [
                { q: "How do I add inventory items?", a: "Go to the Admin Dashboard and access your inventory sheet. You can add items, prices, and stock levels there." },
                { q: "Does it support GST calculations?", a: "Yes, you can configure your custom GST brackets (e.g., 5%, 12%, 18%) which will auto-apply during checkout." },
                { q: "How do I share the invoice?", a: "Once generated, you can click 'Download PDF' and instantly share the crisp A4 invoice via WhatsApp or Email." },
                { q: "How can I track pending dues?", a: "The 'Due Bills Tracker' automatically logs any partially paid invoices and flags the customer names in red until cleared." },
                { q: "Can I add my company logo?", a: "Yes, your company logo, address, and bank details are hardcoded into your specific app during the setup phase." },
                { q: "How do I mark a bill as fully paid?", a: "Find the invoice in the Due Tracker and click 'Clear Due'. The system will update the status to PAID." },
                { q: "Is there a daily billing limit?", a: "No, you can generate unlimited invoices. Your data storage easily handles thousands of records." },
                { q: "Does it support thermal printers?", a: "Yes, Bill Flow PDFs are optimized. You can print them on standard A4 printers or 3-inch thermal POS printers." },
                { q: "Can I edit a saved bill?", a: "To maintain accounting integrity, saved bills cannot be directly edited. You must cancel the invoice and generate a new one." },
                { q: "How do I apply a discount?", a: "During the 3-tap checkout, you can input a flat discount amount before hitting 'Generate'." }
            ]
        },
        {
            category: "Moktest (CBT Platform)",
            icon: "📝",
            questions: [
                { q: "How do I upload questions?", a: "You will be provided a master Google Sheet. Simply paste your questions, options, and correct answers into the columns." },
                { q: "How does negative marking work?", a: "The system automatically deducts marks for wrong answers based on your configuration (e.g., -0.25 or -0.5 per wrong answer)." },
                { q: "Can students pause the timer?", a: "No. To simulate a real Computer Based Test (CBT), the timer runs continuously on the server until the exam ends." },
                { q: "How do I view the PDF reports?", a: "As soon as a student submits, a branded PDF scorecard is generated instantly and saved to their dashboard." },
                { q: "Can I change the exam duration?", a: "Yes, Admins can adjust the time limits for specific sets directly from the backend dashboard." },
                { q: "What is Flexible vs. Strict mode?", a: "Strict mode locks sections into specific time blocks (e.g., 18 mins per 20 questions). Flexible mode allows students to navigate all 100 questions freely." },
                { q: "How many students can take a test at once?", a: "The platform is built on Google Cloud and easily scales to support hundreds of concurrent test-takers." },
                { q: "Can students review their answers?", a: "Yes, after submission, the PDF report highlights their selected answers against the correct ones." },
                { q: "Is there an anti-cheat feature?", a: "The app features full-screen enforcement. If a student minimizes the browser or switches tabs, the exam auto-submits." },
                { q: "Can I add my institute's logo?", a: "Absolutely! The student dashboard and the PDF scorecards will feature your coaching center's logo and branding." }
            ]
        },
        {
            category: "Custom Builds & Orders",
            icon: "🛠️",
            questions: [
                { q: "How do I order a custom app?", a: "Select 'Custom Build' from the website menu, fill out your requirements, and our team will provide a tailored quotation." },
                { q: "What is the typical delivery time?", a: "Standard apps (Mess Khata, Bill Flow) are delivered within 24-48 hours. Custom builds take 1 to 3 weeks depending on complexity." },
                { q: "Do you provide hosting?", a: "Yes, we handle all the hosting via premium, secure cloud servers. Standard apps have zero recurring hosting fees." },
                { q: "Is the online payment secure?", a: "Yes, all our payments are processed through Razorpay, India's leading secure payment gateway." },
                { q: "What if I need changes after delivery?", a: "We offer a 7-day free revision window for minor UI tweaks. Major feature additions will be quoted separately." },
                { q: "Do I own the source code?", a: "You own full rights to use the application and your data. Proprietary backend algorithms remain the intellectual property of CellFlow." },
                { q: "Is maintenance included?", a: "Standard products require zero maintenance. Custom builds come with 3 months of free technical support." },
                { q: "Can you integrate Razorpay for my business?", a: "Yes! We can build custom E-commerce or booking platforms with direct-to-bank Razorpay integrations for you." },
                { q: "Do you build E-commerce websites?", a: "Yes, we build end-to-end custom branded e-commerce platforms with automated order tracking and zero-commission gateways." },
                { q: "How do I contact technical support?", a: "You can reach us directly via the WhatsApp button on the website, or email us at cellflow24@gmail.com." }
            ]
        }
    ];

    // =========================================
    // CHAT ENGINE LOGIC
    // =========================================
    const chatBox = document.getElementById('chat-box');
    const chatOptionsContainer = document.getElementById('chat-options-container');

    // Helper: Add a message to the chat
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg', sender === 'bot' ? 'msg-bot' : 'msg-user');
        msgDiv.innerHTML = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
    }

    // Helper: Clear options area
    function clearOptions() {
        chatOptionsContainer.innerHTML = '';
    }

    // Step 1: Initialize Chat
    function initChat() {
        appendMessage("Hi there! 👋 I'm the CellFlow Assistant. What do you need help with today?", 'bot');
        setTimeout(showCategories, 600);
    }

    // Step 2: Show the 5 Categories
    function showCategories() {
        clearOptions();
        faqData.forEach((cat, index) => {
            const btn = document.createElement('button');
            btn.classList.add('chat-option-btn');
            btn.innerHTML = `${cat.icon} ${cat.category}`;
            btn.onclick = () => handleCategorySelection(index);
            chatOptionsContainer.appendChild(btn);
        });
    }

    // Step 3: Handle Category Click
    function handleCategorySelection(index) {
        clearOptions();
        const cat = faqData[index];
        appendMessage(`${cat.icon} ${cat.category}`, 'user');
        
        setTimeout(() => {
            appendMessage(`Here are the most common questions about <strong>${cat.category}</strong>. Tap one to see the answer!`, 'bot');
            setTimeout(() => showQuestions(index), 400);
        }, 500);
    }

    // Step 4: Show the 10 Questions for the selected category
    function showQuestions(catIndex) {
        clearOptions();
        
        faqData[catIndex].questions.forEach((item, qIndex) => {
            const btn = document.createElement('button');
            btn.classList.add('chat-option-btn');
            btn.innerText = item.q;
            btn.onclick = () => handleQuestionSelection(catIndex, qIndex);
            chatOptionsContainer.appendChild(btn);
        });

        // Add a Back Button
        const backBtn = document.createElement('button');
        backBtn.classList.add('chat-option-btn', 'chat-back-btn');
        backBtn.innerText = "🔙 Back to Categories";
        backBtn.onclick = () => {
            clearOptions();
            appendMessage("Show me other categories.", 'user');
            setTimeout(showCategories, 500);
        };
        chatOptionsContainer.appendChild(backBtn);
    }

    // Step 5: Handle Question Click and Show Answer
    function handleQuestionSelection(catIndex, qIndex) {
        clearOptions();
        const qa = faqData[catIndex].questions[qIndex];
        
        appendMessage(qa.q, 'user');

        setTimeout(() => {
            appendMessage(qa.a, 'bot');
            
            setTimeout(() => {
                // Show follow up options
                const backCatBtn = document.createElement('button');
                backCatBtn.classList.add('chat-option-btn');
                backCatBtn.innerText = "Ask another question in this category";
                backCatBtn.onclick = () => showQuestions(catIndex);

                const mainCatBtn = document.createElement('button');
                mainCatBtn.classList.add('chat-option-btn', 'chat-back-btn');
                mainCatBtn.innerText = "🔙 Main Menu";
                mainCatBtn.onclick = () => {
                    clearOptions();
                    appendMessage("Back to main menu please.", 'user');
                    setTimeout(showCategories, 500);
                };

                chatOptionsContainer.appendChild(backCatBtn);
                chatOptionsContainer.appendChild(mainCatBtn);
            }, 600);
        }, 600);
    }

    // Start the chat on load
    initChat();

    // =========================================
    // TOTAL FAQ BOOK MODAL LOGIC
    // =========================================
    const openBookBtn = document.getElementById('open-book-btn');
    const closeBookBtn = document.getElementById('close-book-btn');
    const faqModal = document.getElementById('faq-book-modal');
    const accordionContainer = document.getElementById('faq-accordion-container');

    // Populate the Book Modal automatically from the faqData array
    function populateFaqBook() {
        faqData.forEach(cat => {
            const title = document.createElement('div');
            title.classList.add('faq-category-title');
            title.innerHTML = `${cat.icon} ${cat.category}`;
            accordionContainer.appendChild(title);

            cat.questions.forEach(item => {
                const qaBox = document.createElement('div');
                qaBox.classList.add('faq-item');
                qaBox.innerHTML = `
                    <p class="faq-q">${item.q}</p>
                    <p class="faq-a">${item.a}</p>
                `;
                accordionContainer.appendChild(qaBox);
            });
        });
    }
    
    populateFaqBook();

    openBookBtn.addEventListener('click', () => {
        faqModal.classList.add('open');
    });

    closeBookBtn.addEventListener('click', () => {
        faqModal.classList.remove('open');
    });

    // Close modal if clicking outside the white box
    faqModal.addEventListener('click', (e) => {
        if (e.target === faqModal) {
            faqModal.classList.remove('open');
        }
    });

});
