const MAX_HISTORY = 10;
const STORAGE_KEY = 'searchHistory';

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error('Failed to load search history:', e);
    return [];
  }
};

export const addToSearchHistory = (query) => {
  if (!query || query.trim().length === 0) return;
  
  try {
    let history = getSearchHistory();
    
    // Remove if already exists
    history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // Add to beginning
    history.unshift({
      query: query.trim(),
      timestamp: new Date().toISOString()
    });
    
    // Keep only MAX_HISTORY items
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save search history:', e);
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear search history:', e);
  }
};

export const removeFromSearchHistory = (query) => {
  try {
    let history = getSearchHistory();
    history = history.filter(item => item.query !== query);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to remove from search history:', e);
  }
};
