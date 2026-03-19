from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Playlist, Song, PlaylistSong, User
from ..schemas import PlaylistCreate, PlaylistResponse, AddSongToPlaylist, SongResponse
from ..auth import get_current_user

router = APIRouter(prefix="/playlists", tags=["Playlists"])

@router.post("", response_model=PlaylistResponse, status_code=status.HTTP_201_CREATED)
def create_playlist(
    playlist: PlaylistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new playlist"""
    new_playlist = Playlist(name=playlist.name, user_id=current_user.id)
    db.add(new_playlist)
    db.commit()
    db.refresh(new_playlist)
    return new_playlist

@router.get("", response_model=List[PlaylistResponse])
def get_playlists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all playlists for current user"""
    playlists = db.query(Playlist).filter(Playlist.user_id == current_user.id).all()
    return playlists

@router.get("/{playlist_id}/songs")
def get_playlist_songs(
    playlist_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all songs in a playlist"""
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == current_user.id
    ).first()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    # Get all songs in the playlist
    playlist_songs = db.query(Song).join(
        PlaylistSong, Song.id == PlaylistSong.song_id
    ).filter(
        PlaylistSong.playlist_id == playlist_id
    ).all()
    
    return {
        "playlist": {
            "id": playlist.id,
            "name": playlist.name
        },
        "songs": [
            {
                "youtube_video_id": song.youtube_video_id,
                "title": song.title,
                "thumbnail": song.thumbnail,
                "channel": song.channel
            }
            for song in playlist_songs
        ]
    }

@router.post("/{playlist_id}/add-song", response_model=SongResponse)
def add_song_to_playlist(
    playlist_id: int,
    song_data: AddSongToPlaylist,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a song to a playlist"""
    # Check if playlist exists and belongs to user
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == current_user.id
    ).first()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    # Check if song exists, if not create it
    song = db.query(Song).filter(Song.youtube_video_id == song_data.youtube_video_id).first()
    if not song:
        song = Song(
            youtube_video_id=song_data.youtube_video_id,
            title=song_data.title,
            thumbnail=song_data.thumbnail,
            channel=song_data.channel
        )
        db.add(song)
        db.commit()
        db.refresh(song)
    
    # Check if song already in playlist
    existing = db.query(PlaylistSong).filter(
        PlaylistSong.playlist_id == playlist_id,
        PlaylistSong.song_id == song.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song already in playlist"
        )
    
    # Add song to playlist
    playlist_song = PlaylistSong(playlist_id=playlist_id, song_id=song.id)
    db.add(playlist_song)
    db.commit()
    
    return song

@router.delete("/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_playlist(
    playlist_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a playlist"""
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == current_user.id
    ).first()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    db.delete(playlist)
    db.commit()
    return None

@router.put("/{playlist_id}", response_model=PlaylistResponse)
def rename_playlist(
    playlist_id: int,
    playlist: PlaylistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Rename a playlist"""
    db_playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == current_user.id
    ).first()
    
    if not db_playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    db_playlist.name = playlist.name
    db.commit()
    db.refresh(db_playlist)
    
    return db_playlist
