/**
 * Theme configurations for different music types
 * Dynamically changes UI based on currently playing song
 */

export const musicThemes = {
  devotional: {
    name: 'Devotional',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    primaryColor: '#f6d365',
    secondaryColor: '#fda085',
    textColor: '#ffffff',
    glowColor: 'rgba(246, 211, 101, 0.4)',
    fontFamily: "'Merriweather', serif",
    animation: 'softGlow 3s ease-in-out infinite',
  },
  
  romantic: {
    name: 'Romantic',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    primaryColor: '#f093fb',
    secondaryColor: '#f5576c',
    textColor: '#ffffff',
    glowColor: 'rgba(240, 147, 251, 0.4)',
    fontFamily: "'Poppins', sans-serif",
    animation: 'romanticPulse 4s ease-in-out infinite',
  },
  
  party: {
    name: 'Party',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    primaryColor: '#ff6b6b',
    secondaryColor: '#feca57',
    textColor: '#ffffff',
    glowColor: 'rgba(255, 107, 107, 0.5)',
    fontFamily: "'Montserrat', sans-serif",
    animation: 'partyBounce 1s ease-in-out infinite',
  },
  
  edm: {
    name: 'EDM',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    textColor: '#ffffff',
    glowColor: 'rgba(102, 126, 234, 0.6)',
    fontFamily: "'Orbitron', sans-serif",
    animation: 'neonPulse 0.8s ease-in-out infinite',
  },
  
  chill: {
    name: 'Chill',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    primaryColor: '#a8edea',
    secondaryColor: '#fed6e3',
    textColor: '#2d3748',
    glowColor: 'rgba(168, 237, 234, 0.3)',
    fontFamily: "'Nunito', sans-serif",
    animation: 'chillWave 5s ease-in-out infinite',
  },
  
  sad: {
    name: 'Sad',
    gradient: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
    primaryColor: '#4a5568',
    secondaryColor: '#2d3748',
    textColor: '#e2e8f0',
    glowColor: 'rgba(74, 85, 104, 0.3)',
    fontFamily: "'Lora', serif",
    animation: 'sadFade 6s ease-in-out infinite',
  },
  
  default: {
    name: 'Default',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    textColor: '#ffffff',
    glowColor: 'rgba(102, 126, 234, 0.3)',
    fontFamily: "'Inter', sans-serif",
    animation: 'none',
  }
};

/**
 * Apply theme to document root
 */
export function applyTheme(themeName) {
  const theme = musicThemes[themeName] || musicThemes.default;
  const root = document.documentElement;
  
  // Set CSS variables
  root.style.setProperty('--theme-gradient', theme.gradient);
  root.style.setProperty('--theme-primary', theme.primaryColor);
  root.style.setProperty('--theme-secondary', theme.secondaryColor);
  root.style.setProperty('--theme-text', theme.textColor);
  root.style.setProperty('--theme-glow', theme.glowColor);
  root.style.setProperty('--theme-font', theme.fontFamily);
  root.style.setProperty('--theme-animation', theme.animation);
  
  // Add theme class to body
  document.body.className = `theme-${themeName}`;
  
  return theme;
}

/**
 * Reset to default theme
 */
export function resetTheme() {
  applyTheme('default');
}
