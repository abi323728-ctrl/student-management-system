from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student, Admin, AcademicCourse
from app.schemas import StudentRegisterRequest, LoginRequest, TokenResponse
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/student/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    # Check if student with same email or roll number exists
    existing_email = db.query(Student).filter(Student.email == req.email.lower()).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this email is already registered."
        )

    existing_id = db.query(Student).filter(Student.student_id == req.student_id).first()
    if existing_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this Student ID / Roll No already exists."
        )

    new_student = Student(
        student_id=req.student_id.strip(),
        name=req.name.strip(),
        email=req.email.lower().strip(),
        phone=req.phone,
        department=req.department,
        year=req.year,
        cgpa=8.2,
        address=req.address,
        dob=req.dob,
        password_hash=hash_password(req.password)
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Seed 2 default courses for academic record
    sample_courses = [
        AcademicCourse(student_id=new_student.id, course_code="CS301", course_name="Data Structures & Algorithms", credits=4, grade="A", semester="Semester 5"),
        AcademicCourse(student_id=new_student.id, course_code="CS302", course_name="Database Management Systems", credits=4, grade="A+", semester="Semester 5"),
        AcademicCourse(student_id=new_student.id, course_code="CS303", course_name="Web Technologies & Frameworks", credits=3, grade="O", semester="Semester 5")
    ]
    db.add_all(sample_courses)
    db.commit()

    token_data = {"sub": str(new_student.id), "role": "student", "email": new_student.email, "name": new_student.name}
    token = create_access_token(token_data)

    return TokenResponse(
        access_token=token,
        role="student",
        user={"id": new_student.id, "student_id": new_student.student_id, "name": new_student.name, "email": new_student.email}
    )

@router.post("/student/login", response_model=TokenResponse)
def login_student(req: LoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == req.email.lower().strip()).first()
    if not student or not verify_password(req.password, student.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid student email or password."
        )

    token_data = {"sub": str(student.id), "role": "student", "email": student.email, "name": student.name}
    token = create_access_token(token_data)

    return TokenResponse(
        access_token=token,
        role="student",
        user={"id": student.id, "student_id": student.student_id, "name": student.name, "email": student.email}
    )

@router.post("/admin/login", response_model=TokenResponse)
def login_admin(req: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == req.email.lower().strip()).first()
    if not admin or not verify_password(req.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials."
        )

    token_data = {"sub": str(admin.id), "role": "admin", "email": admin.email, "name": admin.name}
    token = create_access_token(token_data)

    return TokenResponse(
        access_token=token,
        role="admin",
        user={"id": admin.id, "name": admin.name, "email": admin.email}
    )
