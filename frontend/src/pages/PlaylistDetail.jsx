import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function PlaylistDetail({ onPlaySong }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPlaylistSongs();
  }, [id]);

  const fetchPlaylistSongs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/playlists/${id}/songs`);
      setPlaylist(response.data.playlist);
      setSongs(response.data.songs);
    } catch (err) {
      console.error('Failed to fetch playlist songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const playSong = (song) => {
    const formattedSong = {
      youtube_video_id: song.youtube_video_id,
      title: song.title,
      thumbnail: song.thumbnail,
      channel: song.channel
    };
    onPlaySong(formattedSong);
  };

  const downloadSong = (song, e) => {
    e.stopPropagation();
    const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtube_video_id}`;
    window.open(youtubeUrl, '_blank');
  };

  // Sort songs based on selected option
  const getSortedSongs = () => {
    const sortedSongs = [...songs];
    
    switch (sortBy) {
      case 'newest':
        // Assuming songs come from API in newest first order
        return sortedSongs;
      case 'oldest':
        return sortedSongs.reverse();
      case 'most-played':
        // Sort by play count if available, otherwise keep order
        return sortedSongs.sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
      default:
        return sortedSongs;
    }
  };

  // Get recently added songs (last 5)
  const getRecentlyAdded = () => {
    return songs.slice(0, 5);
  };

  const sortedSongs = getSortedSongs();
  const recentlyAdded = getRecentlyAdded();

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <button onClick={() => navigate('/playlists')} className="back-btn">
        ← Back to Playlists
      </button>
      
      <div className="playlist-header-detail">
        <div className="playlist-icon-large">📚</div>
        <div className="playlist-info-detail">
          <h1>{playlist?.name}</h1>
          <p className="subtitle">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</p>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">🎵</div>
          <p>No songs in this playlist yet. Add some from the music player!</p>
        </div>
      ) : (
        <>
          {/* Recently Added Section */}
          {recentlyAdded.length > 0 && (
            <div className="recently-added-section">
              <h2>Recently Added</h2>
              <div className="song-grid">
                {recentlyAdded.map((song) => (
                  <div key={`recent-${song.youtube_video_id}`} className="song-card">
                    <div className="song-thumbnail" onClick={() => playSong(song)}>
                      <img src={song.thumbnail} alt={song.title} />
                      <div className="play-overlay">
                        <div className="play-button">▶</div>
                      </div>
                    </div>
                    <div className="song-info">
                      <h3>{song.title}</h3>
                      <p>{song.channel}</p>
                    </div>
                    <div className="song-actions">
                      <button 
                        className="download-btn" 
                        onClick={(e) => downloadSong(song, e)}
                        title="Open in YouTube"
                      >
                        📥
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sort Controls */}
          <div className="playlist-controls">
            <h2>All Songs</h2>
            <select 
              className="sort-dropdown" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">📅 Newest First</option>
              <option value="oldest">⏰ Oldest First</option>
              <option value="most-played">🔥 Most Played</option>
            </select>
          </div>

          {/* All Songs Grid */}
          <div className="song-grid">
            {sortedSongs.map((song) => (
              <div key={song.youtube_video_id} className="song-card">
                <div className="song-thumbnail" onClick={() => playSong(song)}>
                  <img src={song.thumbnail} alt={song.title} />
                  <div className="play-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>
                <div className="song-info">
                  <h3>{song.title}</h3>
                  <p>{song.channel}</p>
                </div>
                <div className="song-actions">
                  <button 
                    className="download-btn" 
                    onClick={(e) => downloadSong(song, e)}
                    title="Open in YouTube"
                  >
                    📥
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PlaylistDetail;
