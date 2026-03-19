"""
Offline Songs Router
Handles saving songs for offline access (bookmarking feature)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from ..database import get_db
from ..models import OfflineSong, Song, User
from ..auth import get_current_user
from ..schemas import HistoryCreate

router = APIRouter(prefix="/offline", tags=["Offline"])


@router.post("/save/{youtube_video_id}", status_code=status.HTTP_201_CREATED)
async def save_song_offline(
    youtube_video_id: str,
    song_data: HistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save a song for offline access
    
    Args:
        youtube_video_id: YouTube video ID
        song_data: Song information (title, thumbnail, channel)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Success message with saved song info
    """
    # Check if song exists, if not create it
    song = db.query(Song).filter(Song.youtube_video_id == youtube_video_id).first()
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
    
    # Check if already saved
    existing = db.query(OfflineSong).filter(
        OfflineSong.user_id == current_user.id,
        OfflineSong.song_id == song.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song already saved for offline"
        )
    
    # Save for offline
    offline_song = OfflineSong(
        user_id=current_user.id,
        song_id=song.id
    )
    db.add(offline_song)
    db.commit()
    db.refresh(offline_song)
    
    return {
        "message": "Song saved for offline",
        "song": {
            "youtube_video_id": song.youtube_video_id,
            "title": song.title,
            "thumbnail": song.thumbnail,
            "channel": song.channel
        },
        "saved_at": offline_song.saved_at
    }


@router.get("")
async def get_offline_songs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all songs saved for offline by current user
    
    Args:
        current_user: Authenticated user
        db: Database session
    
    Returns:
        List of offline songs with metadata
    """
    offline_songs = db.query(OfflineSong, Song).join(
        Song, OfflineSong.song_id == Song.id
    ).filter(
        OfflineSong.user_id == current_user.id
    ).order_by(
        desc(OfflineSong.saved_at)
    ).all()
    
    result = []
    for offline_song, song in offline_songs:
        result.append({
            "id": offline_song.id,
            "saved_at": offline_song.saved_at,
            "song": {
                "youtube_video_id": song.youtube_video_id,
                "title": song.title,
                "thumbnail": song.thumbnail,
                "channel": song.channel
            }
        })
    
    return {
        "offline_songs": result,
        "total": len(result)
    }


@router.delete("/{youtube_video_id}", status_code=status.HTTP_200_OK)
async def remove_offline_song(
    youtube_video_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a song from offline saved songs
    
    Args:
        youtube_video_id: YouTube video ID
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Success message
    """
    # Find the song
    song = db.query(Song).filter(Song.youtube_video_id == youtube_video_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Find and delete offline entry
    offline_song = db.query(OfflineSong).filter(
        OfflineSong.user_id == current_user.id,
        OfflineSong.song_id == song.id
    ).first()
    
    if not offline_song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not saved for offline"
        )
    
    db.delete(offline_song)
    db.commit()
    
    return {
        "message": "Song removed from offline",
        "youtube_video_id": youtube_video_id
    }


@router.get("/check/{youtube_video_id}")
async def check_offline_status(
    youtube_video_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if a song is saved for offline
    
    Args:
        youtube_video_id: YouTube video ID
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Boolean indicating if song is saved
    """
    song = db.query(Song).filter(Song.youtube_video_id == youtube_video_id).first()
    
    if not song:
        return {"is_saved": False}
    
    offline_song = db.query(OfflineSong).filter(
        OfflineSong.user_id == current_user.id,
        OfflineSong.song_id == song.id
    ).first()
    
    return {
        "is_saved": offline_song is not None,
        "saved_at": offline_song.saved_at if offline_song else None
    }
