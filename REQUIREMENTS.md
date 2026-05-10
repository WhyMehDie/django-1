# 🏆 MOVEZ — Environment Setup Guide

This document outlines the required environments and setup steps to get the MOVEZ platform running on a new PC.

## 🧱 Prerequisites

Before you start, ensure you have the following installed on your machine:

1. **Python 3.x**
   - Recommended: Python 3.10+
   - Download: [python.org](https://www.python.org/downloads/)
   - *Note: Make sure to check "Add Python to PATH" during installation.*

2. **Node.js & npm**
   - Recommended: Node v18+ or v20+ (LTS)
   - Download: [nodejs.org](https://nodejs.org/en/)

3. **MySQL (Optional but recommended for Production)**
   - The app uses SQLite by default for development. 
   - If `USE_MYSQL=True` in your backend `.env`, you will need MySQL Server installed and running.

---

## 🚀 Step 1: Backend Setup (Django)

1. Open a terminal and navigate to the `backend` folder:
   ```powershell
   cd path\to\MOVEZ\backend
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On **Windows**:
     ```powershell
     .\venv\Scripts\activate
     ```
   - On **Mac/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
   *(This installs Django, Django REST Framework, Pillow, etc.)*

5. Apply database migrations (creates the SQLite database):
   ```powershell
   python manage.py migrate
   ```

6. Run the backend server:
   ```powershell
   python manage.py runserver
   ```
   *The backend will be available at http://127.0.0.1:8000*

---

## 💻 Step 2: Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the `frontend` folder:
   ```powershell
   cd path\to\MOVEZ\frontend
   ```

2. Install Node dependencies:
   ```powershell
   npm install
   ```

3. Run the development server:
   ```powershell
   npm run dev
   ```
   *The frontend will be available at http://localhost:5173*

---

## ⚙️ Environment Variables (.env)

Make sure both the `backend` and `frontend` folders have their respective `.env` files.

**Backend `.env`** (`backend/.env`):
```env
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

USE_MYSQL=False
```

**Frontend `.env`** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000/api
```

You're all set! Enjoy developing on MOVEZ.
