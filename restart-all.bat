@echo off
echo ========================================
echo Restarting Music Sagar - Full Restart
echo ========================================
echo.
echo This will restart both backend and frontend
echo.
echo STEP 1: Starting Backend Server...
echo ----------------------------------------
start "Music Sagar Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul
echo.
echo STEP 2: Starting Frontend Server...
echo ----------------------------------------
start "Music Sagar Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Check the new terminal windows for server output
echo Press any key to close this window...
pause >nul
