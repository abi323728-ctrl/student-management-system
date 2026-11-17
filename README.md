# NXTLOGIC — Professional Student Management System (SMS)

A complete, modern, responsive **Student Management System** built with **Python FastAPI**, **SQLAlchemy ORM**, **JWT Authentication**, and a premium **React + Tailwind CSS** SaaS dashboard.

---

## 🌟 Modules & Features

### 1. Unified Authentication Portal (`/`)
- **Student Login**: Authenticate with email & password, JWT token issuance.
- **Student Registration**: Input validation, duplicate email/roll number prevention, and automated enrollment into the database.
- **Administrator Portal**: Protected master login for administrative oversight.
- **Demo Autofill**: One-click test credential population for instant evaluation.

### 2. Student Module (`/student`)
- **Personal Information**: Full Name, Email, Phone, Date of Birth, Residential Address.
- **Academic Standing**: Roll No / Student ID, Department, Year, Cumulative GPA (10.0 scale).
- **Course Enrollment Record**: Table of enrolled semester courses, course codes, credits, and grades.
- **Edit Profile**: Modal form to update contact info, department, year, and address in real-time.
- **Change Password**: Secure validation of current password and updates to new password.
- **Session Logout**: Token expiration and automatic redirection to the login portal.

### 3. Admin Module (`/admin`)
- **Executive Analytics Overview**:
  - Total student enrollment counter.
  - Institutional average CGPA metric.
  - Department distribution breakdown badges.
- **Full Student CRUD Operations**:
  - **Create**: *Enroll New Student* modal with validation.
  - **Read**: Responsive data table with instant search (by Name, Email, ID) and multi-stream filtering (Department, Year).
  - **Update**: *Edit Student* modal pre-filled with existing data.
  - **Delete**: *Delete Student* with confirmation prompt.
- **Secure Sign Out**: Destroys administrator session token.

---

## 🚀 Running on Localhost

### One-Click Launch (Windows):
Double-click **`start.bat`** in the project folder.

### Manual Launch via Terminal:
```powershell
cd C:\Users\ABISHEK\Desktop\INTERSHIP_NEXTLOGIC
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Then open your browser at:
👉 **`http://localhost:8000`**

- **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`
- **Alternative ReDoc**: `http://localhost:8000/redoc`

---

## 🔑 Pre-seeded Review Demo Accounts

| Role | Email | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Student** | `student@nxtlogic.com` | `Student@2026` | `http://localhost:8000/` (Student tab) |
| **Administrator** | `admin@nxtlogic.com` | `Admin@2026` | `http://localhost:8000/` (Admin tab) |

---

## 🧪 Automated Testing

Run the automated test suite covering authentication, duplicate checks, student profile updates, and admin CRUD:
```powershell
python -m pytest tests/
```
All 6 test suites pass with 100% success rate.
