# Fix Recommendations Not Showing

## Problem
The home page shows "Welcome to Music Sagar!" empty state instead of song recommendations.

## Root Cause
The backend is NOT running. The frontend is running on port 5174, but the backend on port 8000 is not started.

## Solution

### Step 1: Start the Backend
Open a NEW terminal and run:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

OR use the batch file:
```bash
start_backend.bat
```

### Step 2: Verify Backend is Running
Open browser and go to:
```
http://localhost:8000/health
```

You should see:
```json
{"status":"healthy"}
```

### Step 3: Check if Database Has Songs
Run this command:
```bash
python add_songs_direct.py
```

This will add 48 songs to the database if they don't exist.

### Step 4: Refresh the Frontend
1. Go to http://localhost:5174/
2. Login with: sagar@example.com / Sagar@269
3. You should now see recommendations!

## Why Recommendations Were Not Showing

1. **Backend Not Running**: The frontend makes API calls to `http://localhost:8000/stats/recommendations`
2. **API Call Fails**: When backend is down, the API call fails
3. **Empty State Shows**: Frontend shows the welcome message when no recommendations are returned

## How Recommendations Work

The backend `/stats/recommendations` endpoint:
1. Checks if user has liked songs → recommends from same artists
2. If no liked songs → shows trending songs (most played)
3. If no trending → shows random songs from database
4. Returns up to 50 songs

## Verification Steps

### 1. Check Backend Status
```bash
# Should return: True
Test-NetConnection -ComputerName localhost -Port 8000 -InformationLevel Quiet
```

### 2. Test Recommendations API
```bash
# Should return JSON with recommendations
curl http://localhost:8000/stats/recommendations -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Check Database
```bash
python check_database.py
```

Should show:
```
Total songs in database: 48
```

## Quick Fix Commands

```bash
# Terminal 1 - Start Backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Add Songs (if needed)
python add_songs_direct.py

# Terminal 3 - Frontend (already running on port 5174)
# No action needed
```

## Expected Result

After starting the backend, the home page should show:
- "Recommended for You" section with song cards
- 16 songs initially
- "Show More" button to load more songs
- "Fans also like" artists section

## Troubleshooting

### If Still No Recommendations:

1. **Check browser console** (F12):
   - Look for API errors
   - Check if requests to localhost:8000 are failing

2. **Check backend logs**:
   - Look for errors in the terminal where backend is running
   - Check if `/stats/recommendations` endpoint is being called

3. **Verify authentication**:
   - Make sure you're logged in
   - Check if token is valid in localStorage

4. **Clear browser cache**:
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Refresh page (Ctrl+F5)

## Status Check Script

Create `check_status.py`:
```python
import requests

print("Checking backend...")
try:
    r = requests.get('http://localhost:8000/health', timeout=2)
    print(f"Backend: RUNNING (status {r.status_code})")
except:
    print("Backend: NOT RUNNING")

print("\nChecking frontend...")
try:
    r = requests.get('http://localhost:5174/', timeout=2)
    print(f"Frontend: RUNNING (status {r.status_code})")
except:
    print("Frontend: NOT RUNNING")
```

Run: `python check_status.py`
