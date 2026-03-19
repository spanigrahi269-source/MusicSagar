import { useState } from 'react';
import './SocialShare.css';

function SocialShare({ song, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!song) return null;

  // Generate shareable link
  const shareUrl = `https://www.youtube.com/watch?v=${song.youtube_video_id || song.videoId}`;
  const shareText = `🎵 Check out this song: ${song.title} by ${song.channel || song.channelTitle}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  // Social media share URLs
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(song.title)}`
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    
    if (window.showToast) {
      window.showToast(`📤 Sharing on ${platform}...`, 'info');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      if (window.showToast) {
        window.showToast('✅ Link copied to clipboard!', 'success');
      }
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      if (window.showToast) {
        window.showToast('Failed to copy link', 'error');
      }
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: song.title,
          text: shareText,
          url: shareUrl
        });
        if (window.showToast) {
          window.showToast('✅ Shared successfully!', 'success');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      if (window.showToast) {
        window.showToast('Native sharing not supported', 'info');
      }
    }
  };

  return (
    <div className="social-share-overlay" onClick={onClose}>
      <div className="social-share-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="social-share-header">
          <h3>📤 Share Song</h3>
          <button className="social-share-close" onClick={onClose}>✕</button>
        </div>

        {/* Song Info */}
        <div className="social-share-song-info">
          <img 
            src={song.thumbnail} 
            alt={song.title}
            className="social-share-thumbnail"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="social-share-details">
            <h4>{song.title}</h4>
            <p>{song.channel || song.channelTitle}</p>
          </div>
        </div>

        {/* Social Media Buttons */}
        <div className="social-share-buttons">
          <button 
            className="social-btn whatsapp"
            onClick={() => handleShare('whatsapp')}
            title="Share on WhatsApp"
          >
            <span className="social-icon">💬</span>
            <span>WhatsApp</span>
          </button>

          <button 
            className="social-btn facebook"
            onClick={() => handleShare('facebook')}
            title="Share on Facebook"
          >
            <span className="social-icon">📘</span>
            <span>Facebook</span>
          </button>

          <button 
            className="social-btn twitter"
            onClick={() => handleShare('twitter')}
            title="Share on Twitter"
          >
            <span className="social-icon">🐦</span>
            <span>Twitter</span>
          </button>

          <button 
            className="social-btn telegram"
            onClick={() => handleShare('telegram')}
            title="Share on Telegram"
          >
            <span className="social-icon">✈️</span>
            <span>Telegram</span>
          </button>

          <button 
            className="social-btn linkedin"
            onClick={() => handleShare('linkedin')}
            title="Share on LinkedIn"
          >
            <span className="social-icon">💼</span>
            <span>LinkedIn</span>
          </button>

          <button 
            className="social-btn reddit"
            onClick={() => handleShare('reddit')}
            title="Share on Reddit"
          >
            <span className="social-icon">🤖</span>
            <span>Reddit</span>
          </button>
        </div>

        {/* Copy Link */}
        <div className="social-share-copy">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="share-link-input"
          />
          <button 
            className={`copy-link-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {/* Native Share (Mobile) */}
        {navigator.share && (
          <button 
            className="native-share-btn"
            onClick={handleNativeShare}
          >
            📱 Share via...
          </button>
        )}
      </div>
    </div>
  );
}

export default SocialShare;
