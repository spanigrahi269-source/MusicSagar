import { useState, useEffect } from 'react';
import api from '../api/axios';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [listeningTime, setListeningTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, historyRes, likedRes] = await Promise.all([
        api.get('/stats/analytics'),
        api.get('/history'),
        api.get('/stats/liked')
      ]);
      
      setStats(analyticsRes.data);
      
      // Calculate top songs from history
      const songCounts = {};
      historyRes.data.forEach(item => {
        const videoId = item.song.youtube_video_id;
        if (!songCounts[videoId]) {
          songCounts[videoId] = {
            song: item.song,
            count: 0
          };
        }
        songCounts[videoId].count++;
      });
      
      const sortedSongs = Object.values(songCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopSongs(sortedSongs);
      
      // Calculate top artists
      const artistCounts = {};
      historyRes.data.forEach(item => {
        const artist = item.song.channel;
        if (artist) {
          artistCounts[artist] = (artistCounts[artist] || 0) + 1;
        }
      });
      
      const sortedArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
      setTopArtists(sortedArtists);
      
      // Estimate listening time (assuming average 3.5 minutes per song)
      const totalMinutes = historyRes.data.length * 3.5;
      setListeningTime(totalMinutes);
      
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1>📊 Your Analytics</h1>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>📊 Your Analytics</h1>
      <p className="subtitle">Your music listening statistics and insights</p>

      {/* Main Stats Grid */}
      <div className="analytics-grid">
        <div className="analytics-card gradient-purple">
          <div className="analytics-icon">🎵</div>
          <div className="analytics-value">{stats?.total_songs_played || 0}</div>
          <div className="analytics-label">Songs Played</div>
        </div>

        <div className="analytics-card gradient-blue">
          <div className="analytics-icon">📚</div>
          <div className="analytics-value">{stats?.total_playlists || 0}</div>
          <div className="analytics-label">Playlists Created</div>
        </div>

        <div className="analytics-card gradient-pink">
          <div className="analytics-icon">❤️</div>
          <div className="analytics-value">{stats?.total_likes || 0}</div>
          <div className="analytics-label">Songs Liked</div>
        </div>

        <div className="analytics-card gradient-orange">
          <div className="analytics-icon">⏱️</div>
          <div className="analytics-value">{formatTime(listeningTime)}</div>
          <div className="analytics-label">Listening Time</div>
        </div>
      </div>

      {/* Top Songs Section */}
      {topSongs.length > 0 && (
        <div className="analytics-section">
          <h2>🎤 Your Top Songs</h2>
          <div className="top-items-list">
            {topSongs.map((item, index) => (
              <div key={item.song.youtube_video_id} className="top-item">
                <div className="top-item-rank">#{index + 1}</div>
                <img 
                  src={item.song.thumbnail} 
                  alt={item.song.title}
                  className="top-item-thumbnail"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="top-item-info">
                  <div className="top-item-title">{item.song.title}</div>
                  <div className="top-item-artist">{item.song.channel}</div>
                </div>
                <div className="top-item-count">
                  {item.count} {item.count === 1 ? 'play' : 'plays'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Artists Section */}
      {topArtists.length > 0 && (
        <div className="analytics-section">
          <h2>🎨 Your Top Artists</h2>
          <div className="top-artists-grid">
            {topArtists.map((artist, index) => (
              <div key={artist.name} className="top-artist-card">
                <div className="artist-rank">#{index + 1}</div>
                <div className="artist-avatar-large">
                  {artist.name.charAt(0).toUpperCase()}
                </div>
                <div className="artist-name-large">{artist.name}</div>
                <div className="artist-play-count">
                  {artist.count} {artist.count === 1 ? 'play' : 'plays'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Section */}
      <div className="analytics-section">
        <h2>💡 Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-text">
              You've listened to an average of{' '}
              <strong>{Math.round((stats?.total_songs_played || 0) / Math.max(1, stats?.total_playlists || 1))}</strong>{' '}
              songs per playlist
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-text">
              Your music library is growing! Keep discovering new songs.
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🌟</div>
            <div className="insight-text">
              You've liked <strong>{((stats?.total_likes || 0) / Math.max(1, stats?.total_songs_played || 1) * 100).toFixed(0)}%</strong>{' '}
              of the songs you've played
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
