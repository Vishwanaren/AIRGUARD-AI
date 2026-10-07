@echo off
cd /d "%~dp0"
start "AIRGUARD Backend" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 /nobreak >nul
start "AIRGUARD Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 4 /nobreak >nul
start http://127.0.0.1:5173
