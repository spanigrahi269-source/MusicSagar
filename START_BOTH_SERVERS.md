# Start Both Servers - Quick Guide

## Current Status

- Frontend: RUNNING on port 5174
- Backend: NOT RUNNING (needs to be started)

## Start Backend Now

### Option 1: Use Batch File (Easiest)
Double-click `start_backend.bat` or run in terminal:
```bash
start_backend.bat
```

### Option 2: Manual Command
Open a NEW terminal and run:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Expected Output

When backend starts successfully, you'll see:
```
INFO:     Will watch for changes in these directories: ['D:\\Sagar\\MusicSagar\\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXXX] using WatchFiles
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Verify It's Working

1. Open browser: http://localhost:8000/health
2. Should see: `{"status":"healthy"}`

## Access the App

1. Go to: http://localhost:5174/
2. Login: sagar@example.com / Sagar@269
3. Recommendations should now appear!

## If Recommendations Still Don't Show

Run this to add songs to database:
```bash
python add_songs_direct.py
```

Then refresh the browser (Ctrl+F5)

## Both Servers Running

Once both are running:
- Frontend: http://localhost:5174/ (already running)
- Backend: http://localhost:8000/ (start this now)
- API Docs: http://localhost:8000/docs

## Stop Servers

- Frontend: Press Ctrl+C in the terminal where it's running
- Backend: Press Ctrl+C in the terminal where it's running
