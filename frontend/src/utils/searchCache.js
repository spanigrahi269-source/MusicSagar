/**
 * Search Cache System
 * Caches YouTube search results to reduce API calls
 */

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
const MAX_CACHE_SIZE = 200; // Increased to 200 for longer cache duration

class SearchCache {
  constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  /**
   * Generate cache key from query and language
   */
  generateKey(query, language = 'all') {
    return `${query.toLowerCase().trim()}_${language}`;
  }

  /**
   * Get cached results
   */
  get(query, language = 'all') {
    const key = this.generateKey(query, language);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache is expired
    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      this.saveToLocalStorage();
      return null;
    }

    console.log(`✅ Cache HIT for: "${query}" (${language}) - saved API call! Valid for ${Math.round((CACHE_DURATION - (Date.now() - cached.timestamp)) / 1000 / 60 / 60 * 10) / 10}h more`);
    return cached.data;
  }

  /**
   * Set cache results
   */
  set(query, language = 'all', data) {
    const key = this.generateKey(query, language);

    // Limit cache size
    if (this.cache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    console.log(`💾 Cached: "${query}" (${language}) - valid for 12 hours`);
    this.saveToLocalStorage();
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    localStorage.removeItem('music_sagar_search_cache');
    console.log('🗑️ Cache cleared');
  }

  /**
   * Clear expired entries
   */
  clearExpired() {
    const now = Date.now();
    let clearedCount = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        this.cache.delete(key);
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      console.log(`🗑️ Cleared ${clearedCount} expired cache entries`);
      this.saveToLocalStorage();
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: MAX_CACHE_SIZE,
      duration: CACHE_DURATION / 1000 / 60 / 60 + ' hours'
    };
  }

  /**
   * Save cache to localStorage
   */
  saveToLocalStorage() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      localStorage.setItem('music_sagar_search_cache', JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  loadFromLocalStorage() {
    try {
      const cached = localStorage.getItem('music_sagar_search_cache');
      if (cached) {
        const cacheArray = JSON.parse(cached);
        this.cache = new Map(cacheArray);
        this.clearExpired(); // Clean up expired entries on load
        console.log(`📦 Loaded ${this.cache.size} cached queries from localStorage`);
      }
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
      this.cache = new Map();
    }
  }
}

// Export singleton instance
export const searchCache = new SearchCache();

// Clear expired entries every 2 hours (since cache is now 12 hours)
setInterval(() => {
  searchCache.clearExpired();
}, 2 * 60 * 60 * 1000);
