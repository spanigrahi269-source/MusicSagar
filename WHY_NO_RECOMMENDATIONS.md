# Why Recommendations Are Not Showing

## The Issue

You see this on the home page:
```
Welcome to Music Sagar!
Your personal music discovery and playlist manager

[Empty state with features list]
```

Instead of song recommendations.

## Root Cause

```
Frontend (Port 5174)  ----API Call---X  Backend (Port 8000)
     RUNNING                                 NOT RUNNING
```

The frontend is trying to fetch recommendations from:
```
GET http://localhost:8000/stats/recommendations
```

But the backend is NOT running, so the API call fails.

## The Fix

START THE BACKEND!

```bash
# Open a new terminal and run:
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

OR

```bash
# Double-click this file:
start_backend.bat
```

## After Starting Backend

```
Frontend (Port 5174)  ----API Call--->  Backend (Port 8000)
     RUNNING                                  RUNNING
                      <----Songs JSON----
```

The home page will show:
- Recommended for You section
- 16 song cards with thumbnails
- Like, offline, and download buttons
- "Show More" button
- "Fans also like" artists section

## How to Verify

1. Start backend (see above)
2. Wait 3-5 seconds
3. Open: http://localhost:8000/health
4. Should see: `{"status":"healthy"}`
5. Refresh frontend: http://localhost:5174/
6. Recommendations should appear!

## Technical Details

### Frontend Code (Home.jsx)
```javascript
// This API call is failing because backend is not running
const recsRes = await api.get('/stats/recommendations');
```

### Backend Endpoint (stats.py)
```python
@router.get("/recommendations")
def get_recommendations(current_user, db):
    # Returns up to 50 songs based on:
    # 1. User's liked songs (same artists)
    # 2. Trending songs (most played)
    # 3. Random songs from database
```

### Database
The database has 48 songs ready to be recommended.
Location: `backend/music_sagar.db`

## Summary

Problem: Backend not running
Solution: Start backend with `start_backend.bat`
Result: Recommendations will appear on home page

That's it!
