# 🚀 Quick Fix - 2 Minutes

## Problem
Button shows 404 error when clicked.

## Solution

### Option 1: Automatic (Recommended)
```bash
update-and-restart.bat
```
Then refresh browser (F5)

### Option 2: Manual
```bash
# Terminal 1: Install dependency
cd backend
pip install requests

# Terminal 2: Restart backend
cd backend
uvicorn app.main:app --reload

# Browser: Refresh (F5)
```

## Done!
Click "Load Trending Songs" → See 12 songs! 🎵

---

**That's it!** The fix is applied and ready to test.

Read `FINAL_FIX_INSTRUCTIONS.md` for detailed explanation.
