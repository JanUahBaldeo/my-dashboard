@echo off
REM ========================================
REM 🚀 STARTUP SCRIPT FOR DASHBOARD (Windows)
REM ========================================

echo 🚀 Starting Dashboard Application...
echo � Starting frontend dashboard
echo.

REM Start dashboard
echo 🎯 Starting Dashboard on port 5173...
cd /d "%~dp0apps\dashboard"
npm run dev

echo 🛑 Dashboard stopped
pause
