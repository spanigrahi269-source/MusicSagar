import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import History from './pages/History';
import Trending from './pages/Trending';
import Analytics from './pages/Analytics';
import Offline from './pages/Offline';
import MoodSlider from './pages/MoodSlider';
import SimpleLogin from './pages/SimpleLogin';
import Sidebar from './components/Sidebar';
import FullScreenPlayer from './components/FullScreenPlayer';
import MiniPlayer from './components/MiniPlayer';
import Onboarding from './components/Onboarding';
import ToastContainer from './components/ToastContainer';
import './App.css';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [playHistory, setPlayHistory] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is logged in with JWT token
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      
      // Check if onboarding should be shown
      const onboardingCompleted = localStorage.getItem('music_sagar_onboarding_completed');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setShowFullScreen(true);
    setIsPlaying(true);
    // Add to play history for previous functionality
    setPlayHistory(prev => [...prev, song]);
  };

  const addToQueue = (song) => {
    setQueue(prev => [...prev, song]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(prev => prev.slice(1));
      setPlayHistory(prev => [...prev, nextSong]);
      setShowFullScreen(true);
      if (window.showToast) {
        window.showToast('⏭️ Playing next song', 'info');
      }
    } else {
      if (window.showToast) {
        window.showToast('Queue is empty', 'info');
      }
    }
  };

  const playPrevious = () => {
    if (playHistory.length > 1) {
      // Remove current song and get previous
      const newHistory = [...playHistory];
      newHistory.pop(); // Remove current
      const previousSong = newHistory[newHistory.length - 1];
      setCurrentSong(previousSong);
      setPlayHistory(newHistory);
      setShowFullScreen(true);
      if (window.showToast) {
        window.showToast('⏮️ Playing previous song', 'info');
      }
    } else {
      if (window.showToast) {
        window.showToast('No previous song', 'info');
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleMiniPlayerExpand = () => {
    setShowFullScreen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    // Reload to show login page
    window.location.href = '/';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          // Space for play/pause (handled in MusicPlayer)
          break;
        case 'q':
          if (currentSong && e.ctrlKey) {
            e.preventDefault();
            addToQueue(currentSong);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSong]);

  // If not authenticated, show login
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<SimpleLogin />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-container">
          <Sidebar 
            onThemeToggle={toggleTheme} 
            currentTheme={theme}
            username={user?.username}
            onLogout={handleLogout}
          />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home onPlaySong={handlePlaySong} addToQueue={addToQueue} onLogout={handleLogout} />} />
              <Route path="/search" element={<Search onPlaySong={handlePlaySong} addToQueue={addToQueue} />} />
              <Route path="/mood" element={<MoodSlider onPlaySong={handlePlaySong} addToQueue={addToQueue} />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlists/:id" element={<PlaylistDetail onPlaySong={handlePlaySong} addToQueue={addToQueue} />} />
              <Route path="/history" element={<History onPlaySong={handlePlaySong} addToQueue={addToQueue} />} />
              <Route path="/offline" element={<Offline onPlaySong={handlePlaySong} />} />
              <Route path="/trending" element={<Trending onPlaySong={handlePlaySong} addToQueue={addToQueue} />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          {showFullScreen && (
            <FullScreenPlayer 
              currentSong={currentSong} 
              onClose={() => setShowFullScreen(false)}
              onPlaySong={handlePlaySong}
              onNext={playNext}
              onPrevious={playPrevious}
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              onProgressUpdate={setProgress}
            />
          )}
          {!showFullScreen && currentSong && (
            <MiniPlayer 
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              onNext={playNext}
              onPrevious={playPrevious}
              onExpand={handleMiniPlayerExpand}
              progress={progress}
            />
          )}
          <Onboarding onComplete={() => setShowOnboarding(false)} />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
