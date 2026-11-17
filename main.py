import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import Base, engine
from app.seed import seed_database
from app.routers import auth_router, student_router, admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed accounts
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title="NXTLOGIC Student Management System",
    description="Professional enterprise student & admin management platform with JWT authentication and FastAPI.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(student_router.router)
app.include_router(admin_router.router)

# Mount Static Files (Frontend)
public_path = os.path.join(os.path.dirname(__file__), "public")
if os.path.exists(public_path):
    app.mount("/static", StaticFiles(directory=public_path), name="static")
    app.mount("/public", StaticFiles(directory=public_path), name="public")

@app.get("/")
@app.get("/index.html")
def serve_index():
    index_file = os.path.join(public_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "CAMPUSCORE Student Management System API Live"}

@app.get("/app.js")
def serve_app_js():
    return FileResponse(os.path.join(public_path, "app.js"))

@app.get("/campuscore-logo.png")
def serve_logo():
    return FileResponse(os.path.join(public_path, "campuscore-logo.png"))

@app.get("/student")
@app.get("/student.html")
def serve_student_dashboard():
    return FileResponse(os.path.join(public_path, "student.html"))

@app.get("/admin")
@app.get("/admin.html")
def serve_admin_dashboard():
    return FileResponse(os.path.join(public_path, "admin.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
