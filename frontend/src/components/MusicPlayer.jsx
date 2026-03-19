import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useTheme } from '../contexts/ThemeContext';

function MusicPlayer({ currentSong, onClose, onPlaySong }) {
  const [liked, setLiked] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [playMode, setPlayMode] = useState('video'); // 'video' or 'audio'
  const [recommendations, setRecommendations] = useState([]);
  const [iframeKey, setIframeKey] = useState(0);
  
  // Theme context
  const { updateThemeFromSong } = useTheme();

  useEffect(() => {
    if (currentSong) {
      addToHistory();
      checkLikeStatus();
      updateThemeFromSong(currentSong);
      fetchRecommendations();
    }
  }, [currentSong]);

  useEffect(() => {
    if (showPlaylistModal) {
      fetchPlaylists();
    }
  }, [showPlaylistModal]);

  const addToHistory = async () => {
    try {
      await api.post('/history', currentSong);
    } catch (err) {
      console.error('Failed to add to history:', err);
    }
  };

  const checkLikeStatus = async () => {
    try {
      const response = await api.get('/stats/liked');
      const likedSongs = response.data.liked_songs || [];
      setLiked(likedSongs.some(song => song.youtube_video_id === currentSong.youtube_video_id));
    } catch (err) {
      console.error('Failed to check like status:', err);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await api.get('/playlists');
      setPlaylists(response.data);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/stats/recommendations');
      setRecommendations(response.data.recommendations?.slice(0, 6) || []);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    setLoading(true);
    try {
      await api.post('/playlists', { name: newPlaylistName });
      setNewPlaylistName('');
      await fetchPlaylists();
    } catch (err) {
      console.error('Failed to create playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToPlaylist = async (playlistId) => {
    setLoading(true);
    try {
      await api.post(`/playlists/${playlistId}/add-song`, currentSong);
      setShowPlaylistModal(false);
      if (window.showToast) {
        window.showToast('✅ Added to playlist!', 'success');
      }
    } catch (err) {
      console.error('Failed to add to playlist:', err);
      if (window.showToast) {
        window.showToast('Failed to add to playlist', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/stats/like/${currentSong.youtube_video_id}`);
        setLiked(false);
      } else {
        await api.post(`/stats/like/${currentSong.youtube_video_id}`);
        setLiked(true);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const playOnYouTube = () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${currentSong.youtube_video_id}`;
    window.open(youtubeUrl, '_blank');
  };

  const downloadSong = () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${currentSong.youtube_video_id}`;
    window.open(youtubeUrl, '_blank');
  };

  // Custom control functions
  const handleRestart = () => {
    // Force iframe reload to restart video
    setIframeKey(prev => prev + 1);
    if (window.showToast) {
      window.showToast('⏮️ Restarting video...', 'info');
    }
  };

  const handleRewind = () => {
    if (window.showToast) {
      window.showToast('⏪ Press ← (Left Arrow) to rewind 5 seconds', 'info');
    }
  };

  const handleForward = () => {
    if (window.showToast) {
      window.showToast('⏩ Press → (Right Arrow) to forward 5 seconds', 'info');
    }
  };

  if (!currentSong) return null;

  return (
    <div className="music-player-overlay">
      <div className="music-player-container">
        <button className="close-player" onClick={onClose}>✕</button>
        
        {/* Song Info */}
        <div className="player-song-info">
          <div className="player-thumbnail">
            <img 
              src={currentSong.thumbnail} 
              alt={currentSong.title}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.parentElement.style.display = 'flex';
                e.target.parentElement.style.alignItems = 'center';
                e.target.parentElement.style.justifyContent = 'center';
                const icon = document.createElement('div');
                icon.style.cssText = 'font-size:64px;';
                icon.textContent = '🎵';
                e.target.parentElement.appendChild(icon);
              }}
            />
          </div>
          <div className="player-details">
            <h2 className="player-title">{currentSong.title}</h2>
            <p className="player-channel">{currentSong.channel}</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="player-mode-toggle">
          <button 
            className={`mode-btn ${playMode === 'video' ? 'active' : ''}`}
            onClick={() => setPlayMode('video')}
          >
            🎬 Video
          </button>
          <button 
            className={`mode-btn ${playMode === 'audio' ? 'active' : ''}`}
            onClick={() => setPlayMode('audio')}
          >
            🎵 Audio Only
          </button>
        </div>

        {/* YouTube Video Player */}
        <div className="player-video-section">
          {playMode === 'video' ? (
            <iframe
              key={iframeKey}
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${currentSong.youtube_video_id}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
              title={currentSong.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            ></iframe>
          ) : (
            <div className="audio-player-container">
              <div className="audio-visualizer">
                <div className="audio-icon">🎵</div>
                <div className="audio-bars">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
                <p className="audio-mode-text">Audio Only Mode</p>
              </div>
              <iframe
                key={iframeKey}
                width="100%"
                height="80"
                src={`https://www.youtube.com/embed/${currentSong.youtube_video_id}?autoplay=1&controls=1&enablejsapi=1`}
                title={currentSong.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{
                  borderRadius: '8px',
                  marginTop: '20px'
                }}
              ></iframe>
            </div>
          )}
        </div>
        
        {/* Custom Control Buttons */}
        <div className="player-custom-controls">
          <button 
            className="custom-control-btn"
            onClick={handleRestart}
            title="Restart video"
          >
            ⏮️ Restart
          </button>
          <button 
            className="custom-control-btn"
            onClick={handleRewind}
            title="Rewind 5 seconds (or press ← key)"
          >
            ⏪ Rewind
          </button>
          <button 
            className="custom-control-btn"
            onClick={handleForward}
            title="Forward 5 seconds (or press → key)"
          >
            ⏩ Forward
          </button>
        </div>
        
        {/* Player Controls Info */}
        <div className="player-controls-info">
          <div className="controls-guide">
            <h4 className="controls-title">⌨️ Keyboard Shortcuts</h4>
            <div className="controls-grid">
              <div className="control-item">
                <span className="control-key">Space</span>
                <span className="control-desc">Play / Pause</span>
              </div>
              <div className="control-item">
                <span className="control-key">←</span>
                <span className="control-desc">Rewind 5s</span>
              </div>
              <div className="control-item">
                <span className="control-key">→</span>
                <span className="control-desc">Forward 5s</span>
              </div>
              <div className="control-item">
                <span className="control-key">F</span>
                <span className="control-desc">Fullscreen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="player-recommendations">
            <h4 className="recommendations-title">🎵 Up Next</h4>
            <div className="recommendations-grid">
              {recommendations.map((song) => (
                <div 
                  key={song.youtube_video_id} 
                  className="recommendation-card"
                  onClick={() => {
                    if (onPlaySong) {
                      onPlaySong(song);
                    }
                  }}
                >
                  <div className="recommendation-thumbnail">
                    <img 
                      src={song.thumbnail} 
                      alt={song.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        parent.style.display = 'flex';
                        parent.style.alignItems = 'center';
                        parent.style.justifyContent = 'center';
                        const icon = document.createElement('div');
                        icon.style.cssText = 'font-size:32px;';
                        icon.textContent = '🎵';
                        parent.appendChild(icon);
                      }}
                    />
                    <div className="recommendation-play-overlay">
                      <div className="recommendation-play-btn">▶</div>
                    </div>
                  </div>
                  <div className="recommendation-info">
                    <h5 className="recommendation-title">{song.title}</h5>
                    <p className="recommendation-artist">{song.channel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="player-actions">
          <button 
            className={`player-action-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            title={liked ? "Unlike" : "Like"}
          >
            {liked ? '❤️ Liked' : '🤍 Like'}
          </button>
          
          <button 
            className="player-action-btn"
            onClick={() => setShowPlaylistModal(true)}
            title="Add to Playlist"
          >
            ➕ Add to Playlist
          </button>
          
          <button 
            className="player-action-btn"
            onClick={downloadSong}
            title="Open in YouTube"
          >
            🔗 Open in YouTube
          </button>
        </div>

        {/* Playlist Modal */}
        {showPlaylistModal && (
          <div className="modal-overlay" onClick={() => setShowPlaylistModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add to Playlist</h3>
                <button className="modal-close" onClick={() => setShowPlaylistModal(false)}>✕</button>
              </div>
              
              <div className="modal-body">
                <div className="create-playlist-section">
                  <input
                    type="text"
                    placeholder="Create new playlist..."
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
                    className="playlist-input"
                  />
                  <button 
                    onClick={createPlaylist} 
                    disabled={loading || !newPlaylistName.trim()}
                    className="create-playlist-btn"
                  >
                    Create
                  </button>
                </div>

                <div className="playlists-list">
                  {playlists.length === 0 ? (
                    <p className="no-playlists">No playlists yet. Create one above!</p>
                  ) : (
                    playlists.map((playlist) => (
                      <div 
                        key={playlist.id} 
                        className="playlist-item"
                        onClick={() => addToPlaylist(playlist.id)}
                      >
                        <span>📚 {playlist.name}</span>
                        <span className="playlist-arrow">→</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;
