import { useState, useEffect } from 'react';
import api from '../api/axios';
import SocialShare from '../components/SocialShare';
import './EmptyState.css';

function Home({ onPlaySong, onLogout }) {
  const [history, setHistory] = useState([]);
  const [allRecommendations, setAllRecommendations] = useState([]); // All fetched songs
  const [displayCount, setDisplayCount] = useState(16); // How many to display (changed from 12 to 16)
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [recommendationSource, setRecommendationSource] = useState('');
  const [username, setUsername] = useState('');
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [offlineSongs, setOfflineSongs] = useState(new Set());
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [songToShare, setSongToShare] = useState(null);

  useEffect(() => {
    fetchData();
    loadOfflineStatus();
    // Get username from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUsername(userData.username);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyRes, recsRes, likedRes, artistsRes, trendingRes] = await Promise.all([
        api.get('/history'),
        api.get('/stats/recommendations'),
        api.get('/stats/liked'),
        api.get('/stats/related-artists'),
        api.get('/stats/trending')
      ]);
      setHistory(historyRes.data.slice(0, 8)); // Show only 8 recent
      setAllRecommendations(recsRes.data.recommendations || []);
      setDisplayCount(16); // Reset to show first 16
      setRecommendationSource(recsRes.data.message || '');
      setRelatedArtists(artistsRes.data.artists || []);
      setTrendingSongs(trendingRes.data.trending || []);
      
      // Create set of liked song IDs
      const likedSet = new Set(
        likedRes.data.liked_songs.map(song => song.youtube_video_id)
      );
      setLikedSongs(likedSet);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineStatus = async () => {
    try {
      const response = await api.get('/offline');
      const savedIds = new Set(response.data.offline_songs.map(item => item.song.youtube_video_id));
      setOfflineSongs(savedIds);
    } catch (err) {
      console.error('Failed to load offline status:', err);
    }
  };

  const toggleOffline = async (song, e) => {
    e.stopPropagation();
    
    const isOffline = offlineSongs.has(song.youtube_video_id);
    
    try {
      if (isOffline) {
        await api.delete(`/offline/${song.youtube_video_id}`);
        setOfflineSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(song.youtube_video_id);
          return newSet;
        });
        if (window.showToast) {
          window.showToast('Removed from offline', 'info');
        }
      } else {
        await api.post(`/offline/save/${song.youtube_video_id}`, {
          youtube_video_id: song.youtube_video_id,
          title: song.title,
          thumbnail: song.thumbnail,
          channel: song.channel
        });
        setOfflineSongs(prev => new Set([...prev, song.youtube_video_id]));
        if (window.showToast) {
          window.showToast('✅ Saved for offline!', 'success');
        }
      }
    } catch (err) {
      console.error('Failed to toggle offline:', err);
      if (window.showToast) {
        window.showToast('Failed to save', 'error');
      }
    }
  };

  const handleLike = async (videoId, e) => {
    e.stopPropagation();
    
    try {
      const isLiked = likedSongs.has(videoId);
      
      if (isLiked) {
        await api.delete(`/stats/like/${videoId}`);
        setLikedSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        if (window.showToast) {
          window.showToast('Removed from liked songs', 'info');
        }
      } else {
        await api.post(`/stats/like/${videoId}`);
        setLikedSongs(prev => new Set(prev).add(videoId));
        if (window.showToast) {
          window.showToast('❤️ Added to liked songs!', 'success');
        }
      }
    } catch (err) {
      console.error('Failed to like/unlike song:', err);
      if (window.showToast) {
        window.showToast('Failed to update like status', 'error');
      }
    }
  };

  const downloadSong = (song, e) => {
    e.stopPropagation();
    const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtube_video_id}`;
    window.open(youtubeUrl, '_blank');
  };

  const showMoreSongs = () => {
    // Simply increase the display count by 16
    setDisplayCount(prev => prev + 16);
    if (window.showToast) {
      window.showToast('✨ Showing more songs!', 'success');
    }
  };

  const refreshRecommendations = async () => {
    try {
      setLoadingMore(true);
      const recsRes = await api.get('/stats/recommendations');
      setAllRecommendations(recsRes.data.recommendations || []);
      setDisplayCount(16); // Reset to first 16
      setRecommendationSource(recsRes.data.message || '');
      if (window.showToast) {
        window.showToast('✨ Recommendations refreshed!', 'success');
      }
    } catch (err) {
      console.error('Failed to refresh recommendations:', err);
      if (window.showToast) {
        window.showToast('Failed to refresh recommendations', 'error');
      }
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1>Welcome to Music Sagar</h1>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Welcome{username ? `, ${username}` : ''} 👋</h1>
          <p className="subtitle">Your personal music streaming platform</p>
        </div>
        <div className="header-actions">
          <button className="logout-btn-home" onClick={onLogout} title="Logout">
            🚪 Logout
          </button>
        </div>
      </div>
      
      {/* Recommendations Section */}
      <section className="section">
        <div className="section-header">
          <div className="section-header-content">
            <div>
              <h2>✨ Recommended for You</h2>
              {recommendationSource && (
                <p className="section-subtitle">{recommendationSource}</p>
              )}
            </div>
            {allRecommendations.length > 0 && (
              <button 
                className="refresh-btn" 
                onClick={refreshRecommendations}
                disabled={loadingMore}
                title="Refresh recommendations"
              >
                {loadingMore ? '⏳' : '🔄'} Refresh
              </button>
            )}
          </div>
        </div>
        {allRecommendations.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon">🎵</div>
            <h3>Welcome to Music Sagar!</h3>
            <p>Your personal music discovery and playlist manager</p>
            <div className="empty-state-features">
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <span>Search for any song</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Create playlists</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">❤️</span>
                <span>Like your favorites</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📥</span>
                <span>Download for offline</span>
              </div>
            </div>
            <button className="get-started-btn" onClick={() => window.location.href = '/search'}>
              🔍 Start Searching for Music
            </button>
            <p className="empty-hint">Search for songs, add them to playlists, and build your music library!</p>
          </div>
        ) : (
          <>
            {/* Show songs based on displayCount */}
            {allRecommendations.slice(0, displayCount).length > 0 && (
              <>
                {/* Show first 8 songs */}
                <div className="song-grid">
                  {allRecommendations.slice(0, Math.min(8, displayCount)).map((song) => (
                    <div key={song.youtube_video_id} className="song-card modern">
                      <div className="song-thumbnail" onClick={() => onPlaySong(song)}>
                        <img 
                          src={song.thumbnail} 
                          alt={song.title} 
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            parent.style.display = 'flex';
                            parent.style.alignItems = 'center';
                            parent.style.justifyContent = 'center';
                            const icon = document.createElement('div');
                            icon.style.cssText = 'font-size:48px;';
                            icon.textContent = '🎵';
                            parent.appendChild(icon);
                          }}
                        />
                        <div className="play-overlay">
                          <div className="play-button">▶</div>
                        </div>
                      </div>
                      <div className="song-info">
                        <h3 className="song-title">{song.title}</h3>
                        <p className="song-artist">{song.channel}</p>
                      </div>
                      <div className="song-actions-row">
                        <button 
                          className={`like-btn-card ${likedSongs.has(song.youtube_video_id) ? 'liked' : ''}`}
                          onClick={(e) => handleLike(song.youtube_video_id, e)}
                          title={likedSongs.has(song.youtube_video_id) ? "Unlike" : "Like"}
                        >
                          {likedSongs.has(song.youtube_video_id) ? '❤️' : '🤍'}
                        </button>
                        <button 
                          className={`offline-btn ${offlineSongs.has(song.youtube_video_id) ? 'saved' : ''}`}
                          onClick={(e) => toggleOffline(song, e)}
                          title={offlineSongs.has(song.youtube_video_id) ? "Remove from offline" : "Save for offline"}
                        >
                          {offlineSongs.has(song.youtube_video_id) ? '✅' : '📥'}
                        </button>
                        <button 
                          className="share-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSongToShare(song);
                            setShowShareModal(true);
                          }}
                          title="Share Song"
                        >
                          📤
                        </button>
                        <button 
                          className="action-btn-card" 
                          onClick={(e) => downloadSong(song, e)}
                          title="Open in YouTube"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fans Also Like - After first 8 songs */}
                {relatedArtists.length > 0 && displayCount > 8 && (
                  <div className="artists-section-inline">
                    <div className="section-header-inline">
                      <h3>🎤 Fans also like</h3>
                    </div>
                    <div className="artists-grid">
                      {relatedArtists.slice(0, 4).map((artist, index) => (
                        <div key={index} className="artist-card" onClick={() => {
                          window.location.href = `/search?q=${encodeURIComponent(artist.name)}`;
                        }}>
                          <div className="artist-avatar">
                            {artist.thumbnail ? (
                              <img 
                                src={artist.thumbnail} 
                                alt={artist.name} 
                                loading="lazy"
                                onError={(e) => {
                                  const parent = e.target.parentElement;
                                  parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:bold;color:white;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);">${artist.name.charAt(0).toUpperCase()}</div>`;
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                fontWeight: 'bold',
                                color: 'white',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}>
                                {artist.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <h4 className="artist-name">{artist.name}</h4>
                          <p className="artist-type">Artist</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show remaining songs (9-16+) */}
                {displayCount > 8 && allRecommendations.length > 8 && (
                  <div className="song-grid">
                    {allRecommendations.slice(8, displayCount).map((song) => (
                      <div key={song.youtube_video_id} className="song-card modern">
                        <div className="song-thumbnail" onClick={() => onPlaySong(song)}>
                          <img 
                            src={song.thumbnail} 
                            alt={song.title} 
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                              parent.style.display = 'flex';
                              parent.style.alignItems = 'center';
                              parent.style.justifyContent = 'center';
                              const icon = document.createElement('div');
                              icon.style.cssText = 'font-size:48px;';
                              icon.textContent = '🎵';
                              parent.appendChild(icon);
                            }}
                          />
                          <div className="play-overlay">
                            <div className="play-button">▶</div>
                          </div>
                        </div>
                        <div className="song-info">
                          <h3 className="song-title">{song.title}</h3>
                          <p className="song-artist">{song.channel}</p>
                        </div>
                        <div className="song-actions-row">
                          <button 
                            className={`like-btn-card ${likedSongs.has(song.youtube_video_id) ? 'liked' : ''}`}
                            onClick={(e) => handleLike(song.youtube_video_id, e)}
                            title={likedSongs.has(song.youtube_video_id) ? "Unlike" : "Like"}
                          >
                            {likedSongs.has(song.youtube_video_id) ? '❤️' : '🤍'}
                          </button>
                          <button 
                            className={`offline-btn ${offlineSongs.has(song.youtube_video_id) ? 'saved' : ''}`}
                            onClick={(e) => toggleOffline(song, e)}
                            title={offlineSongs.has(song.youtube_video_id) ? "Remove from offline" : "Save for offline"}
                          >
                            {offlineSongs.has(song.youtube_video_id) ? '✅' : '💾'}
                          </button>
                          <button 
                            className="share-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSongToShare(song);
                              setShowShareModal(true);
                            }}
                            title="Share Song"
                          >
                            📤
                          </button>
                          <button 
                            className="action-btn-card" 
                            onClick={(e) => downloadSong(song, e)}
                            title="Open in YouTube"
                          >
                            🔗
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* More Artists - After 16 songs */}
                {relatedArtists.length > 4 && displayCount > 16 && (
                  <div className="artists-section-inline">
                    <div className="section-header-inline">
                      <h3>🎤 More artists you might like</h3>
                    </div>
                    <div className="artists-grid">
                      {relatedArtists.slice(4, 8).map((artist, index) => (
                        <div key={index} className="artist-card" onClick={() => {
                          window.location.href = `/search?q=${encodeURIComponent(artist.name)}`;
                        }}>
                          <div className="artist-avatar">
                            {artist.thumbnail ? (
                              <img 
                                src={artist.thumbnail} 
                                alt={artist.name} 
                                loading="lazy"
                                onError={(e) => {
                                  const parent = e.target.parentElement;
                                  parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:bold;color:white;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);">${artist.name.charAt(0).toUpperCase()}</div>`;
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                fontWeight: 'bold',
                                color: 'white',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}>
                                {artist.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <h4 className="artist-name">{artist.name}</h4>
                          <p className="artist-type">Artist</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show More button at the end */}
                <div className="refresh-more-container">
                  {displayCount < allRecommendations.length ? (
                    <>
                      <button 
                        className="refresh-more-btn" 
                        onClick={showMoreSongs}
                      >
                        ➕ Show More
                      </button>
                      <p className="more-songs-hint">
                        {allRecommendations.length - displayCount} more songs available
                      </p>
                    </>
                  ) : (
                    <button 
                      className="refresh-more-btn" 
                      onClick={showMoreSongs}
                    >
                      ➕ Show More Songs
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* YouTube Trending Section */}
      {trendingSongs.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>🔥 Trending on YouTube</h2>
            <p className="section-subtitle">Most played songs across all users</p>
          </div>
          <div className="song-grid">
            {trendingSongs.slice(0, 8).map((song) => (
              <div key={song.youtube_video_id} className="song-card modern">
                <div className="song-thumbnail" onClick={() => onPlaySong(song)}>
                  <img 
                    src={song.thumbnail} 
                    alt={song.title} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      parent.style.display = 'flex';
                      parent.style.alignItems = 'center';
                      parent.style.justifyContent = 'center';
                      const icon = document.createElement('div');
                      icon.style.cssText = 'font-size:48px;';
                      icon.textContent = '🎵';
                      parent.appendChild(icon);
                    }}
                  />
                  <div className="play-overlay">
                    <div className="play-button">▶</div>
                  </div>
                  {song.play_count && (
                    <div className="trending-badge">
                      🔥 {song.play_count} plays
                    </div>
                  )}
                </div>
                <div className="song-info">
                  <h3 className="song-title">{song.title}</h3>
                  <p className="song-artist">{song.channel}</p>
                </div>
                <div className="song-actions-row">
                  <button 
                    className={`like-btn-card ${likedSongs.has(song.youtube_video_id) ? 'liked' : ''}`}
                    onClick={(e) => handleLike(song.youtube_video_id, e)}
                    title={likedSongs.has(song.youtube_video_id) ? "Unlike" : "Like"}
                  >
                    {likedSongs.has(song.youtube_video_id) ? '❤️' : '🤍'}
                  </button>
                  <button 
                    className={`offline-btn ${offlineSongs.has(song.youtube_video_id) ? 'saved' : ''}`}
                    onClick={(e) => toggleOffline(song, e)}
                    title={offlineSongs.has(song.youtube_video_id) ? "Remove from offline" : "Save for offline"}
                  >
                    {offlineSongs.has(song.youtube_video_id) ? '✅' : '📥'}
                  </button>
                  <button 
                    className="share-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSongToShare(song);
                      setShowShareModal(true);
                    }}
                    title="Share Song"
                  >
                    📤
                  </button>
                  <button 
                    className="action-btn-card" 
                    onClick={(e) => downloadSong(song, e)}
                    title="Open in YouTube"
                  >
                    🔗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Share Modal */}
      {showShareModal && songToShare && (
        <SocialShare 
          song={songToShare}
          onClose={() => {
            setShowShareModal(false);
            setSongToShare(null);
          }}
        />
      )}
    </div>
  );
}

export default Home;



