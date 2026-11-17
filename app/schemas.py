import re
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

def validate_email_format(v: str) -> str:
    if not v or not EMAIL_REGEX.match(v.strip()):
        raise ValueError("Invalid email format (e.g. user@example.com)")
    return v.strip().lower()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: dict

class StudentRegisterRequest(BaseModel):
    student_id: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=2, max_length=120)
    email: str
    phone: Optional[str] = None
    department: str = "Computer Science"
    year: str = "3rd Year"
    address: Optional[str] = None
    dob: Optional[str] = None
    password: str = Field(..., min_length=6)

    @field_validator("email")
    @classmethod
    def check_email(cls, v: str):
        return validate_email_format(v)

class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def check_email(cls, v: str):
        return validate_email_format(v)

class CourseResponse(BaseModel):
    id: int
    course_code: str
    course_name: str
    credits: int
    grade: str
    semester: str

    class Config:
        from_attributes = True

class StudentProfileResponse(BaseModel):
    id: int
    student_id: str
    name: str
    email: str
    phone: Optional[str] = None
    department: str
    year: str
    cgpa: float
    address: Optional[str] = None
    dob: Optional[str] = None
    created_at: Optional[datetime] = None
    courses: List[CourseResponse] = []

    class Config:
        from_attributes = True

class StudentProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class AdminStudentCreateRequest(BaseModel):
    student_id: str
    name: str
    email: str
    phone: Optional[str] = None
    department: str = "Computer Science"
    year: str = "1st Year"
    cgpa: float = 8.0
    address: Optional[str] = None
    dob: Optional[str] = None
    password: str = "Password@2026"

    @field_validator("email")
    @classmethod
    def check_email(cls, v: str):
        return validate_email_format(v)

class AdminStudentUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    cgpa: Optional[float] = None
    address: Optional[str] = None
    dob: Optional[str] = None
    password: Optional[str] = None

    @field_validator("email")
    @classmethod
    def check_email(cls, v: Optional[str]):
        if v is not None:
            return validate_email_format(v)
        return v

class AdminStatsResponse(BaseModel):
    total_students: int
    department_distribution: dict
    year_distribution: dict
    average_cgpa: float
