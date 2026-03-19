@echo off
echo ========================================
echo   Update Dependencies and Restart
echo ========================================
echo.

echo Step 1: Installing new dependencies...
cd backend
pip install requests
echo.

echo Step 2: Restarting backend server...
echo.
echo Please stop the current backend server (Ctrl+C in backend terminal)
echo Then run: uvicorn app.main:app --reload
echo.

echo ========================================
echo   OR run this to start automatically:
echo ========================================
echo.
start cmd /k "cd backend && uvicorn app.main:app --reload"

echo.
echo Backend will start in new window...
pause
