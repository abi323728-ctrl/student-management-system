# Student Management System (SMS) Implementation Plan

> **Goal:** Build a complete, professional, responsive Student Management System with Student and Admin modules, FastAPI backend, SQLAlchemy database, JWT auth, and React + Tailwind CSS dashboard.

## Proposed Architecture

### Backend (Python FastAPI)
- `app/database.py`: SQLAlchemy engine, session maker, `Base`.
- `app/models.py`: `Admin`, `Student`, `AcademicCourse`.
- `app/auth.py`: RFC 7519 compliant JWT HS256 encoder/decoder and salted SHA-256 password hashing.
- `app/schemas.py`: Pydantic request/response models.
- `app/routers/auth_router.py`: Register, student login, admin login endpoints.
- `app/routers/student_router.py`: Student profile get/update, change password.
- `app/routers/admin_router.py`: Admin analytics, student CRUD endpoints.
- `app/seed.py`: Initial demo accounts and students.
- `main.py`: FastAPI app instance with CORS, routers, and static file mounting.

### Tests (Pytest)
- `tests/test_sms_api.py`: Automated tests for auth (register/login), student profile operations, and admin CRUD.

### Frontend (React + Tailwind CSS + Lucide Icons)
- `public/index.html`: Unified authentication portal (Student Login, Student Register, Admin Login) with tab switching and demo autofill.
- `public/student.html`: Student dashboard (Personal & Academic overview, Edit Profile modal, Change Password tab).
- `public/admin.html`: Admin dashboard (Stats cards, enrollment metrics, full CRUD student management table with search and modal forms).
- `public/app.js`: Shared React state helpers, API client, and session protection.

## Verification
- Run `python -m pytest tests/` to confirm 100% test pass.
- Start server on `http://localhost:8000` and verify endpoints and browser views.
