# Backend Not Running - Fix Guide

## Problem
Login is failing with CORS errors and "Login failed" message because the backend server is not running.

## Symptoms
- Login page shows "Login failed"
- Console shows CORS policy errors
- Console shows "ERR_FAILED" or "net::ERR_FAILED"
- Console shows 401 Unauthorized errors
- API calls to localhost:8000 fail

## Root Cause
The backend server (FastAPI) is not running on port 8000.

## Solution

### Option 1: Use the Start Script (Easiest)
Double-click `start-servers.bat` in the project root folder.

This will:
1. Check if backend is running, start it if not
2. Check if frontend is running, start it if not
3. Show you the URLs and login credentials

### Option 2: Manual Start

#### Step 1: Start Backend
Open a new terminal/command prompt:

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
✅ Default user 'sagar' already exists
INFO:     Application startup complete.
```

**Keep this terminal open!** Don't close it.

#### Step 2: Start Frontend
Open another new terminal/command prompt:

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

**Keep this terminal open too!**

#### Step 3: Test Backend
Open a new terminal and run:

```bash
curl http://localhost:8000/health
```

**Expected Output:**
```json
{"status":"healthy"}
```

If you see this, backend is running correctly!

### Option 3: Use Original Start Script
Double-click `start-local.bat` in the project root folder.

## Verification Steps

### 1. Check Backend is Running
Open browser and go to: http://localhost:8000/docs

You should see the FastAPI Swagger documentation page.

### 2. Check Frontend is Running
Open browser and go to: http://localhost:5173

You should see the Music Sagar login page.

### 3. Test Login
1. Go to http://localhost:5173/login
2. Enter:
   - Email: sagar@example.com
   - Password: Sagar@269
3. Click Login
4. Should redirect to home page

## Common Issues

### Issue 1: "Port 8000 is already in use"
**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Then start backend again
```

### Issue 2: "venv\Scripts\activate not found"
**Solution:**
```bash
# Create virtual environment
cd backend
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Issue 3: "Module not found" errors
**Solution:**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue 4: Frontend not starting
**Solution:**
```bash
cd frontend
npm install
npm run dev
```

### Issue 5: Still getting CORS errors
**Checklist:**
- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] Both terminals are still open
- [ ] No errors in backend terminal
- [ ] Clear browser cache and localStorage
- [ ] Try in incognito/private window

## Quick Checklist

Before trying to login, verify:

- [ ] Backend terminal is open and showing "Application startup complete"
- [ ] Frontend terminal is open and showing "ready in xxx ms"
- [ ] http://localhost:8000/docs loads successfully
- [ ] http://localhost:5173 loads successfully
- [ ] No errors in either terminal
- [ ] Browser console is clear (F12 → Console)

## Testing Backend Manually

### Test 1: Health Check
```bash
curl http://localhost:8000/health
```
Expected: `{"status":"healthy"}`

### Test 2: Root Endpoint
```bash
curl http://localhost:8000/
```
Expected: `{"message":"Welcome to Music Sagar API"}`

### Test 3: Login Endpoint
```bash
curl -X POST http://localhost:8000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"sagar@example.com\",\"password\":\"Sagar@269\"}"
```
Expected: JSON with `access_token` and `user` object

If all three tests pass, backend is working correctly!

## Still Not Working?

### Check Backend Logs
Look at the backend terminal for errors. Common errors:

1. **Database errors**: Delete `backend/music_sagar.db` and restart
2. **Import errors**: Run `pip install -r requirements.txt`
3. **Port errors**: Kill process on port 8000 and restart

### Check Frontend Logs
Look at the frontend terminal for errors. Common errors:

1. **Module not found**: Run `npm install`
2. **Port errors**: Kill process on port 5173 and restart

### Check Browser Console
Press F12 and look at Console tab. Common errors:

1. **CORS errors**: Backend not running
2. **404 errors**: Wrong API URL
3. **401 errors**: Authentication issue (expected before login)

## Success Indicators

When everything is working:

✅ Backend terminal shows "Application startup complete"
✅ Frontend terminal shows "ready in xxx ms"
✅ http://localhost:8000/docs loads
✅ http://localhost:5173 loads
✅ Login page displays without errors
✅ Can enter credentials
✅ Login button works
✅ Redirects to home page after login

## Need Help?

If still not working after following all steps:

1. Close all terminals
2. Restart your computer
3. Run `start-servers.bat`
4. Try login again

If that doesn't work, check:
- Python is installed (run `python --version`)
- Node.js is installed (run `node --version`)
- All dependencies are installed
- No antivirus blocking the servers
- No firewall blocking ports 8000 or 5173
