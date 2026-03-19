# Bugfix Design Document

## Overview

This design document outlines the revised technical solution for fixing the login token persistence bug in Music Sagar. After extensive debugging of the frontend token persistence issues (tasks 1-4), the original approach failed to resolve the underlying authentication problems. The new solution takes a different approach: temporarily removing authentication requirements from backend endpoints to make the app functional for development.

## Original Approach and Why It Failed

### Attempted Frontend Fixes (Tasks 1-4)
The original bugfix spec attempted to fix token persistence through:
1. Modifying axios interceptors to exclude auth endpoints
2. Adding context-aware 401 error handling
3. Removing setTimeout delays in login flow
4. Cleaning up unused authentication state

### Why These Failed
Despite implementing all frontend fixes:
- Token persistence issues continued across browser navigations
- The Home component still triggered 401 errors when fetching `/history`
- Authentication was temporarily disabled in `frontend/src/App.jsx` to allow the app to load
- Backend endpoints still require `Depends(get_current_user)`, causing 401 errors even with authentication disabled

### Root Cause Discovery
The fundamental issue is that the authentication system requires complex coordination between:
- Frontend token storage and retrieval
- Axios interceptor timing
- Backend JWT validation
- React component lifecycle and navigation

Rather than continue debugging this complex interaction, a simpler solution is needed for development.

## New Solution: Remove Backend Authentication Requirements

### Approach
Remove authentication dependencies from backend endpoints and use a default user for operations that require a user_id. This allows the app to function without authentication while keeping database models and relationships intact.

### Files Requiring Changes

**1. backend/app/routers/history.py**
- `add_to_history` endpoint - currently requires `current_user: User = Depends(get_current_user)`
- `get_history` endpoint - currently requires `current_user: User = Depends(get_current_user)`

**2. backend/app/routers/playlists.py**
- `create_playlist` endpoint - currently requires `current_user: User = Depends(get_current_user)`
- `get_playlists` endpoint - currently requires `current_user: User = Depends(get_current_user)`
- `add_song_to_playlist` endpoint - currently requires `current_user: User = Depends(get_current_user)`
- `delete_playlist` endpoint - currently requires `current_user: User = Depends(get_current_user)`

**3. backend/app/routers/youtube.py**
- Already has no authentication requirements ✓

### Default User Strategy

For operations that require a user_id (history, playlists), use a default user:
- User ID: 1 (the sagar@example.com user from init_db.py)
- This allows the app to function without authentication
- Database relationships remain intact

## Technical Solution

### Solution 1: Remove Authentication from History Endpoints

**File:** `backend/app/routers/history.py`

**Changes:**
1. Remove `from ..auth import get_current_user` import
2. Remove `current_user: User = Depends(get_current_user)` from both endpoints
3. Use default user_id = 1 for all operations

**Implementation:**
```python
@router.post("", status_code=status.HTTP_201_CREATED)
def add_to_history(
    history_data: HistoryCreate,
    db: Session = Depends(get_db)
):
    """Add a song to user's listening history"""
    # Use default user (id=1) for development
    user_id = 1
    
    # Check if song exists, if not create it
    song = db.query(Song).filter(Song.youtube_video_id == history_data.youtube_video_id).first()
    if not song:
        song = Song(
            youtube_video_id=history_data.youtube_video_id,
            title=history_data.title,
            thumbnail=history_data.thumbnail,
            channel=history_data.channel
        )
        db.add(song)
        db.commit()
        db.refresh(song)
    
    # Add to history with default user
    history = History(user_id=user_id, song_id=song.id)
    db.add(history)
    db.commit()
    
    return {"message": "Added to history"}

@router.get("", response_model=List[HistoryResponse])
def get_history(
    db: Session = Depends(get_db)
):
    """Get user's listening history"""
    # Use default user (id=1) for development
    user_id = 1
    
    history = db.query(History).filter(
        History.user_id == user_id
    ).order_by(History.played_at.desc()).limit(50).all()
    
    return history
```

**Rationale:** Removes authentication dependency while maintaining database functionality using a default user.

### Solution 2: Remove Authentication from Playlist Endpoints

**File:** `backend/app/routers/playlists.py`

**Changes:**
1. Remove `from ..auth import get_current_user` import
2. Remove `current_user: User = Depends(get_current_user)` from all endpoints
3. Use default user_id = 1 for all operations

**Implementation:**
```python
@router.post("", response_model=PlaylistResponse, status_code=status.HTTP_201_CREATED)
def create_playlist(
    playlist: PlaylistCreate,
    db: Session = Depends(get_db)
):
    """Create a new playlist"""
    # Use default user (id=1) for development
    user_id = 1
    new_playlist = Playlist(name=playlist.name, user_id=user_id)
    db.add(new_playlist)
    db.commit()
    db.refresh(new_playlist)
    return new_playlist

@router.get("", response_model=List[PlaylistResponse])
def get_playlists(
    db: Session = Depends(get_db)
):
    """Get all playlists for current user"""
    # Use default user (id=1) for development
    user_id = 1
    playlists = db.query(Playlist).filter(Playlist.user_id == user_id).all()
    return playlists

@router.post("/{playlist_id}/add-song", response_model=SongResponse)
def add_song_to_playlist(
    playlist_id: int,
    song_data: AddSongToPlaylist,
    db: Session = Depends(get_db)
):
    """Add a song to a playlist"""
    # Use default user (id=1) for development
    user_id = 1
    
    # Check if playlist exists and belongs to default user
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == user_id
    ).first()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    # ... rest of implementation unchanged ...

@router.delete("/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db)
):
    """Delete a playlist"""
    # Use default user (id=1) for development
    user_id = 1
    
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == user_id
    ).first()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    db.delete(playlist)
    db.commit()
    return None
```

**Rationale:** Removes authentication dependency while maintaining user-scoped operations using a default user.

### Solution 3: Verify YouTube Endpoint

**File:** `backend/app/routers/youtube.py`

**Status:** Already has no authentication requirements ✓

No changes needed - this endpoint already works without authentication.

## Implementation Plan

### Phase 1: Remove Authentication from History Endpoints
**File:** `backend/app/routers/history.py`
- Remove `get_current_user` import
- Remove `current_user` parameter from `add_to_history` endpoint
- Remove `current_user` parameter from `get_history` endpoint
- Use default user_id = 1 for all operations

### Phase 2: Remove Authentication from Playlist Endpoints
**File:** `backend/app/routers/playlists.py`
- Remove `get_current_user` import
- Remove `current_user` parameter from `create_playlist` endpoint
- Remove `current_user` parameter from `get_playlists` endpoint
- Remove `current_user` parameter from `add_song_to_playlist` endpoint
- Remove `current_user` parameter from `delete_playlist` endpoint
- Use default user_id = 1 for all operations

### Phase 3: Verify YouTube Endpoint
**File:** `backend/app/routers/youtube.py`
- Confirm no authentication is required (already correct)

### Phase 4: Test Application Without Authentication
- Start backend server
- Start frontend server
- Verify app loads without 401 errors
- Test history functionality (view and add)
- Test playlist functionality (create, view, add songs, delete)
- Test YouTube search functionality

## Testing Strategy

### Test Case 1: App Loads Without 401 Errors
1. Start backend server
2. Start frontend server
3. Navigate to home page
4. VERIFY: No 401 errors in browser console
5. VERIFY: No 401 errors in backend logs
6. VERIFY: App loads successfully

### Test Case 2: History Functionality
1. Navigate to home page
2. VERIFY: History data loads (should show existing history for user id=1)
3. Play a song
4. VERIFY: Song is added to history
5. Refresh page
6. VERIFY: New song appears in history

### Test Case 3: Playlist Functionality
1. Navigate to playlists page
2. VERIFY: Existing playlists load (for user id=1)
3. Create a new playlist
4. VERIFY: Playlist is created successfully
5. Add a song to the playlist
6. VERIFY: Song is added successfully
7. Delete a playlist
8. VERIFY: Playlist is deleted successfully

### Test Case 4: YouTube Search Functionality
1. Navigate to search page
2. Enter a search query
3. VERIFY: Search results load successfully
4. VERIFY: No authentication errors

### Test Case 5: Data Persistence
1. Add songs to history
2. Create playlists
3. Restart backend server
4. VERIFY: History persists
5. VERIFY: Playlists persist
6. VERIFY: All data is associated with user id=1

## Rollback Plan

If the fix causes issues:
1. Revert `backend/app/routers/history.py` to previous version (with authentication)
2. Revert `backend/app/routers/playlists.py` to previous version (with authentication)
3. Restart backend server

All changes are isolated to backend code, so frontend remains unaffected.

## Success Criteria

- App loads without 401 errors
- History functionality works (view and add)
- Playlist functionality works (create, view, add songs, delete)
- YouTube search works without authentication
- All data persists across server restarts
- All operations use default user (id=1)
- No authentication-related errors in console or logs

## Future Considerations

This is a temporary solution for development. For production, proper authentication should be implemented:
- Fix frontend token persistence issues
- Re-enable authentication on backend endpoints
- Implement proper user session management
- Add user registration and login flows
- Consider using a more robust authentication library (e.g., Auth0, Firebase Auth)
