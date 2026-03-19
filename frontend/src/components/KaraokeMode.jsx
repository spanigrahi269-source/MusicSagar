import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function KaraokeMode({ song, player, onClose }) {
  const [lyrics, setLyrics] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lyricsContainerRef = useRef(null);

  // Fetch lyrics when song changes
  useEffect(() => {
    if (song) {
      fetchLyrics();
    }
  }, [song]);

  // Auto-scroll and highlight based on playback time
  useEffect(() => {
    if (!player || !lyrics.length) return;

    const interval = setInterval(() => {
      if (typeof player.getCurrentTime === 'function') {
        const currentTime = player.getCurrentTime();
        
        // Find current line based on time
        let newIndex = 0;
        for (let i = 0; i < lyrics.length; i++) {
          if (lyrics[i].time <= currentTime) {
            newIndex = i;
          } else {
            break;
          }
        }
        
        if (newIndex !== currentLineIndex) {
          setCurrentLineIndex(newIndex);
          scrollToLine(newIndex);
        }
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, [player, lyrics, currentLineIndex]);

  const fetchLyrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/ai/lyrics/${encodeURIComponent(song.title)}`);
      setLyrics(response.data.lyrics || []);
      
      if (!response.data.available) {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Failed to fetch lyrics:', err);
      setError('Failed to load lyrics');
      setLyrics([
        { time: 0, text: '🎵 Lyrics unavailable' },
        { time: 3, text: 'Enjoy the music!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToLine = (index) => {
    if (lyricsContainerRef.current) {
      const lineElement = lyricsContainerRef.current.children[index];
      if (lineElement) {
        lineElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="karaoke-mode">
      <div className="karaoke-overlay" onClick={onClose}></div>
      
      <div className="karaoke-container">
        {/* Header */}
        <div className="karaoke-header">
          <div className="karaoke-song-info">
            <img src={song.thumbnail} alt={song.title} className="karaoke-thumbnail" />
            <div>
              <h2>{song.title}</h2>
              <p>{song.channel}</p>
            </div>
          </div>
          <button className="karaoke-close-btn" onClick={onClose} title="Exit Karaoke Mode">
            ✕
          </button>
        </div>

        {/* Lyrics Display */}
        <div className="karaoke-lyrics-container" ref={lyricsContainerRef}>
          {loading && (
            <div className="karaoke-loading">
              <div className="spinner"></div>
              <p>Loading lyrics...</p>
            </div>
          )}

          {!loading && error && (
            <div className="karaoke-error">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {!loading && lyrics.length > 0 && (
            <div className="karaoke-lyrics">
              {lyrics.map((line, index) => (
                <div
                  key={index}
                  className={`karaoke-line ${index === currentLineIndex ? 'active' : ''} ${
                    index < currentLineIndex ? 'past' : ''
                  }`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Instructions */}
        <div className="karaoke-footer">
          <p>🎤 Sing along! • Press ESC or click outside to exit</p>
        </div>
      </div>
    </div>
  );
}

export default KaraokeMode;
