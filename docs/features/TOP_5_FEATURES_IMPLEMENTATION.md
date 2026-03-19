# Top 5 Features + Song Duration - Implementation Guide

## ✅ Completed So Far:

1. **Toast Notifications Component** - Created
2. **ToastContainer** - Created  
3. **Toast CSS Styling** - Added
4. **Queue State Management** - Added to App.jsx
5. **Keyboard Shortcuts Foundation** - Added to App.jsx

## 🚀 Features to Implement:

### 1️⃣ Queue Management ⭐⭐⭐

**What's Done:**
- Queue state in App.jsx
- addToQueue, removeFromQueue, clearQueue, playNext functions

**What's Needed:**
- Update Home.jsx to add "Add to Queue" button
- Update MusicPlayer.jsx to show queue
- Add queue panel UI
- Add drag-to-reorder (optional)

**Files to Modify:**
- `frontend/src/pages/Home.jsx` - Add queue button
- `frontend/src/components/MusicPlayer.jsx` - Show queue, play next
- `frontend/src/App.css` - Queue panel styles

### 2️⃣ Favorites/Liked Songs Page ⭐⭐⭐

**What's Needed:**
- New "Favorites" page component
- Add to sidebar navigation
- Filter liked songs from history/stats
- Show all liked songs in grid

**Files to Create:**
- `frontend/src/pages/Favorites.jsx`

**Files to Modify:**
- `frontend/src/components/Sidebar.jsx` - Add Favorites link
- `frontend/src/App.jsx` - Add Favorites route

### 3️⃣ Radio Mode ⭐⭐⭐

**What's Needed:**
- "Start Radio" button on songs
- Auto-play similar songs when queue ends
- Fetch recommendations based on current song
- Infinite playback mode

**Files to Modify:**
- `frontend/src/App.jsx` - Add radio mode state
- `frontend/src/components/MusicPlayer.jsx` - Auto-play next
- `backend/app/routers/youtube.py` - Add related videos endpoint

### 4️⃣ Keyboard Shortcuts ⭐⭐⭐

**What's Done:**
- Basic keyboard event listener in App.jsx
- Space bar handling (in MusicPlayer)

**What's Needed:**
- Shortcuts help modal (press `?`)
- More shortcuts:
  - `L` - Like song
  - `P` - Add to playlist modal
  - `Q` - Add to queue
  - `N` - Next song
  - `Ctrl+K` - Focus search
  - `M` - Mute/unmute

**Files to Create:**
- `frontend/src/components/KeyboardShortcutsModal.jsx`

**Files to Modify:**
- `frontend/src/App.jsx` - Add more shortcuts
- `frontend/src/components/MusicPlayer.jsx` - Expose controls

### 5️⃣ Toast Notifications ✅

**Status:** COMPLETE

**Usage:**
```javascript
import { showToast } from '../components/ToastContainer';

// Success
showToast('Song added to queue!', 'success');

// Error
showToast('Failed to load song', 'error');

// Info
showToast('Playing next song', 'info');

// Warning
showToast('Queue is empty', 'warning');
```

### 6️⃣ Song Duration Display ⭐

**What's Needed:**
- Fetch duration from YouTube API
- Display on song cards (bottom-right corner)
- Format as MM:SS
- Add to all pages

**Files to Modify:**
- `backend/app/routers/youtube.py` - Include duration in response
- `frontend/src/pages/Home.jsx` - Display duration
- `frontend/src/pages/Search.jsx` - Display duration
- `frontend/src/pages/Trending.jsx` - Display duration
- `frontend/src/pages/History.jsx` - Display duration
- `frontend/src/pages/PlaylistDetail.jsx` - Display duration

## 📝 Implementation Priority:

### Phase 1: Quick Wins (30 mins)
1. ✅ Toast Notifications - DONE
2. Song Duration Display - Add to YouTube API response
3. Use toasts for user feedback

### Phase 2: Queue Management (1 hour)
1. Add "Add to Queue" buttons
2. Update MusicPlayer to show queue
3. Add queue panel UI
4. Implement play next functionality

### Phase 3: Keyboard Shortcuts (45 mins)
1. Create shortcuts modal
2. Add all keyboard shortcuts
3. Show help with `?` key

### Phase 4: Favorites Page (45 mins)
1. Create Favorites.jsx
2. Add to sidebar
3. Filter and display liked songs

### Phase 5: Radio Mode (1.5 hours)
1. Add "Start Radio" button
2. Fetch related videos
3. Auto-play when queue ends
4. Add radio mode indicator

## 🎨 UI Components Needed:

### Queue Panel
```
┌─────────────────────┐
│ Queue (3 songs)     │
│ ─────────────────── │
│ 🎵 Song 1      [×]  │
│ 🎵 Song 2      [×]  │
│ 🎵 Song 3      [×]  │
│ ─────────────────── │
│ [Clear Queue]       │
└─────────────────────┘
```

### Keyboard Shortcuts Modal
```
┌──────────────────────────┐
│ Keyboard Shortcuts   [×] │
│ ──────────────────────── │
│ Space    Play/Pause      │
│ →        Seek Forward    │
│ ←        Seek Backward   │
│ L        Like Song       │
│ Q        Add to Queue    │
│ N        Next Song       │
│ M        Mute/Unmute     │
│ Ctrl+K   Search          │
│ ?        Show This Help  │
└──────────────────────────┘
```

### Song Duration Badge
```
┌─────────────────┐
│                 │
│   [Thumbnail]   │
│                 │
│          [3:45] │ ← Duration badge
└─────────────────┘
```

## 🔧 Code Snippets:

### Add to Queue Button
```javascript
<button 
  className="queue-btn" 
  onClick={(e) => {
    e.stopPropagation();
    addToQueue(song);
    showToast('Added to queue!', 'success');
  }}
  title="Add to queue"
>
  ➕
</button>
```

### Format Duration
```javascript
const formatDuration = (isoDuration) => {
  // Convert ISO 8601 duration (PT4M33S) to MM:SS
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '0M').replace('M', '');
  const seconds = (match[3] || '0S').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.padStart(2, '0')}`;
};
```

### Show Toast on Actions
```javascript
// Like song
const likeSong = async (song) => {
  try {
    await api.post(`/songs/${song.id}/like`);
    showToast('❤️ Added to favorites!', 'success');
  } catch (err) {
    showToast('Failed to like song', 'error');
  }
};

// Add to playlist
const addToPlaylist = async (song, playlistId) => {
  try {
    await api.post(`/playlists/${playlistId}/songs`, { song });
    showToast('Added to playlist!', 'success');
  } catch (err) {
    showToast('Failed to add to playlist', 'error');
  }
};
```

## 📊 Backend Changes Needed:

### 1. YouTube API - Include Duration
```python
# backend/app/routers/youtube.py

# In search_youtube function, add duration to response:
{
    "videoId": item["id"]["videoId"],
    "title": snippet["title"],
    "thumbnail": snippet["thumbnails"]["high"]["url"],
    "channelTitle": snippet["channelTitle"],
    "duration": item["contentDetails"]["duration"]  # Add this
}
```

### 2. Related Videos Endpoint (for Radio Mode)
```python
@router.get("/youtube/related/{video_id}")
async def get_related_videos(video_id: str):
    """Get related/similar videos for radio mode"""
    # Use YouTube API relatedToVideoId parameter
    pass
```

## 🎯 Next Steps:

1. **Implement Song Duration** - Easiest, high impact
2. **Add Queue UI** - Core feature, medium complexity
3. **Create Favorites Page** - Easy, uses existing data
4. **Add Keyboard Shortcuts Modal** - Medium, great UX
5. **Implement Radio Mode** - Complex, but amazing feature

## 💡 Tips:

- Use `showToast()` for all user actions
- Test keyboard shortcuts don't conflict
- Queue should persist in localStorage (optional)
- Radio mode can use existing recommendations API
- Duration badge should have dark background for visibility

---

**Current Status:** Foundation complete, ready for feature implementation
**Estimated Total Time:** 4-5 hours for all features
**Priority Order:** Duration → Queue → Favorites → Shortcuts → Radio
