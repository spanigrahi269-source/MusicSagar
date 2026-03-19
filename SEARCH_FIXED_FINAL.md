# Search Issue - Final Analysis

## Problem Identified
The backend is returning **500 Internal Server Error** when searching.

## Root Cause
Based on the screenshots:
1. Backend is running and receiving requests
2. Returns 500 error immediately
3. No Python traceback visible in terminal
4. Browser shows ERR_CONNECTION_REFUSED to localhost:5173

## Most Likely Issue
The `get_youtube_api_key()` function is returning `None` because:
- Environment variables aren't being loaded properly
- OR all 30 keys are returning None
- OR there's a Python error in the function itself

## Solution

### Step 1: Add Debug Logging
I need to add print statements to see what's happening, but the file edits aren't working.

### Step 2: Manual Fix Required
You need to manually edit `backend/app/routers/youtube.py`:

1. Open the file in a text editor
2. Find the `get_youtube_api_key()` function (around line 15)
3. Add this at the very start of the function:
```python
print(f"DEBUG: Checking for API keys...")
print(f"DEBUG: KEY_1 = {os.getenv('YOUTUBE_API_KEY_1')[:20] if os.getenv('YOUTUBE_API_KEY_1') else 'NOT FOUND'}")
```

4. Save the file
5. The backend will auto-reload (you'll see "Detected file change" in terminal)
6. Try searching again
7. Check the backend terminal for the DEBUG messages

This will tell us if the keys are being loaded or not.

## Alternative: Check if .env is in the right place

Run this command:
```bash
cd backend
dir .env
```

Make sure it shows the .env file exists in the backend folder.

## If Keys Are Not Loading

The issue is that `backend/.env` isn't being read. Solution:
1. Copy all API keys from `backend/.env`
2. Set them as system environment variables
3. OR restart the entire computer (sometimes Windows caches env vars)

## Quick Test

Run this in PowerShell:
```powershell
cd backend
$env:YOUTUBE_API_KEY_1 = "AIzaSyBQukNXD0Xwvw8681Zpdhdrx6qcRm2pCIM"
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

This manually sets KEY_1 and starts the backend. If search works after this, the problem is definitely that .env isn't being loaded.
