import { useState } from 'react';
import { useQueue } from '../contexts/QueueContext';

function QueuePanel({ isOpen, onClose }) {
  const {
    queue,
    currentIndex,
    isShuffled,
    removeFromQueue,
    clearQueue,
    playFromQueue,
    shuffleQueue,
    moveInQueue
  } = useQueue();

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    moveInQueue(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="queue-overlay" onClick={onClose}></div>
      <div className="queue-panel">
        <div className="queue-header">
          <div>
            <h2>🎵 Queue</h2>
            <p className="queue-count">{queue.length} songs</p>
          </div>
          <div className="queue-actions">
            <button 
              className={`queue-action-btn ${isShuffled ? 'active' : ''}`}
              onClick={shuffleQueue}
              title={isShuffled ? 'Unshuffle' : 'Shuffle'}
            >
              🔀
            </button>
            <button 
              className="queue-action-btn"
              onClick={clearQueue}
              title="Clear queue"
            >
              🗑️
            </button>
            <button 
              className="queue-close-btn"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="queue-list">
          {queue.length === 0 ? (
            <div className="queue-empty">
              <div className="empty-icon">🎵</div>
              <p>Queue is empty</p>
              <p className="empty-subtitle">Add songs to start playing</p>
            </div>
          ) : (
            queue.map((song, index) => (
              <div
                key={`${song.youtube_video_id}-${index}`}
                className={`queue-item ${index === currentIndex ? 'playing' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => playFromQueue(index)}
              >
                <div className="queue-item-drag">⋮⋮</div>
                <div className="queue-item-thumbnail">
                  <img src={song.thumbnail} alt={song.title} />
                  {index === currentIndex && (
                    <div className="queue-playing-indicator">
                      <div className="playing-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="queue-item-info">
                  <h4 className="queue-item-title">{song.title}</h4>
                  <p className="queue-item-artist">{song.channel}</p>
                </div>
                <button
                  className="queue-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(index);
                  }}
                  title="Remove from queue"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default QueuePanel;
