# Manual Fix Required - Search Not Working

## Problem
All YouTube API features (Search, Mood, Home) are broken with 500 error.

## Root Cause
The `get_youtube_api_key()` function in `backend/app/routers/youtube.py` is failing.

## Manual Fix (5 minutes)

### Step 1: Open the File
Open `backend/app/routers/youtube.py` in any text editor (Notepad, VS Code, etc.)

### Step 2: Find Line 122
Look for this code (around line 122):
```python
    # Get API key with automatic rotation
    YOUTUBE_API_KEY, key_name = get_youtube_api_key()
```

### Step 3: Replace Those 2 Lines
Replace them with these 3 lines:
```python
    # Temporarily use KEY_1 directly
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY_1")
    key_name = "YOUTUBE_API_KEY_1"
```

### Step 4: Save the File
Press Ctrl+S to save

### Step 5: Restart Backend
The backend will auto-reload. You'll see "Detected file change" in the terminal.

If it doesn't auto-reload:
1. Press Ctrl+C in backend terminal
2. Run: `uvicorn app.main:app --reload --port 8000`

### Step 6: Test
1. Go to http://localhost:5173/search
2. Type "test" and click Search
3. Should see results!

## What This Does
- Bypasses the broken rotation system
- Uses KEY_1 directly
- Will work immediately
- We can fix rotation later

## After This Works
Once search is working, we can:
1. Add debug logging to `get_youtube_api_key()`
2. Fix the rotation system
3. Enable all 30 keys

But first priority: Get it working!

## Alternative: Use Kiro to Edit
If you're using Kiro IDE:
1. Open `backend/app/routers/youtube.py`
2. Go to line 122
3. Make the change above
4. Save (Ctrl+S)

## Need Help?
If you can't edit the file, share a screenshot of lines 120-125 of the file and I'll provide exact instructions.
