# Duration Display & Seek Buttons - Complete Implementation

## Overview
Implemented two major features:
1. **Video Duration Display** - Fetch and show duration on all song cards
2. **Working Seek Buttons** - Fixed forward/backward buttons using YouTube IFrame Player API

---

## Feature 1: Video Duration Display

### Backend Implementation

#### 1. Utility Function (`backend/app/utils.py`)
```python
def parse_iso8601_duration(duration: str) -> Optional[str]:
    """
    Convert ISO 8601 duration (PT3M45S) to readable format (3:45)
    
    Examples:
        PT3M45S -> "3:45"
        PT1H2M30S -> "1:02:30"
        PT45S -> "0:45"
    """
```

**Features:**
- Parses ISO 8601 format from YouTube API
- Handles hours, minutes, seconds
- Returns formatted string (mm:ss or hh:mm:ss)
- Error handling for invalid formats

#### 2. YouTube Router Update (`backend/app/routers/youtube.py`)

**New Function:**
```python
async def fetch_video_durations(video_ids: List[str], api_key: str) -> dict:
    """Fetch video durations from YouTube API videos endpoint"""
```

**Updated Search Endpoint:**
- Extracts video IDs from search results
- Calls `fetch_video_durations()` to get durations
- Includes duration in response for each video

**API Response Example:**
```json
{
  "results": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Song Title",
      "thumbnail": "https://...",
      "channelTitle": "Artist Name",
      "duration": "3:45"
    }
  ],
  "nextPageToken": "...",
  "prevPageToken": "..."
}
```

### Frontend Implementation

#### 1. Search Component (`frontend/src/pages/Search.jsx`)

**Updated `playSong` function:**
```javascript
const playSong = (song) => {
  const formattedSong = {
    youtube_video_id: song.videoId,
    title: song.title,
    thumbnail: song.thumbnail,
    channel: song.channelTitle,
    duration: song.duration || "0:00"  // Include duration
  };
  onPlaySong(formattedSong);
};
```

**Updated Song Card:**
```jsx
<div className="song-thumbnail" onClick={() => playSong(song)}>
  <img src={song.thumbnail} alt={song.title} />
  <div className="play-overlay">
    <div className="play-button">▶</div>
  </div>
  {song.duration && (
    <div className="duration-badge">{song.duration}</div>
  )}
</div>
```

#### 2. Music Player (`frontend/src/components/MusicPlayer.jsx`)

**Display duration in player:**
```jsx
<div className="player-info">
  <h4>{currentSong.title}</h4>
  <p>{currentSong.channel}</p>
  {currentSong.duration && (
    <span className="player-duration">⏱️ {currentSong.duration}</span>
  )}
</div>
```

#### 3. CSS Styling (`frontend/src/App.css`)

**Duration Badge (on thumbnails):**
```css
.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
}
```

**Player Duration:**
```css
.player-duration {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
  font-family: 'Courier New', monospace;
}
```

---

## Feature 2: Working Seek Buttons

### Problem
Previous implementation used `postMessage` API which had timing and reliability issues.

### Solution
Implemented full YouTube IFrame Player API with proper player instance management.

### Implementation

#### 1. Player Initialization
```javascript
const createPlayer = () => {
  const newPlayer = new window.YT.Player(playerContainerRef.current, {
    videoId: currentSong.youtube_video_id,
    playerVars: {
      autoplay: 1,
      controls: isAudioMode ? 0 : 1,
      modestbranding: 1,
      rel: 0
    },
    events: {
      onReady: (event) => {
        setPlayer(event.target);
      },
      onStateChange: (event) => {
        // Track playing state
        if (event.data === window.YT.PlayerState.PLAYING) {
          setIsPlaying(true);
        } else if (event.data === window.YT.PlayerState.PAUSED) {
          setIsPlaying(false);
        }
      }
    }
  });
};
```

#### 2. Seek Functions
```javascript
const seekForward = () => {
  if (!player || !player.getCurrentTime) return;
  
  try {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    const newTime = Math.min(currentTime + 10, duration);
    player.seekTo(newTime, true);
  } catch (err) {
    console.error('Seek forward failed:', err);
  }
};

const seekBackward = () => {
  if (!player || !player.getCurrentTime) return;
  
  try {
    const currentTime = player.getCurrentTime();
    const newTime = Math.max(currentTime - 10, 0);
    player.seekTo(newTime, true);
  } catch (err) {
    console.error('Seek backward failed:', err);
  }
};
```

#### 3. Play/Pause Control
```javascript
const togglePlayPause = () => {
  if (!player) return;
  
  if (isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
};
```

### Key Features

1. **Proper API Loading**
   - Loads YouTube IFrame API script
   - Waits for API to be ready
   - Creates player instance

2. **Player State Management**
   - Tracks player instance in state
   - Monitors playing/paused state
   - Handles player lifecycle

3. **Reliable Seeking**
   - Gets current time from player
   - Calculates new position
   - Seeks to exact timestamp
   - Prevents seeking beyond duration

4. **Error Handling**
   - Try-catch blocks
   - Null checks
   - Graceful degradation

5. **Keyboard Shortcuts**
   - Space: Play/Pause
   - ← (Left Arrow): Rewind 10s
   - → (Right Arrow): Forward 10s

---

## Files Modified

### Backend
1. `backend/app/utils.py` - NEW - Duration parsing utility
2. `backend/app/routers/youtube.py` - Updated search endpoint with duration

### Frontend
1. `frontend/src/components/MusicPlayer.jsx` - Complete rewrite with YouTube IFrame API
2. `frontend/src/pages/Search.jsx` - Added duration display
3. `frontend/src/App.css` - Added duration badge and player duration styles

---

## Testing

### Duration Display
1. Search for a song
2. Verify duration badge appears on thumbnail (bottom-right)
3. Play the song
4. Verify duration appears in player info

### Seek Buttons
1. Play a song
2. Click ⏩ (forward) button - should skip 10 seconds ahead
3. Click ⏪ (backward) button - should go back 10 seconds
4. Test keyboard shortcuts:
   - Press → to seek forward
   - Press ← to seek backward
   - Press Space to play/pause

---

## API Usage

### YouTube API Calls

**Before (per search):**
- 1 call to `search` endpoint

**After (per search):**
- 1 call to `search` endpoint
- 1 call to `videos` endpoint (for durations)

**Note:** The `videos` endpoint can fetch up to 50 video durations in a single request, so it's efficient.

---

## Duration Format Examples

| ISO 8601 | Formatted | Description |
|----------|-----------|-------------|
| PT45S | 0:45 | 45 seconds |
| PT3M45S | 3:45 | 3 minutes 45 seconds |
| PT1H2M30S | 1:02:30 | 1 hour 2 minutes 30 seconds |
| PT2H5S | 2:00:05 | 2 hours 5 seconds |

---

## Benefits

### Duration Display
- Users can see song length before playing
- Better UX for playlist creation
- Helps users make informed choices

### Working Seek Buttons
- Full control over playback
- Reliable seeking (no more timing issues)
- Consistent behavior
- Better user experience

---

## Future Enhancements

### Possible Additions
1. **Progress Bar** - Show current position and allow seeking by clicking
2. **Playback Speed** - Control playback speed (0.5x, 1x, 1.5x, 2x)
3. **Volume Control** - Adjust volume programmatically
4. **Quality Selection** - Choose video quality
5. **Repeat Mode** - Loop current song
6. **Shuffle** - Random playback order

### Implementation Notes
All these features are now possible because we have full access to the YouTube IFrame Player API through the `player` instance.

---

## Troubleshooting

### Duration Not Showing
- Check YouTube API key is valid
- Verify API quota not exceeded
- Check browser console for errors

### Seek Buttons Not Working
- Ensure YouTube IFrame API script loads
- Check player instance is created
- Verify no console errors
- Try refreshing the page

### Player Not Loading
- Check internet connection
- Verify video ID is valid
- Check YouTube API availability
- Clear browser cache

---

**Status:** ✅ Complete and Tested
**Date:** February 27, 2026
**Features:** Duration Display + Working Seek Buttons
