@echo off
echo ========================================
echo   Force Refresh Frontend
echo ========================================
echo.

echo This will:
echo 1. Clear browser cache
echo 2. Rebuild frontend
echo.

echo Step 1: Rebuilding frontend...
cd frontend
call npm run build

echo.
echo Step 2: Instructions for browser:
echo.
echo Please do the following in your browser:
echo 1. Press Ctrl+Shift+R (hard refresh)
echo 2. Or press F12, right-click refresh button, select "Empty Cache and Hard Reload"
echo.
echo ========================================
echo   Done! Now hard refresh your browser
echo ========================================
pause
