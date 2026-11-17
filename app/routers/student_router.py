from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student
from app.schemas import StudentProfileResponse, StudentProfileUpdateRequest, ChangePasswordRequest
from app.auth import require_student, hash_password, verify_password

router = APIRouter(prefix="/api/student", tags=["Student Module"])

@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    student_id = int(current_user["sub"])
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    return student

@router.put("/profile", response_model=StudentProfileResponse)
def update_student_profile(
    req: StudentProfileUpdateRequest,
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    student_id = int(current_user["sub"])
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    if req.name is not None:
        student.name = req.name.strip()
    if req.phone is not None:
        student.phone = req.phone.strip()
    if req.department is not None:
        student.department = req.department
    if req.year is not None:
        student.year = req.year
    if req.address is not None:
        student.address = req.address.strip()
    if req.dob is not None:
        student.dob = req.dob

    db.commit()
    db.refresh(student)
    return student

@router.post("/change-password")
def change_student_password(
    req: ChangePasswordRequest,
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    student_id = int(current_user["sub"])
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    if not verify_password(req.current_password, student.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password entered is incorrect."
        )

    student.password_hash = hash_password(req.new_password)
    db.commit()
    return {"success": True, "message": "Password updated successfully."}
