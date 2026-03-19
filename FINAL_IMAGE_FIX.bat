@echo off
echo ========================================
echo FINAL FIX - Clearing Everything
echo ========================================
echo.

echo Step 1: Stopping all processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Clearing browser cache...
echo Please do this manually:
echo 1. Press Ctrl+Shift+Delete
echo 2. Select "Cached images and files"
echo 3. Click "Clear data"
echo.
pause

echo.
echo Step 3: Clearing Vite cache...
cd frontend
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

echo.
echo Step 4: Starting backend...
cd ..
start cmd /k "cd backend && python -m uvicorn app.main:app --reload"

echo.
echo Step 5: Waiting 5 seconds...
timeout /t 5 >nul

echo.
echo Step 6: Starting frontend...
cd frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo Servers starting...
echo.
echo Wait 15 seconds, then:
echo 1. Go to http://localhost:5173
echo 2. Press Ctrl+Shift+R (hard refresh)
echo 3. Login with: sagar@example.com / Sagar@269
echo ========================================
timeout /t 15

echo.
echo Done! Now open browser and hard refresh!
pause
