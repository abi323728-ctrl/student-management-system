from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(20), default="admin", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    department = Column(String(100), nullable=False, default="Computer Science")
    year = Column(String(50), nullable=False, default="3rd Year")
    cgpa = Column(Float, nullable=False, default=8.5)
    address = Column(Text, nullable=True)
    dob = Column(String(30), nullable=True)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    courses = relationship("AcademicCourse", back_populates="student", cascade="all, delete-orphan")

class AcademicCourse(Base):
    __tablename__ = "academic_courses"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_code = Column(String(20), nullable=False)
    course_name = Column(String(120), nullable=False)
    credits = Column(Integer, default=3)
    grade = Column(String(10), default="A")
    semester = Column(String(20), default="Semester 5")

    student = relationship("Student", back_populates="courses")
