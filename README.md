<<<<<<< HEAD
# 🎵 Music Sagar

> Your personal music streaming platform powered by YouTube

A modern, feature-rich music streaming application built with FastAPI and React, offering personalized recommendations, mood-based discovery, and an immersive listening experience.

---

## ✨ Features

### 🎯 Smart Recommendations
- Personalized song suggestions based on your listening habits
- Artist and genre matching algorithm
- Trending songs for new users
- Like/unlike functionality with instant feedback

### 🎭 Mood-Based Discovery
- Dynamic mood slider (0-100 intensity)
- 5 mood categories: Sad, Calm, Romantic, Happy, Energetic
- Language selection (Hindi, English, Punjabi, All)
- Real-time song recommendations

### 🎨 Dynamic Themes
- 6 automatic themes based on music type
- Devotional, Romantic, Party, EDM, Chill, Sad
- Custom gradients, fonts, and animations
- Smooth transitions between themes

### 🎤 Karaoke Mode
- Full-screen lyrics display
- Auto-scrolling with playback sync
- Line highlighting
- Mobile responsive

### 🎵 Music Player
- YouTube integration with iFrame API
- Progress bar with drag-to-seek
- Audio-only mode with visualizer
- Fullscreen mode with animated effects
- Keyboard shortcuts (Space, ←, →)

### 📚 Playlist Management
- Create and manage playlists
- Add songs from anywhere
- Playlist detail view
- Quick add from song cards

### 📥 Offline Access
- Save songs for quick access
- Offline songs page
- One-click save/unsave

### 📊 Analytics
- Play history tracking
- Most played songs
- Listening statistics
- Trending songs

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- YouTube Data API v3 key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/music-sagar.git
   cd music-sagar
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   Create `backend/.env`:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   SECRET_KEY=your_secret_key_for_jwt
   ```

4. **Initialize Database**
   ```bash
   python init_fresh_db.py
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the App**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Default Credentials
- Email: `sagar@example.com`
- Password: `Sagar@269`

---

## 📖 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Documentation Index](docs/INDEX.md)** - Complete documentation overview
- **[How to Run](docs/guides/HOW_TO_RUN.md)** - Detailed setup guide
- **[All Features Status](ALL_FEATURES_STATUS.md)** - Feature checklist
- **[API Documentation](docs/api/API_DOCUMENTATION.md)** - API reference
- **[Troubleshooting](docs/troubleshooting/TROUBLESHOOTING.md)** - Common issues

### Quick Links
- [Features Documentation](docs/INDEX.md#-features-documentation)
- [User Guides](docs/INDEX.md#-guides)
- [Troubleshooting](docs/INDEX.md#-troubleshooting)
- [API Reference](docs/INDEX.md#-api-documentation)

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **JWT** - Secure authentication
- **YouTube Data API v3** - Music source
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navigation
- **YouTube IFrame API** - Video player
- **Custom CSS** - Styling

---

## 📁 Project Structure

```
music-sagar/
├── backend/
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   │   ├── auth.py      # Authentication
│   │   │   ├── youtube.py   # YouTube search
│   │   │   ├── stats.py     # Recommendations & analytics
│   │   │   ├── playlists.py # Playlist management
│   │   │   ├── history.py   # Play history
│   │   │   ├── offline.py   # Offline songs
│   │   │   └── ai.py        # AI features (mood, karaoke)
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # Database connection
│   │   ├── auth.py          # JWT authentication
│   │   ├── utils.py         # Utility functions
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── MusicPlayer.jsx
│   │   │   ├── KaraokeMode.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── MoodSlider.jsx
│   │   │   ├── Playlists.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Offline.jsx
│   │   │   ├── Trending.jsx
│   │   │   └── Analytics.jsx
│   │   ├── contexts/        # React contexts
│   │   │   └── ThemeContext.jsx
│   │   ├── utils/           # Utility functions
│   │   │   ├── auth.js
│   │   │   ├── themeConfig.js
│   │   │   └── detectMusicType.js
│   │   ├── api/
│   │   │   └── axios.js     # API client
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/                    # Documentation
│   ├── INDEX.md            # Documentation index
│   ├── features/           # Feature docs
│   ├── guides/             # User guides
│   ├── troubleshooting/    # Problem solving
│   ├── api/                # API docs
│   └── testing/            # Test docs
├── README.md               # This file
└── ALL_FEATURES_STATUS.md  # Feature status
```

---

## 🎯 Key Features Status

| Feature | Status | Documentation |
|---------|--------|---------------|
| Smart Recommendations | ✅ Complete | [Link](docs/features/RECOMMENDATION_SYSTEM_COMPLETE.md) |
| Mood Slider | ✅ Complete | [Link](docs/features/ADVANCED_FEATURES_COMPLETE.md) |
| Dynamic Themes | ✅ Complete | [Link](docs/features/ADVANCED_FEATURES_COMPLETE.md) |
| Karaoke Mode | ✅ Complete | [Link](docs/features/ADVANCED_FEATURES_COMPLETE.md) |
| Fullscreen Player | ✅ Complete | [Link](docs/features/FULLSCREEN_PLAYER_FEATURE.md) |
| Progress Bar | ✅ Complete | [Link](docs/features/ENHANCED_PROGRESS_BAR_COMPLETE.md) |
| Offline Access | ✅ Complete | [Link](docs/features/OFFLINE_FEATURE_COMPLETE.md) |
| Search Optimization | ✅ Complete | [Link](docs/features/SEARCH_OPTIMIZATION_COMPLETE.md) |
| Playlist Management | ✅ Complete | [Link](docs/api/RECOMMENDATIONS_AND_PLAYLIST_DETAIL.md) |
| Play History | ✅ Complete | [Link](docs/features/HISTORY_AND_DOWNLOAD_FEATURES_COMPLETE.md) |
| Analytics | ✅ Complete | [Link](docs/features/UI_POLISH_AND_DATA_FEATURES_COMPLETE.md) |
| Authentication | ✅ Complete | [Link](docs/troubleshooting/AUTHENTICATION_COMPLETE.md) |

**Total: 12 Features Complete** 🎉

---

## 🎨 Screenshots

### Home Screen with Recommendations
![Home Screen](screenshots/home.png)

### Mood Slider
![Mood Slider](screenshots/mood.png)

### Fullscreen Player
![Fullscreen Player](screenshots/fullscreen.png)

### Karaoke Mode
![Karaoke Mode](screenshots/karaoke.png)

---

## 🔑 Environment Variables

### Backend (.env)
```env
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_here

# JWT Authentication
SECRET_KEY=your_secret_key_for_jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///./music_sagar.db
```

---

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

See [Testing Documentation](docs/testing/) for more details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- YouTube Data API v3 for music source
- FastAPI for the excellent backend framework
- React for the powerful UI library
- All open-source contributors

---

## 📞 Support

- **Documentation**: [docs/INDEX.md](docs/INDEX.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/music-sagar/issues)
- **Email**: support@musicsagar.com

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Social features (share playlists, follow users)
- [ ] Collaborative playlists
- [ ] Real lyrics API integration (Genius, Musixmatch)
- [ ] Voice commands
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Podcast support
- [ ] Live radio stations
- [ ] Music quiz game
- [ ] Sleep timer

---

## 📊 Stats

- **Lines of Code**: ~15,000+
- **Components**: 20+
- **API Endpoints**: 30+
- **Features**: 12 Complete
- **Documentation Pages**: 40+

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Made with ❤️ by Sagar**

**Version**: 1.0.0  
**Last Updated**: February 27, 2026  
**Status**: Production Ready ✅
=======
# MusicSagar
>>>>>>> 15d2732341c316399bf995f237ad738cccd72d31
