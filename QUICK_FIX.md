# Quick Fix - Login Not Working

## The Problem
Your backend server is not running! That's why login fails.

## The Solution (3 Steps)

### Step 1: Start Backend
Open a terminal and run:
```bash
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Wait for:** "Application startup complete"
**Keep this terminal open!**

### Step 2: Start Frontend (if not running)
Open another terminal and run:
```bash
cd frontend
npm run dev
```

**Wait for:** "ready in xxx ms"
**Keep this terminal open!**

### Step 3: Test Login
1. Go to http://localhost:5173/login
2. Email: sagar@example.com
3. Password: Sagar@269
4. Click Login
5. Should work now!

## Even Easier
Just double-click `start-servers.bat` in your project folder!

## Verify Backend is Running
Open http://localhost:8000/docs in your browser.
If you see the API documentation page, backend is running!

## Still Not Working?
See `BACKEND_NOT_RUNNING_FIX.md` for detailed troubleshooting.
