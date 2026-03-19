# Fix Search Issue - Quick Guide

## Problem
Search is not working properly.

## Most Common Causes

### 1. Backend Not Running ⚠️
The backend server needs to be running for search to work.

### 2. API Keys Quota Exceeded ⚠️
All 30 API keys might have exceeded their daily quota.

### 3. Browser Cache Issues ⚠️
Old cached code might be causing issues.

## Solution - Follow These Steps

### Step 1: Restart Backend Server

**Option A: Use Batch File (Easiest)**
```bash
# Double-click this file:
start-local.bat
```

**Option B: Manual Start**
```bash
# Open Terminal 1 - Backend
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Open Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Step 2: Check API Key Status

Run this to see which keys are working:
```bash
python test_30_keys.py
```

If all keys show "Quota Exceeded":
- ⏰ Keys reset at **midnight Pacific Time**
- 💡 Wait for reset or get more keys
- 📊 You have 30 keys = 300,000 units/day after reset

### Step 3: Clear Browser Cache

1. Open your browser (Chrome/Edge)
2. Press **Ctrl + Shift + Delete**
3. Select "Cached images and files"
4. Click "Clear data"
5. Refresh the page (**Ctrl + F5**)

### Step 4: Check Browser Console

1. Press **F12** to open Developer Tools
2. Click "Console" tab
3. Look for red error messages
4. Share any errors you see

## Quick Diagnostic

Run this to diagnose the issue:
```bash
python diagnose_search.py
```

This will check:
- ✅ Is backend running?
- ✅ Are API keys configured?
- ✅ Is search endpoint working?
- ✅ Are API keys valid?
- ✅ Is frontend running?

## Common Error Messages

### "All YouTube API keys have exceeded their quota"
**Solution**: Wait for midnight Pacific Time reset, or add more keys

### "Network Error" or "Failed to fetch"
**Solution**: Backend is not running - start it with `start-local.bat`

### "Cannot read property of undefined"
**Solution**: Clear browser cache and refresh

### Search returns no results
**Solution**: 
1. Check if you're logged in
2. Try a different search term
3. Check backend console for errors

## Verify It's Working

1. Go to http://localhost:5173
2. Login with: sagar@example.com / Sagar@269
3. Click "Search" in sidebar
4. Type "test" and press Enter
5. Should see search results

## Still Not Working?

### Check Backend Logs
Look at the terminal where backend is running for error messages.

### Check Frontend Logs  
Press F12 → Console tab → Look for errors

### Restart Everything
```bash
# Stop all servers (Ctrl+C in both terminals)
# Then restart:
start-local.bat
```

### Check Ports
Make sure nothing else is using ports 8000 or 5173:
```bash
netstat -ano | findstr "8000"
netstat -ano | findstr "5173"
```

## Need More Help?

Share these details:
1. What error message do you see?
2. What happens when you search?
3. Backend console output
4. Browser console errors (F12)
5. Result of `python diagnose_search.py`
