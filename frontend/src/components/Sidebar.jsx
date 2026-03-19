import { Link, useLocation } from 'react-router-dom';

function Sidebar({ onThemeToggle, currentTheme, username, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-image-container">
          <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Treble clef in S shape */}
            <path d="M 50 10 C 35 10, 25 20, 25 35 C 25 45, 30 50, 40 50 C 45 50, 50 47, 50 42 C 50 38, 47 35, 43 35 C 40 35, 38 37, 38 40 C 38 42, 39 43, 41 43 L 41 45 C 37 45, 35 42, 35 38 C 35 32, 40 28, 47 28 C 55 28, 60 33, 60 42 C 60 52, 52 60, 40 60 C 25 60, 15 48, 15 32 C 15 15, 28 5, 45 5 C 55 5, 63 10, 68 18 L 65 21 C 61 14, 54 10, 45 10 M 50 45 C 50 45, 55 50, 55 58 C 55 68, 48 75, 38 75 C 30 75, 25 70, 25 63 C 25 58, 28 55, 33 55 C 37 55, 40 57, 40 61 C 40 64, 38 66, 35 66 L 35 68 C 39 68, 42 65, 42 61 C 42 56, 38 52, 33 52 C 26 52, 20 57, 20 65 C 20 75, 28 82, 40 82 C 52 82, 62 72, 62 58 C 62 48, 56 42, 50 40" 
                  fill="#ffffff" 
                  stroke="#ffffff" 
                  strokeWidth="2"/>
            {/* Musical notes accent */}
            <text x="75" y="30" fontSize="20" fill="#ffffff" className="note-accent">♪</text>
            <text x="70" y="85" fontSize="16" fill="#ffffff" className="note-accent">♫</text>
          </svg>
        </div>
        <span className="logo-text">Music Sagar</span>
      </div>

      {username && (
        <div className="user-info">
          <span className="user-icon">👤</span>
          <span className="user-name">{username}</span>
        </div>
      )}

      <nav className="nav-menu">
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/search" className={`nav-item ${isActive('/search')}`}>
          <span className="nav-icon">🔍</span>
          <span>Search</span>
        </Link>
        <Link to="/mood" className={`nav-item ${isActive('/mood')}`}>
          <span className="nav-icon">🎭</span>
          <span>Mood</span>
        </Link>
        <Link to="/playlists" className={`nav-item ${isActive('/playlists')}`}>
          <span className="nav-icon">📚</span>
          <span>Your Playlists</span>
        </Link>
        <Link to="/offline" className={`nav-item ${isActive('/offline')}`}>
          <span className="nav-icon">📥</span>
          <span>Offline</span>
        </Link>
        <Link to="/history" className={`nav-item ${isActive('/history')}`}>
          <span className="nav-icon">🕒</span>
          <span>History</span>
        </Link>
        <Link to="/trending" className={`nav-item ${isActive('/trending')}`}>
          <span className="nav-icon">🔥</span>
          <span>Trending</span>
        </Link>
        <Link to="/analytics" className={`nav-item ${isActive('/analytics')}`}>
          <span className="nav-icon">📊</span>
          <span>Analytics</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={onThemeToggle} className="theme-toggle-btn">
          {currentTheme === 'dark' ? '☀️' : '🌙'}
        </button>
        {onLogout && (
          <button onClick={onLogout} className="logout-btn">
            🚪 Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
