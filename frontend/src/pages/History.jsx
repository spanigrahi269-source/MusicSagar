import { useState, useEffect } from 'react';
import api from '../api/axios';

function History({ onPlaySong }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistLoading, setPlaylistLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/history');
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your entire listening history?')) {
      return;
    }

    try {
      await api.delete('/history');
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
      alert('Failed to clear history. Please try again.');
    }
  };

  const downloadSong = (song) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtube_video_id}`;
    window.open(youtubeUrl, '_blank');
  };

  const openPlaylistModal = (song, e) => {
    e.stopPropagation();
    setSelectedSong(song);
    setShowPlaylistModal(true);
    fetchPlaylists();
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
    
    setPlaylistLoading(true);
    try {
      await api.post('/playlists', { name: newPlaylistName });
      setNewPlaylistName('');
      await fetchPlaylists();
      if (window.showToast) {
        window.showToast('✅ Playlist created!', 'success');
      }
    } catch (err) {
      console.error('Failed to create playlist:', err);
      if (window.showToast) {
        window.showToast('Failed to create playlist', 'error');
      }
    } finally {
      setPlaylistLoading(false);
    }
  };

  const addToPlaylist = async (playlistId) => {
    if (!selectedSong) return;
    
    setPlaylistLoading(true);
    try {
      await api.post(`/playlists/${playlistId}/add-song`, selectedSong);
      
      if (window.showToast) {
        window.showToast('✅ Added to playlist!', 'success');
      }
      setShowPlaylistModal(false);
      setSelectedSong(null);
    } catch (err) {
      console.error('Failed to add to playlist:', err);
      if (window.showToast) {
        const message = err.response?.data?.detail || 'Failed to add to playlist';
        window.showToast(message, 'error');
      }
    } finally {
      setPlaylistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Listening History</h1>
          <p className="subtitle">Your complete music journey</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="clear-history-btn">
            🗑️ Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">🕒</div>
          <p>No listening history yet. Start exploring music!</p>
        </div>
      ) : (
        <div className="song-grid">
          {history.map((item) => (
            <div key={item.id} className="song-card">
              <div className="song-thumbnail" onClick={() => onPlaySong(item.song)}>
                <img src={item.song.thumbnail} alt={item.song.title} />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>
              <div className="song-info">
                <h3>{item.song.title}</h3>
                <p>{item.song.channel}</p>
              </div>
              <div className="song-actions">
                <button 
                  className="playlist-add-btn" 
                  onClick={(e) => openPlaylistModal(item.song, e)}
                  title="Add to Playlist"
                >
                  ➕
                </button>
                <button 
                  className="download-btn" 
                  onClick={() => downloadSong(item.song)}
                  title="Open in YouTube"
                >
                  📥
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && selectedSong && (
        <div className="modal-overlay" onClick={() => setShowPlaylistModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to Playlist</h3>
              <button className="modal-close" onClick={() => setShowPlaylistModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="selected-song-preview">
                <img src={selectedSong.thumbnail} alt={selectedSong.title} />
                <div className="selected-song-info">
                  <h4>{selectedSong.title}</h4>
                  <p>{selectedSong.channel}</p>
                </div>
              </div>

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
                  disabled={playlistLoading || !newPlaylistName.trim()}
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
  );
}

export default History;
