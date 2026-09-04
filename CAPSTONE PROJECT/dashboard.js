/**
 * AI Campus Assistant - Dashboard Controller & Application Logic
 * ---------------------------------------------------------------
 * Manages Home Student Portal (Subjects [Max 4], Arrears, Attendance [100% for Arrears],
 * Fees, Payments, Hall Ticket, Student Profile Modal), AI WebChat, Knowledge Explorer,
 * Analytics Hub, and NLU Inspector Drawer.
 */

(function () {
  'use strict';

  // Instantiate Dialogue Manager & Knowledge Base
  const dialogueManager = new window.CampusDialogue();
  const KB = window.CampusNLU.CAMPUS_KB;

  // Student Profile Data (Updated: Karthik Prashanth, ID 202411048)
  const STUDENT_PROFILE = {
    name: "Karthik Prashanth",
    regNo: "202411048",
    phone: "+91 98451 23456",
    personalEmail: "karthik.prashanth@gmail.com",
    collegeEmail: "karthik.prashanth@campus.edu",
    department: "Computer Science and Engineering (CSE)",
    semester: "Semester 4 (Fall 2026 Batch)",
    hostel: "APJ Abdul Kalam Hostel (Room 304, AC Double)",
    fatherName: "K. Venkatesh",
    motherName: "K. Sunitha",
    parentsPhone: "+91 98450 12345",
    parentsEmail: "venkatesh.k@gmail.com"
  };

  // Base Attendance Dataset
  let ENROLLED_SUBJECTS = [
    { code: 'CSA1709', name: 'Artificial Intelligence & Intelligent Agents', credits: 4, faculty: 'Dr. Sarah Jenkins', attended: 46, total: 50, pct: 92, type: 'regular' },
    { code: 'CS1402', name: 'Database Management Systems', credits: 4, faculty: 'Prof. K. George', attended: 42, total: 48, pct: 87.5, type: 'regular' },
    { code: 'MA1401', name: 'Discrete Mathematics & Graph Theory', credits: 3, faculty: 'Dr. S. Raman', attended: 31, total: 44, pct: 70.4, type: 'regular', needed: 3 },
    { code: 'AI1403', name: 'Deep Learning Architectures (Elective I)', credits: 4, faculty: 'Dr. Robert Vance', attended: 36, total: 40, pct: 90, type: 'regular' }
  ];

  let ARREAR_SUBJECTS = [
    { code: 'MA1301', name: 'Applied Linear Algebra & Numerical Analysis', credits: 4, faculty: 'Dr. S. Raman', attended: 40, total: 40, pct: 100, type: 'arrear' }
  ];

  // Application State
  const AppState = {
    theme: localStorage.getItem('campusTheme') || 'light',
    soundEnabled: localStorage.getItem('campusSound') !== 'false',
    currentView: 'home',
    currentSubTab: 'subRegistration',
    totalQueriesHandled: 18,
    intentCounts: {
      'exam_schedule': 6,
      'course_info': 4,
      'fees_scholarship': 3,
      'hostel_mess': 2,
      'library_facility': 1,
      'placement_internship': 1,
      'greeting': 1
    },
    latencyRecords: [16, 18, 14, 22, 19, 15, 17],
    fallbackCount: 0,
    chatHistory: [],
    lastNluResult: null,
    isListening: false
  };

  // DOM Elements Cache
  const DOM = {
    // Navigation
    tabBtns: document.querySelectorAll('.view-tabs .tab-btn'),
    viewSections: document.querySelectorAll('.view-section'),
    btnThemeToggle: document.getElementById('btnThemeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    btnSoundToggle: document.getElementById('btnSoundToggle'),
    soundIcon: document.getElementById('soundIcon'),
    btnNluInspector: document.getElementById('btnNluInspector'),
    nluDrawer: document.getElementById('nluInspectorDrawer'),
    btnCloseDrawer: document.getElementById('btnCloseDrawer'),
    btnLogout: document.getElementById('btnLogout'),
    toast: document.getElementById('toast'),

    // Student Profile Card & Modal
    studentHeroCard: document.getElementById('studentHeroCard'),
    userProfileBadge: document.querySelector('.user-profile-badge'),
    homeGreetingName: document.getElementById('homeGreetingName'),
    userNameLabel: document.getElementById('userNameLabel'),
    userAvatarInitials: document.getElementById('userAvatarInitials'),
    studentProfileModal: document.getElementById('studentProfileModal'),
    btnProfileModalClose: document.getElementById('btnProfileModalClose'),
    btnProfileModalOk: document.getElementById('btnProfileModalOk'),
    heroEnrolledCredits: document.getElementById('heroEnrolledCredits'),
    heroEnrolledSubjects: document.getElementById('heroEnrolledSubjects'),
    heroPendingArrear: document.getElementById('heroPendingArrear'),

    // Home Sub-Tabs
    subTabBtns: document.querySelectorAll('.sub-tab-btn'),
    subPanels: document.querySelectorAll('.home-sub-panel'),
    selectedSubjectsCount: document.getElementById('selectedSubjectsCount'),
    selectedCreditsCount: document.getElementById('selectedCreditsCount'),
    btnSubmitSubjectReg: document.getElementById('btnSubmitSubjectReg'),
    checkArrear1: document.getElementById('checkArrear1'),
    totalArrearFeeDisplay: document.getElementById('totalArrearFeeDisplay'),
    arrearCountText: document.getElementById('arrearCountText'),
    arrearTotalPayable: document.getElementById('arrearTotalPayable'),
    btnRegisterArrearPay: document.getElementById('btnRegisterArrearPay'),
    attendanceGridContainer: document.getElementById('attendanceGridContainer'),
    paymentHistoryBody: document.getElementById('paymentHistoryBody'),
    payCategory: document.getElementById('payCategory'),
    payAmount: document.getElementById('payAmount'),
    btnExecutePayment: document.getElementById('btnExecutePayment'),
    arrearFeeStatusBadge: document.getElementById('arrearFeeStatusBadge'),
    arrearRowStatus: document.getElementById('arrearRowStatus'),

    // WebChat View
    chatMessages: document.getElementById('chatMessages'),
    chatForm: document.getElementById('chatForm'),
    chatInput: document.getElementById('chatInput'),
    btnSendMessage: document.getElementById('btnSendMessage'),
    btnVoiceInput: document.getElementById('btnVoiceInput'),
    micIcon: document.getElementById('micIcon'),
    typingIndicator: document.getElementById('typingIndicator'),
    quickRepliesRibbon: document.getElementById('quickRepliesRibbon'),
    btnResetChat: document.getElementById('btnResetChat'),
    btnExportChat: document.getElementById('btnExportChat'),
    btnPrintChat: document.getElementById('btnPrintChat'),
    btnClearChatHistory: document.getElementById('btnClearChatHistory'),
    sessionTurnCount: document.getElementById('sessionTurnCount'),
    sessionActiveDept: document.getElementById('sessionActiveDept'),
    sessionActiveSem: document.getElementById('sessionActiveSem'),
    liveLatencyBadge: document.getElementById('liveLatencyBadge'),

    // Knowledge Base View
    kbSearchInput: document.getElementById('kbSearchInput'),
    kbFilters: document.getElementById('kbFilters'),
    kbGridContainer: document.getElementById('kbGridContainer'),

    // Analytics View
    kpiTotalQueries: document.getElementById('kpiTotalQueries'),
    kpiConfidence: document.getElementById('kpiConfidence'),
    kpiAvgLatency: document.getElementById('kpiAvgLatency'),
    kpiFallbackRate: document.getElementById('kpiFallbackRate'),
    kpiTicketsCount: document.getElementById('kpiTicketsCount'),
    intentDistributionList: document.getElementById('intentDistributionList'),
    ticketsQueueTable: document.getElementById('ticketsQueueTable')
  };

  // =========================================================================
  // AUDIO SYNTHESIZER (Gentle Chimes)
  // =========================================================================
  function playAudioChime(type) {
    if (!AppState.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'send') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(784, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch (e) {
      // Audio playback silently ignored
    }
  }

  // =========================================================================
  // SPEECH RECOGNITION (Speech-to-Text)
  // =========================================================================
  let recognition = null;
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRec) {
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
      AppState.isListening = true;
      DOM.micIcon.textContent = '≡ƒö┤';
      DOM.btnVoiceInput.classList.add('recording-pulse');
      showToast('Listening... Speak your campus question now.');
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      DOM.chatInput.value = transcript;
      handleSendMessage(transcript);
    };

    recognition.onerror = function (event) {
      showToast('Microphone error: ' + event.error);
      stopListening();
    };

    recognition.onend = function () {
      stopListening();
    };
  }

  function toggleVoiceInput() {
    if (!recognition) {
      showToast('Speech Recognition is not supported in this browser.');
      return;
    }
    if (AppState.isListening) {
      recognition.stop();
      stopListening();
    } else {
      try {
        recognition.start();
      } catch (e) {
        showToast('Microphone unavailable or already in use.');
      }
    }
  }

  function stopListening() {
    AppState.isListening = false;
    DOM.micIcon.textContent = '≡ƒÄñ';
    DOM.btnVoiceInput.classList.remove('recording-pulse');
  }

  // =========================================================================
  // TEXT-TO-SPEECH (TTS Voice Readout)
  // =========================================================================
  function speakText(text) {
    if (!window.speechSynthesis) {
      showToast('Text-to-speech is not supported.');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/https?:\/\/[^\s]+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    showToast('≡ƒöè Reading response aloud...');
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  let toastTimer = null;
  function showToast(msg) {
    DOM.toast.textContent = msg;
    DOM.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.toast.classList.add('hidden');
    }, 3200);
  }

  // =========================================================================
  // UNIVERSAL MODAL SYSTEM (PROFILE, TOTAL SUBJECTS, PASSED, ARREAR)
  // =========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.removeProperty('display');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.style.removeProperty('display');
    }
  }

  function openStudentProfileModal() {
    openModal('studentProfileModal');
  }

  function closeStudentProfileModal() {
    closeModal('studentProfileModal');
  }

  // =========================================================================
  // THEME & VIEW CONTROLS
  // =========================================================================
  function initTheme() {
    document.documentElement.setAttribute('data-theme', AppState.theme);
    DOM.themeIcon.textContent = AppState.theme === 'dark' ? 'ΓÿÇ∩╕Å' : '≡ƒîÖ';
  }

  function toggleTheme() {
    AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('campusTheme', AppState.theme);
    initTheme();
    showToast(`Switched to ${AppState.theme} theme`);
  }

  function toggleSound() {
    AppState.soundEnabled = !AppState.soundEnabled;
    localStorage.setItem('campusSound', AppState.soundEnabled);
    DOM.soundIcon.textContent = AppState.soundEnabled ? '≡ƒöö' : '≡ƒöò';
    showToast(`Sound ${AppState.soundEnabled ? 'Enabled' : 'Muted'}`);
  }

  function switchView(viewName) {
    AppState.currentView = viewName;
    DOM.tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });
    DOM.viewSections.forEach(sec => {
      const match = sec.id.toLowerCase() === `view${viewName.toLowerCase()}`;
      sec.classList.toggle('active', match);
    });

    if (viewName === 'knowledge') {
      renderKnowledgeBase('all');
    } else if (viewName === 'analytics') {
      refreshAnalytics();
    } else if (viewName === 'home') {
      renderAttendanceList('all');
    }
  }

  function switchHomeSubTab(subTabName) {
    AppState.currentSubTab = subTabName;
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const subPanels = document.querySelectorAll('.home-sub-panel');
    
    subTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-subtab') === subTabName);
    });
    
    subPanels.forEach(panel => {
      const targetId = 'panel' + subTabName.charAt(0).toUpperCase() + subTabName.slice(1);
      panel.classList.toggle('active', panel.id === targetId);
    });

    const subTabsBar = document.querySelector('.home-sub-tabs-bar');
    if (subTabsBar) {
      subTabsBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // =========================================================================
  // HOME SERVICES: ATTENDANCE (100% FOR ARREARS), SUBJECTS (MAX 4) & PAYMENTS
  // =========================================================================
  function renderAttendanceList(filter = 'all') {
    if (!DOM.attendanceGridContainer) return;
    DOM.attendanceGridContainer.innerHTML = '';

    // Combine active registered regular subjects + registered arrear subjects
    const allList = [...ENROLLED_SUBJECTS, ...ARREAR_SUBJECTS];

    const filtered = allList.filter(item => {
      if (filter === 'warning') return item.pct < 75;
      if (filter === 'eligible') return item.pct >= 75;
      return true;
    });

    filtered.forEach(item => {
      const isArrear = item.type === 'arrear';
      const isWarn = item.pct < 75;
      const card = document.createElement('div');
      card.className = `attendance-card ${isWarn ? 'warn-border' : ''} ${isArrear ? 'arrear-att-card' : ''}`;
      
      let badgeTag = `Γ£à Exam Eligible`;
      let badgeClass = `tag-success`;

      if (isArrear) {
        badgeTag = `≡ƒîƒ Arrear (100% Cleared)`;
        badgeClass = `tag-info`;
      } else if (isWarn) {
        badgeTag = `ΓÜá∩╕Å Low Attendance (<75%)`;
        badgeClass = `tag-danger`;
      }

      card.innerHTML = `
        <div class="att-card-header">
          <span class="pill-code">${item.code} ${isArrear ? '<span class="tag-arrear-badge">ARREAR</span>' : ''}</span>
          <span class="card-tag ${badgeClass}">
            ${badgeTag}
          </span>
        </div>
        <h4 class="att-course-title">${item.name}</h4>
        <p class="att-instructor">≡ƒæ¿ΓÇì≡ƒÅ½ Instructor / Faculty: ${item.faculty}</p>

        <div class="att-progress-wrap">
          <div class="att-progress-bar">
            <div class="att-progress-fill ${isArrear ? 'fill-arrear-100' : (isWarn ? 'fill-danger' : 'fill-success')}" style="width: ${item.pct}%"></div>
          </div>
          <div class="att-stats-row">
            <span>Attended: <strong>${item.attended} / ${item.total} classes</strong></span>
            <span class="att-pct-text ${isArrear ? 'color-arrear-100' : (isWarn ? 'color-danger' : 'color-green')}">${item.pct}%</span>
          </div>
        </div>

        ${isArrear ? `
          <div class="att-arrear-note">
            Γ£à <strong>Arrear Attendance Verified:</strong> Re-examination candidate has satisfied the full <strong>100% mandatory attendance clearance</strong> for laboratory/theory re-registration.
          </div>
        ` : (isWarn ? `
          <div class="att-warn-note">
            ΓÜá∩╕Å <strong>Action Required:</strong> You need to attend <strong>${item.needed || 3} more consecutive lectures</strong> without absence to cross the mandatory 75% examination eligibility threshold.
          </div>
        ` : '')}

        <div class="att-card-actions">
          <button class="action-btn-sm" onclick="CampusApp.triggerQuery('What is the attendance policy and examination condonation rules for ${item.code}?')">
            ≡ƒÆ¼ Ask AI Attendance Rules
          </button>
        </div>
      `;
      DOM.attendanceGridContainer.appendChild(card);
    });
  }

  function setupSubjectRegLogic() {
    const checkboxes = document.querySelectorAll('.subj-check');
    const MAX_REGULAR_SUBJECTS = 4;

    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const checkedBoxes = Array.from(document.querySelectorAll('.subj-check:checked'));

        // Check if exceeded limit of 4
        if (checkedBoxes.length > MAX_REGULAR_SUBJECTS) {
          e.target.checked = false;
          showToast(`ΓÜá∩╕Å Registration Limit: A student can register for a maximum of 4 regular subjects per semester.`);
          return;
        }

        updateSubjectCounts();
      });
    });

    function updateSubjectCounts() {
      const selected = Array.from(document.querySelectorAll('.subj-check:checked'));
      let totalCredits = 0;
      const newEnrolled = [];

      selected.forEach(c => {
        const cr = parseInt(c.getAttribute('data-credits') || 0, 10);
        totalCredits += cr;
        newEnrolled.push({
          code: c.getAttribute('data-code'),
          name: c.getAttribute('data-name'),
          credits: cr,
          faculty: c.getAttribute('data-faculty') || 'Faculty In-Charge',
          attended: 42,
          total: 48,
          pct: 87.5,
          type: 'regular'
        });
      });

      if (DOM.selectedSubjectsCount) DOM.selectedSubjectsCount.textContent = selected.length;
      if (DOM.selectedCreditsCount) DOM.selectedCreditsCount.textContent = totalCredits;
      if (DOM.heroEnrolledCredits) DOM.heroEnrolledCredits.textContent = totalCredits;
      if (DOM.heroEnrolledSubjects) DOM.heroEnrolledSubjects.textContent = `${selected.length} Subjects`;

      // Sync active enrolled list
      if (newEnrolled.length > 0) {
        ENROLLED_SUBJECTS = newEnrolled;
      }
    }

    // Live 2-day countdown timer simulation
    let secondsLeft = 146445; // ~1 day, 16 hours, 40 mins
    const timerEl = document.getElementById('regCountdownText');
    if (timerEl) {
      setInterval(() => {
        if (secondsLeft > 0) {
          secondsLeft--;
          const days = Math.floor(secondsLeft / 86400);
          const hours = Math.floor((secondsLeft % 86400) / 3600);
          const mins = Math.floor((secondsLeft % 3600) / 60);
          const secs = secondsLeft % 60;
          timerEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
        } else {
          timerEl.textContent = 'EXPIRED (Closed)';
          lockRegistration(true);
        }
      }, 1000);
    }

    function lockRegistration(isExpired = false) {
      const selected = Array.from(document.querySelectorAll('.subj-check:checked'));
      const checkboxes = document.querySelectorAll('.subj-check');
      checkboxes.forEach(cb => cb.disabled = true);

      const lockedCard = document.getElementById('regLockedCard');
      const actionRow = document.getElementById('regFormActionRow');
      const lockedText = document.getElementById('lockedSubjCountText');

      if (lockedCard) lockedCard.classList.remove('hidden');
      if (actionRow) actionRow.style.display = 'none';

      if (lockedText) {
        const codes = selected.map(c => c.getAttribute('data-code')).join(', ');
        lockedText.textContent = `${selected.length} Courses (${DOM.selectedCreditsCount ? DOM.selectedCreditsCount.textContent : '15'} Credits): ${codes || 'None'}`;
      }

      if (isExpired) {
        showToast('ΓÜá∩╕Å Registration window has expired and is now officially closed.');
      }
    }

    window.CampusApp.reopenRegistrationDemo = function () {
      const checkboxes = document.querySelectorAll('.subj-check');
      checkboxes.forEach(cb => cb.disabled = false);
      const lockedCard = document.getElementById('regLockedCard');
      const actionRow = document.getElementById('regFormActionRow');
      if (lockedCard) lockedCard.classList.add('hidden');
      if (actionRow) actionRow.style.display = 'flex';
      showToast('≡ƒöä Course Registration window re-opened (Demo Mode).');
    };

    if (DOM.btnSubmitSubjectReg) {
      DOM.btnSubmitSubjectReg.addEventListener('click', () => {
        const selected = Array.from(document.querySelectorAll('.subj-check:checked'));
        const count = selected.length;
        if (count === 0) {
          showToast('Please select at least 1 course before submitting.');
          return;
        }
        if (count > MAX_REGULAR_SUBJECTS) {
          showToast('Cannot register more than 4 regular subjects per semester.');
          return;
        }

        if (confirm(`Confirm submission of ${count} subject(s) for Fall 2026? Once confirmed, the 2-day registration window will be closed and locked.`)) {
          updateSubjectCounts();
          renderAttendanceList('all');
          lockRegistration(false);
          showToast(`≡ƒöÆ Course Registration successfully confirmed and closed (${count} Subjects enrolled)!`);
        }
      });
    }

    // Arrear check fee update
    if (DOM.checkArrear1) {
      DOM.checkArrear1.addEventListener('change', (e) => {
        const checked = e.target.checked;
        const fee = checked ? '$45.00' : '$0.00';
        if (DOM.totalArrearFeeDisplay) DOM.totalArrearFeeDisplay.textContent = fee;
        if (DOM.arrearTotalPayable) DOM.arrearTotalPayable.textContent = fee;
        if (DOM.arrearCountText) DOM.arrearCountText.textContent = checked ? '1 Paper' : '0 Papers';
        if (DOM.heroPendingArrear) DOM.heroPendingArrear.textContent = checked ? '1' : '0';
      });
    }

    if (DOM.btnRegisterArrearPay) {
      DOM.btnRegisterArrearPay.addEventListener('click', () => {
        if (!DOM.checkArrear1.checked) {
          showToast('Please select at least one arrear subject to register.');
          return;
        }
        executeSimulatedPayment('Arrear Re-Examination (MA1301)', '45.00');
      });
    }

    // Payment category select
    if (DOM.payCategory) {
      DOM.payCategory.addEventListener('change', (e) => {
        const val = e.target.value;
        let amt = '45.00';
        if (val === 'bus') amt = '650.00';
        if (val === 'reval') amt = '30.00';
        if (val === 'fines') amt = '12.00';
        if (DOM.payAmount) DOM.payAmount.value = amt;
        if (DOM.btnExecutePayment) DOM.btnExecutePayment.textContent = `≡ƒöÆ Complete Secure Payment ($${amt})`;
      });
    }

    if (DOM.btnExecutePayment) {
      DOM.btnExecutePayment.addEventListener('click', () => {
        const cat = DOM.payCategory.options[DOM.payCategory.selectedIndex].text;
        const amt = DOM.payAmount.value;
        executeSimulatedPayment(cat, amt);
      });
    }
  }

  function executeSimulatedPayment(purpose, amount) {
    const recId = 'REC-2026-' + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Append to payment history
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><code>${recId}</code></td>
      <td>${dateStr}</td>
      <td>${purpose}</td>
      <td>Card / Online</td>
      <td><strong>$${amount}</strong></td>
      <td><button class="btn-link-xs" onclick="CampusApp.viewReceipt('${recId}', '$${amount}', '${purpose}')">≡ƒôä PDF</button></td>
    `;
    if (DOM.paymentHistoryBody) {
      DOM.paymentHistoryBody.prepend(row);
    }

    // Update arrear badges if arrear was paid
    if (purpose.toLowerCase().includes('arrear')) {
      if (DOM.arrearFeeStatusBadge) {
        DOM.arrearFeeStatusBadge.className = 'badge-status-paid';
        DOM.arrearFeeStatusBadge.textContent = `Γ£ô Paid (Receipt #${recId})`;
      }
      if (DOM.arrearRowStatus) {
        DOM.arrearRowStatus.className = 'card-tag tag-success';
        DOM.arrearRowStatus.textContent = 'Paid';
      }
    }

    showToast(`≡ƒÆ│ Payment of $${amount} successful! Receipt #${recId} generated.`);
  }

  // =========================================================================
  // WEBCHAT CORE: SEND & PROCESS MESSAGE
  // =========================================================================
  function handleSendMessage(overrideText) {
    const rawText = (overrideText !== undefined ? overrideText : DOM.chatInput.value).trim();
    if (!rawText) return;

    if (AppState.currentView !== 'webchat') {
      switchView('webchat');
    }

    DOM.chatInput.value = '';
    playAudioChime('send');

    // 1. Render User Message
    const userMsgRecord = {
      sender: 'user',
      text: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    AppState.chatHistory.push(userMsgRecord);
    renderMessage(userMsgRecord);

    // Show Typing indicator
    DOM.typingIndicator.classList.remove('hidden');
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;

    // 2. Process via Dialogue Engine
    setTimeout(() => {
      const result = dialogueManager.process(rawText);
      AppState.lastNluResult = result;

      // Update Analytics
      AppState.totalQueriesHandled++;
      AppState.intentCounts[result.nlu.intent] = (AppState.intentCounts[result.nlu.intent] || 0) + 1;
      AppState.latencyRecords.push(result.nlu.latencyMs);
      if (result.nlu.intent === 'fallback') AppState.fallbackCount++;

      // Hide Typing indicator
      DOM.typingIndicator.classList.add('hidden');

      // 3. Render Bot Response
      const botMsgRecord = {
        sender: 'bot',
        text: result.dialogue.response,
        html: result.dialogue.html,
        intent: result.nlu.intent,
        confidence: result.nlu.confidence,
        entities: result.nlu.entities,
        latencyMs: result.nlu.latencyMs,
        quickReplies: result.dialogue.quickReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      AppState.chatHistory.push(botMsgRecord);
      renderMessage(botMsgRecord);
      renderQuickReplies(result.dialogue.quickReplies);

      // Play Bot Chime
      playAudioChime('receive');

      // Update Live UI Status
      DOM.sessionTurnCount.textContent = result.dialogue.state.turnCount;
      DOM.sessionActiveDept.textContent = result.dialogue.state.activeDepartment || 'CSE';
      DOM.sessionActiveSem.textContent = result.dialogue.state.activeSemester || 'Semester 4';
      DOM.liveLatencyBadge.textContent = `ΓÜí Latency: ${result.nlu.latencyMs} ms ΓÇó NLU: ${Math.round(result.nlu.confidence * 100)}%`;

      // Update Inspector Drawer
      updateNluInspector(result);

    }, Math.min(450, Math.max(180, rawText.length * 8)));
  }

  /**
   * Render single message in WebChat view
   */
  function renderMessage(msg) {
    const msgEl = document.createElement('div');
    msgEl.className = `msg-row ${msg.sender === 'user' ? 'msg-user-row' : 'msg-bot-row'}`;

    if (msg.sender === 'user') {
      msgEl.innerHTML = `
        <div class="msg-bubble user-bubble">
          <div class="msg-text">${escapeHtml(msg.text)}</div>
          <span class="msg-time">${msg.timestamp}</span>
        </div>
        <div class="user-avatar-sm">You</div>
      `;
    } else {
      const nluBadge = msg.intent ? `
        <div class="msg-nlu-tag" title="Detected Intent: ${msg.intent} (${Math.round(msg.confidence * 100)}% confidence)">
          <span>≡ƒÄ» ${msg.intent}</span>
          <span class="conf-pill">${Math.round(msg.confidence * 100)}%</span>
        </div>
      ` : '';

      msgEl.innerHTML = `
        <div class="bot-avatar-sm">AI</div>
        <div class="msg-bubble bot-bubble">
          ${nluBadge}
          <div class="msg-text">${msg.html || escapeHtml(msg.text)}</div>
          <div class="msg-footer">
            <span class="msg-time">${msg.timestamp}</span>
            <div class="msg-actions">
              <button class="msg-action-btn" onclick="CampusApp.speakResponse('${escapeForJs(msg.text)}')" title="Listen to message">≡ƒöè</button>
              <button class="msg-action-btn" onclick="CampusApp.copyMessageText('${escapeForJs(msg.text)}')" title="Copy text">≡ƒôï</button>
              <button class="msg-action-btn" onclick="CampusApp.rateResponse(this, 'up')" title="Helpful response">≡ƒæì</button>
              <button class="msg-action-btn" onclick="CampusApp.rateResponse(this, 'down')" title="Needs improvement">≡ƒæÄ</button>
            </div>
          </div>
        </div>
      `;
    }

    DOM.chatMessages.appendChild(msgEl);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  }

  /**
   * Render quick reply suggestion buttons
   */
  function renderQuickReplies(replies) {
    DOM.quickRepliesRibbon.innerHTML = '';
    if (!replies || replies.length === 0) return;

    replies.forEach(reply => {
      const chip = document.createElement('button');
      chip.className = 'quick-reply-chip';
      chip.textContent = reply;
      chip.onclick = () => handleSendMessage(reply);
      DOM.quickRepliesRibbon.appendChild(chip);
    });
  }

  // NLU Inspector removed as requested
  function updateNluInspector(result) {
    // Cleanly retired
  }

  // =========================================================================
  // KNOWLEDGE BASE EXPLORER
  // =========================================================================
  function renderKnowledgeBase(category, searchQuery = '') {
    DOM.kbGridContainer.innerHTML = '';
    const query = searchQuery.toLowerCase().trim();
    const records = [];

    // 1. Departments
    if (category === 'all' || category === 'departments') {
      KB.departments.forEach(dept => {
        records.push({
          category: 'Academic Departments',
          title: `≡ƒÄô ${dept.name} (${dept.code})`,
          tag: 'Department',
          content: `
            <p><strong>HOD:</strong> ${dept.hod}</p>
            <p><strong>Location:</strong> ${dept.office}</p>
            <p><strong>Contact:</strong> ${dept.email} | ${dept.phone}</p>
            <p><strong>Programs:</strong> ${dept.programs.join(', ')}</p>
          `,
          askPrompt: `Tell me about ${dept.code} department and syllabus`
        });
      });
    }

    // 2. Exam Schedules
    if (category === 'all' || category === 'exams') {
      KB.examSchedules.forEach(exam => {
        records.push({
          category: 'Exam Schedules',
          title: `≡ƒôà ${exam.semester} - ${exam.type}`,
          tag: 'Exams',
          content: `
            <p><strong>Window:</strong> ${exam.startDate} to ${exam.endDate}</p>
            <p><strong>Timing:</strong> ${exam.sessionTime}</p>
            <p><strong>Hall Ticket:</strong> ${exam.hallTicketRelease}</p>
          `,
          askPrompt: `What is the exam timetable for ${exam.semester}?`
        });
      });
    }

    // 3. Fees & Scholarships
    if (category === 'all' || category === 'fees') {
      records.push({
        category: 'Fees & Scholarships',
        title: '≡ƒÆ│ Tuition Fee Schedule & Payment Due Dates',
        tag: 'Finance',
        content: `
          <p><strong>B.Tech:</strong> ${KB.fees.btechTuition}</p>
          <p><strong>M.Tech:</strong> ${KB.fees.mtechTuition}</p>
          <p><strong>MBA:</strong> ${KB.fees.mbaTuition}</p>
          <p><strong>Due Date:</strong> ${KB.fees.paymentDueDates}</p>
        `,
        askPrompt: 'What is the tuition fee structure?'
      });

      KB.fees.scholarships.forEach(s => {
        records.push({
          category: 'Fees & Scholarships',
          title: `≡ƒÅå ${s.name}`,
          tag: 'Scholarship',
          content: `
            <p><strong>Criteria:</strong> ${s.criteria}</p>
            <p><strong>Application Deadline:</strong> ${s.applyBy}</p>
          `,
          askPrompt: `How to apply for ${s.name}?`
        });
      });
    }

    // 4. Hostels
    if (category === 'all' || category === 'hostels') {
      records.push({
        category: 'Hostels & Dining',
        title: '≡ƒÅó Campus Residences & Dining Hall Timings',
        tag: 'Hostel',
        content: `
          <p><strong>Curfew:</strong> ${KB.hostels.curfew}</p>
          <p><strong>Mess Timings:</strong> ${KB.hostels.messTimings}</p>
          <p><strong>Double AC Room:</strong> ${KB.hostels.fees.acDouble}</p>
          <p><strong>Non-AC Room:</strong> ${KB.hostels.fees.nonAcDouble}</p>
        `,
        askPrompt: 'What are the hostel fees and mess timings?'
      });
    }

    // 5. Library
    if (category === 'all' || category === 'library') {
      records.push({
        category: 'Library & Digital',
        title: `≡ƒôû ${KB.library.name}`,
        tag: 'Library',
        content: `
          <p><strong>Location:</strong> ${KB.library.location}</p>
          <p><strong>Timings:</strong> ${KB.library.timings}</p>
          <p><strong>Exam Weeks:</strong> ${KB.library.duringExams}</p>
          <p><strong>E-Resources:</strong> ${KB.library.services}</p>
        `,
        askPrompt: 'What are the library hours and quiet study rooms?'
      });
    }

    // 6. Placements
    if (category === 'all' || category === 'placements') {
      records.push({
        category: 'Placements',
        title: `≡ƒÆ╝ Campus Placements & Internships (${KB.placements.statsYear})`,
        tag: 'Placement',
        content: `
          <p><strong>Highest Offer:</strong> ${KB.placements.highestPackage}</p>
          <p><strong>Average Salary:</strong> ${KB.placements.averagePackage}</p>
          <p><strong>Placement Rate:</strong> ${KB.placements.placementRate}</p>
          <p><strong>Top Recruiters:</strong> ${KB.placements.topRecruiters.slice(0, 6).join(', ')}</p>
        `,
        askPrompt: 'Tell me about campus placements and companies'
      });
    }

    // 7. Events
    if (category === 'all' || category === 'events') {
      KB.events.forEach(ev => {
        records.push({
          category: 'Events & Fests',
          title: `≡ƒÄë ${ev.name}`,
          tag: 'Event',
          content: `
            <p><strong>Date:</strong> ${ev.date}</p>
            <p><strong>Venue:</strong> ${ev.venue}</p>
            ${ev.prizePool ? `<p><strong>Prize:</strong> ${ev.prizePool}</p>` : ''}
          `,
          askPrompt: `When is ${ev.name}?`
        });
      });
    }

    // 8. Transport
    if (category === 'all' || category === 'transport') {
      records.push({
        category: 'Transport & Buses',
        title: '≡ƒÜî Campus Bus Network & Timings',
        tag: 'Transport',
        content: `
          <p><strong>Routes:</strong> ${KB.transport.buses}</p>
          <p><strong>Morning Arrival:</strong> ${KB.transport.morningArrival}</p>
          <p><strong>Evening Trips:</strong> ${KB.transport.eveningDeparture}</p>
        `,
        askPrompt: 'College bus routes and timings'
      });
    }

    // 9. IT Support
    if (category === 'all' || category === 'it') {
      records.push({
        category: 'Wi-Fi & IT Support',
        title: '≡ƒô╢ University Wi-Fi & IT Helpdesk',
        tag: 'IT Support',
        content: `
          <p><strong>SSID:</strong> ${KB.itSupport.wifiSSID}</p>
          <p><strong>Portal:</strong> ${KB.itSupport.loginPortal}</p>
          <p><strong>Quota:</strong> ${KB.itSupport.quota}</p>
        `,
        askPrompt: 'How to connect to campus wifi?'
      });
    }

    const filtered = records.filter(rec => {
      if (!query) return true;
      const combined = `${rec.title} ${rec.category} ${rec.content} ${rec.tag}`.toLowerCase();
      return combined.includes(query);
    });

    if (filtered.length === 0) {
      DOM.kbGridContainer.innerHTML = `
        <div class="no-records-msg">
          <p>≡ƒöì No matching campus records found for "<strong>${escapeHtml(searchQuery)}</strong>".</p>
          <button class="action-btn-sm" onclick="CampusApp.clearKbSearch()">Reset Search</button>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'kb-card';
      card.innerHTML = `
        <div class="kb-card-header">
          <span class="card-tag tag-primary">${item.tag}</span>
          <h4>${item.title}</h4>
        </div>
        <div class="kb-card-body">
          ${item.content}
        </div>
        <div class="kb-card-footer">
          <button class="action-btn-sm" onclick="CampusApp.triggerQuery('${escapeForJs(item.askPrompt)}')">
            ≡ƒÆ¼ Ask AI about this
          </button>
        </div>
      `;
      DOM.kbGridContainer.appendChild(card);
    });
  }

  // =========================================================================
  // ANALYTICS HUB REFRESH
  // =========================================================================
  function refreshAnalytics() {
    DOM.kpiTotalQueries.textContent = AppState.totalQueriesHandled;
    
    // Average Latency
    const sumLat = AppState.latencyRecords.reduce((a, b) => a + b, 0);
    const avgLat = Math.round(sumLat / Math.max(1, AppState.latencyRecords.length));
    DOM.kpiAvgLatency.textContent = `${avgLat} ms`;

    // Fallback rate
    const fbRate = Math.round((AppState.fallbackCount / Math.max(1, AppState.totalQueriesHandled)) * 1000) / 10;
    DOM.kpiFallbackRate.textContent = `${fbRate}%`;

    // Escalation tickets
    const tickets = dialogueManager.context.escalationTickets;
    DOM.kpiTicketsCount.textContent = tickets.length;

    // Render Intent Distribution
    DOM.intentDistributionList.innerHTML = '';
    const sortedIntents = Object.entries(AppState.intentCounts).sort((a, b) => b[1] - a[1]);

    sortedIntents.forEach(([intent, count]) => {
      const pct = Math.round((count / AppState.totalQueriesHandled) * 100);
      const row = document.createElement('div');
      row.className = 'intent-bar-row';
      row.innerHTML = `
        <div class="bar-info">
          <code>${intent}</code>
          <span>${count} queries (${pct}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${pct}%"></div>
        </div>
      `;
      DOM.intentDistributionList.appendChild(row);
    });

    // Render Tickets Table
    if (tickets.length === 0) {
      DOM.ticketsQueueTable.innerHTML = `<p style="color:var(--text-muted); font-size:0.9em; padding:10px 0;">No active support tickets. All student queries resolved automatedly.</p>`;
    } else {
      let tblHtml = `
        <table class="data-table">
          <thead>
            <tr><th>Ticket ID</th><th>Student Query</th><th>Timestamp</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
      `;
      tickets.forEach(t => {
        tblHtml += `
          <tr>
            <td><code>${t.id}</code></td>
            <td>${escapeHtml(t.query)}</td>
            <td>${t.timestamp}</td>
            <td><span class="pill-code" style="background:#fef3c7; color:#92400e;">${t.status}</span></td>
            <td><button class="btn-tool" onclick="alert('Ticket ${t.id} details opened for campus advisor review.')">Review</button></td>
          </tr>
        `;
      });
      tblHtml += `</tbody></table>`;
      DOM.ticketsQueueTable.innerHTML = tblHtml;
    }
  }

  // =========================================================================
  // UTILITIES (Export, Print, Reset)
  // =========================================================================
  function exportChatTranscript() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(AppState.chatHistory, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `campus_chat_transcript_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('≡ƒôÑ Chat transcript downloaded as JSON.');
  }

  function printChat() {
    window.print();
  }

  function resetChat() {
    if (confirm('Start a new conversation? Current chat history will be cleared.')) {
      dialogueManager.resetContext();
      AppState.chatHistory = [];
      DOM.chatMessages.innerHTML = '';
      sendInitialGreeting();
      showToast('Γ£¿ Started fresh AI conversation.');
    }
  }

  function clearHistory() {
    DOM.chatMessages.innerHTML = '';
    AppState.chatHistory = [];
    sendInitialGreeting();
  }

  function sendInitialGreeting() {
    const initPayload = dialogueManager.generateResponse('greeting', [], { lemmas: [] }, 'hello');
    const greetingMsg = {
      sender: 'bot',
      text: initPayload.text,
      html: initPayload.html,
      intent: 'greeting',
      confidence: 1.0,
      entities: [],
      latencyMs: 14,
      quickReplies: initPayload.quickReplies,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    AppState.chatHistory.push(greetingMsg);
    renderMessage(greetingMsg);
    renderQuickReplies(initPayload.quickReplies);

    updateNluInspector({
      userMessage: 'hello',
      nlu: {
        intent: 'greeting',
        confidence: 1.0,
        entities: [],
        preprocessed: { rawTokens: ['hello'], cleanTokens: ['hello'], lemmas: ['hello'] },
        latencyMs: 14,
        topScores: [
          { intent: 'greeting', score: 1.0 },
          { intent: 'bot_identity', score: 0.2 },
          { intent: 'course_info', score: 0.05 }
        ]
      },
      dialogue: {
        state: { activeDepartment: 'CSE', activeSemester: 'Semester 4', missingSlot: null, turnCount: 1 },
        response: initPayload.text,
        quickReplies: initPayload.quickReplies
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeForJs(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, ' ');
  }

  // =========================================================================
  // GLOBAL APPLICATION API
  // =========================================================================
  window.CampusApp = {
    triggerQuery: function (queryText) {
      switchView('webchat');
      handleSendMessage(queryText);
    },
    switchHomeSubTab: function (subTabName) {
      switchView('home');
      switchHomeSubTab(subTabName);
    },
    openModal: function (modalId) {
      openModal(modalId);
    },
    closeModal: function (modalId) {
      closeModal(modalId);
    },
    openProfileModal: function () {
      openStudentProfileModal();
    },
    closeProfileModal: function () {
      closeStudentProfileModal();
    },
    filterAttendance: function (category) {
      document.querySelectorAll('.attendance-filter-chips .filter-pill').forEach(p => p.classList.remove('active'));
      const activeBtn = event ? event.target.closest('.filter-pill') : null;
      if (activeBtn) activeBtn.classList.add('active');
      renderAttendanceList(category);
    },
    openQuickPayModal: function () {
      switchHomeSubTab('paymentDetails');
      showToast('Opened payment gateway panel.');
    },
    viewReceipt: function (receiptId, amount, purpose) {
      alert(`=== OFFICIAL UNIVERSITY DIGITAL RECEIPT ===\n\nReceipt No: ${receiptId}\nPayment For: ${purpose}\nAmount Paid: ${amount}\nDate: 17-Aug-2026\nStatus: Transaction Successful & Verified\nIssuer: University Bursar Office\n\n(Printed copy will be downloaded)`);
    },
    downloadSchedule: function (semester) {
      alert(`Downloading official examination schedule PDF for ${semester} (Verified by Office of the Controller of Examinations).`);
    },
    speakResponse: function (text) {
      speakText(text);
    },
    copyMessageText: function (text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('≡ƒôï Response copied to clipboard!');
      });
    },
    rateResponse: function (btn, direction) {
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
      showToast(direction === 'up' ? '≡ƒæì Thank you for your feedback!' : '≡ƒæÄ Noted. We will improve our responses.');
    },
    clearKbSearch: function () {
      DOM.kbSearchInput.value = '';
      renderKnowledgeBase('all');
    },
    refreshAnalytics: function () {
      refreshAnalytics();
      showToast('≡ƒôè Metrics updated.');
    }
  };

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================
  function initEventListeners() {
    // Tab Navigation
    DOM.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchView(btn.getAttribute('data-view'));
      });
    });

    // Home Sub-Tab Navigation
    DOM.subTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchHomeSubTab(btn.getAttribute('data-subtab'));
      });
    });

    // Student Profile Modal Triggers & Escape key
    if (DOM.userProfileBadge) {
      DOM.userProfileBadge.style.cursor = 'pointer';
      DOM.userProfileBadge.addEventListener('click', (e) => {
        if (e.target.id !== 'btnLogout') {
          openStudentProfileModal();
        }
      });
    }

    // Profile Modal specific button trigger
    const btnViewProfileHero = document.getElementById('btnViewProfileHero');
    if (btnViewProfileHero) {
      btnViewProfileHero.addEventListener('click', (e) => {
        e.stopPropagation();
        openStudentProfileModal();
      });
    }

    if (DOM.btnProfileModalClose) {
      DOM.btnProfileModalClose.addEventListener('click', closeStudentProfileModal);
    }

    if (DOM.btnProfileModalOk) {
      DOM.btnProfileModalOk.addEventListener('click', closeStudentProfileModal);
    }

    // Modal background click & Escape key dismiss for all modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => {
          m.classList.add('hidden');
          m.style.removeProperty('display');
        });
      }
    });

    const profModalEl = document.getElementById('studentProfileModal');
    if (profModalEl) {
      profModalEl.addEventListener('click', (e) => {
        if (e.target === profModalEl) {
          closeStudentProfileModal();
        }
      });
    }

    // Theme & Sound
    DOM.btnThemeToggle.addEventListener('click', toggleTheme);
    DOM.btnSoundToggle.addEventListener('click', toggleSound);

    // WebChat Form
    DOM.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage();
    });

    // Voice Mic
    DOM.btnVoiceInput.addEventListener('click', toggleVoiceInput);

    // Toolbar actions
    DOM.btnResetChat.addEventListener('click', resetChat);
    DOM.btnExportChat.addEventListener('click', exportChatTranscript);
    DOM.btnPrintChat.addEventListener('click', printChat);
    DOM.btnClearChatHistory.addEventListener('click', clearHistory);

    // Knowledge Base Filters & Search
    DOM.kbFilters.addEventListener('click', (e) => {
      const chip = e.target.closest('.kb-filter-chip');
      if (!chip) return;
      document.querySelectorAll('.kb-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderKnowledgeBase(chip.getAttribute('data-cat'), DOM.kbSearchInput.value);
    });

    DOM.kbSearchInput.addEventListener('input', (e) => {
      const activeChip = document.querySelector('.kb-filter-chip.active');
      const cat = activeChip ? activeChip.getAttribute('data-cat') : 'all';
      renderKnowledgeBase(cat, e.target.value);
    });

    // Logout
    DOM.btnLogout.addEventListener('click', () => {
      if (confirm('Log out from AI Campus Assistant?')) {
        window.location.href = 'index.html';
      }
    });

    setupSubjectRegLogic();
  }

  // =========================================================================
  // APPLICATION INIT
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    sendInitialGreeting();
    renderAttendanceList('all');
    renderKnowledgeBase('all');
    refreshAnalytics();

    // Check remembered student name
    const remembered = localStorage.getItem('campusRememberedUser');
    const rememberedName = localStorage.getItem('campusUserName');
    if (rememberedName) {
      if (DOM.homeGreetingName) DOM.homeGreetingName.textContent = `Welcome back, ${rememberedName} ≡ƒæï`;
      if (DOM.userNameLabel) DOM.userNameLabel.textContent = rememberedName;
      if (DOM.userAvatarInitials) DOM.userAvatarInitials.textContent = rememberedName.substring(0, 2).toUpperCase();
    } else if (remembered) {
      const userPart = remembered.split('@')[0];
      const displayName = userPart.charAt(0).toUpperCase() + userPart.slice(1);
      if (DOM.homeGreetingName) DOM.homeGreetingName.textContent = `Welcome back, ${displayName} ≡ƒæï`;
      if (DOM.userNameLabel) DOM.userNameLabel.textContent = displayName;
    }
  });

})();
