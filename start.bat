@echo off
title NXTLOGIC Student Management System
echo ===================================================
echo 🚀 Starting NXTLOGIC Student Management System...
echo ===================================================
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
