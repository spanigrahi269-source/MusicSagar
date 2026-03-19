@echo off
echo ========================================
echo Clearing Python Cache and Restarting
echo ========================================
echo.

cd backend

echo Clearing Python cache files...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
del /s /q *.pyc 2>nul

echo.
echo Cache cleared!
echo.
echo Activating virtual environment...
call .venv\Scripts\activate

echo.
echo Starting backend server on port 8000...
echo The fix is now active!
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload --port 8000
