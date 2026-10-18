// =====================================================================
// CELLFLOW SANDBOX DEMO SCRIPT - MOCK TEST (No Backend Required)
// =====================================================================

const App = {
  currentUser: null,
  currentSet: "DEMO-1",
  countdown: null,
  examQuestions: [],
  isFlexibleMode: true,
  currentBlock: 0,
  alertCallback: null, 

  // --- CUSTOM CSS ALERT SYSTEM ---
  showAlert: (title, message, callback) => {
    document.getElementById('custom-alert-title').innerText = title;
    document.getElementById('custom-alert-message').innerHTML = message;
    document.getElementById('custom-alert-modal').style.display = 'flex';
    App.alertCallback = callback || null;
  },

  closeAlert: () => {
    document.getElementById('custom-alert-modal').style.display = 'none';
    if (App.alertCallback) App.alertCallback(); 
  },

  // --- UI CONTROLS ---
  toggleAuth: () => {
    document.getElementById('login-section').classList.toggle('hidden');
    document.getElementById('register-section').classList.toggle('hidden');
  },

  // --- SIMULATED BACKEND (SANDBOX DATA) ---
  postData: (action, payload, callback) => {
    document.getElementById('auth-loading').classList.remove('hidden');
    
    // Simulate network delay (800ms) to make it feel real
    setTimeout(() => {
      document.getElementById('auth-loading').classList.add('hidden');
      
      if (action === 'register') {
        const dummyReg = "DEMO-" + Math.floor(1000 + Math.random() * 9000);
        callback({ success: true, regNum: dummyReg });
      } 
      else if (action === 'login') {
        callback({ success: true, name: "Demo User", regNum: "DEMO-9999", email: "demo@cellflow.in" });
      }
      else if (action === 'submit') {
        // Generate a fake random score for the demo
        let fakeScore = Math.floor(Math.random() * 80) + 20; 
        callback({ 
          score: fakeScore, 
          maxScore: 100, 
          setNumber: payload.setNumber, 
          subject: "AIIMS CBT Demo" 
        });
      }
      else if (action === 'downloadRegCard') {
        callback({ success: false }); // Fails gracefully in demo
      }
    }, 800);
  },

  // --- AUTHENTICATION ---
  register: () => {
    const data = {
      name: document.getElementById('reg-name').value,
      email: document.getElementById('reg-email').value,
      password: document.getElementById('reg-pass').value
    };
    if(!data.name || !data.email || !data.password) return App.showAlert("Missing Fields", "Please fill all required fields!");
    
    App.postData('register', data, (res) => {
      if(res.success) {
        document.getElementById('reg-name').value = ""; document.getElementById('reg-email').value = ""; document.getElementById('reg-pass').value = "";
        App.showAlert(
          "Registration Successful!", 
          `Your Sandbox ID is <strong style="color:#673ab7;">${res.regNum}</strong>.<br><br>Remember, this is a demo environment so your data is not saved permanently.`,
          () => { App.toggleAuth(); } 
        );
      }
    });
  },

  login: () => {
    const data = {
      loginId: document.getElementById('login-id').value,
      password: document.getElementById('login-pass').value
    };
    if(!data.loginId || !data.password) return App.showAlert("Missing Fields", "Please enter any ID and password to test the sandbox!");
    
    App.postData('login', data, (res) => {
      if(res.success) {
        App.currentUser = res;
        App.loadDashboard();
      }
    });
  },

  logout: () => {
    App.currentUser = null;
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById('auth-page').classList.remove('hidden');
  },

  // --- DASHBOARD ---
  loadDashboard: () => {
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('exam-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.remove('hidden');
    
    document.getElementById('dash-name').innerText = App.currentUser.name;
    document.getElementById('dash-reg').innerText = App.currentUser.regNum;
    
    // Sandbox specific notifications
    document.getElementById('notification-box').innerText = "Welcome to the Mock Test Sandbox Demo! Real data sync is disabled.";
    document.getElementById('notification-box').classList.remove('hidden');
    
    document.getElementById('paper-status-box').innerHTML = `<h3 style="color:#2e7d32;">Demo Paper Available: SET ${App.currentSet}</h3>`;
    document.getElementById('exam-start-container').classList.remove('hidden');
      
    // Mock History Data
    const dummyHistory = [
      { date: "Yesterday", subject: "Anatomy (Demo)", setNum: "DEMO-0", score: 75, correct: 75, wrong: 10, skip: 15 }
    ];
    
    const tbody = document.getElementById('history-table');
    tbody.innerHTML = "";
    dummyHistory.forEach(row => {
      tbody.innerHTML += `
        <tr>
          <td style="font-size: 0.85rem;">${row.date}</td>
          <td style="font-size: 0.85rem; font-weight: bold; color: #4a148c;">${row.subject}</td>
          <td style="color:#1976d2; font-weight:bold;">${row.setNum}</td>
          <td><strong>${row.score}</strong></td>
          <td style="color:#2e7d32;">${row.correct}</td>
          <td style="color:#d32f2f;">${row.wrong}</td>
          <td>${row.skip}</td>
        </tr>`;
    });
  },
  
  // --- EXAM LOGIC ---
  startExam: () => {
    App.isFlexibleMode = document.getElementById('mode-toggle').checked;
    
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById('exam-page').classList.remove('hidden');
    document.getElementById('questions-container').innerHTML = "<div class='loader'></div><p style='text-align:center;'>Loading Demo Paper...</p>";
    
    // Simulate loading a 100-question paper instantly
    setTimeout(() => {
      App.examQuestions = Array.from({length: 100}, (_, i) => ({
        id: `q${i+1}`,
        text: `Sandbox Demo Question ${i+1}? (This is a placeholder for the demo environment)`,
        optA: `Sample Option A`,
        optB: `Sample Option B`,
        optC: `Sample Option C`,
        optD: `Sample Option D`
      }));
      App.buildExamUI();
    }, 1000);
  },

  buildExamUI: () => {
    let html = "";
    if (App.isFlexibleMode) {
      document.getElementById('banner-text').innerHTML = `Time Remaining: <span id="time-display">90:00</span>`;
      App.examQuestions.forEach((q, i) => {
        html += `<div class="card" style="clear:both;">
          <p><strong>Q${i+1}. ${q.text}</strong></p>
          <label class="option-label"><input type="radio" name="${q.id}" value="A"> ${q.optA}</label>
          <label class="option-label"><input type="radio" name="${q.id}" value="B"> ${q.optB}</label>
          <label class="option-label"><input type="radio" name="${q.id}" value="C"> ${q.optC}</label>
          <label class="option-label"><input type="radio" name="${q.id}" value="D"> ${q.optD}</label>
          <button type="button" class="btn-clear" onclick="document.getElementsByName('${q.id}').forEach(r=>r.checked=false)">Clear</button>
          <div style="clear:both;"></div>
        </div>`;
      });
      html += `<button type="button" class="btn btn-success" style="margin-top:20px;" onclick="App.submitExam(false)">Submit Exam</button>`;
      document.getElementById('questions-container').innerHTML = html;
      App.startTimer(90 * 60); 
    } else {
      document.getElementById('banner-text').innerHTML = `Section Time Left: <span id="time-display">18:00</span>`;
      for (let b = 0; b < 5; b++) {
        html += `<div id="block-${b}" style="display: ${b === 0 ? 'block' : 'none'};">`;
        let startIdx = b * 20; let endIdx = startIdx + 20;
        for (let i = startIdx; i < endIdx && i < App.examQuestions.length; i++) {
          let q = App.examQuestions[i];
          html += `<div class="card" style="clear:both;">
            <p><strong>Q${i+1}. ${q.text}</strong></p>
            <label class="option-label"><input type="radio" name="${q.id}" value="A"> ${q.optA}</label>
            <label class="option-label"><input type="radio" name="${q.id}" value="B"> ${q.optB}</label>
            <label class="option-label"><input type="radio" name="${q.id}" value="C"> ${q.optC}</label>
            <label class="option-label"><input type="radio" name="${q.id}" value="D"> ${q.optD}</label>
            <button type="button" class="btn-clear" onclick="document.getElementsByName('${q.id}').forEach(r=>r.checked=false)">Clear</button>
            <div style="clear:both;"></div>
          </div>`;
        }
        html += `</div>`;
      }
      document.getElementById('questions-container').innerHTML = html;
      App.currentBlock = 0;
      App.startTimer(18 * 60); 
    }
  },

  startTimer: (timeLeft) => {
    App.countdown = setInterval(() => {
      let m = Math.floor(timeLeft / 60); let s = timeLeft % 60;
      document.getElementById('time-display').innerText = `${m<10?'0':''}${m}:${s<10?'0':''}${s}`;
      
      if(timeLeft <= 0) { 
        clearInterval(App.countdown); 
        if (!App.isFlexibleMode && App.currentBlock < 4) {
          document.getElementById(`block-${App.currentBlock}`).style.display = 'none';
          document.getElementById('block-alert-msg').innerText = `Time is up for Section ${App.currentBlock + 1}. Moving to Section ${App.currentBlock + 2}.`;
          document.getElementById('block-alert-modal').style.display = 'flex';
        } else {
          App.forceSubmit(); 
        }
      }
      timeLeft--;
    }, 1000);
  },

  nextBlock: () => {
    document.getElementById('block-alert-modal').style.display = 'none';
    App.currentBlock++;
    document.getElementById(`block-${App.currentBlock}`).style.display = 'block';
    window.scrollTo(0, 0);
    App.startTimer(18 * 60);
  },

  submitExam: (isAutoSubmit) => {
    if (isAutoSubmit) { App.forceSubmit(); return; }

    const formData = new FormData(document.getElementById('examForm'));
    let missing = [];
    
    App.examQuestions.forEach((q, index) => {
      if (!formData.get(q.id)) missing.push(`Q${index + 1}`);
    });

    if (missing.length > 0 && App.isFlexibleMode) {
      document.getElementById('missing-questions-list').textContent = missing.join(', ');
      document.getElementById('review-modal').style.display = 'flex';
    } else {
      App.showAlert("Confirm Submission", "Are you sure you want to submit your exam?", () => {
        App.forceSubmit();
      });
    }
  },

  forceSubmit: () => {
    document.getElementById('review-modal').style.display = 'none';
    clearInterval(App.countdown);
    
    const payload = { setNumber: App.currentSet };

    document.getElementById('exam-page').innerHTML = "<div class='card text-center'><h2>Submitting Sandbox Test...</h2><div class='loader'></div></div>";
    
    App.postData('submit', payload, (res) => { 
      App.buildPdfAndShowResult(res); 
    });
  },

  // --- RESULT DISPLAY (MODIFIED FOR SANDBOX) ---
  buildPdfAndShowResult: (res) => {
    document.getElementById('exam-page').innerHTML = `
      <div class="card" style="text-align:center;">
        <h2>Demo Exam Complete!</h2>
        <h4 style="color:#673ab7; margin-bottom: 15px;">${res.subject} - SET ${res.setNumber}</h4>
        <p>Your Random Demo Score: <strong>${res.score}</strong> / ${res.maxScore}</p>
        <p style="color:#666; margin-top: 15px;"><em>(In the real app, this page auto-generates and downloads a custom PDF report to the user's device and emails them the result.)</em></p>
        <button class="btn btn-primary" onclick="App.showAlert('Sandbox Mode', 'PDF Generation is disabled in this Sandbox demo. In the real app, this downloads their exam report.')" style="margin-top: 20px;">Download Answer Sheet PDF</button>
        <button class="btn btn-secondary" onclick="App.loadDashboard()">Back to Dashboard</button>
      </div>
    `;
  },

  downloadRegCard: () => {
    App.showAlert('Sandbox Mode', 'PDF Document generation is disabled in the Sandbox demo.');
  }
};
