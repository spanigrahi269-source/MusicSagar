@echo off
echo ========================================
echo Music Sagar - FFmpeg Installation
echo ========================================
echo.

echo Checking if FFmpeg is already installed...
ffmpeg -version >nul 2>&1
if %errorlevel% == 0 (
    echo FFmpeg is already installed!
    ffmpeg -version | findstr "ffmpeg version"
    echo.
    echo You're all set! You can now use offline downloads.
    pause
    exit /b 0
)

echo FFmpeg is not installed.
echo.
echo To use offline download feature, you need to install FFmpeg.
echo.
echo Installation Options:
echo.
echo 1. Using Chocolatey (Recommended - Automatic)
echo    - Run: choco install ffmpeg
echo.
echo 2. Manual Installation:
echo    - Download from: https://ffmpeg.org/download.html
echo    - Extract to a folder (e.g., C:\ffmpeg)
echo    - Add to System PATH:
echo      * Open System Properties ^> Environment Variables
echo      * Edit PATH variable
echo      * Add: C:\ffmpeg\bin
echo      * Restart terminal
echo.
echo Would you like to install using Chocolatey? (Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    echo.
    echo Checking if Chocolatey is installed...
    choco -v >nul 2>&1
    if %errorlevel% == 0 (
        echo Chocolatey found! Installing FFmpeg...
        choco install ffmpeg -y
        echo.
        echo FFmpeg installation complete!
        echo Please restart your terminal and backend server.
    ) else (
        echo Chocolatey is not installed.
        echo.
        echo To install Chocolatey, run PowerShell as Administrator and execute:
        echo Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        echo.
        echo After installing Chocolatey, run this script again.
    )
) else (
    echo.
    echo Please install FFmpeg manually:
    echo 1. Visit: https://ffmpeg.org/download.html
    echo 2. Download Windows build
    echo 3. Extract to C:\ffmpeg
    echo 4. Add C:\ffmpeg\bin to System PATH
    echo 5. Restart terminal
)

echo.
pause
