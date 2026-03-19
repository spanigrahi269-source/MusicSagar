# Search Not Working - Complete Troubleshooting Guide

## Quick Diagnosis

Run these commands in order:

```bash
# 1. Check if backend is running
python test_search_simple.py

# 2. Check API key status
python test_30_keys.py

# 3. Full diagnostic
python diagnose_search.py
```

## Issue #1: Backend Not Running

### Symptoms:
- Search button does nothing
- "Network Error" in browser console
- "Connection refused" errors

### Solution:
```bash
# Start both servers:
start-local.bat

# Or manually:
# Terminal 1:
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2:
cd frontend
npm run dev
```

### Verify:
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:5173

---

## Issue #2: All API Keys Quota Exceeded

### Symptoms:
- Search returns "quota exceeded" error
- Red error card in search page
- Backend logs show "quotaExceeded"

### Check Status:
```bash
python test_30_keys.py
```

### Solution:
**If all 30 keys show "Quota Exceeded":**

1. **Wait for Reset**
   - Keys reset at **midnight Pacific Time**
   - That's 3:30 AM EST / 1:00 PM IST (next day)

2. **Check Current Time**
   - Pacific Time: https://time.is/PT
   - Hours until reset: Calculate from midnight PT

3. **Temporary Workaround**
   - Use cached/saved songs from database
   - Browse history and playlists
   - Wait for reset

**If some keys are working:**
- Backend should automatically use them
- Restart backend to clear failed key cache:
  ```bash
  # Stop backend (Ctrl+C)
  # Restart:
  cd backend
  .venv\Scripts\activate
  uvicorn app.main:app --reload --port 8000
  ```

---

## Issue #3: Frontend Not Showing Results

### Symptoms:
- Search completes but no results shown
- Loading spinner never stops
- Console shows JavaScript errors

### Solution:

**Step 1: Clear Browser Cache**
```
1. Press Ctrl + Shift + Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Close and reopen browser
5. Go to http://localhost:5173
6. Press Ctrl + F5 (hard refresh)
```

**Step 2: Check Browser Console**
```
1. Press F12
2. Click "Console" tab
3. Look for red errors
4. Common errors and fixes:
   - "Cannot read property": Clear cache
   - "Network Error": Backend not running
   - "401 Unauthorized": Login again
   - "429 Too Many Requests": Quota exceeded
```

**Step 3: Check Network Tab**
```
1. Press F12
2. Click "Network" tab
3. Search for something
4. Look for "/youtube/search" request
5. Check:
   - Status code (should be 200)
   - Response data
   - Error messages
```

---

## Issue #4: Search Returns Empty Results

### Symptoms:
- Search completes successfully
- Shows "No results found"
- But you know results should exist

### Possible Causes:

**1. Search Term Too Specific**
- Try broader terms: "hindi songs" instead of "specific song name"
- Try English terms: "music" instead of language-specific

**2. Language Filter Issue**
- Try "All Languages" filter
- Then try specific language

**3. API Response Issue**
- Check backend logs for errors
- Restart backend

### Solution:
```bash
# Test with simple term:
python test_search_simple.py

# If that works, issue is in frontend
# Clear browser cache and try again
```

---

## Issue #5: Search Very Slow

### Symptoms:
- Takes 10-30 seconds to return results
- Eventually works but slow

### Cause:
Backend is trying multiple API keys because many have quota exceeded.

### Solution:

**Immediate:**
- Wait for search to complete (it will work)
- Results are cached after first search

**Long-term:**
- Wait for midnight PT when keys reset
- Add more API keys if needed

---

## Issue #6: "Invalid API Key" Error

### Symptoms:
- Search returns error about invalid key
- Backend logs show authentication errors

### Solution:

**Check .env file:**
```bash
# Open backend/.env
# Verify all 30 keys are present
# Format: YOUTUBE_API_KEY_1=AIzaSy...
```

**Restart backend:**
```bash
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

---

## Testing Checklist

Run these tests in order:

- [ ] Backend running: http://localhost:8000/docs
- [ ] Frontend running: http://localhost:5173
- [ ] Can login: sagar@example.com / Sagar@269
- [ ] API keys configured: Check backend/.env
- [ ] At least 1 key working: `python test_30_keys.py`
- [ ] Search endpoint works: `python test_search_simple.py`
- [ ] Browser cache cleared: Ctrl+Shift+Delete
- [ ] No console errors: F12 → Console

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Network Error" | Backend not running | Start backend |
| "All API keys exceeded quota" | Quota limit hit | Wait for midnight PT |
| "Cannot read property of undefined" | Cache issue | Clear browser cache |
| "401 Unauthorized" | Not logged in | Login again |
| "Connection refused" | Wrong port | Check ports 8000/5173 |
| "Timeout" | Slow API response | Wait or restart backend |

---

## Still Not Working?

### Collect This Information:

1. **Backend Status:**
   ```bash
   # Is it running?
   curl http://localhost:8000/docs
   ```

2. **API Key Status:**
   ```bash
   python test_30_keys.py
   ```

3. **Search Test:**
   ```bash
   python test_search_simple.py
   ```

4. **Browser Console:**
   - Press F12
   - Copy any red errors

5. **Backend Logs:**
   - Look at terminal where backend is running
   - Copy any error messages

### Share These Details:
- What exactly happens when you search?
- What error message do you see?
- Results from the 3 test scripts above
- Browser console errors
- Backend console errors

---

## Prevention Tips

1. **Monitor Quota:**
   ```bash
   # Check daily:
   python test_30_keys.py
   ```

2. **Keep Backend Running:**
   - Don't close terminal
   - Use `start-local.bat` for easy restart

3. **Clear Cache Regularly:**
   - After code changes
   - If seeing weird behavior

4. **Check Logs:**
   - Backend terminal for API errors
   - Browser console for frontend errors

---

## Emergency Reset

If nothing works, do a complete reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear browser completely
#    - Close all browser windows
#    - Clear cache (Ctrl+Shift+Delete)

# 3. Restart everything
start-local.bat

# 4. Wait 30 seconds for servers to start

# 5. Open fresh browser window
#    http://localhost:5173

# 6. Login and test search
```
