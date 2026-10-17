@echo off
echo Starting SuperVi Game Services...

:: Check if Docker is installed and running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    pause
    exit /b 1
)

:: Check if Docker daemon is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker daemon is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo Building and starting SuperVi services...
docker-compose -f docker-compose-supervi.main.yml up --build -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Checking running containers...
docker-compose -f docker-compose-supervi.main.yml ps

echo.
echo SuperVi services should now be running!
echo.
echo SuperVi App: http://localhost:3000
echo SuperVi Backend: http://localhost:5000
echo SuperVi Adminer: http://localhost:8082
echo.
echo Press any key to exit...
pause >nul