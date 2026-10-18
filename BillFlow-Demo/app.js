// =====================================================================
// CELLFLOW SANDBOX DEMO SCRIPT - BILLFLOW (No Backend Required)
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
    { id: "INV-0012", name: "Rahul Sharma", date: new Date().toISOString(), phone: "9876543210", location: "Kolkata", subTotal: 6000, discount: 0, payable: 6000, paid: 4500, due: 1500, method: "CASH", cart: JSON.stringify([{name: "Premium Web Setup", qty: 1, price: 5999, gstAmount: 915.10, itemTotal: 5999}]) }
];
let companySettings = {
    CompanyName: "Cellflow Sandbox", CompanyAddress: "Kolkata, West Bengal", 
    CompanyPhone: "9330224549", GSTNumber: "22AAAAA0000A1Z5"
};

const toastContainer = document.getElementById('toastContainer');
function showToast(message, type = 'success') {
    toastContainer.innerText = message;
    toastContainer.className = `toast-container toast-${type}`;
    setTimeout(() => toastContainer.classList.add('show'), 10);
    setTimeout(() => toastContainer.classList.remove('show'), 3000);
}

function showLoader() { loadingOverlay.classList.remove('hidden'); }
function hideLoader() { loadingOverlay.classList.add('hidden'); }
function showScreen(screenEl) { document.querySelectorAll('.screen-container').forEach(s => s.classList.add('hidden')); screenEl.classList.remove('hidden'); }

// --- MOCK API CALLS ---
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showLoader();
    setTimeout(() => {
        hideLoader();
        document.getElementById('welcomeMessage').innerText = `Hello, ${currentUserName}!`;
        document.getElementById('topAppBar').classList.remove('hidden');
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

async function loadItems() { renderItemList(inventoryItems); }
async function loadBills() { renderBills(); }

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
            phone: document.getElementById('customerPhone').value,
            location: document.getElementById('customerLocation').value,
            subTotal: document.getElementById('summarySubTotal').innerText.replace('₹', ''),
            discount: document.getElementById('billDiscount').value,
            payable: payable, paid: paid, due: payable - paid,
            method: document.getElementById('billMethod').value,
            cart: currentCart.map(i => ({ name: i.name, qty: i.qty, price: i.finalPrice, itemTotal: i.finalPrice * i.qty }))
        };
        allBills.unshift(mockBill);
        showToast("Sandbox Bill Generated!", "success");
        openPrintPreview(mockBill, 'billingScreen');
        document.getElementById('billingForm').reset();
        currentCart = []; renderCart(); calculateBill();
    }, 800);
});

async function submitClearDue() {
    showLoader();
    setTimeout(() => {
        hideLoader();
        const bill = allBills.find(b => b.id === currentClearBillId);
        if(bill) {
            bill.paid = parseFloat(bill.paid) + parseFloat(document.getElementById('cdAmount').value);
            bill.due = bill.payable - bill.paid;
            bill.clearDate = new Date().toISOString();
        }
        showToast("Sandbox Due Cleared!", "success");
        closeClearDueModal();
        loadBills();
        openPrintPreview(bill, 'dueScreen');
    }, 600);
}
