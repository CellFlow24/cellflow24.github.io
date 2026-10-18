// =====================================================================
// CELLFLOW SANDBOX DEMO SCRIPT - BILLFLOW (Fully Functional UI)
// =====================================================================

const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loadingOverlay = document.getElementById('loadingOverlay');

let currentUserId = "DEMO-USER";
let currentUserName = "Demo User";
let inventoryItems = [
    { id: "ITM-1", name: "Premium Web Setup", gst: "18", price: 5083.90, finalPrice: 5999 },
    { id: "ITM-2", name: "Cloud Hosting 1Y", gst: "18", price: 1693.22, finalPrice: 1998 },
    { id: "ITM-3", name: "Basic Support", gst: "0", price: 499, finalPrice: 499 }
];
let allBills = [
    { id: "INV-0012", name: "Rahul Sharma", date: new Date().toISOString(), phone: "9876543210", location: "Kolkata", subTotal: 6000, discount: 0, payable: 6000, paid: 4500, due: 1500, method: "CASH", cart: [{name: "Premium Web Setup", qty: 1, price: 5999, gstAmount: 915.10, itemTotal: 5999}] }
];

const toastContainer = document.getElementById('toastContainer');
function showToast(message, type = 'success') {
    toastContainer.innerText = message;
    toastContainer.className = `toast-container toast-${type}`;
    setTimeout(() => toastContainer.classList.add('show'), 10);
    setTimeout(() => toastContainer.classList.remove('show'), 3000);
}

function showLoader() { loadingOverlay.classList.remove('hidden'); }
function hideLoader() { loadingOverlay.classList.add('hidden'); }
function showScreen(screenEl) { 
    document.querySelectorAll('.screen-container').forEach(s => s.classList.add('hidden')); 
    screenEl.classList.remove('hidden'); 
}

// --- MENU LOGIC (This fixes the 3-dot button!) ---
window.toggleMenu = function() {
    document.getElementById('sideMenu').classList.toggle('open');
    document.getElementById('menuOverlay').classList.toggle('hidden');
}

window.switchTab = function(screenId) {
    const screens = ['dashboardScreen', 'itemScreen', 'billingScreen', 'dueScreen', 'historyScreen', 'printPreviewScreen'];
    screens.forEach(id => document.getElementById(id).classList.add('hidden'));
    
    document.getElementById(screenId).classList.remove('hidden');
    
    if (screenId === 'billingScreen') {
        document.getElementById('billId').value = 'INV-' + Date.now().toString().slice(-6); 
        document.getElementById('billDate').value = new Date().toLocaleString('en-IN');
        calculateBill();
    }
    window.scrollTo(0, 0);
}

// --- MOCK LOGIN ---
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Grab what the user typed
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();

    // Check if they left it empty
    if (!userId || !password) {
        showToast("In this dummy, you can put anything in User Name and Password!", "error");
        return; 
    }

    currentUserName = userId;

    showLoader();
    setTimeout(() => {
        hideLoader();
        document.getElementById('welcomeMessage').innerText = `Hello, ${currentUserName}!`;
        document.getElementById('topAppBar').classList.remove('hidden');
        document.getElementById('menuUserName').innerText = `Logged in as: ${currentUserName}`;
        showScreen(dashboardScreen);
        loadDashboardStats(); loadItems(); loadBills();
    }, 800);
});

function loadDashboardStats() {
    document.getElementById('statTodayAmount').innerText = "12450.00";
    document.getElementById('statTodayCount').innerText = "15";
    document.getElementById('statTotalCount').innerText = "156";
    document.getElementById('statTodayDue').innerText = "2450.00";
}

// --- ITEM MANAGEMENT ---
const itemListView = document.getElementById('itemListView');
async function loadItems() { renderItemList(inventoryItems); }

function renderItemList(itemsToRender) {
    itemListView.innerHTML = ''; 
    if (itemsToRender.length === 0) {
        itemListView.innerHTML = '<p style="text-align:center; color: #64748B;">No items found.</p>';
        return;
    }
    itemsToRender.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #E2E8F0;';
        itemDiv.innerHTML = `
            <div>
                <strong style="color: var(--navy-blue); display: block;">${item.name}</strong>
                <span style="font-size: 0.8rem; color: var(--text-light);">ID: ${item.id} | GST: ${item.gst}%</span>
            </div>
            <div style="text-align: right;"><strong style="color: var(--trust-green);">₹${item.finalPrice}</strong></div>
        `;
        itemListView.appendChild(itemDiv);
    });
}

document.getElementById('addItemForm').addEventListener('submit', (e) => {
    e.preventDefault(); showLoader();
    setTimeout(() => {
        hideLoader();
        const itemName = document.getElementById('itemName').value;
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const itemGst = parseFloat(document.getElementById('itemGst').value);
        const finalPrice = itemPrice + (itemPrice * (itemGst/100));
        inventoryItems.push({ id: `ITM-${inventoryItems.length+1}`, name: itemName, gst: itemGst, price: itemPrice, finalPrice: Math.round(finalPrice) });
        document.getElementById('addItemForm').reset();
        showToast("Sandbox item added!", "success");
        loadItems();
    }, 600);
});

document.getElementById('searchItem').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderItemList(inventoryItems.filter(i => i.name.toLowerCase().includes(searchTerm) || i.id.toLowerCase().includes(searchTerm)));
});

// --- BILLING ENGINE (CART & MATH) ---
let currentCart = [];
const billSearchItem = document.getElementById('billSearchItem');
const billItemDropdown = document.getElementById('billItemDropdown');
const cartBody = document.getElementById('cartBody');
const billDiscount = document.getElementById('billDiscount');
const billPaid = document.getElementById('billPaid');

billSearchItem.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    billItemDropdown.innerHTML = '';
    if (searchTerm.length === 0) { billItemDropdown.classList.add('hidden'); return; }

    const filtered = inventoryItems.filter(item => item.name.toLowerCase().includes(searchTerm));
    if (filtered.length > 0) {
        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.innerHTML = `<span><strong style="color: var(--navy-blue);">${item.name}</strong></span><span>₹${item.finalPrice}</span>`;
            div.onclick = () => { addItemToCart(item); billSearchItem.value = ''; billItemDropdown.classList.add('hidden'); };
            billItemDropdown.appendChild(div);
        });
        billItemDropdown.classList.remove('hidden');
    } else {
        billItemDropdown.classList.add('hidden');
    }
});

function addItemToCart(item) {
    const existing = currentCart.find(i => i.id === item.id);
    if (existing) existing.qty += 1;
    else currentCart.push({ ...item, qty: 1 });
    renderCart(); calculateBill();
}

window.updateCartQty = function(index, newQty) {
    if (newQty > 0) { currentCart[index].qty = parseInt(newQty); renderCart(); calculateBill(); }
}

window.removeFromCart = function(index) {
    currentCart.splice(index, 1); renderCart(); calculateBill();
}

function renderCart() {
    cartBody.innerHTML = '';
    if (currentCart.length === 0) { cartBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No items.</td></tr>'; return; }
    currentCart.forEach((item, index) => {
        cartBody.innerHTML += `
            <tr>
                <td><strong>${item.name}</strong><br><small>₹${item.finalPrice}</small></td>
                <td><input type="number" value="${item.qty}" min="1" style="width:50px; padding:4px;" onchange="updateCartQty(${index}, this.value)"></td>
                <td>₹${(item.finalPrice * item.qty).toFixed(2)}</td>
                <td><button type="button" class="delete-btn" onclick="removeFromCart(${index})">×</button></td>
            </tr>
        `;
    });
}

function calculateBill() {
    let subTotal = 0; let totalGst = 0;
    currentCart.forEach(item => {
        const itemBaseTotal = item.price * item.qty;
        const itemGstTotal = itemBaseTotal * (item.gst / 100);
        subTotal += (itemBaseTotal + itemGstTotal);
        totalGst += itemGstTotal;
    });
    let payable = Math.max(0, subTotal - (parseFloat(billDiscount.value) || 0));
    let due = payable - (parseFloat(billPaid.value) || 0);
    
    document.getElementById('summarySubTotal').innerText = `₹${subTotal.toFixed(2)}`;
    document.getElementById('summaryGst').innerText = `₹${totalGst.toFixed(2)}`;
    document.getElementById('summaryPayable').innerText = `₹${payable.toFixed(2)}`;
    document.getElementById('billDue').value = due.toFixed(2);
    document.getElementById('billDue').style.color = due > 0 ? "var(--error-red)" : "var(--trust-green)";
}

billDiscount.addEventListener('input', calculateBill);
billPaid.addEventListener('input', calculateBill);

document.getElementById('saveBillBtn').addEventListener('click', () => {
    if(currentCart.length === 0) return showToast("Cart empty!", "error");
    showLoader();
    setTimeout(() => {
        hideLoader();
        const payable = document.getElementById('summaryPayable').innerText.replace('₹', '');
        const paid = document.getElementById('billPaid').value || 0;
        const mockBill = {
            id: document.getElementById('billId').value,
            name: document.getElementById('customerName').value,
            date: new Date().toISOString(),
            payable: payable, paid: paid, due: payable - paid,
            method: document.getElementById('billMethod').value,
        };
        allBills.unshift(mockBill);
        showToast("Sandbox Bill Generated!", "success");
        
        // Open the premium Print Preview
        openPrintPreview(mockBill, 'billingScreen');
        
        document.getElementById('billingForm').reset();
        currentCart = []; renderCart(); calculateBill();
    }, 800);
});

// --- HISTORY & DUES ---
async function loadBills() { renderBills(); }

function renderBills() {
    const dueListView = document.getElementById('dueListView');
    const historyListView = document.getElementById('historyListView');
    dueListView.innerHTML = ''; historyListView.innerHTML = '';
    
    allBills.forEach(bill => {
        const isDue = parseFloat(bill.due) > 0;
        const card = `
        <div class="bill-card" onclick='openPrintPreview(${JSON.stringify(bill).replace(/'/g, "&apos;")}, "${isDue ? 'dueScreen' : 'historyScreen'}")' style="padding: 15px; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 10px; cursor: pointer; background: var(--white);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="color: var(--navy-blue);">${bill.name}</strong>
                <span style="font-size: 0.75rem; color: var(--text-light);">${bill.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
                <strong style="color: ${isDue ? 'var(--error-red)' : 'var(--trust-green)'};">
                    ${isDue ? 'Due: ₹' + bill.due : 'Paid: ₹' + bill.paid}
                </strong>
            </div>
        </div>`;
        historyListView.innerHTML += card;
        if (isDue) dueListView.innerHTML += card;
    });
}

// --- PREMIUM PDF OVERRIDE (MOKTEST STYLE) ---
window.openPrintPreview = function(billData, origin) {
    const previewScreen = document.getElementById('printPreviewScreen');
    
    // Completely overwrite the screen to show a premium popup instead of a real printable A4 page
    previewScreen.innerHTML = `
        <div class="card-box" style="text-align: center; margin: 40px auto; max-width: 500px;">
            <h2 style="color: var(--trust-green); margin-bottom: 10px;">Bill Logged Successfully!</h2>
            <h3 style="color: var(--navy-blue); margin-bottom: 20px;">${billData.name} - ${billData.id}</h3>
            
            <p style="font-size: 1.2rem; margin-bottom: 10px;">Amount: <strong>₹${billData.payable}</strong></p>
            <p style="font-size: 1rem; color: var(--text-light); margin-bottom: 30px;">
                Status: ${billData.due > 0 ? `<span style="color: var(--error-red); font-weight: bold;">DUE (₹${billData.due})</span>` : '<span style="color: var(--trust-green); font-weight: bold;">PAID</span>'}
            </p>
            
            <div style="padding: 15px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; margin-bottom: 25px; font-size: 0.9rem; color: var(--text-light);">
                <em>(In the live application, this immediately opens a branded A4 PDF invoice ready for thermal or standard printing, and automatically WhatsApps the customer.)</em>
            </div>
            
            <button class="btn-primary" onclick="alert('Sandbox Mode: PDF Document Generation is a premium feature disabled in the demo environment.')" style="margin-bottom: 15px;">Download PDF Invoice</button>
            <button class="btn-primary" style="background: var(--text-light);" onclick="switchTab('${origin}')">Back to Dashboard</button>
        </div>
    `;
    switchTab('printPreviewScreen');
}
