import uuid
import pytest
from fastapi.testclient import TestClient
from main import app
from app.database import Base, engine, SessionLocal
from app.seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

@pytest.fixture
def client():
    return TestClient(app)

def test_admin_login_success(client):
    response = client.post("/api/auth/admin/login", json={
        "email": "admin@nxtlogic.com",
        "password": "Admin@2026"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "admin"

def test_admin_login_invalid(client):
    response = client.post("/api/auth/admin/login", json={
        "email": "admin@nxtlogic.com",
        "password": "WrongPassword123"
    })
    assert response.status_code == 401

def test_student_login_success(client):
    response = client.post("/api/auth/student/login", json={
        "email": "student@nxtlogic.com",
        "password": "Student@2026"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "student"

def test_student_registration_and_duplicate_check(client):
    payload = {
        "student_id": "NXT999",
        "name": "Test User",
        "email": "testuser@nxtlogic.com",
        "phone": "+91 9876543210",
        "department": "Computer Science",
        "year": "3rd Year",
        "address": "Bangalore, India",
        "dob": "2003-05-15",
        "password": "Password@123"
    }
    # First registration
    res1 = client.post("/api/auth/student/register", json=payload)
    assert res1.status_code == 201

    # Duplicate registration should fail
    res2 = client.post("/api/auth/student/register", json=payload)
    assert res2.status_code == 400
    assert "already registered" in res2.json()["detail"].lower()

def test_student_profile_update(client):
    # Login as student
    login_res = client.post("/api/auth/student/login", json={
        "email": "student@nxtlogic.com",
        "password": "Student@2026"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch profile
    get_res = client.get("/api/student/profile", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["email"] == "student@nxtlogic.com"

    # Update profile
    update_res = client.put("/api/student/profile", headers=headers, json={
        "phone": "+91 9999988888",
        "address": "Updated Address St, Tech City"
    })
    assert update_res.status_code == 200
    assert update_res.json()["address"] == "Updated Address St, Tech City"

def test_admin_crud_operations(client):
    # Login as admin
    login_res = client.post("/api/auth/admin/login", json={
        "email": "admin@nxtlogic.com",
        "password": "Admin@2026"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create student
    create_res = client.post("/api/admin/students", headers=headers, json={
        "student_id": "NXT888",
        "name": "Admin Created Student",
        "email": "admincreated@nxtlogic.com",
        "phone": "+91 9123456780",
        "department": "Information Technology",
        "year": "2nd Year",
        "cgpa": 8.5,
        "address": "Coimbatore, India",
        "dob": "2004-08-20",
        "password": "Password@2026"
    })
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    # 2. List with search
    list_res = client.get("/api/admin/students?search=Admin Created", headers=headers)
    assert list_res.status_code == 200
    items = list_res.json()["items"]
    assert any(s["id"] == created_id for s in items)

    # 3. Update student
    update_res = client.put(f"/api/admin/students/{created_id}", headers=headers, json={
        "name": "Admin Updated Student",
        "cgpa": 9.1
    })
    assert update_res.status_code == 200
    assert update_res.json()["cgpa"] == 9.1

    # 4. Delete student
    del_res = client.delete(f"/api/admin/students/{created_id}", headers=headers)
    assert del_res.status_code == 200

    # Verify deleted
    get_res = client.get(f"/api/admin/students/{created_id}", headers=headers)
    assert get_res.status_code == 404
