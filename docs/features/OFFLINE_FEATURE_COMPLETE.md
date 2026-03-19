# Save for Offline Feature - Complete Implementation

## Overview
Implemented a "Save for Offline" feature that allows users to bookmark songs for quick access. This is NOT actual file downloading, but a save/bookmark system.

---

## Database Schema

### New Table: `offline_songs`

```sql
CREATE TABLE offline_songs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);
```

**Relationships:**
- User → OfflineSong (one-to-many)
- Song → OfflineSong (one-to-many)
- Unique constraint: (user_id, song_id)

---

## Backend API

### Model (`backend/app/models.py`)

```python
class OfflineSong(Base):
    __tablename__ = "offline_songs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="offline_songs")
    song = relationship("Song", back_populates="offline_songs")
```

### Routes (`backend/app/routers/offline.py`)

#### 1. Save Song for Offline
```http
POST /offline/save/{youtube_video_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "youtube_video_id": "dQw4w9WgXcQ",
  "title": "Song Title",
  "thumbnail": "https://...",
  "channel": "Artist Name"
}
```

**Response (201 Created):**
```json
{
  "message": "Song saved for offline",
  "song": {
    "youtube_video_id": "dQw4w9WgXcQ",
    "title": "Song Title",
    "thumbnail": "https://...",
    "channel": "Artist Name"
  },
  "saved_at": "2026-02-27T10:30:00"
}
```

**Error (400 Bad Request):**
```json
{
  "detail": "Song already saved for offline"
}
```

#### 2. Get All Offline Songs
```http
GET /offline
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "offline_songs": [
    {
      "id": 1,
      "saved_at": "2026-02-27T10:30:00",
      "song": {
        "youtube_video_id": "dQw4w9WgXcQ",
        "title": "Song Title",
        "thumbnail": "https://...",
        "channel": "Artist Name"
      }
    }
  ],
  "total": 1
}
```

#### 3. Remove Song from Offline
```http
DELETE /offline/{youtube_video_id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Song removed from offline",
  "youtube_video_id": "dQw4w9WgXcQ"
}
```

**Error (404 Not Found):**
```json
{
  "detail": "Song not saved for offline"
}
```

#### 4. Check Offline Status
```http
GET /offline/check/{youtube_video_id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "is_saved": true,
  "saved_at": "2026-02-27T10:30:00"
}
```

---

## Frontend Implementation

### 1. Offline Page (`frontend/src/pages/Offline.jsx`)

**Features:**
- Displays all saved offline songs
- Shows save date for each song
- Play button to start playback
- Remove button to unsave
- Link to YouTube
- Empty state when no songs saved

**Key Functions:**
```javascript
fetchOfflineSongs()  // Load all offline songs
removeSong()         // Remove from offline
playSong()           // Play the song
downloadSong()       // Open in YouTube
```

### 2. Search Page Updates (`frontend/src/pages/Search.jsx`)

**New State:**
```javascript
const [offlineSongs, setOfflineSongs] = useState(new Set());
```

**New Functions:**
```javascript
loadOfflineStatus()  // Load which songs are saved
toggleOffline()      // Save/unsave for offline
```

**Updated Song Card:**
- Added offline button (📥)
- Button changes color when saved (green glow)
- Shows toast notification on save/unsave

### 3. Routing (`frontend/src/App.jsx`)

**New Route:**
```jsx
<Route path="/offline" element={<Offline onPlaySong={handlePlaySong} />} />
```

### 4. Sidebar (`frontend/src/components/Sidebar.jsx`)

**New Navigation Item:**
```jsx
<Link to="/offline" className={`nav-item ${isActive('/offline')}`}>
  <span className="nav-icon">📥</span>
  <span>Offline</span>
</Link>
```

---

## UI/UX Features

### Visual Indicators

1. **Offline Button States:**
   - Default: Purple with 📥 icon
   - Saved: Green glow with 📥 icon
   - Hover: Scale up with shadow

2. **Offline Badge:**
   - Green badge on saved songs
   - Shows 📥 icon
   - Positioned top-left on thumbnail

3. **Toast Notifications:**
   - "✅ Saved for offline!" (success)
   - "Removed from offline" (info)
   - "Failed to save" (error)

### CSS Classes

```css
.offline-btn              /* Offline save button */
.offline-btn.saved        /* When song is saved */
.offline-badge            /* Badge on thumbnails */
.saved-date               /* Date when saved */
.remove-btn               /* Remove from offline button */
```

---

## User Flow

### Saving a Song

1. User searches for a song
2. Clicks 📥 button on song card
3. Button glows green
4. Toast shows "✅ Saved for offline!"
5. Song appears in Offline page

### Viewing Offline Songs

1. User clicks "Offline" in sidebar
2. Sees list of all saved songs
3. Can play any song
4. Can remove songs
5. Shows save date for each

### Removing a Song

1. User clicks 🗑️ button
2. Confirmation dialog appears
3. Song removed from list
4. Toast shows "Removed from offline"

---

## Database Migration

To add the new table to existing database:

```python
# Run this script or recreate database
from backend.app.database import engine, Base
from backend.app.models import OfflineSong

# Create new table
Base.metadata.create_all(bind=engine)
```

**Or recreate database:**
```bash
cd backend
del music_sagar.db
python init_fresh_db.py
```

---

## API Usage Examples

### Using cURL

**Save Song:**
```bash
curl -X POST "http://localhost:8000/offline/save/dQw4w9WgXcQ" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_video_id": "dQw4w9WgXcQ",
    "title": "Song Title",
    "thumbnail": "https://...",
    "channel": "Artist"
  }'
```

**Get Offline Songs:**
```bash
curl -X GET "http://localhost:8000/offline" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Remove Song:**
```bash
curl -X DELETE "http://localhost:8000/offline/dQw4w9WgXcQ" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Axios (Frontend)

```javascript
// Save for offline
await api.post(`/offline/save/${videoId}`, {
  youtube_video_id: videoId,
  title: "Song Title",
  thumbnail: "https://...",
  channel: "Artist"
});

// Get offline songs
const response = await api.get('/offline');
const songs = response.data.offline_songs;

// Remove from offline
await api.delete(`/offline/${videoId}`);

// Check status
const status = await api.get(`/offline/check/${videoId}`);
console.log(status.data.is_saved);
```

---

## Features Summary

### ✅ Implemented

1. **Database Model** - OfflineSong table with relationships
2. **Backend Routes** - Save, get, delete, check status
3. **Offline Page** - View all saved songs
4. **Save Button** - On search results
5. **Visual Feedback** - Color changes, badges, toasts
6. **Sidebar Link** - Easy navigation
7. **Authentication** - User-specific saves
8. **Error Handling** - Graceful failures

### 🎨 UI Elements

- Offline button with state changes
- Green glow when saved
- Offline badge on thumbnails
- Save date display
- Remove button
- Empty state design
- Toast notifications

---

## Testing Checklist

- [ ] Save a song from search
- [ ] Verify button turns green
- [ ] Check Offline page shows song
- [ ] Play song from Offline page
- [ ] Remove song from Offline page
- [ ] Verify button returns to normal
- [ ] Test with multiple songs
- [ ] Test duplicate save (should show error)
- [ ] Test without authentication
- [ ] Test across different users

---

## Future Enhancements

### Possible Features

1. **Bulk Actions**
   - Save entire playlist
   - Remove all offline songs
   - Export/import offline list

2. **Sorting & Filtering**
   - Sort by date, title, artist
   - Filter by artist or genre
   - Search within offline songs

3. **Statistics**
   - Total offline songs
   - Most saved artists
   - Storage usage (if actual downloads)

4. **Sync**
   - Sync across devices
   - Cloud backup
   - Offline mode indicator

5. **Smart Features**
   - Auto-save liked songs
   - Suggest songs to save
   - Offline playlist creation

---

## Files Modified/Created

### Backend
1. `backend/app/models.py` - Added OfflineSong model
2. `backend/app/routers/offline.py` - NEW - Offline routes
3. `backend/app/main.py` - Registered offline router

### Frontend
1. `frontend/src/pages/Offline.jsx` - NEW - Offline page
2. `frontend/src/pages/Search.jsx` - Added offline button
3. `frontend/src/App.jsx` - Added offline route
4. `frontend/src/components/Sidebar.jsx` - Added offline link
5. `frontend/src/App.css` - Added offline styles

---

## Notes

- This is a **bookmark/save feature**, not actual file downloading
- Songs are saved as references in the database
- Playback still requires internet connection
- Each user has their own offline collection
- No storage limits (database only)

---

**Status:** ✅ Complete and Ready for Testing
**Date:** February 27, 2026
**Feature Type:** Bookmark/Save System
**Authentication:** Required (JWT)
