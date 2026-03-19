@echo off
echo ========================================
echo Music Sagar - Diagnostic Tool
echo ========================================
echo.

echo [1/5] Checking if backend is running...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Backend is running
) else (
    echo ✗ Backend is NOT running
    echo   Solution: Run start-local.bat
)
echo.

echo [2/5] Checking if frontend is running...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is NOT running
    echo   Solution: Run start-local.bat
)
echo.

echo [3/5] Checking database file...
if exist "backend\music_sagar.db" (
    echo ✓ Database file exists
) else (
    echo ✗ Database file NOT found
    echo   Solution: Run setup-local.bat
)
echo.

echo [4/5] Testing API endpoints...
echo Testing /history endpoint...
curl -s http://localhost:8000/history >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ History endpoint working
) else (
    echo ✗ History endpoint failed
)

echo Testing /stats/recommendations endpoint...
curl -s http://localhost:8000/stats/recommendations >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Recommendations endpoint working
) else (
    echo ✗ Recommendations endpoint failed
)
echo.

echo [5/5] Checking Python packages...
cd backend
python -c "import fastapi, sqlalchemy, httpx" 2>nul
if %errorlevel% == 0 (
    echo ✓ Python packages installed
) else (
    echo ✗ Python packages missing
    echo   Solution: Run setup-local.bat
)
cd ..
echo.

echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo If you see errors above:
echo 1. Make sure to run: start-local.bat
echo 2. Check both terminal windows for errors
echo 3. Try restarting: Close terminals and run start-local.bat again
echo.
pause
