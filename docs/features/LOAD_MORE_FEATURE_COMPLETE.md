# Load More Feature - Complete ✅

## Overview
Added "Load More" button at the end of search results to fetch additional songs using YouTube API pagination.

## Features Implemented

### 1️⃣ Pagination State Management
- `nextPageToken` - Stores token for next page
- `hasMore` - Boolean to show/hide load more button
- `loadingMore` - Loading state for load more action

### 2️⃣ Load More Button
- Appears at bottom of search results
- Shows loading spinner while fetching
- Disabled during loading
- Purple gradient styling matching app theme
- Smooth hover animations

### 3️⃣ Backend Pagination Support
- Added `pageToken` parameter to YouTube search endpoint
- Returns `nextPageToken` and `prevPageToken` in response
- Supports infinite scrolling through results

### 4️⃣ User Experience
- Results append to existing list (no page reload)
- Button shows "Loading more..." with spinner
- Automatically hides when no more results
- Smooth animations and transitions

## Technical Implementation

### Frontend Changes:

**File**: `frontend/src/pages/Search.jsx`
- Added state variables for pagination
- Created `loadMoreResults()` function
- Updated `handleSearch()` to reset pagination
- Added Load More button UI

**File**: `frontend/src/App.css`
- Added `.load-more-container` styles
- Added `.load-more-btn` styles with hover effects
- Added `.spinner-small` for loading indicator

### Backend Changes:

**File**: `backend/app/routers/youtube.py`
- Added `pageToken` parameter to search endpoint
- Pass pageToken to YouTube API
- Return nextPageToken and prevPageToken in response

## How It Works

1. **Initial Search**:
   - User searches for songs
   - First 20 results displayed
   - If more results available, "Load More" button appears

2. **Load More Click**:
   - Button shows loading state
   - Fetches next 20 results using pageToken
   - Appends new results to existing list
   - Updates nextPageToken for next load

3. **No More Results**:
   - When nextPageToken is null
   - Button automatically hides
   - User sees all available results

## UI Design

### Load More Button States:

**Normal State:**
```
┌──────────────────────────┐
│  🔄 Load More Songs      │
└──────────────────────────┘
```

**Loading State:**
```
┌──────────────────────────┐
│  ⏳ Loading more...      │
└──────────────────────────┘
```

### Button Styling:
- Background: Purple gradient (#667eea to #764ba2)
- Padding: 16px 48px
- Border radius: 16px
- Box shadow with purple glow
- Hover: Lift effect + brighter gradient
- Disabled: 70% opacity

## Usage Example

```javascript
// In Search.jsx

// State
const [nextPageToken, setNextPageToken] = useState(null);
const [hasMore, setHasMore] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);

// Load more function
const loadMoreResults = async () => {
  if (!nextPageToken || loadingMore) return;
  
  setLoadingMore(true);
  const response = await api.get(`/youtube/search?query=${query}&pageToken=${nextPageToken}`);
  setResults(prev => [...prev, ...response.data.results]);
  setNextPageToken(response.data.nextPageToken);
  setHasMore(!!response.data.nextPageToken);
  setLoadingMore(false);
};

// UI
{hasMore && (
  <button onClick={loadMoreResults} disabled={loadingMore}>
    {loadingMore ? 'Loading more...' : '🔄 Load More Songs'}
  </button>
)}
```

## Future Enhancements

### Infinite Scroll (Alternative)
Instead of button, auto-load when scrolling to bottom:

```javascript
useEffect(() => {
  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
    if (bottom && hasMore && !loadingMore) {
      loadMoreResults();
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [hasMore, loadingMore]);
```

### Add to Other Pages
Can be added to:
- Trending page (if backend supports pagination)
- History page (load older history)
- Playlist detail page (for large playlists)
- Favorites page (when implemented)

### Show Results Count
```javascript
<p className="results-info">
  Showing {results.length} songs
  {hasMore && ' • More available'}
</p>
```

### Scroll to Top Button
When user loads many results:
```javascript
<button 
  className="scroll-top-btn"
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
  ↑ Back to Top
</button>
```

## Performance Considerations

1. **API Quota**: Each load more uses YouTube API quota
2. **Memory**: Large result lists may impact performance
3. **Network**: Multiple requests for pagination
4. **UX**: Button click is more controlled than infinite scroll

## Testing Checklist

- [x] Load more button appears after search
- [x] Button shows loading state when clicked
- [x] New results append to existing list
- [x] Button hides when no more results
- [x] Button disabled during loading
- [x] Smooth animations and transitions
- [x] Works with language filter
- [x] Backend returns pagination tokens
- [x] Error handling for failed requests

---

**Status**: ✅ Complete
**Pages**: Search page
**Can be extended to**: Trending, History, Playlists, Favorites
