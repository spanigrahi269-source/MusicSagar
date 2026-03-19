# Offline Download Feature - Implementation Guide ✅

## Overview
Added offline download functionality that allows users to download songs as MP3 files for offline playback.

## Features

### 💾 Offline Download Button
- **New button** alongside existing YouTube download button
- **Icon**: 💾 (floppy disk) - changes to ⏳ (hourglass) while downloading
- **Green theme** to distinguish from YouTube download (purple)
- **Download state tracking** - prevents duplicate downloads
- **Automatic file naming** - uses song title for downloaded file

### Download Process
1. User clicks offline download button (💾)
2. Button shows loading state (⏳) with pulse animation
3. Backend downloads audio from YouTube using yt-dlp
4. Audio is converted to MP3 format (192kbps)
5. File is sent to browser and automatically saved
6. Button returns to normal state

## Technical Implementation

### Backend

#### New Files:
1. **backend/app/routers/downloads.py**
   - `/downloads/song/{video_id}` - Download song as MP3
   - `/downloads/info/{video_id}` - Get download info
   - Uses yt-dlp for YouTube audio extraction
   - Converts to MP3 using FFmpeg
   - Caches downloaded files in `downloads/` directory

#### Dependencies Added:
- **yt-dlp** - YouTube audio downloader
- Requires **FFmpeg** to be installed on system

#### File Structure:
```
backend/
  downloads/          # Downloaded MP3 files (cached)
    {video_id}.mp3
  app/
    routers/
      downloads.py    # New download router
```

### Frontend

#### Modified Files:
1. **frontend/src/pages/Home.jsx**
   - Added `downloadingIds` state to track active downloads
   - Added `downloadOffline()` function
   - Added offline download buttons to all song cards
   - Shows loading state during download

2. **frontend/src/App.css**
   - Added `.download-offline-btn` styles
   - Added `.downloading` animation (pulse effect)
   - Added light theme support
   - Green color scheme for offline downloads

#### Download Function:
```javascript
const downloadOffline = async (song, e) => {
  // Prevents duplicate downloads
  // Calls backend API
  // Creates blob and triggers browser download
  // Updates UI state
}
```

## Installation Requirements

### System Requirements:
1. **FFmpeg** must be installed on the system
   - Windows: Download from https://ffmpeg.org/download.html
   - Add to system PATH
   - Or use: `choco install ffmpeg` (with Chocolatey)

2. **Python packages**:
   ```bash
   pip install yt-dlp
   ```

### Setup Steps:

1. **Install FFmpeg** (if not already installed):
   ```bash
   # Windows (with Chocolatey)
   choco install ffmpeg
   
   # Or download manually and add to PATH
   ```

2. **Update Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Restart backend server**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --port 8000
   ```

## Usage

### For Users:
1. Hover over any song card
2. Two download buttons appear:
   - 📥 (Purple) - Opens in YouTube
   - 💾 (Green) - Downloads for offline
3. Click 💾 button
4. Wait for download (button shows ⏳)
5. File automatically saves to Downloads folder

### Button States:
- **Normal**: 💾 (Green, ready to download)
- **Downloading**: ⏳ (Pulsing animation)
- **Disabled**: Grayed out (during download)

## Features by Page

### ✅ Home Page
- Recommendations section - offline download available
- Recently Played section - offline download available

### 🔄 Other Pages (To Be Added)
To add offline download to other pages, follow this pattern:

1. Add `downloadingIds` state
2. Add `downloadOffline()` function
3. Add offline download button to song cards
4. Use same styling and state management

**Pages to update:**
- Search page
- History page
- Trending page
- Playlist Detail page

## API Endpoints

### GET /downloads/song/{video_id}
Downloads a song as MP3 file.

**Response**: MP3 file (audio/mpeg)

**Process**:
1. Check if file exists in cache
2. If not, download from YouTube
3. Convert to MP3 (192kbps)
4. Return file

### GET /downloads/info/{video_id}
Get information about a downloadable song.

**Response**:
```json
{
  "video_id": "string",
  "available": boolean,
  "file_size": number
}
```

## File Caching

Downloaded files are cached in `backend/downloads/` directory:
- Reduces repeated downloads
- Faster subsequent requests
- Files named by video_id: `{video_id}.mp3`

**Note**: Cache directory grows over time. Consider implementing cleanup strategy.

## Error Handling

### Backend:
- Invalid video_id → 500 error
- Download failure → 500 error with message
- FFmpeg not found → Download fails

### Frontend:
- Network error → Alert shown to user
- Download in progress → Button disabled
- Duplicate download → Prevented by state check

## Styling

### Offline Download Button:
```css
- Background: rgba(29, 185, 84, 0.2) (green)
- Border: rgba(29, 185, 84, 0.4)
- Hover: Brighter green with glow
- Disabled: 50% opacity
- Downloading: Pulse animation
```

### Light Theme:
- Swapped colors with YouTube download button
- Maintains green theme for offline
- Proper contrast maintained

## Performance Considerations

1. **First Download**: Slower (downloads from YouTube)
2. **Cached Downloads**: Fast (serves from disk)
3. **Concurrent Downloads**: Handled independently
4. **File Size**: ~3-5MB per song (192kbps MP3)

## Security Notes

- Downloads are server-side (not client-side)
- No direct YouTube API key exposure
- Files cached on server (consider disk space)
- No authentication required (matches app design)

## Future Enhancements

1. **Progress indicator** - Show download percentage
2. **Batch download** - Download multiple songs
3. **Quality selection** - Choose audio quality
4. **Cache management** - Auto-cleanup old files
5. **Download history** - Track downloaded songs
6. **Offline library** - View all downloaded songs

## Troubleshooting

### "Failed to download" error:
- Check FFmpeg is installed and in PATH
- Check internet connection
- Check YouTube video is available
- Check disk space

### Slow downloads:
- First download is always slower
- Subsequent downloads use cache
- Network speed affects download time

### Button stuck in loading state:
- Refresh page
- Check browser console for errors
- Check backend logs

---

**Status**: ✅ Implemented on Home page
**Next Steps**: Add to remaining pages (Search, History, Trending, Playlist Detail)
**Requirements**: FFmpeg must be installed on system
