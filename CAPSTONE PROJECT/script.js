/**
 * AI Campus Assistant - Authentication & Portal Login
 */

(function () {
  'use strict';

  const form = document.getElementById("loginForm");
  const identifier = document.getElementById("identifier");
  const password = document.getElementById("password");
  const identifierError = document.getElementById("identifierError");
  const passwordError = document.getElementById("passwordError");
  const statusMessage = document.getElementById("statusMessage");
  const loginBtn = document.querySelector(".login-btn");
  const loginText = document.getElementById("loginText");
  const togglePassword = document.getElementById("togglePassword");
  const btnPresetStudent = document.getElementById("btnPresetStudent");
  const btnPresetAdmin = document.getElementById("btnPresetAdmin");

  const DEMO_USERS = [
    { id: "student@campus.edu", pass: "Student@123", name: "Karthik Prashanth", role: "B.Tech CSE • Sem 4" },
    { id: "202411048", pass: "Student@123", name: "Karthik Prashanth", role: "B.Tech CSE (202411048)" },
    { id: "admin@campus.edu", pass: "Admin@123", name: "Campus Evaluator", role: "Faculty / Capstone Reviewer" }
  ];

  function clearErrors() {
    identifierError.textContent = "";
    passwordError.textContent = "";
    identifier.classList.remove("invalid");
    password.classList.remove("invalid");
    statusMessage.className = "status";
    statusMessage.textContent = "";
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!identifier.value.trim()) {
      identifierError.textContent = "Please enter your campus email or student ID.";
      identifier.classList.add("invalid");
      valid = false;
    }

    if (!password.value) {
      passwordError.textContent = "Please enter your password.";
      password.classList.add("invalid");
      valid = false;
    } else if (password.value.length < 4) {
      passwordError.textContent = "Password must contain at least 4 characters.";
      password.classList.add("invalid");
      valid = false;
    }

    return valid;
  }

  togglePassword.addEventListener("click", () => {
    const isPassword = password.type === "password";
    password.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";
    togglePassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  });

  function performLogin(enteredId, enteredPass) {
    loginBtn.disabled = true;
    loginBtn.classList.add("loading");
    loginText.textContent = "Authenticating with Campus Directory...";

    setTimeout(() => {
      const match = DEMO_USERS.find(
        u => u.id.toLowerCase() === enteredId.toLowerCase() && (u.pass === enteredPass || enteredPass === "Student@123" || enteredPass === "Admin@123")
      ) || { name: enteredId.split('@')[0], id: enteredId, role: "Student User" };

      statusMessage.className = "status success";
      statusMessage.textContent = `Login successful! Welcome, ${match.name}. Redirecting to Assistant...`;

      if (document.getElementById("remember").checked) {
        localStorage.setItem("campusRememberedUser", enteredId);
        localStorage.setItem("campusUserName", match.name);
      }

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    }, 600);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;
    performLogin(identifier.value.trim(), password.value);
  });

  // Quick Preset Handlers
  if (btnPresetStudent) {
    btnPresetStudent.addEventListener("click", () => {
      identifier.value = "student@campus.edu";
      password.value = "Student@123";
      performLogin("student@campus.edu", "Student@123");
    });
  }

  if (btnPresetAdmin) {
    btnPresetAdmin.addEventListener("click", () => {
      identifier.value = "admin@campus.edu";
      password.value = "Admin@123";
      performLogin("admin@campus.edu", "Admin@123");
    });
  }

  ["input", "change"].forEach((eventName) => {
    identifier.addEventListener(eventName, () => {
      identifier.classList.remove("invalid");
      identifierError.textContent = "";
    });
    password.addEventListener(eventName, () => {
      password.classList.remove("invalid");
      passwordError.textContent = "";
    });
  });

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");

  function showModal(title, text) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOk").addEventListener("click", closeModal);

  document.getElementById("forgotPassword").addEventListener("click", (event) => {
    event.preventDefault();
    showModal(
      "Password Reset",
      "In this Capstone Demo environment, use standard credentials student@campus.edu / Student@123 or click 'Quick One-Click Demo Access' to sign in instantly."
    );
  });

  window.addEventListener("DOMContentLoaded", () => {
    const remembered = localStorage.getItem("campusRememberedUser");
    if (remembered) {
      identifier.value = remembered;
      password.value = "Student@123";
    }
  });

})();
