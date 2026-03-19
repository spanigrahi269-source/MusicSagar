# Step-by-Step Guide to Fix Images

## Current Status
✅ Code is ready
⏳ Backend needs restart
⏳ Testing needed

## Step 1: Stop Current Backend
If your backend is running, press `Ctrl+C` in the terminal to stop it.

## Step 2: Restart Backend with New Code

### Windows (Easiest):
Double-click: `restart-backend.bat`

### Or type in terminal:
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

## Step 3: Test the Proxy (Optional but Recommended)

Open a NEW terminal and run:
```bash
python test_proxy.py
```

Expected output:
```
Testing image proxy...
✅ SUCCESS! Proxy is working
   Status: 200
   Content-Type: image/jpeg
   Content-Length: XXXX bytes
```

## Step 4: Test in Browser

1. Open: http://localhost:5173
2. Login: `sagar@example.com` / `Sagar@269`
3. Look at the Home page:
   - You should see song thumbnails
   - You should see artist avatars
4. Try searching for a song
   - Search results should show thumbnails
5. Press F12 to open Console
   - Should see NO red 404 errors for images

## What to Look For

### ✅ Success Signs:
- Images load on Home page
- Artist avatars show photos or gradient letters
- Search results show thumbnails
- No 404 errors in console

### ❌ If Still Not Working:
1. Check backend terminal for errors
2. Check browser console (F12) for errors
3. Verify backend is on port 8000
4. Try hard refresh: `Ctrl+Shift+R`

## How the Fix Works

### Before:
```
Browser → https://i.ytimg.com/... → ❌ 404 Error
```

### After:
```
Browser → http://localhost:8000/proxy/image?url=... → Backend → YouTube → ✅ Image
```

The backend fetches images from YouTube and serves them to your browser, avoiding CORS and 404 issues.

## Files Changed
- `backend/app/routers/proxy.py` - NEW proxy endpoint
- `backend/app/main.py` - Added proxy router
- `frontend/src/pages/Home.jsx` - Use proxy URLs
- `frontend/src/pages/Search.jsx` - Use proxy URLs

## Need Help?
Check these files:
- `DO_THIS_NOW.md` - Quick action guide
- `IMAGE_PROXY_SOLUTION.md` - Technical details
- `QUICK_START_PROXY.md` - Quick reference

---

**Remember:** The key step is restarting the backend! 🔄
