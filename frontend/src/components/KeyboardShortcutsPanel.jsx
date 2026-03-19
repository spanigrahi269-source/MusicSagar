import { useEffect } from 'react';

const shortcuts = [
  { key: 'Space', description: 'Play / Pause', icon: '⏯️' },
  { key: '←', description: 'Rewind 10 seconds', icon: '⏪' },
  { key: '→', description: 'Forward 10 seconds', icon: '⏩' },
  { key: 'M', description: 'Toggle Mute', icon: '🔇' },
  { key: 'F', description: 'Toggle Fullscreen', icon: '⛶' },
  { key: 'K', description: 'Toggle Karaoke Mode', icon: '🎤' },
  { key: 'L', description: 'Like Current Song', icon: '❤️' },
  { key: 'Q', description: 'Toggle Queue', icon: '🎵' },
  { key: 'N', description: 'Next Song', icon: '⏭️' },
  { key: 'P', description: 'Previous Song', icon: '⏮️' },
  { key: 'S', description: 'Toggle Shuffle', icon: '🔀' },
  { key: '?', description: 'Show Shortcuts', icon: '⌨️' },
  { key: 'Esc', description: 'Close Modals', icon: '✕' }
];

function KeyboardShortcutsPanel({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="shortcuts-overlay" onClick={onClose}></div>
      <div className="shortcuts-panel">
        <div className="shortcuts-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="shortcuts-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="shortcuts-grid">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-item">
              <div className="shortcut-icon">{shortcut.icon}</div>
              <div className="shortcut-info">
                <div className="shortcut-key">{shortcut.key}</div>
                <div className="shortcut-description">{shortcut.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="shortcuts-footer">
          <p>Press <kbd>?</kbd> anytime to show this panel</p>
        </div>
      </div>
    </>
  );
}

export default KeyboardShortcutsPanel;
