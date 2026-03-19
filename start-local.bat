@echo off
echo ========================================
echo Music Sagar - Starting Application
echo ========================================
echo.

echo Starting Backend Server...
start "Music Sagar Backend" cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Music Sagar Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Application Started!
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
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WINDOWTITLE eq Music Sagar Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Music Sagar Frontend*" /F >nul 2>&1
echo Servers stopped.
