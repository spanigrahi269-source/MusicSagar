import { useState, useEffect } from 'react';
import api from '../api/axios';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function MoodSlider({ onPlaySong }) {
  const [moodValue, setMoodValue] = useState(50);
  const [language, setLanguage] = useState('Hindi');
  const [allResults, setAllResults] = useState([]);
  const [displayCount, setDisplayCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [moodInfo, setMoodInfo] = useState({
    label: 'Romantic',
    emoji: '🙂'
  });

  // Debounce mood value changes
  const debouncedMoodValue = useDebounce(moodValue, 800);

  // Fetch mood info (instant, no API call to YouTube)
  useEffect(() => {
    const fetchMoodInfo = async () => {
      try {
        const response = await api.get(`/ai/mood-info?value=${moodValue}`);
        setMoodInfo({
          label: response.data.label,
          emoji: response.data.emoji
        });
      } catch (err) {
        console.error('Failed to fetch mood info:', err);
      }
    };

    fetchMoodInfo();
  }, [moodValue]);

  // Fetch songs based on debounced mood value
  useEffect(() => {
    const fetchMoodSongs = async () => {
      setLoading(true);
      setDisplayCount(12); // Reset display count
      try {
        const response = await api.get(
          `/ai/mood-slider?value=${debouncedMoodValue}&language=${language}&max_results=30`
        );
        setAllResults(response.data.results);
      } catch (err) {
        console.error('Failed to fetch mood songs:', err);
        if (window.showToast) {
          window.showToast('Failed to load mood songs', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMoodSongs();
  }, [debouncedMoodValue, language]);

  const refreshSongs = async () => {
    setRefreshing(true);
    setDisplayCount(12); // Reset display count
    try {
      const response = await api.get(
        `/ai/mood-slider?value=${debouncedMoodValue}&language=${language}&max_results=30`
      );
      setAllResults(response.data.results);
      if (window.showToast) {
        window.showToast('✨ Songs refreshed!', 'success');
      }
    } catch (err) {
      console.error('Failed to refresh songs:', err);
      if (window.showToast) {
        window.showToast('Failed to refresh songs', 'error');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const showMoreSongs = () => {
    setDisplayCount(prev => prev + 12);
    if (window.showToast) {
      window.showToast('✨ Showing more songs!', 'success');
    }
  };

  const handleSliderChange = (e) => {
    setMoodValue(parseInt(e.target.value));
  };

  const playSong = (song) => {
    const formattedSong = {
      youtube_video_id: song.videoId,
      title: song.title,
      thumbnail: song.thumbnail,
      channel: song.channelTitle
    };
    onPlaySong(formattedSong);
  };

  const getMoodGradient = () => {
    if (moodValue <= 20) return 'linear-gradient(135deg, #667eea 0%, #4a5568 100%)';
    if (moodValue <= 40) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (moodValue <= 60) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    if (moodValue <= 80) return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
    return 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)';
  };

  return (
    <div className="page-content">
      <h1>Mood-Based Music</h1>
      <p className="subtitle">Slide to match your mood and discover perfect songs</p>

      {/* Mood Slider Card */}
      <div className="mood-slider-card" style={{ background: getMoodGradient() }}>
        <div className="mood-display">
          <span className="mood-emoji">{moodInfo.emoji}</span>
          <h2 className="mood-label">{moodInfo.label}</h2>
          <p className="mood-value">{moodValue}%</p>
        </div>

        <div className="slider-container">
          <div className="slider-labels">
            <span>😢 Sad</span>
            <span>😌 Calm</span>
            <span>🙂 Neutral</span>
            <span>😄 Happy</span>
            <span>🤩 Energetic</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={moodValue}
            onChange={handleSliderChange}
            className="mood-slider"
            style={{
              background: `linear-gradient(to right, #667eea 0%, #667eea ${moodValue}%, rgba(255,255,255,0.3) ${moodValue}%, rgba(255,255,255,0.3) 100%)`
            }}
          />
          
          <div className="slider-markers">
            <span className={moodValue <= 20 ? 'active' : ''}>0</span>
            <span className={moodValue > 20 && moodValue <= 40 ? 'active' : ''}>25</span>
            <span className={moodValue > 40 && moodValue <= 60 ? 'active' : ''}>50</span>
            <span className={moodValue > 60 && moodValue <= 80 ? 'active' : ''}>75</span>
            <span className={moodValue > 80 ? 'active' : ''}>100</span>
          </div>
        </div>

        <div className="language-selector">
          <label>Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Punjabi">Punjabi</option>
            <option value="All">All Languages</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Finding songs for your mood...</p>
        </div>
      )}

      {/* Results */}
      {!loading && allResults.length > 0 && (
        <>
          <div className="section-header">
            <h2>🎵 Songs for Your Mood</h2>
            <button 
              className="refresh-btn" 
              onClick={refreshSongs}
              disabled={refreshing}
              title="Refresh songs"
            >
              {refreshing ? '⏳' : '🔄'} Refresh
            </button>
          </div>
          
          <div className="song-grid">
            {allResults.slice(0, displayCount).map((song) => (
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
                </div>
              </div>
            ))}
          </div>

          {/* Show More / Refresh Button */}
          <div className="refresh-more-container">
            {displayCount < allResults.length ? (
              <>
                <button 
                  className="refresh-more-btn" 
                  onClick={showMoreSongs}
                >
                  ➕ Show More
                </button>
                <p className="more-songs-hint">
                  {allResults.length - displayCount} more songs available
                </p>
              </>
            ) : (
              <button 
                className="refresh-more-btn" 
                onClick={refreshSongs}
                disabled={refreshing}
              >
                {refreshing ? '⏳ Loading...' : '🔄 Refresh Songs'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MoodSlider;
