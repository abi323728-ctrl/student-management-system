from app.database import Base, engine, SessionLocal
from app.models import Admin, Student, AcademicCourse
from app.auth import hash_password

def seed_database():
    """Seed initial administrator and sample students."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Admin
        admin = db.query(Admin).filter(Admin.email == "admin@nxtlogic.com").first()
        if not admin:
            admin = Admin(
                name="System Administrator",
                email="admin@nxtlogic.com",
                password_hash=hash_password("Admin@2026"),
                role="admin"
            )
            db.add(admin)

        # 2. Seed Default Student
        default_student = db.query(Student).filter(Student.email == "student@nxtlogic.com").first()
        if not default_student:
            default_student = Student(
                student_id="NXT202601",
                name="Abishek Raman",
                email="student@nxtlogic.com",
                phone="+91 9845012345",
                department="Computer Science",
                year="3rd Year",
                cgpa=9.15,
                address="42 Innovation Park, Coimbatore, Tamil Nadu",
                dob="2003-08-14",
                password_hash=hash_password("Student@2026")
            )
            db.add(default_student)
            db.commit()
            db.refresh(default_student)

            # Add sample courses for this student
            courses = [
                AcademicCourse(student_id=default_student.id, course_code="CS301", course_name="Data Structures & Algorithms", credits=4, grade="A+", semester="Semester 5"),
                AcademicCourse(student_id=default_student.id, course_code="CS302", course_name="Database Management Systems", credits=4, grade="O", semester="Semester 5"),
                AcademicCourse(student_id=default_student.id, course_code="CS303", course_name="Web Technologies & Frameworks", credits=3, grade="O", semester="Semester 5"),
                AcademicCourse(student_id=default_student.id, course_code="CS304", course_name="Cloud Computing & DevOps", credits=3, grade="A", semester="Semester 5")
            ]
            db.add_all(courses)

        # 3. Seed additional sample students for Admin table
        sample_students = [
            ("NXT202602", "Priya Sharma", "priya.sharma@nxtlogic.com", "+91 9812345678", "Information Technology", "3rd Year", 8.85, "Chennai, Tamil Nadu", "2003-11-20"),
            ("NXT202603", "Rahul Varma", "rahul.varma@nxtlogic.com", "+91 9876501234", "AI & Data Science", "2nd Year", 9.40, "Bangalore, Karnataka", "2004-03-11"),
            ("NXT202604", "Sneha Patel", "sneha.patel@nxtlogic.com", "+91 9765432109", "Computer Science", "4th Year", 8.70, "Hyderabad, Telangana", "2002-09-05"),
            ("NXT202605", "Karthik Raja", "karthik.raja@nxtlogic.com", "+91 9654321098", "Electronics & Comm", "1st Year", 8.20, "Madurai, Tamil Nadu", "2005-01-25"),
        ]

        for s_id, s_name, s_email, s_phone, s_dept, s_year, s_cgpa, s_addr, s_dob in sample_students:
            exists = db.query(Student).filter(Student.email == s_email).first()
            if not exists:
                st = Student(
                    student_id=s_id,
                    name=s_name,
                    email=s_email,
                    phone=s_phone,
                    department=s_dept,
                    year=s_year,
                    cgpa=s_cgpa,
                    address=s_addr,
                    dob=s_dob,
                    password_hash=hash_password("Password@2026")
                )
                db.add(st)

        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
    print("Database initialized and seeded successfully.")
