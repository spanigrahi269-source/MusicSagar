# Quick Start: Backend Server

## You Need to Start the Backend Server

The frontend is running, but the backend needs to be started separately.

## FASTEST WAY

**Double-click this file:**
```
start_backend.bat
```

That's it! A new window will open with the backend running.

## OR Use Terminal

Open a NEW terminal and paste this:
```bash
cd D:\Sagar\MusicSagar\backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Check If It's Running

Open browser: http://localhost:8000/health

Should see: `{"status":"healthy"}`

## Then Refresh Your App

Go to: http://localhost:5174/

Press: Ctrl+F5

Recommendations will appear!

## That's All!

Frontend: http://localhost:5174/ (already running)
Backend: http://localhost:8000/ (start it now)

Once both are running, everything works!
