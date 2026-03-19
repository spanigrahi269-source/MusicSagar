# CORS Error Fix Guide

## Problem
The login page shows CORS errors and 401 Unauthorized errors when trying to login.

## Root Causes
1. Backend server might not be running
2. Backend running on wrong port
3. CORS configuration not allowing credentials
4. Cookie not being sent with requests

## Solutions Applied

### 1. Updated CORS Configuration
**File:** `backend/app/main.py`

**Changes:**
- Added both `localhost` and `127.0.0.1` origins
- Explicitly listed all HTTP methods
- Added `expose_headers` configuration
- Kept `allow_credentials=True` for cookie support

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

### 2. Updated Cookie Settings
**File:** `backend/app/routers/auth.py`

**Changes:**
- Added `secure=False` for local development (use `True` in production with HTTPS)
- Kept `samesite="lax"` for better compatibility
- Kept `httponly=True` for security

```python
response.set_cookie(
    key="session_id",
    value=session_id,
    httponly=True,
    max_age=60 * 60 * 24 * 7,  # 7 days
    samesite="lax",
    secure=False  # Set to True in production with HTTPS
)
```

## Step-by-Step Fix Instructions

### Step 1: Stop All Servers
1. Close all terminal windows running backend/frontend
2. Or press Ctrl+C in each terminal

### Step 2: Restart Backend
```bash
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 3: Test Backend (Optional)
Run the test script:
```bash
test-backend.bat
```

Or manually test:
```bash
curl http://localhost:8000/health
```

Should return: `{"status":"healthy"}`

### Step 4: Restart Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Clear Browser Data
1. Open DevTools (F12)
2. Go to Application tab
3. Clear all:
   - Cookies
   - Local Storage
   - Session Storage
4. Or use Ctrl+Shift+Delete → Clear browsing data

### Step 6: Test Login
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: sagar@example.com
   - Password: Sagar@269
3. Click Login
4. Should redirect to home page

## Troubleshooting

### Issue: Backend not starting
**Error:** `Address already in use`

**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: Still getting CORS errors
**Check:**
1. Backend is running on port 8000
2. Frontend is running on port 5173
3. Browser console shows correct URLs
4. No browser extensions blocking requests

**Solution:**
- Try accessing backend directly: http://localhost:8000/docs
- Check if API docs page loads
- Try login from API docs page

### Issue: 401 Unauthorized after login
**Possible Causes:**
1. Cookie not being set
2. Cookie not being sent with requests
3. Session expired

**Solution:**
1. Check DevTools → Application → Cookies
2. Should see `session_id` cookie for localhost
3. If not present, check backend logs for errors
4. Try clearing cookies and login again

### Issue: Login works but other pages show 401
**Cause:** Cookie not being sent with subsequent requests

**Solution:**
1. Verify `withCredentials: true` in `frontend/src/api/axios.js`
2. Check that all API calls use the `api` instance from axios.js
3. Clear browser cache and cookies

## Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Backend health check returns `{"status":"healthy"}`
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] No CORS errors in browser console
- [ ] Login redirects to home page
- [ ] Session cookie visible in DevTools
- [ ] Home page loads without 401 errors
- [ ] Can navigate to all pages (Search, Playlists, Trending, Analytics)

## Quick Start (After Fix)

Use the provided batch file:
```bash
start-local.bat
```

This will:
1. Start backend on port 8000
2. Wait 5 seconds
3. Start frontend on port 5173
4. Show login credentials

## Production Notes

When deploying to production:

1. Update CORS origins to your production domain
2. Set `secure=True` in cookie settings
3. Use HTTPS
4. Consider using `samesite="strict"` for better security
5. Set proper environment variables

## Additional Resources

- FastAPI CORS: https://fastapi.tiangolo.com/tutorial/cors/
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- Cookie SameSite: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
