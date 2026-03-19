# Music Sagar - Mobile App

React Native (Expo) mobile app for Music Sagar.

## Setup

### 1. Install dependencies
```bash
cd mobile
npm install
```

### 2. Configure API URL
Edit `src/api/axios.js` and set `API_URL` to your backend:
- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://localhost:8000`
- Physical device: `http://<your-local-ip>:8000`

### 3. Add placeholder assets
Place these files in `assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

You can use any image temporarily. Expo will use them for the app icon and splash screen.

### 4. Start the backend
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Run the mobile app
```bash
cd mobile
npx expo start
```

Then press:
- `a` for Android emulator
- `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

## Features
- Login / Signup with JWT auth
- YouTube music search with language filter
- Home with personalized recommendations
- Trending songs
- Playlists (create, manage, add songs)
- Listening history
- Liked songs
- Saved/offline songs
- Mood-based music discovery
- Full-screen YouTube player (WebView)
- Mini player with controls
- Profile & analytics

## Tech Stack
- Expo SDK 51
- React Navigation (bottom tabs + stack)
- expo-secure-store (JWT token storage)
- react-native-webview (YouTube player)
- @react-native-community/slider (mood slider)
- expo-linear-gradient (UI gradients)
- @expo/vector-icons (Ionicons)
