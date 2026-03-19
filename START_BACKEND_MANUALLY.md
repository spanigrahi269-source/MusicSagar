# Start Backend Server Manually

## The backend server needs to be started in a separate terminal window.

## Method 1: Double-Click Batch File (EASIEST)

1. Find the file `start_backend.bat` in your project folder
2. Double-click it
3. A new command window will open showing the backend server running

## Method 2: Open New Terminal

1. Open a NEW terminal/command prompt window
2. Navigate to your project:
   ```
   cd D:\Sagar\MusicSagar
   ```
3. Activate virtual environment:
   ```
   .venv\Scripts\activate
   ```
4. Go to backend folder:
   ```
   cd backend
   ```
5. Start the server:
   ```
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Expected Output

You should see:
```
INFO:     Will watch for changes in these directories: ['D:\\Sagar\\MusicSagar\\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Verify It's Running

1. Open browser
2. Go to: http://localhost:8000/health
3. Should see: `{"status":"healthy"}`

## Then Check Your App

1. Go to: http://localhost:5174/
2. Login: sagar@example.com / Sagar@269
3. Recommendations should now appear!

## Troubleshooting

### If you see "Address already in use"
Another process is using port 8000. Kill it:
```
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### If you see "Module not found"
Make sure you're in the backend folder and virtual environment is activated:
```
cd D:\Sagar\MusicSagar\backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### If you see Python errors
Check that all dependencies are installed:
```
pip install -r requirements.txt
```

## Keep Terminal Open

DO NOT close the terminal window where the backend is running. It needs to stay open for the app to work.

## Current Status

- Frontend: RUNNING on port 5174 ✓
- Backend: NEEDS TO BE STARTED on port 8000 ✗

Once you start the backend, both will be running and recommendations will appear!
