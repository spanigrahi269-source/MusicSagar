@echo off
echo ========================================
echo Testing Music Sagar Backend API
echo ========================================
echo.

echo Testing backend health endpoint...
curl -s http://localhost:8000/health
echo.
echo.

echo Testing history endpoint...
curl -s http://localhost:8000/history
echo.
echo.

echo Testing recommendations endpoint...
curl -s http://localhost:8000/stats/recommendations
echo.
echo.

echo ========================================
echo Test Complete
echo ========================================
echo.
echo If you see errors above, the backend may not be running.
echo Run: start-local.bat
echo.
pause
