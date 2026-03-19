# 🚀 Music Sagar - Quick Start Guide

Get Music Sagar up and running in 5 minutes!

---

## ⚡ Prerequisites

Before you begin, ensure you have:
- ✅ Python 3.8 or higher
- ✅ Node.js 16 or higher
- ✅ YouTube Data API v3 key ([Get one here](https://console.cloud.google.com/apis/credentials))

---

## 📥 Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/music-sagar.git
cd music-sagar
```

---

## 🐍 Step 2: Setup Backend (2 minutes)

### Install Dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### Configure Environment
Create `backend/.env` file:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
SECRET_KEY=your_secret_key_for_jwt_here
```

### Initialize Database
```bash
python init_fresh_db.py
```

This creates:
- ✅ Database tables
- ✅ Default user (sagar@example.com / Sagar@269)

---

## ⚛️ Step 3: Setup Frontend (1 minute)

```bash
cd ../frontend
npm install
```

---

## 🎵 Step 4: Run the Application

### Option A: Using Batch Script (Windows)
```bash
# From project root
start-local.bat
```

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Step 5: Access the App

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔑 Step 6: Login

Use the default credentials:
- **Email**: `sagar@example.com`
- **Password**: `Sagar@269`

---

## 🎉 You're Done!

You should now see the Music Sagar home screen with recommendations!

---

## 🎯 Next Steps

### Explore Features
1. **Search** - Find your favorite songs
2. **Mood Slider** - Discover music by mood
3. **Create Playlists** - Organize your music
4. **Like Songs** - Build your preferences
5. **Karaoke Mode** - Sing along with lyrics

### Customize
1. **Change Theme** - Try different music types for dynamic themes
2. **Create User** - Add more users with `create_user.py`
3. **Configure API** - Update YouTube API key in `.env`

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process if needed
taskkill /PID <process_id> /F
```

### Frontend Won't Start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Reset database
cd backend
rm music_sagar.db
python init_fresh_db.py
```

### API Key Issues
- Verify your YouTube API key is correct
- Check if YouTube Data API v3 is enabled in Google Cloud Console
- Ensure you haven't exceeded API quota

---

## 📚 Learn More

- **[Full Documentation](docs/INDEX.md)** - Complete guide
- **[Features](ALL_FEATURES_STATUS.md)** - All features list
- **[API Reference](docs/api/API_DOCUMENTATION.md)** - API endpoints
- **[Troubleshooting](docs/troubleshooting/TROUBLESHOOTING.md)** - Common issues

---

## 💡 Tips

### For Development
- Use `--reload` flag for auto-restart on code changes
- Check browser console for frontend errors
- Check terminal for backend errors
- Use API docs at `/docs` for testing endpoints

### For Production
- Change `SECRET_KEY` to a strong random string
- Use PostgreSQL instead of SQLite
- Enable HTTPS
- Set up proper CORS configuration
- Use environment-specific `.env` files

---

## 🎵 Enjoy Your Music!

Start exploring, create playlists, and discover new songs with Music Sagar!

---

**Need Help?**
- Check [Documentation](docs/INDEX.md)
- Read [Troubleshooting Guide](docs/troubleshooting/TROUBLESHOOTING.md)
- Open an [Issue](https://github.com/yourusername/music-sagar/issues)

---

**Happy Listening! 🎧**
