@echo off
echo ========================================
echo Music Sagar - Local Setup (No Docker)
echo ========================================
echo.

REM Check Python
echo [1/3] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo Python found!
echo.

REM Check Node.js
echo [2/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

REM Setup Backend
echo [3/3] Setting up Backend and Frontend...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt
cd ..
echo Backend setup complete!
echo.

REM Setup Frontend
cd frontend
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install
)
cd ..
echo Frontend setup complete!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Database: SQLite (no setup needed)
echo.
echo Next step: Run start-local.bat
echo.
pause
