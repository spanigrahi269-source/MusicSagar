@echo off
echo ========================================
echo Fixing Frontend Issues
echo ========================================
echo.

echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Clearing Vite cache...
cd frontend
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

echo.
echo Step 3: Restarting frontend dev server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo Frontend server restarting...
echo Wait 10 seconds, then refresh your browser
echo ========================================
timeout /t 10

echo.
echo Done! Now refresh your browser (Ctrl+Shift+R)
pause
