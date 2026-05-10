@echo off
echo Starting Django backend on http://localhost:8000...
echo Backend API: http://localhost:8000/api
echo Admin Panel: http://localhost:8000/admin
echo.
cd /d "c:\Users\abden\Downloads\MOVEZ v3\backend"
C:\Users\abden\AppData\Local\Programs\Python\Python311\python.exe manage.py runserver
pause
