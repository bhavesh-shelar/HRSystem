# HR System - Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    HR System - Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeCheck = node --version 2>$null
if (-not $nodeCheck) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js version: $nodeCheck" -ForegroundColor Green

# Install server dependencies
Write-Host "[1/4] Installing server dependencies..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\server"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install server dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "Server dependencies installed successfully!" -ForegroundColor Green

# Install client dependencies
Write-Host "[2/4] Installing client dependencies..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\client"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install client dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "Client dependencies installed successfully!" -ForegroundColor Green

# Start backend server
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server on port 5000..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\server'; node index.js"

Start-Sleep -Seconds 3

# Start frontend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\client'; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Make sure XAMPP MySQL is running!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  - Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor White
Write-Host "  - Username: admin" -ForegroundColor Cyan
Write-Host "  - Password: admin123" -ForegroundColor Cyan
Write-Host ""

