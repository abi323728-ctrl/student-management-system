/**
 * Client-Side Interactive Script
 * Handles real-time validation, DOM updates, password toggling, and asynchronous login
 */

import { validateEmail, validatePassword, validateLoginForm } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const form = document.getElementById('loginForm');
  const loginCard = document.querySelector('.login-card');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const groupEmail = document.getElementById('groupEmail');
  const groupPassword = document.getElementById('groupPassword');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const emailStatusIcon = document.getElementById('emailStatusIcon');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = submitBtn.querySelector('.btn-text');
  const alertBanner = document.getElementById('alertBanner');
  const alertMessage = document.getElementById('alertMessage');
  const fillDemoBtn = document.getElementById('fillDemoBtn');

  // Password rules elements
  const ruleLength = document.getElementById('ruleLength');
  const ruleUpper = document.getElementById('ruleUpper');
  const ruleNumber = document.getElementById('ruleNumber');
  const ruleSpecial = document.getElementById('ruleSpecial');

  // SVG Icons
  const CHECK_ICON = `<svg viewBox="0 0 20 20" width="16" height="16" fill="#10b981"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
  const ERROR_ICON = `<svg viewBox="0 0 20 20" width="16" height="16" fill="#f43f5e"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`;

  /**
   * Updates visual validation state for Email
   * @param {boolean} force - Force show error even if empty
   */
  function handleEmailValidation(force = false) {
    const value = emailInput.value;
    if (!force && value === '') {
      groupEmail.classList.remove('has-error', 'has-success');
      emailError.textContent = '';
      emailStatusIcon.innerHTML = '';
      return;
    }

    const { isValid, error } = validateEmail(value);

    if (isValid) {
      groupEmail.classList.remove('has-error');
      groupEmail.classList.add('has-success');
      emailError.textContent = '';
      emailStatusIcon.innerHTML = CHECK_ICON;
    } else {
      groupEmail.classList.remove('has-success');
      groupEmail.classList.add('has-error');
      emailError.textContent = error;
      emailStatusIcon.innerHTML = ERROR_ICON;
    }
  }

  /**
   * Updates visual validation state and live requirement checklist for Password
   * @param {boolean} force - Force show error even if empty
   */
  function handlePasswordValidation(force = false) {
    const value = passwordInput.value;

    // Real-time rule checklist tracking
    const hasLength = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value);

    ruleLength.classList.toggle('valid', hasLength);
    ruleUpper.classList.toggle('valid', hasUpper);
    ruleNumber.classList.toggle('valid', hasNumber);
    ruleSpecial.classList.toggle('valid', hasSpecial);

    if (!force && value === '') {
      groupPassword.classList.remove('has-error', 'has-success');
      passwordError.textContent = '';
      return;
    }

    const { isValid, error } = validatePassword(value);

    if (isValid) {
      groupPassword.classList.remove('has-error');
      groupPassword.classList.add('has-success');
      passwordError.textContent = '';
    } else {
      groupPassword.classList.remove('has-success');
      groupPassword.classList.add('has-error');
      passwordError.textContent = error;
    }
  }

  /**
   * Display top alert banner
   */
  function showAlert(message, type = 'error') {
    alertBanner.className = `alert-banner ${type}`;
    alertMessage.textContent = message;
    alertBanner.hidden = false;
  }

  function hideAlert() {
    alertBanner.hidden = true;
    alertMessage.textContent = '';
  }

  // Email Event Listeners
  emailInput.addEventListener('input', () => {
    hideAlert();
    handleEmailValidation(false);
  });

  emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim() !== '') {
      handleEmailValidation(true);
    }
  });

  // Password Event Listeners
  passwordInput.addEventListener('input', () => {
    hideAlert();
    handlePasswordValidation(false);
  });

  passwordInput.addEventListener('blur', () => {
    if (passwordInput.value !== '') {
      handlePasswordValidation(true);
    }
  });

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    togglePasswordBtn.title = isPassword ? 'Hide password' : 'Show password';

    togglePasswordBtn.innerHTML = isPassword
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>`;
  });

  // Demo Credentials Autofill
  fillDemoBtn.addEventListener('click', () => {
    hideAlert();
    emailInput.value = 'intern@nextlogic.com';
    passwordInput.value = 'NextLogic@2026';
    handleEmailValidation(true);
    handlePasswordValidation(true);
  });

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Validate all fields
    const formValidation = validateLoginForm({ email, password });

    if (!formValidation.isValid) {
      handleEmailValidation(true);
      handlePasswordValidation(true);

      // Trigger shake animation
      loginCard.classList.remove('shake');
      void loginCard.offsetWidth; // Force CSS reflow
      loginCard.classList.add('shake');

      showAlert('Please fix the errors highlighted in red below.', 'error');

      // Focus first erroneous input
      if (formValidation.errors.email) {
        emailInput.focus();
      } else if (formValidation.errors.password) {
        passwordInput.focus();
      }
      return;
    }

    // Submit state: loading
    submitBtn.disabled = true;
    btnSpinner.hidden = false;
    btnText.textContent = 'Authenticating...';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        btnText.textContent = 'Success! Redirecting...';
        showAlert(data.message || 'Login successful! Welcome to NextLogic.', 'success');

        setTimeout(() => {
          btnText.textContent = 'Sign in to Account';
          btnSpinner.hidden = true;
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      showAlert(err.message || 'An error occurred while connecting to localhost.', 'error');
      loginCard.classList.remove('shake');
      void loginCard.offsetWidth;
      loginCard.classList.add('shake');
    } finally {
      if (btnText.textContent === 'Authenticating...') {
        submitBtn.disabled = false;
        btnSpinner.hidden = true;
        btnText.textContent = 'Sign in to Account';
      }
    }
  });
});
