@echo off
echo ========================================
echo Music Sagar - Starting Servers
echo ========================================
echo.

echo Checking if backend is already running...
netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo Backend is already running on port 8000
) else (
    echo Starting Backend Server...
    start "Music Sagar Backend" cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo Waiting for backend to start...
    timeout /t 5 /nobreak >nul
)

echo.
echo Checking if frontend is already running...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo Frontend is already running on port 5173
) else (
    echo Starting Frontend Server...
    start "Music Sagar Frontend" cmd /k "cd frontend && npm run dev"
)

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Login with:
echo Email: sagar@example.com
echo Password: Sagar@269
echo.
echo Press any key to exit...
pause >nul
