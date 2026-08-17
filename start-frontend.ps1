# PowerShell script to start the frontend-main application
Write-Host "Starting FingerMobile Frontend-Main Application..." -ForegroundColor Green

# Change to the frontend-main directory
Set-Location "c:\Users\MBAH HOME\Documents\FingerMobile Protocol Communication\FingerMobile Protocol\frontend-main"

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow

# Check if node and npm are available
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Node version: $(node --version)" -ForegroundColor Cyan
Write-Host "NPM version: $(npm --version)" -ForegroundColor Cyan

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "node_modules found. Skipping installation." -ForegroundColor Cyan
}

# Start the application
Write-Host "Starting the application..." -ForegroundColor Yellow
Write-Host "The application will be available at http://localhost:3000" -ForegroundColor Magenta
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Magenta

npm start