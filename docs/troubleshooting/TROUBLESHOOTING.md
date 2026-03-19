# Music Sagar - Troubleshooting Guide

## 🔍 Quick Diagnosis

Run the diagnostic tool:
```bash
diagnose.bat
```

This will check:
- ✓ Backend running (port 8000)
- ✓ Frontend running (port 5173)
- ✓ Database file exists
- ✓ API endpoints working
- ✓ Python packages installed

---

## ❌ Problem: Songs Not Loading (Stuck on "Loading your music...")

### Symptoms:
- Home page shows loading spinner forever
- No songs appear
- No error message

### Solutions:

#### 1. Backend Not Running
**Check**: Open http://localhost:8000/health in browser
- If it doesn't load → Backend is not running

**Fix**:
```bash
start-local.bat
```

#### 2. Backend Crashed
**Check**: Look at the backend terminal window for errors

**Common Errors**:

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
**Fix**:
```bash
setup-local.bat
```

**Error**: `Address already in use`
**Fix**: Kill the process using port 8000
```bash
# Find process
netstat -ano | findstr :8000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart
start-local.bat
```

#### 3. Database Issues
**Check**: Does `backend/music_sagar.db` exist?

**Fix**: Recreate database
```bash
cd backend
del music_sagar.db
python -m app.init_db
cd ..
start-local.bat
```

#### 4. CORS Issues
**Check**: Browser console (F12) for CORS errors

**Fix**: Already configured in backend, but verify:
- Backend: `backend/app/main.py` has CORS middleware
- Frontend: `frontend/src/api/axios.js` points to http://localhost:8000

---

## ❌ Problem: "Failed to load data" Error Message

### Symptoms:
- Error message appears on home page
- "Retry" button shown

### Solutions:

#### 1. Check Backend Status
```bash
curl http://localhost:8000/health
```

Should return: `{"status":"healthy"}`

#### 2. Test API Endpoints
```bash
test-backend-api.bat
```

#### 3. Check Backend Logs
Look at the backend terminal for error messages

---

## ❌ Problem: Offline Download Not Working

### Symptoms:
- Click 💾 button
- Nothing happens or error shown

### Solutions:

#### 1. FFmpeg Not Installed
**Check**:
```bash
ffmpeg -version
```

**Fix**:
```bash
install-ffmpeg.bat
```

#### 2. Backend Error
**Check**: Backend terminal for download errors

**Common Issues**:
- YouTube video unavailable
- Network connection issues
- Disk space full

---

## ❌ Problem: Search Not Working

### Symptoms:
- Search returns no results
- Search button does nothing

### Solutions:

#### 1. YouTube API Key Missing
**Check**: `backend/.env` file has `YOUTUBE_API_KEY`

**Fix**: Add your YouTube API key to `.env`

#### 2. API Key Invalid
**Check**: Backend logs for "API key invalid" errors

**Fix**: Get a new API key from Google Cloud Console

---

## ❌ Problem: Music Player Not Playing

### Symptoms:
- Click play button
- No music plays
- Player appears but silent

### Solutions:

#### 1. YouTube Embed Issues
- Some videos can't be embedded
- Try a different song

#### 2. Browser Autoplay Policy
- Some browsers block autoplay
- Click play button manually

---

## 🔧 General Fixes

### Complete Reset
If nothing works, try a complete reset:

```bash
# 1. Stop all servers (close terminals)

# 2. Clean install
setup-local.bat

# 3. Start fresh
start-local.bat
```

### Clear Browser Cache
1. Open browser DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Check Ports
Make sure ports 8000 and 5173 are not in use:
```bash
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

---

## 📊 Checking Logs

### Backend Logs
- Look at the terminal running the backend
- Errors appear in red
- Common issues: Database errors, API errors

### Frontend Logs
- Open browser DevTools (F12)
- Go to Console tab
- Look for red error messages

### Network Requests
- Open browser DevTools (F12)
- Go to Network tab
- Refresh page
- Check if API calls are failing (red status)

---

## 🆘 Still Not Working?

### Collect Information:
1. Run `diagnose.bat` and save output
2. Check backend terminal for errors
3. Check browser console (F12) for errors
4. Note which feature is not working

### Common Issues Checklist:
- [ ] Backend running on port 8000?
- [ ] Frontend running on port 5173?
- [ ] Database file exists?
- [ ] Python packages installed?
- [ ] Node packages installed?
- [ ] YouTube API key configured?
- [ ] FFmpeg installed (for downloads)?

---

## 💡 Tips

1. **Always run `start-local.bat`** - Don't start servers manually
2. **Check both terminals** - Backend and frontend run separately
3. **Wait for startup** - Backend takes 5-10 seconds to start
4. **Use Chrome/Edge** - Best compatibility
5. **Check firewall** - May block localhost connections

---

## 🔄 Quick Commands Reference

```bash
# Setup (first time only)
setup-local.bat

# Start application
start-local.bat

# Diagnose issues
diagnose.bat

# Test backend API
test-backend-api.bat

# Install FFmpeg
install-ffmpeg.bat
```
