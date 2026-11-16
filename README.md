# Interactive User Login Page — NextLogic

A modern, interactive, and responsive user login web application built with **HTML5**, **CSS3**, **JavaScript (ES6 Modules)**, and a lightweight **Node.js** server running on `http://localhost:3000`.

---

## 🌟 Features

- **Modern Glassmorphic UI**: High-contrast, clean typography, ambient light effects, and responsive card design for desktop and mobile devices.
- **Interactive Real-Time Field Validation**:
  - **Email Address**: Validates required status and RFC-compliant email formatting on input and blur. Displays green checkmark indicator or red warning icon.
  - **Password**: Live security rule tracking with interactive indicators:
    - Minimum 8 characters
    - At least 1 uppercase letter
    - At least 1 numeric digit
    - At least 1 special character (`!@#$%^&*...`)
- **Show / Hide Password Toggle**: Interactive SVG eye icon to inspect or obscure password input.
- **Form Animation & Feedback**:
  - Shaking animation on card when invalid input is submitted.
  - Interactive spinner on submit button during authentication.
  - Clear, accessible error & success notification banners.
- **Demo Autofill**: One-click button to autofill test credentials for instant evaluation during review.
- **Built-in Automated Testing**: 16 unit & integration tests running via Node's native test runner (`node --test`).
- **Zero External Package Dependencies**: Standard Node.js built-ins (`node:http`, `node:fs`, `node:path`) ensuring instant startup on any machine without installation failures.

---

## 📂 Project Structure

```text
INTERSHIP_NEXTLOGIC/
├── public/
│   ├── index.html          # Semantic HTML5 login structure & accessible controls
│   ├── style.css           # Modern CSS3 styles, animations, variables, and responsive layout
│   ├── script.js           # Client-side DOM manipulation, event listeners, and API calls
│   └── validation.js       # Reusable pure validation functions (shared with test suite)
├── server.js               # Node.js localhost server (serves static files & POST /api/login)
├── test/
│   ├── validation.test.js  # Automated unit tests for validation rules
│   └── server.test.js      # Automated integration tests for localhost endpoints
├── package.json            # Project configuration & npm scripts ("start", "test")
├── docs/                   # Design specifications and implementation plans
└── README.md               # Step-by-step installation and running guide
```

---

## 🚀 Installation & Running Guide

### Step 1: Prerequisites
Ensure **Node.js** (version 18 or newer) is installed on your computer:
```bash
node -v
```

### Step 2: Open Terminal in Project Directory
Navigate into the project root directory:
```bash
cd c:\Users\ABISHEK\Desktop\INTERSHIP_NEXTLOGIC
```

### Step 3: Start the Localhost Server
Run the start command:
```bash
npm start
```
*(Or directly: `node server.js`)*

You will see the console confirmation:
```text
===============================================
🚀 NextLogic Login Server running on localhost!
👉 Open URL: http://localhost:3000
===============================================
```

### Step 4: Open in Your Browser
Open your favorite browser (Chrome, Edge, Firefox, Brave) and navigate to:
```text
http://localhost:3000
```

---

## 🧪 Automated Testing

To run the automated validation test suite:
```bash
npm test
```

### Test Coverage Highlights:
- **11 Unit Tests**: Covers empty fields, malformed emails, short passwords, missing uppercase/digits/symbols, and valid payloads.
- **5 Integration Tests**: Verifies `GET /`, `GET /style.css`, `GET /script.js`, `POST /api/login` 400 rejection on invalid data, and 200 OK on valid credentials.

---

## 🔑 Mentor Review Demo Credentials

You can test the application using:
- **Email**: `intern@nextlogic.com`
- **Password**: `NextLogic@2026`

*(Or click the **"Autofill Test Credentials"** button right inside the login card!)*

