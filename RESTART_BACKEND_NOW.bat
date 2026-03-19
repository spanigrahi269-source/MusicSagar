@echo off
echo ========================================
echo   RESTARTING BACKEND SERVER
echo ========================================
echo.

echo Killing any existing Python/Uvicorn processes...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting backend server...
cd backend
start "Music Sagar Backend" cmd /k "uvicorn app.main:app --reload"

echo.
echo ========================================
echo   Backend server started!
echo   
echo   Now:
echo   1. Go to your browser
echo   2. Press F5 to refresh
echo   3. Click "Load Trending Songs"
echo   
echo   It should work now!
echo ========================================
echo.
pause
