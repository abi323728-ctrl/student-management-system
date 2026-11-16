# Design Document: Interactive User Login Page on Localhost

## 1. Overview
A modern, responsive, accessible, and interactive user login page built using pure HTML5, CSS3, and JavaScript, backed by a lightweight Node.js/Express server running on `http://localhost:3000`.

## 2. Requirements & Scope
- **Interactive UI**: Clean card design with smooth transitions, input focus rings, password visibility toggle, and responsive layouts for mobile and desktop.
- **Validation**:
  - Email/Username: Required, valid RFC-compliant email pattern.
  - Password: Required, minimum 8 characters, at least one uppercase letter, one digit, and one special symbol.
  - Interactive live validation on `input` and `blur` events with clear error hints.
- **Localhost Server**: Express static server serving `public/` on port 3000, plus a mock `/api/login` endpoint that validates authentication credentials and returns JSON status.
- **Automated Testing**: Node.js built-in test runner (`node:test` and `node:assert`) validating all validation rules against edge cases.
- **Documentation**: A detailed `README.md` step-by-step installation and running guide ready for mentor review.

