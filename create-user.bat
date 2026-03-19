@echo off
echo ================================================
echo Creating User for Music Sagar
echo ================================================
echo.
echo Username: sagar
echo Email: sagar@example.com
echo Password: Sagar@269
echo.

cd backend
call venv\Scripts\activate.bat
python app\init_db.py

echo.
echo ================================================
echo Done! You can now login with these credentials.
echo ================================================
pause
