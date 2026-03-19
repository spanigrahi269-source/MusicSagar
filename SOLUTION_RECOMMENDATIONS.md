# SOLUTION: Recommendations Not Showing

## What You're Seeing

Home page shows empty state: "Welcome to Music Sagar!" with no song recommendations.

## Why This Happens

**The backend server is NOT running.**

- Frontend: Running on port 5174 ✓
- Backend: NOT running on port 8000 ✗

The frontend tries to fetch recommendations from `http://localhost:8000/stats/recommendations` but gets no response because the backend isn't running.

## THE FIX (2 Steps)

### Step 1: Start Backend

Open a NEW terminal window and run ONE of these:

**Option A - Batch File (Easiest)**
```bash
start_backend.bat
```

**Option B - Manual Command**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Refresh Browser

1. Go to http://localhost:5174/
2. Press Ctrl+F5 (hard refresh)
3. Recommendations should now appear!

## Verify Backend is Running

Open in browser: http://localhost:8000/health

Should see:
```json
{"status":"healthy"}
```

## What You'll See After Fix

Home page will show:
- ✓ "Recommended for You" section
- ✓ 16 song cards with thumbnails
- ✓ Like, offline, download buttons
- ✓ "Show More" button
- ✓ "Fans also like" artists section

## If Still No Recommendations

The database might be empty. Run:
```bash
python add_songs_direct.py
```

This adds 48 songs to the database.

## Complete Startup Process

```
Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Terminal 2: Frontend (already running)
cd frontend
npm run dev

Browser: http://localhost:5174/
Login: sagar@example.com / Sagar@269
```

## Quick Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5174
- [ ] Database has songs (48 songs)
- [ ] Logged in as sagar@example.com
- [ ] Browser cache cleared (Ctrl+F5)

## Files Created to Help

- `start_backend.bat` - Start backend easily
- `FIX_RECOMMENDATIONS.md` - Detailed troubleshooting
- `START_BOTH_SERVERS.md` - Startup guide
- `WHY_NO_RECOMMENDATIONS.md` - Technical explanation

## Summary

**Problem**: Backend not running
**Solution**: Run `start_backend.bat`
**Result**: Recommendations appear

That's all you need to do!
