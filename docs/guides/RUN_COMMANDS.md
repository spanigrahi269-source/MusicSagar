# 🎵 Music Sagar - Run Commands

## 🚀 Fastest Way (Recommended)

### Just double-click this file:
```
start-servers.bat
```
**Location:** `D:\Sagar\MusicSagar\start-servers.bat`

---

## 📝 Command Line Options

### Option 1: Using Batch File
```cmd
cd D:\Sagar\MusicSagar
start-servers.bat
```

### Option 2: Manual Start (2 Windows)

**Terminal 1 - Backend:**
```cmd
cd D:\Sagar\MusicSagar\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```cmd
cd D:\Sagar\MusicSagar\frontend
npm run dev
```

### Option 3: PowerShell

**Terminal 1 - Backend:**
```powershell
cd D:\Sagar\MusicSagar\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```powershell
cd D:\Sagar\MusicSagar\frontend
npm run dev
```

---

## 🌐 Access the Application

After starting both servers:

| What | URL |
|------|-----|
| **Main App** | http://localhost:5173 |
| **API Server** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |

---

## 🔐 Login

```
Email:    sagar@example.com
Password: Sagar@269
```

---

## 🛑 Stop Servers

- Close the command windows
- Or press `Ctrl + C` in each window

---

## 📁 Where to Run Commands

```
Your Project Root: D:\Sagar\MusicSagar\

For Backend:  D:\Sagar\MusicSagar\backend\
For Frontend: D:\Sagar\MusicSagar\frontend\
```

---

## ⚡ Quick Reference

| Task | Command | Where |
|------|---------|-------|
| Start Everything | `start-servers.bat` | Project root |
| Start Backend | `venv\Scripts\activate && python -m uvicorn app.main:app --reload` | backend\ |
| Start Frontend | `npm run dev` | frontend\ |
| Reset Database | `del music_sagar.db && python init_fresh_db.py` | backend\ |
| Check Ports | `netstat -ano \| findstr :8000` | Anywhere |

---

## 🔧 Common Issues

### "Port already in use"
```cmd
# Find process using port 8000
netstat -ano | findstr :8000

# Kill it (replace <PID> with actual number)
taskkill /PID <PID> /F
```

### "Module not found"
```cmd
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### "Database error"
```cmd
cd backend
del music_sagar.db
python init_fresh_db.py
```

---

## 📊 What Each Server Does

### Backend (Port 8000)
- FastAPI REST API
- Handles authentication
- Manages database
- YouTube API integration

### Frontend (Port 5173)
- React application
- User interface
- Music player
- Connects to backend API

---

## 💡 Pro Tips

1. **Keep both terminals open** while using the app
2. **Backend must start first** (frontend needs it)
3. **Check terminal logs** if something doesn't work
4. **Use browser DevTools** (F12) to debug frontend issues
5. **API docs are interactive** - test endpoints at /docs

---

## 📞 Quick Help

**Can't start backend?**
- Check if Python is installed: `python --version`
- Check if in correct folder: `cd D:\Sagar\MusicSagar\backend`
- Check if venv activated: Look for `(venv)` in prompt

**Can't start frontend?**
- Check if Node.js installed: `node --version`
- Check if in correct folder: `cd D:\Sagar\MusicSagar\frontend`
- Try: `npm install` first

**Can't login?**
- Check if backend is running (http://localhost:8000/docs)
- Check if database exists: `backend\music_sagar.db`
- Try creating user: `python backend\init_fresh_db.py`

---

**Ready to start? Just run:** `start-servers.bat` 🎵
