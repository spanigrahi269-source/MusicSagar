import { useState, useEffect } from 'react';

function MiniPlayer({ currentSong, isPlaying, onPlayPause, onNext, onPrevious, onExpand, progress = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show mini player when there's a current song
    setIsVisible(!!currentSong);
  }, [currentSong]);

  if (!isVisible || !currentSong) return null;

  return (
    <div className="mini-player">
      <div className="mini-player-progress" style={{ width: `${progress}%` }}></div>
      
      <div className="mini-player-content">
        <div className="mini-player-song" onClick={onExpand}>
          <img 
            src={currentSong.thumbnail} 
            alt={currentSong.title}
            className="mini-player-thumbnail"
          />
          <div className="mini-player-info">
            <h4 className="mini-player-title">{currentSong.title}</h4>
            <p className="mini-player-artist">{currentSong.channel}</p>
          </div>
        </div>

        <div className="mini-player-controls">
          <button 
            className="mini-control-btn"
            onClick={onPrevious}
            title="Previous"
          >
            ⏮
          </button>
          <button 
            className="mini-control-btn mini-play-btn"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            className="mini-control-btn"
            onClick={onNext}
            title="Next"
          >
            ⏭
          </button>
        </div>

        <button 
          className="mini-expand-btn"
          onClick={onExpand}
          title="Expand player"
        >
          ⬆
        </button>
      </div>
    </div>
  );
}

export default MiniPlayer;
