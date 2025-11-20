@echo off
echo Starting EpiTrello...
echo.

REM Check if node_modules exist
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Starting backend on http://localhost:3001
start "EpiTrello Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting frontend on http://localhost:5173
start "EpiTrello Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo EpiTrello is starting!
echo Backend: http://localhost:3001/api
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit (this will NOT stop the servers)...
pause >nul
