import { useState } from 'react';

function ShareModal({ isOpen, onClose, song, playlist }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareData = song || playlist;
  const shareType = song ? 'song' : 'playlist';
  const shareUrl = song 
    ? `https://www.youtube.com/watch?v=${song.youtube_video_id}`
    : `${window.location.origin}/playlist/${playlist?.id}`;
  
  const shareText = song
    ? `Check out "${song.title}" by ${song.channel} on Music Sagar!`
    : `Check out my playlist "${playlist?.name}" on Music Sagar!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      if (window.showToast) {
        window.showToast('✅ Link copied to clipboard!', 'success');
      }
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="share-overlay" onClick={onClose}></div>
      <div className="share-modal">
        <div className="share-header">
          <h3>📤 Share {shareType === 'song' ? 'Song' : 'Playlist'}</h3>
          <button className="share-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="share-content">
          {shareData && (
            <div className="share-preview">
              <img 
                src={song?.thumbnail || '/playlist-icon.png'} 
                alt={shareData.title || shareData.name}
                className="share-preview-img"
              />
              <div className="share-preview-info">
                <h4>{shareData.title || shareData.name}</h4>
                <p>{song?.channel || `${playlist?.songs?.length || 0} songs`}</p>
              </div>
            </div>
          )}

          <div className="share-link-container">
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              className="share-link-input"
            />
            <button 
              className="share-copy-btn"
              onClick={copyToClipboard}
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>

          <div className="share-social-buttons">
            <button className="share-social-btn whatsapp" onClick={shareToWhatsApp}>
              <span className="share-icon">💬</span>
              WhatsApp
            </button>
            <button className="share-social-btn twitter" onClick={shareToTwitter}>
              <span className="share-icon">🐦</span>
              Twitter
            </button>
            <button className="share-social-btn facebook" onClick={shareToFacebook}>
              <span className="share-icon">📘</span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShareModal;
