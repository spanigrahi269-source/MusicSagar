import { createContext, useContext, useState, useEffect } from 'react';

const ThemeModeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
};

export const ThemeModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    if (window.showToast) {
      window.showToast(`${!isDark ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'success');
    }
  };

  return (
    <ThemeModeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};
