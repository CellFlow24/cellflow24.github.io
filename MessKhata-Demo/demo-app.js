// =========================================================
// MESS KHATA - SANDBOX ENGINE (No Server, Local Memory Only)
// =========================================================

let currentUser = "DemoUser";
let mockUsers = ["DemoUser", "Asib", "Khadimul"]; // Simulated active users
let mockChoresList = [{name: "Cook Dinner", amount: 150}, {name: "Clean Rooms", amount: 100}];
let mockExpenses = [];
let mockChores = [];
let mockChat = [{sender: "Asib", message: "Hey, are you adding the grocery bill?", date: new Date().getTime(), role: "User"}];

// Override Login to jump straight to Dashboard
function login() {
    const user = document.getElementById("userId").value || "DemoUser";
    currentUser = user;
    if (!mockUsers.includes(currentUser)) mockUsers.push(currentUser);
    
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard-screen").style.display = "block";
    document.getElementById("welcome-text").innerText = `Welcome, ${currentUser}`;
    document.getElementById("admin-btn").style.display = "none"; // Hide admin in demo
}

function logout() { location.reload(); } // Instantly wipes memory in demo mode

// Basic Navigation
function goBackToDashboard() {
    document.querySelectorAll('.screen').forEach(el => el.style.display = 'none');
    document.getElementById("dashboard-screen").style.display = "block";
}

function toggleDropdown(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === "block" ? "none" : "block";
}

// 1. Expense Simulator
document.querySelector('.button-grid button:nth-child(1)').onclick = () => {
    document.getElementById("dashboard-screen").style.display = "none";
    document.getElementById("expense-screen").style.display = "block";
    
    const container = document.getElementById("dynamic-split-users");
    container.innerHTML = "";
    mockUsers.forEach(user => {
        container.innerHTML += `<label class="split-label"><input type="checkbox" class="split-check" value="${user}" checked> ${user}</label>`;
    });
};

function saveExpense() {
    const expenseFor = document.getElementById("expenseFor").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const messageEl = document.getElementById("expense-message");
    const splitWith = Array.from(document.querySelectorAll('.split-check:checked')).map(cb => cb.value).join(", ");

    if (!expenseFor || !amount || !splitWith) {
        messageEl.innerText = "Please fill all details."; return;
    }

    messageEl.innerText = "Saving to demo memory...";
    
    setTimeout(() => {
        mockExpenses.push({ date: new Date().getTime(), item: expenseFor, amount: amount, paidBy: currentUser, splitWith: splitWith });
        messageEl.style.color = "#27ae60"; 
        messageEl.innerText = "Expense saved successfully!";
        setTimeout(() => { document.getElementById("expenseFor").value = ""; document.getElementById("expenseAmount").value = ""; goBackToDashboard(); messageEl.innerText = ""; }, 1000);
    }, 600);
}

// 2. Chore Simulator
document.querySelector('.button-grid button:nth-child(2)').onclick = () => {
    document.getElementById("dashboard-screen").style.display = "none";
    document.getElementById("chore-screen").style.display = "block";
    
    const container = document.getElementById("dynamic-chore-split-users");
    container.innerHTML = "";
    mockUsers.forEach(user => {
        if (user !== currentUser) container.innerHTML += `<label class="split-label"><input type="checkbox" class="chore-split-check" value="${user}" checked> ${user}</label>`;
    });

    const optionsEl = document.getElementById("choreOptions");
    optionsEl.innerHTML = '';
    mockChoresList.forEach(chore => {
        optionsEl.innerHTML += `<div class="dropdown-item" onclick="selectCustomChore('${chore.name}', ${chore.amount})">${chore.name}</div>`;
    });
};

function selectCustomChore(name, amount) {
    document.getElementById("choreSelect").value = name;
    document.getElementById("choreSelectAmount").value = amount;
    document.getElementById("choreSelectBtn").innerText = name;
    document.getElementById("choreAmountDisplay").innerText = `Amount: ₹${amount}`;
    document.getElementById("choreOptions").style.display = "none";
}

function saveChore() {
    const selectedName = document.getElementById("choreSelect").value;
    const amount = parseFloat(document.getElementById("choreSelectAmount").value);
    const messageEl = document.getElementById("chore-message");
    const splitWith = Array.from(document.querySelectorAll('.chore-split-check:checked')).map(cb => cb.value).join(", ");

    if (!selectedName || !splitWith) { messageEl.innerText = "Please select work and users."; return; }
    
    setTimeout(() => {
        mockChores.push({ date: new Date().getTime(), item: selectedName, doneBy: currentUser, amount: amount, splitWith: splitWith });
        messageEl.style.color = "#27ae60";
        messageEl.innerText = "Work logged successfully!";
        setTimeout(() => { goBackToDashboard(); messageEl.innerText = ""; }, 1000);
    }, 600);
}

// 3. Balance Calculator
document.querySelector('.button-grid button:nth-child(3)').onclick = () => {
    document.getElementById("dashboard-screen").style.display = "none";
    document.getElementById("pay-details-screen").style.display = "block";
    const contentEl = document.getElementById("pay-details-content");

    let balances = {}, totalPaid = {}, choresEarned = {};
    mockUsers.forEach(u => { balances[u] = 0; totalPaid[u] = 0; choresEarned[u] = 0; });

    mockExpenses.forEach(exp => {
        const splitList = exp.splitWith.split(',').map(s => s.trim());
        totalPaid[exp.paidBy] += exp.amount; balances[exp.paidBy] += exp.amount;
        const share = exp.amount / splitList.length;
        splitList.forEach(person => { if(balances[person] !== undefined) balances[person] -= share; });
    });

    mockChores.forEach(chore => {
        const splitList = chore.splitWith.split(',').map(s => s.trim());
        choresEarned[chore.doneBy] += chore.amount; balances[chore.doneBy] += chore.amount;
        const splitCost = chore.amount / splitList.length;
        splitList.forEach(person => { if(balances[person] !== undefined) balances[person] -= splitCost; });
    });

    let html = `<h3 style="margin-top:0; text-align:center; color:#2c3e50;">Live Sandbox Balances</h3>`;
    mockUsers.forEach(user => {
        const bal = balances[user], isOwed = bal > 0, color = isOwed ? "#27ae60" : (bal < 0 ? "#e74c3c" : "#2c3e50");
        html += `
        <div style="background: white; padding: 15px; margin-bottom: 12px; border-radius: 10px;">
            <h4 style="margin: 0 0 10px 0;">${user}</h4>
            <div style="display: flex; justify-content: space-between; font-size: 14px;"><span>Total Paid:</span> <span>₹${totalPaid[user].toFixed(2)}</span></div>
            <div style="display: flex; justify-content: space-between; font-size: 14px;"><span>Work Earned:</span> <span>₹${choresEarned[user].toFixed(2)}</span></div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 8px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: ${color};">
                <span>${isOwed ? "Gets Back" : (bal < 0 ? "Owes" : "Settled")}:</span> <span>₹${Math.abs(bal).toFixed(2)}</span>
            </div>
        </div>`;
    });
    contentEl.innerHTML = html;
};

// 4. Live Chat Sandbox
document.getElementById("chat-nav-btn").onclick = () => {
    document.getElementById("dashboard-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "block";
    renderChat();
};

function renderChat() {
    const chatBox = document.getElementById("chat-box");
    let html = '';
    mockChat.forEach(msg => {
        const fullDateTime = "Just Now";
        if (msg.sender === currentUser) {
            html += `<div class="chat-bubble msg-mine"><span class="chat-meta">${fullDateTime}</span>${msg.message}</div>`;
        } else {
            html += `<div class="chat-bubble msg-other"><span class="chat-meta">${msg.sender} • ${fullDateTime}</span>${msg.message}</div>`;
        }
    });
    chatBox.innerHTML = html;
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

function sendChatMessage() {
    const inputEl = document.getElementById("chatInput");
    const text = inputEl.value.trim();
    if (!text) return;
    
    mockChat.push({sender: currentUser, message: text, date: new Date().getTime(), role: "User"});
    inputEl.value = "";
    renderChat();
}
