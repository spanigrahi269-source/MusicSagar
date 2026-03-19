import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { searchCache } from '../utils/searchCache';
import VoiceSearch from '../components/VoiceSearch';
import SocialShare from '../components/SocialShare';

const RECENT_SEARCHES_KEY = 'music_sagar_recent_searches';
const MAX_RECENT_SEARCHES = 5;

function Search({ onPlaySong }) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [offlineSongs, setOfflineSongs] = useState(new Set());
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [songToShare, setSongToShare] = useState(null);

  useEffect(() => {
    // Load recent searches from localStorage
    loadRecentSearches();
    
    // Load offline songs status
    loadOfflineStatus();
    
    // Check if there's a query parameter in URL
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(null, urlQuery);
    }
  }, []);

  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  };

  const saveToRecentSearches = (searchQuery) => {
    try {
      let recent = [...recentSearches];
      
      // Remove if already exists
      recent = recent.filter(q => q.toLowerCase() !== searchQuery.toLowerCase());
      
      // Add to beginning
      recent.unshift(searchQuery);
      
      // Keep only last 5
      recent = recent.slice(0, MAX_RECENT_SEARCHES);
      
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
      setRecentSearches(recent);
    } catch (err) {
      console.error('Failed to save recent search:', err);
    }
  };

  const handleSearch = async (e, searchQuery = null) => {
    if (e) e.preventDefault();
    
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;
    
    // Check cache first
    const cached = searchCache.get(queryToSearch, language);
    if (cached) {
      setResults(cached.results);
      setNextPageToken(cached.nextPageToken || null);
      setHasMore(!!cached.nextPageToken);
      setLoading(false);
      
      // Save to recent searches
      saveToRecentSearches(queryToSearch);
      
      // Update query input if clicked from recent
      if (searchQuery) {
        setQuery(searchQuery);
      }
      
      if (window.showToast) {
        window.showToast('✨ Loaded from 12-hour cache - API saved!', 'success');
      }
      return;
    }
    
    // Clear old results immediately
    setResults([]);
    setLoading(true);
    setNextPageToken(null);
    setHasMore(false);
    
    try {
      const response = await api.get(`/youtube/search?query=${encodeURIComponent(queryToSearch)}&language=${language}`);
      setResults(response.data.results);
      setNextPageToken(response.data.nextPageToken || null);
      setHasMore(!!response.data.nextPageToken);
      
      // Cache the results
      searchCache.set(queryToSearch, language, {
        results: response.data.results,
        nextPageToken: response.data.nextPageToken
      });
      
      // Save to recent searches
      saveToRecentSearches(queryToSearch);
      
      // Update query input if clicked from recent
      if (searchQuery) {
        setQuery(searchQuery);
      }
    } catch (err) {
      console.error('Search failed:', err);
      
      // Check if it's a quota error
      if (err.response?.status === 403 || err.response?.data?.detail?.includes('quota')) {
        if (window.showToast) {
          window.showToast('⚠️ YouTube API quota exceeded. Search will be available after midnight Pacific Time.', 'error');
        }
        // Show helpful error message
        setResults([{
          isError: true,
          message: 'YouTube API Quota Exceeded',
          description: 'All API keys have reached their daily limit. Search will be available again after midnight Pacific Time (PST/PDT).',
          suggestions: [
            'Browse recommended songs on the home page',
            'Use the mood slider to discover music',
            'Check your listening history',
            'Play songs from your playlists'
          ]
        }]);
      } else {
        if (window.showToast) {
          window.showToast('Search failed. Please try again.', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResults = async () => {
    if (!nextPageToken || loadingMore) return;
    
    setLoadingMore(true);
    
    try {
      const response = await api.get(`/youtube/search?query=${encodeURIComponent(query)}&language=${language}&pageToken=${nextPageToken}`);
      setResults(prev => [...prev, ...response.data.results]);
      setNextPageToken(response.data.nextPageToken || null);
      setHasMore(!!response.data.nextPageToken);
    } catch (err) {
      console.error('Load more failed:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRecentSearchClick = (searchQuery) => {
    handleSearch(null, searchQuery);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  const playSong = (song) => {
    const formattedSong = {
      youtube_video_id: song.videoId,
      title: song.title,
      thumbnail: song.thumbnail,
      channel: song.channelTitle,
      duration: song.duration || "0:00"
    };
    onPlaySong(formattedSong);
  };

  const downloadSong = (song, e) => {
    e.stopPropagation();
    const youtubeUrl = `https://www.youtube.com/watch?v=${song.videoId}`;
    window.open(youtubeUrl, '_blank');
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
    
    const isOffline = offlineSongs.has(song.videoId);
    
    try {
      if (isOffline) {
        // Remove from offline
        await api.delete(`/offline/${song.videoId}`);
        setOfflineSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(song.videoId);
          return newSet;
        });
        if (window.showToast) {
          window.showToast('Removed from offline', 'info');
        }
      } else {
        // Save for offline
        await api.post(`/offline/save/${song.videoId}`, {
          youtube_video_id: song.videoId,
          title: song.title,
          thumbnail: song.thumbnail,
          channel: song.channelTitle
        });
        setOfflineSongs(prev => new Set([...prev, song.videoId]));
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
        youtube_video_id: selectedSong.videoId,
        title: selectedSong.title,
        thumbnail: selectedSong.thumbnail,
        channel: selectedSong.channelTitle
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

  return (
    <div className="page-content">
      <h1>Search Music</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for songs, artists, albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="all">All Languages</option>
          <option value="hindi">Hindi</option>
          <option value="english">English</option>
          <option value="punjabi">Punjabi</option>
          <option value="marathi">Marathi</option>
          <option value="tamil">Tamil</option>
          <option value="telugu">Telugu</option>
        </select>
        <button 
          type="button" 
          className="voice-search-button" 
          onClick={() => setShowVoiceSearch(true)}
          title="Voice Search"
        >
          🎤
        </button>
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !loading && results.length === 0 && (
        <div className="recent-searches">
          <div className="recent-searches-header">
            <h3>Recent Searches</h3>
            <button onClick={clearRecentSearches} className="clear-recent-btn">Clear</button>
          </div>
          <div className="recent-searches-list">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearchClick(search)}
                className="recent-search-item"
              >
                <span className="recent-search-icon">🔍</span>
                <span className="recent-search-text">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Searching for music...</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <>
          {/* Check if first result is an error message */}
          {results[0].isError ? (
            <div className="quota-error-container">
              <div className="quota-error-card">
                <div className="error-icon">⚠️</div>
                <h2 className="error-title">{results[0].message}</h2>
                <p className="error-description">{results[0].description}</p>
                <div className="error-suggestions">
                  <h3>What you can do instead:</h3>
                  <ul>
                    {results[0].suggestions.map((suggestion, index) => (
                      <li key={index}>✓ {suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div className="error-actions">
                  <button 
                    className="error-action-btn primary"
                    onClick={() => window.location.href = '/'}
                  >
                    🏠 Go to Home
                  </button>
                  <button 
                    className="error-action-btn"
                    onClick={() => window.location.href = '/mood'}
                  >
                    🎭 Mood Slider
                  </button>
                </div>
                <p className="error-note">
                  💡 Quota resets at midnight Pacific Time. Check back tomorrow!
                </p>
              </div>
            </div>
          ) : (
            <div className="song-grid">
              {results.map((song) => (
              <div key={song.videoId} className="song-card modern">
                <div className="song-thumbnail" onClick={() => playSong(song)}>
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
                  <p className="song-artist">{song.channelTitle}</p>
                  {song.duration && <span className="song-duration">{song.duration}</span>}
                </div>
                <div className="song-actions-row">
                  <button 
                    className={`offline-btn ${offlineSongs.has(song.videoId) ? 'saved' : ''}`}
                    onClick={(e) => toggleOffline(song, e)}
                    title={offlineSongs.has(song.videoId) ? "Remove from offline" : "Save for offline"}
                  >
                    {offlineSongs.has(song.videoId) ? '✅' : '💾'}
                  </button>
                  <button 
                    className="playlist-add-btn" 
                    onClick={(e) => openPlaylistModal(song, e)}
                    title="Add to Playlist"
                  >
                    ➕
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
                    className="download-btn" 
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

          {/* Load More Button */}
          {!results[0].isError && hasMore && (
            <div className="load-more-container">
              <button 
                onClick={loadMoreResults} 
                className="load-more-btn"
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <div className="spinner-small"></div>
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <span>🔄 Load More Songs</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
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
                  <p>{selectedSong.channelTitle}</p>
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

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <VoiceSearch 
          onSearch={(voiceQuery) => {
            setQuery(voiceQuery);
            handleSearch(null, voiceQuery);
          }}
          onClose={() => setShowVoiceSearch(false)}
        />
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

export default Search;



