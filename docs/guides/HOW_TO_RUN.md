# How to Run Music Sagar (Without Kiro)

## Quick Start - Using Batch File

### Option 1: Double-Click the Batch File (Easiest)
1. Navigate to your project folder: `D:\Sagar\MusicSagar`
2. Double-click `start-servers.bat`
3. Two command windows will open (Backend and Frontend)
4. Wait 10-15 seconds for servers to start
5. Open browser and go to: http://localhost:5173

### Option 2: Run from Command Prompt
1. Open Command Prompt (cmd)
2. Navigate to project folder:
   ```cmd
   cd D:\Sagar\MusicSagar
   ```
3. Run the batch file:
   ```cmd
   start-servers.bat
   ```

---

## Manual Start (Step by Step)

### Step 1: Start Backend Server

**Open Command Prompt #1:**
```cmd
cd D:\Sagar\MusicSagar\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

**Or in one line:**
```cmd
cd D:\Sagar\MusicSagar\backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 2: Start Frontend Server

**Open Command Prompt #2 (New Window):**
```cmd
cd D:\Sagar\MusicSagar\frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 3: Open in Browser
- Go to: http://localhost:5173
- Login with:
  - Email: `sagar@example.com`
  - Password: `Sagar@269`

---

## Using PowerShell

### Start Backend:
```powershell
cd D:\Sagar\MusicSagar\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

### Start Frontend:
```powershell
cd D:\Sagar\MusicSagar\frontend
npm run dev
```

---

## Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:8000 | API server |
| API Documentation | http://localhost:8000/docs | Interactive API docs |
| API Redoc | http://localhost:8000/redoc | Alternative API docs |

---

## Stopping the Servers

### If using batch file:
- Close both command windows (Backend and Frontend)

### If running manually:
- Press `Ctrl + C` in each command window
- Or simply close the command windows

---

## Troubleshooting

### Port Already in Use

**Backend (Port 8000):**
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

**Frontend (Port 5173):**
```cmd
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Backend Not Starting
1. Make sure you're in the backend folder
2. Activate virtual environment first
3. Check if Python is installed: `python --version`
4. Check if dependencies are installed: `pip list`

### Frontend Not Starting
1. Make sure you're in the frontend folder
2. Check if Node.js is installed: `node --version`
3. Check if npm is installed: `npm --version`
4. Install dependencies if needed: `npm install`

### Database Issues
If you get database errors, recreate the database:
```cmd
cd D:\Sagar\MusicSagar\backend
del music_sagar.db
python init_fresh_db.py
```

---

## Project Structure

```
D:\Sagar\MusicSagar\
├── backend/                 # FastAPI backend
│   ├── venv/               # Python virtual environment
│   ├── app/                # Application code
│   │   ├── main.py        # Main FastAPI app
│   │   ├── routers/       # API routes
│   │   └── models.py      # Database models
│   ├── music_sagar.db     # SQLite database
│   └── requirements.txt   # Python dependencies
│
├── frontend/               # React frontend
│   ├── src/               # Source code
│   │   ├── App.jsx        # Main app component
│   │   ├── pages/         # Page components
│   │   └── components/    # Reusable components
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Vite configuration
│
└── start-servers.bat      # Quick start script
```

---

## Development Tips

### Backend Development
- API auto-reloads on code changes (--reload flag)
- View logs in the backend command window
- Test API at http://localhost:8000/docs

### Frontend Development
- UI auto-reloads on code changes (Vite HMR)
- View console logs in browser DevTools (F12)
- React DevTools extension recommended

### Database Management
- Database file: `backend/music_sagar.db`
- View with SQLite browser or DB Browser for SQLite
- Backup before making changes

---

## Quick Commands Reference

### Backend Commands
```cmd
# Navigate to backend
cd D:\Sagar\MusicSagar\backend

# Activate virtual environment
venv\Scripts\activate

# Start server
python -m uvicorn app.main:app --reload

# Create fresh database
python init_fresh_db.py

# Check users
python check_users.py
```

### Frontend Commands
```cmd
# Navigate to frontend
cd D:\Sagar\MusicSagar\frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Login Credentials

**Default User:**
- Username: `sagar`
- Email: `sagar@example.com`
- Password: `Sagar@269`

**Create New User:**
- Use the signup page in the app
- Or run: `python backend/create_sagar_user.py`

---

## Need Help?

1. Check if both servers are running
2. Check browser console for errors (F12)
3. Check backend terminal for API errors
4. Verify database exists: `backend/music_sagar.db`
5. Try restarting both servers

---

**Last Updated:** February 27, 2026
**Project:** Music Sagar v1.0
**Tech Stack:** FastAPI + React + SQLite
