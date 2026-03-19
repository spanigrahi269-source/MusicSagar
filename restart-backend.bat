@echo off
echo ========================================
echo RESTARTING BACKEND SERVER
echo ========================================
echo.
echo This will restart the backend to pick up the new API keys
echo.
echo Press Ctrl+C in the backend terminal first, then run this script
echo.
pause

cd backend
call venv\Scripts\activate
echo.
echo Starting backend server...
echo.
python -m uvicorn app.main:app --reload
