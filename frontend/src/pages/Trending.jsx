import { useState, useEffect } from 'react';
import api from '../api/axios';

function Trending({ onPlaySong }) {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await api.get('/stats/trending');
      setTrending(response.data.trending);
    } catch (err) {
      console.error('Failed to fetch trending:', err);
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

  return (
    <div className="page-content">
      <h1>🔥 Trending</h1>
      <p className="subtitle">Most played songs on Music Sagar</p>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading trending songs...</p>
        </div>
      )}

      {!loading && trending.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-icon">🔥</div>
          <p>No trending songs yet. Start listening!</p>
        </div>
      )}

      <div className="song-grid">
        {trending.map((song, index) => (
          <div key={song.youtube_video_id} className="song-card">
            <div className="trending-badge">#{index + 1}</div>
            <div className="song-thumbnail" onClick={() => playSong(song)}>
              <img src={song.thumbnail} alt={song.title} />
              <div className="play-overlay">
                <div className="play-button">▶</div>
              </div>
            </div>
            <div className="song-info">
              <h3>{song.title}</h3>
              <p>{song.channel}</p>
              <p className="play-count">🎵 {song.play_count} plays</p>
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
  );
}

export default Trending;
