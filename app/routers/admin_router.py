from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.database import get_db
from app.models import Student, AcademicCourse
from app.schemas import (
    StudentProfileResponse,
    AdminStudentCreateRequest,
    AdminStudentUpdateRequest,
    AdminStatsResponse
)
from app.auth import require_admin, hash_password

router = APIRouter(prefix="/api/admin", tags=["Admin Module"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_dashboard_stats(
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total = db.query(Student).count()
    if total == 0:
        return AdminStatsResponse(
            total_students=0,
            department_distribution={},
            year_distribution={},
            average_cgpa=0.0
        )

    # Department distribution
    dept_counts = db.query(Student.department, func.count(Student.id)).group_by(Student.department).all()
    dept_dict = {dept: count for dept, count in dept_counts}

    # Year distribution
    year_counts = db.query(Student.year, func.count(Student.id)).group_by(Student.year).all()
    year_dict = {yr: count for yr, count in year_counts}

    # Average CGPA
    avg_cgpa = db.query(func.avg(Student.cgpa)).scalar() or 0.0

    return AdminStatsResponse(
        total_students=total,
        department_distribution=dept_dict,
        year_distribution=year_dict,
        average_cgpa=round(float(avg_cgpa), 2)
    )

@router.get("/students")
def list_students(
    search: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Student)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Student.name.ilike(search_filter),
                Student.email.ilike(search_filter),
                Student.student_id.ilike(search_filter)
            )
        )

    if department and department != "All":
        query = query.filter(Student.department == department)

    if year and year != "All":
        query = query.filter(Student.year == year)

    total_count = query.count()
    students = query.order_by(Student.id.desc()).offset((page - 1) * limit).limit(limit).all()

    # Convert to response dicts
    items = [
        {
            "id": s.id,
            "student_id": s.student_id,
            "name": s.name,
            "email": s.email,
            "phone": s.phone,
            "department": s.department,
            "year": s.year,
            "cgpa": s.cgpa,
            "address": s.address,
            "dob": s.dob,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in students
    ]

    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }

@router.post("/students", response_model=StudentProfileResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    req: AdminStudentCreateRequest,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Student).filter(
        or_(Student.email == req.email.lower().strip(), Student.student_id == req.student_id.strip())
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student with this email or Student ID already exists."
        )

    new_student = Student(
        student_id=req.student_id.strip(),
        name=req.name.strip(),
        email=req.email.lower().strip(),
        phone=req.phone,
        department=req.department,
        year=req.year,
        cgpa=req.cgpa,
        address=req.address,
        dob=req.dob,
        password_hash=hash_password(req.password or "Password@2026")
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Seed default courses
    courses = [
        AcademicCourse(student_id=new_student.id, course_code="CS101", course_name="Introduction to Computing", credits=3, grade="A", semester="Semester 1"),
        AcademicCourse(student_id=new_student.id, course_code="CS102", course_name="Programming Fundamentals", credits=4, grade="A+", semester="Semester 1")
    ]
    db.add_all(courses)
    db.commit()

    return new_student

@router.get("/students/{student_id}", response_model=StudentProfileResponse)
def get_single_student(
    student_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    return student

@router.put("/students/{student_id}", response_model=StudentProfileResponse)
def update_student(
    student_id: int,
    req: AdminStudentUpdateRequest,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    if req.name is not None:
        student.name = req.name.strip()
    if req.email is not None:
        # Check duplicate
        other = db.query(Student).filter(Student.email == req.email.lower().strip(), Student.id != student_id).first()
        if other:
            raise HTTPException(status_code=400, detail="Another student already uses this email.")
        student.email = req.email.lower().strip()
    if req.phone is not None:
        student.phone = req.phone.strip()
    if req.department is not None:
        student.department = req.department
    if req.year is not None:
        student.year = req.year
    if req.cgpa is not None:
        student.cgpa = req.cgpa
    if req.address is not None:
        student.address = req.address.strip()
    if req.dob is not None:
        student.dob = req.dob
    if req.password:
        student.password_hash = hash_password(req.password)

    db.commit()
    db.refresh(student)
    return student

@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    db.delete(student)
    db.commit()
    return {"success": True, "message": f"Student '{student.name}' successfully deleted."}
