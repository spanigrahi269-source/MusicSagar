@echo off
echo ========================================
echo Restarting Backend Server
echo ========================================
echo.

cd backend

echo Activating virtual environment...
call .venv\Scripts\activate

echo.
echo Starting backend server on port 8000...
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload --port 8000
