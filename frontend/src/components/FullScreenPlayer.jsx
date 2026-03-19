import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import KaraokeMode from './KaraokeMode';
import './FullScreenPlayer.css';

// Load YouTube IFrame API
let YT;
let isYouTubeAPIReady = false;

if (typeof window !== 'undefined' && !window.YT) {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  window.onYouTubeIframeAPIReady = () => {
    YT = window.YT;
    isYouTubeAPIReady = true;
  };
} else if (window.YT) {
  YT = window.YT;
  isYouTubeAPIReady = true;
}

function FullScreenPlayer({ currentSong, onClose, onPlaySong, onNext, onPrevious, isPlaying: externalIsPlaying, onPlayPause, onProgressUpdate }) {
  const [playMode, setPlayMode] = useState('video'); // 'video' or 'audio'
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showKaraoke, setShowKaraoke] = useState(false);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    if (currentSong) {
      fetchRecommendations();
      addToHistory();
      setCurrentTime(0);
      setDuration(0); // Reset duration, will be set by YouTube player
      setIsPlaying(true);
      
      // Initialize YouTube player
      initializePlayer();
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [currentSong?.youtube_video_id]); // Only re-run when video ID changes

  // Reinitialize player when mode changes
  useEffect(() => {
    if (currentSong && isYouTubeAPIReady && playerRef.current) {
      // Clear existing interval before recreating player
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        createPlayer();
      }, 100);
    }
  }, [playMode]); // Only when playMode changes

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger if user is typing
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key.toLowerCase()) {
        case 'k':
          e.preventDefault();
          setShowKaraoke(prev => !prev);
          break;
        case 'arrowleft':
          e.preventDefault();
          handleReverse();
          break;
        case 'arrowright':
          e.preventDefault();
          handleForward();
          break;
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const initializePlayer = () => {
    // Wait for API to be ready
    const checkAPI = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkAPI);
        createPlayer();
      }
    }, 100);
  };

  const createPlayer = () => {
    // Clear interval before destroying player
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Destroy existing player
    if (playerRef.current && playerRef.current.destroy) {
      try {
        playerRef.current.destroy();
      } catch (error) {
        console.error('Error destroying player:', error);
      }
      playerRef.current = null;
    }

    // Determine which container to use based on mode
    const containerId = playMode === 'video' ? 'youtube-player' : 'youtube-audio-player';
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error('Player container not found:', containerId);
      return;
    }

    playerRef.current = new window.YT.Player(containerId, {
      videoId: currentSong.youtube_video_id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  const onPlayerReady = (event) => {
    const player = event.target;
    
    // Store player reference
    playerRef.current = player;
    
    player.setVolume(volume);
    
    // Try to get duration immediately
    let initialDuration = player.getDuration();
    if (initialDuration && initialDuration > 0) {
      setDuration(initialDuration);
    }
    
    // Clear any existing interval before creating new one
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Start progress tracking with faster updates (500ms for smoother display)
    progressIntervalRef.current = setInterval(() => {
      // Use the stored player reference
      const currentPlayer = playerRef.current;
      if (currentPlayer && currentPlayer.getCurrentTime && currentPlayer.getDuration) {
        try {
          const current = currentPlayer.getCurrentTime();
          const dur = currentPlayer.getDuration();
          
          // Update current time
          if (current !== undefined && current !== null) {
            setCurrentTime(current);
            // Update progress for mini player
            if (onProgressUpdate && dur && dur > 0) {
              const progressPercent = (current / dur) * 100;
              onProgressUpdate(progressPercent);
            }
          }
          
          // Update duration if available and valid
          if (dur && dur > 0 && !isNaN(dur) && isFinite(dur)) {
            setDuration(dur);
          }
        } catch (error) {
          console.error('Error updating player time:', error);
        }
      }
    }, 500); // Update every 500ms for smoother progress
    
    // Also try to get duration after a short delay (sometimes it's not ready immediately)
    setTimeout(() => {
      try {
        const dur = player.getDuration();
        if (dur && dur > 0 && !isNaN(dur) && isFinite(dur)) {
          setDuration(dur);
        }
      } catch (error) {
        console.error('Error getting duration:', error);
      }
    }, 1000);
  };

  const onPlayerStateChange = (event) => {
    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const addToHistory = async () => {
    try {
      await api.post('/history', currentSong);
    } catch (err) {
      console.error('Failed to add to history:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // Fetch recommendations based on current song
      const response = await api.get('/stats/recommendations');
      const allRecs = response.data.recommendations || [];
      
      // Filter out current song and limit to 10
      const filtered = allRecs
        .filter(song => song.youtube_video_id !== currentSong.youtube_video_id)
        .slice(0, 10);
      
      setRecommendations(filtered);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const handleForward = () => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      const newTime = Math.min(playerRef.current.getCurrentTime() + 10, duration);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const handleReverse = () => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      const newTime = Math.max(playerRef.current.getCurrentTime() - 10, 0);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * duration;
    
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecommendationClick = (song) => {
    if (onPlaySong) {
      onPlaySong(song);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fullscreen-player-overlay">
      <div className="fullscreen-player-container">
        {/* Close Button */}
        <button className="fullscreen-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Main Player Area */}
        <div className="player-main-area">
          {/* Left Side - Player */}
          <div className="player-left-section">
            {/* Mode Toggle */}
            <div className="player-mode-selector">
              <button 
                className={`mode-selector-btn ${playMode === 'video' ? 'active' : ''}`}
                onClick={() => setPlayMode('video')}
              >
                🎬 Video
              </button>
              <button 
                className={`mode-selector-btn ${playMode === 'audio' ? 'active' : ''}`}
                onClick={() => setPlayMode('audio')}
              >
                🎵 Audio Only
              </button>
            </div>

            {/* Video/Audio Display */}
            <div className="player-display-area">
              {playMode === 'video' ? (
                <div className="video-container">
                  <div id="youtube-player" ref={playerContainerRef}></div>
                </div>
              ) : (
                <div className="audio-only-container">
                  <div className="audio-thumbnail">
                    <img 
                      src={currentSong.thumbnail} 
                      alt={currentSong.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        e.target.parentElement.innerHTML += '<div style="font-size:80px;">🎵</div>';
                      }}
                    />
                  </div>
                  <div className="audio-waveform">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                  </div>
                  {/* Hidden YouTube player for audio */}
                  <div id="youtube-audio-player" style={{ display: 'none' }}></div>
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="player-song-details">
              <h2 className="player-song-title">{currentSong.title}</h2>
              <p className="player-song-artist">{currentSong.channel}</p>
            </div>

            {/* Progress Bar */}
            <div className="player-progress-section">
              <span className="progress-time">{formatTime(currentTime)}</span>
              <div 
                className="progress-bar-container" 
                onClick={handleProgressClick}
              >
                <div 
                  className="progress-bar-fill"
                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="progress-time">{formatTime(duration)}</span>
            </div>

            {/* Control Buttons */}
            <div className="player-controls-section">
              <button 
                className="control-btn"
                onClick={onPrevious}
                title="Previous song"
                disabled={!onPrevious}
              >
                ⏮️
              </button>
              <button 
                className="control-btn control-btn-reverse"
                onClick={handleReverse}
                title="Back 10 seconds"
              >
                ⏪
              </button>
              <button 
                className="control-btn control-btn-play-pause"
                onClick={handlePlayPause}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button 
                className="control-btn control-btn-forward"
                onClick={handleForward}
                title="Forward 10 seconds"
              >
                ⏩
              </button>
              <button 
                className="control-btn"
                onClick={onNext}
                title="Next song"
                disabled={!onNext}
              >
                ⏭️
              </button>
            </div>

            {/* Additional Controls */}
            <div className="player-additional-controls">
              <button 
                className="control-btn-secondary"
                onClick={() => setShowKaraoke(true)}
                title="Karaoke Mode (K)"
              >
                🎤 Karaoke
              </button>
            </div>

            {/* Volume Control */}
            <div className="player-volume-section">
              <span className="volume-icon">🔊</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              <span className="volume-value">{volume}%</span>
            </div>
          </div>

          {/* Right Side - Recommendations */}
          <div className="player-right-section">
            <div className="recommendations-header">
              <h3 className="recommendations-title">🔥 Up Next</h3>
              <button 
                className="refresh-recommendations-btn"
                onClick={fetchRecommendations}
                disabled={loading}
              >
                {loading ? '⏳' : '🔄'}
              </button>
            </div>

            <div className="recommendations-list">
              {recommendations.length === 0 ? (
                <div className="no-recommendations">
                  <p>No recommendations available</p>
                </div>
              ) : (
                recommendations.map((song) => (
                  <div 
                    key={song.youtube_video_id}
                    className="recommendation-item"
                    onClick={() => handleRecommendationClick(song)}
                  >
                    <div className="rec-thumbnail">
                      <img 
                        src={song.thumbnail} 
                        alt={song.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.target.parentElement.innerHTML += '<div style="font-size:24px;">🎵</div>';
                        }}
                      />
                      <div className="rec-play-overlay">
                        <div className="rec-play-icon">▶</div>
                      </div>
                    </div>
                    <div className="rec-info">
                      <h4 className="rec-title">{song.title}</h4>
                      <p className="rec-artist">{song.channel}</p>
                      <span className="rec-duration">3:45</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Karaoke Mode Overlay */}
      {showKaraoke && (
        <KaraokeMode 
          song={currentSong}
          player={playerRef.current}
          onClose={() => setShowKaraoke(false)}
        />
      )}
    </div>
  );
}

export default FullScreenPlayer;
