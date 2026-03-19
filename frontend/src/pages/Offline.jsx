import { useState, useEffect } from 'react';
import api from '../api/axios';

function Offline({ onPlaySong }) {
  const [offlineSongs, setOfflineSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistLoading, setPlaylistLoading] = useState(false);

  useEffect(() => {
    fetchOfflineSongs();
  }, []);

  const fetchOfflineSongs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/offline');
      setOfflineSongs(response.data.offline_songs || []);
    } catch (err) {
      console.error('Failed to fetch offline songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeSong = async (song, e) => {
    e.stopPropagation();
    
    if (!confirm('Remove this song from offline?')) return;
    
    try {
      await api.delete(`/offline/${song.youtube_video_id}`);
      setOfflineSongs(prev => prev.filter(item => item.song.youtube_video_id !== song.youtube_video_id));
      // Show toast notification
      if (window.showToast) {
        window.showToast('Removed from offline', 'info');
      }
    } catch (err) {
      console.error('Failed to remove song:', err);
      alert('Failed to remove song');
    }
  };

  const playSong = (songData) => {
    const formattedSong = {
      youtube_video_id: songData.youtube_video_id,
      title: songData.title,
      thumbnail: songData.thumbnail,
      channel: songData.channel
    };
    onPlaySong(formattedSong);
  };

  const downloadSong = (song, e) => {
    e.stopPropagation();
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
      const songData = {
        youtube_video_id: selectedSong.youtube_video_id,
        title: selectedSong.title,
        thumbnail: selectedSong.thumbnail,
        channel: selectedSong.channel
      };
      
      await api.post(`/playlists/${playlistId}/add-song`, songData);
      
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
        <h1>Offline Songs</h1>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading offline songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Offline Songs</h1>
          <p className="subtitle">Songs saved for offline access ({offlineSongs.length})</p>
        </div>
      </div>

      {offlineSongs.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">📥</div>
          <h3>No Offline Songs</h3>
          <p>Save songs for offline access by clicking the download icon</p>
        </div>
      ) : (
        <div className="song-grid">
          {offlineSongs.map((item) => (
            <div key={item.id} className="song-card">
              <div className="song-thumbnail" onClick={() => playSong(item.song)}>
                <img src={item.song.thumbnail} alt={item.song.title} />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
                <div className="offline-badge">📥</div>
              </div>
              <div className="song-info">
                <h3>{item.song.title}</h3>
                <p>{item.song.channel}</p>
                <span className="saved-date">
                  Saved {new Date(item.saved_at).toLocaleDateString()}
                </span>
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
                  onClick={(e) => downloadSong(item.song, e)}
                  title="Open in YouTube"
                >
                  🔗
                </button>
                <button 
                  className="remove-btn" 
                  onClick={(e) => removeSong(item.song, e)}
                  title="Remove from offline"
                >
                  🗑️
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

export default Offline;
