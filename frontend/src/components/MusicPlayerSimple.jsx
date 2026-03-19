import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useTheme } from '../contexts/ThemeContext';

function MusicPlayer({ currentSong, onClose }) {
  const [liked, setLiked] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Theme context
  const { updateThemeFromSong } = useTheme();

  useEffect(() => {
    if (currentSong) {
      addToHistory();
      checkLikeStatus();
      updateThemeFromSong(currentSong);
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

        {/* Play on YouTube Button */}
        <div className="player-youtube-section">
          <button className="play-youtube-btn" onClick={playOnYouTube}>
            <span className="youtube-icon">▶</span>
            <span>Play on YouTube</span>
          </button>
          <p className="youtube-hint">Opens in YouTube app or browser</p>
        </div>

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
            title="Download/Open in YouTube"
          >
            📥 Download
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
