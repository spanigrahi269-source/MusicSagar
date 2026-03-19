from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Song, History, User
from ..schemas import HistoryCreate, HistoryResponse
from ..auth import get_current_user

router = APIRouter(prefix="/history", tags=["History"])

@router.post("", status_code=status.HTTP_201_CREATED)
def add_to_history(
    history_data: HistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a song to user's listening history"""
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
    
    # Add to history
    history = History(user_id=current_user.id, song_id=song.id)
    db.add(history)
    db.commit()
    
    return {"message": "Added to history"}

@router.get("", response_model=List[HistoryResponse])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's listening history"""
    history = db.query(History).filter(
        History.user_id == current_user.id
    ).order_by(History.played_at.desc()).limit(50).all()
    
    return history

@router.delete("")
def clear_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear user's entire listening history"""
    try:
        deleted_count = db.query(History).filter(
            History.user_id == current_user.id
        ).delete()
        db.commit()
        
        return {
            "message": "History cleared successfully",
            "deleted_count": deleted_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear history: {str(e)}"
        )
