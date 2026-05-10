@echo off
echo.
echo ========================================
echo   MOVEZ Sport App - Starting Services
echo ========================================
echo.
echo Opening backend and frontend servers...
echo.
start "MOVEZ Backend" cmd /k cd "c:\Users\abden\Downloads\MOVEZ v3\backend" ^&^& C:\Users\abden\AppData\Local\Programs\Python\Python311\python.exe manage.py runserver
timeout /t 2
start "MOVEZ Frontend" cmd /k cd "c:\Users\abden\Downloads\MOVEZ v3\frontend" ^&^& npm run dev
timeout /t 5
echo.
echo ========================================
echo   MOVEZ is Starting Up
echo ========================================
echo.
echo Backend API:  http://localhost:8000/api
echo Frontend:     http://localhost:5173
echo Admin Panel:  http://localhost:8000/admin
echo.
echo Test Accounts:
echo   Admin:  admin@sport.ma / Admin@1234
echo   Player: joueur@sport.ma / Joueur@1234
echo.
echo Opening frontend in browser...
timeout /t 3
start http://localhost:5173
echo.
echo Done! Services should be running now.
echo.
pause
