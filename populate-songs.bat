@echo off
echo ========================================
echo Music Sagar - Populate Database
echo ========================================
echo.
echo This will add 15 popular Hindi songs to your database
echo so you can see recommendations immediately!
echo.
pause

python populate_database.py

echo.
echo ========================================
echo Done! Refresh your browser to see the new recommendations.
echo ========================================
pause
