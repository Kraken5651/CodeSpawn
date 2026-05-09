@echo off
cd /d "%~dp0frontend"
npm.cmd run dev -- --host 0.0.0.0
pause
