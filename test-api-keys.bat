@echo off
echo Testing all YouTube API keys...
echo.

REM Activate virtual environment if it exists
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
    echo Virtual environment activated.
) else if exist backend\venv\Scripts\activate.bat (
    call backend\venv\Scripts\activate.bat
    echo Backend virtual environment activated.
) else (
    echo No virtual environment found. Using system Python.
)

echo.
echo Running API key test...
python test_all_api_keys.py

echo.
echo Test completed. Press any key to exit...
pause > nul