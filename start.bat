@echo off
echo ========================================
echo     HR System - Starting Services
echo ========================================
echo.

echo [1/4] Installing server dependencies...
cd /d "%~dp0server"
npm install
echo.

echo [2/4] Installing client dependencies...
cd /d "%~dp0client"
npm install
echo.

echo ========================================
echo Starting Backend Server on port 5000...
echo ========================================
start "HR Server" cmd /k "cd /d "%~dp0server" && node index.js"

timeout /t 3 /nobreak >nul

echo ========================================
echo Starting Frontend on port 3000...
echo ========================================
start "HR Client" cmd /k "cd /d "%~dp0client" && npm start"

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Please make sure XAMPP MySQL is running!
echo.
echo Access URLs:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5000
echo.
echo Admin Credentials:
echo   - Username: admin
echo   - Password: admin123
echo.
pause

