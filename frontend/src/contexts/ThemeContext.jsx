import { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme, resetTheme } from '../utils/themeConfig';
import { detectMusicType } from '../utils/detectMusicType';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isThemeEnabled, setIsThemeEnabled] = useState(true);

  /**
   * Update theme based on currently playing song
   */
  const updateThemeFromSong = (song) => {
    if (!isThemeEnabled || !song) {
      resetTheme();
      setCurrentTheme('default');
      return;
    }

    const title = song.title || '';
    const description = song.description || '';
    
    const detectedType = detectMusicType(title, description);
    
    if (detectedType !== currentTheme) {
      applyTheme(detectedType);
      setCurrentTheme(detectedType);
    }
  };

  /**
   * Toggle dynamic theme feature
   */
  const toggleTheme = () => {
    setIsThemeEnabled(prev => !prev);
    if (isThemeEnabled) {
      resetTheme();
      setCurrentTheme('default');
    }
  };

  /**
   * Manually set theme
   */
  const setTheme = (themeName) => {
    applyTheme(themeName);
    setCurrentTheme(themeName);
  };

  // Reset theme on unmount
  useEffect(() => {
    return () => resetTheme();
  }, []);

  const value = {
    currentTheme,
    isThemeEnabled,
    updateThemeFromSong,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
