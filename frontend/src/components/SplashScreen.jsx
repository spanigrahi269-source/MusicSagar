import { useState, useEffect } from 'react';

const musicQuotes = [
  "Music is the universal language of mankind",
  "Where words fail, music speaks",
  "Life is a song, love is the music",
  "Music gives a soul to the universe",
  "Without music, life would be a mistake"
];

function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [quote] = useState(() => musicQuotes[Math.floor(Math.random() * musicQuotes.length)]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for fade out
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setProgress(100);
  };

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <div className="splash-icon">🎵</div>
          <h1 className="splash-title">Music Sagar</h1>
          <p className="splash-subtitle">Your Personal Music Streaming Platform</p>
        </div>

        <div className="splash-quote">
          <p>"{quote}"</p>
        </div>

        <div className="splash-progress-container">
          <div className="splash-progress-bar">
            <div 
              className="splash-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="splash-progress-text">{progress}%</p>
        </div>

        <button className="splash-skip-btn" onClick={handleSkip}>
          Skip →
        </button>
      </div>
    </div>
  );
}

export default SplashScreen;
